/* eslint-disable no-console */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let employeeLoginFirst;
let partDocumentType;
let group;
const createdPartDocument: any[] = [];
let approvalRequestDocumentType;
let initialArDocument;

const userIndex = Math.floor(5 + Math.random() * (USERS.length - 5));
console.log(userIndex);
console.log(USERS[userIndex]);
// const owner = USERS[userIndex].name;

const details = {
  partFormTitle: "ParentPart-SubPart-Creator-101",
  partFormDescription: "This form creates parent part and sub parts",
  parentPartDocRevTogetherTitle: "Parent part - MPI Together",
  subPartDocRevTogetherTitle: "Sub part",
  parentPartDocRevSeparateTitle: "Parent part - MPI Separate",
  subPartDocRevSeparateTitle: "Sub part - MPI Separate",
  partDocRevDescription: "Desc",

};

// Maintaning references to parentParts and child parts created for selection
const references = {
  parentPartDocRevTogetherDocId: "",
  subPartDocRevTogetherDocId: "",
  subPartDocRevTogetherVoidedDocId: "",
  parentPartDocRevSeparateDocId: "",
  subPartDocRevSeparateDocId: "",
};

const partNames = {
  materialParentPartTogether: "",
  materialSubPartTogether: "",
  materialParentPartSeparate: "",
  materialSubPartSeparate: "",
};

let lhrDocUrl;
let partsGenerated = 0;

context("Scenario 3 - ENC-13597 Selecting Parts in MPI, LHR Template", () => {
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
            documentTypes: [],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[userIndex].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
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
    it("Read the Part document docRevId", () => {
      cy.url().then((url) => {
        console.log(url);
      });
    });

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

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context("Create a new Related part with sub-part released together", () => {
    context("Create a new part docRev from part landing page", () => {
      it("Navigate to parts landing page", () => {
        cy.navigToParts();
      });

      it("Clicks on 'Add new part' button", () => {
        cy.get("span").contains("Add new Part", { timeout: 10000 }).closest("button").click();
      });
    });

    context("Add title, desc", () => {
      it("Enter title", () => {
        cy.drEnterDocumentTitle({ name: details.parentPartDocRevTogetherTitle });
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

    context("Switch the parent part selector to Related together", () => {
      it("Select 'Yes related together", () => {
        cy.get("#partTypeSelector [type=\"radio\"]").check("parent_together");
        cy.wait(["@createParentPart", "@fetchDocumentRevision"]);

        // Random wait for 1000ms to allow values to reflect on the UI
        cy.wait(1000);
      });

      it("Should show the related parts grid", () => {
        cy.get("div[data-cy=\"partsGrid\"]").should("exist");
      });

      it("Keep a reference of Parent docId to check later", () => {
        cy.get("span[data-cy=\"HeaderInfo-docId\"]")
          .then(($el) => {
            references.parentPartDocRevTogetherDocId = $el.text();
            partsGenerated += 1;
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
          partsGenerated += 1;
        });

      });

    });

    context("Add a Sub Part and Void it", () => {
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
        cy.get("div[data-cy=\"relatedPartsEditRow\"] input[name=\"relatedPartDocId\"]").type("02");
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

      context("Ensure that a row got added with the values entered above", () => {

        it("Rows count should be equal to 'rowsCountShouldBe'", () => {
          cy.get("tr[data-cy=\"relatedPartsViewRow\"]").should("have.length", 2);
        });

        it("docId of the subPart should be equal to 'ParentDocId-<suffix>'", () => {
          cy.get("tr[data-cy=\"relatedPartsViewRow\"]").last()
            .contains("td", `${references.parentPartDocRevTogetherDocId} - 02`);
        });

        it("docId of the subPart should be equal to 'ParentDocTitle-<suffix>'", () => {
          cy.get("tr[data-cy=\"relatedPartsViewRow\"]").last()
            .contains("td", `${details.parentPartDocRevTogetherTitle} - ${details.subPartDocRevTogetherTitle}`);
        });

        it("Maintain a reference to the subPart docId", () => {
          references.subPartDocRevTogetherVoidedDocId = `${references.parentPartDocRevTogetherDocId}-02`;
          partsGenerated += 1;
        });
      });

      context("Void the subPart", () => {
        it("Voids the latest subPart added", () => {
          // Select the void button
          cy.get("tr[data-cy=\"relatedPartsViewRow\"]").last().find("input[type=\"checkbox\"]").check();

          // Click confirm on the alert dialog
          cy.get("button[data-cy=\"AlertDialog-continueButton\"]").click();

          // Wait on the API call to complete
          cy.wait("@voidDocumentRevision");

          // Check that the title for this part got changed to void
          cy.get("tr[data-cy=\"relatedPartsViewRow\"]").last().find("td").eq(1).contains("Void");
        });
      });

    });

    context("Approve and Release the Parent part", () => {
      it("Approves and releases the parent part", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });
  });

  context("Create a new Related part with sub-part released separately", () => {
    context("Create a new part docRev from part landing page", () => {
      it("Navigate to parts landing page", () => {
        cy.navigToParts();
      });

      it("Clicks on 'Add new part' button", () => {
        cy.get("span").contains("Add new Part", { timeout: 10000 }).closest("button").click();
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

      it("Keep a reference of Parent docId to check later", () => {
        cy.get("span[data-cy=\"HeaderInfo-docId\"]")
          .then(($el) => {
            references.parentPartDocRevSeparateDocId = $el.text();
            partsGenerated += 1;
          });
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

      it("Keep a reference of subPart docId to check later", () => {
        references.subPartDocRevSeparateDocId = `${references.parentPartDocRevSeparateDocId}-01`;
        partsGenerated += 1;
      });

      it("Toast should have a View Link", () => {
        cy.get("div[role=\"alert\"]")
          .find("a")
          .contains("View")
          .click();
      });
    });

    context("Navigate to the subPart, add title desc, and specifications", () => {
      it("Wait for the fetchDocumentRevision Call", () => {
        cy.wait("@fetchDocumentRevision");
        cy.wait(2000);

        // cy.get("div.k-loading-image", { timeout: 40000 }).should("not.exist");
      });

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

      it("Switch to specification tab and fill values", () => {
        cy.rpSwitchAndPopulateSpecificationsTabPart();
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

    context("Release the subPart and check for released status", () => {
      it("Approve and release subPart", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });

      it("Check for the Released status", () => {
        cy.rpConfirmReleasedParentPart(true, true);
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
  });

  context("Add 3 random parts", () => {
    it("getsGroupResponse", () => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
      });
    });

    it("setting up initialARDocument", () => {
      cy.arGetArDocumentByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        name: "AR Form",
      }).then((response) => {
        initialArDocument = response;
      });
    });

    [1, 2, 3].forEach((index: number) => {
      it("[API]Create part document", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: `<p>Part document ${index}</p>`,
            document: {
              docId: `PRT-0000${5 + index}`,
              documentType: {
                id: partDocumentType[0].id,
              },
              securityList: {
                operators: [],
                securityEmployees: [],
                securityGroups: [
                  {
                    id: group.body[0].id,
                  },
                ],
              },
            },
            name: `Part document ${index}`,
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response: any) => {
          createdPartDocument.push(response);
          partsGenerated += 1;
          cy.drAPIApproveAndRelease({
            documentId: response?.id,
            payload: {
              effectiveDate: (new Date()).toISOString(),
              documentType: { id: approvalRequestDocumentType[0].id },
              formDocument: { id: initialArDocument[0].id },
              approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
            },
            employeeId: adminEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then(() => {
            done();
          });
        });
      });
    });
  });

  context("1-4 Creating a new MPI document", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'MPI document", () => {
      cy.drEnterDocumentTitle({ name: "MPI document" });
    });

    it("Enter description 'MPI document description'", () => {
      cy.drEnterDocumentDescription({ description: "MPI document description" });
    });

    it("Select 'Manufacturing Process Instructions Test' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Manufacturing Process Instructions" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("5 Add 5 materials", () => {
    it("Select Procedure tab", () => {
      cy.drSelectProcedureTab();
    });

    context("Open the material addition modal & add the parts created verifying their presence", () => {
      partNames.materialSubPartTogether =
        `${references.subPartDocRevTogetherDocId} - rev 1 - ${details.parentPartDocRevTogetherTitle}-${details.subPartDocRevTogetherTitle}`;

      partNames.materialSubPartSeparate =
        `${references.subPartDocRevSeparateDocId} - rev 1 - ${details.subPartDocRevSeparateTitle}`;

      partNames.materialParentPartTogether =
        `${references.parentPartDocRevTogetherDocId} - rev 1 - ${details.parentPartDocRevTogetherTitle}`;

      partNames.materialParentPartSeparate =
        `${references.parentPartDocRevSeparateDocId} - rev 1 - ${details.parentPartDocRevSeparateTitle}`;

      it("Opens the material addition modal", () => {
        cy.get("[data-cy=\"form.builder.materials.btn\"]").eq(0).arrowClick().wait(500);
        cy.listLoadingElementShouldNotExist();
        cy.get("[name=\"LHRTparameter\"]").uncheck();
        cy.get("[data-cy=\"title\"]").arrowClick();
      });

      it(`Ensure that the list that opens up has all items & has the values`, () => {
        cy.rpCheckOptionsLengthAndValues(partsGenerated - 1, Object.values(partNames));
      });

      it("Close the material addition modal", () => {
        cy.get("[data-cy=\"form.builder.cancel\"]").closest("button").click({ force: true });
      });

      it("Add 1st material as the Related subpart together to step #1", () => {
        cy.mpiAddMaterialDocumentToStep(
          { numbOfStep: 1, material: partNames.materialSubPartTogether, quntity: "3", unit: "Each" });
      });

      it("Add 2nd material as the Related subpart separate to step #1", () => {
        cy.mpiAddMaterialDocumentToStep(
          { numbOfStep: 1, material: partNames.materialSubPartSeparate, quntity: "3", unit: "Each" });
      });

      it("Add 3rd part to step #1", () => {
        cy.mpiAddMaterialDocumentToStep(
          { checkParameter: true, numbOfStep: 1, material: createdPartDocument[0].name, quntity: "3", unit: "Each" });
      });

      it("Add 4th part to step #1", () => {
        cy.mpiAddMaterialDocumentToStep(
          { checkParameter: true, numbOfStep: 1, material: createdPartDocument[1].name, quntity: "3", unit: "Each" });
      });

      it("Add 5th part to step #1", () => {
        cy.mpiAddMaterialDocumentToStep(
          { checkParameter: true, numbOfStep: 1, material: createdPartDocument[2].name, quntity: "3", unit: "Each" });
      });

      it("Fill step #1 description", () => {
        cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
      });
    });

  });

  context("6-7 Release MPI", () => {
    it("Click save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Approve and release MPI document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context("8-11 Creating a new LHRT document", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'LHRt document'", () => {
      cy.drEnterDocumentTitle({ name: "LHRt document" });
    });

    it("Fill LHRt document description", () => {
      cy.drEnterDocumentDescription({ description: "LHRt document description" });
    });

    it("Select 'LHRt' document type", () => {
      cy.drSelectDocumentType({ documentType: "LHR Template" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Lot History Record' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Lot History Record" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Verify LHRT is in DRAFT status", () => {
      cy.drCheckDocumentStatus({ status: "DRAFT" });
    });
  });

  context("12 Part to be manufactured", () => {
    it("Part to be Manufactured field should have text in red", () => {
      cy.get("[name=\"lhr-selected-part\"]").parent().parent()
        .find(".Mui-error").eq(1)
        .should("have.text", "The Part to be Manufactured is a required field.")
        .and("have.css", "color", "rgb(244, 67, 54)");
    });

    it("Click on Part to be manufactured and select one", () => {
      cy.get("[data-cy=\"lhr-selected-part\"]").arrowClick();
    });

    it(`Ensure that the list that opens up has all items & has the values`, () => {
      cy.rpCheckOptionsLengthAndValues(partsGenerated - 1, [...Object.values(partNames)], true);
    });

    it("Selects the Related subPart together", () => {
      cy.get("ul>li[role=option]").contains(partNames.materialSubPartTogether.replace("- rev 1 -", "-")).arrowClick();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("13 Try to approve and release LHRT ", () => {
    it("Click save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Approve and release LHRt document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi({ toastifyExists: true });
    });

    it("Verify error message", () => {
      cy.checkToastMessageIsEqual({
        message: "Field LHR Step #1 is required.",
      });
      cy.closeAllAlertMessages();
      cy.drCloseApproveAndReleaseDialog();
    });
  });

  context("14 Select created MPI in LHR template", () => {
    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy=\"LHR Step 1\"]").arrowClick({ force: true });
      cy.wait(2000);
    });

    it("Select MPI document for step #1 in LHRt", () => {
      cy.get("input[data-cy=\"lhrstep-built-in\"]").then(($el) => {
        $el.trigger("click");
      });
      cy.get("input[data-cy=\"lhrstep-built-in\"]").autocompleteSelect("MPI document");
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("15-17 edit the parameterized materials & select the related parts", () => {
    context("15 selecting parent part from Scenario 1 (without the dash)", () => {
      it("Edit the 1st row", () => {
        cy.get("div.FBInput-hoverVisibility button").eq(0).click();
      });

      it("click and open the dropdown", () => {
        cy.wait(500);
        cy.get("[data-cy=\"title\"]").arrowClick();
      });

      it(`Ensure that the list that opens up has all items & has the values`, () => {
        cy.rpCheckOptionsLengthAndValues(partsGenerated - 1, Object.values(partNames));
      });

      it("Selecting parent part from the list", () => {
        cy.get("ul>li[role=option]").contains(partNames.materialParentPartTogether).arrowClick();
        cy.get("[name=\"quantity\"]").arrowType("3");
        cy.wait(500);
        cy.get("[data-cy=\"unit\"]").autocompleteSelect("Each");
        cy.get("[data-cy=\"form.builder.save\"]").arrowClick().wait(500);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("16 selecting parent part from Scenario 2 (with the dash)", () => {
      it("Edit the 2nd row", () => {
        cy.get("div.FBInput-hoverVisibility button").eq(1).click();
      });

      it("click and open the dropdown", () => {
        cy.wait(500);
        cy.get("[data-cy=\"title\"]").arrowClick();
      });

      it(`Ensure that the list that opens up has all items & has the values`, () => {
        cy.rpCheckOptionsLengthAndValues(partsGenerated - 1, Object.values(partNames));
      });

      it("Selecting parent part from the list", () => {
        cy.get("ul>li[role=option]").contains(partNames.materialParentPartSeparate).arrowClick();
        cy.get("[name=\"quantity\"]").arrowType("3");
        cy.wait(500);
        cy.get("[data-cy=\"unit\"]").autocompleteSelect("Each");
        cy.get("[data-cy=\"form.builder.save\"]").arrowClick().wait(500);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("17 Select the related/child part from Scenario 1", () => {
      it("Edit the 3rd row", () => {
        cy.get("div.FBInput-hoverVisibility button").eq(2).click();
      });

      it("click and open the dropdown", () => {
        cy.wait(500);
        cy.get("[data-cy=\"title\"]").arrowClick();
      });

      it(`Ensure that the list that opens up has all items & has the values`, () => {
        cy.rpCheckOptionsLengthAndValues(partsGenerated - 1, Object.values(partNames));
      });

      it("Selecting parent part from the list", () => {
        cy.get("ul>li[role=option]").contains(partNames.materialSubPartTogether).arrowClick();
        cy.get("[name=\"quantity\"]").arrowType("3");
        cy.wait(500);
        cy.get("[data-cy=\"unit\"]").autocompleteSelect("Each");
        cy.get("[data-cy=\"form.builder.save\"]").arrowClick().wait(500);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });
  });

  context("18 Approve and release LHRT ", () => {
    it("Click save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Approve and release LHRt document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context("19-21 Create LHR from previous LHRT In Draft/WIP state", () => {
    it("Click create new document from LHRt", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Select 'R&D' build type", () => {
      cy.get("[value=\"R&D\"]").check().wait(500);
    });

    it("Enter initial quantity", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10").unClick();
    });

    it("Add 'Due Date'", () => {
      cy.poAddDateRequired();
    });

    it("Click save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Save lhrUrl", () => {
      cy.url().then((url: any) => {
        lhrDocUrl = url;
      });
    });
  });

  context("Add operator to work on LHRs", () => {
    it("Click on sidebar permission icon to add Operators", () => {
      cy.get("[data-cy='permission-icon']").arrowClick();
    });

    it(`Assign operator '${USERS[userIndex].name}'`, () => {
      cy.drAssignDocumentTo({ username: USERS[userIndex].name });
    });
  });

  context("21b Start LHRs #1", () => {
    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy^=\"LHR Step 1\"]").arrowClick();
    });

    it("Click 'START MPI'", () => {
      cy.mpiStartStepWithoutApi({ stepNumber: 1 });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Select Procedure tab", () => {
      cy.drSelectProcedureTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("22 Verify all selected parts exist", () => {
    it("Length of materials to equal 5", () => {
      cy.get("[data-cy=\"form.builder.lhrs.procedure.materials.title\"]").should("have.length", 5);
    });

    it("Check materials step #1", () => {
      Object.values(partNames).forEach((name: string) => {
        cy.get("[data-cy=\"form.builder.lhrs.procedure.materials.title\"]")
          .contains(`${name.replace("- rev 1 -", "-")} - rev 1 | Qty: 3 each`);
      });
    });
  });

  context("23 Assign quantity and approver. Complete step", () => {
    it("Enter 'Start quntity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-start-quantity\"]").arrowType("10").unClick();
    });

    it("Enter 'Accepted quntity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("8").unClick();
    });

    it("Enter 'Rejected quntity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-rejected-quantity\"]").arrowType("2").unClick();
    });

    it("Click save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Select Overview tab", () => {
      cy.drSelectOverviewTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[userIndex].name });
    });

    it("Click save document", () => {
      cy.wait(500);
      cy.drClickSaveWithoutApiCall();
    });

    it("Complete step", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").eq(0)
        .contains("Complete Step").arrowClick({ force: true });
      cy.wait(1000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve step", () => {
      cy.ebApproveWithoutApi();
    });
  });

  context("24 Navigate to LHR to release it", () => {
    it("Navigate to LHR", () => {
      cy.visit(lhrDocUrl);
      cy.listLoadingElementShouldAppear();
      cy.saveBarShouldNotExist();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify completion date of LHRs #1 in LHR", () => {
      cy.get("[data-cy=\"form.builder.step.complete\"]").eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).to.be
            .oneOf(["Completed"]);
        });
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[userIndex].name });
    });

    it("Click save document", () => {
      cy.lhrSaveWithoutApi();
    });


  });

  context("24-26 Release LHR", () => {
    it("Submit LHR for approval", () => {
      cy.lhrSubmitForApprovalWithoutApi();
    });

    it("Approve LHR", () => {
      cy.lhrApproveWithoutApi();
    });

    it("Verify status is 'Released'", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });
  });
});
