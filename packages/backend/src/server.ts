import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import path from "path";
import { artworkRoutes } from "./routes/artworks";
import { artistRoutes } from "./routes/artists";
import { wipRoutes } from "./routes/wip";
import { heritageRoutes } from "./routes/heritage";
import { inquiryRoutes } from "./routes/inquiries";
import dotenv from "dotenv";

dotenv.config();

const PORT = parseInt(process.env.PORT || "4000");
const HOST = process.env.HOST || "0.0.0.0";

const app = Fastify({ logger: { transport: { target: "pino-pretty" } } });

async function bootstrap() {
  // ── Plugins ────────────────────────────────────────────────────────────────
  await app.register(cors, {
    origin: ["http://localhost:3000", "http://localhost:5173", "*"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  await app.register(multipart, { limits: { fileSize: 20 * 1024 * 1024 } }); // 20 MB max

  // Serve uploaded images as static files
  const uploadDir = path.join(__dirname, "../uploads");
  await app.register(require("@fastify/static"), {
    root: uploadDir,
    prefix: "/uploads/",
  });

  // ── Health ─────────────────────────────────────────────────────────────────
  app.get("/health", async () => ({
    status: "ok",
    app: "Shilpa-Kala API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  }));

  // ── Routes ─────────────────────────────────────────────────────────────────
  app.register(artistRoutes,  { prefix: "/api/artists"  });
  app.register(artworkRoutes, { prefix: "/api/artworks" });
  app.register(wipRoutes,     { prefix: "/api/wip"      });
  app.register(heritageRoutes,{ prefix: "/api/heritage" });
  app.register(inquiryRoutes, { prefix: "/api/inquiries"});

  // ── Start ──────────────────────────────────────────────────────────────────
  await app.listen({ port: PORT, host: HOST });
  console.log(`\n🪨  Shilpa-Kala API running at http://localhost:${PORT}\n`);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

