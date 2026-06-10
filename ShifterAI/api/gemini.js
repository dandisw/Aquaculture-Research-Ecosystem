export default async function handler(req, res) {
  // =====================================================================
  // 1. PENGATURAN CORS (MENGIZINKAN GITHUB MENGAKSES VERCEL)
  // =====================================================================
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // =====================================================================
  // 2. LOGIKA UTAMA GEMINI AI
  // =====================================================================
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method tidak diizinkan. Harap gunakan POST.' });
  }

  try {
    const userPrompt = req.body.prompt;
    if (!userPrompt) {
      return res.status(400).json({ error: 'Prompt tidak boleh kosong.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API Key tidak ditemukan di Vercel Environment.' });
    }

    // MENGGUNAKAN MODEL 1.5-FLASH YANG STABIL (Telah Diperbaiki)
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userPrompt }] }]
      })
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      console.error("Google API Error:", data);
      return res.status(500).json({ 
        error: `Respon Google: ${data.error?.message || 'Gagal menghubungi Gemini'}` 
      });
    }

    const responseText = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ result: responseText });

  } catch (error) {
    console.error("Terjadi kesalahan sistem di Vercel:", error);
    return res.status(500).json({ error: `Kegagalan Server: ${error.message}` });
  }
}
