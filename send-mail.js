import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    const { email, link, type } = req.body;

    let subject = '';
    let html = '';

    if (type === 'register') {
      subject = 'SEVRA Hesap Aktivasyonu';
      html = `<h2>SEVRA</h2><p>Hesabınızı aktif etmek için aşağıya tıklayın:</p><a href="${link}">Hesabı Aktif Et</a>`;
    }

    if (type === 'reset') {
      subject = 'SEVRA Şifre Sıfırlama';
      html = `<h2>SEVRA</h2><p>Şifrenizi sıfırlamak için aşağıya tıklayın:</p><a href="${link}">Şifreyi Sıfırla</a>`;
    }

    await resend.emails.send({
      from: 'SEVRA <noreply@sevrawms.com.tr>',
      to: email,
      subject,
      html,
    });

    res.status(200).json({ ok: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
