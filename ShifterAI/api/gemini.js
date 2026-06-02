export default async function handler(req, res) {
  // 1. Keamanan Dasar: Hanya izinkan POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method tidak diizinkan. Harap gunakan POST.' });
  }

  try {
    const userPrompt = req.body.prompt;
    if (!userPrompt) {
      return res.status(400).json({ error: 'Prompt tidak boleh kosong.' });
    }

    // Ambil API Key dari Brankas Vercel
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API Key tidak ditemukan di Vercel Environment.' });
    }

    // 2. NATIVE FETCH: Berbicara langsung ke Google tanpa SDK/Library.
    // Kita menggunakan ekstensi "-latest" agar selalu dicarikan server yang aktif
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userPrompt }] }]
      })
    });

    // 3. Parsing jawaban dari Google
    const data = await apiResponse.json();

    // Jika Google menolak permintaan (misal: API key salah / kuota habis)
    if (!apiResponse.ok) {
      console.error("Google API Error:", data);
      return res.status(500).json({ 
        error: `Respon Google: ${data.error?.message || 'Gagal menghubungi Gemini'}` 
      });
    }

    // 4. Ekstrak teks naskah dan kirim ke Frontend (ShifterAI)
    const responseText = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ result: responseText });

  } catch (error) {
    // Tangkap jika terjadi server crash (seperti masalah jaringan)
    console.error("Terjadi kesalahan sistem di Vercel:", error);
    return res.status(500).json({ 
      error: `Kegagalan Server: ${error.message}` 
    });
  }
}
