/* eslint-disable no-console */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;

const userIndex = Math.floor(Math.random() * USERS.length);
// const owner = USERS[userIndex].name;

const details = {
  partFormTitle: "ParentPart-SubPart-Creator-101",
  partFormDescription: "This form creates parent part and sub parts",
  parentPartDocRevTitle: "Parent Related Separate",
  parentPartDocRevDescription: "Parent Related description",
  subPartDocRevTitle: "Sub Part title",
  subPartDocRevDescription: "Sub part description",
};

// Maintaining a reference to docId, to check on child parts prefix part
let documentParentDocId;
let documentDocId;

context("Parent Part - Sub Part - Released Separately", () => {
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
            documentTypes: [],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees
            .find((employee) => employee.user.email === USERS[userIndex].email);
          // supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          // approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          // formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
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
    //   cy.grpGetGroupByName({
    //     sessionId: loginResponse.sessionId,
    //     employeeId: employeeLoginFirst.id,
    //     groupName: "Everyone",
    //   }).then((response) => {
    //     group = response;
    //     cy.arGetArDocumentByName({
    //       sessionId: loginResponse.sessionId,
    //       employeeId: employeeLoginFirst.id,
    //       name: "AR Form",
    //     }).then((response) => {
    //       initialArDocument = response;
    //       cy.drCreateDocumentRevision({
    //         payload: {
    //           attachments: [],
    //           description: "<p>Supplier Form document</p>",
    //           document: {
    //             docId: "FM-00010",
    //             documentType: {
    //               id: formDocumentType[0].id,
    //             },
    //             securityList: {
    //               operators: [],
    //               securityEmployees: [],
    //               securityGroups: [
    //                 {
    //                   id: group.body[0].id,
    //                 },
    //               ],
    //             },
    //           },
    //           name: "supplier form",
    //           referenceTo: [],
    //           retrain: false,
    //           revisionChangeType: RevisionChangeType.NextRevision,
    //           revisionStage: 1,
    //           formTemplate: {
    //             outputDocumentTypes: [{
    //               id: supplierDocumentType[0].id,
    //             }],
    //             schema: [],
    //           },

    //         },
    //         employeeId: employeeLoginFirst.id as unknown as string,
    //         sessionId: loginResponse.sessionId as unknown as string,
    //       }).then((response) => {
    //         createdSupplierFormDocument = response;
    //         cy.drAPIApproveAndRelease({
    //           documentId: createdSupplierFormDocument.id,
    //           payload: {
    //             effectiveDate: (new Date()).toISOString(),
    //             documentType: { id: approvalRequestDocumentType[0].id },
    //             formDocument: { id: initialArDocument[0].id },
    //             approversWithSignatures: [{ approver: { id: employeeLoginFirst.id } }],
    //           },
    //           employeeId: employeeLoginFirst.id,
    //           sessionId: loginResponse.sessionId,
    //         }).then(() => {
    //           cy.poAPICreatePO({
    //             payload: {
    //               name: "API Supplier Document",
    //               attachments: [],
    //               referenceTo: [],
    //               formDocument: { id: createdSupplierFormDocument.id },
    //               description: "API Supplier document",
    //               revisionChangeType: RevisionChangeType.NextRevision,
    //               document: {
    //                 docId: "SUP-00001",
    //                 documentType: {
    //                   id: supplierDocumentType[0].id,
    //                 },
    //                 securityList: {
    //                   operators: [],
    //                   securityEmployees: [],
    //                   securityGroups: [
    //                     {
    //                       id: group.body[0].id,
    //                     },
    //                   ],
    //                 },
    //               },
    //             },
    //             employeeId: employeeLoginFirst.id,
    //             sessionId: loginResponse.sessionId,
    //           }).then((response) => {
    //             createdSupplierDocument = response;
    //             cy.drAPIApproveAndRelease({
    //               documentId: createdSupplierDocument.id,
    //               payload: {
    //                 effectiveDate: (new Date()).toISOString(),
    //                 documentType: { id: approvalRequestDocumentType[0].id },
    //                 formDocument: { id: initialArDocument[0].id },
    //                 approversWithSignatures: [{ approver: { id: employeeLoginFirst.id } }],
    //               },
    //               employeeId: employeeLoginFirst.id,
    //               sessionId: loginResponse.sessionId,
    //             }).then(() => {
    //               done();
    //             });
    //           });
    //         });
    //       });
    //     });
    //   });
    // });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[userIndex], employeeId: employeeLoginFirst.id });
    });
  });

  context("Create Form for Parts document", () => {
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
      cy.drSelectOutputDocumentType({ documentType: "Parts" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Verify the fields on part form", () => {
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

    it("Verify Document Type", () => {
      cy.get("[data-cy=\"field-document.documentType.id\"]").contains("Document Type")
        .should("exist");
    });

    it("Verify Document ID", () => {
      cy.get("[data-cy=\"field-document.docId\"]").contains("Document ID")
        .should("exist");
    });

    it("Verify Revision Stage", () => {
      // eslint-disable-next-line max-len
      cy.get("[id=\"sm-tabpanel-0\"] [class^=\"MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6\"]").eq(2).contains("Revision Stage")
        .should("exist");
    });

    it("Verify Numeric", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").contains("Numeric")
        .should("exist");
    });

    it("Verify Numeric Alpha", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").contains("Numeric Alpha")
        .should("exist");
    });

    it("Verify Alpha", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").contains("Alpha")
        .should("exist");
    });

    it("Verify Training Required", () => {
      cy.get("[data-cy=\"field-retrain\"]").contains("Training Required")
        .should("exist");
    });

    it("Verify Output Document Type", () => {
      cy.get("[data-cy=\"field-outputDocumentTypes\"]").contains("Output Document Type")
        .should("exist");
    });

    it("Verify Output Document Type as Parts", () => {
      cy.get("[id=\"formTemplate.outputDocumentTypes\"]").contains("Parts")
        .should("exist");
    });

    it("Verify Render HTML", () => {
      cy.get("[data-cy=\"field-renderHTML\"]").contains("Render HTML")
        .should("exist");
    });

    it("Verify 'Is this a base part' heading exists", () => {
      cy.get("#tableTitle").should("exist");
      cy.get("#tableTitle").contains("Is this a base part?");
    });

    it("Verify 'Parent part - No option to be selected by default", () => {
      cy.get("#partTypeSelector [type=\"radio\"][checked]").invoke("val").should((value) => value === "parent_no");
    });

    it("navigate to Specification Items", () => {
      cy.drSelectSpecificationTab();
    });

    it("Button should have text Make vs Buy", () => {
      cy.get("[data-cy=\"Make vs Buy\"]")
        .should("have.text", "Make vs Buy");
    });

    it("Button should have text Primary Supplier", () => {
      cy.get("[data-cy=\"Primary Supplier\"]")
        .should("have.text", "Primary Supplier");
    });

    it("Button should have text Other Suppliers", () => {
      cy.get("[data-cy=\"Other Suppliers\"]")
        .should("have.text", "Other Suppliers");
    });

    it("Button should have text Unit of measure", () => {
      cy.get("[data-cy=\"Unit of measure\"]")
        .should("have.text", "Unit of measure");
    });

    it("Button should have text Traceability required", () => {
      cy.get("[data-cy=\"Traceability required\"]")
        .should("have.text", "Traceability required");
    });

    it("Button should have text Serialized", () => {
      cy.get("[data-cy=\"Serialized\"]")
        .should("have.text", "Serialized");
    });

    it("Button should have text Select serialization", () => {
      cy.get("[data-cy=\"Select serialization\"]")
        .should("have.text", "Select serialization");
    });

    it("Button should have text IQC Required", () => {
      cy.get("[data-cy=\"IQC Required\"]")
        .should("have.text", "IQC Required");
    });

    it("Button should have text Limited Shelf Life", () => {
      cy.get("[data-cy=\"Limited Shelf Life\"]")
        .should("have.text", "Limited Shelf Life");
    });

    it("Button should have text FAI Required", () => {
      cy.get("[data-cy=\"FAI Required\"]")
        .should("have.text", "FAI Required");
    });
  });

  context("Add components in the form", () => {
    it("navigate to overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add component", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbAddLabelName({ name: "Textfield for parts test" });
      cy.fbAddField();
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
      cy.fbGroupOptions("option1", "option2");
      cy.fbAddNewFieldButton();
    });

    it("Save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context("Create a new part docRev from part landing page", () => {
    it("Navigate to parts landing page", () => {
      cy.navigToParts();
    });

    it("Clicks on 'Add new part' button", () => {
      cy.get("span").contains("Add new Part", { timeout: 10000 }).closest("button").click();
    });
  });

  context("Verify the fields on Parent part docRev", () => {
    it("Verify Form opens to the Overview tab by default", () => {
      cy.get("[data-cy=\"tabId.overview\"]").contains("Overview")
        .should("exist");
    });

    it("Verify the Specification tab", () => {
      cy.get("[data-cy=\"tabId.specification\"]").contains("Specification")
        .should("exist");
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle({ name: details.parentPartDocRevTitle });
    });

    it("Enter description 'Test Part description'", () => {
      cy.drEnterDocumentDescription({ description: details.parentPartDocRevDescription });
    });

    it("Save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Verify Document ID", () => {
      cy.get("[data-cy=\"field-document.docId\"]").contains("Document ID")
        .should("exist");
    });

    it("Verify Revision Stage", () => {
      // eslint-disable-next-line max-len
      cy.get("[id=\"sm-tabpanel-0\"] [class^=\"MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6\"]").eq(2).contains("Revision Stage")
        .should("exist");
    });

    it("Verify Training Required", () => {
      cy.get("[data-cy=\"field-retrain\"]").contains("Training Required")
        .should("exist");
    });

    // it("Verify Textfield for Textfield for parts test", () => {
    //   cy.get("[data-cy=\"Textfield for parts test\"]").contains("Textfield for parts test")
    //     .should("exist");
    // });

    // it("Verify fb-checkbox-group", () => {
    //   cy.get("[data-cy=\"fb-checkbox-group\"]").contains("fb-checkbox-group")
    //     .should("exist");
    // });

    it("navigate to Specification Items", () => {
      cy.drSelectSpecificationTab();
    });

    it("Button should have text Make vs Buy", () => {
      cy.get("[data-cy=\"Make vs Buy\"]")
        .should("have.text", "Make vs Buy");
    });

    it("Button should have text Unit of measure", () => {
      cy.get("[data-cy=\"Unit of measure\"]")
        .should("have.text", "Unit of measure");
    });

    it("Button should have text Traceability required", () => {
      cy.get("[data-cy=\"Traceability required\"]")
        .should("have.text", "Traceability required");
    });

    it("Button should have text IQC Required", () => {
      cy.get("[data-cy=\"IQC Required\"]")
        .should("have.text", "IQC Required");
    });

    it("Button should have text Limited Shelf Life", () => {
      cy.get("[data-cy=\"Limited Shelf Life\"]")
        .should("have.text", "Limited Shelf Life");
    });

    it("Button should have text FAI Required", () => {
      cy.get("[data-cy=\"FAI Required\"]")
        .should("have.text", "FAI Required");
    });

    it("navigate to Overview tab", () => {
      cy.drSelectOverviewTab();
    });
  });

  context("Verify the presence of Parent part selector", () => {
    it("Verify 'Is this a base part' heading exists", () => {
      cy.get("#tableTitle").should("exist");
      cy.get("#tableTitle").contains("Is this a base part?");
    });

    it("Verify 'Parent part - No option to be selected by default", () => {
      cy.get("#partTypeSelector [type=\"radio\"][checked]").invoke("val").should((value) => value === "parent_no");
    });
  });

  context("Switch the parent part selector to Related separately", () => {

    it("Select 'Yes related separately", () => {
      cy.get("#partTypeSelector [type=\"radio\"]").check("parent_separate");
      cy.wait(["@createParentPart", "@fetchDocumentRevision"]);

      // Random wait for 1000ms to allow values to reflect on the UI
      cy.wait(1000);
    });

    it("documentId should have updated with a -00 at the end", () => {
      cy.get("input[name=\"document.docId\"]").invoke("val").should((value) => {
        documentParentDocId = value as string;
        documentDocId = documentParentDocId?.substring(0, documentParentDocId?.length - 3);
        return documentParentDocId?.endsWith("-00");
      });
    });

    it("The navigation docId should also be updated", () => {
      cy.get("span[data-cy=\"HeaderInfo-docId\"]")
        .then(($el) => {
          const text = $el.text();
          expect(text).to.match(/.*\-00$/);
        });
    });

  });

  context("Create three subParts", () => {
    [1, 2, 3].forEach((times, index) => {
      context("Creating a sub-part released separately", () => {
        console.log(times);
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
          const regExMatcher = new RegExp(`.*\-0${index + 1}$`);
          cy.get("div[role=\"alert\"]")
            .find("h6 b")
            .then(($el) => {
              const text = $el.text();
              expect(text).to.match(regExMatcher);
              expect(text.substring(0, text.length - 3)).to.be.equal(documentDocId);
            });
        });

        it("Toast should have a View Link", () => {
          cy.get("div[role=\"alert\"]")
            .find("a")
            .contains("View")
            .click();
        });
      });

      context("Clicking on that view takes to the sub part", () => {
        it("Wait for the fetchDocumentRevision Call", () => {
          cy.wait("@fetchDocumentRevision");
          cy.wait(2000);

          cy.get("div.k-loading-image", { timeout: 40000 }).should("not.exist");
        });

        it("Check for breadcrumbs", () => {
          cy.get("div[data-cy=\"header-section\"]")
            .find(".MuiBreadcrumbs-ol li")
            .first()
            .find("a")
            .contains(documentParentDocId);
        });

        it("part type selector is not visible any more", () => {
          cy.get("#tableTitle").should("not.exist");
        });

        // it("title is editable and fill in a value", () => {
        //   cy.get("#doc-header-title div").click();
        //   cy.get("#Title-field input").type("Child Separate{enter}", { force: true });
        // });

        it("ExpressAR button is visible", () => {
          cy.get("button#ApproveAndRelease-button").should("exist");
        });

        it("Go back to the Parent Part", () => {

          cy.get("div[data-cy=\"header-section\"]")
            .find(".MuiBreadcrumbs-ol li")
            .first()
            .find("a")
            .click();
        });
      });
    });

  });

  // Once the loop completes - release this Part - adding a title, description, and some specifications.
  context("Release the parent part", () => {
    // it("Fill in values for title", () => {
    //   cy.get("#doc-header-title div").click();
    //   cy.get("#Title-field input").type("Parent Separate{enter}", { force: true });
    // });

    // it("Fill in values for description", () => {
    //   cy.get("div[data-cy=\"description\"]").last().click();
    //   cy.get(".DraftEditor-editorContainer div[contenteditable]")
    //     .type("Parent Separate description{enter}", { force: true });
    // });

    it("Switch and populate specification tab", () => {
      cy.rpSwitchAndPopulateSpecificationsTabPart();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Check for the Released status", () => {
      cy.rpConfirmReleasedParentPart(true);
    });
  });

  context("Release SubPart", () => {

    context("Navigate to Sub Part from Parts landing page", () => {
      it("Navigate to parts landing page", () => {
        cy.navigToParts();
        cy.get("[data-cy=\"clearFilter\"]").arrowClick();
      });

      it("Clicks on a SubPart from the list", () => {
        cy.get(`td[data-grid-col-index="0"]`).contains(`${documentDocId}-01`)
          .closest(".k-master-row").arrowClick().wait(500);
      });

      it("Checks for loading elements", () => {
        cy.landingPageLoadingElementShouldNotExist();
      });
    });

    context("Check for the subPart not inheriting values from the parent part", () => {
      it("Checks that subPart is in Draft", () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      });

      it("Switch to specification", () => {
        cy.drSelectSpecificationTab();
      });

      it("make vs buy - must be empty", () => {
        cy.get("input[name=\"make-vs-buy\"]").invoke("val").should("eq", "");
      });

      it("Unit of Measure - must be empty", () => {
        cy.get("input[data-cy=\"unit-of-measure\"]").invoke("val").should("eq", "");
      });
    });

    context("Fill in the specification tab, add title, description", () => {
      it("Switch to specification tab and fill values", () => {
        cy.rpSwitchAndPopulateSpecificationsTabPart();
      });

      it("Enter title 'Child Part title'", () => {
        cy.drEnterDocumentTitle({ name: details.subPartDocRevTitle });
      });

      it("Enter description 'Child Part description'", () => {
        cy.drEnterDocumentDescription({ description: details.subPartDocRevDescription });
      });

      it("Save values", () => {
        // Save document
        cy.drClickSaveWithoutApiCall();
      });
    });

    context("Release the subPart and check for released status", () => {
      it("Approve and release subPart", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });

      it("Check for the Released status", () => {
        cy.rpConfirmReleasedParentPart(true, true);
      });
    });

  });

});
