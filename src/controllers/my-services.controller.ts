import {
  Body,
  Delete,
  FormField,
  Get,
  Path,
  Post,
  Put,
  Route,
  Tags,
  UploadedFile,
} from "tsoa";
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
  public async createService(
    @FormField() serviceName: string,
    @FormField() price: number,
    @FormField() description: string,
    @FormField() categoryId: string,
    @UploadedFile() imageUrl: Express.Multer.File,
  ): Promise<Boolean> {
    const service: ServiceCreate = {
      serviceName,
      price,
      description,
      categoryId,
    };
    return await this.servicesService.createService(service, imageUrl);
  }

  @Put("/:serviceId")
  public async updateService(
    @Path() serviceId: string,
    @FormField() serviceName: string,
    @FormField() price: number,
    @FormField() description: string,
    @FormField() categoryId: string,
    @UploadedFile() imageUrl?: Express.Multer.File,
  ): Promise<Boolean> {
    const service: ServiceCreate = {
      serviceName,
      price,
      description,
      categoryId,
    };
    return await this.servicesService.updateService(
      serviceId,
      service,
      imageUrl,
    );
  }

  @Delete("/:serviceId")
  public async deleteService(@Path() serviceId: string): Promise<Boolean> {
    return await this.servicesService.deleteService(serviceId);
  }
}
