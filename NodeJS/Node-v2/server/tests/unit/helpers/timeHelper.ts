import TimeHelper from '../../../helpers/timeHelper';
import { expect } from '../../helpers/chai';

describe('TimeHelper tests', () => {
  describe('it should return true when current time is in period', () => {
    const now = new Date();
    const earlier = new Date(now.getTime() - 60000);
    const later = new Date(now.getTime() + 60000);
    const isIn = TimeHelper.checkNowIsInPeriod(
      (now.getTimezoneOffset() / 60) * -1,
      `${earlier.getHours()}:${earlier.getMinutes()}`,
      `${later.getHours()}:${later.getMinutes()}`
    );
    expect(isIn).to.be.true;
  });

  describe('it should return false when current time is not in period', () => {
    const now = new Date();
    const earlier = new Date(now.getTime() - 60000);
    const later = new Date(now.getTime() - 30000);
    const isIn = TimeHelper.checkNowIsInPeriod(
      (now.getTimezoneOffset() / 60) * -1,
      `${earlier.getHours()}:${earlier.getMinutes()}`,
      `${later.getHours()}:${later.getMinutes()}`
    );
    expect(isIn).to.be.false;
  });

  describe('it should return false when earliest time is null', () => {
    const now = new Date();
    const later = new Date(now.getTime() + 60000);
    const isIn = TimeHelper.checkNowIsInPeriod(
      (now.getTimezoneOffset() / 60) * -1,
      null,
      `${later.getHours()}:${later.getMinutes()}`
    );
    expect(isIn).to.be.false;
  });

  describe('it should return false when latest time is null', () => {
    const now = new Date();
    const earlier = new Date(now.getTime() - 60000);
    const isIn = TimeHelper.checkNowIsInPeriod(
      (now.getTimezoneOffset() / 60) * -1,
      `${earlier.getHours()}:${earlier.getMinutes()}`,
      null
    );
    expect(isIn).to.be.false;
  });
});
