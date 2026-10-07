import { CategoryService } from "../services/category.service";
import Category from "../models/entities/service-category.entity";
import {
  CategoryCreate,
  CategoryUpdate,
} from "../models/interfaces/common-interfaces";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  public async updateCategory(
    categoryId: string,
    categoryName: string,
    description: string | undefined,
    imageUrl: File | undefined,
  ): Promise<Boolean> {
    const category: CategoryUpdate = {
      categoryName,
      description,
      imageUrl,
    };
    return await this.categoryService.updateCategory(categoryId, category);
  }

  public async deleteCategory(categoryId: string): Promise<Boolean> {
    return await this.categoryService.deleteCategory(categoryId);
  }

  public async createCategory(
    categoryName: string,
    description: string,
    imageUrl: File,
  ): Promise<Category> {
    const category: CategoryCreate = {
      categoryName,
      description,
      imageUrl,
    };
    return await this.categoryService.createCategory(category);
  }

  public async getAllCategories(): Promise<Category[]> {
    return await this.categoryService.getAllCategories();
  }
}
