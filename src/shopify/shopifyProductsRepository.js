"use strict";

const SELECT_BY_SKU = `
  SELECT * FROM SHOPIFY_PRODUCT
  WHERE $1 = ANY(skus) AND stage = $2 AND ccy=$3;
`;
const UPSERT_SHOPIFY_PRODUCT = `
  INSERT INTO SHOPIFY_PRODUCT(id, stage, ccy, skus, theJson, version)
  VALUES($1, $2, $3, $4, $5, $6)
  ON CONFLICT (id, stage, ccy) DO UPDATE SET skus = $4, theJson = $5, version = $6
  RETURNING *;
`;

module.exports = class ShopifyProductsRepository {
  constructor(db) {
    this.db = db;
  }
  get(stage, ccy, sku) {
    return this.db.oneOrNone(SELECT_BY_SKU, [sku, stage, ccy])
      .catch(err => console.log(err));
  }
  upsert(id, stage, ccy, skus, updatedJSON) {
    return this.db.one(UPSERT_SHOPIFY_PRODUCT, [id, stage, ccy, skus, updatedJSON, new Date().getTime()])
      .catch(err => console.log(err));
  }
}
