import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export default class User {
  @PrimaryGeneratedColumn("uuid", { name: "user_id" })
  userId!: string;

  @Column("varchar", { name: "user_name", length: 50, nullable: false })
  userName!: string;

  @Column("varchar", {
    name: "gmail",
    length: 255,
    nullable: false,
    unique: true,
  })
  gmail!: string;

  @Column("varchar", {
    name: "phone_number",
    length: 10,
    nullable: false,
    unique: true,
  })
  phoneNumber!: string;

  @Column("varchar", { name: "password", length: 255, nullable: false })
  password!: string;

  @Column("enum", {
    name: "role",
    enum: ["Admin", "Beautician"],
    default: "Beautician",
  })
  role!: string;

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
}
