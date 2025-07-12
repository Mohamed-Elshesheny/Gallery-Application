import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ImageModule } from "./image/image.module";
import { UploadGateway } from "./upload/upload.gateway";
import { UploadModule } from "./upload/upload.module";
import { PrismaModule } from "../prisma/prisma.module";
import { CloudStorageModule } from "./CloudStorage/cloudStorage.module";
import { AuthModule } from "./auth/auth.module";
import { AuthService } from "./auth/auth.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ImageModule,
    UploadModule,
    PrismaModule,
    CloudStorageModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, UploadGateway],
})
export class AppModule {}
