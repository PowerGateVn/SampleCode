import view from '../../../views/user';
import {
  DEFAULT_GROUP,
  UPDATE_GROUP,
  USER_CHARGER_CONFIRMED_GROUP,
  USER_RIDER_CONFIRMED_GROUP,
  ADD_CHARGER,
  REMOVE_CHARGER,
  USER_NOT_FOUND,
  SUCCESS,
  SEARCH_TERM
} from '../../../views/groups';
import { expect } from '../../helpers/chai';
import { AssertionError } from 'assert';

describe('User views', () => {
  it('serializes user object', () => {
    const user = { id: 1 };

    const result = view(DEFAULT_GROUP)(user);

    expect(result).to.be.not.equal(user);
    expect(result).to.haveOwnProperty('id', 1);
  });

  it('serializes user object for update group', () => {
    const user = { id: 1 };

    const result = view(UPDATE_GROUP)(user);

    expect(result).to.be.not.equal(user);
    expect(result).to.haveOwnProperty('id', 1);
    expect(result).to.haveOwnProperty('appRated', undefined);
  });

  it('serializes user object for charger confirmed terms', () => {
    const user = { id: 1, chargerConfirmedTerms: true };

    const result = view(USER_CHARGER_CONFIRMED_GROUP)(user);

    expect(result).to.be.not.equal(user);
    expect(result).to.haveOwnProperty('id', 1);
    expect(result).to.haveOwnProperty('isConfirmChargerTerm', true);
  });

  it('serializes user object for charger confirmed terms', () => {
    const user = { id: 1, riderConfirmedTerms: true };

    const result = view(USER_RIDER_CONFIRMED_GROUP)(user);

    expect(result).to.be.not.equal(user);
    expect(result).to.haveOwnProperty('id', 1);
    expect(result).to.haveOwnProperty('isRiderConfirmedTerms', true);
  });

  it('thows error when group not found', () => {
    expect(() => view('non-existent')({})).to.throw(AssertionError);
  });

  it('add charger successfully', () => {
    const result = view(ADD_CHARGER)({ message: 'add Charger Successfully' });

    expect(result.success).to.be.equal(true);
    expect(result.message).to.be.equal('add Charger Successfully');
  });

  it('remove charger successfully', () => {
    const result = view(REMOVE_CHARGER)({
      message: 'remove Charger Successfully'
    });

    expect(result.success).to.be.equal(true);
    expect(result.message).to.be.equal('remove Charger Successfully');
  });

  it('user not found', () => {
    const result = view(USER_NOT_FOUND)({
      message: 'Can not find user with PhoneNumber and CountryCode'
    });

    expect(result.success).to.be.equal(false);
    expect(result.message).to.be.equal(
      'Can not find user with PhoneNumber and CountryCode'
    );
  });

  it('should set the user id when searching a user', () => {
    const user = {
      id: 1
    };

    const result = view(SEARCH_TERM)(user);

    expect(result).to.haveOwnProperty('id', 1);
  });

  it('should return success when passing a message', () => {
    const result = view(SUCCESS)({
      message: 'success'
    });

    expect(result.success).to.be.equal(true);
    expect(result.message).to.be.equal('success');
  });
});
