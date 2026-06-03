import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("clients")
export default class Client {
  @PrimaryGeneratedColumn("uuid", { name: "client_id" })
  clientId!: string;

  @Column("varchar", { name: "client_name", length: 50, nullable: false })
  clientName!: string;

  @Column("varchar", {
    name: "phone_number",
    length: 10,
    nullable: false,
    unique: true,
  })
  phoneNumber!: string;

  @Column("varchar", {
    name: "email",
    length: 255,
    nullable: false,
    unique: true,
  })
  email!: string;

  @Column("text", { name: "address", nullable: true })
  address?: string;

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
