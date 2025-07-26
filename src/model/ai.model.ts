import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { AIAttributes } from "src/interfaces";
import Category from "./category.model";
import { ApiProperty } from "@nestjs/swagger";

export interface AICreationAttributes {
  title: string;
  description: string;
  url: string;
  logo: string;
  upvote: number;
  isFeatured: boolean;
  isTop: boolean;
  isVerified: boolean;
  subscriptionType: "Paid" | "Free" | "Freemium";
  categoryId: number;
}

@Table({
  tableName: "AIs",
  timestamps: true,
})
export default class AI extends Model<AIAttributes, AICreationAttributes> {
  @ApiProperty({ description: "Unique AI ID", example: 1 })
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare aiId: number;

  @ApiProperty({ description: "AI title", example: "Most Popular" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @ApiProperty({ description: "AI description", example: "Most Popular" })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare description: string;

  @ApiProperty({ description: "AI url", example: "https://www.google.com" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare url: string;

  @ApiProperty({
    description: "AI logo",
    example: "https://www.google.com/logo.png",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare logo: string;

  @ApiProperty({ description: "AI upvote", example: 10 })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare upvote: number;

  @ApiProperty({ description: "AI isFeatured", example: true })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare isFeatured: boolean;

  @ApiProperty({ description: "AI isTop", example: true })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare isTop: boolean;

  @ApiProperty({ description: "AI isVerified", example: true })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare isVerified: boolean;

  @ApiProperty({ description: "AI subscriptionType", example: "Paid" })
  @Column({
    type: DataType.ENUM,
    values: ["Paid", "Free", "Freemium"],
    allowNull: false,
  })
  declare subscriptionType: "Paid" | "Free" | "Freemium";

  @ApiProperty({ description: "AI categoryId", example: 1 })
  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare categoryId: number;

  @BelongsTo(() => Category)
  declare category?: Category;
}
