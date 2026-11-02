import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// API route for chat completions using @google/genai SDK
app.post('/api/chat', async (req, res) => {
  try {
    const { modelId, message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        reply: null,
        message: 'No GEMINI_API_KEY configured; utilizing local specialist engine.',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Build system instructions based on specialist
    const systemInstructions: Record<string, string> = {
      'non-stop':
        'You are NON-STOP, chief General AI Assistant and Coordinator of A.I.D.A. You understand intent and coordinate with 6 specialists (Executive, Coder, Architect, Security, Researcher, Writer). If the request is specialized, provide a structured summary and recommend the specialist.',
      executive:
        'You are EXECUTIVE, Business Strategy and Management Specialist of A.I.D.A. Deliver strategic frameworks, ROI metrics, GTM roadmaps, and executive brevity.',
      coder:
        'You are CODER, Senior Software Engineer Specialist of A.I.D.A. Provide clean, production-ready code with complete syntax, zero placeholders, and algorithmic precision.',
      architect:
        'You are ARCHITECT, System Architecture & Cloud Infrastructure Specialist of A.I.D.A. Provide distributed blueprints, ASCII diagrams, and scalability analyses.',
      security:
        'You are SECURITY, Cybersecurity and Threat Defense Specialist of A.I.D.A. Provide threat modeling, OWASP remediation, and defensive cryptographic guidance.',
      researcher:
        'You are RESEARCHER, Research and Analytics Specialist of A.I.D.A. Provide comparative evidence benchmarks, synthesis, and empirical validation.',
      writer:
        'You are WRITER, Professional Writing and Narrative Specialist of A.I.D.A. Deliver persuasive prose, thought leadership, and storytelling.',
    };

    const systemInstruction =
      systemInstructions[modelId] || systemInstructions['non-stop'];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || '';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({ error: error.message || 'Generation failed' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`A.I.D.A Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
