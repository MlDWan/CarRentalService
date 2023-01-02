import { Module } from '@nestjs/common';
import { PgConnection, NestPgPool } from 'nest-pg';
import { OnModuleInit } from '@nestjs/common';
import { faker } from '@faker-js/faker';

interface carAR {
  id: string;
  carbrand: string;
  statenumber: number;
}

function createRandomCar(): carAR {
  return {
    id: faker.datatype.uuid(),
    carbrand: faker.vehicle.manufacturer(),
    statenumber: faker.datatype.number({ min: 100, max: 999 }),
  };
}

const res = [];
for (let index = 0; index < 10; index++) {
  res.push(createRandomCar());
}

const createArrayCars = (array) => {
  const result = array.map((element) => {
    return `('${element.id}', '${element.carbrand}', ${element.statenumber} )`;
  });

  return result;
};

try {
} catch (error) {}
@Module({})
export class CreateDatabaseModule implements OnModuleInit {
  constructor(@PgConnection() private readonly db: NestPgPool) {}
  async onModuleInit() {
    await this.creatingTables();
    await this.fillingTable();
  }
  async creatingTables() {
    try {
      await this.db.query(
        `
      CREATE TABLE IF NOT EXISTS carsforrent (
          id BIGSERIAL PRIMARY KEY,
          carid string,
          userid string,
          startOfLease date,
          endOfLease date
      );
      CREATE TABLE IF NOT EXISTS car (
        id character (50) PRIMARY KEY,
        carbrand character (25),
        statenumber integer
    );
  `,
      );
    } catch (error) {
      console.log(error);
    }
    console.log('Table created');
  }

  async fillingTable() {
    try {
      await this.db.query(
        `
            INSERT INTO car
            VALUES
            ${createArrayCars(res)}
          `,
      );
    } catch (error) {
      console.log(error);
    }
  }
}
