import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const notionToken = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_DB_ID;

if (!notionToken || !databaseId) {
  console.error("❌ Faltan variables de entorno: NOTION_TOKEN o NOTION_DB_ID");
  process.exit(1);
}

async function testConnection() {
  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${notionToken}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("❌ Error al conectar con Notion:\n", error);
      return;
    }

    const data = await res.json();
    console.log("✅ Conexión exitosa con Notion 🎉");
    console.log("Nombre de la base:", data.title?.[0]?.plain_text);
    console.log("Propiedades disponibles:", Object.keys(data.properties));
  } catch (err) {
    console.error("💥 Error al ejecutar la prueba:\n", err);
  }
}

testConnection();
