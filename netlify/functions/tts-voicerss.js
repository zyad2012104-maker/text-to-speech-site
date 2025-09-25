
exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const text = body.text || '';
    const hl   = body.hl   || 'ar-eg';
    const v    = body.v    || '';

    // ---- DEBUG: تحقق إن كان متغير البيئة موجودا داخل الـFunction ----
    console.log("Environment key:", process.env.VOICERSS_KEY ? "Loaded" : "Not Found");

    const key  = process.env.VOICERSS_KEY; // لا تضع المفتاح هنا في الكود
    if(!key) return { statusCode:500, body:'Missing VOICERSS_KEY environment variable' };

    const apiUrl = `https://api.voicerss.org/?key=${key}&hl=${hl}&v=${v}&c=MP3&f=44khz_16bit_stereo&src=${encodeURIComponent(text)}`;
    const resp = await fetch(apiUrl);
    if(!resp.ok) throw new Error('VoiceRSS API Error');

    const arrayBuffer = await resp.arrayBuffer();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="speech.mp3"'
      },
      body: Buffer.from(arrayBuffer).toString('base64'),
      isBase64Encoded: true
    };
  } catch (err) {
    console.error("Function error:", err);
    return { statusCode: 500, body: err.message || 'Server error' };
  }
};
