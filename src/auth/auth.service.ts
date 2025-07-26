import { Injectable } from "@nestjs/common";
import Admin, { AdminCreationAttributes } from "@/model/admin.model";

@Injectable()
export class AuthService {
  async getAdmins(): Promise<Admin[] | null> {
    try {
      return Admin.findAll();
    } catch (err) {
      console.log(err.message);
      return null;
    }
  }

  async getAdminByEmail(email: string): Promise<Admin | null> {
    try {
      return Admin.findOne({ where: { email } });
    } catch (err) {
      console.log(err.message);
      return null;
    }
  }

  async getAdminById(adminId: number): Promise<Admin | null> {
    try {
      return Admin.findOne({ where: { adminId } });
    } catch (err) {
      console.log(err.message);
      return null;
    }
  }

  async createAdmin(adminData: AdminCreationAttributes): Promise<Admin | null> {
    try {
      return Admin.create(adminData);
    } catch (err) {
      console.log(err.message);
      return null;
    }
  }

  async updateAdmin(
    adminId: number,
    adminData: AdminCreationAttributes,
  ): Promise<boolean | null> {
    try {
      const isUpdated = Admin.update(adminData, { where: { adminId } });
      if (!isUpdated) {
        return false;
      }
      return true;
    } catch (err) {
      console.log(err.message);
      return null;
    }
  }
}
