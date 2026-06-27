import { NextRequest, NextResponse } from "next/server";

interface OrderNotification {
  orderId: string;
  customerName: string;
  customerPhone: string;
  items: Array<{
    name: string;
    quantity: number;
    subtotal: number;
  }>;
  totalAmount: number;
  deliveryAddress: {
    address: string;
    city: string;
    zipCode: string;
    label?: string;
  };
  notes?: string;
}

// Send WhatsApp notification to admin
async function sendWhatsAppNotification(order: OrderNotification) {
  try {
    const adminPhone = process.env.NEXT_PUBLIC_WHATSAPP || "923000000000";
    const itemsList = order.items.map((item) => `• ${item.name} x${item.quantity}`).join("\n");

    const message = `
🎉 *NEW ORDER RECEIVED!* 🎉

📋 *Order ID:* ${order.orderId}
👤 *Customer:* ${order.customerName}
📱 *Phone:* ${order.customerPhone}

📦 *Items:*
${itemsList}

💰 *Total:* PKR ${order.totalAmount}

📍 *Delivery Address:*
${order.deliveryAddress.address}
${order.deliveryAddress.city} ${order.deliveryAddress.zipCode}

${order.notes ? `📝 *Notes:* ${order.notes}` : ""}

👆 Tap the order ID to view full details
    `.trim();

    // Try to use Twilio if configured and available, otherwise log for demo
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_NUMBER) {
      try {
        // @ts-ignore - optional dependency
        const twilio = (await import("twilio")).default;
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        await client.messages.create({
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:+${adminPhone}`,
          body: message
        });
      } catch (error) {
        console.log("Twilio not installed, running in demo mode");
      }
    } else {
      // Demo mode - log the message
      console.log("📱 [WhatsApp Notification - Demo Mode]");
      console.log(`To: +${adminPhone}`);
      console.log(message);
    }

    return { success: true };
  } catch (error) {
    console.error("WhatsApp notification error:", error);
    return { success: false, error };
  }
}

// Send Email notification to admin
async function sendEmailNotification(order: OrderNotification) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@9bar.coffee";
    const itemsList = order.items.map((item) => `<li>${item.name} x${item.quantity} - PKR ${item.subtotal}</li>`).join("");

    const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; }
    .container { max-width: 600px; margin: 20px auto; background: white; padding: 20px; border-radius: 8px; }
    .header { background: #d4af37; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    .order-id { font-size: 24px; font-weight: bold; }
    .section { margin-bottom: 20px; }
    .label { font-weight: bold; color: #333; }
    .value { color: #666; margin-left: 10px; }
    .items { border: 1px solid #ddd; padding: 10px; border-radius: 5px; }
    .items li { margin: 5px 0; }
    .total { font-size: 20px; font-weight: bold; color: #d4af37; padding: 15px; background: #f9f9f9; border-radius: 5px; }
    .button { display: inline-block; background: #d4af37; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      🎉 NEW ORDER RECEIVED! 🎉
    </div>

    <div class="section">
      <div class="order-id">Order #${order.orderId}</div>
    </div>

    <div class="section">
      <div><span class="label">Customer Name:</span><span class="value">${order.customerName}</span></div>
      <div><span class="label">Phone:</span><span class="value">${order.customerPhone}</span></div>
    </div>

    <div class="section">
      <div class="label">Items:</div>
      <div class="items">
        <ul>${itemsList}</ul>
      </div>
    </div>

    <div class="section">
      <div><span class="label">Delivery Address:</span></div>
      <div class="value">
        ${order.deliveryAddress.address}<br>
        ${order.deliveryAddress.city} ${order.deliveryAddress.zipCode}
      </div>
    </div>

    ${order.notes ? `<div class="section"><div><span class="label">Special Notes:</span><span class="value">${order.notes}</span></div></div>` : ""}

    <div class="total">
      Total Amount: PKR ${order.totalAmount}
    </div>

    <div style="text-align: center; margin-top: 20px;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://9bar.coffee"}/admin/orders" class="button">View Order Details</a>
    </div>
  </div>
</body>
</html>
    `;

    // Try to send email if configured and available
    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.SMTP_HOST) {
      try {
        // @ts-ignore - optional dependency
        const nodemailer = (await import("nodemailer")).default;
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
          }
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || "orders@9bar.coffee",
          to: adminEmail,
          subject: `🎉 New Order Received - ${order.orderId}`,
          html: emailBody
        });
      } catch (error) {
        console.log("Nodemailer not installed, running in demo mode");
      }
    } else {
      // Demo mode - log the email
      console.log("📧 [Email Notification - Demo Mode]");
      console.log(`To: ${adminEmail}`);
      console.log(`Subject: New Order Received - ${order.orderId}`);
      console.log(emailBody);
    }

    return { success: true };
  } catch (error) {
    console.error("Email notification error:", error);
    return { success: false, error };
  }
}

export async function POST(request: NextRequest) {
  try {
    const order: OrderNotification = await request.json();

    // Validate required fields
    if (!order.orderId || !order.customerName || !order.customerPhone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send both notifications in parallel
    const [whatsappResult, emailResult] = await Promise.all([
      sendWhatsAppNotification(order),
      sendEmailNotification(order)
    ]);

    return NextResponse.json({
      success: true,
      whatsapp: whatsappResult,
      email: emailResult,
      message: "Notifications sent to admin"
    });
  } catch (error) {
    console.error("Notification endpoint error:", error);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}
