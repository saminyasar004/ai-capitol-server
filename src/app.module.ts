import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { EmailService } from './email/email.service';
import { OtpService } from './otp/otp.service';
import { AiModule } from './ai/ai.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [AuthModule, AiModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService, EmailService, OtpService],
})
export class AppModule {}
