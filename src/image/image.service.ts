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

  async createUploadSession(userId?: number) {
    return this.prisma.uploadSession.create({
      data: { userId },
    });
  }

  async addImage(
    sessionId: number,
    image: { originalname: string; buffer: Buffer; size: number },
    userId: number
  ): Promise<Image> {
    if (!userId) throw new Error("userId is required to upload image");
    this.gateway.emitProgress(
      sessionId.toString(),
      image.originalname,
      "processing-started"
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    this.gateway.emitProgress(
      sessionId.toString(),
      image.originalname,
      "processing-completed"
    );
    const imageUrl = await this.storage.upload(
      image.buffer,
      image.originalname
    );
    this.gateway.emitProgress(
      sessionId.toString(),
      image.originalname,
      "upload-completed"
    );
    return this.prisma.image.create({
      data: {
        fileName: image.originalname,
        url: imageUrl,
        size: image.size,
        sessionId,
        userId,
      },
    });
  }

  async getImages(params: {
    cursor?: number;
    limit?: number | string;
    filter?: string;
    sortBy?: "uploadedAt" | "fileName";
    sortOrder?: "asc" | "desc";
  }): Promise<{ images: Image[]; nextCursor: number | null }> {
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
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
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
