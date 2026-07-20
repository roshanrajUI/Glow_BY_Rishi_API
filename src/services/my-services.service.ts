import { Service } from "typedi";
import ServicesRepository from "../repositories/my-services.repository";
import MyService from "../models/entities/my-services.entity";
import { ServiceCreate } from "../models/interfaces/common-interfaces";

@Service()
export default class ServicesService {
  constructor(private readonly servicesRepository: ServicesRepository) {}

  createService(service: ServiceCreate): Promise<Boolean> {
    return this.servicesRepository.createService(service);
  }

  updateService(serviceId: string, service: ServiceCreate): Promise<Boolean> {
    return this.servicesRepository.updateService(serviceId, service);
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
