import { expect } from '../../../helpers/chai';
import instance from '../../../../models/instances/user';
import { AssertionError } from 'assert';
import InternalServerError from '../../../../errors/httpErrors/InternalServerError';
import enums from '../../../../commons/enum';

const { roles } = enums;

describe('User model instance functions', () => {
  describe('add role', () => {
    it('throws error when role does not exists', () => {
      const user = { id: 1, userType: '0000000000000000' };
      expect(() =>
        instance.prototype.addRole.bind(user)('non-existent')
      ).to.throw(AssertionError);
    });

    it('add role to user', () => {
      const user = { id: 1, userType: '0000000000000000' };
      instance.prototype.addRole.bind(user)(roles.USER_RIDER);

      expect(user.userType).to.be.equals('1000000000000000');
    });

    it('add role to account', () => {
      const user = { id: 1, accountType: '0000000000000000' };
      instance.prototype.addRole.bind(user)(roles.ACCOUNT_ADMIN);

      expect(user.accountType).to.be.equals('1000000000000000');
    });
  });

  describe('remove role', () => {
    it('throws error when role does not exists', () => {
      const user = { id: 1, userType: '0000000000000000' };
      expect(() =>
        instance.prototype.removeRole.bind(user)('non-existent')
      ).to.throw(AssertionError);
    });

    it('removes role from user', () => {
      const user = { id: 1, userType: '1000000000000000' };
      instance.prototype.removeRole.bind(user)(roles.USER_RIDER);

      expect(user.userType).to.be.equals('0000000000000000');
    });

    it('add role to account', () => {
      const user = { id: 1, accountType: '1000000000000000' };
      instance.prototype.removeRole.bind(user)(roles.ACCOUNT_ADMIN);

      expect(user.accountType).to.be.equals('0000000000000000');
    });
  });

  describe('get role', () => {
    it('returns admin role over others', () => {
      const user = {
        id: 1,
        userType: '0000000000000000',
        hasRole: instance.prototype.hasRole,
        addRole: instance.prototype.addRole
      };

      user.addRole(roles.USER_ADMIN);
      user.addRole(roles.USER_RIDER);
      user.addRole(roles.USER_CHARGER);
      user.addRole(roles.USER_STAFF);
      const result = instance.prototype.getRole.bind(user)();

      expect(result).to.be.equal(roles.USER_ADMIN);
    });

    it('returns charger role over others', () => {
      const user = {
        id: 1,
        userType: '0000000000000000',
        hasRole: instance.prototype.hasRole,
        addRole: instance.prototype.addRole
      };
      user.addRole(roles.USER_RIDER);
      user.addRole(roles.USER_CHARGER);
      user.addRole(roles.USER_STAFF);
      const result = instance.prototype.getRole.bind(user)();

      expect(result).to.be.equal(roles.USER_CHARGER);
    });

    it('returns rider role over others', () => {
      const user = {
        id: 1,
        userType: '0000000000000000',
        hasRole: instance.prototype.hasRole,
        addRole: instance.prototype.addRole
      };
      user.addRole(roles.USER_STAFF);
      user.addRole(roles.USER_RIDER);

      const result = instance.prototype.getRole.bind(user)();

      expect(result).to.be.equal(roles.USER_RIDER);
    });

    it('returns rider role', () => {
      const user = {
        id: 1,
        userType: '0000000000000000',
        hasRole: instance.prototype.hasRole,
        addRole: instance.prototype.addRole
      };
      user.addRole(roles.USER_RIDER);

      const result = instance.prototype.getRole.bind(user)();

      expect(result).to.be.equal(roles.USER_RIDER);
    });

    it('returns charger role', () => {
      const user = {
        id: 1,
        userType: '0000000000000000',
        hasRole: instance.prototype.hasRole,
        addRole: instance.prototype.addRole
      };
      user.addRole(roles.USER_CHARGER);

      const result = instance.prototype.getRole.bind(user)();

      expect(result).to.be.equal(roles.USER_CHARGER);
    });

    it('returns admin role', () => {
      const user = {
        id: 1,
        userType: '0000000000000000',
        hasRole: instance.prototype.hasRole,
        addRole: instance.prototype.addRole
      };
      user.addRole(roles.USER_ADMIN);

      const result = instance.prototype.getRole.bind(user)();

      expect(result).to.be.equal(roles.USER_ADMIN);
    });

    it('returns staff role', () => {
      const user = {
        id: 1,
        userType: '0000000000000000',
        hasRole: instance.prototype.hasRole,
        addRole: instance.prototype.addRole
      };
      user.addRole(roles.USER_STAFF);

      const result = instance.prototype.getRole.bind(user)();

      expect(result).to.be.equal(roles.USER_STAFF);
    });

    it('returns account admin role', () => {
      const account = {
        id: 1,
        accountType: '0000000000000000',
        hasRole: instance.prototype.hasRole,
        addRole: instance.prototype.addRole
      };

      account.addRole(roles.ACCOUNT_ADMIN);
      const result = instance.prototype.getRole.bind(account)();

      expect(result).to.be.equal(roles.ACCOUNT_ADMIN);
    });

    it('returns account staff role', () => {
      const account = {
        id: 1,
        accountType: '0000000000000000',
        hasRole: instance.prototype.hasRole,
        addRole: instance.prototype.addRole
      };

      account.addRole(roles.ACCOUNT_STAFF);

      const result = instance.prototype.getRole.bind(account)();

      expect(result).to.be.equal(roles.ACCOUNT_STAFF);
    });

    it('throws Model Error when user does not have role', () => {
      const user = {
        id: 1,
        userType: '0000000000000000',
        hasRole: instance.prototype.hasRole
      };

      return expect(() => instance.prototype.getRole.bind(user)())
        .to.throw(InternalServerError)
        .and.to.have.property('message', "User with id: 1 doesn't have a role");
    });

    it('throws Model Error when account does not have role', () => {
      const account = {
        id: 1,
        accountType: '0000000000000000',
        hasRole: instance.prototype.hasRole
      };

      return expect(() => instance.prototype.getRole.bind(account)())
        .to.throw(InternalServerError)
        .and.to.have.property(
          'message',
          "Account with id: 1 doesn't have a role"
        );
    });
  });

  it('confirms user type', () => {
    const user = { id: 1, userType: '1000000000000000' };
    expect(instance.prototype.isUser.bind(user)()).to.be.equal(true);
    expect(instance.prototype.isAccount.bind(user)()).to.be.equal(false);
  });

  it('confirms account type', () => {
    const user = { id: 1, accountType: '1000000000000000' };
    expect(instance.prototype.isAccount.bind(user)()).to.be.equal(true);
    expect(instance.prototype.isUser.bind(user)()).to.be.equal(false);
  });

  describe('add entities', () => {
    let user;
    let entities;

    context('when user does not have entities', () => {
      beforeEach('prepare test', () => {
        user = {
          id: 1,
          entities: ''
        };
      });

      it('adds one entity', () => {
        entities = ['BeamCOM'];

        instance.prototype.addEntities.bind(user)(entities);

        return expect(user.entities).to.be.equal('["BeamCOM"]');
      });

      it('adds more entities', () => {
        entities = ['BeamCOM', 'BeamCOMTest1', 'BeamCOMTest2'];

        instance.prototype.addEntities.bind(user)(entities);

        return expect(user.entities).to.be.equal(
          '["BeamCOM","BeamCOMTest1","BeamCOMTest2"]'
        );
      });
    });

    context('when user has entities', () => {
      beforeEach('prepare test', () => {
        user = {
          id: 1,
          entities: '["BeamCOM"]'
        };
      });

      it('adds one entity', () => {
        entities = ['BeamCOMTest'];

        instance.prototype.addEntities.bind(user)(entities);

        return expect(user.entities).to.be.equal('["BeamCOM","BeamCOMTest"]');
      });

      it('adds more entities', () => {
        entities = ['BeamCOMTest1', 'BeamCOMTest2'];

        instance.prototype.addEntities.bind(user)(entities);

        return expect(user.entities).to.be.equal(
          '["BeamCOM","BeamCOMTest1","BeamCOMTest2"]'
        );
      });
    });

    it('throws invalid argument exception', () => {
      user = {
        id: 1,
        entities: ''
      };

      entities = 'BeamCOM';

      return expect(() => instance.prototype.addEntities.bind(user)(entities))
        .to.throw(AssertionError)
        .and.to.have.property('message', 'Entities should be an array');
    });
  });

  describe('get entities', () => {
    let user;

    it('returns users entities', () => {
      user = {
        entities: '["BeamCOM", "BeamCOMTest1"]'
      };

      const result = instance.prototype.getEntities.bind(user)();

      return expect(result).to.be.deep.equal(['BeamCOM', 'BeamCOMTest1']);
    });

    it('returns empty array when user does not have entities', () => {
      user = {
        entities: ''
      };

      const result = instance.prototype.getEntities.bind(user)();

      return expect(result).to.be.deep.equal([]);
    });
  });

  describe('get entity name', () => {
    let user;
    let preferredEntity;

    it('returns preferred entity name when user has this entity', () => {
      user = {
        entities: '["BeamCOM", "BeamCOMTest1", "BeamCOMTest2"]'
      };

      preferredEntity = 'BeamCOMTest1';

      const result = instance.prototype.getEntityName.bind(user)(
        preferredEntity
      );

      return expect(result).to.be.equal(preferredEntity);
    });

    it('returns most recent entity name when user does not have entity for preferred name', () => {
      user = {
        entities: '["BeamCOM", "BeamCOMTest1", "BeamCOMTest2"]'
      };

      preferredEntity = 'BeamCOMTest3';

      const result = instance.prototype.getEntityName.bind(user)(
        preferredEntity
      );

      return expect(result).to.be.equal('BeamCOMTest2');
    });

    it('returns null when user does not have entities', () => {
      user = {
        entities: ''
      };

      preferredEntity = 'BeamCOMTest1';

      const result = instance.prototype.getEntityName.bind(user)(
        preferredEntity
      );

      return expect(result).to.be.equal(null);
    });
  });
});
