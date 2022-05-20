module.exports = {
  "parserOptions": {
    "project": "cypress/tsconfig.json"
  },
  "plugins": ["eslint.rules"],
  "rules": {
    "eslint.rules/cy.pause": "error"
  }
}
