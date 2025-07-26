import { ApiProperty } from "@nestjs/swagger";
import Joi from "joi";

export class CreateCategoryDto {
  @ApiProperty({ description: "The category title", example: "Most Popular" })
  title: string;
}

export const createCategorySchema = Joi.object({
  title: Joi.string().min(2).required().messages({
    "string.min": "Title must be at least 2 characters long",
    "any.required": "Title is required",
  }),
});
