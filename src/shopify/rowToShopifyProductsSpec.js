"use strict";
const spreadsheetRow = `{"order rank":"426","book number":"Hippogriff","Type":"Poster","Variant SKU":"PST00059-MED","Variant Barcode":"5060523901159","Title":"Hippogriff","handle":"Hippogriff-Poster","Vendor":"Pottermore from J.K. Rowling","SEO Title":"Hippogriff Poster - Pottermore Shop","Quote":"Easily offended, Hippogriffs are. Don’t never insult one, ’cause it might be the last thing yeh do.",
"Body (HTML)":"<p>Bow down to this beautiful and noble Hippogriff; captured through the art of 3D paper sculpture, and photographed for a stunning poster. The Hippogriff is a proud creature — one that demands respect from all who hope to ride it. Hence why, in <em>Harry Potter and the Prisoner of Azkaban</em>, Harry was able to ride Buckbeak the Hippogriff up to the West Tower to save Sirius Black; the same beast that had earlier attacked a disdainful Draco Malfoy...</p><p>Created by paper artist Andy Singleton exclusively for Pottermore, this piece shows off the artist's unique talent for both 3D paper design and stunning photography. Originally designed for Pottermore's <em>Care of Magical Creatures</em> series, it is now available to cherish as a poster, printed on high quality silk coated paper stock.</p><p>Please note that the frame in the image is for illustrative purposes only. This poster comes unframed.</p>","Publish UK":"FALSE","Publish GBP":"FALSE","Publish USD":"FALSE","Publish EUR":"FALSE","Variant Price UK":"19.95","Variant Price EUR":"29.95","Variant Requires Shipping":"1","Variant Taxable":"1","Image Alt Text":"Hippogriff Poster - Pottermore Shop","Gift Card (TRUE/FALSE)":"0","Tags":"Series.Care of Magical Creatures, Type.Poster","Canonical Book":"Care of Magical Creatures, Hippogriff, MED, Poster","Product Template":"art-product","Inventory Policy":"continue","Weight Unit":"kg","Size":"40cm x 50cm","Related Book":"Harry Potter and the Prisoner of Azkaban","title group":"Care of Magical Creatures","product label":"Hippogriff","product option":"MED"}
`
const  sp = require('./shopifyProducts');

describe("generate products", function() {
    it("is just a function, so it can contain any code", () => {
        let obj = JSON.parse(spreadsheetRow);
        let result = sp.convertToProduct(obj, 'dsa', 'dsa');
        console.log(result);
        expect(expected).toEqual(result);
    });
});

const expected = {
  handle: 'Hippogriff-Poster',
  title: 'Hippogriff',
  body_html: '<p>Bow down to this beautiful and noble Hippogriff; captured through the art of 3D paper sculpture, and photographed for a stunning poster. The Hippogriff is a proud creature — one that demands respect from all who hope to ride it. Hence why, in <em>Harry Potter and the Prisoner of Azkaban</em>, Harry was able to ride Buckbeak the Hippogriff up to the West Tower to save Sirius Black; the same beast that had earlier attacked a disdainful Draco Malfoy...</p><p>Created by paper artist Andy Singleton exclusively for Pottermore, this piece shows off the artist\'s unique talent for both 3D paper design and stunning photography. Originally designed for Pottermore\'s <em>Care of Magical Creatures</em> series, it is now available to cherish as a poster, printed on high quality silk coated paper stock.</p><p>Please note that the frame in the image is for illustrative purposes only. This poster comes unframed.</p>',
  vendor: 'Pottermore from J.K. Rowling',
  product_type: 'Poster',
  template_suffix: 'art-product',
  tags: 'Series.Care of Magical Creatures, Type.Poster',
  metafields_global_title_tag: 'Hippogriff Poster - Pottermore Shop',
  metafields_global_description_tag: undefined,
  variants: undefined,
  metafields:
   [ { key: 'order_rank',
       value: '426',
       description: 'Order Book Field',
       namespace: 'p_m',
       value_type: 'string' },
     { key: 'language',
       value: 'Series.Care of Magical Creatures, Type.Poster',
       description: 'Book language',
       namespace: 'p_m',
       value_type: 'string' },
     { key: 'canonical_book',
       value: 'Care of Magical Creatures, Hippogriff, MED, Poster',
       description: 'A mapping to the generic name for the book',
       namespace: 'p_m',
       value_type: 'string' },
     { key: 'quote',
       value: 'Easily offended, Hippogriffs are. Don’t never insult one, ’cause it might be the last thing yeh do.',
       description: 'Quote',
       namespace: 'p_m',
       value_type: 'string' },
     { key: 'product_type',
       value: 'Poster',
       description: 'The product type e.g. eBook',
       namespace: 'p_m',
       value_type: 'string' },
     { key: 'size',
       value: '40cm x 50cm',
       description: 'The product size',
       namespace: 'p_m',
       value_type: 'string' },
     { key: 'related_book',
       value: 'Harry Potter and the Prisoner of Azkaban',
       description: 'Related Book',
       namespace: 'p_m',
       value_type: 'string' } ],
  images: [ '${prefix}_p.jpg', '${prefix}_L1.jpg', '${prefix}_L2.jpg' ] }
