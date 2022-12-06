import { Order, WhereOptions } from "sequelize/types";

export interface IRead<T> {
  findWhere(where: WhereOptions, order?: Order): Promise<T>;
  findById(id: number): Promise<T>;
  findAll(): Promise<T[]>;
}
