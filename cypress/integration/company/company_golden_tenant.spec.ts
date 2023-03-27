// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { NCORecord } from "../../utils/constants/documentTypes/nco";
import { Seed } from "../../utils/constants/documentTypes/seed";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
const seedFormName = "Seed Form";
const ncoFormName = "NCO Form";
const randomNumberForCompany = (Math.round(Math.random() * 100000)) % 100000;
const newCompanyName = "New company " + randomNumberForCompany;
const newCompanyAbbr = "NC-" + randomNumberForCompany;

context("Create company with golden tenant", () => {
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
    SystemRequirement("REQ-3490");
    it("[API]Creates company", (done: any) => {
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
              Seed,
              NCORecord,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Create form for NCO document", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
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
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context("Create form for SEED document", () => {
    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Enters title '${seedFormName}'`, () => {
      cy.drEnterDocumentTitle({ name: seedFormName });
    });

    it("Enters description 'New Seed Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Seed Form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'SEED' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "SEED" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context("Create first document from Seed Form - form with output", () => {
    it("Create new document from form", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title 'New Seed'", () => {
      cy.drEnterDocumentTitle({ name: "New Seed" });
    });

    it("Enters description 'New Seed description'", () => {
      cy.drEnterDocumentDescription({ description: "New Seed description" });
    });

    it("Switch to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Enters document title 'First document'", () => {
      cy.get("[data-cy^=document-title-]").arrowType("First document");
    });

    it("Select 'Form with output' value on 'Type of document to be created'", () => {
      cy.get("[name^=type-of-document-to-be-created-]").eq(0).check();
    });

    it("Select 'Numeric' value on 'Default Revision Stage'", () => {
      cy.get("[name^=default-revision-stage-]").eq(0).check();
    });

    it("Upload JSON Form", () => {
      cy.atchUploadJSONFormForSeed({ fileName: "TestTemplate.json", queue: 0 });
    });

    it("Enters document description 'First document description'", () => {
      cy.get("[data-cy^=document-description-]>div>div>div>div>div[contenteditable]>div")
        .click({ force: true }).arrowType("First document description", { force: true });
    });

    it("Selects document type as 'Form'", () => {
      cy.get("[id^=mui-component-select-document-type-to-be-selected-]").arrowClick();
      cy.get("[id^=menu-document-type-to-be-selected-]>div:nth-child(3)>ul").contains("li", "Form").arrowClick();
    });

    it("Selects document type as 'Clinical Protocol'", () => {
      cy.get("[id^=mui-component-select-define-the-output-of-that-form-]").arrowClick();
      cy.get("[id^=menu-define-the-output-of-that-form-]>div:nth-child(3)>ul")
        .contains("li", "Clinical Protocol").arrowClick();
    });

    it("Selects 'No' training required option", () => {
      cy.get("[name^=training-required-]").eq(1).arrowClick();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context("Create second document from Seed Form - normal document", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select released Seed Form", () => {
      cy.drFilterDocListByNameAndStatus({ title: seedFormName, status: "Released" });
    });

    it("Create new document from form", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title 'New Seed 2'", () => {
      cy.drEnterDocumentTitle({ name: "New Seed 2" });
    });

    it("Enters description 'New Seed description 2'", () => {
      cy.drEnterDocumentDescription({ description: "New Seed description 2" });
    });

    it("Click on 'Details' tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Enters document title 'Second document'", () => {
      cy.get("[data-cy^=document-title-]").arrowType("Second document");
    });

    it("Select 'Document' value on 'Type of document to be created'", () => {
      cy.get("[name^=type-of-document-to-be-created-]").eq(1).check();
    });

    it("Select 'Numeric' value on 'Default Revision Stage'", () => {
      cy.get("[name^=default-revision-stage-]").eq(0).check();
    });

    it("Enters document description 'Second document description'", () => {
      cy.get("[data-cy^=document-description-]>div>div>div>div>div[contenteditable]>div")
        .click({ force: true }).arrowType("Second document description", { force: true });
      cy.get("[data-cy^=document-title-]").arrowClick();
    });

    it("Selects document type as 'Clinical Protocol'", () => {
      cy.get("[id^=mui-component-select-document-type-to-be-selected-]").arrowClick();
      cy.get("[id^=menu-document-type-to-be-selected-]>div:nth-child(3)>ul")
        .contains("li", "Clinical Protocol").arrowClick();
    });

    it("Selects 'No' training required option", () => {
      cy.get("[name^=training-required-]").eq(1).check();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
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

    it("Click on 'Details' tab", () => {
      cy.drSelectDetailsTab();
    });

    it(`Enters company name '${newCompanyName}'`, () => {
      SystemRequirement("REQ-3500");
      cy.get("[name^=company-name-]").arrowType(newCompanyName);
    });

    it(`Enters company abbriviation '${newCompanyAbbr}'`, () => {
      SystemRequirement("REQ-3500");
      cy.get("[name^=company-abbreviation-]").arrowType(newCompanyAbbr);
    });

    it(`Enters company email '${USERS[1].email}'`, () => {
      SystemRequirement("REQ-3500");
      cy.get("[name^=company-admin-email-]").arrowType(USERS[1].email);
    });

    it("Select 'Yes' for 'Approved DAM json is used'", () => {
      cy.get("[name*=\"approved-dam-json-is-used-\"]").check("Yes");
    });

    it("Upload DOM JSON", () => {
      SystemRequirement("REQ-3520");
      cy.atchUploadDOMJSONForNCO({ fileName: "dam.json", queue: 0 });
    });

    it("Select 'Yes' for 'Approved Page Details json is used'", () => {
      cy.get("[name*=\"approved-page-details-json-is-used-\"]").check("Yes");
    });

    it("Upload Page Details JSON", () => {
      SystemRequirement("REQ-3530");
      cy.atchUploadPageDetailsJSONForNCO({ fileName: "PageDetails.json", queue: 0 });
    });

    it("Select 'Yes' for 'Approved Navigation json is used'", () => {
      cy.get("[name*=\"approved-navigation-json-is-used-\"]").check("Yes");
    });

    it("Upload Navigation JSON", () => {
      SystemRequirement("REQ-3540");
      cy.atchUploadNavigationJSONForNCO({ fileName: "navigation.json", queue: 0 });
    });

    it("Error message on upload Users List with incorrect email in JSON", () => {
      cy.atchUploadUserListJSONForNCO({ fileName: "incorrect_users.csv", queue: 0 });
      cy.drClickCreateDocumentWithoutApiCallForForms();
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi({ toastifyExists: true });
      cy.checkToastMessageContains({ message: "email must be an email" });
      cy.closeAllAlertMessages();
      cy.drCloseApproveAndReleaseDialog();
      cy.get("[data-cy=\"remove-incorrect_users.csv\"]").arrowClick({ force: true });
    });

    it("Error message on upload Users List file other than json or csv", () => {
      cy.atchUploadUserListJSONForNCO({ fileName: "test.docx", queue: 0 });
      cy.drClickCreateDocumentWithoutApiCallForForms();
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi({ toastifyExists: true });
      cy.checkToastMessageContains({ message: "has to be either CSV or JSON file!" });
      cy.closeAllAlertMessages();
      cy.drCloseApproveAndReleaseDialog();
      cy.get("[data-cy=\"remove-test.docx\"]").arrowClick({ force: true });
    });

    it("Upload Users List JSON", () => {
      SystemRequirement("REQ-3550");
      cy.atchUploadUserListJSONForNCO({ fileName: "users.csv", queue: 0 });
    });

    it("Refresh Seed documents input", () => {
      SystemRequirement("REQ-3570");
      cy.get("[name^=seed-documents-to-be-included-]>div>div:nth-child(2)>button").arrowClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add Seed documents", () => {
      SystemRequirement("REQ-3570");
      cy.get("[name^=seed-documents-to-be-included-]").arrowType("SEED-00001");
      cy.get("ul>li[role=option]").contains("SEED-00001").arrowClick();
      cy.unClick();
      cy.get("[name^=seed-documents-to-be-included-]").arrowType("SEED-00002");
      cy.get("ul>li[role=option]").contains("SEED-00002").arrowClick();
    });

    it("Upload logo picture 'image.jpg'", () => {
      SystemRequirement("REQ-3500");
      cy.get("[data-cy=\"albumMediaButton\"]").eq(0).arrowClick();
      cy.pmUploadAttachment({ fileName: "image.jpg" });
    });

    it("Error message on upload incorrect DAM JSON", () => {
      cy.get("[data-cy=\"remove-dam.json\"]").arrowClick({ force: true });
      cy.atchUploadDOMJSONForNCO({ fileName: "incorrect_dam.json", queue: 0 });
      cy.drClickCreateDocumentWithoutApiCallForForms();
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi({ toastifyExists: true });
      cy.checkToastMessageContains({ message: "User email: enlil1.testmail+cy2@gmail.com is not users.csv" });
      cy.checkToastMessageContains({ message: "Group name: QA1 is not in default NCO groups list" });
      cy.closeAllAlertMessages();
      cy.drCloseApproveAndReleaseDialog();
      cy.get("[data-cy=\"remove-incorrect_dam.json\"]").arrowClick({ force: true });
    });

    it("Upload correct DAM JSON", () => {
      cy.atchUploadDOMJSONForNCO({ fileName: "dam.json", queue: 0 });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Approve and release document - create company", () => {
      SystemRequirement("REQ-3600");
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
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
      cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
    });

    it("Verify default Background company color", () => {
      cy.get("#navigation").should("have.css", "background-color", "rgb(18, 27, 33)");
    });

    it("Verify default company logo", () => {
      const tmpRegex = new RegExp( `http[s]:\\/\\/.*\\/image`, "gi" );
      cy.get("img[alt=\"Company logo\"]").invoke("attr", "src").should("match", tmpRegex);
    });

    it("Verify that tabs are lighter color when they are hovered over on Dashboard", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(0)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on Document Control", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(1).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(1)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on Equipment", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(2).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(2)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on Supplier Management", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(3).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(3)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on Purchase orders", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(4).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(4)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on Receiving", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(5).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(5)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on Manfacturing", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(6).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(6)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on Group Management", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(7).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(7)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on User Management", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(8).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(8)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });
    it("Verify that tabs are lighter color when they are hovered over on Training", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(9).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(9)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });
    it("Verify the profile dropdown", () => {
      cy.get("[data-cy=\"header-userInitials\"]").eq(0).contains("GR").trigger("mousedown");
    });
  });

  context("Check document existence inside company", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Check number of documents in list", () => {
      cy.dlClearFilters();
      cy.filterCheckNumberOfDisplayedRecords({ numberOfRecords: "5" });
    });
  });

  context("Check each document values", () => {
    it("Check first document values", () => {
      SystemRequirement("REQ-3580");
      cy.drFilterDocListByNameAndStatus({ title: "First document", status: "Draft" });
      cy.drEnterDocumentDescription({ description: "First document description" });
      cy.get("[data-cy=\"select.document.documentType.id\"]").contains("Form");
      cy.get("[id=\"formTemplate.outputDocumentTypes\"]").contains("Clinical Protocol");
    });

    it("Check second document values", () => {
      SystemRequirement("REQ-3580");
      cy.navigToDocumentList();
      cy.dlClearFilters();
      cy.drFilterDocListByNameAndStatus({ title: "Second document", status: "Draft" });
      cy.drEnterDocumentDescription({ description: "Second document description" });
      cy.get("[data-cy=\"select.document.documentType.id\"]").contains("Clinical Protocol");
    });

    it("Check third document values", () => {
      cy.navigToDocumentList();
      cy.dlClearFilters();
      cy.drFilterDocListByNameAndStatus({ title: "Document Approval Matrix", status: "Draft" });
      cy.drEnterDocumentDescription({ description: "Initial DAM Description" });
    });

    it("Check forth document values", () => {
      cy.navigToDocumentList();
      cy.dlClearFilters();
      cy.drFilterDocListByNameAndStatus({ title: "DAM Form", status: "Released" });
      cy.get("[data-cy=\"BaseWithhtml-editor\"]").contains("DAM Form");
      cy.get("[data-cy=\"SummaryBaseProps-values\"]").eq(1).contains("Document Approval Matrix");
    });

    it("Check fifth document values", () => {
      cy.navigToDocumentList();
      cy.dlClearFilters();
      cy.drFilterDocListByNameAndStatus({ title: "AR Form", status: "Released" });
      cy.get("[data-cy=\"BaseWithhtml-editor\"]").contains("Approval Request Form");
      cy.get("[data-cy=\"SummaryBaseProps-values\"]").eq(1).contains("Approval Request");
    });
  });

  context("Check the DAM and list should be created with defined Document types, Roles and Assigned Approval", () => {
    it("Open the DAM and its status should be Draft", () => {
      cy.navigToDocumentList();
      cy.dlClearFilters();
      cy.drFilterDocListByNameAndStatus({ title: "Document Approval Matrix", status: "Draft" });
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("navigate to matrix details tab", () => {
      cy.drSelectMatrixDetailsTab();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("check DAM document types", () => {
      const documentTypes: string[] = [];
      cy.get("[data-cy=\"documentTypeApprovalMatrix\"]").each(($el) => {
        documentTypes.push($el.text());
      });
      cy.fixture("dam.json").then((file) => {
        cy.get(file.approvalMatrix).each((obj: any) => {
          expect(documentTypes).to.include(obj.docType.name);
        });
      });
    });

    it("Check DAM assigned approval roles", () => {
      const roles: string[] = [];
      cy.get(`[class*="containing-box-scrollbar"] table:nth-child(1) tbody tr:nth-child(2) td`).each(($el) => {
        roles.push($el.text());
      });
      cy.wrap(roles).should("have.length", 12);
      cy.fixture("dam.json").then((file) => {
        let damRoles: any[] = [];
        const approvalRoles = file.approvalMatrix[1].approvalRoles;
        damRoles.push(approvalRoles.stage1);
        damRoles.push(approvalRoles.stage2);
        damRoles.push(approvalRoles.stage3);
        damRoles.push(approvalRoles.admStage);
        damRoles = [].concat(...damRoles);

        cy.wrap(damRoles).each((obj, i) => {
          expect(obj ? "Y" : " ").eql(roles[i]);
        });
      });
    });

    it("Check DAM approval roles", () => {
      const roles: string[] = [];
      cy.get("table:eq(1) thead tr:eq(1) th").each(($el) => {
        roles.push($el.text());
      });
      cy.wrap(roles).should("have.length", 12);
      cy.fixture("dam.json").then((file) => {
        cy.wrap(roles).each((obj, i) => {
          expect(obj).eql(file.approvalRoles[i % 3].name);
        });
      });
    });
  });

  context("Verify change in DAM should update", () => {
    it("Edit DAM", () => {
      cy.get("[data-cy=\"EditBtnDAM\"]").arrowClick();
    });

    it("Make a change in DAM", () => {
      cy.get("table:eq(0) tbody tr:eq(0) td:eq(3) svg").arrowClick();
    });

    it("Click exit DAM", () => {
      cy.get("[data-cy=\"EditBtnDAM\"]").arrowClick();
    });

    it("Reload page", () => {
      cy.reload();
    });

    it("navigate to matrix details tab", () => {
      cy.drSelectMatrixDetailsTab();
    });

    it("change should be saved", () => {
      cy.get("table:eq(0) tbody tr:eq(0) td:eq(3)").should("have.text", "No");
    });
  });

  context("Check each AR values", () => {
    it("Check first AR", () => {
      cy.navigToApprovalRequestList();
      cy.arClearFilters();
      cy.arFilterARListByNameAndStatus({ title: "AR Form", status: "CLOSED" });
      cy.get("[data-cy=\"documentRevisions.0.proposedDocumentRevision.id\"]")
        .should("have.value", "FM-00001 - rev 1 - AR Form");
      cy.get("[data-cy=\"BaseWithhtml-editor\"]").contains("Approval Request Form");
    });
  });

  context("Check group management", () => {
    it("Navigates to Group management", () => {
      cy.grpNavigateToGroupManagement();
    });

    it("Click on 'All Users' group and check default values", () => {
      SystemRequirement("REQ-2520");
      cy.grpSelectGroupWithoutClosingDialog({ name: "All Users" });
      cy.get("[id=\"Group-permissions\"]").should("contain.text", "CR_OWNER_AS_APPROVER")
        .and("contain.text", "CR_ON_APPROVER_LIST")
        .and("contain.text", "EMPLOYEE_GET");
      cy.get("[id=\"Group-addTags\"]").should("contain.text", "QMS_DEFAULT")
        .and("contain.text", "FB_COMPONENT_INLINE_APPROVAL");
      cy.grpCloseDialog();
    });

    it("Click on 'User Management' group and check default values", () => {
      SystemRequirement("REQ-2520");
      cy.grpSelectGroupWithoutClosingDialog({ name: "User Management" });
      cy.get("[id=\"Group-permissions\"]").should("contain.text", "EMPLOYEE_CREATE")
        .and("contain.text", "EMPLOYEE_DELETE")
        .and("contain.text", "EMPLOYEE_GET")
        .and("contain.text", "EMPLOYEE_UPDATE")
        .and("contain.text", "GROUP_UPDATE");
      cy.get("[id=\"Group-addTags\"]").should("contain.text", "USER_MANAGEMENT");
      cy.grpCloseDialog();
    });

    it("Click on 'Group Management' group and check default values", () => {
      SystemRequirement("REQ-2520");
      cy.grpSelectGroupWithoutClosingDialog({ name: "Group Management" });
      cy.get("[id=\"Group-permissions\"]").should("contain.text", "GROUP_CREATE")
        .and("contain.text", "GROUP_UPDATE")
        .and("contain.text", "GROUP_DELETE")
        .and("contain.text", "GROUP_CREATE_UNOFFICIAL")
        .and("contain.text", "GROUP_UPDATE_UNOFFICIAL");
      cy.get("[id=\"Group-addTags\"]").should("contain.text", "GROUP_MANAGEMENT");
      cy.grpCloseDialog();
    });

    it("Click on 'Company Admin' group and check default values", () => {
      SystemRequirement("REQ-2520");
      cy.grpSelectGroupWithoutClosingDialog({ name: "Company Admin" });
      cy.get("[id=\"Group-permissions\"]").should("contain.text", "EMPLOYEE_CREATE")
        .and("contain.text", "EMPLOYEE_DELETE")
        .and("contain.text", "EMPLOYEE_UPDATE")
        .and("contain.text", "GROUP_CREATE")
        .and("contain.text", "GROUP_UPDATE")
        .and("contain.text", "SLACK_APP_INSTALL")
        .and("contain.text", "COMPANY_UPDATE_CURRENT")
        .and("contain.text", "DOCUMENT_OWNER_CHANGE")
        .and("contain.text", "DEVELOPERS");
      cy.get("[id=\"Group-addTags\"]").should("contain.text", "FB_COMPONENT_PURCHASE_ORDER")
        .and("contain.text", "FB_COMPONENT_RECEIVE_PURCHASE_ORDER")
        .and("contain.text", "GROUP_MANAGEMENT")
        .and("contain.text", "USER_MANAGEMENT")
        .and("contain.text", "OWNERSHIP_CHANGE")
        .and("contain.text", "FB_COMPONENT_EQUIPMENT_MAINTENANCE")
        .and("contain.text", "DOCUMENT_TYPE_MANAGEMENT");
      cy.get("[id=\"Group-addParentGroups\"]").should("contain.text", "All Users");
      cy.grpCloseDialog();
    });

    it("Click on 'Enlil Super User' group and check default values", () => {
      SystemRequirement("REQ-2520");
      cy.grpSelectGroupWithoutClosingDialog({ name: "Enlil Super User" });
      cy.get("[id=\"Group-permissions\"]").should("contain.text", "DEVELOPERS")
        .and("contain.text", "FORM_BUILDER_CUSTOM_VALIDATORS_ENABLED")
        .and("contain.text", "HTML_UPDATE")
        .and("contain.text", "REMOTE_VALIDATORS_REFRESH")
        .and("contain.text", "GROUP_DELETE")
        .and("contain.text", "DOC_REV_OBS_TO_RELEASED")
        .and("contain.text", "COMPANY_UPDATE_CURRENT");
      cy.get("[id=\"Group-addTags\"]").should("contain.text", "NAVIGATION_WITH_RESTRICTED_DOC_TYPES")
        .and("contain.text", "CREATE_DOCS_OF_RESTRICTED_DOC_TYPES")
        .and("contain.text", "USER_MANAGEMENT")
        .and("contain.text", "DOCUMENT_TYPE_MANAGEMENT")
        .and("contain.text", "PAGE_DETAILS_MANAGEMENT")
        .and("contain.text", "COMPANY_CONFIG_WHITELABELING")
        .and("contain.text", "COMPANY_CONFIG_NAVIGATION")
        .and("contain.text", "COMPANY_CONFIG_DOCUMENT_REV_STAGES")
        .and("contain.text", "LABEL_TOOLTIPS");
      cy.grpCloseDialog();
    });

    it("Click on 'CEO' group and check default values", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "CEO" });
      cy.get("[id=\"Group-addParentGroups\"]").should("contain.text", "All Users");
      cy.grpCloseDialog();
    });

    it("Click on 'QA' group and check default values", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "QA" });
      cy.get("[id=\"Group-addParentGroups\"]").should("contain.text", "All Users");
      cy.grpCloseDialog();
    });

    it("Click on 'R&D' group and check default values", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "R&D" });
      cy.get("[id=\"Group-addParentGroups\"]").should("contain.text", "All Users");
      cy.grpCloseDialog();
    });

    it("Click on 'OPS' group and check default values", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "OPS" });
      cy.get("[id=\"Group-addParentGroups\"]").should("contain.text", "All Users");
      cy.grpCloseDialog();
    });

    it("Click on 'RA' group and check default values", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "RA" });
      cy.get("[id=\"Group-addParentGroups\"]").should("contain.text", "All Users");
      cy.grpCloseDialog();
    });

    it("Click on 'Clinical' group and check default values", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "Clinical" });
      cy.get("[id=\"Group-addParentGroups\"]").should("contain.text", "All Users");
      cy.grpCloseDialog();
    });

    it("Click on 'Marketing' group and check default values", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "Marketing" });
      cy.get("[id=\"Group-addParentGroups\"]").should("contain.text", "All Users");
      cy.grpCloseDialog();
    });

    it("Click on 'Doc Admin' group and check default values", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "Doc Admin" });
      cy.get("[id=\"Group-addParentGroups\"]").should("contain.text", "All Users");
      cy.grpCloseDialog();
    });

    it("Log out user", () => {
      cy.authLogout();
    });
  });

  context("Check if another user can login into company created by NCO", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
    });

    it("Log out user", () => {
      cy.authLogout();
    });
  });

  context("Login as admin user and obsolete NCO document", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select released NCO Form", () => {
      cy.drFilterDocListByNameAndStatus({ title: "New company", status: "Released" });
    });

    it("Save document", () => {
      cy.drClickReviseDocument();
    });

    it("Select 'Obsolete' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Obsolete" });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Approve and release document - create company", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Log out user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Check if company is deleted", () => {
      cy.cmpCompanyDoesntExist({ name: newCompanyName, multiple: multipleCompanies });
    });
  });
});

export { };

