/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { NCORecord } from "../../utils/constants/documentTypes/nco";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let developersGroup;

const ncoFormName = "NCO Form";
const randomNumberForCompany = (Math.round(Math.random() * 100000)) % 100000;
const newCompanyName = "New company " + randomNumberForCompany;
const newCompanyAbbr = "NC-" + randomNumberForCompany;
const paperLhrDocType = "Paper Lot History Record";
const paperlhrTitle = "Paper LHR form";
const currentDate = moment().tz("America/Los_Angeles").format("M/D/YYYY");
const arID = "AR-00001";
const fileUploadFieldTitle = "fb-fileupload";

context("Verify Paper LHR", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
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
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              NCORecord,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Get group", () => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: adminEmployee.id }],
          tags: [...developersGroup.body[0].tags,
            GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
            GroupTag.NAVIGATION_WITH_RESTRICTED_DOC_TYPES,
          ],
        },
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context(`Check 'Paper lhr' exist in NCO`, () => {
    context("Create form for NCO document", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it(`Enters title '${ncoFormName}'`, () => {
        cy.drEnterDocumentTitle({ name: ncoFormName });
      });

      it("Enters description 'New NCO Form description'", () => {
        cy.drEnterDocumentDescription({ description: "New NCO Form description" });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'New Company Record' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "New Company Record" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click on 'Save' button", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("'Approve and Release' the document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Create NCO document from Form", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Select released NCO Form", () => {
        cy.drFilterDocListByNameAndStatus({ title: ncoFormName, status: "Released" });
      });

      it("Create new document from form", () => {
        cy.drCreateNewDocumentFromForm();
      });

      it("Enters title 'New Company'", () => {
        cy.drEnterDocumentTitle({ name: "New Company" });
      });

      it("Enters description 'New Company description'", () => {
        cy.drEnterDocumentDescription({ description: "New Company description" });
      });

      it("Select 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it(`Enters company name '${newCompanyName}'`, () => {
        cy.get("[name^=company-name-]").arrowType(newCompanyName);
      });

      it(`Enters company abbriviation '${newCompanyAbbr}'`, () => {
        cy.get("[name^=company-abbreviation-]").arrowType(newCompanyAbbr);
      });

      it(`Enters company email '${USERS[1].email}'`, () => {
        cy.get("[name^=company-admin-email-]").arrowType(USERS[1].email);
      });

      it("Select 'Yes' for 'Approved DAM json is used'", () => {
        cy.get("[name*=\"approved-dam-json-is-used-\"]").check("Yes");
      });

      it("Upload correct DAM JSON", () => {
        cy.atchUploadDOMJSONForNCO({ fileName: "dam_lhr_paper.json", queue: 0 });
      });

      it("Select 'Yes' for 'Approved Page Details json is used'", () => {
        cy.get("[name*=\"approved-page-details-json-is-used-\"]").check("Yes");
      });

      it("Upload Page Details JSON", () => {
        cy.atchUploadPageDetailsJSONForNCO({ fileName: "doc_type_page_details.json", queue: 0 });
      });

      it("Select 'Yes' for 'Approved Navigation json is used'", () => {
        cy.get("[name*=\"approved-navigation-json-is-used-\"]").check("Yes");
      });

      it("Upload Navigation JSON", () => {
        cy.atchUploadNavigationJSONForNCO({ fileName: "doc_type_navigation.json", queue: 0 });
      });

      it("Upload Users List JSON", () => {
        cy.atchUploadUserListJSONForNCO({ fileName: "users.csv", queue: 0 });
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Approve and release document - create company", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });

      it("Log out user", () => {
        cy.authLogout();
      });
    });

    context("Login user", () => {
      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[1].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: true });
      });
    });

    context("Navigate to Document Type Management and check 'Paper lhr' exist", () => {
      it("Navigate to Document Type Management", () => {
        cy.navigToDocumentTypeManagement();
      });

      it(`Filter by document type '${paperLhrDocType}'`, () => {
        cy.dtmClearFilters();
        cy.get(`[aria-colindex="2"] input`).arrowType(paperLhrDocType);
      });

      it("Verify document type", () => {
        cy.get(`[aria-rowindex="3"]`).find(`[aria-colindex="2"]`).should("have.text", paperLhrDocType);
      });

      it(`Verify acronym for '${paperLhrDocType}'`, () => {
        cy.get(`[aria-rowindex="3"]`).find(`[aria-colindex="3"]`).should("have.text", "LHR-");
      });

      it(`Verify internal group for '${paperLhrDocType}'`, () => {
        cy.get(`[data-grid-col-index="12"]`).prev().should("have.text", "PAPER_LHR");
      });
    });

    context("Navigate to Document List and check 'Paper lhr' exist in dam document", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Select DAM document", () => {
        cy.dlClearFilters();
        cy.drFilterDocListByNameAndStatus({ title: "Document Approval Matrix", status: "Draft" });
      });

      it("navigate to matrix details tab", () => {
        cy.drSelectMatrixDetailsTab();
      });

      it(`Verify '${paperLhrDocType}' have acronym 'LHR-'`, () => {
        cy.contains(paperLhrDocType).parent()
          .prev().prev().should("have.text", "LHR-");
      });

      it(`Verify '${paperLhrDocType}' have internal group 'PAPER_LHR'`, () => {
        cy.contains(paperLhrDocType).parent()
          .prev().should("have.text", "PAPER_LHR");
      });
    });
  });

  context("'Paper LHR' creation flow from document list", () => {
    context("Create 'Paper LHR' form", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document'", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enter title 'New Purchase Order Form'", () => {
        cy.drEnterDocumentTitle({ name: paperlhrTitle });
      });

      it("Enter description 'New Purchase Order Form description'", () => {
        cy.drEnterDocumentDescription({ description: "Paper LHR form description" });
      });

      it("Click on 'Form' document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Click on 'Purchase Order' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Paper Lot History Record" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });

    context("Verify predefined fields are displayed", () => {
      it(`Verify 'The Part to be Manufactured is required field' is displayed`, () => {
        cy.get(`[name="lhr-selected-part"]`).parent().parent()
          .contains("The Part to be Manufactured is a required field.");
      });

      it("Check 'Build Type' is displayed", () => {
        cy.get(`[data-cy="Build Type"]`).should("exist")
          .parent().parent().parent().parent().next()
          .should("have.text", "The Build Type is a required field.");
        cy.get(`[data-cy="Build Type"]`).parent().parent().parent().parent()
          .should("contain.html", `role="radiogroup"`);
        cy.get(`[name="lhr-build-type"]`).eq(0).should("have.value", "R&D");
        cy.get(`[name="lhr-build-type"]`).eq(1).should("have.value", "Production");
      });

      it("Check 'Initial Quantity' is displayed", () => {
        cy.get("[data-cy=\"Initial Quantity\"]").should("exist")
          .parent().parent().parent().parent().next()
          .should("have.text", "The Initial Quantity is a required field.");
      });

      it("Check 'End Quantity' is displayed", () => {
        cy.get("[data-cy=\"End Quantity\"]").should("exist")
          .parent().parent().parent().parent().next()
          .should("have.text", "The End Quantity is a required field.");
      });

      it("Check 'Approvals' is displayed", () => {
        cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
      });
    });

    context("Navigate to document list and check data on landing page and open it", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Filter Released 'Paper LHR' form", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocTitle({ docTitle: paperlhrTitle });
      });

      it("Verify data on landing page", () => {
        cy.dlVerifyFilterByRev({ revision: "1" });
        cy.dlVerifyFilterByType({ type: "FM" });
        cy.dlVerifyFilterByOwner({ owner: USERS[1].name });
        cy.dlVerifyFilterByStatus({ status: "Draft" });
      });

      it("Click and open the FM", () => {
        cy.dlSelectFirstDocument();
      });
    });

    context("Verify all data and predefined fields are present", () => {
      it(`Verify 'The Part to be Manufactured is required field' is displayed`, () => {
        cy.get(`[name="lhr-selected-part"]`).parent().parent()
          .contains("The Part to be Manufactured is a required field.");
      });

      it("Verify 'Build Type' is displayed", () => {
        cy.get("[data-cy=\"Build Type\"]").should("exist")
          .parent().parent().parent().parent().next()
          .should("have.text", "The Build Type is a required field.");
      });

      it("Verify 'Initial Quantity' is displayed", () => {
        cy.get("[data-cy=\"Initial Quantity\"]").should("exist")
          .parent().parent().parent().parent().next()
          .should("have.text", "The Initial Quantity is a required field.");
      });

      it("Verify 'End Quantity' is displayed", () => {
        cy.get("[data-cy=\"End Quantity\"]").should("exist")
          .parent().parent().parent().parent().next()
          .should("have.text", "The End Quantity is a required field.");
      });

      it("Verify 'Approvals' is displayed", () => {
        cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
      });
    });

    context("Add fields into the form", () => {
      it("Add File Upload", () => {
        cy.fbAddNewFieldWhenHidden2ndLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
        cy.fbEnterNameValue({ name: "label", value: fileUploadFieldTitle });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Approve and release form", () => {
      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });

      it(`Verify that FM is ${STATUS_TYPES_LABEL.RELEASED}`, () => {
        cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.get(`[data-cy="field-name"]`).should("have.text", paperlhrTitle);
      });
    });

    context("Navigate to document list and check data on landing page and open it", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Filter Released 'Paper LHR' form", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocTitle({ docTitle: paperlhrTitle });
      });

      it("Verify data on landing page", () => {
        cy.dlVerifyFilterByRev({ revision: "1" });
        cy.dlVerifyFilterByType({ type: "FM" });
        cy.dlVerifyFilterByOwner({ owner: USERS[1].name });
        cy.dlVerifyFilterByStatus({ status: "Released" });
        cy.dlVerifyFilterByArId({ arId: arID });
        cy.dlVerifyFilterByEffectiveDate({ effectiveDate: currentDate });
      });

      it("Click and open the FM", () => {
        cy.dlSelectFirstDocument();
      });
    });

    context("Click to revise and Verify all data and predefined fields are present", () => {
      it("Click Revise document", () => {
        cy.drClickReviseDocument();
      });

      it("Save form", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it(`Verify 'The Part to be Manufactured is required field' is displayed`, () => {
        cy.get(`[name="lhr-selected-part"]`).parent().parent()
          .contains("The Part to be Manufactured is a required field.");
      });

      it("Verify 'Build Type' is displayed", () => {
        cy.get("[data-cy=\"Build Type\"]").should("exist")
          .parent().parent().parent().parent().next()
          .should("have.text", "The Build Type is a required field.");
      });

      it("Verify 'Initial Quantity' is displayed", () => {
        cy.get("[data-cy=\"Initial Quantity\"]").should("exist")
          .parent().parent().parent().parent().next()
          .should("have.text", "The Initial Quantity is a required field.");
      });

      it("Verify 'End Quantity' is displayed", () => {
        cy.get("[data-cy=\"End Quantity\"]").should("exist")
          .parent().parent().parent().parent().next()
          .should("have.text", "The End Quantity is a required field.");
      });

      it("Verify 'Approvals' is displayed", () => {
        cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
      });
    });

    context(`Remove ${fileUploadFieldTitle} approve and verify Released form`, () => {
      it(`Remove ${fileUploadFieldTitle}`, () => {
        cy.get("[data-cy=\"remove-schema-item\"]").eq(-2).arrowClick({ force: true });
      });

      it("Save form", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Verify File Upload is not diplayed", () => {
        cy.get(`[data-cy="${fileUploadFieldTitle}"]`).should("not.exist");
      });

      it("Approve and release form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });

      it(`Verify that FM is ${STATUS_TYPES_LABEL.RELEASED}`, () => {
        cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.get(`[data-cy="field-name"]`).should("have.text", paperlhrTitle);
      });
    });
  });
});

export { };

