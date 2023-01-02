import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestPgModule } from 'nest-pg';
import { CarRentModule } from './car-rent/car-rent.module';
import { ReadFileModule } from './data_import_export/import_export_file.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    NestPgModule.register({
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DATABASE,
      password: process.env.POSTGRES_PASSWORD,
    }),
    // CreateDatabaseModule,
    CarRentModule,
    ReadFileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
