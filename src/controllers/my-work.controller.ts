import { Body, Post, Route, Tags } from "tsoa";
import { Service } from "typedi";
import WorkPortfolio from "../models/entities/work-portfolio.entity";
import { PaginationWithData } from "../models/interfaces/common-interfaces";
import MyWorkService from "../services/my-work.service";
import { MyWorkRequest } from "../models/interfaces/my-work.interfaces";

@Route("api/my-works")
@Service()
@Tags("My Works")
export default class MyWorkController {
  constructor(private readonly myWorkService: MyWorkService) {}

  @Post("/")
  public async getMyWorks(
    @Body() body: MyWorkRequest,
  ): Promise<PaginationWithData<WorkPortfolio>> {
    return this.myWorkService.getMyWorks(body);
  }
}
