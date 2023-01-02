import { Module } from '@nestjs/common';
import { ReadFileController } from './import_export_file.controller';
import { DataImportExportService } from './import_export_file.service';

@Module({
  controllers: [ReadFileController],
  providers: [DataImportExportService],
})
export class ReadFileModule {}
