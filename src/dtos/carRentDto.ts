import { IsString, IsNotEmpty, IsISO8601 } from 'class-validator';

export class CarRentDto {
  @IsString()
  @IsNotEmpty()
  readonly carId: string;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsISO8601()
  @IsNotEmpty()
  readonly startOfLease: Date;

  @IsISO8601()
  @IsNotEmpty()
  readonly endOfLease: Date;
}
