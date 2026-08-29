import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization for Gemini SDK
let aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// API endpoint for ShifterAI manuscript generation
const geminiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method tidak diizinkan. Harap gunakan POST.' });
  }

  try {
    const userPrompt = req.body.prompt;
    if (!userPrompt) {
      return res.status(400).json({ error: 'Prompt tidak boleh kosong.' });
    }

    const modelReq = req.body.model;
    const allowedModels = ['gemini-3.6-flash', 'gemini-3.1-pro-preview', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    const model = allowedModels.includes(modelReq) ? modelReq : 'gemini-3.6-flash';

    const systemInstruction = req.body.systemInstruction;
    const tempReq = parseFloat(req.body.temperature);
    const temperature = !isNaN(tempReq) ? tempReq : undefined;

    const ai = getGeminiClient();

    const config = {};
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    if (temperature !== undefined) {
      config.temperature = temperature;
    }

    const requestParams = {
      model,
      contents: userPrompt
    };
    if (Object.keys(config).length > 0) {
      requestParams.config = config;
    }

    const response = await ai.models.generateContent(requestParams);

    return res.status(200).json({ result: response.text });
  } catch (error) {
    console.error('Terjadi kesalahan di Server AI Studio:', error);
    const errorMsg = error.message && error.message.includes('GEMINI_API_KEY')
      ? 'GEMINI_API_KEY belum dikonfigurasi di Pengaturan (Settings) AI Studio.'
      : `Gagal memproses permintaan AI: ${error.message || 'Silakan coba lagi.'}`;
    return res.status(500).json({ error: errorMsg });
  }
};

app.post('/api/gemini', geminiHandler);
app.post('/ShifterAI/api/gemini', geminiHandler);

// Serve static files from root directory (including all subdirectories and index.html files)
app.use(express.static(__dirname));

// Fallback to serve index.html for root if needed
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AREs Digital Aquaculture Dry Lab server running on http://0.0.0.0:${PORT}`);
});
