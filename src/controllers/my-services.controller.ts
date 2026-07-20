import { Body, Delete, Get, Path, Post, Put, Route, Tags } from "tsoa";
import ServicesService from "../services/my-services.service";
import { Service } from "typedi";
import MyService from "../models/entities/my-services.entity";
import { ServiceCreate } from "../models/interfaces/common-interfaces";

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

  @Post("/")
  public async createService(@Body() service: ServiceCreate): Promise<Boolean> {
    return await this.servicesService.createService(service);
  }

  @Put("/:serviceId")
  public async updateService(
    @Path() serviceId: string,
    @Body() service: ServiceCreate,
  ): Promise<Boolean> {
    return await this.servicesService.updateService(serviceId, service);
  }

  @Delete("/:serviceId")
  public async deleteService(@Path() serviceId: string): Promise<Boolean> {
    return await this.servicesService.deleteService(serviceId);
  }
}
