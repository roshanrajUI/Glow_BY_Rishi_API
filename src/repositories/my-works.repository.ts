import { Service } from "typedi";
import dbConfig from "../config/db.config";
import WorkPortfolio from "../models/entities/work-portfolio.entity";
import { PaginationWithData } from "../models/interfaces/common-interfaces";
import { MyWorkRequest } from "../models/interfaces/my-work.interfaces";

@Service()
export class MyWorkRepository {
  private readonly myWorkRepository = dbConfig.getRepository(WorkPortfolio);

  async getMyWorks(
    reqBody: MyWorkRequest,
  ): Promise<PaginationWithData<WorkPortfolio>> {
    const { serviceId, pageSize, pageNumber } = reqBody;
    const skip = (pageNumber - 1) * pageSize;
    const [myWorks, totalSize] = await this.myWorkRepository.findAndCount({
      where: serviceId ? { isActive: true, serviceId } : { isActive: true },
      skip,
      take: pageSize,
      order: { createdAt: "DESC" },
    });

    const paginationWithData = {
      data: myWorks,
      totalSize,
      pageSize,
      pageNumber,
    };
    return paginationWithData;
  }
}
