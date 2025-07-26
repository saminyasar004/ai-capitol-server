import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { AdminAttributes } from "src/interfaces";

export interface AdminCreationAttributes {
  name: string;
  email: string;
  password: string;
}

@Table({
  tableName: "Admins",
  timestamps: true,
})
export default class Admin extends Model<
  AdminAttributes,
  AdminCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare adminId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;
}
