const pgp = require('pg-promise')(),
      config = {
        user: 'joe',
        host: 'localhost',
        database: 'jerry',
        password: 'password',
        port: 5432
      },
      db = pgp(config);


const DROP_PRODUCT_TABLE = 'DROP TABLE IF EXISTS PRODUCT;';
const DROP_SHOPIFY_PRODUCT_TABLE = 'DROP TABLE IF EXISTS SHOPIFY_PRODUCT;';

const CREATE_PRODUCT_TABLE = `
CREATE TABLE PRODUCT (
  id SERIAL PRIMARY KEY,
  sku character varying(36),
  thejson text,
  version bigint,
  env text ARRAY);
`;

const CREATE_SHOPIFY_PRODUCT_TABLE = `
CREATE TABLE SHOPIFY_PRODUCT (
  id bigint,
  skus text ARRAY,
  thejson text,
  ccy character varying(3),
  stage character varying(3),
  version bigint,
  PRIMARY KEY (id, stage, ccy));
`;

db.none(DROP_PRODUCT_TABLE)
  .then(() => db.none(DROP_SHOPIFY_PRODUCT_TABLE))
  .then(() => db.none(CREATE_PRODUCT_TABLE))
  .then(() => console.log('PRODUCT TABLE CREATED'))
  .then(() => db.none(CREATE_SHOPIFY_PRODUCT_TABLE))
  .then(() => console.log('SHOPIFY PRODUCT TABLE CREATED'))
  .catch((err) => console.log)
  .then(() => pgp.end());
