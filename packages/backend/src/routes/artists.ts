import { FastifyInstance } from "fastify";
import { artists } from "../models/data";

export async function artistRoutes(app: FastifyInstance) {
  // GET all artists
  app.get("/", async () => {
    return { success: true, data: artists, total: artists.length };
  });

  // GET single artist
  app.get<{ Params: { id: string } }>("/:id", async (req, reply) => {
    const artist = artists.find((a) => a.id === req.params.id);
    if (!artist) return reply.code(404).send({ success: false, error: "Artist not found" });
    return { success: true, data: artist };
  });

  // POST create artist
  app.post<{ Body: Partial<typeof artists[0]> }>("/", async (req, reply) => {
    const { v4: uuidv4 } = await import("uuid");
    const newArtist = {
      id: `artist-${uuidv4().slice(0, 8)}`,
      verified: false,
      createdAt: new Date().toISOString(),
      currency: "INR",
      ...req.body,
    } as any;
    artists.push(newArtist);
    return reply.code(201).send({ success: true, data: newArtist, message: "Artist created" });
  });

  // PUT update artist
  app.put<{ Params: { id: string }; Body: Partial<typeof artists[0]> }>("/:id", async (req, reply) => {
    const idx = artists.findIndex((a) => a.id === req.params.id);
    if (idx === -1) return reply.code(404).send({ success: false, error: "Artist not found" });
    artists[idx] = { ...artists[idx], ...req.body };
    return { success: true, data: artists[idx] };
  });

  // DELETE artist
  app.delete<{ Params: { id: string } }>("/:id", async (req, reply) => {
    const idx = artists.findIndex((a) => a.id === req.params.id);
    if (idx === -1) return reply.code(404).send({ success: false, error: "Artist not found" });
    artists.splice(idx, 1);
    return { success: true, message: "Artist deleted" };
  });
}

