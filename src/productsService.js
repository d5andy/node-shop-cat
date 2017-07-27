"use strict";
const ProductsRepository = require('./productsRepository'),
  sheet = require('./spreadsheet');

async function findChangesInSpreadsheet(productsRepo, stage) {
  var rows = await sheet.rowsAsJson()
  var changes = []
  for (let row of rows) {
      let sku = row['Variant SKU'];
      let existingProduct = await productsRepo.get(sku, stage)
      if (!existingProduct || existingProduct.thejson !== JSON.stringify(row)) {
          changes = changes.concat(row)
      }
  }
  return changes
}

module.exports = class ProductsService {
  constructor(db) {
    this.productsRepo = new ProductsRepository(db);
  }
  slurpSpreadsheet(stage) {
    return findChangesInSpreadsheet(this.productsRepo, stage)
  }
  insert(stage, products) {
    // console.log(products);
      return Promise.all(products.map(product => {
      let sku = product['Variant SKU'];
      return this.productsRepo.insert(stage, sku, JSON.stringify(product))
    })).catch(console.log)
  }
  promoteLatestChangesFrom(fromEnv, toEnv) {
    return this.productsRepo.diff(fromEnv, toEnv)
      .then(rows => this.productsRepo.promote(rows, toEnv))
      .then(rows => {
        console.log(`Updated ${rows.length} ${rows.map(row => row.sku)}`);
        return Promise.resolve(rows);
      })
      .catch(err => console.log(err));
  }
}
