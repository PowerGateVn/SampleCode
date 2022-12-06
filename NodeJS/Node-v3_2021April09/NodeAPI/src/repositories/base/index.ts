import MyModelStatic from "@src/db/models";
import { Model, Order, WhereOptions } from "sequelize";
import { IRead } from "../interfaces/read";
import { IWrite } from "../interfaces/write";

export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
  public model: MyModelStatic;

  constructor(model: MyModelStatic) {
    this.model = model;
  }

  public async create(item: T): Promise<Model<any, any>> {
    try {
      return null;
    } catch (err) {
      throw err;
    }
  }

  public async deleteById(id: string): Promise<boolean> {
    try {
      return null;
    } catch (err) {
      throw err;
    }
  }

  public async updateById(id: string, item: T): Promise<number> {
    try {
      return null;
    } catch (err) {
      throw err;
    }
  }

  public async updateWhere(where: object): Promise<number> {
    try {
      return null;
    } catch (err) {
      throw err;
    }
  }

  public async findWhere(where: WhereOptions, order?: Order): Promise<T> {
    try {
      return await this.model.findOne({ where, order });
    } catch (err) {
      throw err;
    }
  }

  public async findById(id: number): Promise<T> {
    try {
      return await this.model.findByPk(id);
    } catch (err) {
      throw err;
    }
  }

  public async findAll(): Promise<T[]> {
    try {
      return await this.model.findAll();
    } catch (err) {
      throw err;
    }
  }
}
