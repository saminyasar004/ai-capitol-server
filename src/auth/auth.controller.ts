import { JoiValidationPipe } from "@/pipes/joi-validation.pipe";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  LoginDto,
  loginSchema,
  RequestResetPasswordDto,
  verifyOtpSchema,
  SignupDto,
  signupSchema,
  VerifyOTPDto,
  requestResetPasswordSchema,
  ResetPasswordDto,
  resetPasswordSchema,
} from "src/dto/auth.dto";
import { ResponseProps } from "src/interfaces";
import { AuthService } from "./auth.service";
import {
  comparePassword,
  generateJWTToken,
  generateOTP,
  hashedPassword,
} from "@/lib";
import { OtpService } from "@/otp/otp.service";
import { EmailService } from "@/email/email.service";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
  ) {}

  @Get("/isAdminExists")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Check if admin exists" })
  @ApiResponse({
    status: 200,
    description: "Admin exists.",
    type: VerifyOTPDto,
  })
  @ApiResponse({ status: 401, description: "Invalid credentials." })
  @ApiResponse({ status: 500, description: "Internal server side error." })
  async isAdminExists() {
    try {
      const isAdminExists = await this.authService.getAdmins();
      if (isAdminExists === null) {
        return {
          status: 500,
          message: "Internal server side error.",
        };
      }

      if (isAdminExists.length > 0) {
        return {
          status: 400,
          message: "Admin already exists, please login.",
        };
      }

      return {
        status: 200,
        message: "Admin does not exist.",
      };
    } catch (err) {
      console.log(err.message);
      return {
        status: 500,
        message: err.message,
      };
    }
  }

  @Post("signup")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Creates admin (signup)" })
  @ApiBody({ type: SignupDto }) // Specify the request body schema
  @ApiResponse({
    status: 201,
    description: "Successfully signed up, returns JWT token.",
  })
  @ApiResponse({ status: 401, description: "Invalid credentials." })
  @ApiResponse({ status: 400, description: "Admin already exists." })
  @ApiResponse({ status: 500, description: "Internal server side error." })
  async signup(
    @Body(new JoiValidationPipe(signupSchema)) payload: SignupDto,
  ): Promise<ResponseProps> {
    try {
      const isAdminExists = await this.authService.getAdmins();
      if (isAdminExists === null) {
        return {
          status: 500,
          message: "Internal server side error.",
        };
      }

      if (isAdminExists.length > 0) {
        return {
          status: 400,
          message: "Admin already exists, please login.",
        };
      }

      const adminData = {
        name: payload.name,
        email: payload.email,
        password: await hashedPassword(payload.password),
      };

      const admin = await this.authService.createAdmin(adminData);

      if (!admin) {
        return {
          status: 500,
          message: "Error creating admin. Please try again later.",
        };
      }

      //   create jwt token
      const token = generateJWTToken({
        adminId: admin.adminId,
        name: admin.name,
        email: admin.email,
      });

      const { password, ...rest } = admin.toJSON();

      return {
        status: 201,
        message: "Successfully signed up, returns JWT token.",
        data: {
          admin: rest,
          token,
        },
      };
    } catch (err) {
      console.log(err.message);

      return {
        status: 500,
        message: err.message,
      };
    }
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login admin" })
  @ApiBody({ type: LoginDto }) // Specify the request body schema
  @ApiResponse({
    status: 200,
    description: "Successfully logged in, returns JWT token.",
  })
  @ApiResponse({ status: 401, description: "Invalid credentials." })
  @ApiResponse({ status: 500, description: "Internal server side error." })
  async login(
    @Body(new JoiValidationPipe(loginSchema)) payload: LoginDto,
  ): Promise<ResponseProps> {
    try {
      const admin = await this.authService.getAdminByEmail(payload.email);
      if (!admin) {
        return {
          status: 401,
          message: "Invalid credentials, please try again.",
        };
      }

      //   compare password
      const isPasswordCorrect = await comparePassword(
        payload.password,
        admin.password,
      );
      if (!isPasswordCorrect) {
        return {
          status: 401,
          message: "Invalid credentials, please try again.",
        };
      }

      //   create jwt token
      const token = generateJWTToken({
        adminId: admin.adminId,
        name: admin.name,
        email: admin.email,
      });

      const { password, ...rest } = admin.toJSON();

      return {
        status: 200,
        message: "Successfully logged in, returns JWT token.",
        data: {
          admin: rest,
          token,
        },
      };
    } catch (err) {
      console.log(err.message);

      return {
        status: 500,
        message: err.message,
      };
    }
  }

  @Post("request-reset-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Request reset password" })
  @ApiBody({ type: RequestResetPasswordDto }) // Specify the request body schema
  @ApiResponse({
    status: 200,
    description: "Successfully requested reset password.",
  })
  @ApiResponse({ status: 401, description: "Invalid credentials." })
  @ApiResponse({ status: 500, description: "Internal server side error." })
  async requestResetPassword(
    @Body(new JoiValidationPipe(requestResetPasswordSchema))
    payload: RequestResetPasswordDto,
  ): Promise<ResponseProps> {
    try {
      const admin = await this.authService.getAdminByEmail(payload.email);
      if (!admin) {
        return {
          status: 401,
          message: "Admin is not found, please try again.",
        };
      }

      // generate otp
      const otp = generateOTP(4);

      await this.otpService.createOtp(admin.adminId, otp);

      // send otp email
      await this.emailService.sendOtpEmail(admin.email, otp);

      return {
        status: 200,
        message: "OTP sent successfully, please check your email.",
        data: {
          adminId: admin.adminId,
        },
      };
    } catch (err) {
      console.log(err.message);
      return {
        status: 500,
        message: err.message,
      };
    }
  }

  @Post("verify-otp")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify OTP" })
  @ApiBody({ type: VerifyOTPDto }) // Specify the request body schema
  @ApiResponse({
    status: 200,
    description: "Successfully verified otp.",
    type: VerifyOTPDto,
  })
  @ApiResponse({ status: 401, description: "Invalid otp." })
  @ApiResponse({ status: 500, description: "Internal server side error." })
  async verifyOTP(
    @Body(new JoiValidationPipe(verifyOtpSchema))
    payload: VerifyOTPDto,
  ) {
    try {
      const otp = await this.otpService.verifyOtp(payload.otp, payload.adminId);
      if (!otp) {
        return {
          status: 401,
          message: "Invalid OTP, please try again.",
          data: {
            isVerified: false,
          },
        };
      }

      return {
        status: 200,
        message: "OTP verified successfully.",
        data: {
          isVerified: true,
        },
      };
    } catch (err) {
      console.log(err.message);
      return {
        status: 500,
        message: err.message,
      };
    }
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Reset password" })
  @ApiBody({ type: ResetPasswordDto }) // Specify the request body schema
  @ApiResponse({
    status: 200,
    description: "Successfully reset password.",
  })
  @ApiResponse({ status: 401, description: "Invalid credentials." })
  @ApiResponse({ status: 500, description: "Internal server side error." })
  async resetPassword(
    @Body(new JoiValidationPipe(resetPasswordSchema))
    payload: ResetPasswordDto,
  ) {
    try {
      const admin = await this.authService.getAdminById(payload.adminId);
      if (!admin) {
        return {
          status: 401,
          message: "Admin is not found, please try again.",
        };
      }

      const newPassword = await hashedPassword(payload.newPassword);

      const isUpdated = await this.authService.updateAdmin(payload.adminId, {
        ...admin.toJSON(),
        password: newPassword,
      });

      if (!isUpdated) {
        return {
          status: 500,
          message: "Error updating admin. Please try again later.",
        };
      }

      return {
        status: 200,
        message: "Password reset successfully.",
      };
    } catch (err) {
      console.log(err.message);
      return {
        status: 500,
        message: err.message,
      };
    }
  }
}
