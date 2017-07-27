"use strict";
const db = require('./database'),
      ShopifyService = require('./shopifyService'),
      ProductsService = require('./productsService'),
      stage = process.env.STAGE,
      ccy = process.env.CCY;

const argv = require('minimist')(process.argv.slice(2));

if (!stage) {
  console.log('Please provide STAGE env var');
  return
}

async function sendUpdatesForProductsToShops(db, stage, products) {
    if (products && products.length > 0) {
      let shopify = new ShopifyService(db)
      let result = await shopify.sendUpdatesForProductsToShops(stage, products)
    }
   return products
}

if (argv.s) {
  console.log('slurp the spreadsheet');
  let productsService = new ProductsService(db.db);
  productsService.slurpSpreadsheet(stage)
    .then(products => sendUpdatesForProductsToShops(db.db, stage, products))
    .then(products => productsService.insert(stage, products))
    .catch(console.log)
    .then(db.pgp.end);
}

if (argv.p) {
  let envs = argv.p.split(',')
  let fromStage = envs[0]
  let toStage = envs[1]
  console.log(`promote ${fromStage} to ${toStage}`);
  let productsService = new ProductsService(db.db)
  productsService.changesToPromote(fromStage, envs[1])
    .then(products => sendUpdatesForProductsToShops(db.db, toStage, products))
    .then(rows => productsService.promoteChanges(rows, toStage))
    .catch(console.log)
    .then(db.pgp.end);
}

if (argv.l) {
  new ShopifyService(db.db).loadProducts(stage, ccy)
  .catch(console.log)
  .then(db.pgp.end);
}

if (argv.q) {
  new ShopifyService(db.db).findProduct(stage, ccy, argv.q.toString())
    .then(console.log)
    .catch(console.log)
    .then(db.pgp.end);
}
