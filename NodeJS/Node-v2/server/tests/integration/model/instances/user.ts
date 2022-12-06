import { expect } from '../../../helpers/chai';
import {
  emptyTables,
  createUser
} from '../../../helpers/fixtures';

import modelFactory from '../../../../models/index';

const userId = 1;
const vehicleId = 1;
const tripId = 1;

describe('User instance', () => {
  const models = modelFactory;

  const USER_MODEL = models.User;
  const VEHICLE_MODEL = models.Vehicle;
  const TRIP_MODEL = models.Trip;

  let user;

  beforeEach('clean DB before test', async () => {
    await emptyTables();
  });

  after('clean DB after all tests', async () => {
    await emptyTables();
  });

  describe('getLastAwardedTrip', () => {
    let rewardedAt;

    beforeEach('creates fixtures', async () => {
      rewardedAt = new Date(2019, 2, 1, 10);

      user = await createUser({ id: userId }, USER_MODEL);

    });

    it('returns last awarded trip when only one exists', async () => {
      const lastAwardedTrip = await user.getLastAwardedTrip();

      expect(lastAwardedTrip).to.have.property('id', tripId);
      expect(lastAwardedTrip).to.have.property('userId', userId);
      expect(lastAwardedTrip).to.have.property('vehicleId', vehicleId);
      expect(lastAwardedTrip.rewardedAt.toString()).to.be.equal(
        rewardedAt.toString()
      );
    });
  });
});
