import { Service } from "typedi";
import dbConfig from "../config/db.config";
import WorkPortfolio from "../models/entities/work-portfolio.entity";
import {
  MyWorkCreate,
  PaginationWithData,
} from "../models/interfaces/common-interfaces";
import { MyWorkRequest } from "../models/interfaces/my-work.interfaces";
import { ApiError } from "../models/api.error";
import User from "../models/entities/users.entity";

@Service()
export class MyWorkRepository {
  private readonly myWorkRepository = dbConfig.getRepository(WorkPortfolio);
  private readonly usersRepo = dbConfig.getRepository(User);

  async createMyWork(
    myWork: MyWorkCreate,
    image: Express.Multer.File,
  ): Promise<Boolean> {
    const { serviceId, title, description } = myWork;
    const users = await this.usersRepo.find({
      where: { isActive: true },
    });
    if (!image) {
      throw new ApiError(400, "Service Work image is required");
    }
    const imageUrl = `/uploads/my-works/${image.filename}`;

    const created = await this.myWorkRepository.save({
      serviceId,
      title,
      description,
      imageUrl,
      userId: users[0].userId,
    });
    return !!created;
  }

  async updateMyWork(myWorkId: string, myWork: MyWorkCreate): Promise<Boolean> {
    const { serviceId, title, description, imageUrl } = myWork;
    const existingWork = await this.myWorkRepository.findOne({
      where: { workId: myWorkId, isActive: true },
    });

    if (!existingWork) {
      throw new ApiError(409, "Work Not Found");
    }

    if (imageUrl) {
      const newImageUrl = `/uploads/my-works/${imageUrl.filename}`;
      existingWork.imageUrl = newImageUrl;
    }
    existingWork.serviceId = serviceId;
    existingWork.title = title;
    existingWork.description = description;

    const updated = await this.myWorkRepository.update(
      { workId: myWorkId },
      existingWork,
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
