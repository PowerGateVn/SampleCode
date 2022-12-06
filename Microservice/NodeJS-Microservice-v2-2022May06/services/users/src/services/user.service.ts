import { UserDto } from "../dtos";
import { UserModel } from "../models";
import { TABLE_NAME } from "../configs/config";
import DB from "../databases/helpers";

export default class UserService {
  private _db: DB;

  constructor() {
    this._db = new DB(TABLE_NAME.USERS);
  }

  async create(name: string, email: string): Promise<UserDto> {
    const userModel = new UserModel(name, email);
    await this._db.insertOrReplace(userModel);
    return new UserDto(userModel.userId, userModel.name, userModel.email);
  }

  async list(
    limit: number,
    token: string
  ): Promise<{
    items: UserDto[];
    nextToken: string;
  }> {
    const { nextToken, items: listUser } = await this._db.list<UserModel>(
      limit,
      "userId",
      token
    );

    const listUserDto: UserModel[] = listUser.map(
      (item) => new UserDto(item.userId, item.name, item.email)
    );

    return {
      nextToken,
      items: listUserDto,
    };
  }
}
