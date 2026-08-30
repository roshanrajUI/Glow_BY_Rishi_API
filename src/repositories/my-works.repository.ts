import { Service } from "typedi";
import dbConfig from "../config/db.config";
import WorkPortfolio from "../models/entities/work-portfolio.entity";
import {
  MyWorkCreate,
  PaginationWithData,
} from "../models/interfaces/common-interfaces";
import { MyWorkRequest } from "../models/interfaces/my-work.interfaces";
import { ApiError } from "../models/api.error";

@Service()
export class MyWorkRepository {
  private readonly myWorkRepository = dbConfig.getRepository(WorkPortfolio);

  async createMyWork(myWork: MyWorkCreate): Promise<Boolean> {
    myWork.userId = "6789";
    myWork.imageUrl = "asdfds";
    const created = await this.myWorkRepository.save(myWork);
    return !!created;
  }

  async updateMyWork(myWorkId: string, myWork: MyWorkCreate): Promise<Boolean> {
    const { serviceId, title, description, imageUrl } = myWork;
    const extWork = await this.isMyWorkExist(myWorkId);

    if (!extWork) {
      throw new ApiError(409, "Work Not Found");
    }

    const updated = await this.myWorkRepository.update(
      { workId: myWorkId },
      { serviceId, title, description, imageUrl: imageUrl },
    );
    return updated.affected === 1;
  }

  async deleteMyWork(myWorkId: string): Promise<Boolean> {
    const extWork = await this.isMyWorkExist(myWorkId);

    if (!extWork) {
      throw new ApiError(409, "Category Not Found");
    }

    const deleted = await this.myWorkRepository.update(
      { workId: myWorkId },
      { isActive: false },
    );

    return deleted.affected === 1;
  }

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

  async isMyWorkExist(myWorkid: string): Promise<Boolean> {
    const result = await this.myWorkRepository.findOne({
      where: {
        workId: myWorkid,
        isActive: true,
      },
    });
    return !!result;
  }
}
