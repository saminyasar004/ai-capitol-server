import { CreateAIDto } from "@/dto/ai.dto";
import AI from "@/model/ai.model";
import Category from "@/model/category.model";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AiService {
  async createAI(aiData: CreateAIDto, logoPath: string): Promise<AI | null> {
    try {
      return await AI.create({ ...aiData, logo: logoPath });
    } catch (err) {
      console.log(err.message);
      return null;
    }
  }

  async getAIs(): Promise<AI[] | null> {
    try {
      return AI.findAll({
        include: [
          {
            model: Category,
            as: "category",
          },
        ],
      });
    } catch (err) {
      console.log(err.message);
      return null;
    }
  }
}
