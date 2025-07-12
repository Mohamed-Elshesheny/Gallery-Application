import { StorageProviderInterface } from "../CloudStorage/storage-provider.interface";
import { Module } from "@nestjs/common";
import { CloudinaryStorageService } from "./CloudinaryStorageService";
import { CloudStorageService } from "./cloudstorage.service";

@Module({
  providers: [
    {
      provide: "StorageProviderInterface",
      useClass: CloudinaryStorageService,
    },
    {
      provide: CloudStorageService,
      useFactory: (provider: StorageProviderInterface) =>
        new CloudStorageService(provider),
      inject: ["StorageProviderInterface"],
    },
  ],
  exports: [CloudStorageService],
})
export class CloudStorageModule {}
