import ResponseService from "@src/services/response.service";

class BaseController {
  public resService: ResponseService;

  constructor() {
    this.resService = new ResponseService();
  }
}

export default BaseController;
