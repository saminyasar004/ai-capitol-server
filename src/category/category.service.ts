import { CreateCategoryDto } from "@/dto/category.dto";
import Category from "@/model/category.model";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoryService {
  async createCategory(
    categoryData: CreateCategoryDto,
  ): Promise<Category | null> {
    try {
      return await Category.create(categoryData);
    } catch (err) {
      console.log(err.message);
      return null;
    }
  }

  async getCategories(): Promise<Category[] | null> {
    try {
      return Category.findAll();
    } catch (err) {
      console.log(err.message);
      return null;
    }
  }
}
