'use strict';

const parser = require('markdown-parse');

/**
 * Main function
 * @param   {String}  content   Markdown file content
 * @returns {String}            React component
 */
module.exports = function (content) {
  let source = '';
  parser(content, (err, result) => {
    if (err) {
      throw new Error(err);
    }
    const re = /<pre><code[^>]*>([\S\s]+?)[\S\s]<\/code><\/pre>/g,
      paths = result.attributes.dependencies;
    let example,
      exampleSource,
      imports = 'import React from "react";';

    result.html = result.html.replace(re, (codeElement, code) => {
      example = code
        .replace(/&lt;/g, '<')
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, '>')
        .replace(/(\n)/g, '{"\\n"}');

      exampleSource = codeElement
        .replace(/{/g, '{"{"{')
        .replace(/}/g, '{"}"}')
        .replace(/{"{"{/g, '{"{"}')
        .replace(/class=/g, 'className=')
        .replace(/(\n)/g, '{"\\n"}');

      return `
      <div className="example">
        <div className="run">${example}</div>
        <div className="source">${exampleSource}</div>
      </div>`;
    });

    if (paths) {
      for (const name in paths) {
        // eslint-disable-next-line no-prototype-builtins
        if (paths.hasOwnProperty(name)) {
          imports += `import ${name} from "${paths[name]}";`;
        }
      }
    }

    source = `
    ${imports}

    module.exports = function(context) {
      return (function() {
        return (
        <div>
        ${result.html}
        </div>
        );
      }).apply(context);
    };
    `;

  });

  this.cacheable();

  return source;

};