module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const email = body.email;
    const resetLink = body.resetLink;

    if (!email || !resetLink) {
      return res.status(400).json({ error: 'Eksik bilgi var.' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.MAIL_FROM || 'mail@sevrawms.com.tr';

    if (!apiKey) {
      return res.status(500).json({ error: 'RESEND_API_KEY tanımlı değil.' });
    }

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;">
        <h2>SEVRA Şifre Yenileme</h2>
        <p>Şifrenizi yenilemek için aşağıdaki butona tıklayın.</p>
        <p>
          <a href="${resetLink}" style="display:inline-block;padding:12px 18px;background:#0f172a;color:#fff;text-decoration:none;border-radius:8px;">
            Şifreyi Yenile
          </a>
        </p>
        <p>Buton çalışmazsa bu bağlantıyı tarayıcıya yapıştırın:</p>
        <p>${resetLink}</p>
      </div>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'SEVRA <' + fromEmail + '>',
        to: [email],
        subject: 'SEVRA Şifre Yenileme',
        html: html
      })
    });

    const data = await resendResponse.json();

    if (!resendResponse.ok) {
      return res.status(500).json({
        error: data.message || data.error || 'Resend mail gönderemedi.',
        details: data
      });
    }

    return res.status(200).json({ ok: true, data: data });
  } catch (error) {
    return res.status(500).json({
      error: error && error.message ? error.message : 'Sunucu hatası.'
    });
  }
};
