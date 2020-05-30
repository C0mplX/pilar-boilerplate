# Pilar boilerplate
A starter project to use with the polar-server npm package. It inlcudes the following features. 
1. Sequalize setup
2. Full user login support using JWT. 

## Setup local development
You need to setup a database. You can descide your self how you want to do this, but the
easiest way is using docker. 

#### Run database with docker
`$ docker run --name pilar_db -p 4307:3306 -v pilar_db:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=db_root_password -e MYSQL_USER=auth_gate_db_user -e MYSQL_PASSWORD=auth_gate_db_password -d mysql --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_c`

The docker command above is setup to use the supported env file included in the project. Simply copy the
.env-sample and rename it .env, thats it! if you have change something in the docker command, like db password
or are running a different database remember to update your .env accordingly. 

#### Install dependencies
When the database is setup you can simply run

`$ yarn install`

Then run
 
`$ yarn start`

Your server wil then start to run on PORT 3001. You can change this in the `./src/server.ts`


### Project structure
The project consists of three main parts. `routes`, `middlewares` and `models`.

#### Routes
This is where you register all your routes. The project allready contains a user route
so use that as an example to build your own routes. All routes are classes that implements a
base route from `pilar-server`. Its important that all routes look like this in order to
work propperly `class UserRoutes extends BaseRouter implements IBaseRouter`

#### Models 
The models as written using [sequelize-typescript](https://www.npmjs.com/package/sequelize-typescript)
See the documentation for how to use it. 

### Middlewares
The middlewares are normal express middlewares. it contains all the middlewares you need to authenticate
the user. Feel free to extend or add new ones as you need. 


## Database migrations

### create a empty migration file
yarn sequelize-cli migration:generate --name migration-skeleton

### manuel migration
yarn sequelize-cli db:migrate
