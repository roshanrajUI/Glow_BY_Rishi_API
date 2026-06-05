import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import User from "./users.entity";
import MyService from "./my-services.entity";

@Entity("user_services")
export default class UserService {
  @PrimaryGeneratedColumn("uuid", { name: "user_service_id" })
  userServiceId!: string;

  @Column("uuid", { name: "user_id" })
  userId!: string;

  @Column("uuid", { name: "service_id" })
  serviceId!: string;

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

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => MyService)
  @JoinColumn({ name: "service_id" })
  service!: MyService;
}
