"use strict";
const ShopifyProductsRepository = require('./shopifyProductsRepository'),
      shopConfiguration = require('./shopifyConfiguration'),
      convert = require('./rowToShopifyProducts'),
      allshops = ['USD', 'EUR', 'USD', 'UK', 'GBP'],
      ccyForStage = { dev: ['USD'], live: allshops, qa: allshops, demo: allshops };

async function send(limiter, convertedProduct, shopProduct, config, sku) {
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

function filteredForCcy(products, ccy) {
  return products.filter(product => {
    return product[`Variant Price ${ccy}`]
  })
}

module.exports = async function sendUpdates(limiter, repo, stage, products) {
  var results = []
  for (var ccy of ccyForStage[stage]) {
    let config = await shopConfiguration.getShopConfiguration(stage, ccy)
    for (var product of filteredForCcy(products, ccy)) {
      let convertedProduct = convert(product, ccy.toUpperCase(), `https://my.pottermore.com`)
      let sku = convertedProduct.variants[0].sku
      let shopProduct = await repo.get(stage, ccy, sku)
      let updatedProduct = await send(limiter, convertedProduct, shopProduct, config, sku)
      let metafields = await limiter.get(`${config.shopUrl}/products/${updatedProduct.product.id}/metafields.json`)
      await repo.upsert(updatedProduct.product.id, stage, ccy, [sku], JSON.stringify({
        product: updatedProduct.product,
        metafields: metafields
      }))

      results = results.concat(updatedProduct.id)
    }
  }
  console.log(results.join(','));
  return Promise.resolve(results)
}
