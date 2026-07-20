import { Service } from "typedi";
import Category from "../models/entities/service-category.entity";
import CategoryRepo from "../repositories/category-repository";
import { CategoryCreate } from "../models/interfaces/common-interfaces";

@Service()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepo) {}

  async createCategory(category: CategoryCreate): Promise<Category> {
    return await this.categoryRepo.createCategory(category);
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepo.getAllCategory();
  }

  async updateCategory(
    categoryId: string,
    category: CategoryCreate,
  ): Promise<Boolean> {
    return await this.categoryRepo.updateCategory(categoryId, category);
  }

  async deleteCategory(categoryId: string) {
    return await this.categoryRepo.deleteCategory(categoryId);
  }
}
