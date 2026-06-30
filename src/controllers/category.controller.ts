import { Get, Route, Tags } from "tsoa";
import { Service } from "typedi";
import { CategoryService } from "../services/category.service";
import Category from "../models/entities/service-category.entity";

@Service()
@Route("api/categories")
@Tags("Categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get("/all")
  public async getAllCategories(): Promise<Category[]> {
    return await this.categoryService.getAllCategories();
  }
}
