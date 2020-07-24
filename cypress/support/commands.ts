
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
      */
      unClick(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("unClick", () => {
  cy.get("#root>div>div>header").click();
});

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


// function withParentTitle(item: any) {
//   const nameParts: any = [];
//   if(item.parent) {
//     nameParts.unshift(item.parent.title)
//     nameParts.unshift(...withParentTitle(item.parent))
//   }
//   return nameParts;
// }

// Cypress.on('test:after:run', (test, runnable) => {
//   console.log({"test.state": test.state})
//   if (test.state === 'failed') {
//     let item: any = runnable
//     const nameParts = [runnable.title]
//     nameParts.unshift(...withParentTitle(item.parent))

//     const fullTestName = nameParts
//             .filter(Boolean)
//             .join(' -- ')           // this is how cypress joins the test title fragments

//     const imageUrl = `${fullTestName} (failed) kova.png`
//     console.log({fullTestName, imageUrl})
//     cy.screenshot()
//     // cy.screenshot(imageUrl, {
//     //   capture: "viewport",
//     // }).then(() => {
//     // console.log(4)
//     //   addTestContext({ test }, { title: "Screenshot", value: imageUrl });
//     // })

//   }
// })
