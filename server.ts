import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client lazily or safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// API Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', brand: 'Nalinam Boutique' });
});

// AI Ethnic Style Advisor Route
app.post('/api/ai-advisor', async (req, res) => {
  try {
    const { occasion, colorPreference, fabricPreference, promptText, catalog } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback smart advice if API key is not configured yet
      return res.json({
        recommendation: `For a ${occasion || 'special occasion'}, a rich Kanjivaram Silk or Soft Silk Saree in ${colorPreference || 'Royal Purple/Magenta'} would look breathtaking! Pair it with temple jewelry and antique gold accents.`,
        suggestedProductIds: [1, 2, 5],
        stylingTips: [
          'Pair with high-neck zari blouse for a traditional look',
          'Drape in traditional Nivi style or South Indian bridal style',
          'Accentuate with fresh jasmine flowers (Mallepu/Gajra)'
        ]
      });
    }

    const ai = getGeminiClient();
    const prompt = `You are "Nalinam AI Stylist", an expert South Indian ethnic wear & saree consultant for Nalinam Boutique, Tamil Nadu.
User Query / Occasion: ${promptText || occasion || 'Festive celebration'}
Preferred Color: ${colorPreference || 'Any'}
Preferred Fabric: ${fabricPreference || 'Any'}

Available Products Catalog context:
${JSON.stringify(catalog ? catalog.slice(0, 10) : [], null, 2)}

Provide a warm, culturally resonant styling recommendation in JSON format with fields:
- recommendation: (string, 2-3 sentences explaining why this choice fits the occasion and Tamil Nadu culture)
- suggestedProductIds: (array of numbers matching product IDs from catalog)
- stylingTips: (array of 3 short actionable styling tips like blouse design, jewelry, hair)

Respond ONLY with valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('AI Stylist Error:', error?.message || error);
    return res.json({
      recommendation: 'For your special occasion, our Kanjivaram Pure Silk Sarees and Handcrafted Salwar sets are customer favorites!',
      suggestedProductIds: [1, 3, 6],
      stylingTips: [
        'Choose contrasting zari blouse for pop of color',
        'Add traditional temple jewelry or Kundan choker',
        'Finish with a classic bindi and Gajra floral hair wrap'
      ]
    });
  }
});

// In-memory server persistence store
let serverProductsStore: any[] | null = null;
let serverOrdersStore: any[] = [];
let serverAppointmentsStore: any[] = [];

// Products API
app.get('/api/products', (_req, res) => {
  res.json(serverProductsStore || []);
});

app.put('/api/products', (req, res) => {
  if (Array.isArray(req.body)) {
    serverProductsStore = req.body;
    return res.json({ success: true, count: serverProductsStore.length });
  }
  return res.status(400).json({ error: 'Expected array of products' });
});

// Orders API
app.get('/api/orders', (_req, res) => {
  res.json(serverOrdersStore);
});

app.post('/api/orders', (req, res) => {
  if (Array.isArray(req.body)) {
    serverOrdersStore = req.body;
  } else if (req.body && req.body.id) {
    const existingIndex = serverOrdersStore.findIndex((o) => o.id === req.body.id);
    if (existingIndex >= 0) {
      serverOrdersStore[existingIndex] = req.body;
    } else {
      serverOrdersStore.unshift(req.body);
    }
  }
  res.json({ success: true, orders: serverOrdersStore });
});

// Appointments API
app.get('/api/appointments', (_req, res) => {
  res.json(serverAppointmentsStore);
});

app.post('/api/appointments', (req, res) => {
  if (Array.isArray(req.body)) {
    serverAppointmentsStore = req.body;
  } else if (req.body && req.body.id) {
    const existingIndex = serverAppointmentsStore.findIndex((a) => a.id === req.body.id);
    if (existingIndex >= 0) {
      serverAppointmentsStore[existingIndex] = req.body;
    } else {
      serverAppointmentsStore.unshift(req.body);
    }
  }
  res.json({ success: true, appointments: serverAppointmentsStore });
});

// Pincode lookup API
app.get('/api/pincode/:code', (req, res) => {
  const code = req.params.code;
  // Tamil Nadu pincodes start with 600-643
  if (/^6[0-4]\d{4}$/.test(code)) {
    return res.json({
      pincode: code,
      serviceable: true,
      state: 'Tamil Nadu',
      courier: 'Express Delivery via Porter / Delhivery',
      estimatedDays: '1 - 2 Business Days',
      codAvailable: true,
      freeShippingEligible: true,
    });
  } else if (/^\d{6}$/.test(code)) {
    return res.json({
      pincode: code,
      serviceable: true,
      state: 'Rest of India',
      courier: 'India Post / DTDC Express',
      estimatedDays: '3 - 5 Business Days',
      codAvailable: true,
      freeShippingEligible: true,
    });
  } else {
    return res.status(400).json({
      serviceable: false,
      message: 'Invalid 6-digit Indian Pincode',
    });
  }
});

// Start Vite middleware in development or serve static assets in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nalinam Boutique Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
