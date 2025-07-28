import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { EmailService } from "./email/email.service";
import { OtpService } from "./otp/otp.service";
import { AiModule } from "./ai/ai.module";
import { CategoryModule } from "./category/category.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { dbConnectionString } from "./config/dotenv.config";

@Module({
  imports: [
    AuthModule,
    AiModule,
    CategoryModule,
    SequelizeModule.forRoot({
      dialect: "postgres",
      uri: dbConnectionString,
      models: [__dirname + "/**/*.model{.ts,.js}"],
      autoLoadModels: true,
      synchronize: false, // Set to false in production
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false, // Required for Supabase
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, EmailService, OtpService],
})
export class AppModule {}
