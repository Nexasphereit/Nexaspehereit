import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

let aiClient: any = null;

function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY is not defined. Operating AI generator in high-quality sandbox template fallback mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      time: new Date().toISOString(),
      service: "NexaSphere Node.JS Engine",
      aiStatus: process.env.GEMINI_API_KEY ? "active" : "sandbox_fallback"
    });
  });

  // Premium Node.js AI endpoint: Suggest premium quotation items/services
  app.post("/api/ai/suggest-items", async (req, res) => {
    const { category, clientName } = req.body;
    const cleanCategory = String(category || "Cloud Migration Enterprise").trim();
    
    const client = getGeminiClient();
    if (!client) {
      // Sandbox fallback responses for premium feel without API key
      return res.json({
        success: true,
        source: "sandbox_templates",
        items: [
          { serviceName: `${cleanCategory} consulting`, description: "Strategic architectural assessment and premium optimization roadmap.", price: 2500, quantity: 1, total: 2500 },
          { serviceName: "Advanced Integration Deployment", description: "Multi-layered secure cloud resource deployment with automatic failover config.", price: 4200, quantity: 1, total: 4200 },
          { serviceName: "Security Audit & hardening", description: "Zero-Trust policy configurations, firewalls, and detailed vulnerability reporting.", price: 1800, quantity: 1, total: 1800 }
        ],
        notes: `Proposal tailored specifically for ${clientName || 'Valued Client'}. Guaranteed deployment reliability within NexaSphere Standards.`
      });
    }

    try {
      const prompt = `You are a premium Enterprise IT Agency systems consultant for NexaSphere.
Generate a JSON array representing suggested premium quotation or invoice line items for the category/service: "${cleanCategory}".
Return exactly 3 highly professional, premium line items. Each item must have the following keys:
- "serviceName" (string, short and premium)
- "description" (string, detailed descriptive prose outlining agency expertise)
- "price" (number, a logical corporate price in USD e.g. between 1000 and 6000)
- "quantity" (always 1)
- "total" (same as price)

Also generate a "notes" string (a brief professional proposal closing statement tailored for ${clientName || 'the client'}).
Ensure your response is valid JSON matching this schema:
{
  "items": [
    { "serviceName": "...", "description": "...", "price": 0, "quantity": 1, "total": 0 }
  ],
  "notes": "..."
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text || "{}");
      res.json({
        success: true,
        source: "gemini_ai",
        items: data.items || [],
        notes: data.notes || "Proposal generated under NexaSphere premium terms."
      });
    } catch (err: any) {
      console.error("Gemini AI API Error:", err);
      res.status(500).json({ error: "Failed to generate premium suggestions", details: err?.message });
    }
  });

  // Premium Node.js AI endpoint: CV Professional Summary & Skills Enhancer
  app.post("/api/ai/enhance-cv", async (req, res) => {
    const { role, focusArea } = req.body;
    const cleanRole = String(role || "Full Stack Software Engineer").trim();
    const cleanFocus = String(focusArea || "Cloud Native Architectures & React").trim();

    const client = getGeminiClient();
    if (!client) {
      return res.json({
        success: true,
        source: "sandbox_templates",
        summary: `Result-driven and highly analytical ${cleanRole} with expert-level proficiency in ${cleanFocus}. Recognized for architecting premium software experiences, optimizing heavy processing performance, and leading high-performing technical squads to deliver robust full-stack solutions.`,
        skills: ["TypeScript Project Design", "Enterprise React Architectures", "Secure Node.JS Server Architecture", "Restful / GraphQL API Scaling", "Zero-Trust Firebase Configuration", "Cloud Run Optimization", "CI/CD Pipeline Design"]
      });
    }

    try {
      const prompt = `You are an elite premium tech executive resume writer.
Enhance a professional tech CV for the role of "${cleanRole}" focusing heavily on "${cleanFocus}".
Generate a stunning, premium, high-impact resume summary (around 3 sentences, using ultra-professional corporate action verbs).
Also return an array of exactly 7 premium, cutting-edge technical skills.

Return your response strictly in JSON format matching this schema:
{
  "summary": "...",
  "skills": ["skill1", "skill2", ...]
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text || "{}");
      res.json({
        success: true,
        source: "gemini_ai",
        summary: data.summary,
        skills: data.skills || []
      });
    } catch (err: any) {
      console.error("Gemini AI CV Enhancing Error:", err);
      res.status(500).json({ error: "Failed to enhance tech CV", details: err?.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
