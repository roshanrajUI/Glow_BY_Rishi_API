import { Service } from "typedi";
import Category from "../models/entities/service-category.entity";
import CategoryRepo from "../repositories/category-repository";

@Service()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepo) {}

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepo.getAllCategory();
  }
}
