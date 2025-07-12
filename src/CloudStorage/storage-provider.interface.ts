export interface StorageProviderInterface {
  upload(fileBuffer: Buffer, fileName: string): Promise<string>;
}
