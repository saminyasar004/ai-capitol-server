export interface AdminAttributes {
  adminId: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryAttributes {
  categoryId: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIAttributes {
  aiId: number;
  title: string;
  description: string;
  url: string;
  logo: string;
  upvote: number;
  isFeatured: boolean;
  isTop: boolean;
  isVerified: boolean;
  subscriptionType: "Paid" | "Free" | "Freemium";
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OTPAttributes {
  otpId: number;
  adminId: number;
  otp: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResponseProps {
  status: number;
  message: string;
  data?: any;
}
