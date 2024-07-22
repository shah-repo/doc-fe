const toKebabCase = require('lodash/kebabCase');

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "enforce kebab-case for data-cy attribute values",
      category: "Best Practices",
      recommended: false
    },
    fixable: "code",
    schema: []
  },  
  create: function (context) {
    return {
      JSXAttribute(node) {
        if (!['data-cy', 'dataCy'].includes(node.name.name)) {
          // no need to check
          return
        }

        const value = node.value && node.value.value;

        if (!value) {
          // expression in property value, no need to check
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
