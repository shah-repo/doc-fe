export const verifyHistoryContent = (history, group) => {
  history.forEach((element, groupIndex) => {
    it(`Check owner name for group ${groupIndex + 1}`, () => {
      cy.get(`[data-cy="change-key-${groupIndex}"]`).should("have.text", element.owner);
    });
    element.actions.forEach((action, index) => {
      it(`'${action.key}' as '${action.value}' exists`, () => {
        const typeOfChange = action.key;
        let contentOfChange = action.value;

        if (action.key === "New description" || action.key === "Description changed" ) {
          contentOfChange = "\n" + action.value + "\n";
        }

        if (typeOfChange === "s3Link added") {
          cy.get(`[data-cy^="change-key-${groupIndex}-${index}"]`).should("have.text", typeOfChange);
          cy.get("[data-cy='downloadS3link']").should("contain.text", contentOfChange);
        }
        else {
          if (action.key === "Access granted to group") {
            cy.get(`[data-cy^="change-value-${groupIndex}-${index}"]`).should(($identifier) =>  {
              expect($identifier.text()).to.be.oneOf([group, "Everyone"]);
            });
          }
          else {
            cy.get(`[data-cy^="change-value-${groupIndex}-${index}"]`)
              .contains(action.key === "New owner" ? new RegExp("^" + action.value) : action.value)
              .parent()
              .parent()
              .within(() => {
                cy.get(`[data-cy^=change-key-${groupIndex}-${index}]`).should("have.text", typeOfChange);
                cy.get(`[data-cy^=change-value-${groupIndex}-${index}]`).should("contain.text", contentOfChange);
              });
          }
        }
      });
    });
  });
};
