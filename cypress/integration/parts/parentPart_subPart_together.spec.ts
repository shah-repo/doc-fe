/* eslint-disable no-console */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
let group;
let initialArDocument;
let approvalRequestDocumentType;
let formDocumentType;
let supplierDocumentType;
let createdSupplierFormDocument;
let createdSupplierDocument;

const userIndex = Math.floor(Math.random() * USERS.length);
const owner = USERS[userIndex].name;

const details = {
  partFormTitle: "ParentPart-SubPart-Creator-101",
  partFormDescription: "This form creates parent part and sub parts",
  parentPartDocRevTitle: "Parent Related",
  parentPartDocRevDescription: "Parent Related description",
};

const subParts = [
  { id: "01", title: "19 cm" },
  { id: "02", title: "21 cm" },
  { id: "03", title: "24 cm", void: true },
  { id: "04", title: "25 cm", cancel: true },
  { id: "01", title: "26 cm", checkForError: true, correctedId: "04" },
];

let rowsCountShouldBe = 0;

context("Parent Part - Sub Part", () => {
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

    cy.intercept({ method: "GET", pathname: "/api/v1/document_revisions/*/required_approvers" })
      .as("requiredApprovers");
    cy.intercept({ method: "GET", pathname: "/api/v1/document_type/with_forms?docTypeGroupOption=CHANGE_REQUEST" })
      .as("changeRequestForms");

    cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions/release/*" })
      .as("expressReleaseDocumentRevision");
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
            documentTypes: [],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[userIndex].email);
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
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

    // it("[API]Create Supplier form", (done: any) => {
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
      cy.get("#partTypeSelector :checked").should("be.checked");
      cy.get("#partTypeSelector :checked").should("be.checked").and("have.value', 'parent_no");
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

  const subPartScenarios = ["separate", "together"];
  subPartScenarios.forEach((scenario, i) => {

    context("Create a new part docRev from part landing page", () => {
      it("Navigate to parts landing page", () => {
        cy.navigToParts();
      });

      it("Clicks on 'Add new part' button", () => {
        cy.get("span").contains("Add new Part", { timeout: 10000 }).closest("button").click();
      });
    });

    context("Verify the fields on Parent part form", () => {
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
        cy.get("#partTypeSelector [type=\"radio\"]").should("be.checked").and("have.value', 'parent_no");
      });
    });

    context("Scenario based sub part creation", () => {
      if (scenario === "separate") {
        // Maintaining a reference to docId, to check on child parts prefix part
        let documentParentDocId;
        let documentDocId;

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

        [1, 2].forEach((times) => {
          context("Creating a sub-part released separately", () => {
            console.log(times);
            it("Click on the Add Related Part button", () => {
              cy.get("button[data-cy=\"parentSeparate-addRelatedPartsBtn\"]").arrowClick();
            });

            it("Wait on the API", () => {
              cy.wait("@createChildPart");
            });

            it("A new toast should appear - with the confirmation message", () => {
              cy.get("div[role=\"alert\"]", { timeout: 10000 })
                .find("p")
                .contains("Related Part created successfully");
            });

            it("Toast should have a docId and the prefix should match the parent docId", () => {
              const regExMatcher = new RegExp(`.*\-0${times}$`);
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

            it("title is editable and fill in a value", () => {
              cy.get("#doc-header-title div").click();
              cy.get("#Title-field input").type("Child Separate{enter}", { force: true });
            });

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

        // Once the loop completes - release this Part - adding a title, description, and some specifications.
        context("Release the parent part", () => {
          it("Fill in values for title", () => {
            cy.get("#doc-header-title div").click();
            cy.get("#Title-field input").type("Parent Separate{enter}", { force: true });
          });

          it("Fill in values for description", () => {
            cy.get("div[data-cy=\"description\"]").last().click();
            cy.get(".DraftEditor-editorContainer div[contenteditable]")
              .type("Parent Separate description{enter}", { force: true });
          });

          it("Approve and release document", () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
          });

          // it("Click on Express AR button", () => {
          //   cy.get("button#ApproveAndRelease-button").click();
          // });

          // it("Wait until required approvers for this document & the available forms are fetched.", () => {
          //   cy.wait(["@requiredApprovers", "@changeRequestForms"]);
          // });

          // it("Check if the correct modal has opened.", () => {
          //   cy.get("#ApproveAndRelease-dialog").should("exist");
          // });

          // it("Now select the content of the dialog & makes selections, typing in the password.", () => {
          //   // cy.get("#ApproveAndRelease-content").muiSelect(`[data-cy="field-formDocument"] #FormList-selectForm`, "AR");
          //   cy.get("#ApproveAndRelease-content").find("input[name=password]").type(Cypress.env("PASSWORD"));
          // });

          // it("Submit", () => {
          //   cy.get("#ApproveAndRelease-content").find("[data-cy=\"ApproveAndRelease-submit\"]").click();
          // });

          it("Wait on submission & fetch", () => {
            cy.wait(["@expressReleaseDocumentRevision", "@fetchDocumentRevision"]);
          });

          it("Check for the Released status", () => {
            cy.get("div[data-cy=\"header-section\"]").find("div[data-cy=\"HeaderInfo-status\"]").contains("RELEASED");
          });

          it("Check for the green color header", () => {
            cy.get("div[data-cy=\"header-section\"]")
              .invoke("css", "background-color")
              .then((background) => {
                expect(background).to.eq("rgb(13, 183, 141)");
              });
          });

          it("Check for the Revise Document Button.", () => {
            cy.get("button[data-cy=\"updateRecord\"]").should("exist");
          });

          it("The Button Add Related Part should still exist.", () => {
            cy.get("button[data-cy=\"parentSeparate-addRelatedPartsBtn\"]").should("exist");
          });

          it("The Radio button selection must still be present, with the parent_separate selected", () => {
            cy.get("#partTypeSelector [type=\"radio\"]").should("be.checked").and("have.value", "parent_separate");
          });
        });
      }

      if (scenario === "together") {
        context("Switch the parent part selector to Related together", () => {

          let parentDocId;
          it("Select 'Yes related together", () => {
            cy.get("#partTypeSelector [type=\"radio\"]").check("parent_together");
            cy.wait(["@createParentPart", "@fetchDocumentRevision"]);

            // Random wait for 1000ms to allow values to reflect on the UI
            cy.wait(1000);
          });

          it("Should show the related parts grid", () => {
            cy.get("div[data-cy=\"partsGrid\"]").should("exist");
          });

          context("Validate the grid headings", () => {
            it("2 Add Related Part buttons should exist", () => {
              cy.get("button[data-cy=\"add-related-part-btn\"]").should("have.length", 2);
            });

            it("First heading should be 'DOC ID'", () => {
              cy.get("table[data-cy=\"related-parts-table\"]").find("th").eq(0).contains("DOC ID");
            });

            it("Second heading should be 'TITLE'", () => {
              cy.get("table[data-cy=\"related-parts-table\"]").find("th").eq(1).contains("TITLE");
            });

            it("First heading should be 'OBSOLETE'", () => {
              cy.get("table[data-cy=\"related-parts-table\"]").find("th").eq(2).contains("OBSOLETE");
            });

            it("Keep a reference of Parent docId to check later", () => {
              cy.get("span[data-cy=\"HeaderInfo-docId\"]")
                .then(($el) => {
                  parentDocId = $el.text();
                });
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
                return text.includes(parentDocId);
              });
            });

            it("Prefix of the title for the new subPart should match parentTitle", () => {
              cy.get("div[data-cy=\"relatedPartsEditRow\"] > div").eq(1).find("label").then(($el) => {
                const text = $el.text();
                return text.includes(details.parentPartDocRevTitle);
              });
            });

            it("docId input field on the editRow should be empty", () => {
              cy.get("div[data-cy=\"relatedPartsEditRow\"] input[name=\"relatedPartDocId\"]")
                .invoke("val").should("eq", "");
            });

            it("Type in a docId", () => {
              cy.get("div[data-cy=\"relatedPartsEditRow\"] input[name=\"relatedPartDocId\"]").type(subParts[0].id);
            });
            // Type in a docId and a title, ensuring that it was empty to start with

            it("title input field on the editRow should be empty", () => {
              cy.get("div[data-cy=\"relatedPartsEditRow\"] input[name=\"relatedPartTitle\"]")
                .invoke("val").should("eq", "");
            });

            it("Type in a title", () => {
              cy.get("div[data-cy=\"relatedPartsEditRow\"] input[name=\"relatedPartTitle\"]").type(subParts[0].title);
            });

            it("Confirm addition and submit the subPart", () => {
              cy.get("button[data-cy=\"confirmRelatedPartChildAddition\"]").click();

              // Wait on the API call to complete
              cy.wait("@createChildPart");
              rowsCountShouldBe += 1;
            });

            context("Ensure that a row got added with the values entered above", () => {

              it("Rows count should be equal to 'rowsCountShouldBe'", () => {
                cy.get("tr[data-cy=\"relatedPartsViewRow\"]").should("have.length", rowsCountShouldBe);
              });

              it("docId of the subPart should be equal to 'ParentDocId-<suffix>'", () => {
                cy.get("tr[data-cy=\"relatedPartsViewRow\"]").last().contains("td", `${parentDocId} - ${subParts[0].id}`);
              });

              it("docId of the subPart should be equal to 'ParentDocTitle-<suffix>'", () => {
                cy.get("tr[data-cy=\"relatedPartsViewRow\"]").last()
                  .contains("td", `${details.parentPartDocRevTitle} - ${subParts[0].title}`);
              });

            });

          });

          context("Check on the subPart", () => {
            it("Navigates to the Sub Part", () => {
              cy.get("tr[data-cy=\"relatedPartsViewRow\"]").last().find("td[data-cy=\"viewIcon\"] svg").click();
              cy.wait("@fetchDocumentRevision");
              cy.wait(2000);

            });

            it("Breadcrumbs 1st part is the parent part Id", () => {
              cy.get("div[data-cy=\"header-section\"]")
                .find(".MuiBreadcrumbs-ol li")
                .first()
                .find("a")
                .contains(parentDocId);
            });

            it("Breadcrumbs 2nd part is the sub part Id", () => {
              cy.get("div[data-cy=\"header-section\"]")
                .find("span[data-cy=\"HeaderInfo-docId\"]")
                .contains(`${parentDocId}-${subParts[0].id}`);
            });

            it("The title is not editable", () => {
              cy.get("h5[data-cy=\"field-name\"]").contains(`${subParts[0].title}`);
            });

            it("The description is not editable", () => {
              cy.get("div.public-DraftEditor-content")
                .invoke("attr", "contenteditable")
                .should("eq", "false");
            });

            it("The description is same as parent part", () => {
              cy.get("div.public-DraftEditor-content")
                .contains(details.parentPartDocRevDescription);
            });

            it("Switch to specification", () => {
              cy.drSelectSpecificationTab();
            });

            it("Make Vs Buy should be disabled", () => {
              cy.get("input[name=\"make-vs-buy\"]").closest("div")
                .then(($el) => $el.hasClass("Mui-disabled"));
            });

            it("Unit of Measure should be disabled", () => {
              cy.get("input[data-cy=\"unit-of-measure\"]").closest("div")
                .then(($el) => $el.hasClass("Mui-disabled"));
            });

            it("Come back to the parent part", () => {
              cy.get("div[data-cy=\"header-section\"]")
                .find(".MuiBreadcrumbs-ol li")
                .first()
                .find("a")
                .click();
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
              cy.get("[data-cy=\"unit-of-measure\"]").autocompleteSelect("Set(s)");
              cy.unClick();
            });

            it("Save document", () => {
              cy.drClickSaveWithoutApiCall();
            });

            it("navigate to Overview tab", () => {
              cy.drSelectOverviewTab();
            });
          });

          context("Check that subPart has the new values", () => {
            it("Navigates to the Sub Part", () => {
              cy.get("tr[data-cy=\"relatedPartsViewRow\"]").last().find("td[data-cy=\"viewIcon\"] svg").click();
              cy.wait("@fetchDocumentRevision");
              cy.wait(2000);
            });

            it("Switch to specification", () => {
              cy.drSelectSpecificationTab();
            });

            it("make vs buy - must be populated with Make", () => {
              cy.get("input[name=\"make-vs-buy\"]").invoke("val").should("eq", "Make");
            });

            it("Unit of Measure - must be populated with Set(s)", () => {
              cy.get("input[data-cy=\"unit-of-measure\"]").invoke("val").should("eq", "Set(s)");
            });

            it("Come back to the parent part", () => {
              cy.get("div[data-cy=\"header-section\"]")
                .find(".MuiBreadcrumbs-ol li")
                .first()
                .find("a")
                .click();
            });
          });

          context("Add 2nd Sub Part", () => {
            it("Click on the bottom 'Add Related Part' button", () => {
              cy.get("button[data-cy=\"add-related-part-btn\"]").eq(1).click();
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
                return text.includes(parentDocId);
              });
            });

            it("Prefix of the title for the new subPart should match parentTitle", () => {
              cy.get("div[data-cy=\"relatedPartsEditRow\"] > div").eq(1).find("label").then(($el) => {
                const text = $el.text();
                return text.includes(details.parentPartDocRevTitle);
              });
            });

            it("docId input field on the editRow should be empty", () => {
              cy.get("div[data-cy=\"relatedPartsEditRow\"] input[name=\"relatedPartDocId\"]")
                .invoke("val").should("eq", "");
            });

            it("Type in a docId", () => {
              cy.get("div[data-cy=\"relatedPartsEditRow\"] input[name=\"relatedPartDocId\"]").type(subParts[1].id);
            });
            // Type in a docId and a title, ensuring that it was empty to start with

            it("title input field on the editRow should be empty", () => {
              cy.get("div[data-cy=\"relatedPartsEditRow\"] input[name=\"relatedPartTitle\"]")
                .invoke("val").should("eq", "");
            });

            it("Type in a title", () => {
              cy.get("div[data-cy=\"relatedPartsEditRow\"] input[name=\"relatedPartTitle\"]").type(subParts[1].title);
            });

            it("Confirm addition and submit the subPart", () => {
              cy.get("button[data-cy=\"confirmRelatedPartChildAddition\"]").click();

              // Wait on the API call to complete
              cy.wait("@createChildPart");
              rowsCountShouldBe += 1;
            });

            context("Ensure that a row got added with the values entered above", () => {

              it("Rows count should be equal to 'rowsCountShouldBe'", () => {
                cy.get("tr[data-cy=\"relatedPartsViewRow\"]").should("have.length", rowsCountShouldBe);
              });

              it("docId of the subPart should be equal to 'ParentDocId-<suffix>'", () => {
                cy.get("tr[data-cy=\"relatedPartsViewRow\"]").last().contains("td", `${parentDocId} - ${subParts[1].id}`);
              });

              it("docId of the subPart should be equal to 'ParentDocTitle-<suffix>'", () => {
                cy.get("tr[data-cy=\"relatedPartsViewRow\"]").last()
                  .contains("td", `${details.parentPartDocRevTitle} - ${subParts[1].title}`);
              });

            });

          });

          context("Check on the 2nd subPart", () => {
            it("Navigates to the Sub Part", () => {
              cy.get("tr[data-cy=\"relatedPartsViewRow\"]").last().find("td[data-cy=\"viewIcon\"] svg").click();
              cy.wait("@fetchDocumentRevision");
              cy.wait(2000);

            });

            it("Breadcrumbs 1st part is the parent part Id", () => {
              cy.get("div[data-cy=\"header-section\"]")
                .find(".MuiBreadcrumbs-ol li")
                .first()
                .find("a")
                .contains(parentDocId);
            });

            it("Breadcrumbs 2nd part is the sub part Id", () => {
              cy.get("div[data-cy=\"header-section\"]")
                .find("span[data-cy=\"HeaderInfo-docId\"]")
                .contains(`${parentDocId}-${subParts[1].id}`);
            });

            it("The title is not editable", () => {
              cy.get("h5[data-cy=\"field-name\"]").contains(`${subParts[1].title}`);
            });

            it("The description is not editable", () => {
              cy.get("div.public-DraftEditor-content")
                .invoke("attr", "contenteditable")
                .should("eq", "false");
            });

            it("The description is same as parent part", () => {
              cy.get("div.public-DraftEditor-content")
                .contains(details.parentPartDocRevDescription);
            });

            it("Switch to specification", () => {
              cy.drSelectSpecificationTab();
            });

            it("Make Vs Buy should be disabled", () => {
              cy.get("input[name=\"make-vs-buy\"]").closest("div")
                .then(($el) => $el.hasClass("Mui-disabled"));
            });

            it("make vs buy - must be populated with Make", () => {
              cy.get("input[name=\"make-vs-buy\"]").invoke("val").should("eq", "Make");
            });

            it("Unit of Measure should be disabled", () => {
              cy.get("input[data-cy=\"unit-of-measure\"]").closest("div")
                .then(($el) => $el.hasClass("Mui-disabled"));
            });

            it("Unit of Measure - must be populated with Set(s)", () => {
              cy.get("input[data-cy=\"unit-of-measure\"]").invoke("val").should("eq", "Set(s)");
            });

            it("Come back to the parent part", () => {
              cy.get("div[data-cy=\"header-section\"]")
                .find(".MuiBreadcrumbs-ol li")
                .first()
                .find("a")
                .click();
            });
          });

          subParts.slice(2).forEach((subPart, index) => {
            context(`Adding subpart with ${subPart.void ? "Voiding it" :
              (subPart.cancel ? "Cancelling it" : "Checking on duplicate docId")}`, () => {

              it("Click on the bottom 'Add Related Part' button", () => {
                cy.get("button[data-cy=\"add-related-part-btn\"]").eq(1).click();
              });

              it("new Edit row should now be visible", () => {
                cy.get("div[data-cy=\"relatedPartsEditRow\"]").should("exist");
              });

              it("docId input field on the editRow should be empty", () => {
                cy.get("div[data-cy=\"relatedPartsEditRow\"] input[name=\"relatedPartDocId\"]")
                  .invoke("val").should("eq", "");
              });

              it("Type in a docId", () => {
                cy.get("div[data-cy=\"relatedPartsEditRow\"] input[name=\"relatedPartDocId\"]").type(subPart.id);
              });
              // Type in a docId and a title, ensuring that it was empty to start with

              it("title input field on the editRow should be empty", () => {
                cy.get("div[data-cy=\"relatedPartsEditRow\"] input[name=\"relatedPartTitle\"]")
                  .invoke("val").should("eq", "");
              });

              it("Type in a title", () => {
                cy.get("div[data-cy=\"relatedPartsEditRow\"] input[name=\"relatedPartTitle\"]").type(subPart.title);
              });

              if (subPart.checkForError) {
                it("The editRow should have a red border", () => {
                  cy.get("div[data-cy=\"relatedPartsEditRow").should("have.css", "border-color", "rgb(196, 0, 0)");
                });

                it("some error text should show up", () => {
                  cy.get("div[data-cy=\"relatedPartsEditRow\"] > div").eq(0).find("p").should("exist");
                });

                it("The confirm button should go away", () => {
                  cy.get("button[data-cy=\"confirmRelatedPartChildAddition\"]").should("not.exist");
                });

                it("Edit and enter the correct value", () => {
                  cy.get("div[data-cy=\"relatedPartsEditRow\"] input[name=\"relatedPartDocId\"]")
                    .clear().type(subPart.correctedId).blur();
                });

                it("The confirm button should come back", () => {
                  cy.get("button[data-cy=\"confirmRelatedPartChildAddition\"]").should("exist");
                });
              }

              if (subPart.cancel) {
                it("Cancels the addition of the subPart", () => {
                  // Cancel
                  cy.get("button[data-cy=\"cancelRelatedPartChildAddition\"]").click();

                  // Ensure that the edit row goes away
                  cy.get("div[data-cy=\"relatedPartsEditRow\"]").should("not.exist");
                });
              } else {
                it("Confirm addition and submit the subPart", () => {
                  cy.get("button[data-cy=\"confirmRelatedPartChildAddition\"]").click();

                  // Wait on the API call to complete
                  cy.wait("@createChildPart");
                  rowsCountShouldBe += 1;
                });

                it("Rows count should be equal to 'rowsCountShouldBe'", () => {
                  cy.get("tr[data-cy=\"relatedPartsViewRow\"]").should("have.length", rowsCountShouldBe);
                });

                it("docId of the subPart should be equal to 'ParentDocId-<suffix>'", () => {
                  cy.get("tr[data-cy=\"relatedPartsViewRow\"]").last()
                    .contains("td", `${parentDocId} - ${subPart.checkForError ? subPart.correctedId : subPart.id}`);
                });

                it("docId of the subPart should be equal to 'ParentDocTitle-<suffix>'", () => {
                  cy.get("tr[data-cy=\"relatedPartsViewRow\"]").last()
                    .contains("td", `${details.parentPartDocRevTitle} - ${subPart.title}`);
                });

                if (subPart.void) {
                  it("Voids the latest subPart added", () => {
                    // Select the void button
                    cy.get("tr[data-cy=\"relatedPartsViewRow\"]").last().find("input[type=\"checkbox\"]").check();

                    // Wait on the API call to complete
                    cy.wait("@voidDocumentRevision");

                    // Check that the title for this part got changed to void
                    cy.get("tr[data-cy=\"relatedPartsViewRow\"]").last().find("td").eq(1).contains("Void");
                  });
                }
              }
            });
          });

          context("Approve and Release the Parent part", () => {
            it("Approves and releases the parent part", () => {
              cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
            });
          });

        });
      }
    });

  });


});
