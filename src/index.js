'use strict';

const
  build = require('./build.js'),
  parser = require('./parser.js');

/**
 * Main function
 * @param   {String}  content   Markdown file content
 */
module.exports = function (content) {

  const callback = this.async();

  let options = this.options.reactMarkdownOptions || {};

  parser
    .parse(content, options)
    .then(build)
    .then(component => callback(null, component))
    .catch(callback);

};
