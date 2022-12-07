import ClientEntities from "@src/entities/client.entities";
import ClientRepository from "@src/repositories/client.repository";

export default class PlusCodeBusiness {
  private _clientRepository: ClientRepository;

  constructor() {
    this._clientRepository = new ClientRepository();
  }

  public async findAll(): Promise<ClientEntities[]> {
    try {
      const result = await this._clientRepository.findAll();
      if (result.length <= 0) return null;
      return result;
    } catch (err) {
      throw err;
    }
  }
}
