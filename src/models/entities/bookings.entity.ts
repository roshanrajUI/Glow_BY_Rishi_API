import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Client from "./clients.entity";
import { BookingStatus } from "../interfaces/booking.interfaces";
import MyBookingServices from "./booking-services.entity";

@Entity("bookings")
export default class Booking {
  @PrimaryGeneratedColumn("uuid", { name: "booking_id" })
  bookingId!: string;

  @Column("char", { name: "booking_number", nullable: false, unique: true })
  bookingNumber!: string;

  @Column("uuid", { name: "client_id" })
  clientId!: string;

  @Column("date", { name: "booking_date", nullable: false })
  bookingDate!: string;

  @Column("time", { name: "booking_time", nullable: false })
  bookingTime!: string;

  @Column("varchar", { name: "location", length: 255, nullable: true })
  location!: string;

  @Column("decimal", {
    name: "total_price",
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0,
  })
  totalPrice!: number;

  @Column("enum", {
    name: "status",
    enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
    default: "Pending",
  })
  status!: BookingStatus;

  @Column("text", { name: "notes", nullable: true })
  notes?: string;

  @Column("tinyint", {
    name: "review_rating",
    nullable: true,
    unsigned: true,
    default: null,
  })
  reviewRating?: number;

  @Column("text", { name: "review_text", nullable: true })
  reviewText?: string;

  @Column("datetime", { name: "review_date", nullable: true })
  reviewDate?: Date;

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

  @ManyToOne(() => Client)
  @JoinColumn({ name: "client_id" })
  client!: Client;

  @OneToMany(() => MyBookingServices, (service) => service.booking)
  @JoinColumn({ name: "booking_id", referencedColumnName: "booking_id" })
  bookingServices!: MyBookingServices[];
}
