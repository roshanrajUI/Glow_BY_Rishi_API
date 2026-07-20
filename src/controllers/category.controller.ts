import { Body, Delete, Get, Post, Route, Tags, Path, Put } from "tsoa";
import { Service } from "typedi";
import { CategoryService } from "../services/category.service";
import Category from "../models/entities/service-category.entity";
import { CategoryCreate } from "../models/interfaces/common-interfaces";

@Service()
@Route("api/categories")
@Tags("Categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Put("/:categoryId")
  public async updateCategory(
    @Path() categoryId: string,
    @Body() category: CategoryCreate,
  ): Promise<Boolean> {
    return await this.categoryService.updateCategory(categoryId, category);
  }

  @Delete("/:categoryId")
  public async deleteCategory(@Path() categoryId: string): Promise<Boolean> {
    return await this.categoryService.deleteCategory(categoryId);
  }

  @Post("/")
  public async createCategory(
    @Body() category: CategoryCreate,
  ): Promise<Category> {
    return await this.categoryService.createCategory(category);
  }

  @Get("/all")
  public async getAllCategories(): Promise<Category[]> {
    return await this.categoryService.getAllCategories();
  }
}
