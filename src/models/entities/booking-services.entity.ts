import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Booking from "./bookings.entity";
import Service from "./services.entity";

@Entity("booking-services")
export default class BookingService {
  @PrimaryGeneratedColumn("uuid", { name: "booking_service_id" })
  bookingServiceId!: string;

  @Column("uuid", { name: "booking_id" })
  bookingId!: string;

  @Column("uuid", { name: "service_id" })
  serviceId!: string;

  @Column("char", { name: " assigned_user_id", length: 36, nullable: false })
  assignedUserId!: string;

  @Column("decimal", {
    name: "service_price",
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0,
  })
  servicePrice!: number;

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

  @ManyToOne(() => Service)
  @JoinColumn({ name: "service_id" })
  service!: Service;
}
