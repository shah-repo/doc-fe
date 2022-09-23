// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { verifyHistoryContent } from "../../utils/context/historyContent";
import { CyRoutes } from "./../../support/routes";

let createdCompany;
let loginResponse;
let developersGroup;
let adminEmployee;
const scriptData = {
  formId: "FM-00003",
  secondformId: "AAD-01000",
};

context("AA Document Layout verification", () => {
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

    it("[API]Get group Developers", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
        done();
      });
    });

    it("[API]Patch group Developers", () => {
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
    it("Logs user in", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Add new Doc Type", () => {
    it("Navigate to document type management", () => {
      cy.navigToDocumentTypeManagement();
    });

    it("Click on 'Add Document Type'", () => {
      cy.dtmClickAddDocumentType();
    });

    it("Add Document type name", () => {
      cy.dtmAddDocType({ docType: "AA Document" });
    });

    it("Add Acronym", () => {
      cy.dtmAddAcronym({ acronym: "AAD-" });
    });

    it("Check Private Number checkbox", () => {
      cy.dtmSelectPrivateNumber();
    });

    it("Check Redline checkbox", () => {
      cy.dtmSelectRedline();
    });

    it("Check QMS checkbox", () => {
      cy.dtmSelectQMS();
    });

    it("Check Needs Signature checkbox", () => {
      cy.dtmSelectNeedsSignature();
    });

    it("Check Training checkbox", () => {
      cy.dtmSelectTraining();
      cy.get("[class='k-grid-content k-virtual-content']").scrollTo("center").wait(1000);
    });

    it("Add Starting Number", () => {
      cy.dtmAddStartingNumber({ startingNumber: "000" });
    });

    it("Select Revision Stage 'Numeric'", () => {
      cy.dtmSelectRevisionStage({ revisionStage: "Numeric" });
    });

    it("Select Users Without Tags 'DOCUMENT_TYPE_MANAGEMENT'", () => {
      cy.dtmSelectUsersWithoutTags({ usersWithoutTags: "DOCUMENT_TYPE_MANAGEMENT" });
    });

    it("Select Group 'OTHER'", () => {
      cy.get("[class='k-grid-content k-virtual-content']").scrollTo("right").wait(1000);
      cy.dtmSelectGroup({ group: "OTHER" });
    });

    it("Create Doc Type", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.GetDocumentTypes, () => {
        cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(0).arrowClick();
      });
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Create AA Document form for migration", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'AA Document type", () => {
      cy.drEnterDocumentTitle({ name: "Form migration AA Document Type Title" });
    });

    it("Enter document description 'AA document description'", () => {
      cy.drEnterDocumentDescription({ description: "AA document description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Aa Document' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "AA Document" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });


  });

  context("Add FB text field ", () => {
    it("Add textfield", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "Textfield for inline" });
      cy.fbAddNewFieldButton();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Approve and release FORM document", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create AA Document form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'AA Document type", () => {
      cy.drEnterDocumentTitle({ name: "AA Document Type Title" });
    });

    it("Enter document description 'AA document description'", () => {
      cy.drEnterDocumentDescription({ description: "AA document description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Checked traing checkbox", () => {
      cy.drClickTrainingRequired();
    });

    it("Select 'Aa Document' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "AA Document" });
      cy.unClick();
    });

    it(`Verify DOC ID ${scriptData.formId}`, () => {
      cy.drCheckIfDocumentIdMatches({ docId: scriptData.formId });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });


  context("Verify description field", () => {
    it("Verify DescriptionToolBar", () => {
      cy.verifyDescriptionToolbar();
    });

    it("Enter a 1 line description", () => {
      cy.drEnterDocumentDescription({
        description: "This is description test to check length. Checking length of characters and lines.",
      });
      cy.unClick();
      cy.get("[data-cy='description'] button").should("not.exist");
      cy.get("[data-cy='description']").first().scrollIntoView({ ensureScrollable: false });
    });

    it("Add 2nd line description", () => {
      cy.get("[data-cy='description']").first().arrowClick().wait(1000);
      cy.get(`[data-cy="description"] [contenteditable]`)
        .first()
        .arrowType(
          "{moveToEnd}{enter}This is description test to check length. Checking length of characters and lines."
        );
      cy.unClick();
      cy.get("[data-cy='description'] button").should("not.exist");
      cy.get("[data-cy='description']").first().scrollIntoView({ ensureScrollable: false });
    });

    it("Add 3rd line description", () => {
      cy.get("[data-cy='description']").first().arrowClick().wait(1000);
      cy.get(`[data-cy="description"] [contenteditable]`)
        .first()
        .arrowType("{moveToEnd}{enter}This is description test to check length.");
      cy.unClick();
      cy.get("[data-cy='description'] button").should("exist");
      cy.get("[data-cy='description']").first().scrollIntoView({ ensureScrollable: false });
    });

    it("Enter a description longer than 3 lines and over 245 characters", () => {
      cy.get("[data-cy='description']").first().arrowClick().wait(1000);
      cy.get(`[data-cy="description"] [contenteditable]`)
        .first()
        .arrowType("{moveToEnd}{enter}Checking length of characters and lines ends here.");
      cy.unClick();
      cy.get(`[data-cy="description"] [contenteditable]`).first().scrollIntoView({ ensureScrollable: false });
      cy.unClick();
    });

    it("Click on view more description should be expanded", () => {
      cy.get("[data-cy='description'] button").arrowClick();
      cy.get("div[class^='rdw-editor-toolbar']").should("exist");
    });

    it("Click on view less description should be collapsed", () => {
      cy.get("[data-cy='description'] button").arrowClick();
      cy.get("[data-cy='description'] .rdw-editor-toolbar").should("not.exist");
    });
  });

  context("Verify Document content and Tabs", () => {
    it("Verify there are two tabs Overview and Training tab", () => {
      cy.verifyTabs("overview", "training");
    });

    it("Verify form option box exist", () => {
      cy.get(".formOptionsBox").should("exist");
    });

    it("Verify Add field button", () => {
      cy.get("[data-cy='form.builder.add.field']").should("exist");
    });

    it("Checks if document revision is 'Numeric' by default", () => {
      cy.get("[data-cy='common.Numeric'] input").should("be.checked");
    });

    it("'Training Required' should be checked initially", () => {
      cy.drIsTrainingRequired({ shouldBe: true });
    });

    it("Add textfield", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "Textfield for inline" });
      cy.fbAddNewFieldButton();
    });

    it("Add checkbox group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "CheckboxGroup for inline" });
      cy.fbGroupOptions("Red", "Green", "Blue");
      cy.fbAddField();
    });

    it("Add radio button group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
      cy.fbEnterNameValue({ name: "label", value: "RadioBtnGroup for inline" });
      cy.fbGroupOptions("One", "Two", "Three");
      cy.fbAddField();
    });

    it("Verify Added fields in overview tab ", () => {
      cy.get("[data-cy='AttachmentFieldPresenter-field']").should("exist");
      cy.get("[data-cy^='textfield-for-inline']").should("exist");
      cy.get("[name^='checkbox-group-for-inline']").should("exist");
      cy.get("[data-cy='RadioBtnGroup for inline']").should("exist");

    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Verify row with the Tabs is fixed, and that user should not be able to add/edit new Tabs", () => {
      cy.verifyFixedTab();
    });

    it("Click Training Tab, clicking on it should open that tab and close the other one", () => {
      cy.drSelectTrainingTab();
      cy.get("[data-cy='tabCon-tabId.training']").should("have.attr", "aria-selected", "true");
      cy.get("#sm-tabpanel-0").should("be.hidden");
      cy.get("[data-cy='tabCon-tabId.overview']").should("have.attr", "aria-selected", "false");
    });

    it("Add field button should not be displayed in Training tab", () => {
      cy.get("[data-cy='form.builder.add.field']").should("not.exist");
    });

    it("Verify The top left of the page displays: Icon and document type, Doc ID, Rev stage, status (Draft)", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.DRAFT,
        title: "Document List",
        docId: scriptData.formId,
        revision: "Rev 1",
      });
    });

    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy='References']").should("exist");
      cy.get("[data-cy='generalInfo']").should("be.visible");
    });

    it("Verify that scroll bar appearing only on hover", () => {
      cy.get("[data-cy='timeline-icon']").realHover();
    });

    it("Approve and release FORM document", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    it("Check for training text inside dialog box and complete training", () => {
      cy.get("#root").should("contain.text", "Click here to acknowledge training completion");
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PostCompleteTraining], () => {
          cy.get("[data-cy=training-complete]").click();
          cy.get("form>div").should("contain.text", "TRN ID");
          cy.get("form>div").should("contain.text", "Doc ID Rev");
          cy.get("form>div").should("contain.text", "Title");
          cy.get("form>div").should("contain.text", "I acknowledge I am trained on");
          cy.get("[data-cy='training.acknowladge.password']").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
          cy.get("[data-cy='passwordConfirm']").arrowClick();
        });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });
  });


  context("Verify Scroll", () => {
    it("Navigate to history tab", () => {
      cy.get("[data-cy='timeline-icon']").arrowClick();
    });

    it("Click and drag the scroll bar and verify that user can scroll history tab", () => {
      cy.get("[data-cy='History-detail']").realHover().wait(2000).scrollTo("bottom");
    });
  });


  context("Verify Create New Document from Release Document", () => {
    it("Click 'Create New' and AA Document Document should be created", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter the title", () => {
      cy.drEnterDocumentTitle({ name: "AA Title" });
    });

    it("Verify that Training required is checked ", () => {
      cy.drIsTrainingRequired({ shouldBe: true });
    });

    it("The top left of the page displays: Icon and document type, Doc ID, Rev stage, status (Draft)", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Verify there are two tabs Overview and Training tab", () => {
      cy.verifyTabs("overview", "training");
    });

    it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      cy.verifyFixedTab();
    });

    it("Verify AAD opens to the “Overview” tab by default and should show all the default fields up to Attachments ",
      () => {
        cy.get("[data-cy='tabId.overview']").should("exist");
        cy.get("[data-cy='AttachmentFieldPresenter-field']").should("exist");
      });

    it("Verify that Form Options should appear on the Overview tab", () => {
      cy.get(".formOptionsBox").should("exist");
    });

    it("Enter value in text field", () => {
      cy.get("[data-cy^='textfield-for-inline'] input").arrowType("test input");
    });

    context("Verify description field", () => {
      it("Verify DescriptionToolBar", () => {
        cy.verifyDescriptionToolbar();
      });

      it("Enter a 1 line description", () => {
        cy.drEnterDocumentDescription({
          description: "This is description test to check length. Checking length of characters and lines.",
        });
        cy.unClick();
        cy.get("[data-cy='description'] button").should("not.exist");
        cy.get("[data-cy='description']").first().scrollIntoView({ ensureScrollable: false });
      });

      it("Add 2nd line description", () => {
        cy.get("[data-cy='description']").first().arrowClick().wait(1000);
        cy.get(`[data-cy="description"] [contenteditable]`)
          .first()
          .arrowType(
            "{moveToEnd}{enter}This is description test to check length. Checking length of characters and lines."
          );
        cy.unClick();
        cy.get("[data-cy='description'] button").should("not.exist");
        cy.get("[data-cy='description']").first().scrollIntoView({ ensureScrollable: false });
      });

      it("Add 3rd line description", () => {
        cy.get("[data-cy='description']").first().arrowClick().wait(1000);
        cy.get(`[data-cy="description"] [contenteditable]`)
          .first()
          .arrowType("{moveToEnd}{enter}This is description test to check length.");
        cy.unClick();
        cy.get("[data-cy='description'] button").should("exist");
        cy.get("[data-cy='description']").first().scrollIntoView({ ensureScrollable: false });
      });

      it("Enter a description longer than 3 lines and over 245 characters", () => {
        cy.get("[data-cy='description']").first().arrowClick().wait(1000);
        cy.get(`[data-cy="description"] [contenteditable]`)
          .first()
          .arrowType("{moveToEnd}{enter}Checking length of characters and lines ends here.");
        cy.unClick();
        cy.get(`[data-cy="description"] [contenteditable]`).first().scrollIntoView({ ensureScrollable: false });
        cy.unClick();
      });

      it("Click on view more description should be expanded", () => {
        cy.get("[data-cy='description'] button").arrowClick();
        cy.get("div[class^='rdw-editor-toolbar']").should("exist");
      });

      it("Click on view less description should be collapsed", () => {
        cy.get("[data-cy='description'] button").arrowClick();
        cy.get("[data-cy='description'] .rdw-editor-toolbar").should("not.exist");
      });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Verify Created New Document from Release Document", () => {
    it("verify Click Training Tab, clicking on it should open that tab and close the other one", () => {
      cy.drSelectTrainingTab();
      cy.get("[data-cy='tabCon-tabId.overview']").should("have.attr", "aria-selected", "false");
      cy.get("#sm-tabpanel-0").should("be.hidden");
      cy.get("[data-cy='tabCon-tabId.training']").should("have.attr", "aria-selected", "true");
    });

    it("Verify that Form Options should not appear on the Training tab", () => {
      cy.get(".formOptionsBox").should("not.exist");
    });
  });


  context("Verify that right side panel", () => {
    it("Navigate to document list", () => {
      cy.cmpTurnOffAutosave();
      cy.navigToDocumentList();
      cy.dlClearFilters();
    });

    it("Select the AA inline form", () => {
      cy.dlFilterByDocTitle({ docTitle: "AA Title" });
      cy.dlSelectFirstDocument();
    });

    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy='References']").should("exist");
      cy.get("[data-cy='generalInfo']").should("be.visible");
    });

    it("Verify expand and collapse", () => {
      cy.verifyExpandCollpase();
    });

    it("Verify Reference tab Info", () => {
      cy.verifyReferenceTab({ user: USERS[1], formId: scriptData.formId, shortName: "GR" });
    });

    it("Verify References selection", () => {
      cy.get("[data-cy='referenceTo']").arrowClick({ force: true });
      cy.drSelectReferences( "FM-00001" );
      cy.drRemoveReferences({ reference: "FM-00001" });
    });
  });

  context("Verify form migration", () => {
    it("Verify migrate form button is visible", () => {
      cy.get("[data-cy=references-icon]").arrowClick();
      cy.get("[data-cy='common.form.migration']").should("be.visible");
    });

    it("Click on migrate form button", () => {
      cy.get("[data-cy='common.form.migration']").arrowClick();
    });

    it("Select form to be migrated", () => {
      cy.get("[data-cy='field-changeDocumentForm']").arrowClick();
      cy.get("[id^='react-select']").contains("FM-00002").arrowClick();
    });

    it("Select form to be migrated", () => {
      cy.get("[data-cy^='field-textfield-for-inline']" ).arrowClick();
      cy.get("[id^='react-select']").eq(1).autocompleteSelect("Textfield for inline");
    });

    it("Click on confirm change", () => {
      cy.get("[data-cy='common.confirm.change']").arrowClick().wait(2000);
    });

    it("Verify the existing field after migration", () => {
      cy.get("[name^='textfield-for-inline']").should("exist");
    });
  });

  context("Verify Revisions", () => {
    it("Approve and release FORM document", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    it("Revise Record", () => {
      cy.get("[data-cy='updateRecord']").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter document description 'test training description'", () => {
      cy.drEnterDocumentDescription({ description: "AA Description Rev2" });
    });

    it("Save Record'", () => {
      cy.wrapWithWaitOnApiCalls(
        [], () => {
          cy.get("[data-cy='DocumentRevisionForm-submit']").arrowClick();
        });
    });

    it("Status is 'In Draft'", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("open revision tab", () => {
      cy.get("[data-cy='note-icon']").arrowClick();
    });

    it("Verify revision Rev1 Document open or not", () => {
      cy.get("[data-cy='DocumentRevisionList-item']").eq(1).arrowClick().wait(2000);
      cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev 1");
    });

  });

  context("Edit permissions", () => {
    it("Open permissions tab", () => {
      cy.drSelectPermissionTab();
    });

    it("Add another user permission", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
        cy.drAddUserFromPermissionTab(USERS[2].name);
      });
    });

    it("Add another group permission", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
        cy.drAddGroupFromPermissionTab("Developers");
      });
    });
  });

  context("Check document history", () => {

    it("Open history drawer and compare history values", () => {
      cy.drSelectHistoryTab();
    });

    it("Verify scroll to on history tab", () => {
      cy.drSelectHistoryTab();
      cy.get(`[data-cy="History-detail"]`).realHover();
      cy.get("[data-cy='History-detail']").scrollTo("bottom");
    });
    const groupOne = "Developers";
    const history = [
      {
        owner: USERS[1].name,
        actions: [
          { key: "Access granted to group", value: `Developers` },
        ],
      },
      {
        owner: USERS[1].name,
        actions: [
          { key: "Access granted to user", value: `${USERS[2].name}` },
        ],
      },
    ];
    it("Verify Doc history", () => {
      cy.drSelectHistoryTab();
    });
    verifyHistoryContent(history, groupOne);
  });


  // start of scenario 1b exisitng AA document verification
  context("Select Exisitng Draft state documet", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
      cy.dlClearFilters();
    });

    it("Filter the DRAFT document", () => {
      cy.dlFilterByStatus({ status: "Draft" });
    });

    it(`select 'AA Title'`, () => {
      cy.dlFilterByDocTitle({ docTitle: "AA Title" });
      cy.dlSelectFirstDocument();
    });
    it("Verify Predefined Fields are Appear", () => {
      cy.get("[data-cy='field-name']").should("exist");
      cy.get("[data-cy='description']").should("exist");
      cy.get("[data-cy='select.document.documentType.id']").should("exist");
      cy.get("[data-cy='field-document.docId']").should("exist");
      cy.get("[data-cy='field-retrain']").should("exist");
    });
    it("Verify Description", () => {
      cy.verifyDescriptionToolbar();
    });

    it("Verify there are two tabs Overview and Training tab", () => {
      cy.verifyTabs("overview", "training");
    });

    it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      cy.verifyFixedTab();
    });

    it("Verify The top left of the page displays: Icon and document type, Doc ID, Rev stage, status (Draft)", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.DRAFT,
        title: "Document List",
        docId: scriptData.secondformId,
        revision: "Rev 2",
      });
    });

    // TO DO training related checks
    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy='References']").should("exist");
      cy.get("[data-cy='generalInfo']").should("be.visible");
    });

    it("Verify Reference tab Info", () => {
      cy.verifyRightSidePanelOtherTabs();
    });
  });

  // right side pannel verification

  context("Verify that right side panel", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
      cy.dlClearFilters();
    });

    it("Select the AA inline form", () => {
      cy.dlFilterByDocTitle({ docTitle: "AA Title" });
      cy.dlSelectFirstDocument();
    });

    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy='References']").should("exist");
      cy.get("[data-cy='generalInfo']").should("be.visible");
    });

    it("can be expanded or collapsed and it is fixed as the user scrolls up or down", () => {
      cy.verifyExpandCollpase();
    });

    it("Verify Reference tab Info", () => {
      cy.verifyReferenceTab({ user: USERS[1], formId: "FM-00002", shortName: "GR" });
    });

    it("Verify References selection", () => {
      cy.get("[data-cy='referenceTo']").arrowClick();
      cy.drSelectReferences( "FM-00001" );
      cy.drRemoveReferences({ reference: "FM-00001" });
    });
  });

  context("Verify Revisions", () => {
    it("Approve and release FORM document", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
    it("Revise Record", () => {
      cy.get("[data-cy='updateRecord']").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter document description 'test training description'", () => {
      cy.drEnterDocumentDescription({ description: "AA Description Rev3" });
    });

    it("Save Record'", () => {
      cy.wrapWithWaitOnApiCalls(
        [], () => {
          cy.get("[data-cy='DocumentRevisionForm-submit']").arrowClick();
        });
    });

    it("Status is 'In Draft'", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("open revision tab", () => {
      cy.get("[data-cy='note-icon']").arrowClick();
    });

    it("Verify revision Rev3 Document open or not", () => {
      cy.get("[data-cy='DocumentRevisionList-item']").eq(0).arrowClick();
      cy.wait(2000);
      cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev 3");
    });

    it("Verify revision Rev2 Document open or not", () => {
      cy.get("[data-cy='DocumentRevisionList-item']").eq(1).arrowClick();
      cy.wait(2000);
      cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev 2");
    });
  });

  context("Edit permissions", () => {
    it("Open permissions tab", () => {
      cy.drSelectPermissionTab();
    });

    it("Add another group permission", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
        cy.drAddGroupFromPermissionTab("Owner as approver");
      });
    });
  });

  context("Check document history", () => {
    it("Open history drawer and compare history values", () => {
      cy.drSelectHistoryTab();
    });
    const groupOne = "Owner as approver";
    const history = [
      {
        owner: USERS[1].name,
        actions: [
          { key: "Access granted to group", value: `Owner as approver` },
        ],
      },
    ];
    it("Verify Doc history", () => {
      cy.drSelectHistoryTab();
    });
    verifyHistoryContent(history, groupOne);

  });

  context("Verify History Tab scroll", () => {
    it("Verify scroll to on history tab", () => {
      cy.drSelectHistoryTab();
      cy.get(`[data-cy="History-detail"]`).realHover();
      cy.get("[data-cy='History-detail']").scrollTo("bottom");
    });
  });

  context("Verify Draft stage", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
      cy.dlClearFilters();
    });

    it("Filter the DRAFT document", () => {
      cy.dlFilterByStatus({ status: "Draft" });
    });

    it(`select 'AA Title'`, () => {
      cy.dlFilterByDocTitle({ docTitle: "AA Title" });
      cy.dlSelectFirstDocument();
    });

    it(`Verify DOC ID ${scriptData.secondformId}`, () => {
      cy.drCheckIfDocumentIdMatches({ docId: scriptData.secondformId });
    });

    it(`Verify Title Description and status`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.drVerifyDescription({ description: "AA Description Rev3" });
      cy.drVerifyTitle({ title: "AA Title" });
    });

    it("Verify Description tool bar option", () => {
      cy.verifyDescriptionToolbar();
    });
    it("Verify form option box exist", () => {
      cy.get(".formOptionsBox").should("exist");
    });
  });

  context("Approve and release and complete the training ", () => {
    it("Approve and release FORM document", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    it("Check for training text inside dialog box and complete training", () => {
      cy.get("#root").should("contain.text", "Click here to acknowledge training completion");
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PostCompleteTraining], () => {
          cy.get("[data-cy=training-complete]").click();
          cy.get("[data-cy='training.acknowladge.password']").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
          cy.get("[data-cy='passwordConfirm']").arrowClick();
        });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });

    it("Navigate to training and verify completed training", () => {
      cy.drSelectTrainingTab();
      cy.get("[data-cy='training-status'] span").should("contain.text", "Complete");
    });
  });
});

export { };
