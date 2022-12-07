import { v4 } from "uuid";

export default class UserModel {
  userId: string;
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.userId = v4();
    this.name = name;
    this.email = email;
  }
}
