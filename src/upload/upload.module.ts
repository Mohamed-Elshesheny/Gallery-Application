import { Module } from '@nestjs/common';
import { UploadGateway } from './upload.gateway';

@Module({
  providers: [UploadGateway],
  exports: [UploadGateway]
})
export class UploadModule {}