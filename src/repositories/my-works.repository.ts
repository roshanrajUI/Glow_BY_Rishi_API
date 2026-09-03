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

  async createMyWork(
    myWork: MyWorkCreate,
    image: Express.Multer.File,
  ): Promise<Boolean> {
    const { serviceId, title, description } = myWork;
    myWork.userId = "d3883544-a7bd-11f1-85f9-00090faa0001";
    if (!image) {
      throw new ApiError(400, "Service Work image is required");
    }
    const imageUrl = `/uploads/my-works/${image.filename}`;

    const created = await this.myWorkRepository.save({
      serviceId,
      title,
      description,
      imageUrl,
      userId: "d3883544-a7bd-11f1-85f9-00090faa0001",
    });
    return !!created;
  }

  async updateMyWork(
    myWorkId: string,
    myWork: MyWorkCreate,
    image?: Express.Multer.File,
  ): Promise<Boolean> {
    const { serviceId, title, description } = myWork;
    const existingWork = await this.myWorkRepository.findOne({
      where: { workId: myWorkId, isActive: true },
    });

    if (!existingWork) {
      throw new ApiError(409, "Work Not Found");
    }

    let newImageUrl: string | undefined;
    if (image) {
      newImageUrl = `/uploads/my-works/${image.filename}`;
    }
    const imageUrl =
      existingWork.imageUrl !== newImageUrl
        ? newImageUrl
        : existingWork.imageUrl;

    const updated = await this.myWorkRepository.update(
      { workId: myWorkId },
      { serviceId, title, description, imageUrl: imageUrl },
    );
    return updated.affected === 1;
  }

  async deleteMyWork(myWorkId: string): Promise<Boolean> {
    const existingWork = await this.myWorkRepository.findOne({
      where: { workId: myWorkId, isActive: true },
    });

    if (!existingWork) {
      throw new ApiError(409, "Work Not Found");
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
