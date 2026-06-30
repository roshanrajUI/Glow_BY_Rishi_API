import { Service } from "typedi";
import dbConfig from "../config/db.config";
import MyService from "../models/entities/my-services.entity";

@Service()
export default class ServicesRepository {
  private readonly serviceRepo = dbConfig.getRepository(MyService);

  getAllServices(): Promise<MyService[]> {
    return this.serviceRepo.findBy({ isActive: true });
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
}
