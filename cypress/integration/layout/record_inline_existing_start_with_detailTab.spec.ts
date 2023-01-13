// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { RecordOne } from "../../utils/constants/documentTypes/record";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let RDdocumentType;

context("Record inline existing Flow with detail ", () => {
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

    context("Fill in document attributes", () => {
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

      it("Create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Verify Predefiend Tabs Exist", () => {
        cy.verifyTabs("overview", "details");
      });

      it("Verify Tabs are fixed and order not changable", () => {
        cy.verifyFixedTab();
      });

      it("Verify Predefiend fields up to attachment", () => {
        cy.verifyPredefiendFields();
        cy.get("[data-cy='attachment']").should("exist");
      });

      it("Verify Overview Tab Selected by default", () => {
        cy.isTabActive({ name: "overview", index: 0 });
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
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
        cy.listLoadingElementShouldNotExist().wait(2000);
      });

      it("Add inline approval1", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
        cy.fbEnterNameValue({ name: "label", value: "firstd Inline field" });
        cy.fbAddApproverToInlineDialog({ approverName: USERS[1].name });
        cy.fbAddApproverToInlineDialog({ approverName: USERS[2].name });
        cy.get("[data-cy='editorConfig.groups']").autocompleteSelect("Everyone");
        cy.fbAddNewFieldButton();
      });

      it("Add select field", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
        cy.fbEnterNameValue({ name: "label", value: "fb-select-field" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbAddNewFieldButton();
      });

      it("Add radio button field", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
        cy.fbEnterNameValue({ name: "label", value: "Radio group for inline" });
        cy.fbGroupOptions("R1", "R2");
        cy.fbAddNewFieldButton();
      });

      it("Add inline approval2", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
        cy.fbEnterNameValue({ name: "label", value: "Second inline field" });
        cy.fbAddApproverToInlineDialog({ approverName: USERS[1].name });
        cy.get("[data-cy='editorConfig.groups']").autocompleteSelect("Everyone");
        cy.fbAddNewFieldButton();
      });
    });

    context("Create document", () => {
      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCall();
        cy.landingPageLoadingElementShouldNotExist();
      });
    });

    context("Release document", () => {
      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create record and Relesed it", () => {
    it("Navigate to records", () => {
      cy.navigToRecords();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click on create new and chose 'Record one'", () => {
      cy.recCreateRecordFromLandingPage();
      cy.recSelectRecordFormFromMultiSelect({ recordType: "Record one" });
    });

    it("Verify Tabs overview and details Exist", () => {
      cy.verifyTabs("overview", "details");
    });

    it("Verify Form opens to the “Overview” tab by default ", () => {
      cy.isTabActive({ name: "overview", index: 0 });
      cy.get("[data-cy='tabCon-tabId.details']").should("have.attr", "aria-selected", "false");
    });

    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    context("Verify added fields in the tabs", () => {
      it("Verify text field'", () => {
        cy.get("[data-cy^='textfield-for-inline']").should("exist");
      });

      it("Verify check box exist'", () => {
        cy.get(`input[type="checkbox"][value="1"]`).should("exist");
      });

      it("Verify Inline approval'", () => {
        cy.get("[name^='fb-ia-firstd-inline-field']").should("exist");
      });

      it("Verify Select field'", () => {
        cy.get("[name^='fb-select-field']").should("exist");
      });

      it("Verify radio inputs", () => {
        cy.get("[name^='radio-group-for-inline'][value='R1']").should("exist");
        cy.get("[name^='radio-group-for-inline'][value='R2']").should("exist");
      });

      it("Verify Inline Approval Inputs'", () => {
        cy.get("[name^='fb-ia-firstd-inline-field'] input").should("exist");
        cy.get("[name^='fb-ia-second-inline-field'] input").should("exist");
      });
    });

    context("Fill in document attributes", () => {
      it("Navigate to overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Enter title 'Record Document Revision'", () => {
        cy.drEnterDocumentTitle({ name: "Record Document Revision" });
        cy.unClick();
      });

      it("Upload attachment 'image.jpg'", () => {
        cy.get("#attachments-button-file").attachFile("image.jpg");
        cy.get("[data-cy='AttachmentFieldPresenter-field']").click().wait(500);
        cy.progressBarShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Navigate to details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Check Checkbox option 1 ", () => {
        cy.get(`input[type="checkbox"][value="1"]`).last().check();
      });

      it("Enter text 'First entry' in textfield for inline", () => {
        cy.get("[name^='textfield-for-inline']").arrowType("First entry");
      });

      it("Select option2 for select field ", () => {
        cy.get("[id^='mui-component-select-fb-select-field']").arrowClick();
        cy.get("[data-value='option2']").arrowClick();
      });

      it("Check radio option R1 ", () => {
        cy.get(`input[type="radio"][value="R1"]`).last().check();
      });

      it("Select approver for first inline", () => {
        cy.get("[name*='fb-ia-firstd-inline-field'] input")
          .autocompleteSelect(`${USERS[1].name}`, { force: true });
      });

      it("Select approver for Second inline", () => {
        cy.get("[name*='fb-ia-second-inline-field'] input")
          .autocompleteSelect(`${USERS[1].name}`, { force: true });
      });

      it("Click on Save", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve First Inline Approval", () => {
        cy.lhrApproveWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist().wait(2000);
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
        cy.listLoadingElementShouldNotExist();
      });

      it("Change text to 'Second entry' in textfield for inline", () => {
        cy.get("[name^='textfield-for-inline']").clear().arrowType("Second entry");
      });

      it("Check Checkbox option 2 ", () => {
        cy.get(`input[type="checkbox"][value="1"]`).arrowClick();
        cy.get(`input[type="checkbox"][value="2"]`).arrowClick();
      });

      it("Click on Save", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify Inline Approval needs to be Approved", () => {
        cy.get("[data-cy='form.builder.request.approve']").first().should("exist");
      });


      it("Approve first Inline Approval", () => {
        cy.drSelectDetailsTab().wait(2000);
        cy.lhrApproveWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Navigate to detail tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Approve all the Inlines", () => {
        cy.lhrApproveWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Send request for approval", () => {
        cy.get("[data-cy='ApproveAndRelease-button']").first().arrowClick();
        cy.progressBarShouldNotExist();
        cy.get("[data-cy='AlertDialog-continueButton']").arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
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

      it("Navigate to history tab", () => {
        cy.drSelectHistoryTab();
      });

      it("Click and drag the scroll bar and verify that user can scroll history tab", () => {
        cy.get("[data-cy='History-detail']").realHover().wait(2000).scrollTo("bottom", { ensureScrollable: false });
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Fill in Approval block", () => {
        cy.get("[data-cy^='fb-approvals-fb-approvals-']").eq(0).autocompleteSelect(`${USERS[1].name}`);
        cy.listLoadingElementShouldNotExist();
      });

      it("Click on Save", () => {
        cy.drClickCreateDocumentWithoutApiCall();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve and release Record", () => {
        cy.get("[data-cy='ApproveAndRelease-button']").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve and Release", () => {
        cy.lhrApproveWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });
  });
});

export { };


