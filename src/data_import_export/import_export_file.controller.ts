import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { DataImportExportService } from './import_export_file.service';

@Controller('import-export')
export class ReadFileController {
  constructor(private dataImportExportService: DataImportExportService) {}
  @MessagePattern('import-data')
  async importData(@Payload() data: string[], @Ctx() context: RmqContext) {
    const channel = await context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);

    await this.dataImportExportService.getFile(data);
  }

  @MessagePattern('export-data')
  async exportData(@Payload() data: string[], @Ctx() context: RmqContext) {
    const channel = await context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}
