"use strict";
const removeDiacritics = require('diacritics').remove,
      buildMetafields = require('./metafields').buildMetafields,
      SKU = 'Variant SKU',
      VARIANT_REQUIRES_SHIPPING = 'Variant Requires Shipping';

module.exports = function convertToProduct(row, ccy, baseUrl) {
  let rowHandle = row['handle'];
  return {
    handle: removeDiacritics(rowHandle),
    title: row['Title'],
    body_html: row['Body (HTML)'],
    vendor: row['Vendor'],
    product_type: row['Type'],
    template_suffix: row['Product Template'],
    tags: row['Tags'],
    metafields_global_title_tag: row['SEO Title'],
    metafields_global_description_tag: row['SEO Description'],
    variants: buildVariants(row, ccy),
    images: buildImages(row, baseUrl),
    metafields: buildMetafields(row)
  }
}

function buildVariants(row, ccy) {
  let variants =  {
      sku: row[SKU],
      price: row['Variant Price ' + ccy],
      barcode: row['Variant Barcode'],
      requires_shipping: row['Variant Requires Shipping'],
      taxable: row['Variant Taxable'],
      compare_at_price: row['Variant Compare At Price - ' + ccy],
      fulfilment_service: row['Fulfilment Service'],
      inventory_management: isPhysicalProduct(row) ? 'shopify' : '',
      inventory_policy: row['Inventory Policy'],
      weight: row['Weight'],
      weight_unit: row['Weight Unit'] ? row['Weight Unit'].toLowerCase() : null
    }
    return [variants];
}

function buildImages(row, baseUrl) {
    let prefix = `${baseUrl}/assets/img/books/covers/${row[SKU]}`
    let images = isPhysicalProduct(row) ?
        [{src: `${prefix}_p.jpg`}, {src: `${prefix}_L1.jpg`}, {src: `${prefix}_L2.jpg`}] :
        [{src: `${prefix}.jpg`}]
    return images;
}

function isPhysicalProduct(row) {
  let entry = row[VARIANT_REQUIRES_SHIPPING]
  if (entry) {
    switch (entry.toLowerCase()) {
          case '1':
          case 'true':
              return true
              break;
          default:
              return false
      }
  } else {
    return false
  }
}
