'use strict';

const products = require('./products.json');

module.exports.getProductsList = async () => {
  return JSON.stringify(products);
};
