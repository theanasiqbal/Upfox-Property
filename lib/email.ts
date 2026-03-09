import { BrevoClient, type Brevo } from '@getbrevo/brevo';

type SendTransacEmailRequest = Brevo.SendTransacEmailRequest;

const client = new BrevoClient({ apiKey: process.env.BREVO_API_KEY! });

const FROM: SendTransacEmailRequest['sender'] = {
  email: process.env.BREVO_FROM_EMAIL || 'support@upfoxxfloors.co.in',
  name: process.env.BREVO_FROM_NAME || 'Upfoxx Floors',
};

const ADMIN_EMAIL = 'support@upfoxxfloors.co.in';

async function send(opts: SendTransacEmailRequest): Promise<void> {
  try {
    await client.transactionalEmails.sendTransacEmail(opts);
  } catch (err) {
    // Log but don't throw — email failure shouldn't break the request
    console.error('[Brevo] Failed to send email:', err);
  }
}

/* ─── Auth Emails ─────────────────────────────────────────────────────────── */

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  await send({
    sender: FROM,
    to: [{ email: to, name }],
    subject: 'Welcome to Upfoxx Floors! 🏢',
    htmlContent: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1e3a5f">Welcome aboard, ${name}!</h2>
        <p>Your account on <strong>Upfoxx Floors</strong> is ready. You can now post properties, send inquiries, and manage listings.</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/seller" style="display:inline-block;padding:12px 24px;background:#6d28d9;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Go to Dashboard</a>
        <p style="color:#888;margin-top:24px;font-size:13px">Upfoxx Floors ·Civil Lines, Bareilly</p>
      </div>`,
  });
}

/* ─── Property Emails ──────────────────────────────────────────────────────── */

export async function sendNewPropertyAdminAlert(
  propertyTitle: string,
  sellerName: string,
  sellerEmail: string
): Promise<void> {
  await send({
    sender: FROM,
    to: [{ email: ADMIN_EMAIL, name: 'Admin' }],
    subject: `New Property Submitted: ${propertyTitle}`,
    htmlContent: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1e3a5f">New Property Submitted</h2>
        <p><strong>${sellerName}</strong> (${sellerEmail}) has submitted a new property for review:</p>
        <p style="font-size:18px;font-weight:bold">${propertyTitle}</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/properties?status=pending" style="display:inline-block;padding:12px 24px;background:#6d28d9;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Review Now</a>
      </div>`,
  });
}

export async function sendPropertyStatusEmail(
  to: string,
  name: string,
  propertyTitle: string,
  status: 'approved' | 'rejected',
  reason?: string
): Promise<void> {
  const isApproved = status === 'approved';
  await send({
    sender: FROM,
    to: [{ email: to, name }],
    subject: `Your property "${propertyTitle}" has been ${isApproved ? 'approved ✅' : 'rejected ❌'}`,
    htmlContent: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:${isApproved ? '#16a34a' : '#dc2626'}">${isApproved ? '🎉 Property Approved!' : '❌ Property Rejected'}</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your property <strong>"${propertyTitle}"</strong> has been <strong>${status}</strong>.</p>
        ${reason ? `<p style="background:#fef2f2;border-left:4px solid #dc2626;padding:12px;border-radius:4px"><strong>Reason:</strong> ${reason}</p>` : ''}
        ${isApproved ? `<a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/seller" style="display:inline-block;padding:12px 24px;background:#6d28d9;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">View Listing</a>` : ''}
        <p style="color:#888;margin-top:24px;font-size:13px">Upfoxx Floors Team</p>
      </div>`,
  });
}

/* ─── Inquiry Emails ──────────────────────────────────────────────────────── */

export async function sendInquiryNotificationEmail(
  sellerEmail: string,
  sellerName: string,
  propertyTitle: string,
  buyer: { name: string; email: string; phone: string; message: string }
): Promise<void> {
  await send({
    sender: FROM,
    to: [{ email: sellerEmail, name: sellerName }],
    subject: `New Inquiry on "${propertyTitle}"`,
    htmlContent: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1e3a5f">New Inquiry Received</h2>
        <p>Someone is interested in your property <strong>"${propertyTitle}"</strong>:</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666">Name</td><td style="font-weight:600">${buyer.name}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td><td><a href="mailto:${buyer.email}">${buyer.email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#666">Phone</td><td>${buyer.phone}</td></tr>
          <tr><td style="padding:8px 0;color:#666;vertical-align:top">Message</td><td>${buyer.message}</td></tr>
        </table>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/seller" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#6d28d9;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">View in Dashboard</a>
      </div>`,
  });
}

/* ─── Contact Emails ─────────────────────────────────────────────────────── */

export async function sendContactAutoReply(to: string, name: string): Promise<void> {
  await send({
    sender: FROM,
    to: [{ email: to, name }],
    subject: 'We received your message – Upfoxx Floors',
    htmlContent: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1e3a5f">Thanks for reaching out, ${name}!</h2>
        <p>We've received your message and our team will get back to you within <strong>24 hours</strong>.</p>
        <p style="color:#888;margin-top:24px;font-size:13px">Upfoxx Floors · Civil Lines, Bareilly</p>
      </div>`,
  });
}

export async function sendContactAdminAlert(submission: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<void> {
  await send({
    sender: FROM,
    to: [{ email: ADMIN_EMAIL, name: 'Admin' }],
    subject: `New Contact Form Submission from ${submission.name}`,
    htmlContent: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1e3a5f">New Contact Form Submission</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666">Name</td><td><strong>${submission.name}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td><td>${submission.email}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Phone</td><td>${submission.phone}</td></tr>
          <tr><td style="padding:8px 0;color:#666;vertical-align:top">Message</td><td>${submission.message}</td></tr>
        </table>
      </div>`,
  });
}

/* ─── Partner Emails ─────────────────────────────────────────────────────── */

export async function sendPartnerAutoReply(to: string, name: string): Promise<void> {
  await send({
    sender: FROM,
    to: [{ email: to, name }],
    subject: 'Partner Application Received – Upfoxx Floors',
    htmlContent: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1e3a5f">Thank you for your interest, ${name}!</h2>
        <p>We've received your partnership application. Our team will review it and get back to you within <strong>2 business days</strong>.</p>
        <p style="color:#888;margin-top:24px;font-size:13px">Upfoxx Floors · Civil Lines, Bareilly</p>
      </div>`,
  });
}

export async function sendPartnerAdminAlert(submission: {
  fullName: string;
  email: string;
  organization: string;
  partnershipType: string;
}): Promise<void> {
  await send({
    sender: FROM,
    to: [{ email: ADMIN_EMAIL, name: 'Admin' }],
    subject: `New Partner Application: ${submission.fullName}`,
    htmlContent: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1e3a5f">New Partner Application</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666">Name</td><td><strong>${submission.fullName}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td><td>${submission.email}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Organization</td><td>${submission.organization}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Type</td><td>${submission.partnershipType}</td></tr>
        </table>
      </div>`,
  });
}

/* ─── Newsletter Emails ──────────────────────────────────────────────────── */

export async function sendNewsletterWelcome(to: string): Promise<void> {
  await send({
    sender: FROM,
    to: [{ email: to }],
    subject: "You're subscribed to Upfoxx Floors updates! 🏡",
    htmlContent: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1e3a5f">Subscription Confirmed!</h2>
        <p>You'll now receive the latest property listings, market insights, and news from Upfoxx Floors.</p>
        <p style="color:#888;margin-top:24px;font-size:13px">You can unsubscribe at any time · Upfoxx Floors, Bareilly</p>
      </div>`,
  });
}
