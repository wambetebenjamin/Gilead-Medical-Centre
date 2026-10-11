import nodemailer from "mail-transport";

export type AppointmentNotice = {
  patientName: string;
  email: string;
  phone: string;
  department: string;
  doctor: string;
  date: string;
  time: string;
  type: string;
  packageName?: string;
  id: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
}

function getTransporter() {
  const host = process.env.MAIL_HOST;
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port: Number(process.env.MAIL_PORT ?? "587"),
    secure: process.env.MAIL_SECURE === "true",
    requireTLS: process.env.MAIL_SECURE !== "true",
    disableFileAccess: true,
    disableUrlAccess: true,
    tls: { minVersion: "TLSv1.2" },
    auth: { user, pass },
  });
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}) {
  const transporter = getTransporter();
  if (!transporter || !process.env.MAIL_FROM) return false;
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
    replyTo: input.replyTo,
  });
  return true;
}

export async function sendAppointmentEmails(appointment: AppointmentNotice) {
  const name = escapeHtml(appointment.patientName);
  const department = escapeHtml(appointment.department);
  const doctor = escapeHtml(appointment.doctor);
  const date = escapeHtml(appointment.date);
  const time = escapeHtml(appointment.time);
  const reference = escapeHtml(appointment.id);
  const packageName = appointment.packageName ? escapeHtml(appointment.packageName) : "";
  const packageText = packageName ? `Health package request: ${packageName}\n` : "";
  const packageHtml = packageName ? `<br>Health package request: ${packageName}` : "";
  const patientText = `Your appointment request has been received.\n\n${appointment.department} · ${appointment.doctor}\n${appointment.date} at ${appointment.time}\n${packageText}Reference: ${appointment.id}\n\nIf you need to change your appointment, please contact the centre. For emergencies, call +254 112 272 061.`;
  const patientHtml = `<p>Hello ${name},</p><p>Your appointment request has been received.</p><p><strong>${department}</strong><br>${doctor}<br>${date} at ${time}${packageHtml}</p><p>Reference: ${reference}</p><p>For emergencies, call +254 112 272 061.</p>`;
  const patient = sendEmail({
    to: appointment.email,
    subject: "Your Gilead Medical Centre appointment request",
    text: patientText,
    html: patientHtml,
  });
  const coordinator = process.env.BOOKING_COORDINATOR_EMAIL
    ? sendEmail({
        to: process.env.BOOKING_COORDINATOR_EMAIL,
        subject: `New appointment request · ${appointment.department}`,
        text: `A new appointment request was received.\nReference: ${appointment.id}\nPatient: ${appointment.patientName}\nPhone: ${appointment.phone}\nDepartment: ${appointment.department}\nClinician: ${appointment.doctor}\nRequested time: ${appointment.date} ${appointment.time}\nType: ${appointment.type}\n${packageText}`,
      })
    : Promise.resolve(false);
  const [patientSent, coordinatorSent] = await Promise.all([patient, coordinator]);
  return { patientSent, coordinatorSent };
}

export async function sendWhatsAppConfirmation(appointment: AppointmentNotice) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!accessToken || !phoneNumberId) return false;
  const phone = appointment.phone.replace(/[^\d]/g, "");
  const endpoint = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION ?? "v21.0"}/${phoneNumberId}/messages`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: phone,
      type: "text",
      text: {
        body: `Gilead Medical Centre: your appointment request (${appointment.id}) for ${appointment.department} is received for ${appointment.date} at ${appointment.time}. For urgent help call +254 112 272 061.`,
      },
    }),
    cache: "no-store",
  });
  return response.ok;
}
