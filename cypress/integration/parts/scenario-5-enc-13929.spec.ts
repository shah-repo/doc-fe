/* eslint-disable no-console */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CSPart, Part } from "../../utils/constants/documentTypes/part";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let employeeLoginFirst;
let approvalRequestDocumentType;

const userIndex = Math.floor(5 + Math.random() * (USERS.length - 5));
console.log(userIndex);
console.log(USERS[userIndex]);
// const owner = USERS[userIndex].name;

const details = {
  partFormTitle: "Component specifications - ParentPart-SubPart-Creator-101",
  partFormDescription: "This form creates parent part and sub parts",
  parentPartDocRevTogetherTitle: "Parent part Together - To Be Obsoleted",
  parentPartDocRevTogetherModifiedTitle: "Parent part Together Modified - To Be Obsoleted",
  subPartDocRevTogetherTitle: "Sub part obsoleted",
  parentPartDocRevSeparateTitle: "Parent part Separate - To Be Obsoleted",
  subPartDocRevSeparateTitle: "Sub part - Will not be obsoleted",
  partDocRevDescription: "Desc",

};

// Maintaning references to parentParts and child parts created for selection
const references = {
  formId: "",
  parentPartDocRevTogetherDocId: "",
  subPartDocRevTogetherDocId: "",
  parentPartDocRevSeparateDocId: "",
  subPartDocRevSeparateDocId: "",
};

context("Scenario 5 ENC-12347: Obsoleting a Base part", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  beforeEach("Set up Interceptions", () => {
    cy.intercept({ method: "POST", pathname: "/api/v1/related_parts/parent" }).as("createParentPart");
    cy.intercept({ method: "GET", pathname: "/api/v1/document_revisions/*" }).as("fetchDocumentRevision");
    cy.intercept({ method: "POST", pathname: "/api/v1/related_parts/*/*/child" }).as("createChildPart");
    cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/void/*" }).as("voidDocumentRevision");
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  context("[API]Prepare company", () => {
    it("[API]Create company", (done: any) => {
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response) => {
        loginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[userIndex].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              Part,
              CSPart,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[userIndex].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          employeeLoginFirst = createdCompany.employees
            .find((employee) => employee.user.email === USERS[userIndex].email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[userIndex].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[userIndex], employeeId: employeeLoginFirst.id });
    });
  });

  context("1. Create Form for Component Specification document", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title", () => {
      cy.drEnterDocumentTitle({ name: details.partFormTitle });
    });

    it("Enters description", () => {
      cy.drEnterDocumentDescription({ description: details.partFormDescription });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Selects 'Parts' document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "Component Specifications" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("2-3. Verify the fields on Component Specification form & release it", () => {
    it("Verify Form opens to the Overview tab by default", () => {
      cy.get("[data-cy=\"tabId.overview\"]").contains("Overview")
        .should("exist");
    });

    it("Verify the Specification tab", () => {
      cy.get("[data-cy=\"tabId.specification\"]").contains("Specification")
        .should("exist");
    });

    it("Verify Title", () => {
      cy.get("[data-cy=\"field-name\"]").contains(details.partFormTitle)
        .should("exist");
    });

    it("Verify Description", () => {
      cy.get("[data-cy=\"description\"]").contains(details.partFormDescription)
        .should("exist");
    });

    it("Verify 'Is this a base part' heading exists", () => {
      cy.get("#tableTitle").should("exist");
      cy.get("#tableTitle").contains("Is this a base part?");
    });

    it("Verify 'Parent part - No option to be selected by default", () => {
      cy.get("#partTypeSelector [type=\"radio\"][checked]").invoke("val").should((value) => value === "parent_no");
    });

    it("Keeps a reference to the Form", () => {
      cy.get("span[data-cy=\"HeaderInfo-docId\"]")
        .then(($el) => {
          references.formId = $el.text();
        });
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context("4-8 Create a new Related part with sub-part released together & void the related part", () => {
    context("Create a new part docRev from part landing page", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Click on Create New button", () => {
        cy.drCreateNewDocumentFromForm();
      });
    });

    context("Add title, desc", () => {
      it("Enter title", () => {
        cy.drEnterDocumentTitle({ name: details.parentPartDocRevTogetherTitle });
      });

      it("Enter description 'Test Part description'", () => {
        cy.wait(100);
        cy.drEnterDocumentDescription({ description: details.partDocRevDescription });
      });

      it("Save document", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Verify 'Is this a base part' heading exists", () => {
        cy.get("#tableTitle").should("exist");
        cy.get("#tableTitle").contains("Is this a base part?");
      });
    });

    context("Switch the parent part selector to Related together", () => {
      it("Select 'Yes related together", () => {
        cy.get("#partTypeSelector [type=\"radio\"]").check("parent_together");
        cy.wait(["@createParentPart", "@fetchDocumentRevision"]);

        // Random wait for 1000ms to allow values to reflect on the UI
        cy.wait(1000);
      });

      it("There should be no change in the part number in the header/breadcrumb", () => {
        cy.get("span[data-cy=\"HeaderInfo-docId\"]")
          .then(($el) => {
            const text = $el.text();
            return !text.includes("-00");
          });
      });

      it("Should show the related parts grid", () => {
        cy.get("div[data-cy=\"partsGrid\"]").should("exist");
      });

      it("Keep a reference of Parent docId to check later", () => {
        cy.get("span[data-cy=\"HeaderInfo-docId\"]")
          .then(($el) => {
            references.parentPartDocRevTogetherDocId = $el.text();
          });
      });
    });

    context("Edit Parent and add Specification fields", () => {
      it("navigate to Specification Items", () => {
        cy.drSelectSpecificationTab();
      });

      it("Select make vs buy", () => {
        cy.get("[id$=\"make-vs-buy\"]").arrowClick({ force: true });
        cy.get("ul[role=listbox]>li").contains("Make").arrowClick();
      });

      it("Select Unit of Measure", () => {
        cy.get("#mui-component-select-unit-of-measure").arrowClick({ force: true });
        cy.get("ul[role=listbox]>li").contains("Set(s)").arrowClick();
      });

      it("Select traceability required", () => {
        cy.get("[value=\"Traceability required\"]").check({ force: true });
      });

      it("Select 'Yes' for Serialized option", () => {
        cy.get("[name=\"serialized\"][value=\"Yes\"]").check({ force: true });
      });

      it("Select serialization", () => {
        cy.get("[id=\"mui-component-select-select-serialization\"]").arrowClick({ force: true });
        cy.get("ul[role=listbox]>li").contains("Select Provided Serialization").arrowClick();
      });

      it("Save document", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("navigate to Overview tab", () => {
        cy.drSelectOverviewTab();
      });
    });

    context("Add a Sub Part", () => {
      it("Click on the top 'Add Related Part' button", () => {
        cy.get("button[data-cy=\"add-related-part-btn\"]").eq(0).click();
      });

      it("new Edit row should now be visible", () => {
        cy.get("div[data-cy=\"relatedPartsEditRow\"]").should("exist");
      });

      it("Buttons should go away", () => {
        cy.get("button[data-cy=\"add-related-part-btn\"]").should("have.length", 0);
      });

      it("Prefix of the docId for the new subPart should match parentDocId", () => {
        cy.get("div[data-cy=\"relatedPartsEditRow\"] > div").eq(0).find("label").then(($el) => {
          const text = $el.text();
          return text.includes(references.parentPartDocRevTogetherDocId);
        });
      });

      it("Prefix of the title for the new subPart should match parentTitle", () => {
        cy.get("div[data-cy=\"relatedPartsEditRow\"] > div").eq(1).find("label").then(($el) => {
          const text = $el.text();
          return text.includes(details.parentPartDocRevTogetherTitle);
        });
      });

      it("docId input field on the editRow should be empty", () => {
        cy.get("div[data-cy=\"relatedPartsEditRow\"] input[name=\"relatedPartDocId\"]")
          .invoke("val").should("eq", "");
      });

      it("Type in a docId", () => {
        cy.get("div[data-cy=\"relatedPartsEditRow\"] input[name=\"relatedPartDocId\"]").type("01");
      });

      it("title input field on the editRow should be empty", () => {
        cy.get("div[data-cy=\"relatedPartsEditRow\"] input[name=\"relatedPartTitle\"]")
          .invoke("val").should("eq", "");
      });

      it("Type in a title", () => {
        cy.get("div[data-cy=\"relatedPartsEditRow\"] input[name=\"relatedPartTitle\"]")
          .type(details.subPartDocRevTogetherTitle);
      });

      it("Confirm addition and submit the subPart", () => {
        cy.get("button[data-cy=\"confirmRelatedPartChildAddition\"]").click();

        // Wait on the API call to complete
        cy.wait("@createChildPart");
      });
    });

    context("Ensure that a row got added with the values entered above", () => {

      it("Rows count should be equal to 'rowsCountShouldBe'", () => {
        cy.get("tr[data-cy=\"relatedPartsViewRow\"]").should("have.length", 1);
      });

      it("docId of the subPart should be equal to 'ParentDocId-<suffix>'", () => {
        cy.get("tr[data-cy=\"relatedPartsViewRow\"]").last()
          .contains("td", `${references.parentPartDocRevTogetherDocId} - 01`);
      });

      it("docId of the subPart should be equal to 'ParentDocTitle-<suffix>'", () => {
        cy.get("tr[data-cy=\"relatedPartsViewRow\"]").last()
          .contains("td", `${details.parentPartDocRevTogetherTitle} - ${details.subPartDocRevTogetherTitle}`);
      });

      it("Maintain a reference to the subPart docId", () => {
        references.subPartDocRevTogetherDocId = `${references.parentPartDocRevTogetherDocId}-01`;
      });
    });

    context("Check that subPart has the initial values", () => {
      it("Navigates to the Sub Part", () => {
        cy.get("tr[data-cy=\"relatedPartsViewRow\"]").last().find("td[data-cy=\"viewIcon\"] svg").click();
        cy.wait("@fetchDocumentRevision");
        cy.wait(2000);
      });

      it("The title is not editable", () => {
        cy.get("h5[data-cy=\"field-name\"]").contains(`${details.subPartDocRevTogetherTitle}`);
      });

      it("The description is not editable", () => {
        cy.get("div.public-DraftEditor-content")
          .invoke("attr", "contenteditable")
          .should("eq", "false");
      });

      it("The description is same as parent part", () => {
        cy.get("div.public-DraftEditor-content")
          .contains(details.partDocRevDescription);
      });

      it("Switch to specification", () => {
        cy.drSelectSpecificationTab();
      });

      it("make vs buy - must be populated with Make", () => {
        cy.get("input[name=\"make-vs-buy\"]").invoke("val").should("eq", "Make");
      });

      it("Unit of Measure - must be populated with Set(s)", () => {
        cy.get("input[name=\"unit-of-measure\"]").invoke("val").should("eq", "Set(s)");
      });

      it("Traceability must be selected", () => {
        cy.get("[value=\"Traceability required\"]").should("be.checked");
      });

      it("Come back to the parent part", () => {
        cy.get("div[data-cy=\"header-section\"]")
          .find(".MuiBreadcrumbs-ol li")
          .first()
          .find("a")
          .click();
      });
    });

    context("Edit parent part title, desc and other fields", () => {
      it("Edit title", () => {
        cy.drClearDocumentTitle();
        cy.drEnterDocumentTitle({ name: details.parentPartDocRevTogetherModifiedTitle });
      });

      it("Enter description 'Test Part description'", () => {
        cy.drEnterDocumentDescription(
          { description: `${details.parentPartDocRevTogetherModifiedTitle} ${details.partDocRevDescription}` });
      });

      it("Switch to specification", () => {
        cy.drSelectSpecificationTab();
      });

      it("Select traceability not required anymore", () => {
        cy.get("[value=\"Traceability required\"]").uncheck({ force: true });
      });

      it("Save document", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("navigate to Overview tab", () => {
        cy.drSelectOverviewTab();
      });
    });

    context("Check that subPart has the modified values", () => {
      it("Navigates to the Sub Part", () => {
        cy.get("tr[data-cy=\"relatedPartsViewRow\"]").last().find("td[data-cy=\"viewIcon\"] svg").click();
        cy.wait("@fetchDocumentRevision");
        cy.wait(2000);
      });

      it("The title is not editable", () => {
        cy.get("h5[data-cy=\"field-name\"]").contains(`${details.parentPartDocRevTogetherModifiedTitle}`);
      });

      it("The description is not editable", () => {
        cy.get("div.public-DraftEditor-content")
          .invoke("attr", "contenteditable")
          .should("eq", "false");
      });

      it("The description is same as parent part", () => {
        cy.get("div.public-DraftEditor-content")
          .contains(`${details.parentPartDocRevTogetherModifiedTitle} ${details.partDocRevDescription}`);
      });

      it("Switch to specification", () => {
        cy.drSelectSpecificationTab();
      });

      it("Select traceability not required anymore", () => {
        cy.get("[value=\"Traceability required\"]").should("not.be.checked");
      });

      it("Come back to the parent part", () => {
        cy.get("div[data-cy=\"header-section\"]")
          .find(".MuiBreadcrumbs-ol li")
          .first()
          .find("a")
          .click();
      });
    });

    context("Approve and Release the Parent part", () => {
      it("Approves and releases the parent part", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });

    context("Check for released status on the individual document rev pages", () => {
      it("Check for the Released status of the parent part", () => {
        cy.rpConfirmReleasedParentPart(false, false);
      });

      it("Navigates to the Sub Part", () => {
        cy.get("tr[data-cy=\"relatedPartsViewRow\"]").last().find("td[data-cy=\"viewIcon\"] svg").click();
        cy.wait("@fetchDocumentRevision");
        cy.wait(2000);
      });

      it("Check for the Released status of the subPart", () => {
        cy.rpConfirmReleasedParentPart(false, true);
      });

      it("Come back to the parent part", () => {
        cy.get("div[data-cy=\"header-section\"]")
          .find(".MuiBreadcrumbs-ol li")
          .first()
          .find("a")
          .click();
      });

      it("Navigate to Document List", () => {
        cy.navigToDocumentList();
        cy.get("[data-cy=\"clearFilter\"]").arrowClick();
      });
    });

    context("Check for released status on the landing page", () => {
      it("Parent part is released", () => {
        cy.get(`td[data-grid-col-index="0"]`).contains(`${references.parentPartDocRevTogetherDocId}`)
          .closest(".k-master-row").find("td span.MuiChip-label").contains("Released");
      });

      it("Sub part is released", () => {
        cy.get(`td[data-grid-col-index="0"]`).contains(`${references.subPartDocRevTogetherDocId}`)
          .closest(".k-master-row").find("td span.MuiChip-label").contains("Released");
      });
    });

    context("7 Revise base part as obsolete", () => {
      it("Clicks on a Part from the list", () => {
        cy.get(`td[data-grid-col-index="0"]`).contains(`${references.parentPartDocRevTogetherDocId}`)
          .closest(".k-master-row").arrowClick().wait(1000);
      });

      it("Checks for loading elements", () => {
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Click on revise Document", () => {
        cy.get("button[data-cy=\"updateRecord\"]").click();
      });

      it("Select \" Revision Stage as Obsolete \" ", () => {
        cy.get("#field-revisionChangeType").find("#RevisionTypeChange-obsolete [type=\"radio\"]").check("OBSOLETE");
      });

      it("Save Parent part after revision selection", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Approves and releases the parent part", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });

    context("8 Check for obsolete status", () => {
      context("Check for obsolete status on the individual document rev pages", () => {
        it("Check for the Obsolete status of the parent part", () => {
          cy.rpConfirmObsoletePart(false, false);
        });

        it("Navigates to the Sub Part", () => {
          cy.get("tr[data-cy=\"relatedPartsViewRow\"]").last().find("td[data-cy=\"viewIcon\"] svg").click();
          cy.wait("@fetchDocumentRevision");
          cy.wait(2000);
        });

        it("Check for the Released status of the subPart", () => {
          cy.rpConfirmObsoletePart(false, true);
        });

        it("Come back to the parent part", () => {
          cy.get("div[data-cy=\"header-section\"]")
            .find(".MuiBreadcrumbs-ol li")
            .first()
            .find("a")
            .click();
        });

        it("Navigate to Document List", () => {
          cy.navigToDocumentList();
          cy.get("[data-cy=\"clearFilter\"]").arrowClick();
        });
      });

      context("Check for obsolete status on the parts landing page", () => {
        it("Parent part is obsolete", () => {
          cy.get(`td[data-grid-col-index="0"]`).contains(`${references.parentPartDocRevTogetherDocId}`)
            .closest(".k-master-row").find("td span.MuiChip-label").contains("Obsolete");

          cy.get(`td[data-grid-col-index="0"]`).contains(`${references.parentPartDocRevTogetherDocId}`)
            .closest(".k-master-row").find("td span").contains("OBS");
        });

        it("Sub part is obsolete", () => {
          cy.get(`td[data-grid-col-index="0"]`).contains(`${references.subPartDocRevTogetherDocId}`)
            .closest(".k-master-row").find("td span.MuiChip-label").contains("Obsolete");

          cy.get(`td[data-grid-col-index="0"]`).contains(`${references.parentPartDocRevTogetherDocId}`)
            .closest(".k-master-row").find("td span").contains("OBS");
        });
      });
    });
  });

  context("Navigate to document list", () => {
    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
      cy.get("[data-cy=\"clearFilter\"]").arrowClick();
    });
  });

  context("9-10 Create a new Related part with sub-part released separately", () => {
    let parentDocumentBaseId;
    context("Create a new parent part docRev", () => {
      it("Open the Form", () => {
        cy.get(`td[data-grid-col-index="0"]`).contains(`${references.formId}`)
          .closest(".k-master-row").click();
      });

      it("Click on Create New button", () => {
        cy.drCreateNewDocumentFromForm();
      });
    });

    context("Add title, desc", () => {
      it("Enter title", () => {
        cy.drEnterDocumentTitle({ name: details.parentPartDocRevSeparateTitle });
      });

      it("Enter description 'Test Part description'", () => {
        cy.drEnterDocumentDescription({ description: details.partDocRevDescription });
      });

      it("Save document", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Verify 'Is this a base part' heading exists", () => {
        cy.get("#tableTitle").should("exist");
        cy.get("#tableTitle").contains("Is this a base part?");
      });
    });

    context("Switch the parent part selector to Related separately", () => {
      it("Select 'Yes related separately", () => {
        cy.get("#partTypeSelector [type=\"radio\"]").check("parent_separate");
        cy.wait(["@createParentPart", "@fetchDocumentRevision"]);

        // Random wait for 1000ms to allow values to reflect on the UI
        cy.wait(1000);
      });

      it("The navigation docId should be updated", () => {
        cy.get("span[data-cy=\"HeaderInfo-docId\"]")
          .then(($el) => {
            references.parentPartDocRevSeparateDocId = $el.text();
            expect(references.parentPartDocRevSeparateDocId).to.match(/.*\-00$/);
          });
      });

      it("documentId should have updated with a -00 at the end", () => {
        cy.get("input[name=\"document.docId\"]").invoke("val").should((value) => {
          const documentParentDocId = value as string;
          parentDocumentBaseId = documentParentDocId?.substring(0, documentParentDocId?.length - 3);
          return documentParentDocId.endsWith("-00");
        });
      });
    });

    context("Edit Parent and add Specification fields", () => {
      it("navigate to Specification Items", () => {
        cy.drSelectSpecificationTab();
      });

      it("Select make vs buy", () => {
        cy.get("[id$=\"make-vs-buy\"]").arrowClick({ force: true });
        cy.get("ul[role=listbox]>li").contains("Make").arrowClick();
      });

      it("Select Unit of Measure", () => {
        cy.get("#mui-component-select-unit-of-measure").arrowClick({ force: true });
        cy.get("ul[role=listbox]>li").contains("Set(s)").arrowClick();
      });

      it("Select traceability required", () => {
        cy.get("[value=\"Traceability required\"]").check({ force: true });
      });

      it("Select 'Yes' for Serialized option", () => {
        cy.get("[name=\"serialized\"][value=\"Yes\"]").check({ force: true });
      });

      it("Select serialization", () => {
        cy.get("[id=\"mui-component-select-select-serialization\"]").arrowClick({ force: true });
        cy.get("ul[role=listbox]>li").contains("Select Provided Serialization").arrowClick();
      });

      it("Save document", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("navigate to Overview tab", () => {
        cy.drSelectOverviewTab();
      });
    });

    context("Creating a sub-part released separately", () => {
      it("Click on the Add Related Part button", () => {
        cy.get("button[data-cy=\"parentSeparate-addRelatedPartsBtn\"]").arrowClick();
      });

      it("Wait on the API", () => {
        cy.wait(1000);
      });

      it("A new toast should appear - with the confirmation message", () => {
        cy.get("div[role=\"alert\"]", { timeout: 10000 })
          .find("p")
          .contains("Related Part created successfully");
      });

      it("Toast should have a docId and the prefix should match the parent docId", () => {
        const regExMatcher = new RegExp(`.*\-01$`);
        cy.get("div[role=\"alert\"]")
          .find("h6 b")
          .then(($el) => {
            const text = $el.text();
            expect(text).to.match(regExMatcher);
            expect(text.substring(0, text.length - 3)).to.be.equal(parentDocumentBaseId);
          });
      });

      it("Toast should have a View Link", () => {
        cy.get("div[role=\"alert\"]")
          .find("a")
          .contains("View")
          .click();
      });
    });

    context("Navigate to the subPart, add title desc, check values should NOT be inherited in the child parts", () => {
      it("Wait for the fetchDocumentRevision Call", () => {
        cy.wait("@fetchDocumentRevision");
        cy.wait(2000);
      });

      it("Checks that subPart is in Draft", () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      });

      it("Check for breadcrumbs", () => {
        cy.get("div[data-cy=\"header-section\"]")
          .find(".MuiBreadcrumbs-ol li")
          .first()
          .find("a")
          .contains(references.parentPartDocRevSeparateDocId);
      });

      it("Keep a reference of subPart docId to check later", () => {
        cy.get("span[data-cy=\"HeaderInfo-docId\"]")
          .then(($el) => {
            references.subPartDocRevSeparateDocId = $el.text();
          });
      });

      it("part type selector is not visible any more", () => {
        cy.get("#tableTitle").should("not.exist");
      });

      it("Switch to specification", () => {
        cy.drSelectSpecificationTab();
      });

      it("make vs buy - must be empty", () => {
        cy.get("input[name=\"make-vs-buy\"]").invoke("val").should("eq", "");
      });

      it("Unit of Measure - must be empty", () => {
        cy.get("input[name=\"unit-of-measure\"]").invoke("val").should("eq", "");
      });

      it("Traceability is not selected", () => {
        cy.get("[value=\"Traceability required\"]").should("not.be.checked");
      });

      it("Enter title 'Child Part title'", () => {
        cy.drEnterDocumentTitle({ name: details.subPartDocRevSeparateTitle });
      });

      it("Enter description 'Child Part description'", () => {
        cy.drEnterDocumentDescription({ description: details.partDocRevDescription });
      });

      it("Save values", () => {
        // Save document
        cy.drClickSaveWithoutApiCall();
      });
    });

    context("Navigate to Parent part, Approve and Release the Parent part", () => {
      it("Go back to the Parent Part", () => {
        cy.get("div[data-cy=\"header-section\"]")
          .find(".MuiBreadcrumbs-ol li")
          .first()
          .find("a")
          .click();
      });

      it("Approves and releases the parent part", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });

    context("Check for released status, Parent released and subPart still in Draft", () => {
      it("Navigate to Document List", () => {
        cy.navigToDocumentList();
        cy.get("[data-cy=\"clearFilter\"]").arrowClick();
      });

      it("Parent part is released", () => {
        cy.get(`td[data-grid-col-index="0"]`).contains(`${references.parentPartDocRevSeparateDocId}`)
          .closest(".k-master-row").find("td span.MuiChip-label").contains("Released");
      });

      it("Sub part is in draft", () => {
        cy.get(`td[data-grid-col-index="0"]`).contains(`${references.subPartDocRevSeparateDocId}`)
          .closest(".k-master-row").find("td span.MuiChip-label").contains("Draft");
      });
    });

    context("Revise base part separate as obsolete", () => {
      it("Clicks on a SubPart from the list", () => {
        cy.get(`td[data-grid-col-index="0"]`).contains(`${references.parentPartDocRevSeparateDocId}`)
          .closest(".k-master-row").arrowClick().wait(500);
      });

      it("Checks for loading elements", () => {
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Click on revise Document", () => {
        cy.get("button[data-cy=\"updateRecord\"]").click();
      });

      it("Select \" Revision Stage as Obsolete \" ", () => {
        cy.get("#field-revisionChangeType").find("#RevisionTypeChange-obsolete [type=\"radio\"]").check("OBSOLETE");
      });

      it("Save Parent part after revision selection", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Approves and releases the parent part", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });

    context("Check for obsolete status, Parent obsolete and subPart still in Draft", () => {
      it("Check for the Obsolete status of the parent part from docRev", () => {
        cy.rpConfirmObsoletePart(true, false);
      });

      it("Navigate to Document List", () => {
        cy.navigToDocumentList();
        cy.get("[data-cy=\"clearFilter\"]").arrowClick();
      });

      it("Parent part is obsolete", () => {
        cy.get(`td[data-grid-col-index="0"]`).contains(`${references.parentPartDocRevSeparateDocId}`)
          .closest(".k-master-row").find("td span.MuiChip-label").contains("Obsolete");

        cy.get(`td[data-grid-col-index="0"]`).contains(`${references.parentPartDocRevSeparateDocId}`)
          .closest(".k-master-row").find("td span").contains("OBS");
      });

      it("Sub part is in draft", () => {
        cy.get(`td[data-grid-col-index="0"]`).contains(`${references.subPartDocRevSeparateDocId}`)
          .closest(".k-master-row").find("td span.MuiChip-label").contains("Draft");
      });
    });

    context("Release the subPart and check for released status", () => {
      it("Clicks on a SubPart from the list", () => {
        cy.get(`td[data-grid-col-index="0"]`).contains(`${references.subPartDocRevSeparateDocId}`)
          .closest(".k-master-row").arrowClick().wait(500);
      });

      it("Approve and release subPart", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });

      it("Check for the Released status", () => {
        cy.rpConfirmReleasedParentPart(true, true);
      });
    });

    context("Check for obsolete status, Parent obsolete and subPart released", () => {
      it("Navigate to Document List", () => {
        cy.navigToDocumentList();
        cy.get("[data-cy=\"clearFilter\"]").arrowClick();
      });

      it("Parent part is obsolete", () => {
        cy.get(`td[data-grid-col-index="0"]`).contains(`${references.parentPartDocRevSeparateDocId}`)
          .closest(".k-master-row").find("td span.MuiChip-label").contains("Obsolete");

        cy.get(`td[data-grid-col-index="0"]`).contains(`${references.parentPartDocRevSeparateDocId}`)
          .closest(".k-master-row").find("td span").contains("OBS");
      });

      it("Sub part is released", () => {
        cy.get(`td[data-grid-col-index="0"]`).contains(`${references.subPartDocRevSeparateDocId}`)
          .closest(".k-master-row").find("td span.MuiChip-label").contains("Released");
      });
    });

  });

});
