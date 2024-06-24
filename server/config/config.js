/**
 * @file Config file for sequelize ORM, used to interact with the database.
 * Under normal circumstanes, gets DB information from env
 * variables (generated by project docker-compose.yml file)
 * @author David J. Thomas
 */

module.exports = {
  'development': {
    'username': process.env.DB_USER || 'root',
    'password': process.env.DB_PASSWORD || 'password',
    'database': process.env.DB_NAME || 'chronicles',
    'port': process.env.DB_PORT || 3306,
    'host': process.env.DB_HOST || '127.0.0.1',
    'dialect': 'mysql'
  },
  'test': {
    'username': process.env.DB_USER || 'root',
    'password': process.env.DB_PASSWORD || 'password',
    'database': process.env.DB_NAME || 'chronicles',
    'port': process.env.DB_PORT || 3306,
    'host': process.env.DB_HOST || '127.0.0.1',
    'dialect': 'mysql'
  },
  'production': {
    'username': process.env.DB_USER || 'root',
    'password': process.env.DB_PASSWORD || 'password',
    'database': process.env.DB_NAME || 'chronicles',
    'port': process.env.DB_PORT || 3306,
    'host': process.env.DB_HOST || '127.0.0.1',
    'dialect': 'mysql'
  }
};
