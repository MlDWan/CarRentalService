import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { NestPgPool, PgConnection } from 'nest-pg';
import { CarRentDto } from '../dtos/carRentDto';

const convertDataToString = (a) => {
  const year = a.toLocaleString('default', {
    year: 'numeric',
  });
  const month = a.toLocaleString('default', {
    month: '2-digit',
  });
  const day = a.toLocaleString('default', { day: '2-digit' });
  const result = year + '-' + month + '-' + day;
  return result;
};

@Injectable()
export class CarRentService {
  constructor(@PgConnection() private readonly db: NestPgPool) {}

  async getListBookedCars() {
    try {
      const list = await this.db.rows(
        `
          SELECT *,
              (SELECT
                "endOfLease" - "startOfLease" as rentPeriod
              )
          FROM carsforrent
          `,
      );
      return list;
    } catch (error) {
      return error;
    }
  }

  async addBooking(rentalData: CarRentDto) {
    const { carId, endOfLease, startOfLease, userId } = rentalData;
    const dataStart: Date = new Date(startOfLease);
    const dataEnd: Date = new Date(endOfLease);
    let dat = Math.abs(dataEnd.getTime() - dataStart.getTime());
    dat = Math.ceil(dat / 86400000);
    try {
      if (
        dataEnd.getDay() === 6 ||
        dataEnd.getDay() === 0 ||
        dataStart.getDay() === 6 ||
        dataStart.getDay() === 0
      ) {
        throw new HttpException(
          'The start and end dates of the booking must not be weekends',
          HttpStatus.BAD_REQUEST,
        );
      }

      const carStatus = await this.db.rows(
        `
          SELECT *
          FROM carsforrent
          WHERE "carid" = '${carId}' AND
          '${startOfLease}' - "endOfLease"  <= 3 
      `,
      );

      if (
        !carStatus.length &&
        new Date().setHours(0) <= dataStart.getTime() &&
        dataStart <= dataEnd &&
        carId &&
        userId &&
        dat < 31
      ) {
        await this.db.query(
          `
            INSERT INTO carsforrent ("carid","endOfLease","startOfLease","userId") 
            VALUES ('${carId}', '${dataEnd.toISOString()}', '${dataStart.toISOString()}', '${userId}' )    
          `,
        );

        return 'The car is booked';
      } else {
        throw new HttpException('Incorrect data', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      return error;
    }
  }

  async carsBookingReport(month: number, carid?: string) {
    interface element {
      statenumber: number;
      percentageCarLoadPerMonth: number;
    }

    try {
      const year = new Date().getFullYear();
      const beginningMonth = new Date(year, month - 1, 2)
        .toISOString()
        .slice(0, 10);
      const endMonth = new Date(year, month, 1).toISOString().slice(0, 10);

      const result = await this.db.rows(
        `
          SELECT "statenumber",
          (
            CASE WHEN  '${endMonth}' >= "endOfLease"  THEN
              (
                -("endOfLease"  - "startOfLease"  + 1) * 100 / (${endMonth} - ${beginningMonth})
              )    
                  WHEN '${endMonth}' <= "startOfLease" THEN
              (
                -('${endMonth}'- "startOfLease" + 1 ) * 100 / (${endMonth} - ${beginningMonth})
              )    
            END
          ) AS "percentageCarLoadPerMonth"
          FROM carsforrent 
          JOIN car ON "carid" = car."id"
          WHERE '${beginningMonth}' <= "startOfLease"
          AND "startOfLease" <= '${endMonth}'
          ${carid ? `AND "carid" = '${carid}'` : ''}
        `,
      );

      const allCarReport = result.reduce((acc, curr: element) => {
        if (acc[curr.statenumber]) {
          acc[curr.statenumber] += curr.percentageCarLoadPerMonth;
        } else {
          acc[curr.statenumber] = curr.percentageCarLoadPerMonth;
        }

        return acc;
      });

      return allCarReport;
    } catch (error) {
      return error;
    }
  }

  async calculateCostRent(rentalStart: Date, endLease: Date) {
    const start = rentalStart.getTime();
    const end = endLease.getTime();
    const tern = Math.round((end - start) / 86400000) + 1;

    try {
      if (tern === 0) {
        throw new HttpException('Invalid date', HttpStatus.BAD_REQUEST);
      }

      if (tern <= 4) {
        return tern * 1000;
      }

      if (tern > 4 && tern <= 9) {
        return 4000 + (tern - 4) * 950;
      }

      if (tern > 9 && tern <= 17) {
        return 8750 + (tern - 9) * 900;
      }

      if (tern > 17 && tern <= 29) {
        return 15950 + (tern - 17) * 850;
      }

      if (tern > 30) {
        throw new HttpException(
          'Rental cannot be longer than 30 days',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      return error;
    }
  }

  async getCarStatus(startOfLease: Date, endLease: Date) {
    try {
      if (endLease.getTime() - startOfLease.getTime() < 0) {
        throw new HttpException('Incorrect date', HttpStatus.BAD_GATEWAY);
      }

      const freeCars = await this.db.rows(`
      SELECT "statenumber"
      FROM car 
      Where "id" Not In(
        SELECT "carid"
        FROM carsforrent
        Where 
        "startOfLease" <= '${convertDataToString(startOfLease)}'
      AND "endOfLease" >= '${convertDataToString(endLease)}'
      )
      
      `);

      return freeCars;
    } catch (error) {
      return error;
    }
  }
}
