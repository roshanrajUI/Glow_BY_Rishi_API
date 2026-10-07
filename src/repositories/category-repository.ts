import Category from "../models/entities/service-category.entity";
import {
  CategoryCreate,
  CategoryUpdate,
} from "../models/interfaces/common-interfaces";
import { ApiError } from "../models/api.error";
import { execute, fetchAll, fetchOne, newId, nowIso, toBool } from "../lib/db";
import { saveImageToR2 } from "../lib/image-upload";

interface CategoryRow {
  category_id: string;
  category_name: string;
  image_url: string;
  description: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

function mapCategory(row: CategoryRow): Category {
  return {
    categoryId: row.category_id,
    categoryName: row.category_name,
    imageUrl: row.image_url,
    description: row.description ?? undefined,
    isActive: toBool(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const CATEGORY_SELECT = "SELECT * FROM service_category";

export default class CategoryRepo {
  constructor(
    private readonly db: D1Database,
    private readonly uploads: R2Bucket,
  ) {}

  async createCategory(category: CategoryCreate): Promise<Category> {
    const { categoryName, description, imageUrl: image } = category;

    await this.isCategoryNameExist(categoryName);

    if (!image) {
      throw new ApiError(400, "Service image is required");
    }

    const imageUrl = await saveImageToR2(this.uploads, "categories", image);
    const categoryId = newId();
    const now = nowIso();

    await execute(
      this.db,
      `INSERT INTO service_category (category_id, category_name, image_url, description, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, 1, ?, ?)`,
      [categoryId, categoryName, imageUrl, description ?? null, now, now],
    );

    return mapCategory((await fetchOne<CategoryRow>(this.db, `${CATEGORY_SELECT} WHERE category_id = ?`, [categoryId]))!);
  }

  async getAllCategory(): Promise<Category[]> {
    const rows = await fetchAll<CategoryRow>(
      this.db,
      `${CATEGORY_SELECT} WHERE is_active = 1 ORDER BY created_at ASC`,
    );
    const categories = rows.map(mapCategory);

    const services = await fetchAll<{
      service_id: string;
      service_name: string;
      price: number;
      description: string | null;
      category_id: string;
      image_url: string;
      is_active: number;
      created_at: string;
      updated_at: string;
    }>(this.db, "SELECT * FROM services WHERE is_active = 1");

    for (const category of categories) {
      category.services = services
        .filter((service) => service.category_id === category.categoryId)
        .map((service) => ({
          serviceId: service.service_id,
          serviceName: service.service_name,
          price: service.price,
          description: service.description ?? undefined,
          categoryId: service.category_id,
          imageUrl: service.image_url,
          isActive: toBool(service.is_active),
          createdAt: service.created_at,
          updatedAt: service.updated_at,
        }));
    }

    return categories;
  }

  async updateCategory(categoryId: string, category: CategoryUpdate): Promise<Boolean> {
    if (!categoryId) {
      throw new ApiError(409, "Category Not Found");
    }
    const { categoryName, description, imageUrl } = category;

    const extCategory = await this.getCategoryById(categoryId);
    if (!extCategory) {
      throw new ApiError(409, "Category Not Found");
    }

    const exsCt = await fetchOne<CategoryRow>(this.db, `${CATEGORY_SELECT} WHERE category_name = ?`, [categoryName]);
    if (exsCt && exsCt.category_id !== categoryId) {
      throw new ApiError(409, `Category Already Exists With ${categoryName}`);
    }

    let newImageUrl = extCategory.imageUrl;
    if (imageUrl) {
      newImageUrl = await saveImageToR2(this.uploads, "categories", imageUrl);
    }

    await execute(
      this.db,
      `UPDATE service_category SET category_name = ?, image_url = ?, description = ?, updated_at = ? WHERE category_id = ?`,
      [categoryName, newImageUrl, description ?? extCategory.description ?? null, nowIso(), categoryId],
    );

    return true;
  }

  async deleteCategory(categoryId: string): Promise<boolean> {
    const isCategoryExist = await this.isCategoryExist(categoryId);
    if (!isCategoryExist) {
      throw new ApiError(409, "Category Not Found");
    }
    await execute(this.db, `UPDATE service_category SET is_active = 0, updated_at = ? WHERE category_id = ?`, [
      nowIso(),
      categoryId,
    ]);
    return true;
  }

  async isCategoryExist(categoryId: string): Promise<Boolean> {
    const result = await fetchOne<CategoryRow>(
      this.db,
      `${CATEGORY_SELECT} WHERE category_id = ? AND is_active = 1`,
      [categoryId],
    );
    return !!result;
  }

  async isCategoryNameExist(categoryName: string): Promise<Boolean> {
    const isCategoryExist = await fetchOne<CategoryRow>(this.db, `${CATEGORY_SELECT} WHERE category_name = ?`, [
      categoryName,
    ]);

    if (isCategoryExist) {
      throw new ApiError(409, `Category Already Exists With ${categoryName}`);
    }
    return !!isCategoryExist;
  }

  async getCategoryById(categoryId: string): Promise<Category> {
    const result = await fetchOne<CategoryRow>(this.db, `${CATEGORY_SELECT} WHERE category_id = ?`, [categoryId]);

    if (!result) {
      throw new ApiError(402, "Category Not Found");
    }

    return mapCategory(result);
  }
}
