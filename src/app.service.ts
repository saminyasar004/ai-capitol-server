import { Injectable } from "@nestjs/common";
import { ResponseProps } from "./interfaces";

@Injectable()
export class AppService {
  getHello(): ResponseProps {
    return {
      status: 200,
      message: "Hello World!",
    };
  }
}
