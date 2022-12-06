import {
  Model,
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "users",
})
export class UserModel extends Model {
  @Column({ primaryKey: true, autoIncrement: true }) id: number;

  @Column fullname: string;

  @Column username: string;

  @Column password: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
