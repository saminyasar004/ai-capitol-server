import { OTPAttributes } from "@/interfaces";
import OTP, { OTPCreationAttributes } from "@/model/otp.model";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OtpService {
  async createOtp(adminId: number, otp: string): Promise<OTP | null> {
    try {
      return await OTP.create({ adminId, otp });
    } catch (err) {
      console.log(err.message);
      return null;
    }
  }
  async verifyOtp(otp: string, adminId: number): Promise<OTP | null> {
    try {
      return await OTP.findOne({ where: { otp, adminId } });
    } catch (err) {
      console.log(err.message);
      return null;
    }
  }
}
