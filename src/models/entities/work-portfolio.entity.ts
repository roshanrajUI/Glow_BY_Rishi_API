import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import User from "./users.entity";
import MyService from "./my-services.entity";

@Entity("work_portfolio")
export default class WorkPortfolio {
  @PrimaryGeneratedColumn("uuid", { name: "work_id" })
  workId!: string;

  @Column("uuid", { name: "service_id" })
  serviceId!: string;

  @Column("uuid", { name: "user_id" })
  userId!: string;

  @Column("varchar", { name: "title", length: 100, nullable: false })
  title!: string;

  @Column("text", { name: "description", nullable: true })
  description?: string;

  @Column("varchar", { name: "image_url", length: 255, nullable: false })
  imageUrl!: string;

  @Column("date", { name: "work_date", nullable: false })
  workDate!: Date;

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

  @ManyToOne(() => MyService)
  @JoinColumn({ name: "service_id" })
  service!: MyService;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user!: User;
}
