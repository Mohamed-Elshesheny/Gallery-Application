import { Injectable } from "@nestjs/common";
import { Image } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { UploadGateway } from "../upload/upload.gateway";
import { CloudStorageService } from "../CloudStorage/cloudstorage.service";

@Injectable()
export class ImageService {
  constructor(
    private prisma: PrismaService,
    private gateway: UploadGateway,
    private storage: CloudStorageService
  ) {}

  async createUploadSession() {
    return this.prisma.uploadSession.create({
      data: {},
    });
  }

  async addImage(
    sessionId: string,
    image: { originalname: string; buffer: Buffer; size: number }
  ): Promise<Image> {
    this.gateway.emitProgress(
      sessionId,
      image.originalname,
      "processing-started"
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    this.gateway.emitProgress(
      sessionId,
      image.originalname,
      "processing-completed"
    );
    const imageUrl = await this.storage.upload(
      image.buffer,
      image.originalname
    );
    this.gateway.emitProgress(
      sessionId,
      image.originalname,
      "upload-completed"
    );
    return this.prisma.image.create({
      data: {
        fileName: image.originalname,
        url: imageUrl,
        size: image.size,
        sessionId,
      },
    });
  }

  async getImages(params: {
    cursor?: string;
    limit?: number | string;
    filter?: string;
    sortBy?: "uploadedAt" | "fileName";
    sortOrder?: "asc" | "desc";
  }): Promise<{ images: Image[]; nextCursor: string | null }> {
    const {
      cursor,
      limit = 10,
      filter,
      sortBy = "uploadedAt",
      sortOrder = "desc",
    } = params;

    const parsedLimit = typeof limit === "string" ? parseInt(limit, 10) : limit;

    const where: any = {};
    if (filter) {
      where.sessionId = { contains: filter };
    }

    const images = await this.prisma.image.findMany({
      where,
      take: parsedLimit + 1,
      skip: cursor ? 1 : 0,
      ...(cursor && {
        cursor: { id: cursor },
      }),
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const hasNextPage = images.length > parsedLimit;
    const results = hasNextPage ? images.slice(0, -1) : images;

    return {
      images: results,
      nextCursor: hasNextPage ? results[results.length - 1].id : null,
    };
  }
}
