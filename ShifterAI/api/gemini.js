import { GoogleGenAI } from '@google/genai';

// Inisialisasi SDK menggunakan API Key dari Environment Variable (Brankas Vercel)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  // 1. Keamanan Dasar: Hanya izinkan permintaan dengan metode POST dari web Anda
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method tidak diizinkan. Harap gunakan POST.' });
  }

  try {
    // 2. Tangkap data teks dan instruksi (prompt) yang dikirim dari Frontend (index.html)
    const userPrompt = req.body.prompt;

    if (!userPrompt) {
      return res.status(400).json({ error: 'Prompt tidak boleh kosong.' });
    }

    // 3. Panggil model Gemini 1.5 Flash (Gratis dan Cepat)
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: userPrompt,
    });

    // 4. Kirim hasil naskah kembali ke peramban pengguna (Client-Side)
    return res.status(200).json({ result: response.text });

  } catch (error) {
    // Log error di server Vercel untuk keperluan debugging Anda
    console.error("Terjadi kesalahan di Server Vercel:", error);
    
    // Kirim pesan error yang ramah ke pengguna
    return res.status(500).json({ error: 'Gagal memproses permintaan AI. Silakan coba lagi.' });
  }
}
