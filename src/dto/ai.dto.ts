import { ApiProperty } from "@nestjs/swagger";
import Joi from "joi";

export class CreateAIDto {
  @ApiProperty({ description: "The AI title", example: "Most Popular" })
  title: string;

  @ApiProperty({ description: "The AI description", example: "Most Popular" })
  description: string;

  @ApiProperty({ description: "The AI url", example: "https://www.google.com" })
  url: string;

  @ApiProperty({ description: "The AI upvote", example: 10 })
  upvote: number;

  @ApiProperty({ description: "The AI isFeatured", example: true })
  isFeatured: boolean;

  @ApiProperty({ description: "The AI isTop", example: true })
  isTop: boolean;

  @ApiProperty({ description: "The AI isVerified", example: true })
  isVerified: boolean;

  @ApiProperty({ description: "The AI subscriptionType", example: "Paid" })
  subscriptionType: "paid" | "free" | "freemium";

  @ApiProperty({ description: "The AI categoryId", example: 1 })
  categoryId: number;
}

export const createAISchema = Joi.object({
  title: Joi.string().min(2).required().messages({
    "string.min": "Title must be at least 2 characters long",
    "any.required": "Title is required",
  }),
  description: Joi.string().min(2).required().messages({
    "string.min": "Description must be at least 2 characters long",
    "any.required": "Description is required",
  }),
  url: Joi.string().min(2).required().messages({
    "string.min": "Url must be at least 2 characters long",
    "any.required": "Url is required",
  }),
  upvote: Joi.number().min(2).required().messages({
    "number.min": "Upvote must be at least 2 characters long",
    "any.required": "Upvote is required",
  }),
  isFeatured: Joi.boolean().required().messages({
    "boolean.required": "IsFeatured is required",
  }),
  isTop: Joi.boolean().required().messages({
    "boolean.required": "IsTop is required",
  }),
  isVerified: Joi.boolean().required().messages({
    "boolean.required": "IsVerified is required",
  }),
  subscriptionType: Joi.string().required().messages({
    "string.required": "SubscriptionType is required",
  }),
  categoryId: Joi.number().required().messages({
    "number.required": "CategoryId is required",
  }),
});
