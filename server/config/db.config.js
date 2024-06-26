/**
 * @file Config file for main node app. Governs interaction with the
 * database, and the JSON Web Token given to authenticated
 * clients. Under normal circumstanes, gets DB information from
 * env variables (generated by project docker-compose.yml file)
 * @author David J. Thomas
 */

module.exports = {
  HOST: process.env.DB_HOST || 'localhost',
  USER: process.env.DB_USER || 'root',
  PASSWORD: process.env.DB_PASSWORD || 'password',
  DB: process.env.DB_NAME || 'chronicles',
  port: process.env.DB_PORT || '3307',
  dialect: 'mysql',
  pool: {
    max: 500,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  OWNER_USERNAME: process.env.OWNER_USERNAME || 'chroniclesowner',
  OWNER_PASSWORD: process.env.OWNER_PASSWORD || 'password',
  OWNER_EMAIL: process.env.OWNER_EMAIL || 'sample@email.com'
};
