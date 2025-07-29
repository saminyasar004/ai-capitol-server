import { CreateAIDto } from "@/dto/ai.dto";
import AI from "@/model/ai.model";
import Category from "@/model/category.model";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AiService {
  async getAIById(aiId: number): Promise<AI | null> {
    try {
      return AI.findByPk(aiId);
    } catch (err) {
      console.log(err.message);
      return null;
    }
  }

  async createAI(aiData: CreateAIDto, logoPath: string): Promise<AI | null> {
    try {
      return await AI.create({ ...aiData, logo: logoPath });
    } catch (err) {
      console.log(err.message);
      return null;
    }
  }

  async updateAI(aiId: number, aiData: CreateAIDto): Promise<boolean> {
    try {
      const isUpdated = await AI.update(aiData, { where: { aiId } });

      if (!isUpdated) {
        return false;
      }

      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  }

  async updateAILogo(aiId: number, logo: string): Promise<boolean> {
    try {
      const isUpdated = await AI.update({ logo }, { where: { aiId } });

      if (!isUpdated) {
        return false;
      }

      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  }

  async deleteAI(aiId: number): Promise<boolean> {
    try {
      const isDeleted = await AI.destroy({ where: { aiId } });

      if (!isDeleted) {
        return false;
      }

      return true;
    } catch (err) {
      console.log(err.message);
      return false;
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
        AI.count({ where: { subscriptionType: "paid" } }),
        AI.count({ where: { subscriptionType: "free" } }),
        AI.count({ where: { subscriptionType: "freemium" } }),
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
