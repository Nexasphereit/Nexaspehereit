# 🚀 Nexasphere IT Integration & Next.js Conversion Guide

This guide outlines step-by-step instructions to convert your React single page application (SPA) to a server-side rendered **Next.js** framework and configure high-level security for your custom main domain hosting.

---

## 🔒 1. High-Level Security Architecture

To ensure maximum security on your live domain, follow these production security standards:

### A. Firestore Security Rules
We have deployed secure, Zero-Trust Attribute-Based Access Control (ABAC) rules to your Firestore DB. 
- All public access is limited to **Read-Only** for product catalogs and blogs (`nexora_services`, `nexora_portfolio`, `nexora_blog`, etc.).
- Critical administration collections (`customers`, `transactions`, `sms_logs`, `quotations`, `cvs`, `receipts`, etc.) are protected so **only authorized users can read or write**.
- The main administrative email (`gwhasu@gmail.com`) is explicitly set up with administrative privileges.

### B. Secure Environment Variables
Always separate client-side credentials from backend secrets:
- **Server-Only Secrets** (e.g., `GEMINI_API_KEY`, Firebase Admin Private Keys) must **NEVER** be prefixed with `VITE_` or `NEXT_PUBLIC_`. Keep them strictly backend-accessible.
- **Client-Accessible Configs** (e.g., Firebase Auth configs) can be safe to expose through environment prefixes.

---

## 🏗️ 2. Step-by-Step Next.js Conversion

When importing files to a new **Next.js** project, follow these structures to prevent errors when booting on your target host.

### Step 1: Install Dependencies
Maintain these critical dependencies in your Next.js project's `package.json`:
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^15.0.0",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.6.0",
    "firebase": "^10.13.2"
  }
}
```

### Step 2: Adapt Frontend Routing
In Next.js, traditional client-side routers like `react-router-dom` are replaced by file-system routing.
- Convert React routing references to clean NextJS hooks:
  - Replace `<Link to="/path">` with `<Link href="/path">` from `next/link`.
  - Replace `useLocation()` with `usePathname()` from `next/navigation`.
  - Replace `useNavigate()` with `useRouter()` from `next/navigation`.

### Step 3: Address SSR Safeties (No "window is not defined" Errors)
Next.js pre-renders pages on the server during build/request. We have already modified active state initializations in your source code (`ITSalesDashboard.tsx`, `Dashboard.tsx`, `Sidebar.tsx`, `ThemeContext.tsx`) to verify if the browser's global scope is alive:
```typescript
const saved = typeof window !== 'undefined' ? localStorage.getItem('customUser') : null;
```
For any future components utilizing browser-only APIs (`window`, `document`, `localStorage`), always gate the operation with `typeof window !== 'undefined'` or execute the logic inside a React `useEffect` block.

---

## ⚡ 3. Porting backend endpoints to Serverless Next.js API Routes

To host your server-side operations along with the frontend under one Next.js project on Vercel or custom domain servers, simply translate the Express endpoints inside `server.ts` into Next.js **Route Handlers** (App Router).

### Example translation of `/api/ai/suggest-items`:
Create a file at `/app/api/ai/suggest-items/route.ts` inside your Next.js workspace:

```typescript
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  try {
    const { category, clientName } = await request.json();
    const cleanCategory = String(category || "Cloud Migration Enterprise").trim();
    
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      // Sandbox template fallbacks
      return NextResponse.json({
        success: true,
        source: "sandbox_templates",
        items: [
          { serviceName: `${cleanCategory} consulting`, description: "Strategic architectural assessment and premium optimization roadmap.", price: 2500, quantity: 1, total: 2500 }
        ],
        notes: `Proposal tailored specifically for ${clientName || 'Valued Client'}.`
      });
    }

    const ai = new GoogleGenAI({ apiKey: key });
    const prompt = `Generate suggested items for category "${cleanCategory}" for client ${clientName}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const data = JSON.parse(response.text || "{}");
    return NextResponse.json({
      success: true,
      source: "gemini_ai",
      items: data.items || [],
      notes: data.notes || ""
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

This translation is elegant, requires no custom background server process, and runs completely serverless on your custom main domain hosting.

---

## 🌐 4. Custom Main Domain Hosting Setup

When deploying to platforms such as **Vercel**, **Google Cloud Run**, or **digitalocean**:

1. **Map Your Domain**: Add standard DNS mapping records (e.g. `CNAME` for subdomains, `A` / `AAAA` for root domains) as provided by your cloud hosting provider.
2. **Setup SSL certificates**: Most modern web hosts (Vercel, Cloud Run) auto-provision SSL certificates. Ensure **HTTPS is strictly enforced** to prevent unencrypted request intercepts (MITM).
3. **Environment Sync**: Remember to add `GEMINI_API_KEY` and Firebase variables into your platform's Environmental settings in their developer console.
