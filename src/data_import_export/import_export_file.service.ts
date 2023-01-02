import { Injectable } from '@nestjs/common';
import { PgConnection, NestPgPool } from 'nest-pg';

@Injectable()
export class DataImportExportService {
  constructor(@PgConnection() private readonly db: NestPgPool) {}

  async getFile(array) {
    await this.db.query(
      `
                INSERT INTO car
                VALUES
                ${array.length ? array : ''};
              `,
    );
  }
}
