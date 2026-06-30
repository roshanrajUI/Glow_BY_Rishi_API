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
    const { categoryId, serviceId, pageSize, pageNumber } = reqBody;
    const skip = (pageNumber - 1) * pageSize;

    const where: any = { isActive: true };

    if (categoryId && serviceId) {
      where.categoryId = categoryId;
      where.serviceId = serviceId;
    } else if (serviceId) {
      where.serviceId = serviceId;
    } else if (categoryId) {
      where.service = { categoryId };
    }

    const [myWorks, totalSize] = await this.myWorkRepository.findAndCount({
      where,
      skip,
      take: pageSize,
      order: { createdAt: "DESC" },
      relations: { service: { category: true } },
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
