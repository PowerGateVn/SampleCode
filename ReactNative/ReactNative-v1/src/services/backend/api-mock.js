import {AsyncStorage} from 'react-native';
import Logging from '~app/utils/logging';

const log = Logging.getLogger('app.services.backend.api-mock');

export default class APIMockBackend {
  constructor() {
    this.longDelay = 1200;
    this.shortDelay = 99;
    this.mediumDelay = 250;
    this.accounts = {_index_: 1};
    this.avatars = {};
    this.logins = {};
    this.simulateConnectionFailed = false;
  }

  async initialize(options) {
  }

  async createAccount(email, password) {
  }

  async login(email, password, force) {
  }

  async logout(accessToken) {
  }
}
