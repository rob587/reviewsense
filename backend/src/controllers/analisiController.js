import pool from "../config/database.js";
import Groq from "groq-sdk";
import { getJson } from "serpapi";

export const searchAndAnalyze = async (req, res) => {
  const { nome_prodotto, categoria } = req.body;
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  if (!nome_prodotto) {
    return res.status(400).json({ error: "Nome prodotto obbligatorio" });
  }

  try {
    console.log(`🔍 Cercando recensioni per: ${nome_prodotto}`);

    const searchResults = await getJson({
      engine: "google",
      q: `${nome_prodotto} recensioni reviews`,
      api_key: process.env.SERP_API_KEY,
      hl: "it",
      gl: "it",
      num: 10,
    });

    // Estrai testo utile dai risultati
    let recensioniText = "";

    // Prendi gli organic results
    if (searchResults.organic_results) {
      searchResults.organic_results.forEach((result) => {
        if (result.snippet) {
          recensioniText += result.snippet + "\n\n";
        }
        if (result.rich_snippet?.top?.detected_extensions?.rating) {
          recensioniText += `Valutazione: ${result.rich_snippet.top.detected_extensions.rating}/5\n\n`;
        }
      });
    }

    // Prendi le reviews dalla knowledge graph se disponibili
    if (searchResults.knowledge_graph?.reviews) {
      recensioniText += searchResults.knowledge_graph.reviews + "\n\n";
    }

    // Prendi i related questions
    if (searchResults.related_questions) {
      searchResults.related_questions.forEach((q) => {
        if (q.snippet) recensioniText += q.snippet + "\n\n";
      });
    }

    if (recensioniText.trim().length < 50) {
      return res.status(404).json({
        error:
          "Nessuna recensione trovata per questo prodotto. Prova con un nome più specifico.",
      });
    }

    console.log(`✅ Trovato testo: ${recensioniText.length} caratteri`);

    const prompt = `Sei ReviewSense, un sistema di analisi delle recensioni dei clienti.

Analizza le seguenti informazioni trovate online sul prodotto "${nome_prodotto}"${categoria ? ` (categoria: ${categoria})` : ""} e restituisci SOLO un oggetto JSON valido, senza markdown, senza backtick, senza testo aggiuntivo.

DATI TROVATI:
${recensioniText}

Il JSON deve avere esattamente questa struttura:
{
  "sentiment_generale": "positivo" | "neutro" | "negativo" | "misto",
  "sentiment_score": numero da 1 a 10,
  "numero_recensioni_stimate": numero intero,
  "sintesi": "stringa di 2-3 frasi che riassume l'opinione generale",
  "pro": ["pro 1", "pro 2", "pro 3", "pro 4", "pro 5"],
  "contro": ["contro 1", "contro 2", "contro 3", "contro 4", "contro 5"],
  "temi_ricorrenti": ["tema 1", "tema 2", "tema 3", "tema 4", "tema 5"],
  "raccomandazione": "stringa di 1-2 frasi su se acquistare o meno il prodotto",
  "target_ideale": "stringa che descrive a chi è adatto il prodotto"
}

Rispondi SOLO con il JSON, nient'altro.`;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Sei un sistema di analisi recensioni. Rispondi SEMPRE e SOLO con JSON valido, mai con markdown o testo aggiuntivo.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0.3,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content || "";

    let risultato;
    try {
      const clean = content.replace(/```json|```/g, "").trim();
      risultato = JSON.parse(clean);
    } catch (parseErr) {
      console.error("Errore parsing JSON:", content);
      return res
        .status(500)
        .json({ error: "Errore nel parsing della risposta AI" });
    }

    // Step 3 — Salva nel DB
    const [result] = await pool.query(
      `INSERT INTO analisi (user_id, nome_prodotto, categoria, recensioni_raw, risultato, sentiment_score)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        nome_prodotto,
        categoria || null,
        recensioniText,
        JSON.stringify(risultato),
        risultato.sentiment_score,
      ],
    );

    res.json({
      success: true,
      analisi: {
        id: result.insertId,
        nome_prodotto,
        categoria: categoria || null,
        risultato,
        created_at: new Date(),
      },
    });
  } catch (err) {
    console.error("Errore searchAndAnalyze:", err);
    res.status(500).json({ error: "Errore nella ricerca e analisi" });
  }
};

export const getHistory = async (req, res) => {
  try {
    const [analisi] = await pool.query(
      `SELECT id, nome_prodotto, categoria, sentiment_score, risultato, created_at
       FROM analisi WHERE user_id = ?
       ORDER BY created_at DESC LIMIT 20`,
      [req.user.id],
    );
    res.json({ analisi });
  } catch (err) {
    console.error("Errore getHistory:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
};

export const getAnalisi = async (req, res) => {
  const { id } = req.params;
  try {
    const [analisi] = await pool.query(
      "SELECT * FROM analisi WHERE id = ? AND user_id = ?",
      [id, req.user.id],
    );
    if (analisi.length === 0) {
      return res.status(404).json({ error: "Analisi non trovata" });
    }
    res.json({ analisi: analisi[0] });
  } catch (err) {
    console.error("Errore getAnalisi:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
};

export const deleteAnalisi = async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await pool.query(
      "SELECT id FROM analisi WHERE id = ? AND user_id = ?",
      [id, req.user.id],
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: "Analisi non trovata" });
    }
    await pool.query("DELETE FROM analisi WHERE id = ? AND user_id = ?", [
      id,
      req.user.id,
    ]);
    res.json({ message: "Analisi eliminata con successo" });
  } catch (err) {
    console.error("Errore deleteAnalisi:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
};
