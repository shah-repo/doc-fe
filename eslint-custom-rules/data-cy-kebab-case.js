'use strict';

const toKebabCase = require('lodash/kebabCase');
const get = require('lodash/get');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce kebab-case for data-cy attribute values',
      category: 'Best Practices',
      recommended: false
    },
    fixable: 'code',
    schema: []
  },  
  create: function (context) {
    return {
      JSXAttribute(node) {
        if (!['data-cy', 'dataCy'].includes(node.name.name)) {
          // skip
          return
        }

        const value = get(node, 'value.value')
          || get(node, 'value.expression.value');

        if (!value) {
          // skip
          return
        }

        const kebabValue = toKebabCase(value);

        if (value === kebabValue) {
          // everything is ok
          return
        }

        context.report({
          node,
          message: 'The value of data-cy/dataCy attribute must be in kebab-case.',
          fix: function (fixer) {
            return fixer.replaceText(node.value, `"${kebabValue}"`);
          }
        });
      }
    };
  }
};
