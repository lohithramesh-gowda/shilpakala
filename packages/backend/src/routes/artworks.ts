import { FastifyInstance } from "fastify";
import { artworks } from "../models/data";
import { ArtworkStatus } from "@shilpakala/shared";

export async function artworkRoutes(app: FastifyInstance) {
  // GET all artworks (supports ?artistId=, ?style=, ?status=, ?page=, ?limit=)
  app.get<{ Querystring: { artistId?: string; style?: string; status?: string; page?: string; limit?: string } }>(
    "/",
    async (req) => {
      let result = [...artworks];
      const { artistId, style, status, page = "1", limit = "20" } = req.query;

      if (artistId) result = result.filter((a) => a.artistId === artistId);
      if (style) result = result.filter((a) => a.style.toLowerCase() === style.toLowerCase());
      if (status) result = result.filter((a) => a.status === (status as ArtworkStatus));

      const total = result.length;
      const p = parseInt(page);
      const l = parseInt(limit);
      result = result.slice((p - 1) * l, p * l);

      return { success: true, data: result, total, page: p, limit: l };
    }
  );

  // GET single artwork
  app.get<{ Params: { id: string } }>("/:id", async (req, reply) => {
    const art = artworks.find((a) => a.id === req.params.id);
    if (!art) return reply.code(404).send({ success: false, error: "Artwork not found" });
    return { success: true, data: art };
  });

  // GET artwork by productId
  app.get<{ Params: { productId: string } }>("/product/:productId", async (req, reply) => {
    const art = artworks.find((a) => a.productId === req.params.productId);
    if (!art) return reply.code(404).send({ success: false, error: "Artwork not found" });
    return { success: true, data: art };
  });

  // POST create artwork
  app.post<{ Body: Record<string, any> }>("/", async (req, reply) => {
    const { v4: uuidv4 } = await import("uuid");
    const body = req.body as Record<string, any>;
    const newArt = {
      id: `art-${uuidv4().slice(0, 8)}`,
      currency: "INR",
      images: [],
      status: "available",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...body,
      productId: body.productId || `SKU-${uuidv4().slice(0, 8).toUpperCase()}`,
    };
    artworks.push(newArt as any);
    return reply.code(201).send({ success: true, data: newArt, message: "Artwork created" });
  });

  // PUT update artwork
  app.put<{ Params: { id: string }; Body: Record<string, any> }>("/:id", async (req, reply) => {
    const idx = artworks.findIndex((a) => a.id === req.params.id);
    if (idx === -1) return reply.code(404).send({ success: false, error: "Artwork not found" });
    const body = req.body as Record<string, any>;
    artworks[idx] = { ...artworks[idx], ...body, updatedAt: new Date().toISOString() };
    return { success: true, data: artworks[idx] };
  });

  // DELETE artwork
  app.delete<{ Params: { id: string } }>("/:id", async (req, reply) => {
    const idx = artworks.findIndex((a) => a.id === req.params.id);
    if (idx === -1) return reply.code(404).send({ success: false, error: "Artwork not found" });
    artworks.splice(idx, 1);
    return { success: true, message: "Artwork deleted" };
  });
}

