import { Injectable } from "@nestjs/common";
import { StorageProviderInterface } from "../CloudStorage/storage-provider.interface";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

@Injectable()
export class CloudinaryStorageService implements StorageProviderInterface {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async upload(fileBuffer: Buffer, fileName: string): Promise<string> {
    const uploadStream = (): Promise<string> => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "gallery_app",
            public_id: fileName,
          },
          (error, result) => {
            if (error || !result) return reject(error || new Error("Upload failed with no result"));
            resolve(result.secure_url);
          }
        );

        const readable = new Readable();
        readable.push(fileBuffer);
        readable.push(null);
        readable.pipe(stream);
      });
    };

    return uploadStream();
  }
}
