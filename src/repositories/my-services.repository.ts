import MyService from "../models/entities/my-services.entity";
import {
  ServiceCreate,
  ServiceUpdate,
} from "../models/interfaces/common-interfaces";
import { ApiError } from "../models/api.error";
import { execute, fetchAll, fetchOne, newId, nowIso, toBool } from "../lib/db";
import { saveImageToR2 } from "../lib/image-upload";

interface ServiceRow {
  service_id: string;
  service_name: string;
  price: number;
  description: string | null;
  category_id: string;
  image_url: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  category_name?: string;
  category_image_url?: string;
  category_description?: string | null;
}

function mapService(row: ServiceRow): MyService {
  return {
    serviceId: row.service_id,
    serviceName: row.service_name,
    price: row.price,
    description: row.description ?? undefined,
    categoryId: row.category_id,
    imageUrl: row.image_url,
    isActive: toBool(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    category: row.category_name
      ? ({
          categoryId: row.category_id,
          categoryName: row.category_name,
          imageUrl: row.category_image_url ?? "",
          description: row.category_description ?? undefined,
          isActive: true,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        } as any)
      : undefined,
  };
}

const SERVICE_SELECT_WITH_CATEGORY = `
  SELECT s.*, c.category_name AS category_name, c.image_url AS category_image_url, c.description AS category_description
  FROM services s
  LEFT JOIN service_category c ON c.category_id = s.category_id
`;

export default class ServicesRepository {
  constructor(
    private readonly db: D1Database,
    private readonly uploads: R2Bucket,
  ) {}

  async createService(service: ServiceCreate, image: File): Promise<boolean> {
    const { serviceName, description, price } = service;

    await this.isServiceNameExist(serviceName);
    if (!image) {
      throw new ApiError(400, "Service image is required");
    }

    const imageUrl = await saveImageToR2(this.uploads, "services", image);
    const serviceId = newId();
    const now = nowIso();

    await execute(
      this.db,
      `INSERT INTO services (service_id, service_name, price, description, category_id, image_url, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      [serviceId, serviceName, price, description ?? null, service.categoryId, imageUrl, now, now],
    );

    return true;
  }

  async updateService(serviceId: string, service: ServiceUpdate, image?: File): Promise<Boolean> {
    const { categoryId, serviceName, description, price } = service;
    const existingService = await fetchOne<ServiceRow>(
      this.db,
      "SELECT * FROM services WHERE service_id = ? AND is_active = 1",
      [serviceId],
    );

    if (!existingService) {
      throw new ApiError(409, `Service does not exists`);
    }

    if (serviceName) {
      const extService = await fetchOne<ServiceRow>(this.db, "SELECT * FROM services WHERE service_name = ?", [
        serviceName,
      ]);
      if (extService && extService.service_id !== serviceId) {
        throw new ApiError(409, `Service Already Exists With ${serviceName}`);
      }
    }

    let imageUrl = existingService.image_url;
    if (image) {
      imageUrl = await saveImageToR2(this.uploads, "services", image);
    }

    await execute(
      this.db,
      `UPDATE services SET service_name = ?, category_id = ?, description = ?, price = ?, image_url = ?, updated_at = ?
       WHERE service_id = ?`,
      [
        serviceName ?? existingService.service_name,
        categoryId,
        description ?? null,
        price,
        imageUrl,
        nowIso(),
        serviceId,
      ],
    );

    return true;
  }

  async deleteService(serviceId: string): Promise<Boolean> {
    const isServiceExist = await this.isServiceExist(serviceId);
    if (!isServiceExist) {
      throw new ApiError(409, "Service Not Found");
    }
    await execute(this.db, "UPDATE services SET is_active = 0, updated_at = ? WHERE service_id = ?", [
      nowIso(),
      serviceId,
    ]);
    return true;
  }

  async getAllServices(): Promise<MyService[]> {
    const rows = await fetchAll<ServiceRow>(this.db, `${SERVICE_SELECT_WITH_CATEGORY} WHERE s.is_active = 1`);
    return rows.map(mapService);
  }

  async getServicesByCategory(categoryId: string): Promise<MyService[]> {
    const rows = await fetchAll<ServiceRow>(
      this.db,
      `${SERVICE_SELECT_WITH_CATEGORY} WHERE s.category_id = ? AND s.is_active = 1`,
      [categoryId],
    );
    return rows.map(mapService);
  }

  async isServiceExist(serviceId: string): Promise<Boolean> {
    const service = await fetchOne<ServiceRow>(this.db, "SELECT * FROM services WHERE service_id = ?", [serviceId]);
    return !!service;
  }

  async isServiceNameExist(serviceName: string): Promise<Boolean> {
    const isServiceExist = await fetchOne<ServiceRow>(this.db, "SELECT * FROM services WHERE service_name = ?", [
      serviceName,
    ]);

    if (isServiceExist) {
      throw new ApiError(409, `Service Already Exists With ${serviceName}`);
    }

    return !!isServiceExist;
  }
}
