var moment = require('moment');

/**
 * Handlebars block helper that converts Markdown to HTML.
 * @param {object} options - Handlebars object.
 * @example
 * {{#markdown}}Welcome to [zombo.com](http://zombo.com){{/markdown}}
 * @returns The Markdown inside the helper, converted to HTML.
 */
module.exports = function (obj, prop) {

  let out = new moment(obj, prop.hash.parse); // KW08-2017

  if (prop.hash.addWeeks) {
    out = out.add(7 * prop.hash.addWeeks, 'd');
  }
  
  if (prop.hash.addDays) {
    out = out.add(prop.hash.addDays, 'd');
  }

  return out.format(prop.hash.format);
}
