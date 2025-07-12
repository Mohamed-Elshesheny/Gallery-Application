import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { ImageService } from "./image.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"; // <-- عدل هنا

interface JwtUserPayload {
  id: number;
  email?: string;
}

@Controller("images")
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @UseGuards(JwtAuthGuard)
  @Post("upload")
  @UseInterceptors(FilesInterceptor("images", 10))
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request
  ) {
    const userId = (req.user as JwtUserPayload)?.id;
    const session = await this.imageService.createUploadSession(userId);
    console.log("UserID:", userId);
    for (const file of files) {
      await new Promise((res) => setTimeout(res, 1000)); // simulate delay
      await this.imageService.addImage(session.id, file, userId);
    }

    return { message: "Images uploaded successfully!" };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getImages(
    @Query("cursor") cursor?: string,
    @Query("limit") limit = 10,
    @Query("filter") filter?: string,
    @Query("sortBy") sortBy: "uploadedAt" | "fileName" = "uploadedAt",
    @Query("sortOrder") sortOrder: "asc" | "desc" = "asc"
  ) {
    const data = await this.imageService.getImages({
      cursor: cursor ? Number(cursor) : undefined,
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
