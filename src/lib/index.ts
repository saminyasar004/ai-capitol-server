import { jwtExpiresIn, jwtSecret } from "@/config/dotenv.config";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const hashedPassword = async (password: string): Promise<string> => {
  const saltRound = 10;
  try {
    return await bcrypt.hash(password, saltRound); // Hash the password
  } catch (err: any) {
    console.log("Error occured while hashing password: ".red, err.message);
    console.log(err);
    throw err;
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (err: any) {
    console.log("Error occured while comparing password: ".red, err.message);
    throw err;
  }
};

export const generateJWTToken = (payload: {}): string => {
  try {
    return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn as any });
  } catch (err: any) {
    console.log("Error occured while generating token: ".red, err.message);
    throw err;
  }
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (err: any) {
    console.log("Error occured while verifying token: ".red, err.message);
    throw err;
  }
};

export const generateOTP = (length: number = 6): string => {
  if (length < 4) length = 4;

  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digits.length); // Get a random index
    otp += digits[randomIndex]; // Append the digit to the OTP
  }

  return otp;
};
