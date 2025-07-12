

# Gallery Application 🖼️

A real-time image gallery built with **NestJS**, **Prisma**, **WebSockets**, and **Cloudinary**.

## 🚀 Tech Stack

- **Backend**: NestJS (TypeScript)
- **ORM**: Prisma with PostgreSQL
- **Real-time**: WebSocket Gateway (using `@nestjs/websockets`)
- **Storage**: Cloudinary
- **Deployment Ready**: .env support, Prisma migration, and scalable architecture

## 📦 Features

- Upload images and track progress in real time
- Organized upload sessions
- Upload images to Cloudinary (or a pluggable cloud provider)
- Filter and paginate images by upload session
- Realtime notifications via WebSocket

## 🛠️ What We Built

- Set up a NestJS backend project from scratch
- Designed a Prisma schema with `Image`, `UploadSession`, and `User` models
- Built an image upload API supporting multiple files per request
- Simulated image processing with progress updates using `setTimeout`
- Implemented real-time WebSocket updates for each image (e.g., processing started, completed, upload completed)
- Abstracted cloud storage service to support Cloudinary, Google Cloud Storage, or others
- Persisted uploaded image metadata in PostgreSQL using Prisma
- Enabled cursor-based pagination and filtering for image listing
- Added endpoints for image listing and upload sessions
- Set up environment variables, Prisma migrations, and dev server

## 🏗️ Project Architecture

```
src/
├── image/            # Image upload, storage, and listing
├── upload/           # Upload session management + WebSocket gateway
├── prisma/           # Prisma schema and client
├── auth/             # Signup and login endpoints
└── main.ts           # Entry point
```

## ⚙️ Setup Instructions

1. Clone the repo:
   ```bash
   git clone https://github.com/Mohamed-Elshesheny/Gallery-Application.git
   cd Gallery-Application
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` and update values (DB URL, GCP credentials, etc.)

4. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the server:
   ```bash
   npm run start:dev
   ```

## ✅ Future Improvements

- Add user authentication to image uploads
- Allow users to delete or edit images
- Add unit testing with Jest
- Frontend integration for image previews

## 📄 License

MIT © [Mohamed Elshesheny](https://github.com/Mohamed-Elshesheny)