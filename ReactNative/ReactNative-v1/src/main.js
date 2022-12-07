import invariant from 'invariant';

import mainSaga from './sagas';
import createLogging from './createLogging';
import createServices from './createServices';

class Main {
  start() {
    invariant(this.task === undefined, 'main is already started');

    createLogging();
    this.services = createServices();
    this.task = this.services.runSaga(mainSaga);
  }

  async wait() {
    this.result = await this.task.done;
    return this.result;
  }

  cancel() {
    this.task.cancel();
  }
}

export default new Main();
