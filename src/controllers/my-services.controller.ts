import { Get, Route, Tags } from "tsoa";
import ServicesService from "../services/my-services.service";
import { Service } from "typedi";
import MyService from "../models/entities/my-services.entity";

@Route("api/services")
@Service()
@Tags("My Services")
export default class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}
  @Get("/all")
  public async getAllServices(): Promise<MyService[]> {
    return this.servicesService.getAllServices();
  }
}
