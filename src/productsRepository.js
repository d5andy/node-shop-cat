"use strict";
const ENV_DIFF = `
(select max(version) as version, sku from product p where $1 = ANY(env) group by sku)
EXCEPT
(select max(p1.version), p1.sku from product p1 where $2 = ANY(p1.env) group by p1.sku);
`;
const INSERT_INTO_PRODUCT = `
      INSERT INTO PRODUCT(sku, thejson, version, env) VALUES($1, $2, $3, ARRAY[$4])
      RETURNING *;
    `;
const UPDATE_ENV = `
      UPDATE PRODUCT SET env = array_append(env, $1) WHERE sku = $2 AND version = $3
      RETURNING *;
    `;
const SELECT_BY_SKU = `
      SELECT p1.sku, p1.version, p1.theJson FROM
        PRODUCT p1,
        (
          SELECT sku, max(version) as version FROM PRODUCT WHERE sku=$1 AND $2 = ANY(env)
          GROUP BY sku
        ) p2
      WHERE
        p1.sku = p2.sku AND p1.version = p2.version AND $2 = ANY(p1.env);
    `;


module.exports = class ProductsRepository {
  constructor(db) {
    this.db = db;
  }
  diff(fromEnv, toEnv) {
    return this.db.manyOrNone(ENV_DIFF, [fromEnv, toEnv]);
  }
  promote(rows, toEnv) {
    return Promise.all(
      rows.map(row => {
        return this.db.one(UPDATE_ENV, [toEnv, row.sku, row.version])
          .catch(err => console.log(err))
      })
    )
  }
  get(sku, stage) {
    return this.db.oneOrNone(SELECT_BY_SKU, [sku, stage])
      .catch(err => console.log(err));
  }
  insert(stage, sku, updatedJSON) {
    return this.db.one(INSERT_INTO_PRODUCT, [sku, updatedJSON, new Date().getTime(), stage])
      .catch(console.log);
  }
}
