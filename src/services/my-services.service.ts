import { Service } from "typedi";
import ServicesRepository from "../repositories/my-services.repository";
import MyService from "../models/entities/my-services.entity";

@Service()
export default class ServicesService {
  constructor(private readonly servicesRepository: ServicesRepository) {}

  getAllServices(): Promise<MyService[]> {
    return this.servicesRepository.getAllServices();
  }
}
