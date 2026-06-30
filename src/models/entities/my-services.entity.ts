import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Category from "./service-category.entity";

@Entity("services")
export default class MyService {
  @PrimaryGeneratedColumn("uuid", { name: "service_id" })
  serviceId!: string;

  @Column("varchar", { name: "service_name", length: 100, nullable: false })
  serviceName!: string;

  @Column("decimal", {
    name: "price",
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0,
  })
  price!: number;

  @Column("text", { name: "description", nullable: true })
  description?: string;

  @Column("varchar", { name: "category_id", nullable: false })
  categoryId?: string;

  @Column("boolean", { name: "is_active", default: true })
  isActive!: boolean;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @Column("timestamp", {
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;

  @ManyToOne(() => Category)
  @JoinColumn({ name: "category_id" })
  category!: Category;
}
