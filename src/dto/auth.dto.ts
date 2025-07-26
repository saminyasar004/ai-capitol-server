import * as Joi from "joi";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ description: "The admin email", example: "admin@example.com" })
  email: string;

  @ApiProperty({ description: "The admin password", example: "password123" })
  password: string;
}

export class SignupDto {
  @ApiProperty({ description: "The admin name", example: "Stive Smith" })
  name: string;

  @ApiProperty({ description: "The admin email", example: "admin@example.com" })
  email: string;

  @ApiProperty({ description: "The admin password", example: "password123" })
  password: string;
}

export class CategoryAddDto {
  @ApiProperty({ description: "The category name", example: "Most Popular" })
  title: string;
}

export class VerifyOTPDto {
  @ApiProperty({ description: "The OTP", example: "1234" })
  otp: string;

  @ApiProperty({ description: "The admin id", example: 1 })
  adminId: number;
}

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
});

export const signupSchema = Joi.object({
  name: Joi.string().min(2).required().messages({
    "string.min": "Name must be at least 2 characters long",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
});

export class RequestResetPasswordDto {
  @ApiProperty({ description: "The admin email", example: "admin@example.com" })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: "New password", example: "johnDoe@123" })
  newPassword: string;

  @ApiProperty({ description: "The admin id", example: 1 })
  adminId: number;
}

export const requestResetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
});

export const verifyOtpSchema = Joi.object({
  otp: Joi.string(),
  adminId: Joi.number(),
});

export const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
  adminId: Joi.number(),
});
