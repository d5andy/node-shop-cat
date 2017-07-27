"use strict";
const spreadsheetRow = `{"order rank":"344","Book titles":"Bogar bárd meséi","BookNumber":"Hogwarts Library","Type":"eBook","Variant SKU":"9781781103814","Variant Barcode":"978-178-110-381-4","Title":"Bogar bárd meséi","handle":"Bogar_bárd_meséi_eBook_Hungarian","Author":"J.K. Rowling","Translator":"Tamás Boldizsár Tóth","Vendor":"Animus Kiadó ","SEO Title":"Bogar bárd meséi - eBook - Pottermore Shop","SEO Description":"Bogar bárd meséi a fiatal varázslók és boszorkányok számára írt népszerű történetek gyűjteménye, amelyet úgy ismernek a Roxfort tanulói, mint Hamupipőkét vagy Csipkerózsikát a mugli gyerekek.Hermione Granger az eredeti rúnákból fordította, Albus Dumbledore professzor pedig lenyűgöző kiegészítő jegyzetekkel látta el őket, amelyek izgalmas betekintést nyújtanak roxforti mindennapjaiba.Ez a kiadás varázsló- és mugli olvasók számára egyaránt kötelezően beszerzendő darab: a lapokon megelevenednek a sorssal ujjat húzó boszorkányok, egy szőrösszívű nagymágus, valamint a három fivér története, akik megpróbálták átverni a Halált.","Body (HTML)":"Bogar bárd meséi a fiatal varázslók és boszorkányok számára írt népszerű történetek gyűjteménye, amelyet úgy ismernek a Roxfort tanulói, mint Hamupipőkét vagy Csipkerózsikát a mugli gyerekek.Hermione Granger az eredeti rúnákból fordította, Albus Dumbledore professzor pedig lenyűgöző kiegészítő jegyzetekkel látta el őket, amelyek izgalmas betekintést nyújtanak roxforti mindennapjaiba.Ez a kiadás varázsló- és mugli olvasók számára egyaránt kötelezően beszerzendő darab: a lapokon megelevenednek a sorssal ujjat húzó boszorkányok, egy szőrösszívű nagymágus, valamint a három fivér története, akik megpróbálták átverni a Halált.","Publish UK":"TRUE","Publish GBP":"TRUE","Publish USD":"TRUE","Publish EUR":"TRUE","Variant Price UK":"4.99","Variant Price GBP":"4.99","Variant Price USD":"5.99","Variant Price EUR":"5.99","Variant Requires Shipping":"FALSE","Variant Taxable":"TRUE","Image Alt Text":"Bogar bárd meséi - eBook","Gift Card (TRUE/FALSE)":"FALSE","Tags":"Hungarian","Canonical Book":"Hogwarts Library, Beedle, Hungarian, eBook"}`,
      mf = require('./metafields');

describe("generate metafields", function() {
    it("is just a function, so it can contain any code", () => {
        let row = JSON.parse(spreadsheetRow)
        let result = mf.buildMetafields(row);
        expect(expected).toEqual(result);
    });
});

const expected  = [ { key: 'author',
    value: 'J.K. Rowling',
    description: 'Author',
    namespace: 'p_m',
    value_type: 'string' },
  { key: 'translator',
    value: 'Tamás Boldizsár Tóth',
    description: 'Translator of Book',
    namespace: 'p_m',
    value_type: 'string' },
  { key: 'order_rank',
    value: '344',
    description: 'Order Book Field',
    namespace: 'p_m',
    value_type: 'string' },
  { key: 'language',
    value: 'Hungarian',
    description: 'Book language',
    namespace: 'p_m',
    value_type: 'string' },
  { key: 'canonical_book',
    value: 'Hogwarts Library, Beedle, Hungarian, eBook',
    description: 'A mapping to the generic name for the book',
    namespace: 'p_m',
    value_type: 'string' },
  { key: 'book_number',
    value: 'Hogwarts Library',
    description: 'Book Number string e.g. Book One',
    namespace: 'p_m',
    value_type: 'string' },
  { key: 'product_type',
    value: 'eBook',
    description: 'The product type e.g. eBook',
    namespace: 'p_m',
    value_type: 'string' } ];
