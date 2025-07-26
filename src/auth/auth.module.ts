import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { OtpService } from "@/otp/otp.service";
import { EmailService } from "@/email/email.service";

@Module({
  providers: [AuthService, OtpService, EmailService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
