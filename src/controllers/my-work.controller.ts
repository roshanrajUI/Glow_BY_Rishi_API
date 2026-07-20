import { Body, Delete, Path, Post, Put, Route, Tags } from "tsoa";
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
  public async createMyWork(@Body() myWork: MyWorkCreate): Promise<Boolean> {
    return await this.myWorkService.createMyWork(myWork);
  }

  @Put("/:myWorkId")
  public async updatemyWork(
    @Path() myWorkId: string,
    @Body() myWork: MyWorkCreate,
  ): Promise<Boolean> {
    return await this.myWorkService.updateMyWork(myWorkId, myWork);
  }

  @Delete("/:myWorkId")
  public async deleteMyWork(@Path() myWorkId: string): Promise<Boolean> {
    return await this.myWorkService.deleteMyWork(myWorkId);
  }
}
