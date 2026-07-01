import connect from "@/lib/mongodb";
import Settings from "@/lib/models/settings";
import { buildWhatsAppLink } from "@/lib/communications";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface BusinessContactSettings {
  businessName: string;
  businessPhone: string;
  businessWhatsApp: string;
  businessEmail: string;
  foodpandaUrl: string;
}

export async function getBusinessContactSettings(): Promise<BusinessContactSettings> {
  await connect();

  const settings = await Settings.findOne({}).lean();

  return {
    businessName: settings?.businessName || "9 BAR",
    businessPhone: settings?.businessPhone || process.env.NEXT_PUBLIC_PHONE || "+923205950705",
    businessWhatsApp: settings?.businessWhatsApp || process.env.NEXT_PUBLIC_WHATSAPP || "923205950705",
    businessEmail: settings?.businessEmail || process.env.ADMIN_EMAIL || process.env.CONTACT_EMAIL || "9bar.pk@gmail.com",
    foodpandaUrl: settings?.foodpandaUrl || process.env.NEXT_PUBLIC_FOODPANDA || "https://www.foodpanda.pk/"
  };
}

export async function sendEmailMessage(payload: EmailPayload) {
  const from = payload.from || process.env.SMTP_FROM || "orders@9bar.coffee";

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    try {
      const nodemailer = (await import("nodemailer")).default;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });

      await transporter.sendMail({
        from,
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
        html: payload.html
      });

      return { success: true, mode: "smtp" };
    } catch (error) {
      console.error("Email send failed:", error);
      return { success: false, mode: "smtp-failed", error };
    }
  }

  console.log("📧 [Email Notification - Demo Mode]");
  console.log(`To: ${payload.to}`);
  console.log(`Subject: ${payload.subject}`);
  console.log(payload.html);

  return { success: true, mode: "demo" };
}

export { buildWhatsAppLink };
