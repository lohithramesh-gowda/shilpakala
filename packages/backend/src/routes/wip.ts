import { FastifyInstance } from "fastify";
import { wipStages } from "../models/data";

export async function wipRoutes(app: FastifyInstance) {
  // GET WIP stages for an artwork
  app.get<{ Querystring: { artworkId?: string } }>("/", async (req) => {
    let result = [...wipStages];
    if (req.query.artworkId) result = result.filter((w) => w.artworkId === req.query.artworkId);
    result.sort((a, b) => a.stage - b.stage);
    return { success: true, data: result, total: result.length };
  });

  // GET single WIP stage
  app.get<{ Params: { id: string } }>("/:id", async (req, reply) => {
    const wip = wipStages.find((w) => w.id === req.params.id);
    if (!wip) return reply.code(404).send({ success: false, error: "WIP stage not found" });
    return { success: true, data: wip };
  });

  // POST create WIP stage
  app.post<{ Body: Record<string, any> }>("/", async (req, reply) => {
    const { v4: uuidv4 } = await import("uuid");
    const body = req.body as Record<string, any>;
    const stageLabels: Record<number, string> = {
      1: "Raw Block",
      2: "Rough Carving",
      3: "Detail Work",
      4: "Finishing",
      5: "Complete",
    };
    const newStage = {
      id: `wip-${uuidv4().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
      stageLabel: stageLabels[body.stage as number] || "In Progress",
      ...body,
    };
    wipStages.push(newStage as any);
    return reply.code(201).send({ success: true, data: newStage, message: "WIP stage added" });
  });

  // PUT update WIP stage
  app.put<{ Params: { id: string }; Body: Record<string, any> }>("/:id", async (req, reply) => {
    const idx = wipStages.findIndex((w) => w.id === req.params.id);
    if (idx === -1) return reply.code(404).send({ success: false, error: "WIP stage not found" });
    const body = req.body as Record<string, any>;
    wipStages[idx] = { ...wipStages[idx], ...body };
    return { success: true, data: wipStages[idx] };
  });

  // DELETE WIP stage
  app.delete<{ Params: { id: string } }>("/:id", async (req, reply) => {
    const idx = wipStages.findIndex((w) => w.id === req.params.id);
    if (idx === -1) return reply.code(404).send({ success: false, error: "WIP stage not found" });
    wipStages.splice(idx, 1);
    return { success: true, message: "WIP stage deleted" };
  });
}

