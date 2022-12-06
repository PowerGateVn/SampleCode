# Stump API

Setup enviroment configurations (.env.development or .env.production) 

## Start project

1. yarn install
2. yarn build
3. yarn start

## Database with Sequelize

### Migration

#### Create file migration

node_modules/.bin/sequelize migration:generate --name

#### Run migrate db

node_modules/.bin/sequelize db:migrate

#### Undo migrate db

node_modules/.bin/sequelize db:migrate:undo:all --to

### Seed

#### Create seed

node_modules/.bin/sequelize seed:generate --name

#### Run seed

node_modules/.bin/sequelize db:seed:all

#### Undo seed

node_modules/.bin/sequelize db:seed:undo:all
