import { DataSource } from "typeorm";
import User from "../models/entities/users.entity";

const dbConfig: DataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "admin",
  database: "glow_by_rishi",
  timezone: "+05:30",
  entities: [User],
});

export default dbConfig;
