module.exports = {
  rules: {
    "cy.pause": {
      create(context) {
        return {
          MemberExpression(node) {
            if (node.object.name === "cy" && node.property.name === "pause") {
              context.report({
                node,
                message: "cy.pause() should not be commited to repo",
              });
            }
          },
        };
      },
    },
  },
};

