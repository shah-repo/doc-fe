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

        if (value && !/^[a-z]+(-[a-z]+)*$/.test(value)) {
          context.report({
            node,
            message: 'The value of data-cy/dataCy attribute must be in kebab-case.',
            fix: function (fixer) {
              const kebabCaseValue = value.replace(/([A-Z])/g, '-$1').replace(/_/g, '-').toLowerCase();
              return fixer.replaceText(node.value, `“${kebabCaseValue}“`);
            }
          });
        }
      }
    };
  }
};
