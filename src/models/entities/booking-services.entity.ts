import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Booking from "./bookings.entity";
import MyService from "./my-services.entity";

@Entity("booking_services")
export default class MyBookingServices {
  @PrimaryGeneratedColumn("uuid", { name: "booking_service_id" })
  bookingServiceId!: string;

  @Column("uuid", { name: "booking_id" })
  bookingId!: string;

  @Column("uuid", { name: "service_id" })
  serviceId!: string;

  // @Column("char", { name: "assigned_user_id", length: 36, nullable: false })
  // assignedUserId!: string;

  @Column("decimal", {
    name: "price",
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0,
  })
  price!: number;

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

  @ManyToOne(() => Booking)
  @JoinColumn({ name: "booking_id" })
  booking!: Booking;

  @ManyToOne(() => MyService)
  @JoinColumn({ name: "service_id" })
  service!: MyService;
}
