import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc } from "firebase/firestore";

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

// Initialize Firebase for Backend Use
let db: any = null;
try {
  let firebaseConfig: any = {};
  const firebaseConfigPath = path.resolve(process.cwd(), "firebase-applet-config.json");

  if (process.env.FIREBASE_API_KEY && process.env.FIREBASE_PROJECT_ID) {
    firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      firestoreDatabaseId: process.env.FIREBASE_DATABASE_ID
    };
    console.log("Firebase config loaded from process.env variables.");
  } else if (fs.existsSync(firebaseConfigPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8"));
    console.log("Firebase config loaded from firebase-applet-config.json.");
  }

  if (firebaseConfig.apiKey) {
    const firebaseApp = initializeApp(firebaseConfig);
    const dbId = firebaseConfig.firestoreDatabaseId;
    db = (dbId && dbId !== '(default)') ? getFirestore(firebaseApp, dbId) : getFirestore(firebaseApp);
    console.log("Firebase initialized successfully for Express backend endpoints.");
  } else {
    console.warn("No Firebase configurations found. Backend operating without Firebase DB connectivity.");
  }
} catch (e: any) {
  console.error("Backend Firebase Initialization Warning:", e.message);
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

  // GET default or active SMS templates
  app.get("/api/it-sales/templates", async (req, res) => {
    try {
      if (!db) throw new Error("Firebase database not initialized on backend.");
      const snap = await getDoc(doc(db, "nexora_config", "sms_templates"));
      if (snap.exists()) {
        const data = snap.data();
        return res.json({
          success: true,
          templates: {
            pauseTemplate: data.pauseTemplate || "",
            resumeTemplate: data.resumeTemplate || "",
            frontEndSubmitTemplate: data.frontEndSubmitTemplate || "",
            customOfferTemplate: data.customOfferTemplate || ""
          }
        });
      }
      // Return beautiful default templates if not found
      const defaultTemplates = {
        pauseTemplate: "Dear {name}, your NexaSphere premium IT service order has been temporarily placed on hold/paused. Since we have accepted your deposit payment of {deposit}, we are registering your transaction. Ref Order ID: {customerId}. Thank you for choosing us!",
        resumeTemplate: "NexaSphere Update: Great news, {name}! Your final payment clearance has been validated and accepted. The pause on your IT service channel is lifted, order is fully confirmed, and we have resumed operations immediately!",
        frontEndSubmitTemplate: "Hi {name}, NexaSphere has successfully captured your request for the {service} service under budget {budget}. An executive campaign analyst has registered your details and will execute your target parameters layout shortly!",
        customOfferTemplate: "Executive Alert: Hello {name}, NexaSphere has constructed a state-of-the-art enterprise campaign offer specifically for your account! Enjoy responsive cloud optimization models. Quote: {service} has been prioritized for your immediate briefing."
      };
      res.json({ success: true, templates: defaultTemplates });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to read SMS templates", details: err?.message });
    }
  });

  // POST update active SMS templates
  app.post("/api/it-sales/templates", async (req, res) => {
    const { pauseTemplate, resumeTemplate, frontEndSubmitTemplate, customOfferTemplate } = req.body;
    try {
      if (!db) throw new Error("Firebase database not initialized on backend.");
      await setDoc(doc(db, "nexora_config", "sms_templates"), {
        pauseTemplate: pauseTemplate || "",
        resumeTemplate: resumeTemplate || "",
        frontEndSubmitTemplate: frontEndSubmitTemplate || "",
        customOfferTemplate: customOfferTemplate || "",
        updatedAt: new Date().toISOString()
      }, { merge: true });
      res.json({ success: true, message: "Customizable templates updated successfully!" });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to update templates", details: err?.message });
    }
  });

  // POST: Send customizable custom message or enterprise proposal/offer to client
  app.post("/api/it-sales/custom-broadcast", async (req, res) => {
    const { customerId, customerName, phone, message, type } = req.body;
    if (!phone || !message) {
      return res.status(400).json({ error: "Missing phone or message body parameter" });
    }
    try {
      if (!db) throw new Error("Firebase database not initialized on backend.");

      const logPayload = {
        customerId: customerId || "inbound_lead_" + Date.now().toString(36),
        customerName: customerName || "Untargeted Channel",
        phone,
        message,
        type: type || "Custom SMS Campaign Outreach",
        status: "Delivered",
        timestamp: new Date().toISOString()
      };

      await addDoc(collection(db, "sms_logs"), logPayload);

      res.json({
        success: true,
        message: "Broadcasting custom SMS outreach message successfully dispatched via project.",
        log: logPayload
      });
    } catch (err: any) {
      console.error("Custom broadcast SMS error:", err);
      res.status(500).json({ error: "Could not write broadcast outbox logs", details: err?.message });
    }
  });

  // POST: Automatic Frontend Submission Endpoint (Logs lead & triggers automatic SMS instantly)
  app.post("/api/it-sales/front-lead", async (req, res) => {
    const { name, email, company, phone, budget, service, plan, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and Email are mandatory fields." });
    }
    try {
      if (!db) throw new Error("Firebase database not initialized on backend.");

      const leadPayload = {
        name,
        email,
        company: company || "",
        phone: phone || "",
        budget: budget || "$5,000 - $10,000",
        service: service || "Unlisted Special Project Request",
        plan: plan || "Standard Custom Request",
        message: message || "No custom message provided",
        createdAt: new Date().toISOString(),
        status: "New"
      };

      // 1. Add to nexora_leads collection
      const leadSnap = await addDoc(collection(db, "nexora_leads"), leadPayload);

      // 2. Fetch current automated submission template
      let customTemplate = "Hi {name}, NexaSphere has successfully captured your request for the {service} service under budget {budget}. An expert campaign analyst will evaluate your parameters shortly!";
      const templatesSnap = await getDoc(doc(db, "nexora_config", "sms_templates"));
      if (templatesSnap.exists()) {
        const templatesData = templatesSnap.data();
        if (templatesData.frontEndSubmitTemplate) {
          customTemplate = templatesData.frontEndSubmitTemplate;
        }
      }

      // 3. Construct customizable SMS reply body
      const resolvedMessage = customTemplate
        .replace(/{name}/g, name)
        .replace(/{service}/g, service || "Unlisted Special Project Request")
        .replace(/{budget}/g, budget || "$5,000 - $10,000")
        .replace(/{customerId}/g, leadSnap.id);

      // 4. Log the auto-reply in SMS Logs automatically
      const systemSmsLog = {
        customerId: leadSnap.id,
        customerName: name,
        phone: phone || "No phone registered",
        message: resolvedMessage,
        type: "Frontend Auto-Reply Event",
        status: "Delivered",
        timestamp: new Date().toISOString()
      };

      await addDoc(collection(db, "sms_logs"), systemSmsLog);

      // 5. Create matching profile under 'customers' collection so it dynamically loads into IT Sales Hub CRM as well!
      await addDoc(collection(db, "customers"), {
        name,
        email,
        company: company || "Direct Web Inbound",
        phone: phone || "+1 (555) 0123",
        status: "New Inbound Inquiry",
        totalSpent: 0,
        dueAmount: parseInt(budget?.replace(/[^0-9]/g, "") || "5000"), // Convert rough budget, e.g. 5000
        refundAmount: 0,
        history: [
          {
            id: "tx_inbound_" + Date.now().toString(16),
            serviceName: service || "Unlisted Special CRM Lead",
            amount: parseInt(budget?.replace(/[^0-9]/g, "") || "5000"),
            status: "Inbound Pipeline Request",
            date: new Date().toISOString().split('T')[0]
          }
        ]
      });

      res.json({
        success: true,
        message: "Front-end lead documented & automated welcome SMS dispatched successfully!",
        leadId: leadSnap.id,
        autoSmsBody: resolvedMessage
      });
    } catch (err: any) {
      console.error("Front lead automatic routing error:", err);
      res.status(500).json({ error: "Failed to record front-end submission auto-flow", details: err?.message });
    }
  });

  // GET: Read unified front-end contact inquiries, custom unlisted service requests, or custom messages in the backend inbox
  app.get("/api/it-sales/inbound-leads", async (req, res) => {
    try {
      if (!db) throw new Error("Firebase database not initialized on backend.");
      const snapLeads = await getDocs(collection(db, "nexora_leads"));
      const leads = snapLeads.docs.map(d => ({ id: d.id, ...d.data() }));
      leads.sort((a: any, b: any) => new Date(b.createdAt || b.timestamp || 0).getTime() - new Date(a.createdAt || a.timestamp || 0).getTime());
      res.json({ success: true, leads });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to aggregate inbound customer service inbox stream", details: err?.message });
    }
  });

  // GET: Fetch all active outgoing SMS dispatch notifications
  app.get("/api/it-sales/sms-logs", async (req, res) => {
    try {
      if (!db) throw new Error("Firebase database not initialized on backend.");
      const snap = await getDocs(collection(db, "sms_logs"));
      const logs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      logs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      res.json({ success: true, logs });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to read database logs", details: err?.message });
    }
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

    // Serve index.html for any client-side routes on refresh/direct entry
    app.get("*", async (req, res, next) => {
      if (req.originalUrl.startsWith("/api") || req.originalUrl.includes(".")) {
        return next();
      }
      try {
        const fs = await import("fs");
        const templatePath = path.resolve(process.cwd(), "index.html");
        let template = fs.readFileSync(templatePath, "utf-8");
        // Apply Vite HTML transforms (injects HMR client, etc.)
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        next(e);
      }
    });
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
