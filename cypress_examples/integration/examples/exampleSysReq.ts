import { SystemRequirement } from "../../../cypress/utils/context/systemRequirement";

// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

context("Example specs for requirements linking:", () => {
  context("when specs are passing", () => {
    it("with one requirements mentioned", () => {
      SystemRequirement("REQ-0010");
      expect(true).to.eql(true);
    });

    it("with multiple requirements mentioned", () => {
      SystemRequirement("REQ-0020", "REQ-0030");
      expect(true).to.eql(true);
    });

    it("with no requirements mentioned", () => {
      expect(true).to.eql(true);
    });
  });

  context("when specs are not passing", () => {
    it("with one requirements mentioned", () => {
      SystemRequirement("REQ-0050");
      expect(true).to.eql(false);
    });

    it("with multiple requirements mentioned", () => {
      SystemRequirement("REQ-0040", "REQ-0030");
      expect(true).to.eql(false);
    });

    it("with no requirements mentioned", () => {
      expect(true).to.eql(false);
    });
  });

  context("when specs are skipped", () => {
    it.skip("with one requirements mentioned", () => {
      SystemRequirement("REQ-0070");
      expect(true).to.eql(true);
    });

    it.skip("with multiple requirements mentioned", () => {
      SystemRequirement("REQ-0090", "REQ-0080");
      expect(true).to.eql(true);
    });

    it.skip("with no requirements mentioned", () => {
      expect(true).to.eql(true);
    });
  });
});

// for TS error "All files must be modules when the '--isolatedModules' flag is provided" uncomment line below
export { };

