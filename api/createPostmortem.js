import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export default async function handler(req, res) {
  // Solo permitimos POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const {
      nombre,
      ticket,
      dateOfIncident,
      detectedAt,
      notifiedAt,
      status,
      summary,
      teams,
      authors,
      detectedBy,
    } = req.body;

    // Validar campos mínimos
    if (!nombre) {
      return res.status(400).json({ error: "Faltan campos obligatorios: nombre" });
    }

    // Crear página en Notion
    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DB_ID },
      properties: {
        Nombre: {
          title: [{ text: { content: nombre } }],
        },
        "Ticket INCS": {
          rich_text: [{ text: { content: ticket || "" } }],
        },
        "Date of Incident": {
          date: { start: dateOfIncident || new Date().toISOString() },
        },
        "Detected At": {
          date: detectedAt ? { start: detectedAt } : null,
        },
        "Notified At": {
          date: notifiedAt ? { start: notifiedAt } : null,
        },
        Status: {
          select: status ? { name: status } : undefined,
        },
        Summary: {
          rich_text: [{ text: { content: summary || "" } }],
        },
        Teams: {
          multi_select: (teams || []).map((t) => ({ name: t })),
        },
        Authors: {
          people: (authors || []).map((id) => ({ id })),
        },
        "Detected by": {
          rich_text: [{ text: { content: detectedBy || "" } }],
        },
      },
    });

    return res.status(200).json({
      message: "✅ Postmortem creado correctamente",
      notionResponse: response,
    });
  } catch (error) {
    console.error("❌ Error al crear postmortem:", error.body || error);
    return res.status(500).json({
      error: error.body || error.message || "Error interno del servidor",
    });
  }
}


