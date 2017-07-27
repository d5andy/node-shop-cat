"use strict";

const shopifyService = require('./shopifyService');

describe("shopify service", function() {
    it("get products", (resolve, reject) => {
      shopifyService.getProducts().then(
        (products) => {
          resolve();
        });
    });
});
