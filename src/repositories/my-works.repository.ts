import WorkPortfolio from "../models/entities/work-portfolio.entity";
import {
  MyWorkCreate,
  PaginationWithData,
} from "../models/interfaces/common-interfaces";
import { MyWorkRequest } from "../models/interfaces/my-work.interfaces";
import { ApiError } from "../models/api.error";
import { execute, fetchAll, fetchOne, newId, nowIso, toBool } from "../lib/db";
import { saveImageToR2 } from "../lib/image-upload";

interface WorkRow {
  work_id: string;
  service_id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string;
  work_date: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

function mapWork(row: WorkRow): WorkPortfolio {
  return {
    workId: row.work_id,
    serviceId: row.service_id,
    userId: row.user_id,
    title: row.title,
    description: row.description ?? undefined,
    imageUrl: row.image_url,
    workDate: row.work_date ?? undefined,
    isActive: toBool(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class MyWorkRepository {
  constructor(
    private readonly db: D1Database,
    private readonly uploads: R2Bucket,
  ) {}

  async createMyWork(myWork: MyWorkCreate, image: File): Promise<Boolean> {
    const { serviceId, title, description } = myWork;
    const user = await fetchOne<{ user_id: string }>(
      this.db,
      "SELECT user_id FROM users WHERE is_active = 1 LIMIT 1",
    );

    if (!image) {
      throw new ApiError(400, "Service Work image is required");
    }

    const imageUrl = await saveImageToR2(this.uploads, "my-works", image);
    const workId = newId();
    const now = nowIso();

    await execute(
      this.db,
      `INSERT INTO work_portfolio (work_id, service_id, user_id, title, description, image_url, work_date, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      [workId, serviceId, user?.user_id ?? null, title, description ?? null, imageUrl, now.slice(0, 10), now, now],
    );

    return true;
  }

  async updateMyWork(myWorkId: string, myWork: MyWorkCreate): Promise<Boolean> {
    const { serviceId, title, description, imageUrl } = myWork;
    const existingWork = await fetchOne<WorkRow>(
      this.db,
      "SELECT * FROM work_portfolio WHERE work_id = ? AND is_active = 1",
      [myWorkId],
    );

    if (!existingWork) {
      throw new ApiError(409, "Work Not Found");
    }

    let newImageUrl = existingWork.image_url;
    if (imageUrl) {
      newImageUrl = await saveImageToR2(this.uploads, "my-works", imageUrl);
    }

    await execute(
      this.db,
      `UPDATE work_portfolio SET service_id = ?, title = ?, description = ?, image_url = ?, updated_at = ?
       WHERE work_id = ?`,
      [serviceId, title, description ?? null, newImageUrl, nowIso(), myWorkId],
    );

    return true;
  }

  async deleteMyWork(myWorkId: string): Promise<Boolean> {
    const existingWork = await fetchOne<WorkRow>(
      this.db,
      "SELECT * FROM work_portfolio WHERE work_id = ? AND is_active = 1",
      [myWorkId],
    );

    if (!existingWork) {
      throw new ApiError(409, "Work Not Found");
    }

    await execute(this.db, "UPDATE work_portfolio SET is_active = 0, updated_at = ? WHERE work_id = ?", [
      nowIso(),
      myWorkId,
    ]);

    return true;
  }

  async getMyWorks(reqBody: MyWorkRequest): Promise<PaginationWithData<WorkPortfolio>> {
    const { categoryId, serviceId, pageSize, pageNumber } = reqBody;
    const skip = (pageNumber - 1) * pageSize;

    const conditions = ["w.is_active = 1"];
    const bindings: unknown[] = [];

    if (categoryId && serviceId) {
      conditions.push("w.service_id = ?", "s.category_id = ?");
      bindings.push(serviceId, categoryId);
    } else if (serviceId) {
      conditions.push("w.service_id = ?");
      bindings.push(serviceId);
    } else if (categoryId) {
      conditions.push("s.category_id = ?");
      bindings.push(categoryId);
    }

    const whereClause = conditions.join(" AND ");

    const totalRow = await fetchOne<{ count: number }>(
      this.db,
      `SELECT COUNT(*) AS count FROM work_portfolio w LEFT JOIN services s ON s.service_id = w.service_id WHERE ${whereClause}`,
      bindings,
    );

    const rows = await fetchAll<WorkRow>(
      this.db,
      `SELECT w.* FROM work_portfolio w LEFT JOIN services s ON s.service_id = w.service_id
       WHERE ${whereClause} ORDER BY w.created_at DESC LIMIT ? OFFSET ?`,
      [...bindings, pageSize, skip],
    );

    return {
      data: rows.map(mapWork),
      totalSize: totalRow?.count ?? 0,
      pageSize,
      pageNumber,
    };
  }

  async isMyWorkExist(myWorkid: string): Promise<Boolean> {
    const result = await fetchOne<WorkRow>(
      this.db,
      "SELECT * FROM work_portfolio WHERE work_id = ? AND is_active = 1",
      [myWorkid],
    );
    return !!result;
  }
}
