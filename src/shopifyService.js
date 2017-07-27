"use strict";
const limiter = require('./requestlimiter'),
  ShopifyProductsRepository = require('./shopify/shopifyProductsRepository'),
  shopConfiguration = require('./shopify/shopifyConfiguration'),
  loadAllProducts = require('./shopify/loadProducts'),
  sendUpdates = require('./shopify/sendUpdates');

module.exports = class ShopifyService {
  constructor(db) {
    this.repo = new ShopifyProductsRepository(db);
  }
  loadProducts(stage, ccy) {
    return shopConfiguration.getShopConfiguration(stage, ccy)
      .then(config => loadAllProducts(config, this.repo, limiter))
      .catch(err => console.log(err))
  }
  sendUpdatesForProductsToShops(stage, products) {
    return sendUpdates(limiter, this.repo, stage, products)
  }
  async findProduct(stage, ccy, sku) {
    return Promise.resolve(this.repo.get(stage, ccy, sku));
  }
}
