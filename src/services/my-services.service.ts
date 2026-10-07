import ServicesRepository from "../repositories/my-services.repository";
import MyService from "../models/entities/my-services.entity";
import {
  ServiceCreate,
  ServiceUpdate,
} from "../models/interfaces/common-interfaces";

export default class ServicesService {
  constructor(private readonly servicesRepository: ServicesRepository) {}

  createService(
    service: ServiceCreate,
    imageUrl: File,
  ): Promise<Boolean> {
    return this.servicesRepository.createService(service, imageUrl);
  }

  updateService(
    serviceId: string,
    service: ServiceUpdate,
    imageUrl?: File,
  ): Promise<Boolean> {
    return this.servicesRepository.updateService(serviceId, service, imageUrl);
  }

  deleteService(serviceId: string): Promise<Boolean> {
    return this.servicesRepository.deleteService(serviceId);
  }

  getAllServices(): Promise<MyService[]> {
    return this.servicesRepository.getAllServices();
  }

  getServicesByCategory(categoryId: string): Promise<MyService[]> {
    return this.servicesRepository.getServicesByCategory(categoryId);
  }
}
