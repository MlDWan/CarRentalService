import { Module } from '@nestjs/common';
import { CarRentController } from './car-rent.controller';
import { CarRentService } from './car-rent.service';

@Module({
  controllers: [CarRentController],
  providers: [CarRentService],
})
export class CarRentModule {}
