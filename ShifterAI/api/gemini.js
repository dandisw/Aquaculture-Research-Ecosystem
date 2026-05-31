import { GoogleGenAI } from '@google/genai';

// Inisialisasi SDK menggunakan API Key dari Brankas Vercel
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  // 1. Keamanan Dasar
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method tidak diizinkan. Harap gunakan POST.' });
  }

  try {
    const userPrompt = req.body.prompt;

    if (!userPrompt) {
      return res.status(400).json({ error: 'Prompt tidak boleh kosong.' });
    }

    // 2. UPGRADE MODEL KE VERSI TERBARU (Gemini 2.0 Flash)
    // Model ini lebih cerdas untuk penalaran sains dan kompatibel penuh dengan SDK
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: userPrompt,
    });

    // 3. Kirim hasil naskah kembali ke ShifterAI di peramban
    return res.status(200).json({ result: response.text });

  } catch (error) {
    console.error("Terjadi kesalahan di Server Vercel:", error);
    
    // Perbaikan: Meneruskan pesan error asli ke UI web Anda agar mudah dilacak
    return res.status(500).json({ 
      error: `Gagal memproses AI: ${error.message || 'Error internal server.'}` 
    });
  }
}
