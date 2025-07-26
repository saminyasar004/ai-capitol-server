import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ResponseProps } from "./interfaces";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): ResponseProps {
    return this.appService.getHello();
  }

  @Get("/api/health")
  healthCheck(): ResponseProps {
    return {
      status: 200,
      message: "OK",
    };
  }
}
