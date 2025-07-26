import { ResponseProps } from "@/interfaces";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import { JoiValidationPipe } from "@/pipes/joi-validation.pipe";
import { CreateCategoryDto, createCategorySchema } from "@/dto/category.dto";

@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get("")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all category listings." })
  @ApiResponse({
    status: 200,
    description: "Successfully fetched all category listings.",
  })
  @ApiResponse({ status: 500, description: "Internal server side error." })
  async getCategories(): Promise<ResponseProps> {
    try {
      const categories = await this.categoryService.getCategories();
      if (!categories) {
        return {
          status: 500,
          message: "Error fetching categories. Please try again later.",
        };
      }

      return {
        status: 200,
        message: "Categories fetched successfully.",
        data: {
          categories,
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

  @Post("create")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Create new category listing." })
  @ApiResponse({
    status: 201,
    description: "Successfully created the category in listing.",
  })
  @ApiResponse({ status: 500, description: "Internal server side error." })
  async createCategory(
    @Body(new JoiValidationPipe(createCategorySchema))
    payload: CreateCategoryDto,
  ): Promise<ResponseProps> {
    try {
      const category = await this.categoryService.createCategory(payload);
      if (!category) {
        return {
          status: 500,
          message: "Error creating category. Please try again later.",
        };
      }

      return {
        status: 201,
        message: "Category created successfully.",
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
