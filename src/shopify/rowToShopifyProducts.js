"use strict";
const removeDiacritics = require('diacritics').remove,
      buildMetafields = require('./rowToMetafields').buildMetafields,
      SKU = 'Variant SKU',
      VARIANT_REQUIRES_SHIPPING = 'Variant Requires Shipping';

module.exports = function convertToProduct(row, ccy, baseUrl) {
  let rowHandle = row['handle'];
  let product = {
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
  return populatePublished(product, ccy, row)
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

function populatePublished(product, ccy, row) {
  let publishedColumnValue = row['Publish ' + ccy]
  let isBoolean = publishedColumnValue.toUpperCase().trim() in ['', 'TRUE', 'FALSE', '0', '1']
  let date = !isBoolean ? Date.parse(publishedColumnValue) : null
  let now = Date.now()
  if ((date && date < now) || (publishedColumnValue == '1' || publishedColumnValue.toLowerCase() == 'true')) {
    product.published = true
  } else if (date > now) {
    product.published = false
    product.publish_on = date
  } else {
    product.published = false
  }
  return product
}
