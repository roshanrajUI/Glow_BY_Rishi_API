import { Service } from "typedi";
import dbConfig from "../config/db.config";
import Category from "../models/entities/service-category.entity";
import {
  CategoryCreate,
  CategoryUpdate,
} from "../models/interfaces/common-interfaces";
import { ApiError } from "../models/api.error";

@Service()
export default class CategoryRepo {
  private readonly categoryRepo = dbConfig.getRepository(Category);

  async createCategory(category: CategoryCreate): Promise<Category> {
    const { categoryName, description, imageUrl: image } = category;

    await this.isCategoryNameExist(categoryName);

    if (!image) {
      throw new ApiError(400, "Service image is required");
    }

    const imageUrl = `/uploads/categories/${image.filename}`;

    return this.categoryRepo.save({
      categoryName,
      imageUrl,
      description,
    });
  }

  getAllCategory(): Promise<Category[]> {
    return this.categoryRepo.find({
      where: { isActive: true },
      relations: { services: true },
      order: { createdAt: "ASC" },
    });
  }

  async updateCategory(
    categoryId: string,
    category: CategoryUpdate,
  ): Promise<Boolean> {
    if (!categoryId) {
      throw new ApiError(409, "Category Not Found");
    }
    const { categoryName, description, imageUrl } = category;

    const extCategory = await this.getCategoryById(categoryId);

    if (!extCategory) {
      throw new ApiError(409, "Category Not Found");
    }

    const exsCt = await this.categoryRepo.findOne({
      where: [
        {
          categoryName,
        },
      ],
    });
    if (exsCt && exsCt.categoryId !== categoryId) {
      throw new ApiError(409, `Category Already Exists With ${categoryName}`);
    }
    extCategory.categoryName = categoryName;

    if (imageUrl) {
      const image = `/uploads/categories/${imageUrl.filename}`;
      extCategory.imageUrl = image;
    }

    if (description) {
      extCategory.description = description;
    }
    extCategory.updatedAt = new Date();

    const updated = await this.categoryRepo.update({ categoryId }, extCategory);
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

  async isCategoryNameExist(categoryName: string): Promise<Boolean> {
    const isCategoryExist = await this.categoryRepo.findOne({
      where: [
        {
          categoryName,
        },
      ],
    });

    if (isCategoryExist) {
      throw new ApiError(409, `Category Already Exists With ${categoryName}`);
    }
    return !!isCategoryExist;
  }

  async getCategoryById(categoryId: string): Promise<Category> {
    const result = await this.categoryRepo.findOneBy({
      categoryId,
    });

    if (!result) {
      throw new ApiError(402, "Category Not Found");
    }

    return result;
  }
}
