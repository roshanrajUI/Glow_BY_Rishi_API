import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Otp {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: number;

  @Column("char", { name: "booking_number", nullable: false, unique: true })
  bookingNumber!: string;

  @Column("varchar", { name: "gmail", nullable: false })
  gmail!: string;

  @Column("varchar", { name: "otp_hash", nullable: false })
  otpHash!: string;

  @Column("varchar", { name: "expires_at", nullable: false })
  expiresAt!: Date;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;
}
