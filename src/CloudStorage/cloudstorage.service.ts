import { Injectable } from "@nestjs/common";
import { StorageProviderInterface } from "../CloudStorage/storage-provider.interface";

@Injectable()
export class CloudStorageService implements StorageProviderInterface {
  constructor(private readonly provider: StorageProviderInterface) {}

  upload(fileBuffer: Buffer, fileName: string): Promise<string> {
    return this.provider.upload(fileBuffer, fileName);
  }
}
