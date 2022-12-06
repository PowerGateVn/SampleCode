import { expect } from 'chai';
import { emptyTables, createUser } from '../../helpers/fixtures';
import models from '../../../models';
import repositories from '../../../repositories';
import enums from '../../../commons/enum';

const { searchType } = enums;

describe('User Repository', () => {
  const UserRepository = repositories.User;
  const emailAddress = 'test@test.com';
  const countryCode = '65';
  const phoneNumber = '87654321';
  let createdUser;
  beforeEach('setUp', async () => {
    await emptyTables();
    createdUser = await createUser(
      {
        email: emailAddress,
        countryCode: countryCode,
        phoneNumber: phoneNumber
      },
      models.User
    );
  });
  afterEach(async () => {
    await emptyTables();
  });

  describe('findById', () => {
    it('finds user by id', async () => {
      const user = await UserRepository.findById(createdUser.id);
      expect(user.email).to.eq(emailAddress);
    });

    it('returns null for non existent user id', async () => {
      const invalidId = 100000;
      const user = await UserRepository.findById(invalidId);
      expect(user).to.be.null;
    });
  });

  describe('findByEmail', () => {
    it('finds user by email', async () => {
      const user = await UserRepository.findByEmail(emailAddress);
      expect(user.id).to.be.equal(createdUser.id);
    });

    it('returns null for non existent email', async () => {
      const unknownEmail = 'unknown@email.com';
      const user = await UserRepository.findByEmail(unknownEmail);
      expect(user).to.be.null;
    });
  });

  describe('findByPhone', () => {
    it('finds user by phone', async () => {
      const user = await UserRepository.findByPhone(countryCode, phoneNumber);
      expect(user.id).to.be.equal(createdUser.id);
    });

    it('returns null if phone number does not match', async () => {
      const user = await UserRepository.findByPhone(countryCode, '000000');
      expect(user).to.be.null;
    });

    it('returns null if country code does not match', async () => {
      const user = await UserRepository.findByPhone('00', phoneNumber);
      expect(user).to.be.null;
    });
  });

  describe('findUserBySearchTerm', () => {
    context('using user id', () => {
      it('finds user', async () => {
        const user = await UserRepository.findUserBySearchTerm(
          searchType.byId,
          createdUser.id,
          null,
          null
        );
        expect(user.id).to.eq(createdUser.id);
      });
    });

    context('using phone number', () => {
      it('finds user', async () => {
        const user = await UserRepository.findUserBySearchTerm(
          searchType.byPhoneNumber,
          phoneNumber,
          countryCode,
          null
        );
        expect(user.id).to.eq(createdUser.id);
      });

      it('returns null when country code does not match phone number', async () => {
        const wrongCountryCode = `wrong-${countryCode}`;
        const user = await UserRepository.findUserBySearchTerm(
          searchType.byPhoneNumber,
          phoneNumber,
          wrongCountryCode,
          null
        );
        expect(user).to.be.null;
      });
    });

    context('using email address', () => {
      it('finds user', async () => {
        const user = await UserRepository.findUserBySearchTerm(
          searchType.byEmail,
          emailAddress,
          null
        );
        expect(user.id).to.eq(createdUser.id);
      });
    });
  });
});
