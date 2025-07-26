import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure Nodemailer transporter (use a real SMTP service in production)
    this.transporter = nodemailer.createTransport({
      host: "dpmsign.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "no-reply@dpmsign.com",
        pass: "dpmsign@54321",
      },
    });
  }

  async sendOtpEmail(to: string, otp: string): Promise<void> {
    const mailOptions = {
      from: '"AI Capitol" <no-reply@dpmsign.com>', // Sender address
      to, // Recipient email
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
      html: `<p>Your OTP for password reset is: <b>${otp}</b>. It is valid for 10 minutes.</p>`,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`OTP email sent to ${to}`);
    } catch (error) {
      console.error("Error sending email:", error.message);
      throw new Error("Failed to send OTP email");
    }
  }
}
