// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import "moment-timezone";
import moment from "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
let clinicalProtocolDocumentType;
let group;
// let releasedFormId;
// let emailsFromInbox;
// const pages = ["", "", ""];
// let downloadUrl;
// let tmpRegex;
// let downloadFile;
// let dateAfterEmailShouldArrive;
// let fileId;

// const dateOffset = (5 * 1000);
// const footerDate = moment().tz("America/Los_Angeles").format("D MMM YYYY");
// const docRelDate = moment().tz("America/Los_Angeles").format("D MMM YYYY");
const documentRevisionName = "New document for testing AR";
const approvalRequestTitle = "Approval request from newly created form";
const approvalRequestFormName = "New Approval request form template";

context("Approval request form", () => {
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
      SystemRequirement("REQ-0400", "REQ-0420", "REQ-0440");
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
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
            documentTypes: [
              ClinicalProtocolDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response: any) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          clinicalProtocolDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Clinical Protocol");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response: any) => {
        loginResponse = response;
        done();
      });
    });

    xit("[API]Creates document revision for approval", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Test Doc Rev Description</p>",
            document: {
              docId: "CP-00004",
              documentType: {
                id: clinicalProtocolDocumentType[0].id,
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
            name: documentRevisionName,
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,

          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => {
          done();
        });
      });
    });

    xit("[API]Creates another document revision for approval", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Test Doc Rev Description 2 </p>",
            document: {
              docId: "CP-00005",
              documentType: {
                id: clinicalProtocolDocumentType[0].id,
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
            name: documentRevisionName,
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,

          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => {
          done();
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });
  });

  context("Create new AR form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Approval request form template'", () => {
      cy.drEnterDocumentTitle({ name: approvalRequestFormName });
    });

    it("Enter description 'New form template for approval request'", () => {
      cy.drEnterDocumentDescription({ description: "New form template for approval request" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Approval request' outputdocument type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Approval Request" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Upload logo picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Navigate to Document tab", () => {
      cy.drSelectDocumentTab();
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewField();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
      cy.fbGroupOptions("1", "2", "3");
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("[data-cy=\"fb-control-required\"]").arrowClick();
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Give label to 'Text Field' as 'TEXT FIELD'`, () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "TEXT FIELD" });
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("input[value^=\"visibility\"]").check();
      cy.get(`input[name="validators.required_if_in"]`).check();
      cy.get(`[data-cy="validators.required_if_in.name"]`).autocompleteSelect("Checkbox" );
      cy.get(`input[type="checkbox"][value="3"]`).first().check();
      cy.get("button[data-cy=\"fb-editor-actions-add\"]").first().contains("Add").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
      // cy.pause();
    });


  });

  context("Verify `Approval request form`", () => {

    it("Verify Form for Approval request has two tabs Change Details and Documents", () => {
      cy.get("[data-cy=\"tabId.changedetails\"]").should("exist");
      cy.get("[data-cy=\"tabId.documents\"]").should("exist");
    });

    context("Verify that Change details tab should be opened by default and that contains`", () => {

      it("predefine schema fields except Approval request details", () => {
        cy.verifyPredefiendFields();
      });

      it("Verify FB fields added to AR form ", () => {
        cy.get("[id=\"change-request-details\"]").should("exist");
        cy.get("[data-cy=\"fb.add.document\"]").should("exist");

      });

      it("Verify that Form Options should appear on the Change Details Tab", () => {
        cy.get(".formOptionsBox").should("exist");
      });

    });


    context("Verify that predefined fields for Document tab`", () => {

      it("Navigate to document tab", () => {
        cy.drSelectDocumentTab();
      });

      it("Verify that predefined fields for Document tab is only Approval request details", () => {
        cy.get("[data-cy=\"fb.add.document\"]").should("exist");
      });

      it("Verify FB fields added to AR form ", () => {
        cy.get("[name^=checkbox]").should("exist");
        cy.get("[data-cy^=text-field-]").should("exist");
      });

      it("Verify that Form Options should appear on the Change Details Tab", () => {
        cy.get(".formOptionsBox").should("exist");
      });

      it("predefine schema fields for approvals (Approval Block)", () => {
        cy.get("[data-cy=\"fb.add.document\"]").should("exist");
      });

      it("Verify Click Documents Tab, clicking on it should open that tab and close the other one", () => {
        cy.get("[data-cy=\"tabCon-tabId.changedetails\"]").should("have.attr", "aria-selected", "false");
        cy.get("#sm-tabpanel-0").should("be.hidden");
        cy.get("[data-cy=\"tabCon-tabId.documents\"]").should("have.attr", "aria-selected", "true");
      });

      it("Verify that right side panel opens by default to the References tab", () => {
        cy.get("[data-cy=\"References\"]").should("exist");
        cy.get("[data-cy=\"generalInfo\"]").should("be.visible");
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });


  });


  context("Create approval request with newly created form", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Click Create a Approval Request button", () => {
      cy.arClickCreateAnAR();
    });

    it("Choose newly AR Form template", () => {
      cy.arSelectARForm({ formTitle: approvalRequestFormName });
    });

    it("Enter title AR title: " + approvalRequestTitle, () => {
      cy.arEnterApprovalRequestTitle({ title: approvalRequestTitle });
    });


    it("Enter description 'AR from New form template for approval request'", () => {
      // cy.pause();
      cy.get("[data-cy=\"field-description\"]").click();
      cy.get("[data-cy=\"field-description\"]").arrowType("AR from New form template for approval request").wait(2000);
      cy.unClick();
    });

    xit("Add created document revision", () => {
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: "CP-00004" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Checkbox option 2 checked", () => {
      cy.get(`input[type="checkbox"][value="1"]`).last().check();
    });

    it("Click Create Approval Request", () => {
      cy.arClickCreateApprovalRequestAfterCompletingForm();
    });

    it("Add first Approver'", () => {
      cy.arAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Click on Save", () => {
      cy.arSaveApiCall();
    });
  });

  xcontext("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });
    it("Selects company", () => {
      cy.cmpSelectCompany({ name: "White Willms, Bartell and Boehm 7330", multiple: true });
    });
  });

  xcontext("Verify description field", () => {
    it("Verify DescriptionToolBar", () => {
      cy.drVerifyDescriptionToolBar();
    });

    it("Enter a 1 line description", () => {
      cy.drEnterDocumentDescription({
        description: "This is description test to check length. Checking length of characters and lines.",
      });
      cy.unClick();
      cy.get("[data-cy=\"description\"] button").should("not.exist");
      cy.get("[data-cy=\"description\"]").first().scrollIntoView({ ensureScrollable: false });
    });

    it("Add 2nd line description", () => {
      cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
      cy.get(`[data-cy="description"] [contenteditable]`)
        .first()
        .arrowType(
          "{moveToEnd}{enter}This is description test to check length. Checking length of characters and lines."
        );
      cy.unClick();
      cy.get("[data-cy=\"description\"] button").should("not.exist");
      cy.get("[data-cy=\"description\"]").first().scrollIntoView({ ensureScrollable: false });
    });

    it("Add 3rd line description", () => {
      cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
      cy.get(`[data-cy="description"] [contenteditable]`)
        .first()
        .arrowType("{moveToEnd}{enter}This is description test to check length.");
      cy.unClick();
      cy.get("[data-cy=\"description\"] button").should("exist");
      cy.get("[data-cy=\"description\"]").first().scrollIntoView({ ensureScrollable: false });
    });

    it("Enter a description longer than 3 lines and over 245 characters", () => {
      cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
      cy.get(`[data-cy="description"] [contenteditable]`)
        .first()
        .arrowType("{moveToEnd}{enter}Checking length of characters and lines ends here.");
      cy.unClick();
      cy.get(`[data-cy="description"] [contenteditable]`).first().scrollIntoView({ ensureScrollable: false });
      cy.unClick();
    });

    it("Click on view less description should be collapsed", () => {
      cy.get("div[class^=\"rdw-editor-toolbar\"]").should("not.exist");
    });

    it("Click on view more description should be expanded", () => {
      cy.get("[data-cy=\"description\"] button").arrowClick();
      cy.get("div[class^=\"rdw-editor-toolbar\"]").should("be.visible");
    });


  });

  context("Validate Right Side Panel", () => {

    it("Verify It is expanded and collpased", () => {
      cy.verifyExpandCollpase();
    });

    it("Verify Reference tab Info", () => {
      cy.verifyReferenceTab({ user: USERS[2], formId: "", shortName: "HB" });
    });

    it("Verify Reference Info form Info, Created Info", () => {
      cy.get("[data-cy='common.revision']").should("contain.text", "Revision");
      cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00002");
      cy.get("[data-cy='common.revision']").parent().should("contain.text",
        moment().tz("America/Los_Angeles").format("YYYY.MM.DD"));
      cy.get("[data-cy='References-detail']").should("contain.text",
        moment().tz("America/Los_Angeles").format("MM/DD/YYYY"));
    });

    context("Check document history", () => {
      const history = [
        {
          owner: USERS[2].name,
          actions: [
            { key: "Approver Added", value: `${USERS[1].name}` },
          ],
        },
      ];
      it("Verify Doc history", () => {
        cy.drSelectHistoryTab();
      });
      history.forEach((element, groupIndex) => {
        it(`Check owner name for group ${groupIndex + 1}`, () => {
          cy.get(`[data-cy="audit-owner-${groupIndex}"]`).should("have.text", element.owner);
        });
      });
    });

    context("Verify Book Mark", () => {
      it("Verify Book Mark Navigation", () => {
        cy.get("[data-cy=\"bookmark-icon\"]").arrowClick();
        cy.get("[data-cy=\"Bookmarks-detail\"]").should("be.visible");
      });
    });

  });

  context("Tabs verification", () => {

    xit("Verify all tabs are displayed in tabs Change Details and Documents", () => {
      cy.get("[data-cy=\"tabId.changedetails\"]").should("exist");
      cy.get("[data-cy=\"tabId.documents\"]").should("exist");
    });

    xit("Verify Hover over the history panel in overview tab", () => {
      cy.get(".formOptionsBox").should("be.visible");
    });

    xit("Verify that Form Options should appear on the Change Details Tab", () => {
      cy.get(".formOptionsBox").should("be.visible");
    });

    xit("Verify that scroll bar appearing only on hover", () => {
      cy.get("[data-cy=\"description\"]").first().scrollIntoView({ ensureScrollable: true });
    });

    xit("Training Required is unchecked, there should be no Training Tab", () => {
      cy.get("[data-cy=\"field-retrain\"] input[type=checkbox]").should("not.be.checked");
      cy.get("[data-cy=\"tabId.training\"]").should("not.exist");
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

  });


  context("Verify Created AR request layout", () => {
    it("Navigate to Receivable", () => {
      // cy.navigToDocumentList();
      cy.navigToApprovalRequestList();
      cy.dlClearFilters();
    });

    it("Select the Records", () => {
      cy.dlFilterByDocId({ docId: "AR-00002" });
      cy.dlSelectFirstDocument();
    });
  });

  xcontext("Verify description field", () => {
    it("Verify DescriptionToolBar", () => {
      cy.drVerifyDescriptionToolBar();
    });

    it("Enter a 1 line description", () => {
      cy.drEnterDocumentDescription({
        description: "This is description test to check length. Checking length of characters and lines.",
      });
      cy.unClick();
      cy.get("[data-cy=\"description\"] button").should("not.exist");
      cy.get("[data-cy=\"description\"]").first().scrollIntoView({ ensureScrollable: false });
    });

    it("Add 2nd line description", () => {
      cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
      cy.get(`[data-cy="description"] [contenteditable]`)
        .first()
        .arrowType(
          "{moveToEnd}{enter}This is description test to check length. Checking length of characters and lines."
        );
      cy.unClick();
      cy.get("[data-cy=\"description\"] button").should("not.exist");
      cy.get("[data-cy=\"description\"]").first().scrollIntoView({ ensureScrollable: false });
    });

    it("Add 3rd line description", () => {
      cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
      cy.get(`[data-cy="description"] [contenteditable]`)
        .first()
        .arrowType("{moveToEnd}{enter}This is description test to check length.");
      cy.unClick();
      cy.get("[data-cy=\"description\"] button").should("exist");
      cy.get("[data-cy=\"description\"]").first().scrollIntoView({ ensureScrollable: false });
    });

    it("Enter a description longer than 3 lines and over 245 characters", () => {
      cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
      cy.get(`[data-cy="description"] [contenteditable]`)
        .first()
        .arrowType("{moveToEnd}{enter}Checking length of characters and lines ends here.");
      cy.unClick();
      cy.get(`[data-cy="description"] [contenteditable]`).first().scrollIntoView({ ensureScrollable: false });
      cy.unClick();
    });

    it("Click on view less description should be collapsed", () => {
      cy.get("div[class^=\"rdw-editor-toolbar\"]").should("not.exist");
    });

    it("Click on view more description should be expanded", () => {
      cy.get("[data-cy=\"description\"] button").arrowClick();
      cy.get("div[class^=\"rdw-editor-toolbar\"]").should("be.visible");
    });


  });

  xcontext("Verify Layout for created receiving record in draft state", () => {


    xit("Verify that two tabs are displayed, Change Reqest, Documents", () => {
      // cy.pause();
      cy.get("[data-cy=\"tabId.changedetails\"]").should("exist");
      cy.get("[data-cy=\"tabId.documents\"]").should("exist");
    });

    xit("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      cy.drVerifytabIsFixed();
    });

    xit("Verify Form opens to the “Change Details” tab by default", () => {
      cy.get("[data-cy=\"tabCon-tabId.changedetails\"]").should("have.attr", "aria-selected", "true");
    });

    xit("Verify Predefined Fields for change detail tab", () => {
      cy.verifyPredefiendFields();

    });

    it("Verify form Options should present in Tab", () => {
      cy.get(".formOptionsBox").should("exist");
    });

    xit("Verify Predefiend fields and form Options", () => {
      cy.get(".formOptionsBox").should("not.exist");
    });

    xit("Navigate to details Tab", () => {
      cy.drSelectDetailsTab();
    });

    // it("Select Purchase order", () => {
    //   cy.get("[data-cy=\"porec-receivable-test\"]").arrowClick({ force: true })
    //     .autocompleteSelect("POT-00001 - rev 1 - PO for receiving");
    // });

    // it("Save the  form", () => {
    //   cy.drClickCreateDocumentWithoutApiCall();
    //   cy.wait(2000);
    // });

    xit("Verify Fields in Detail Tab PO Receivable, supplier,Requestor,Receiving table", () => {
      cy.get("[data-cy=\"porec-receivable-test\"]").should("exist");
      cy.get("[data-cy=\"po-requestor-autocomplete\"]").should("exist");
      cy.get("[data-cy=\"po-supplier-built-in\"]").should("exist");
    });

    it("Verify form option visible in detail tab", () => {
      cy.get(".formOptionsBox").should("exist");
    });

    it("Clicking on details Tab other tabs should be closed and details tab should open", () => {
      cy.get("[data-cy=\"tabCon-tabId.overview\"]").should("have.attr", "aria-selected", "false");
      cy.get("#sm-tabpanel-0").should("be.hidden");
      cy.get("[data-cy=\"tabCon-tabId.details\"]").should("have.attr", "aria-selected", "true");
    });

    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy=\"References\"]").should("exist");
      cy.get("[data-cy=\"generalInfo\"]").should("be.visible");
    });

    it("Verify that right side panel Expand and collapse", () => {
      cy.verifyExpandCollpase();
    });

  });

  context("Validate Right Side Panel", () => {

    it("Verify Reference tab Info", () => {
      // cy.pause();
      cy.verifyReferenceTab({ user: USERS[2], formId: "", shortName: "HB" });
    });


    it("Verify Referenced By, Training ,and Release date Item exist or not", () => {
      // cy.verifyReferenceInfo();
      cy.get("[data-cy='common.revision']").should("contain.text", "Revision");
      cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00002");
      cy.get("[data-cy='common.revision']").parent().should("contain.text",
        moment().tz("America/Los_Angeles").format("YYYY.MM.DD"));
    });

    xcontext("Verify Revision", () => {
      it("open revision tab", () => {
        cy.get("[data-cy=\"note-icon\"]").arrowClick();
      });

      it("Verify revision Rev Document open or not", () => {
        cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(0).arrowClick();
        cy.wait(2000);
        cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev A");

      });
    });

    xcontext("Verify User able to add Groups or other user permissions", () => {
      it("Open permissions tab", () => {
        cy.drSelectPermissionTab();
        // cy.pause();
      });

      it("Add another user permission", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
          cy.drAddUserFromPermissionTab(USERS[4].name);
        });
      });

      it("Add another group permission", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
          cy.drAddGroupFromPermissionTab("Can be approver");
        });
      });

    });

    context("Check document history", () => {
      const history = [
        {
          owner: USERS[2].name,
          actions: [
            { key: "Approver Added", value: `${USERS[1].name}` },
          ],
        },
      ];
      it("Verify Doc history", () => {
        cy.drSelectHistoryTab();
      });
      history.forEach((element, groupIndex) => {
        it(`Check owner name for group ${groupIndex + 1}`, () => {
          cy.get(`[data-cy="audit-owner-${groupIndex}"]`).should("have.text", element.owner);
        });
      });
    });


    xcontext("Verify Revision History", () => {
      it.skip("Verify Revision History Items", () => {
        cy.get("[data-cy='note-icon']").arrowClick();
        cy.get("[data-cy='common.docId']").should("contain.text", "RD-00003");
        cy.get("[data-cy='common.docId']>div").should("contain.text", "");
        cy.get("[data-cy='common.docId']>div>div").should("contain.text", USERS[2].name);
        cy.get("[data-cy='common.docId']>div>div>").should("contain.text", "Effective Date");
      });
    });

    context("Verify Book Mark", () => {
      it("Verify Book Mark Navigation", () => {
        cy.get("[data-cy=\"bookmark-icon\"]").arrowClick();
        cy.get("[data-cy=\"Bookmarks-detail\"]").should("be.visible");
      });
    });


  });

});

export { };
