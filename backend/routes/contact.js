const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const { requireAdmin } = require('../middleware/auth');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const validation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('subject').optional().trim().isLength({ max: 200 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10, max: 2000 }),
];

// ── POST /api/contact — public (submit form) ──────────────────────────────
router.post('/', validation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, subject, message } = req.body;
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

  try {
    // 1. Save to MongoDB
    await ContactMessage.create({ name, email, subject, message, ipAddress });

    // 2. Send email notification via Resend
    await resend.emails.send({
      from:    'Portfolio Contact md.shoaib.i.makandar@gmail.com', // chage the email here if u want 
      to:      process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `New message from ${name}${subject ? `: ${subject}` : ''}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0d1117; color: #e6edf3; border-radius: 12px;">
          <h2 style="color: #facc15; margin-top: 0;">New Portfolio Contact</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #8b949e; width: 100px;">Name</td><td style="padding: 8px 0;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #8b949e;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #58a6ff;">${email}</a></td></tr>
            ${subject ? `<tr><td style="padding: 8px 0; color: #8b949e;">Subject</td><td style="padding: 8px 0;">${subject}</td></tr>` : ''}
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #161b22; border-radius: 8px; border-left: 4px solid #facc15;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 20px; color: #8b949e; font-size: 12px;">
            Sent from madycloud.me · IP: ${ipAddress} 
          </p>
        </div>
      `,
    });

    res.status(201).json({ success: true, message: 'Your message has been sent!' });
  } catch (err) {
    console.error('Contact error:', err);
    // Still return success if DB saved but email failed — message is not lost
    res.status(500).json({ success: false, error: 'Failed to send message. Please try again.' });
  }
});

// ── GET /api/contact — admin only (view all messages) ────────────────────
router.get('/', requireAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PUT /api/contact/:id/read — admin only (mark as read) ────────────────
router.put('/:id/read', requireAdmin, async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!msg) return res.status(404).json({ success: false, error: 'Message not found' });
    res.json({ success: true, data: msg });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── DELETE /api/contact/:id — admin only ─────────────────────────────────
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
