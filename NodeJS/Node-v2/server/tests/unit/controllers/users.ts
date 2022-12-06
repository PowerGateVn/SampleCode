import { expect, sinon } from '../../helpers/chai';
import userController from '../../../controllers/users';
import userView from '../../../views/user';
import NotFoundError from '../../../errors/httpErrors/NotFoundError';
import InternalServerError from '../../../errors/httpErrors/InternalServerError';
import BadRequestError from '../../../errors/httpErrors/BadRequestError';
import moment from 'moment';
import enums from '../../../commons/enum';

describe('User controller', () => {
  describe('getCurrent', () => {
    it('returns serialized user', () => {
      const userRepository = { findById: sinon.stub() };
      const req = {};
      const res = {
        send: sinon.spy(),
        locals: {
          user: { id: 1 },
          services: { userRepository },
          views: { userView },
          anyOtherField: 'anyOtherValue'
        }
      };
      userRepository.findById.resolves({ id: 1 });

      return userController.getCurrent(req, res).then(() => {
        return expect(
          res.send.withArgs({
            id: 1,
            firstName: undefined,
            lastName: undefined,
            userType: undefined,
            email: undefined,
            phoneNumber: undefined,
            countryCode: undefined,
            associatedChargerGeoRegionId: undefined
          })
        ).to.be.calledOnce;
      });
    });

    it('throw NotFoundError when no user', () => {
      const userRepository = { findById: sinon.stub() };
      const req = {};
      const res = {
        send: sinon.spy(),
        locals: {
          services: { userRepository },
          views: { userView },
          user: { id: 1 },
          anyOtherField: 'anyOtherValue'
        }
      };
      userRepository.findById.resolves(undefined);

      return expect(userController.getCurrent(req, res))
        .to.eventually.be.rejectedWith('User not found')
        .and.to.be.an.instanceOf(NotFoundError);
    });

    it('throw InternalServerError when error in database', () => {
      const userRepository = { findById: sinon.stub() };
      const req = {};
      const res = {
        send: sinon.spy(),
        locals: {
          services: { userRepository },
          views: { userView },
          user: { id: 1 },
          anyOtherField: 'anyOtherValue'
        }
      };
      userRepository.findById.rejects(new InternalServerError());

      return expect(userController.getCurrent(req, res))
        .to.eventually.be.rejectedWith('Internal server error')
        .and.to.be.an.instanceOf(InternalServerError);
    });
  });

  describe('updateCurrent', () => {
    it('return updated user', () => {
      const userRepository = {
        findById: sinon.stub(),
        findByEmail: sinon.stub()
      };
      const req = {
        body: {
          id: 1,
          firstName: 'updated',
          lastName: 'updated',
          email: 'updated@test.com'
        }
      };
      const res = {
        locals: {
          services: { userRepository },
          views: { userView },
          user: {
            id: 1
          }
        },
        status: sinon.stub(),
        json: sinon.spy()
      };
      const save = sinon.stub();

      res.status.returns(res);

      userRepository.findById.resolves({
        id: 1,
        firstName: 'test',
        lastName: 'test',
        email: 'test@test.com',
        save
      });
      userRepository.findByEmail.resolves({
        id: 1
      });

      save.resolves({
        firstName: 'updated',
        lastName: 'updated',
        email: 'updated@test.com'
      });

      return userController.updateCurrent(req, res).then(() => {
        return expect(
          res.json.withArgs({
            success: true,
            message: 'success',
            response: {},
            error: '',
            data: {
              firstName: 'updated',
              lastName: 'updated',
              email: 'updated@test.com'
            }
          })
        ).to.be.calledOnce;
      });
    });

    it('sends User not found message when user does not exist', () => {
      const userRepository = { findById: sinon.stub() };
      const req = {};
      const res = {
        locals: {
          services: { userRepository },
          views: { userView },
          user: {
            id: 1
          }
        }
      };

      userRepository.findById.resolves(undefined);

      return expect(userController.updateCurrent(req, res))
        .to.eventually.be.rejectedWith('User not found')
        .and.to.be.an.instanceOf(NotFoundError);
    });

    it('sends error message that email already exists', () => {
      const userRepository = {
        findById: sinon.stub(),
        findByEmail: sinon.stub()
      };
      const req = {
        body: {
          email: 'test2@test.com'
        }
      };
      const res = {
        locals: {
          services: { userRepository },
          views: { userView },
          user: {
            id: 1
          }
        }
      };

      userRepository.findById.resolves({
        id: 1,
        firstName: 'test',
        email: 'test@test.com'
      });
      userRepository.findByEmail.resolves({
        id: 2,
        email: 'test2@test.com',
        dataValues: {
          email: 'test2@test.com'
        }
      });

      return expect(userController.updateCurrent(req, res))
        .to.eventually.be.rejectedWith(
          'This email address is already associated with another Beam account. \n \n Please enter another email address'
        )
        .and.to.be.an.instanceOf(BadRequestError);
    });

    it('sends error message when error in database - finding user', () => {
      const userRepository = { findById: sinon.stub() };
      const req = {};
      const res = {
        locals: {
          services: { userRepository },
          views: { userView },
          user: {
            id: 1
          }
        }
      };

      userRepository.findById.rejects(new InternalServerError());

      return expect(userController.updateCurrent(req, res))
        .to.eventually.be.rejectedWith('Internal server error')
        .and.to.be.an.instanceOf(InternalServerError);
    });

    it('sends error message when error in database - updating user', () => {
      const userRepository = {
        findById: sinon.stub(),
        findByEmail: sinon.stub()
      };
      const req = {
        body: {
          email: 'test2@test.com',
          firstName: 'test',
          lastName: 'test'
        }
      };
      const res = {
        locals: {
          services: { userRepository },
          views: { userView },
          user: {
            id: 1
          }
        }
      };
      const save = sinon.stub();

      userRepository.findById.resolves({
        id: 1,
        email: 'test@test.com',
        firstName: 'test',
        lastName: 'test',
        save
      });
      userRepository.findByEmail.resolves({
        id: 1
      });
      save.rejects(new InternalServerError());

      return expect(userController.updateCurrent(req, res))
        .to.eventually.be.rejectedWith('Internal server error')
        .and.to.be.an.instanceOf(InternalServerError);
    });
  });

  describe('updateAppRated', () => {
    it('updates user appRated property', () => {
      const userRepository = {
        findById: sinon.stub()
      };
      const req = {
        body: {
          id: 1,
          appRated: true
        }
      };
      const res = {
        locals: {
          services: { userRepository },
          views: { userView },
          user: {
            id: 1
          }
        },
        send: sinon.spy()
      };
      const save = sinon.stub();

      userRepository.findById.resolves({
        id: 1,
        appRated: false,
        save
      });
      save.resolves({
        id: 1,
        appRated: true
      });

      return userController.updateAppRated(req, res).then(() => {
        return expect(
          res.send.withArgs({
            id: 1,
            appRated: true,
            firstName: undefined,
            lastName: undefined,
            userType: undefined,
            email: undefined,
            phoneNumber: undefined,
            countryCode: undefined
          })
        ).to.be.calledOnce;
      });
    });

    it('throw NotFoundError when no user', () => {
      const userRepository = { findById: sinon.stub() };
      const req = {};
      const res = {
        send: sinon.spy(),
        locals: {
          services: { userRepository },
          views: { userView },
          user: { id: 1 }
        }
      };
      userRepository.findById.resolves(undefined);

      return expect(userController.updateAppRated(req, res))
        .to.eventually.be.rejectedWith('User not found')
        .and.to.be.an.instanceOf(NotFoundError);
    });

    it('throw InternalServerError when error in database - finding user', () => {
      const userRepository = { findById: sinon.stub() };
      const req = {};
      const res = {
        send: sinon.spy(),
        locals: {
          services: { userRepository },
          views: { userView },
          user: { id: 1 }
        }
      };
      userRepository.findById.rejects(new InternalServerError());

      return expect(userController.updateAppRated(req, res))
        .to.eventually.be.rejectedWith('Internal server error')
        .and.to.be.an.instanceOf(InternalServerError);
    });

    it('throw InternalServerError when error in database - updating user', () => {
      const userRepository = { findById: sinon.stub() };
      const req = {
        body: {
          appRated: true
        }
      };
      const res = {
        send: sinon.spy(),
        locals: {
          services: { userRepository },
          views: { userView },
          user: { id: 1 }
        }
      };
      const save = sinon.stub();

      userRepository.findById.resolves({
        id: 1,
        appRated: false,
        save
      });
      save.rejects(new InternalServerError());

      return expect(userController.updateAppRated(req, res))
        .to.eventually.be.rejectedWith('Internal server error')
        .and.to.be.an.instanceOf(InternalServerError);
    });
  });

  describe('getConfirmChargeTerm', () => {
    it('gets user confirmChargeTerm property', () => {
      const userRepository = {
        findById: sinon.stub()
      };
      const req = {};
      const res = {
        locals: {
          services: { userRepository },
          views: { userView },
          user: {
            id: 1
          }
        },
        send: sinon.spy()
      };

      userRepository.findById.resolves({
        id: 1,
        chargerConfirmedTerms: true
      });

      return userController.getConfirmChargeTerm(req, res).then(() => {
        return expect(
          res.send.withArgs({
            id: 1,
            isConfirmChargerTerm: true,
            termsAndConditionsLastUpdated: moment(
              enums.termsAndConditionsLastUpdated
            ),
            dateChargerAcceptedTermsAndConditions: undefined
          })
        ).to.be.calledOnce;
      });
    });

    it('throw NotFoundError when no user', () => {
      const userRepository = { findById: sinon.stub() };
      const req = {};
      const res = {
        send: sinon.spy(),
        locals: {
          services: { userRepository },
          views: { userView },
          user: { id: 1 }
        }
      };
      userRepository.findById.resolves(undefined);

      return expect(userController.getConfirmChargeTerm(req, res))
        .to.eventually.be.rejectedWith('User not found')
        .and.to.be.an.instanceOf(NotFoundError);
    });

    it('throw InternalServerError when error in database', () => {
      const userRepository = { findById: sinon.stub() };
      const req = {};
      const res = {
        send: sinon.spy(),
        locals: {
          services: { userRepository },
          views: { userView },
          user: { id: 1 }
        }
      };
      userRepository.findById.rejects(new InternalServerError());

      return expect(userController.getConfirmChargeTerm(req, res))
        .to.eventually.be.rejectedWith('Internal server error')
        .and.to.be.an.instanceOf(InternalServerError);
    });
  });

  describe('updateConfirmChargeTerm', () => {
    it('updates user chargerConfirmedTerms property', () => {
      const userRepository = {
        findById: sinon.stub()
      };
      const req = {
        body: {
          id: 1,
          chargerConfirmedTerms: true
        }
      };
      const res = {
        locals: {
          services: { userRepository },
          views: { userView },
          user: {
            id: 1
          }
        },
        send: sinon.spy()
      };
      const save = sinon.stub();

      userRepository.findById.resolves({
        id: 1,
        chargerConfirmedTerms: false,
        save
      });
      save.resolves({
        id: 1,
        chargerConfirmedTerms: true
      });

      return userController.updateConfirmChargeTerm(req, res).then(() => {
        return expect(
          res.send.withArgs({
            id: 1,
            isConfirmChargerTerm: true,
            termsAndConditionsLastUpdated: undefined,
            dateChargerAcceptedTermsAndConditions: undefined
          })
        ).to.be.calledOnce;
      });
    });

    it('throw NotFoundError when no user', () => {
      const userRepository = { findById: sinon.stub() };
      const req = {};
      const res = {
        send: sinon.spy(),
        locals: {
          services: { userRepository },
          views: { userView },
          user: { id: 1 }
        }
      };
      userRepository.findById.resolves(undefined);

      return expect(userController.updateConfirmChargeTerm(req, res))
        .to.eventually.be.rejectedWith('User not found')
        .and.to.be.an.instanceOf(NotFoundError);
    });

    it('throw InternalServerError when error in database - finding user', () => {
      const userRepository = { findById: sinon.stub() };
      const req = {};
      const res = {
        send: sinon.spy(),
        locals: {
          services: { userRepository },
          views: { userView },
          user: { id: 1 }
        }
      };
      userRepository.findById.rejects(new InternalServerError());

      return expect(userController.updateConfirmChargeTerm(req, res))
        .to.eventually.be.rejectedWith('Internal server error')
        .and.to.be.an.instanceOf(InternalServerError);
    });

    it('throw InternalServerError when error in database - updating user', () => {
      const userRepository = { findById: sinon.stub() };
      const req = {
        body: {
          chargerConfirmedTerms: true
        }
      };
      const res = {
        send: sinon.spy(),
        locals: {
          services: { userRepository },
          views: { userView },
          user: { id: 1 }
        }
      };
      const save = sinon.stub();

      userRepository.findById.resolves({
        id: 1,
        chargerConfirmedTerms: false,
        save
      });
      save.rejects(new InternalServerError());

      return expect(userController.updateConfirmChargeTerm(req, res))
        .to.eventually.be.rejectedWith('Internal server error')
        .and.to.be.an.instanceOf(InternalServerError);
    });
  });

  describe('getRiderConfirmedTerms', () => {
    it('gets user riderConfirmedTerms property', () => {
      const userRepository = {
        findById: sinon.stub()
      };
      const req = {};
      const res = {
        locals: {
          services: { userRepository },
          views: { userView },
          user: {
            id: 1
          }
        },
        send: sinon.spy()
      };

      userRepository.findById.resolves({
        id: 1,
        riderConfirmedTerms: true
      });

      return userController.getRiderConfirmedTerms(req, res).then(() => {
        return expect(
          res.send.withArgs({
            id: 1,
            isRiderConfirmedTerms: true,
            dateRiderAcceptedTermsAndConditions: undefined,
            termsAndConditionsLastUpdated: moment(
              enums.termsAndConditionsLastUpdated
            )
          })
        ).to.be.calledOnce;
      });
    });

    it('throw NotFoundError when no user', () => {
      const userRepository = { findById: sinon.stub() };
      const req = {};
      const res = {
        send: sinon.spy(),
        locals: {
          services: { userRepository },
          views: { userView },
          user: { id: 1 }
        }
      };
      userRepository.findById.resolves(undefined);

      return expect(userController.getRiderConfirmedTerms(req, res))
        .to.eventually.be.rejectedWith('User not found')
        .and.to.be.an.instanceOf(NotFoundError);
    });

    it('throw InternalServerError when error in database', () => {
      const userRepository = { findById: sinon.stub() };
      const req = {};
      const res = {
        send: sinon.spy(),
        locals: {
          services: { userRepository },
          views: { userView },
          user: { id: 1 }
        }
      };
      userRepository.findById.rejects(new InternalServerError());

      return expect(userController.getRiderConfirmedTerms(req, res))
        .to.eventually.be.rejectedWith('Internal server error')
        .and.to.be.an.instanceOf(InternalServerError);
    });
  });

  describe('updateRiderConfirmedTerms', () => {
    it('updates user riderConfirmedTerms property', () => {
      const userRepository = {
        findById: sinon.stub()
      };
      const req = {
        body: {
          id: 1,
          riderConfirmedTerms: true
        }
      };
      const res = {
        locals: {
          services: { userRepository },
          views: { userView },
          user: {
            id: 1
          }
        },
        send: sinon.spy()
      };
      const save = sinon.stub();

      userRepository.findById.resolves({
        id: 1,
        riderConfirmedTerms: false,
        save
      });
      save.resolves({
        id: 1,
        riderConfirmedTerms: true
      });

      return userController.updateRiderConfirmedTerms(req, res).then(() => {
        return expect(
          res.send.withArgs({
            id: 1,
            isRiderConfirmedTerms: true,
            termsAndConditionsLastUpdated: undefined,
            dateRiderAcceptedTermsAndConditions: undefined
          })
        ).to.be.calledOnce;
      });
    });

    it('throw NotFoundError when no user', () => {
      const userRepository = { findById: sinon.stub() };
      const req = {};
      const res = {
        send: sinon.spy(),
        locals: {
          services: { userRepository },
          views: { userView },
          user: { id: 1 }
        }
      };
      userRepository.findById.resolves(undefined);

      return expect(userController.updateRiderConfirmedTerms(req, res))
        .to.eventually.be.rejectedWith('User not found')
        .and.to.be.an.instanceOf(NotFoundError);
    });

    describe('setUserAcceptConvenienceFeeTerms', () => {
      it('updates user dateAcceptConvenienceFeeTerms property', () => {
        const userRepository = {
          findById: sinon.stub()
        };
        const req = {
          body: {
            id: 1
          }
        };
        const res = {
          locals: {
            services: { userRepository },
            views: { userView },
            user: {
              id: 1
            }
          },
          send: sinon.spy()
        };
        const save = sinon.stub();

        userRepository.findById.resolves({
          id: 1,
          dateAcceptConvenienceFeeTerms: null,
          save
        });
        save.resolves({
          id: 1,
          dateAcceptConvenienceFeeTerms: new Date('2019-03-07 12:02:25.565+08')
        });

        return userController
          .setUserAcceptConvenienceFeeTerms(req, res)
          .then(() => {
            return expect(res.send).to.be.calledOnce;
          });
      });

      it('throw NotFoundError when no user', () => {
        const userRepository = { findById: sinon.stub() };
        const req = {};
        const res = {
          send: sinon.spy(),
          locals: {
            services: { userRepository },
            views: { userView },
            user: { id: 1 }
          }
        };
        userRepository.findById.resolves(undefined);

        return expect(userController.setUserAcceptConvenienceFeeTerms(req, res))
          .to.eventually.be.rejectedWith('User not found')
          .and.to.be.an.instanceOf(NotFoundError);
      });
    });

    it('throw InternalServerError when error in database - finding user', () => {
      const userRepository = { findById: sinon.stub() };
      const req = {};
      const res = {
        send: sinon.spy(),
        locals: {
          services: { userRepository },
          views: { userView },
          user: { id: 1 }
        }
      };
      userRepository.findById.rejects(new InternalServerError());

      return expect(userController.updateRiderConfirmedTerms(req, res))
        .to.eventually.be.rejectedWith('Internal server error')
        .and.to.be.an.instanceOf(InternalServerError);
    });

    it('throw InternalServerError when error in database - updating user', () => {
      const userRepository = { findById: sinon.stub() };
      const req = {
        body: {
          riderConfirmedTerms: true
        }
      };
      const res = {
        send: sinon.spy(),
        locals: {
          services: { userRepository },
          views: { userView },
          user: { id: 1 }
        }
      };
      const save = sinon.stub();

      userRepository.findById.resolves({
        id: 1,
        riderConfirmedTerms: false,
        save
      });
      save.rejects(new InternalServerError());

      return expect(userController.updateRiderConfirmedTerms(req, res))
        .to.eventually.be.rejectedWith('Internal server error')
        .and.to.be.an.instanceOf(InternalServerError);
    });
  });

});
