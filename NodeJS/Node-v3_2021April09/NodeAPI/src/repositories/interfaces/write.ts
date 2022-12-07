import { Model } from "sequelize";

export interface IWrite<T> {
  create(item: T): Promise<Model>;
  deleteById(id: string): Promise<boolean>;
  updateById(id: string, item: T): Promise<number>;
  updateWhere(where: object): Promise<number>;
}
