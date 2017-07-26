var fs   = require('fs');
var path = require('path');
var utils = require('./utils');

/**
 * Adds built-in helpers to Panini's internal Handlebars instance.
 */
module.exports = function(Handlebars, dir) {
  Handlebars.registerHelper('datecalc', require('./helpers/datecalc'));
  Handlebars.registerHelper('or', require('./helpers/or'));
  Handlebars.registerHelper('markdown', require('./helpers/markdown'));
  Handlebars.registerHelper('padLeft', require('./helpers/padLeft'));

}
