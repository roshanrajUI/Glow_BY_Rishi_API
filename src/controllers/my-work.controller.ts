import {
  Body,
  Delete,
  FormField,
  Path,
  Post,
  Put,
  Route,
  Tags,
  UploadedFile,
} from "tsoa";
import { Service } from "typedi";
import WorkPortfolio from "../models/entities/work-portfolio.entity";
import {
  MyWorkCreate,
  PaginationWithData,
} from "../models/interfaces/common-interfaces";
import MyWorkService from "../services/my-work.service";
import { MyWorkRequest } from "../models/interfaces/my-work.interfaces";

@Route("api/my-works")
@Service()
@Tags("My Works")
export default class MyWorkController {
  constructor(private readonly myWorkService: MyWorkService) {}

  @Post("/all")
  public async getMyWorks(
    @Body() body: MyWorkRequest,
  ): Promise<PaginationWithData<WorkPortfolio>> {
    return this.myWorkService.getMyWorks(body);
  }

  @Post("/")
  public async createMyWork(
    @FormField() serviceId: string,
    @FormField() title: string,
    @FormField() description: string,
    @UploadedFile() imageUrl: Express.Multer.File,
  ): Promise<Boolean> {
    const myWork: MyWorkCreate = {
      serviceId,
      title,
      description,
    };

    return await this.myWorkService.createMyWork(myWork, imageUrl);
  }

  @Put("/:myWorkId")
  public async updatemyWork(
    @Path() myWorkId: string,
    @FormField() serviceId: string,
    @FormField() title: string,
    @FormField() description: string,
    @UploadedFile() imageUrl?: Express.Multer.File,
  ): Promise<Boolean> {
    const myWork: MyWorkCreate = {
      serviceId,
      title,
      description,
    };
    return await this.myWorkService.updateMyWork(myWorkId, myWork, imageUrl);
  }

  @Delete("/:myWorkId")
  public async deleteMyWork(@Path() myWorkId: string): Promise<Boolean> {
    return await this.myWorkService.deleteMyWork(myWorkId);
  }
}
