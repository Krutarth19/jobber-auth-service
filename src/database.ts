import { Logger } from 'winston';
import { winstonLogger } from '@Krutarth19/jobber-shared';
import { Sequelize } from 'sequelize';
import { config } from '@auth/config';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authDatabaseServer', 'debug');

export const sequelize: Sequelize = new Sequelize(`${config.MYSQL_DB}`, {
  dialect: 'mysql',
  port: 3306,
  host: 'mysql_container',
  logging: false,
  dialectOptions: {
    multipleStatements: true
  }
});

export async function databaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    log.info('AuthService Mysql database connection has been established successfully.');
  } catch (error) {
    console.log(error);
    log.error('Auth Service - Unable to connect to database.');
    log.log('error', 'AuthService databaseConnection() method error:', error);
  }
}
