import { CreateAIDto, createAISchema } from "@/dto/ai.dto";
import { ResponseProps } from "@/interfaces";
import { JoiValidationPipe } from "@/pipes/joi-validation.pipe";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { AiService } from "./ai.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get("stats")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get AI listing stats." })
  @ApiResponse({
    status: 200,
    description: "Successfully fetched AI listing stats.",
  })
  @ApiResponse({ status: 500, description: "Internal server side error." })
  async getStats(): Promise<ResponseProps> {
    try {
      const stats = await this.aiService.getStats();
      if (!stats) {
        return {
          status: 500,
          message: "Error fetching stats. Please try again later.",
        };
      }

      return {
        status: 200,
        message: "Stats fetched successfully.",
        data: {
          stats,
        },
      };
    } catch (err) {
      console.log(err.message);
      return {
        status: 500,
        message: err.message,
      };
    }
  }

  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create new AI listing." })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    type: CreateAIDto,
    schema: {
      type: "object",
      properties: {
        title: { type: "string", example: "My AI Tool" },
        description: {
          type: "string",
          example: "A powerful AI tool for automation",
        },
        url: { type: "string", example: "https://example.com" },
        upvote: { type: "integer", example: 100 },
        isFeatured: { type: "boolean", example: false },
        isTop: { type: "boolean", example: false },
        isVerified: { type: "boolean", example: false },
        subscriptionType: {
          type: "string",
          enum: ["paid", "free", "freemium"],
          example: "freemium",
        },
        categoryId: { type: "integer", example: 1 },
        logo: { type: "string", format: "binary" },
      },
    },
  }) // Specify the request body schema
  @ApiResponse({
    status: 201,
    description: "Successfully created the AI in listing.",
  })
  @ApiResponse({ status: 500, description: "Internal server side error." })
  @UseInterceptors(
    FileInterceptor("logo", {
      storage: diskStorage({
        destination: "./uploads/logos",
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/svg+xml",
          "image/webp",
        ];
        if (!allowedTypes.includes(file.mimetype)) {
          return callback(
            new Error("Only JPEG, PNG, and GIF files are allowed"),
            false,
          );
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }),
  )
  async createAI(
    @Body(new JoiValidationPipe(createAISchema))
    payload: CreateAIDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseProps> {
    try {
      if (!file) {
        return {
          status: 400,
          message: "Logo file is required",
        };
      }

      const logoPath = `uploads/logos/${file.filename}`;
      const ai = await this.aiService.createAI(payload, logoPath);
      console.log(ai);
      if (!ai) {
        return {
          status: 500,
          message: "Error creating AI. Please try again later.",
        };
      }

      return {
        status: 201,
        message: "AI created successfully.",
      };
    } catch (err) {
      console.log(err.message);
      return {
        status: 500,
        message: err.message,
      };
    }
  }

  @Get("")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all AI listings." })
  @ApiResponse({
    status: 200,
    description: "Successfully fetched all AI listings.",
  })
  @ApiResponse({ status: 500, description: "Internal server side error." })
  async getAIs(): Promise<ResponseProps> {
    try {
      const ais = await this.aiService.getAIs();
      if (!ais) {
        return {
          status: 500,
          message: "Error fetching AIs. Please try again later.",
        };
      }

      return {
        status: 200,
        message: "AIs fetched successfully.",
        data: {
          ais,
        },
      };
    } catch (err) {
      console.log(err.message);
      return {
        status: 500,
        message: err.message,
      };
    }
  }

  @Put("update/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update AI listing." })
  @ApiResponse({
    status: 200,
    description: "Successfully updated AI listing.",
  })
  @ApiResponse({ status: 500, description: "Internal server side error." })
  async updateAI(
    @Param("id") id: number,
    @Body(new JoiValidationPipe(createAISchema))
    payload: CreateAIDto,
  ): Promise<ResponseProps> {
    try {
      const ai = await this.aiService.updateAI(id, payload);
      if (!ai) {
        return {
          status: 500,
          message: "Error updating AI. Please try again later.",
        };
      }

      return {
        status: 200,
        message: "AI updated successfully.",
      };
    } catch (err) {
      console.log(err.message);
      return {
        status: 500,
        message: err.message,
      };
    }
  }

  @Delete("delete/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete AI listing." })
  @ApiResponse({
    status: 200,
    description: "Successfully deleted AI listing.",
  })
  @ApiResponse({ status: 500, description: "Internal server side error." })
  async deleteAI(@Param("id") id: number): Promise<ResponseProps> {
    try {
      const isDeleted = await this.aiService.deleteAI(id);
      if (!isDeleted) {
        return {
          status: 500,
          message: "Error deleting AI. Please try again later.",
        };
      }

      return {
        status: 200,
        message: "AI deleted successfully.",
      };
    } catch (err) {
      console.log(err.message);
      return {
        status: 500,
        message: err.message,
      };
    }
  }
}
