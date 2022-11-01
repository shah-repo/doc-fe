module.exports = {
  "parserOptions": {
    "project": "cypress/tsconfig.json"
  },
  "plugins": ["cypress.eslint.rules"],
  "rules": {
    "cypress.eslint.rules/cy.pause": "error"
  }
}
