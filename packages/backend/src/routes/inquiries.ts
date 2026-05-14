import { FastifyInstance } from "fastify";
import { inquiries, artworks, artists } from "../models/data";

export async function inquiryRoutes(app: FastifyInstance) {
  // GET all inquiries (admin)
  app.get<{ Querystring: { status?: string } }>("/", async (req) => {
    let result = [...inquiries];
    if (req.query.status) result = result.filter((i) => i.status === req.query.status);
    return { success: true, data: result, total: result.length };
  });

  // POST new inquiry (creates WhatsApp link info)
  app.post<{ Body: Record<string, any> }>("/", async (req, reply) => {
    const { v4: uuidv4 } = await import("uuid");
    const body = req.body as Record<string, any>;
    const { artworkId, buyerName, buyerEmail, buyerPhone, message } = body;

    const artwork = artworks.find((a) => a.id === artworkId);
    if (!artwork) return reply.code(404).send({ success: false, error: "Artwork not found" });

    const artist = artists.find((a) => a.id === artwork.artistId);
    if (!artist) return reply.code(404).send({ success: false, error: "Artist not found" });

    const newInquiry = {
      id: `inq-${uuidv4().slice(0, 8)}`,
      artworkId,
      productId: artwork.productId,
      buyerName,
      buyerEmail,
      buyerPhone,
      message,
      status: "new" as const,
      createdAt: new Date().toISOString(),
    };
    inquiries.push(newInquiry);

    // Build WhatsApp deep-link message
    const whatsappText = encodeURIComponent(
      `🙏 Namaste ${artist.name},\n\nI am interested in your artwork:\n` +
        `*${artwork.title}*\nProduct ID: ${artwork.productId}\n\n` +
        `My name is ${buyerName}.\n${message}\n\nPlease let me know the next steps.`
    );
    const whatsappUrl = `https://wa.me/${artist.whatsapp.replace(/\D/g, "")}?text=${whatsappText}`;

    return reply.code(201).send({
      success: true,
      data: { inquiry: newInquiry, whatsappUrl },
      message: "Inquiry created. Open whatsappUrl to contact the artist.",
    });
  });

  // PATCH update inquiry status (admin)
  app.patch<{ Params: { id: string }; Body: { status: string } }>("/:id", async (req, reply) => {
    const idx = inquiries.findIndex((i) => i.id === req.params.id);
    if (idx === -1) return reply.code(404).send({ success: false, error: "Inquiry not found" });
    inquiries[idx] = { ...inquiries[idx], status: req.body.status as any };
    return { success: true, data: inquiries[idx] };
  });
}

