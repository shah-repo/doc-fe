// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { RecordOne } from "../../utils/constants/documentTypes/record";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;
let RDdocumentType;

context("Record inline Flow", () => {
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
    it("[API]Creates company", (done: any) => {
      SystemRequirement("REQ-0400", "REQ-0410", "REQ-0420", "REQ-0440");
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
              RecordOne,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          RDdocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Record one");
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });
  });

  context("[API]Update record document type", () => {
    it("Change fields config in record document type", () => {
      cy.drUpdateDocumentTypeName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        id: RDdocumentType[0].id,
        payload: {
          fieldsConfig: {
            D: {
              visible: false,
              required: false,
            },
            E: {
              label: "Record Type",
              visible: true,
              required: true,
            },
            F: {
              label: "Record ID",
              visible: false,
              required: true,
            },
            G: {
              visible: false,
              required: false,
            },
            I: {
              visible: false,
            },
            J: {
              visible: false,
            },
            K: {
              label: "Void",
              visible: true,
            },
            L: {
              label: "Correction",
              visible: true,
            },
            N: {
              label: "Finalize and Release",
              visible: true,
            },
            O: {
              label: "Record History",
              visible: true,
            },
            R: {
              visible: false,
            },
            S: {
              label: "Update Record",
              visible: true,
            },
            A1: {
              label: "WIP",
              visible: true,
            },
            A2: {
              label: "Voided",
              visible: true,
            },
            A3: {
              label: "Archive",
              visible: true,
            },
            P1: {
              label: "WIP",
              visible: true,
            },
            P2: {
              label: "Voided",
              visible: true,
            },
            P3: {
              label: "Archive",
              visible: true,
            },
          },
        },
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("FORM document creation flow", () => {
    context("Start document creation flow", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Click on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in document detail", () => {

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Enter title 'Inline Form Document Revision'", () => {
        cy.drEnterDocumentTitle({ name: "Inline Form Document Revision" });
      });

      it("Enter description 'Inline Form Document Revision description'", () => {
        cy.drEnterDocumentDescription({ description: "Inline Form Document Revision description" });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Record one' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Record one" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
        cy.progressBarShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Click on Save", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Verify Overview Tab Selected by default", () => {
        cy.isTabActive({ name: "overview", index: 0 });
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").should("exist");
        cy.verifyPredefiendFields();
      });

      it("Add textfield", () => {
        cy.fbAddNewFieldWhenHidden();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "first textfield for inline" });
        cy.fbAddNewFieldButton();
      });

      it("Add Checkbox group", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
        cy.fbEnterNameValue({ name: "label", value: "Checkbox1" });
        cy.fbGroupOptions("A", "B", "C");
        cy.fbOpenValidation();
        cy.fbFieldRequired();
        cy.fbAddNewFieldButton();
      });

      it("Add inline approval 1", () => {
        cy.listLoadingElementShouldNotExist();
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
        cy.fbEnterNameValue({ name: "label", value: "First inline field" });
        cy.fbAddApproverToInlineDialog({ approverName: USERS[1].name });
        cy.get("[data-cy='editorConfig.groups']").autocompleteSelect("Everyone");
        cy.fbAddNewFieldButton();
      });

      it("Add radio button field and select field", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
        cy.fbEnterNameValue({ name: "label", value: "Radio group for inline" });
        cy.fbGroupOptions("11", "12");
        cy.fbAddNewFieldButton();
      });

      it("Add select field", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
        cy.fbEnterNameValue({ name: "label", value: "fb-select-field" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbAddNewFieldButton();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add inline approval2", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
        cy.fbEnterNameValue({ name: "label", value: "Second inline field" });
        cy.fbAddApproverToInlineDialog({ approverName: USERS[1].name });
        cy.get("[data-cy='editorConfig.groups']").autocompleteSelect("Everyone");
        cy.fbAddNewFieldButton();
      });

      it("Add Checkbox group", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
        cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
        cy.fbGroupOptions("1", "2", "3");
        cy.fbOpenValidation();
        cy.fbFieldRequired();
        cy.fbAddNewFieldButton();
      });

      it("Add radio button field", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
        cy.fbEnterNameValue({ name: "label", value: "Radio group2 " });
        cy.fbGroupOptions("21", "22");
        cy.fbAddNewFieldButton();
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify form option exist in detail Tab", () => {
        cy.drSelectDetailsTab();
        cy.get(".formOptionsBox").should("exist");
      });

      it("Add inline approval", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
        cy.fbEnterNameValue({ name: "label", value: "firstd Inline field" });
        cy.fbAddApproverToInlineDialog({ approverName: USERS[1].name });
        cy.fbAddApproverToInlineDialog({ approverName: USERS[2].name });
        cy.get("[data-cy='editorConfig.groups']").autocompleteSelect("Everyone");
        cy.fbAddNewFieldButton();
      });

      it("Add textfield", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "Textfield for inline" });
        cy.fbAddNewFieldButton();
      });

      it("Add Checkbox group", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
        cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
        cy.fbGroupOptions("1", "2", "3");
        cy.fbOpenValidation();
        cy.fbFieldRequired();
        cy.fbAddNewFieldButton();
      });
    });

    context("Create document", () => {
      it("Save the document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
        cy.landingPageLoadingElementShouldNotExist();
      });
    });

    context("Verify Predefiend fields and tabs", () => {
      it("Verify Predefiend Tabs Exist", () => {
        cy.verifyTabs("overview", "details");
      });

      it("Verify Tabs are fixed and order not changable", () => {
        cy.verifyFixedTab();
      });

      it("Verify Predefiend fields up to attachment", () => {
        cy.drSelectOverviewTab();
        cy.progressBarShouldNotExist();
        cy.verifyPredefiendFields();
        cy.get("[data-cy='attachment']").should("exist");
      });
    });

    context("Verify Overview  Tab", () => {
      it("Verify The top left of the page displays: Icon and document type, Doc ID, Rev stage, status (Draft)", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.DRAFT,
          title: "Document List",
          docId: "FM-00002",
          revision: "Rev 1",
        });
      });

      it("Navigate to details Tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Clicking on details Tab other tabs should be closed and details tab should open", () => {
        cy.get("[data-cy='tabCon-tabId.overview']").should("have.attr", "aria-selected", "false");
        cy.get("#sm-tabpanel-0").should("not.exist");
        cy.get("[data-cy='tabCon-tabId.details']").should("have.attr", "aria-selected", "true");
      });
    });

    context("Release document", () => {
      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });
  });

  context("Create record WIP", () => {
    it("Navigate to records", () => {
      cy.navigToRecords();
    });

    it("Click on create new and chose 'Record one'", () => {
      cy.recCreateRecordFromLandingPage();
      cy.recSelectRecordFormFromMultiSelect({ recordType: "Record one" });
    });

    it("Verify record is created", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.WIP,
        title: "Records",
        docId: "RD-00003",
        revision: "Rev 1",
      });
    });

    context("Fill in document attributes", () => {
      it("Enter title 'Record Document Revision'", () => {
        cy.drEnterDocumentTitle({ name: "Record Document Revision" });
        cy.unClick();
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.get("input[id='attachments-button-file']").attachFile("image.jpg");
        cy.get("[data-cy='AttachmentFieldPresenter-field']").click().wait(500);
        cy.progressBarShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Checkbox option 1 checked", () => {
        cy.get(`input[type="checkbox"][value="1"]`).last().check();
      });

      it("Enter text 'First entry' in textfield for inline", () => {
        cy.get("[name^='first-textfield-for-inline']").arrowType("First entry");
        cy.unClick();
      });

      it("Select another value for select field and check for autosave", () => {
        cy.get("[id^='mui-component-select-fb-select-field']").arrowClick();
        cy.get("[data-value='option2']").arrowClick();
        cy.unClick();
      });

      it("Select approver for first inline", () => {
        cy.get("[name*='fb-ia-first-inline-field'] input")
          .autocompleteSelect(`${USERS[1].name}`, { force: true });
      });

      it("Select approver for Second inline", () => {
        cy.get("[name*='fb-ia-second-inline-field'] input")
          .autocompleteSelect(`${USERS[1].name}`, { force: true });
      });

      it("Click on Save", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Checkbox option 1 checked", () => {
        cy.get(`input[type="checkbox"][value="1"]`).last().check();
      });

      it("Enter text 'First entry' in textfield for inline", () => {
        cy.get("[data-cy^='textfield-for-inline'] input").arrowType("First entry");
        cy.unClick();
      });

      it("Select approver for first inline", () => {
        cy.get("[name*='fb-ia-firstd-inline-field'] input")
          .autocompleteSelect(`${USERS[1].name}`, { force: true });
      });

      it("Click on Save", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });
  });

  context("Create record and Relesed it", () => {
    it("Navigate to records", () => {
      cy.navigToRecords();
    });

    it("Click on create new and chose 'Record one'", () => {
      cy.recCreateRecordFromLandingPage();
      cy.recSelectRecordFormFromMultiSelect({ recordType: "Record one" });
    });

    it("Verify record is created", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.WIP,
        title: "Records",
        docId: "RD-00004",
        revision: "Rev 1",
      });
    });

    it("Verify Predefiend Tabs overview and details Exist", () => {
      cy.verifyTabs("overview", "details");
    });

    it("Verify Form opens to the Overview tab by default", () => {
      cy.isTabActive({ name: "overview", index: 0 });
    });

    context("Verify added fields in the tabs", () => {
      it("Verify check box exist'", () => {
        cy.get(`input[type="checkbox"][value="A"]`).should("exist");
        cy.get(`input[type="checkbox"][value="1"]`).should("exist");
      });

      it("Verify radio buttons'", () => {
        cy.get(`input[type="radio"][value="11"]`).should("exist");
        cy.get(`input[type="radio"][value="21"]`).should("exist");
      });

      it("Verify Inline Inputs'", () => {
        cy.get("[name^='first-textfield-for-inline']").should("exist");
      });

      it("Verify Inline Approval Inputs'", () => {
        cy.get("[name^='fb-ia-first-inline-field'] input").should("exist");
        cy.get("[name^='fb-ia-second-inline-field'] input").should("exist");
      });
    });

    context("Fill in document attributes", () => {

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Enter title 'Record Document Revision'", () => {
        cy.drEnterDocumentTitle({ name: "Record Document Revision" });
        cy.unClick();
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.get("input[id='attachments-button-file']").attachFile("image.jpg");
        cy.get("[data-cy='AttachmentFieldPresenter-field']").click().wait(500);
        cy.progressBarShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Enter text 'First entry' in textfield for inline", () => {
        cy.get("[name^='first-textfield-for-inline']").arrowType("First entry");
        cy.unClick();
      });

      it("Check Checkbox option 1 ", () => {
        cy.get(`input[type="checkbox"][value="A"]`).last().check();
      });

      it("Select approver for first inline", () => {
        cy.get("[name*='fb-ia-first-inline-field'] input")
          .autocompleteSelect(`${USERS[1].name}`, { force: true });
      });

      it("Check radio button group", () => {
        cy.get(`input[type="radio"][value="11"]`).last().check();
      });

      it("Select another value for select field", () => {
        cy.get("[id^='mui-component-select-fb-select-field']").arrowClick();
        cy.get("[data-value='option2']").arrowClick();
        cy.unClick();
      });

      it("Select approver for Second inline", () => {
        cy.get("[name*='fb-ia-second-inline-field'] input")
          .autocompleteSelect(`${USERS[1].name}`, { force: true });
      });

      it("Check Checkbox option 1 ", () => {
        cy.get(`input[type="checkbox"][value="1"]`).last().check();
      });

      it("Check radio button group", () => {
        cy.get(`input[type="radio"][value="21"]`).last().check();
      });

      it("Click on Save", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Approve First Inline Approval", () => {
        cy.lhrApproveWithoutApi();
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Edit the field text field and check box", () => {
        cy.listLoadingElementShouldNotExist();
        cy.get("[name^='first-textfield-for-inline']").arrowType("First entry2");
        cy.get(`input[type="checkbox"][value="B"]`).scrollIntoView().last().check({ force: true });
        cy.progressBarShouldNotExist();
        cy.wait(3000);
      });

      it("Verify Inline Approval needs to be Approved", () => {
        cy.get("[data-cy='form.builder.request.approve']").first().should("exist");
        cy.listLoadingElementShouldNotExist().wait(2000);
      });

      it("Click on Save", () => {
        cy.drClickCreateDocumentWithoutApiCall();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Approve Second Inline Approval", () => {
        cy.inlineApprovalWithoutApi();
        cy.wait(3000);
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Select approver for  inline 3", () => {
        cy.get("[name*='fb-ia-firstd-inline-field'] input")
          .autocompleteSelect(`${USERS[1].name}`, { force: true });
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
        cy.wait(3000);
      });

      it("Checkbox option 1 checked", () => {
        cy.get(`input[type="checkbox"][value="1"]`).last().check();
      });

      it("Enter text 'First entry' in textfield for inline", () => {
        cy.get("[data-cy^='textfield-for-inline'] input").arrowType("First entry");
        cy.unClick();
      });

      it("Click on Save", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Approve 3rd Inline Approval", () => {
        cy.lhrApproveWithoutApi();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
        cy.wait(3000);
      });

      it("Navigate to Overview tab", () => {
        cy.drSelectOverviewTab();
        cy.listLoadingElementShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });


      it("Edit radio button group and checkbox", () => {
        cy.get(`input[type="checkbox"][value="2"]`).arrowClick();
        cy.get(`input[type="radio"][value="22"]`).arrowClick();
      });

      it("Click on Save", () => {
        cy.drClickCreateDocumentWithApiCall();
        cy.listLoadingElementShouldNotExist();
      });

      it("Navigate to detail tab", () => {
        cy.drSelectDetailsTab();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify inline 3 needs to approved", () => {
        cy.get("[data-cy='form.builder.request.approve']").should("exist").wait(2000);
      });

      it("Approve  Inline Approval 3", () => {
        cy.lhrApproveWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });


      it("Navigate to oveview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Approve remaining Inline Approval", () => {
        cy.lhrApproveWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(2000);
      });

      it("Approve remaining Inline Approval", () => {
        cy.lhrApproveWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(2000);
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigate to history tab", () => {
        cy.drSelectHistoryTab();
      });

      it("Click and drag the scroll bar and verify that user can scroll history tab", () => {
        cy.get("[data-cy='History-detail']").realHover().wait(2000).scrollTo("bottom", { ensureScrollable: false });
      });

      it("Send request for approval", () => {
        cy.get("[data-cy='ApproveAndRelease-button']").first().arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.get("[data-cy='AlertDialog-continueButton']").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });


      it("Revise record / update record ", () => {
        cy.get("[data-cy='updateRecord']").click();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Navigate to Overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Approval block should be displayed in the Overview tab", () => {
        cy.get("[data-cy^='fb-approvals-fb-approvals']").should("exist");
      });

      it("Select another value for select field", () => {
        cy.get("[id^='mui-component-select-fb-select-field']").arrowClick();
        cy.get("[data-value='option1']").arrowClick();
        cy.unClick();
      });

      it("Click on Save", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Fill in Approval block and  Approve and release Record", () => {
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").eq(0).autocompleteSelect(`${USERS[1].name}`);
        cy.get("[data-cy='ApproveAndRelease-button']").arrowClick();
      });
    });
  });

  context("Verify Layout After record creation WIP", () => {
    it("Navigate to Record landing Page", () => {
      cy.navigToRecords();
      cy.dlClearFilters();
    });

    it("Select the Records", () => {
      cy.dlFilterByDocId({ docId: "RD-00003" });
      cy.dlSelectFirstDocument();
    });

    it("Verify Form opens to the “Overview” tab  predefined fields up to attachments", () => {
      cy.isTabActive({ name: "overview", index: 0 });
      cy.get("[data-cy='field-name']").should("exist");
      cy.get("[data-cy='select.document.documentType.id']").should("exist");
      cy.get("#AttachmentFieldPresenter-field").should("exist");
    });

    it("Verify Predefiend Tabs Exist", () => {
      cy.verifyTabs("overview", "details");
    });

    it("Verify Tabs are fixed and order not changable", () => {
      cy.verifyFixedTab();
    });

    it("Verify that the existing fields were migrated properly and that content for both the tabs", () => {
      cy.get("[name^='fb-select-field']").should("exist");
      cy.get(`input[type="checkbox"][value="1"]`).should("be.checked");
      cy.get(`input[type="checkbox"][value="A"]`).should("exist");
      cy.get(`input[type="radio"][value="11"]`).should("exist");
      cy.get("[data-cy^='fb-ia-first-inline-field']").should("exist");
      cy.get("[data-cy^='fb-ia-second-inline-field']").should("exist");
      cy.drSelectDetailsTab();
      cy.get("[data-cy^='fb-ia-firstd-inline-field']").should("exist");
      cy.get(`input[type="checkbox"][value="1"]`).should("be.checked");
    });


    it("Approve 1st Inline Approval", () => {
      cy.lhrApproveWithoutApi();
      cy.checkToastMessage({ exists: false });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Navigate to overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Edit the field text field and check box", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[name^='first-textfield-for-inline']").arrowType("First");
      cy.get(`input[type="checkbox"][value="C"]`).scrollIntoView().last().check({ force: true });
    });

    it("Verify Inline Approval needs to be Approved", () => {
      cy.get("[data-cy='form.builder.request.approve']").first().should("exist");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist().wait(2000);
    });

    it("Approve 2nd Inline Approval", () => {
      cy.lhrApproveWithoutApi();
      cy.checkToastMessage({ exists: false });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Approve first Inline Approval", () => {
      cy.lhrApproveWithoutApi();
      cy.checkToastMessage({ exists: false });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Send request for approval", () => {
      cy.get("[data-cy='ApproveAndRelease-button']").first().arrowClick();
      cy.get("[data-cy='AlertDialog-continueButton']").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.wait(3000);
    });
  });

  context("Verify Scroll", () => {
    it("Navigate to history tab", () => {
      cy.drSelectHistoryTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Click and drag the scroll bar and verify that user can scroll history tab", () => {
      cy.get("[data-cy='History-detail']").realHover().wait(2000).scrollTo("bottom", { ensureScrollable: false });
    });
  });

  context("Verify Layout for relesed Record", () => {
    it("Navigate to Record landing Page", () => {
      cy.navigToRecords();
      cy.dlClearFilters();
    });

    it("Select the Records", () => {
      cy.dlFilterByDocId({ docId: "RD-00004" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevPreview], () => {
        cy.get("tr.k-master-row").last().arrowClick();
      });
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Verify Overview Tab and Predefined fields", () => {
      cy.isTabActive({ name: "overview", index: 0 });
      cy.contains("Attachments").should("exist");
    });

    it("Verify that the existing fields were migrated properly and that content for both the tabs", () => {
      cy.get("[name^='fb-select-field']").should("have.attr", "value", "option2");
      cy.get(`input[type="checkbox"][value="1"]`).should("be.checked");
      cy.get("[name^='first-textfield-for-inline']").should("exist");
      cy.drSelectDetailsTab();
      cy.get("[data-cy='Textfield for inline']").should("exist");
      cy.get(`input[type="checkbox"][value="1"]`).should("be.checked");
    });

    it("Verify Predefiend Tabs Exist", () => {
      cy.get("[data-cy='tabId.overview']").should("exist");
      cy.get("[data-cy='tabId.details']").should("exist");
    });

    it("Verify Tabs are fixed and order not changable", () => {
      cy.verifyFixedTab();
    });
  });
});

export { };


