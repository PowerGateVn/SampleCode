import { Repository } from "sequelize-typescript";
import { UserModel } from "@src/models/user.model";
import { sequelize } from "@src/databases/sequelize";

export class UserService {
  private userRepository: Repository<UserModel>;

  constructor() {
    this.userRepository = sequelize.getRepository(UserModel);
  }

  async isExistUsername(username: string): Promise<boolean> {
    const existed = await this.userRepository.count({
      where: {
        username,
      },
    });

    return existed > 0;
  }

  async create(data: any): Promise<UserModel> {
    return this.userRepository.create(data);
  }

  async getByUsername(username: string): Promise<UserModel | null> {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    return user;
  }

  async getById(id: number): Promise<UserModel | null> {
    const user = await this.userRepository.findByPk(id);
    return user;
  }
}
