import { Module } from "@nestjs/common";
import { ImageService } from "./image.service";
import { ImageController } from "./image.controller";
import { PrismaService } from "../../prisma/prisma.service";
import { UploadGateway } from "../upload/upload.gateway";
import { CloudStorageService } from "../CloudStorage/cloudstorage.service";
import { CloudStorageModule } from "../CloudStorage/cloudStorage.module";

@Module({
  imports: [CloudStorageModule],
  controllers: [ImageController],
  providers: [ImageService, PrismaService, UploadGateway],
})
export class ImageModule {}
