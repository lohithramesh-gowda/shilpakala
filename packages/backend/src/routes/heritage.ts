import { FastifyInstance } from "fastify";
import { heritageStories } from "../models/data";

export async function heritageRoutes(app: FastifyInstance) {
  app.get("/", async () => ({
    success: true,
    data: heritageStories,
    total: heritageStories.length,
  }));

  app.get<{ Params: { id: string } }>("/:id", async (req, reply) => {
    const story = heritageStories.find((h) => h.id === req.params.id);
    if (!story) return reply.code(404).send({ success: false, error: "Story not found" });
    return { success: true, data: story };
  });

  app.get<{ Params: { style: string } }>("/style/:style", async (req, reply) => {
    const story = heritageStories.find(
      (h) => h.style.toLowerCase() === req.params.style.toLowerCase()
    );
    if (!story) return reply.code(404).send({ success: false, error: "Story not found" });
    return { success: true, data: story };
  });

  app.post<{ Body: Record<string, any> }>("/", async (req, reply) => {
    const { v4: uuidv4 } = await import("uuid");
    const body = req.body as Record<string, any>;
    const newStory = {
      id: `heritage-${uuidv4().slice(0, 8)}`,
      gallery: [],
      keyFeatures: [],
      createdAt: new Date().toISOString(),
      ...body,
    };
    heritageStories.push(newStory as any);
    return reply.code(201).send({ success: true, data: newStory });
  });
}

