import {Pilar} from "pilar-server";
import {routes} from "./routes";
import {Sequelize} from 'sequelize-typescript';
import dotenv from 'dotenv';
if (process.env.NODE_ENV === 'dev') {
  dotenv.config();
}

const pilar = new Pilar({
  port: 3001,
  cors: true,
  baseRoute: '/api',
  routes
});

export const sequelize =  new Sequelize({
  database: process.env.DATABASE,
  dialect: process.env.DIALECT as 'postgres',
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: +process.env.DB_PORT,
  models: [__dirname + '/models']
});

sequelize.authenticate()
  .then(() => {
    pilar.listen();
  })
  .catch((err: any) => {
    console.error('Unable to connect to the database:', err);
  });
