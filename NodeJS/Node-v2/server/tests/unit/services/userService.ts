import { expect, sinon } from '../../helpers/chai';
import userService from '../../../services/userService';
import models from '../../../models/index';

describe('User service', () => {
  describe('createWithPhone', () => {
    it('creates a user with phone number and country code', async () => {
      const phoneNumber = '12341234';
      const countryCode = '+65';
      const createUserSpy = sinon.stub(models.User, 'create');
      await userService.createWithPhone(countryCode, phoneNumber);

      expect(createUserSpy).to.be.calledWithExactly({
        countryCode,
        phoneNumber
      });
    });
  });

  describe('saveUserInSignUpProcess', () => {
    const firstName = 'John';
    const lastName = 'Doe';
    const email = 'john@doe.com';
    const location = '1,2';
    const phoneNumber = '12341234';
    const countryCode = '+65';
    let user;

    beforeEach('set up user', () => {
      user = models.User.build({ phoneNumber, countryCode });
    });

    it('returns updated user with user information', async () => {
      const [updatedUser] = await userService.saveUserInSignUpProcess(
        user,
        firstName,
        lastName,
        email,
        countryCode,
        location
      );

      expect(updatedUser.firstName).to.equal(firstName);
      expect(updatedUser.lastName).to.equal(lastName);
      expect(updatedUser.email).to.equal(email);
      expect(updatedUser.userType).to.match(/^1000/);
      expect(updatedUser.countryCode).to.equal(countryCode);
      expect(updatedUser.signUpLocation).to.equal(location);
    });

    context('when given a driving license image url', () => {
      const imageURL = 'https://s3.image';

      it('adds a user registration', async () => {
        const result = await userService.saveUserInSignUpProcess(
          user,
          firstName,
          lastName,
          email,
          countryCode,
          location,
          imageURL
        );
        const userRegistration = result[1];
        expect(userRegistration.drivingLicenseImageURL).to.equal(imageURL);
      });
    });
  });
});
