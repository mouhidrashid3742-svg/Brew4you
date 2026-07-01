import { NextResponse } from "next/server";
import validator from "validator";
import { getBusinessContactSettings, sendEmailMessage } from "@/lib/communications-server";

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !validator.isEmail(email) || !subject || !message) {
    return NextResponse.json({ error: "Please complete the form with valid values." }, { status: 400 });
  }

  const contactSettings = await getBusinessContactSettings();
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>New contact message from ${name}</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br />")}</p>
      <hr />
      <p>This message was sent from the contact form on ${contactSettings.businessName}.</p>
    </div>
  `;

  await sendEmailMessage({
    to: contactSettings.businessEmail,
    subject: `[Contact Form] ${subject}`,
    html,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
    from: `no-reply@${process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, "") || "9bar.coffee"}`
  });

  return NextResponse.json({ message: "Your message has been received. We will reply soon." });
}
