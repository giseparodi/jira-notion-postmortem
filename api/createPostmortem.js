import { Client } from "@notionhq/client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { title, description, author, date } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const notion = new Client({ auth: process.env.NOTION_TOKEN });

  try {
    await notion.pages.create({
      parent: { database_id: process.env.NOTION_DB_ID },
      properties: {
        Nombre: {
          title: [{ text: { content: title } }],
        },
        Descripción: {
          rich_text: [{ text: { content: description } }],
        },
        Autor: {
          rich_text: [{ text: { content: author || "Jira Bot" } }],
        },
        Fecha: {
          date: { start: date || new Date().toISOString() },
        },
      },
    });

    return res.status(200).json({ message: "✅ Postmortem creado en Notion" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

