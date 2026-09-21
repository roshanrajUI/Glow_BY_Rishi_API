import {
  Delete,
  Get,
  Post,
  Route,
  Tags,
  Path,
  Put,
  FormField,
  UploadedFile,
} from "tsoa";
import { Service } from "typedi";
import { CategoryService } from "../services/category.service";
import Category from "../models/entities/service-category.entity";

@Service()
@Route("api/categories")
@Tags("Categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Put("/:categoryId")
  public async updateCategory(
    @Path() categoryId: string,
    @FormField() categoryName: string,
    @FormField() description?: string,
    @UploadedFile() imageUrl?: Express.Multer.File,
  ): Promise<Boolean> {
    const category = {
      categoryName,
      description,
      imageUrl,
    };
    return await this.categoryService.updateCategory(categoryId, category);
  }

  @Delete("/:categoryId")
  public async deleteCategory(@Path() categoryId: string): Promise<Boolean> {
    return await this.categoryService.deleteCategory(categoryId);
  }

  @Post("/")
  public async createCategory(
    @FormField() categoryName: string,
    @FormField() description: string,
    @UploadedFile() imageUrl: Express.Multer.File,
  ): Promise<Category> {
    const category = {
      categoryName,
      description,
      imageUrl,
    };
    return await this.categoryService.createCategory(category);
  }

  @Get("/all")
  public async getAllCategories(): Promise<Category[]> {
    return await this.categoryService.getAllCategories();
  }
}
