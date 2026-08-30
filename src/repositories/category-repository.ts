import { Service } from "typedi";
import dbConfig from "../config/db.config";
import Category from "../models/entities/service-category.entity";
import { CategoryCreate } from "../models/interfaces/common-interfaces";
import { ApiError } from "../models/api.error";

@Service()
export default class CategoryRepo {
  private readonly categoryRepo = dbConfig.getRepository(Category);

  async createCategory(category: CategoryCreate): Promise<Category> {
    const isCategoryExist = await this.categoryRepo.findOne({
      where: [
        {
          categoryName: category.categoryName,
          isActive: true,
        },
      ],
    });

    if (isCategoryExist) {
      throw new ApiError(
        409,
        `Category Already Exists With ${category.categoryName}`,
      );
    }
    return this.categoryRepo.save(category);
  }

  getAllCategory(): Promise<Category[]> {
    return this.categoryRepo.find({
      where: { isActive: true },
      relations: { services: true },
    });
  }

  async updateCategory(
    categoryId: string,
    category: CategoryCreate,
  ): Promise<Boolean> {
    const { categoryName, description, isActive } = category;

    if (!categoryId || !isActive) {
      throw new ApiError(409, "Category Not Found");
    }

    const extCategory = await this.isCategoryExist(categoryId);

    if (!extCategory) {
      throw new ApiError(409, "Category Not Found");
    }

    const updated = await this.categoryRepo.update(
      { categoryId },
      { categoryName, description, updatedAt: new Date() },
    );
    return updated.affected === 1;
  }

  async deleteCategory(categoryId: string): Promise<boolean> {
    const isCategoryExist = await this.isCategoryExist(categoryId);
    if (!isCategoryExist) {
      throw new ApiError(409, "Category Not Found");
    }
    const deleted = await this.categoryRepo.update(
      { categoryId },
      { isActive: false },
    );
    return deleted.affected === 1;
  }

  async isCategoryExist(categoryId: string): Promise<Boolean> {
    const result = await this.categoryRepo.findOne({
      where: {
        categoryId,
        isActive: true,
      },
    });
    return !!result;
  }
}
