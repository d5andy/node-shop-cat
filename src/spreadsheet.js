"use strict";
const XLSX = require('xlsx');

function rowsAsJson() {
  let spreadsheet = XLSX.readFile('FULL_CATALOGUE_METADATA.xlsx')
  let worksheet = spreadsheet.Sheets[spreadsheet.SheetNames[0]];
  let asJson = XLSX.utils.sheet_to_json(worksheet);
  return Promise.resolve(asJson.slice(2));
}
module.exports.rowsAsJson = rowsAsJson;
