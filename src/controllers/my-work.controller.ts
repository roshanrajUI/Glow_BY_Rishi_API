import WorkPortfolio from "../models/entities/work-portfolio.entity";
import {
  MyWorkCreate,
  PaginationWithData,
} from "../models/interfaces/common-interfaces";
import MyWorkService from "../services/my-work.service";
import { MyWorkRequest } from "../models/interfaces/my-work.interfaces";

export default class MyWorkController {
  constructor(private readonly myWorkService: MyWorkService) {}

  public async getMyWorks(
    body: MyWorkRequest,
  ): Promise<PaginationWithData<WorkPortfolio>> {
    return this.myWorkService.getMyWorks(body);
  }

  public async createMyWork(
    serviceId: string,
    title: string,
    description: string,
    imageUrl: File,
  ): Promise<Boolean> {
    const myWork: MyWorkCreate = {
      serviceId,
      title,
      description,
    };

    return await this.myWorkService.createMyWork(myWork, imageUrl);
  }

  public async updatemyWork(
    myWorkId: string,
    serviceId: string,
    title: string,
    description: string,
    imageUrl?: File,
  ): Promise<Boolean> {
    const myWork: MyWorkCreate = {
      serviceId,
      title,
      description,
      imageUrl,
    };
    return await this.myWorkService.updateMyWork(myWorkId, myWork);
  }

  public async deleteMyWork(myWorkId: string): Promise<Boolean> {
    return await this.myWorkService.deleteMyWork(myWorkId);
  }
}
