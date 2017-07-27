"use strict";
const limiter = require('./requestlimiter'),
  ShopifyProductsRepository = require('./shopifyProductsRepository'),
  shopConfiguration = require('./shopifyConfiguration'),
  convert = require('./shopify/shopifyProducts'),
  allshops = ['USD', 'EUR', 'USD', 'UK', 'GBP'],
  ccyForStage = { dev: ['USD'], live: allshops, qa: allshops, demo: allshops },
  MAX_LIMIT = 200;

async function loadAllProducts(config, repo) {
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

async function sendUpdates(convertedProduct, shopProduct, config, sku) {
  let updatedProduct = null
  if (shopProduct) {
    let thejson = JSON.parse(shopProduct.thejson)
    convertedProduct.metafields.map(mf => {
      let found = thejson.metafields.metafields.find(f => {return f.key == mf.key;})
      if (found) {
        mf.id = found.id
      }
      return mf
    })
    updatedProduct = await limiter.put(`${config.shopUrl}/products/${shopProduct.id}.json`, {product: convertedProduct})
    console.log(`PUT ${sku}`)
  } else {
    updatedProduct = await limiter.post(`${config.shopUrl}/products.json`, {product: convertedProduct})
    console.log(`POST ${sku}`)
  }
  return updatedProduct
}

async function sendUpdatesForProductsToShopsAsync(repo, stage, products) {
  var results = []
  for (var ccy of ccyForStage[stage]) {
    let config = await shopConfiguration.getShopConfiguration(stage, ccy)
    for (var product of getProductsForCcy(products, ccy)) {
      let convertedProduct = convert(product, ccy.toUpperCase(), `https://my.pottermore.com`)
      let sku = convertedProduct.variants[0].sku
      let shopProduct = await repo.get(stage, ccy, sku)
      let updatedProduct = await sendUpdates(convertedProduct, shopProduct, config, sku)
      let metafields = await limiter.get(`${config.shopUrl}/products/${updatedProduct.product.id}/metafields.json`)
      await repo.upsert(updatedProduct.product.id, stage, ccy, [sku], JSON.stringify({
        product: updatedProduct.product,
        metafields: metafields
      }))

      results = results.concat(updatedProduct.id)
    }
  }
  console.log(results.join(','));
  return Promise.resolve(results.join(','))
}

function getProductsForCcy(products, ccy) {
  return products.filter(product => {
    return product[`Variant Price ${ccy}`]
  })
}

module.exports = class ShopifyService {
  constructor(db) {
    this.repo = new ShopifyProductsRepository(db);
  }
  loadProducts(stage, ccy) {
    return shopConfiguration.getShopConfiguration(stage, ccy)
      .then(config => loadAllProducts(config, this.repo))
      .catch(err => console.log(err))
  }
  sendUpdatesForProductsToShops(stage, products) {
    return sendUpdatesForProductsToShopsAsync(this.repo, stage, products)
  }
  async findProduct(stage, ccy, sku) {
    return Promise.resolve(this.repo.get(stage, ccy, sku));
  }
}
