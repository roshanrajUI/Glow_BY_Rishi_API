import { Service } from "typedi";
import { MyWorkRepository } from "../repositories/my-works.repository";
import { PaginationWithData } from "../models/interfaces/common-interfaces";
import WorkPortfolio from "../models/entities/work-portfolio.entity";
import { MyWorkRequest } from "../models/interfaces/my-work.interfaces";

@Service()
export default class MyWorkService {
  constructor(private readonly myWorkRepository: MyWorkRepository) {}

  async getMyWorks(
    reqBody: MyWorkRequest,
  ): Promise<PaginationWithData<WorkPortfolio>> {
    return this.myWorkRepository.getMyWorks(reqBody);
  }
}
