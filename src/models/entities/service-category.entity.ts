import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import MyService from "./my-services.entity";

@Entity("service_category")
export default class Category {
  @PrimaryGeneratedColumn("uuid", { name: "category_id" })
  categoryId!: string;

  @Column("varchar", { name: "category_name", length: 100, nullable: false })
  categoryName!: string;

  @Column("text", { name: "description", nullable: true })
  description?: string;

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

  @OneToMany(() => MyService, (service) => service.category)
  @JoinColumn({ name: "category_id", referencedColumnName: "category_id" })
  services!: MyService[];
}
