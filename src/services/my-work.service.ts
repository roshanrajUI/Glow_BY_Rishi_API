import { Service } from "typedi";
import { MyWorkRepository } from "../repositories/my-works.repository";
import {
  MyWorkCreate,
  PaginationWithData,
} from "../models/interfaces/common-interfaces";
import WorkPortfolio from "../models/entities/work-portfolio.entity";
import { MyWorkRequest } from "../models/interfaces/my-work.interfaces";

@Service()
export default class MyWorkService {
  constructor(private readonly myWorkRepository: MyWorkRepository) {}

  async getMyWorks(
    reqBody: MyWorkRequest,
  ): Promise<PaginationWithData<WorkPortfolio>> {
    return await this.myWorkRepository.getMyWorks(reqBody);
  }

  async createMyWork(
    myWork: MyWorkCreate,
    image: Express.Multer.File,
  ): Promise<Boolean> {
    return this.myWorkRepository.createMyWork(myWork, image);
  }

  async updateMyWork(
    myWorkId: string,
    myWork: MyWorkCreate,
    image?: Express.Multer.File,
  ): Promise<Boolean> {
    return await this.myWorkRepository.updateMyWork(myWorkId, myWork, image);
  }

  async deleteMyWork(myWorkId: string): Promise<Boolean> {
    return await this.myWorkRepository.deleteMyWork(myWorkId);
  }
}
