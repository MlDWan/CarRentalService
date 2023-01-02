import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CarRentService } from './car-rent.service';
import { CarRentDto } from '../dtos/carRentDto';
import { ParseDatePipe } from '../parse-date.pipe';
@Controller('car-rent')
export class CarRentController {
  constructor(private carRentService: CarRentService) {}

  @Get()
  async getListCars(): Promise<CarRentDto[]> {
    const result = await this.carRentService.getListBookedCars();

    return result;
  }

  @Post()
  async addBooking(@Body() rentalData: CarRentDto) {
    const result = await this.carRentService.addBooking(rentalData);

    return result;
  }

  @Get('report/:month')
  async getAllCarReport(
    @Param('month', ParseIntPipe)
    month: number,
    @Query('carid')
    carid: string,
  ) {
    const report = await this.carRentService.carsBookingReport(month, carid);

    return report;
  }

  @Get('rental-price/:rentalStart/:endLease')
  async getCarRepot(
    @Param('rentalStart', ParseDatePipe) rentalStart: Date,
    @Param('endLease', ParseDatePipe) endLease: Date,
  ): Promise<number> {
    const price = await this.carRentService.calculateCostRent(
      rentalStart,
      endLease,
    );

    return price;
  }

  @Get('car-status/:startOfLease/:endLease')
  async getCarStatus(
    @Param('startOfLease', ParseDatePipe) startOfLease: Date,
    @Param('endLease', ParseDatePipe) endLease: Date,
  ) {
    const statusCar = await this.carRentService.getCarStatus(
      startOfLease,
      endLease,
    );

    return statusCar;
  }
}
