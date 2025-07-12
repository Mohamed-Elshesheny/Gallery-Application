import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { ImageService } from "./image.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuid } from "uuid";
import * as path from "path";

@Controller("images")
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post("upload")
  @UseInterceptors(
    FilesInterceptor("images", 10, {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const filename = `${uuid()}${ext}`;
          cb(null, filename);
        },
      }),
    })
  )
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const session = await this.imageService.createUploadSession();

    for (const file of files) {
      await new Promise((res) => setTimeout(res, 1000)); // simulate delay
      await this.imageService.addImage(session.id, file);
    }

    return { message: "Images uploaded successfully!" };
  }

  @Get()
  async getImages(
    @Query("cursor") cursor?: string,
    @Query("limit") limit = 10,
    @Query("filter") filter?: string,
    @Query("sortBy") sortBy: "uploadedAt" | "fileName" = "uploadedAt",
    @Query("sortOrder") sortOrder: "asc" | "desc" = "asc"
  ) {
    const data = await this.imageService.getImages({
      cursor,
      limit,
      filter,
      sortBy,
      sortOrder,
    });
    return {
      data: data.images,
      nextCursor: data.nextCursor,
    };
  }
}
