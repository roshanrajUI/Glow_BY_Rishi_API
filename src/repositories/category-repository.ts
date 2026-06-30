import { Service } from "typedi";
import dbConfig from "../config/db.config";
import Category from "../models/entities/service-category.entity";

@Service()
export default class CategoryRepo {
  private readonly categoryRepo = dbConfig.getRepository(Category);

  getAllCategory(): Promise<Category[]> {
    return this.categoryRepo.findBy({ isActive: true });
  }
}
