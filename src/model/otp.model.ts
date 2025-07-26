import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { CategoryAttributes, OTPAttributes } from "src/interfaces";

export interface OTPCreationAttributes {
  adminId: number;
  otp: string;
}

@Table({
  tableName: "OTPs",
  timestamps: true,
})
export default class OTP extends Model<OTPAttributes, OTPCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare otpId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare adminId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare otp: string;
}
