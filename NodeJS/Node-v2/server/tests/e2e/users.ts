import { expect } from '../helpers/chai';
import request from 'supertest';
import httpStatus from 'http-status';
import modelFactory from '../../models/index';
import { emptyTables, createUser, createAccount } from '../helpers/fixtures';
import app from '../../../index';
import config from '../../../config';
import jwt from 'jsonwebtoken';
import roles from '../../helpers/roles';
import uuid from 'uuid/v4';

describe('Users', () => {
  const models = modelFactory;

  beforeEach('setUp', async () => {
    await emptyTables();

    return Promise.all([
      createUser(
        { id: 1, email: 'test@email.com', riderConfirmedTerms: true },
        models.User
      ),
      createUser({ id: 2, chargerConfirm: true }, models.User),
      createAccount(
        { id: uuid(), role: roles.setRoles('1', '0', '0', '0') },
        models.Account
      )
    ]);
  });

  it('gets user', () => {
    const token = jwt.sign({ id: 1 }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });

    return request(app)
      .get('/api/users/')
      .set('authorization', `JWT ${token}`)
      .then(response => {
        expect(response.statusCode, `Got: ${response.text}.`).to.be.equal(
          httpStatus.OK
        );
        expect(response.body.id, `Got: ${response.text}.`).to.be.equal(1);
      });
  });

  it('update: updates current user', () => {
    const token = jwt.sign({ id: 1 }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });
    const newUserData = {
      firstName: 'updatedFirstName',
      lastName: 'updatedLastName',
      email: 'updated@email.com'
    };

    return request(app)
      .put('/api/users/')
      .set('authorization', `JWT ${token}`)
      .send(newUserData)
      .then(response => {
        expect(response.body.success).to.be.equal(true);
        expect(response.body.message).to.be.equal('success');
        expect(response.body.response).to.be.empty;
        expect(response.body.error).to.be.equal('');
        expect(response.body.data.id).to.be.equal(1);
        expect(response.body.data.firstName).to.be.equal('updatedFirstName');
        expect(response.body.data.lastName).to.be.equal('updatedLastName');
        expect(response.body.data.email).to.be.equal('updated@email.com');
      });
  });

  it('update: updates current user to empty mail', () => {
    const token = jwt.sign({ id: 1 }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });
    const newUserData = {
      firstName: 'updatedFirstName',
      lastName: 'updatedLastName',
      email: ''
    };

    return request(app)
      .put('/api/users/')
      .set('authorization', `JWT ${token}`)
      .send(newUserData)
      .then(response => {
        expect(response.body.success).to.be.equal(true);
        expect(response.body.message).to.be.equal('success');
        expect(response.body.response).to.be.empty;
        expect(response.body.error).to.be.equal('');
        expect(response.body.data.id).to.be.equal(1);
        expect(response.body.data.firstName).to.be.equal('updatedFirstName');
        expect(response.body.data.lastName).to.be.equal('updatedLastName');
        expect(response.body.data.email).to.be.equal(null);
      });
  });

  it('update: returns bad request error when email is null', () => {
    const token = jwt.sign({ id: 1 }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });
    const newUserData = {
      firstName: 'updatedFirstName',
      lastName: 'updatedLastName',
      email: null
    };

    return request(app)
      .put('/api/users/')
      .set('authorization', `JWT ${token}`)
      .send(newUserData)
      .then(response => {
        expect(response.statusCode).to.be.equal(httpStatus.BAD_REQUEST);
      });
  });

  it('update: returns bad request error when required field is missing', () => {
    const token = jwt.sign({ id: 1 }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });
    const newUserData = {
      firstName: 'updatedFirstName',
      email: 'updated@email.com'
    };

    return request(app)
      .put('/api/users/')
      .set('authorization', `JWT ${token}`)
      .send(newUserData)
      .then(response => {
        expect(response.statusCode).to.be.equal(httpStatus.BAD_REQUEST);
      });
  });

  it('updateAppRated: updates user appRated property', () => {
    const token = jwt.sign({ id: 1 }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });
    const newUserData = {
      appRated: true
    };

    return request(app)
      .post('/api/users/updateAppRated/')
      .set('authorization', `JWT ${token}`)
      .send(newUserData)
      .then(response => {
        expect(response.statusCode).to.be.equal(httpStatus.OK);
        expect(response.body.id).to.be.equal(1);
        expect(response.body.appRated).to.be.equal(true);
      });
  });

  it('updateAppRated: returns bad request when body is invalid', () => {
    const token = jwt.sign({ id: 1 }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });

    return request(app)
      .post('/api/users/updateAppRated/')
      .set('authorization', `JWT ${token}`)
      .send({ appRated: 'test' })
      .then(response => {
        expect(response.statusCode).to.be.equal(httpStatus.BAD_REQUEST);
      });
  });

  it('getConfirmChargeTerm: returns correct chargerConfirmedTerms', () => {
    const token1 = jwt.sign({ id: 1 }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });
    const token2 = jwt.sign({ id: 2 }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });

    return Promise.all([
      request(app)
        .get('/api/users/getConfirmChargeTerm')
        .set('authorization', `JWT ${token1}`)
        .then(response => {
          expect(response.body.isConfirmChargerTerm).to.be.equal(false);
        }),
      request(app)
        .get('/api/users/getConfirmChargeTerm')
        .set('authorization', `JWT ${token2}`)
        .then(response => {
          expect(response.body.isConfirmChargerTerm).to.be.equal(true);
        })
    ]);
  });

  it('updateConfirmChargeTerm: updates chargerConfirmedTerms', () => {
    const token = jwt.sign({ id: 1 }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });

    return request(app)
      .post('/api/users/updateConfirmChargeTerm')
      .set('authorization', `JWT ${token}`)
      .send({ chargerConfirmedTerms: true })
      .then(response => {
        expect(response.statusCode).to.be.equal(httpStatus.OK);
        expect(response.body.id).to.be.equal(1);
        expect(response.body.isConfirmChargerTerm).to.be.equal(true);
      });
  });

  it('updateConfirmChargeTerm: returns bad request when body is invalid', () => {
    const token = jwt.sign({ id: 1 }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });

    return request(app)
      .post('/api/users/updateConfirmChargeTerm')
      .set('authorization', `JWT ${token}`)
      .send({})
      .then(response => {
        expect(response.statusCode).to.be.equal(httpStatus.BAD_REQUEST);
      });
  });

  it('getRiderConfirmedTerms: returns correct riderConfirmedTerms', () => {
    const token1 = jwt.sign({ id: 1 }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });
    const token2 = jwt.sign({ id: 2 }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });

    return Promise.all([
      request(app)
        .get('/api/users/getRiderConfirmedTerms')
        .set('authorization', `JWT ${token1}`)
        .then(response => {
          expect(response.body.isRiderConfirmedTerms).to.be.equal(true);
        }),
      request(app)
        .get('/api/users/getRiderConfirmedTerms')
        .set('authorization', `JWT ${token2}`)
        .then(response => {
          expect(response.body.isRiderConfirmedTerms).to.be.equal(false);
        })
    ]);
  });

  it('updateRiderConfirmedTerms: updates riderConfirmedTerms', () => {
    const token = jwt.sign({ id: 1 }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });

    return request(app)
      .post('/api/users/updateRiderConfirmedTerms')
      .set('authorization', `JWT ${token}`)
      .send({ riderConfirmedTerms: true })
      .then(response => {
        expect(response.statusCode).to.be.equal(httpStatus.OK);
        expect(response.body.id).to.be.equal(1);
        expect(response.body.isRiderConfirmedTerms).to.be.equal(true);
      });
  });

  it('updateRiderConfirmedTerms: returns bad request when body is invalid', () => {
    const token = jwt.sign({ id: 1 }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });

    return request(app)
      .post('/api/users/updateRiderConfirmedTerms')
      .set('authorization', `JWT ${token}`)
      .send({})
      .then(response => {
        expect(response.statusCode).to.be.equal(httpStatus.BAD_REQUEST);
      });
  });
});
