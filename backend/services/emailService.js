import transporter from "../config/nodemailer.js";

export const sendOrderEmail = async ({ email, orderId, total }) => {
  if (!email) return;

  await transporter.sendMail({
    from: process.env.SENDER_EMAIL || process.env.SMTP_USER,
    to: email,
    subject: "Order Confirmed",
    html: `
      <h2>Order Confirmed</h2>
      <p>Order ID: ${orderId}</p>
      <p>Total: $${total}</p>
    `,
  });
};
