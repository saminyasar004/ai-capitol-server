import dotenv from "dotenv";
dotenv.config();

export const port: number = parseInt(process.env.PORT || "3000");
export const dbConnectionString: string =
  process.env.DB_CONNECTION_STRING || "";
export const jwtSecret: string = process.env.JWT_SECRET || "";
export const jwtExpiresIn: number = parseInt(process.env.JWT_EXPIRES_IN || "");
