import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


export async function POST(req) {
  try {
    const { name, email, subject, message } = await req.json();

    // Setup transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g. smtp.gmail.com
      port: Number(process.env.SMTP_PORT), // 465 or 587
      secure: process.env.SMTP_SECURE === "true", // true if port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.RECEIVER_EMAIL, // your email
      subject: subject || "New Contact Form Message",
      text: message,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    return Response.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Email error:", err);
    return Response.json({ success: false, message: "Failed to send email" }, { status: 500 });
  }
}