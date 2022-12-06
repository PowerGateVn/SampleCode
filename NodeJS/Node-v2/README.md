# beam-api

[Node.js][1]/[Express.js][2] based API for [mobile][3] and [web app][4]


## Getting Started

### Prerequisites

- [Node][1] (LTS version recommended)
- PostgreSQL with PostGIS
- Redis

```bash
brew install node postgresql redis
redis-server
```

### Configuration

Create a local `.env` file based on the template:

```bash
cp .env.dev .env
```

Update your local database information in `.env`

### Environment Variables

Enviroment variable should be added or modified in `.env.dev` or `.env.test` for development and environment variable section in Elastic Beanstalk for production.

### Install dependencies

```bash
yarn
```

### Database setup

You should have PostgreSQL running.

```bash
yarn sequelize db:create
yarn db:schema
yarn db:migrate
yarn db:seed
```

## Running the app

### Development

```bash
yarn start:dev:all
```

If you want to attach a debugger, follow the instruction:

- [WebStorm, PhpStorm](https://www.jetbrains.com/help/phpstorm/running-and-debugging-node-js.html#remote_debugging)
- [Chrome Dev Tools](chrome://inspect/#devices)

```bash
yarn start:debug
```

Go to `about:inspect`, and click **inspect** under **Remote Target**, then go
to source (`Command + P`) allows to add breakpoints.

### Production

```bash
yarn build
yarn start
```

## Code Style

beam-api uses Airbnb's style guide as a base style guide. `.eslintrc.js`
contains specific rule overrides and additions. Changes to the codebase must
pass the linter before they can be committed.

### Asynchronous Code

Prefer promises and async/await over callbacks.

Note that async/await is not a replacement for promises. Here is a contrived
example that demonstrates the value of using both:

<details><summary>Concurrent Awaits</summary>

```javascript
const trip1 = await tripModel.findById(1);
const trip2 = await tripModel.findById(2);
```

This is not optimal because `trip2` does not depend on `trip1`, yet the
JavaScript engine will wait to find `trip2` until `trip1` is found. Instead do:

```javascript
const [trip1, trip2] = await Promise.all([
  tripModel.findById(1),
  tripModel.findById(2)
]);
```

</details>

Third-party libraries functions which use callbacks should be wrapped in
promises. Existing callbacks should be refactored to promises.

### Database Models

We use [Sequelize][5] as a DB ORM. Logic for operating on database models
should be contained in database service modules. Such logic should not be in
the controllers. The exception is single function calls, e.g. `findById`, which
are fine. Moving database logic from controllers to services is an ongoing
process.

### Database Migrations

We use migration files to track changes to our DB schema. Migration files are located in `server/migrations` and follow a strict ordering based on timestamp. To create a migration file, do the following: `yarn db:migration:generate <descriptive_migration_name>`.

Migration conflicts can occur if multiple people are working on migrations at the same time. If you are working on a migration, be aware of any new migrations when updating your branch.

## Testing

The project contains three categories of tests. To run all tests with one
command:

```bash
yarn test
```

By default, logging is disabled in tests. To turn logging on, use
`ENABLE_TEST_LOGGING=true`.

The test database can be cleared and recreated using:

```bash
NODE_ENV=test sequelize db:drop
NODE_ENV=test sequelize db:create
yarn db:schema:test
yarn db:migrate:test
yarn db:seed:test
```

### Unit tests

```bash
yarn test:unit
```

Test a single thing at a time. Unit tests should be fast, should not rely on
external dependencies, and should be run regularly (during automated builds).

### Integration tests

```bash
yarn test:integration
```

Test the interactions between modules/services. Such tests can test
integrations amongst internal services as well as integrations with external services.

### E2E tests

```bash
yarn test:e2e
```

[1]: https://nodejs.org/en/
[2]: https://expressjs.com/
[3]: https://github.com/TonChu/api-template
[4]: https://github.com/TonChu/api-template
[5]: http://docs.sequelizejs.com/


