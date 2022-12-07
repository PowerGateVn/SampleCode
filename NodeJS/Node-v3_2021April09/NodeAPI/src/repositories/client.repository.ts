import clientModel from "@src/db/models/client.model";
import ClientEntities from "@src/entities/client.entities";
import { BaseRepository } from "./base";

export default class ClientRepository extends BaseRepository<ClientEntities> {
  constructor() {
    super(clientModel);
  }
}
