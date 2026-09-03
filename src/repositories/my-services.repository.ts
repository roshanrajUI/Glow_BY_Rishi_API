import { Service } from "typedi";
import dbConfig from "../config/db.config";
import MyService from "../models/entities/my-services.entity";
import { ServiceCreate } from "../models/interfaces/common-interfaces";
import { ApiError } from "../models/api.error";

@Service()
export default class ServicesRepository {
  private readonly serviceRepo = dbConfig.getRepository(MyService);

  async createService(
    service: ServiceCreate,
    image: Express.Multer.File,
  ): Promise<boolean> {
    const isServiceExist = await this.isServiceExist(service.serviceName);
    const { serviceName, description, price } = service;
    if (isServiceExist) {
      throw new ApiError(409, `Service with ${serviceName} already exists`);
    }

    if (!image) {
      throw new ApiError(400, "Service image is required");
    }

    const imageUrl = `/uploads/services/${image.filename}`;

    const created = await this.serviceRepo.save({
      serviceName,
      price,
      description,
      categoryId: service.categoryId,
      imageUrl,
    });

    return !!created;
  }

  async updateService(
    serviceId: string,
    service: ServiceCreate,
    image?: Express.Multer.File,
  ): Promise<Boolean> {
    const { serviceName, description, price } = service;
    const existingService = await this.serviceRepo.findOne({
      where: { serviceId, isActive: true },
    });

    if (!existingService) {
      throw new ApiError(409, `Service does not exists`);
    }

    let imageUrl = existingService.imageUrl;
    if (image) {
      const newImageUrl = `/uploads/services/${image.filename}`;
      imageUrl =
        existingService.imageUrl !== newImageUrl
          ? newImageUrl
          : existingService.imageUrl;
    }

    const updated = await this.serviceRepo.update(
      { serviceId },
      { serviceName, price, description, imageUrl },
    );
    return updated.affected === 1;
  }

  async deleteService(serviceId: string): Promise<Boolean> {
    const isServiceExist = await this.isServiceExist(serviceId);
    if (!isServiceExist) {
      throw new ApiError(409, "Service Not Found");
    }
    const deleted = await this.serviceRepo.update(
      { serviceId },
      { isActive: false },
    );
    return deleted.affected === 1;
  }

  getAllServices(): Promise<MyService[]> {
    return this.serviceRepo.find({
      where: {
        isActive: true,
      },
      relations: { category: true },
    });
  }

  getServicesByCategory(categoryId: string): Promise<MyService[]> {
    return this.serviceRepo.find({
      where: {
        categoryId,
        isActive: true,
      },
      relations: { category: true },
    });
  }

  async isServiceExist(serviceId: string): Promise<Boolean> {
    const service = await this.serviceRepo.findOne({
      where: {
        serviceId,
      },
    });
    return !!service;
  }

  async isServiceNameExist(serviceName: string): Promise<Boolean> {
    const isServiceExist = await this.serviceRepo.findOne({
      where: {
        serviceName: serviceName,
      },
    });
    return !!isServiceExist;
  }
}
