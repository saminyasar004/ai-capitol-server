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

  async getStats(): Promise<{
    total: number;
    free: number;
    paid: number;
    freemium: number;
  } | null> {
    try {
      const [paid, free, freemium] = await Promise.all([
        AI.count({ where: { subscriptionType: "Paid" } }),
        AI.count({ where: { subscriptionType: "Free" } }),
        AI.count({ where: { subscriptionType: "Freemium" } }),
      ]);

      return {
        total: paid + free + freemium,
        free,
        paid,
        freemium,
      };
    } catch (err) {
      console.log(err.message);
      return null;
    }
  }
}
