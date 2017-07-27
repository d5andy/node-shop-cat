const pgp = require('pg-promise')(),
      config = {
        user: 'joe',
        host: 'localhost',
        database: 'jerry',
        password: 'password',
        port: 5432
      },
      db = pgp(config);

module.exports = {
  db: db,
  pgp: pgp
}
