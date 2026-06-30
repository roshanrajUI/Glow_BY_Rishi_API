import { Get, Path, Route, Tags } from "tsoa";
import ServicesService from "../services/my-services.service";
import { Service } from "typedi";
import MyService from "../models/entities/my-services.entity";

@Service()
@Route("api/services")
@Tags("My Services")
export default class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get("/all")
  public async getAllServices(): Promise<MyService[]> {
    return await this.servicesService.getAllServices();
  }

  @Get("/services-by-category/{categoryId}")
  public async getServicesByCategory(
    @Path() categoryId: string,
  ): Promise<MyService[]> {
    return await this.servicesService.getServicesByCategory(categoryId);
  }
}
