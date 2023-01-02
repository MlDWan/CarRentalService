import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform {
  transform(value: string) {
    const date = this.convertStringToDate(value);

    if (date === 'Error') {
      throw new BadRequestException('Invalid date');
    }

    return date;
  }

  private convertStringToDate(date: string) {
    const newDate = new Date(date);

    return newDate ? date : 'Error';
  }
}
