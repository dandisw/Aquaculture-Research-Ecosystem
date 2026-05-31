import { GoogleGenerativeAI } from '@google/generative-ai';

// Inisialisasi SDK Standar menggunakan API Key dari Brankas Vercel
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    // 2. Gunakan model gemini-1.5-flash yang paling stabil & didukung penuh untuk Free Tier
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. Eksekusi pemrosesan AI
    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();

    // 4. Kirim hasil naskah kembali ke ShifterAI di peramban
    return res.status(200).json({ result: responseText });

  } catch (error) {
    console.error("Terjadi kesalahan di Server Vercel:", error);
    return res.status(500).json({ 
      error: `Gagal memproses AI: ${error.message || 'Error internal server.'}` 
    });
  }
}
