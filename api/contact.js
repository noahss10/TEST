// api/contact.js
import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const { name, email, message, website } = req.body || {};

    // Honeypot: real users won't fill this
    if (website) return res.status(200).json({ ok: true });

    if (!name || !email || !message)
      return res.status(400).json({ ok: false, error: 'Missing required fields' });

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'W.E.B. Contact <contact@yourdomain.com>',
      to: ['nsilverman@bridgeconcerts.com'],  // change to your actual inbox
      reply_to: email,
      subject: `New inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Email failed to send' });
  }
}
