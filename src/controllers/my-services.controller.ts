import ServicesService from "../services/my-services.service";
import MyService from "../models/entities/my-services.entity";
import { ServiceCreate } from "../models/interfaces/common-interfaces";

export default class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  public async getAllServices(): Promise<MyService[]> {
    return await this.servicesService.getAllServices();
  }

  public async getServicesByCategory(categoryId: string): Promise<MyService[]> {
    return await this.servicesService.getServicesByCategory(categoryId);
  }

  public async createService(
    serviceName: string,
    price: number,
    description: string,
    categoryId: string,
    imageUrl: File,
  ): Promise<Boolean> {
    const service: ServiceCreate = {
      serviceName,
      price,
      description,
      categoryId,
    };
    return await this.servicesService.createService(service, imageUrl);
  }

  public async updateService(
    serviceId: string,
    serviceName: string,
    price: number,
    description: string,
    categoryId: string,
    imageUrl?: File,
  ): Promise<Boolean> {
    const service: ServiceCreate = {
      serviceName,
      price,
      description,
      categoryId,
    };
    return await this.servicesService.updateService(serviceId, service, imageUrl);
  }

  public async deleteService(serviceId: string): Promise<Boolean> {
    return await this.servicesService.deleteService(serviceId);
  }
}
