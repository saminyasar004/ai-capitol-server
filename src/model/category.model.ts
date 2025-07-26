import { ApiProperty } from "@nestjs/swagger";
import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { CategoryAttributes } from "src/interfaces";

export interface CategoryCreationAttributes {
  title: string;
}

@Table({
  tableName: "Categories",
  timestamps: true,
})
export default class Category extends Model<
  CategoryAttributes,
  CategoryCreationAttributes
> {
  @ApiProperty({ description: "Unique category ID", example: 1 })
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare categoryId: number;

  @ApiProperty({ description: "Category title", example: "Most Popular" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;
}
