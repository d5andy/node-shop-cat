"use strict";

const MAX_LIMIT = 200

module.exports = async function loadAllProducts(config, repo, limiter) {
  let resp = await limiter.get(`${config.shopUrl}/products/count.json`, 'GET')
  let pages = Math.ceil(resp.count / MAX_LIMIT)
  let inserts = []
  console.log(`loading pages ${pages}`);
  for (var i = 0; i < pages; i++) {
    process.stdout.write('+')
    var products = await limiter.get(`${config.shopUrl}/products.json?page=${i + 1}&limit=${MAX_LIMIT}`)
    console.log(`inserting products ${products.products.length}`);
    for (var product of products.products) {
      process.stdout.write(`#${product.id}#`)
      let metafields = await limiter.get(`${config.shopUrl}/products/${product.id}/metafields.json`)
      let skus = product.variants.map(variant => {
        return variant.sku
      })
      let inserted = await repo.upsert(product.id, config.stage, config.ccy, skus,
        JSON.stringify({
          product: product,
          metafields: metafields
        }))
      inserts = inserts.concat(inserted);
      process.stdout.write(`,`)
    }
  }
  return inserts;
}
