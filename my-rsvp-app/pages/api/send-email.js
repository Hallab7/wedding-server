import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, attending } = req.body;

  if (!email || !name || !attending) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (attending !== "yes") {
    return res.status(200).json({ message: "No email sent (not attending)" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "RSVP Confirmation",
    text: `Hi ${name},\n\nThank you for confirming your attendance! We look forward to seeing you.\n\nBest regards,\nEvent Organizer`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email Error:", error);
    return res.status(500).json({ error: "Error sending email" });
  }
}
