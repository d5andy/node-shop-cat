"use strict";
const default_namespace = 'p_m',
      metafieldsStatic =
        {author         : {description: 'Author', namespace: default_namespace},
         read_by        : {description: 'Reader of DAB', namespace: default_namespace},
         translator     : {description: 'Translator of Book', namespace: default_namespace},
         edition_version: {description: 'Edition version', namespace: default_namespace},
         file_size      : {description: 'How big is the file', namespace: default_namespace},
         illustrator    : {description: 'Who illustrated the book', namespace: default_namespace},
         duration       : {description: 'Duration of the DAB', namespace: default_namespace},
         bit_rate       : {description: 'BitRate of the DAB', namespace: default_namespace},
         amazon_sku     : {description: 'Amazon SKU', namespace: default_namespace},
         nook_sku       : {description: 'Nook SKU', namespace: default_namespace},
         kobo_sku       : {description: 'Kobo SKU', namespace: default_namespace},
         sample_file_url: {description: 'Where to find the sample', namespace: default_namespace},
         seo_keyword    : {description: 'SEO Keywords', namespace: default_namespace},
         order_rank     : {description: 'Order Book Field', namespace: default_namespace},
         image_url      : {description: 'Book cover image URL', namespace: default_namespace},
         language       : {description: 'Book language', namespace: default_namespace},
         canonical_book : {description: 'A mapping to the generic name for the book', namespace: default_namespace},
         product_type   : {description: 'The product type e.g. eBook', namespace: default_namespace},
         book_number    : {description: 'Book Number string e.g. Book One', namespace: default_namespace},
         quote          : {description: 'Quote', namespace: default_namespace},
         affiliate_link : {description: 'The product affiliate link', namespace: default_namespace},
         size           : {description: 'The product size', namespace: default_namespace},
         bundle_link    : {description: 'Product bundle link', namespace: default_namespace},
         equivalent_link: {description: 'Equivalent product link', namespace: default_namespace},
         quote_character: {description: 'Quote Character', namespace: default_namespace},
         related_book   : {description: 'Related Book', namespace: default_namespace},
         paper_type     : {description: 'Paper Type', namespace: default_namespace},
         about_artist   : {description: 'About Artist', namespace: default_namespace}
       };

module.exports = {
  buildMetafields: (row) => {
    let metafields = {
      author: row['Author'],
      read_by: row['Read_by'],
      translator: row['Translator'],
      edition_version: row['Edition_version'],
      file_size: row['Filesize'],
      illustrator: row['Illustrator'],
      duration: row['Duration'],
      bit_rate: row['BitRate'],
      amazon_sku: row['AmazonSKU'],
      nook_sku: row['NookSKU'],
      kobo_sku: row['KoboSKU'],
      sample_file_url: row['Sample_File_URL'],
      seo_keyword: row['SEOKeyword'],
      order_rank: row['order rank'],
      image_url: row['Image Src'],
      language: row['Tags'],
      canonical_book: row['Canonical Book'],
      book_number: row['BookNumber'],
      quote: row['Quote'],
      affiliate_link: row['Affiliate Link'],
      product_type: row['Type'],
      size: row['Size'],
      bundle_link: row['Bundle Link'],
      equivalent_link: row['Equivalent Link'],
      quote_character: row['Quote Character'],
      related_book: row['Related Book'],
      paper_type: row['Paper Type'],
      about_artist: row['About Artist'],
   }
   let withstatic = Object.keys(metafields)
    .filter(it => { return metafields[it] != null  && metafields[it] != ''})
    .map(it => {
      let map = metafieldsStatic[it];
      return {key: it, value: metafields[it], description: map['description'],
        namespace: map['namespace'], value_type: 'string'}
    });
    return withstatic;
  }
}
