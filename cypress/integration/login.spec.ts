context("Login", () => {
  it("Logs user in", () => {
    cy.visit("./login");
    cy.get("#LoginFormPresenter-email").type("zoran.kovacevic+test@codecons.com");
    cy.get("#LoginFormPresenter-password").type("Tester1!");
    cy.get("#LoginFormPresenter-submit").click();
    cy.get("#root").contains("Testing Company").click();
    cy.location().should((location) => {
      expect(location.hash).to.be.empty;
      expect(location.pathname).to.eq("/");
      expect(location.search).to.be.empty;
    });
  });
});

// for TS error "All files must be modules when the '--isolatedModules' flag is provided" uncomment line below
export { };

