## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Editor

- Visual studio code
- Extension: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Swagger UI

```bash
# development
$ npm run start
$ http://localhost:3000/swagger
```

## Create and run migrations

```bash
# create new migration file
$ npm run typeorm:migrate ./src/database/migrations/create-users-table

# run migration
$ npm run typeorm:run

# revert migration
$ npm run typeorm:revert
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).
