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
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click on 'Add Document Type'", () => {
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
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
      cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(0).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Navigate to DAM and Verify training 'Training required is checked YES for AA Document'", () => {

    it("Filter AA type document", () => {
      cy.listLoadingElementShouldNotExist().wait(2000);
      cy.get(`[aria-colindex="2"] input`).arrowType("AA");
    });

    it("Verify training checkbox is checked and internal type is other", () => {
      cy.get("[data-grid-col-index='7'] input").should("be.checked");
      cy.get("[data-grid-row-index='0']").contains("OTHER").should("exist");
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
      cy.fbAddField();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Approve and release FORM document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
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

  context("Verify predefiend fields", () => {
    it("Verify predefiend fields", () => {
      cy.verifyPredefiendFields();
      cy.drIsTrainingRequired({ shouldBe: true });
      cy.get("[data-cy='AttachmentFieldPresenter-field']").should("exist");
    });
  });


  context("Verify description field", () => {

    it("Verify description is highlighted on mouse over", () => {
      cy.verifyDescriptionIsHighlightedonHover();
    });

    it("Verify title is highlighted on mouse over", () => {
      cy.get("#field-name").trigger("mouseover");
      cy.get("#field-name>div>div").should("have.css", "background-color", "rgb(235, 237, 242)");
      cy.get("#field-name").trigger("mouseout");
    });

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

    it("Click on view more description should be expanded and its in edit mode", () => {
      cy.get("[data-cy='description'] button").arrowClick();
      cy.get("div[class^='rdw-editor-toolbar']").should("exist");
      cy.get(`[data-cy="description"] [contenteditable]`).first().scrollIntoView({ ensureScrollable: false });
    });

    it("on click of description description should be editable", () => {
      cy.get(".DraftEditor-editorContainer").eq(0).arrowClick();
      cy.get(".DraftEditor-editorContainer>div").eq(0).should("have.attr", "contenteditable", "true");
      cy.get("[data-cy='description']").first().scrollIntoView({ ensureScrollable: false });
    });

    it("click on out side description field should collpase and 2 lines are visible with view more button", () => {
      cy.unClick();
      cy.get("[data-cy='description'] button").contains("View more").should("be.visible");
      cy.get("[data-text='true']").eq(0).should("be.visible");
      cy.get("[data-text='true']").eq(1).should("be.visible");
      cy.get("[data-text='true']").eq(2).should("not.be.visible");
    });

    it("Verify top header is visible on scroll", () => {
      cy.get("#SMBodyTmpl").scrollTo("top", { ensureScrollable: false });
      cy.get("header").should("be.visible");
    });

    it("on click of description description should be editable", () => {
      cy.get(".DraftEditor-editorContainer").eq(0).arrowClick();
      cy.get(".DraftEditor-editorContainer>div").eq(0).should("have.attr", "contenteditable", "true");
    });
  });

  context("Verify Document content and Tabs", () => {
    it("Verify there are two tabs Overview and Training tab", () => {
      cy.verifyTabs("overview", "training");
    });

    it("Verify tab is fixed", () => {
      cy.verifyFixedTab();
    });

    it("Verify form opens overview tab default", () => {
      cy.isTabActive({ name: "overview", index: 0 });
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
      cy.fbAddField();
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
      cy.verifyPredefiendFields();
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
      cy.get("[data-cy='tabCon-tabId.overview']").should("be.hidden");
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

    it("Verify it is fixed when user scroll", () => {
      cy.get("[data-cy='generalInfo'").scrollTo("top", { ensureScrollable: false });
      cy.get("[data-cy='References'").should("be.visible");
    });

    it("Navigate to history tab", () => {
      cy.get("[data-cy='timeline-icon']").arrowClick();
    });

    it("Click and drag the scroll bar and verify that user can scroll history tab", () => {
      cy.get("[data-cy='History-detail']").realHover().wait(2000).scrollTo("bottom", { ensureScrollable: false });
    });

    it("Approve and release FORM document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

  });

  context("Verify title and description not highlighted", () => {
    it("Verify Title is not highlighted", () => {
      cy.get("h6").eq(2).trigger("mouseover");
      cy.get("h6").eq(2).should("not.have.css", "background-color", "rgb(235, 237, 242)");
      cy.get("h6").eq(2).trigger("mouseout");
    });

    it("Verify Description is not highlighted", () => {
      cy.verifyDescriptionNotHighlightedonHover();
    });

    it("Click on view more description should be expanded", () => {
      cy.get("[data-cy='BaseWithhtml-editor'] button").arrowClick();
      cy.get("div[class^='rdw-editor-toolbar']").should("not.exist");
      cy.contains("View less").should("be.visible");
      cy.get("[data-text='true']").eq(3).should("be.visible");
    });

    it("Verify top header is visible on scroll", () => {
      cy.get("main").scrollTo("top", { ensureScrollable: false });
      cy.get("header").should("be.visible");
    });

    it("click on out side description field should collpase", () => {
      cy.get("[data-cy='BaseWithhtml-editor'] button").arrowClick();
      cy.contains("View more").should("be.visible");
      cy.get("[data-text='true']").eq(0).should("be.visible");
      cy.get("[data-text='true']").eq(1).should("be.visible");
      cy.get("[data-text='true']").eq(2).should("not.be.visible");
    });

    it("Verify top header is visible on scroll", () => {
      cy.get("main").scrollTo("top", { ensureScrollable: false });
      cy.get("header").should("be.visible");
    });

  });


  context("Verify Scroll", () => {
    it("Navigate to history tab", () => {
      cy.get("[data-cy='timeline-icon']").arrowClick();
    });

    it("Click and drag the scroll bar and verify that user can scroll history tab", () => {
      cy.get("[data-cy='History-detail']").realHover().wait(2000).scrollTo("bottom", { ensureScrollable: false });
    });
  });


  context("Verify Create New Document from Release Document", () => {
    it("Click 'Create New' and AA Document Document should be created", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Verify Doc should  be AA", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.DRAFT,
        title: "Document List",
        docId: "AAD-01000",
        revision: "Rev 1",
      });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter the title", () => {
      cy.drEnterDocumentTitle({ name: "AA Title" });
    });

    it("Verify that Training required is checked ", () => {
      cy.drIsTrainingRequired({ shouldBe: true });
    });

    it("The top left of the page displays: Icon and document type, Doc ID, Rev stage, status (Draft)", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.DRAFT,
        title: "Document List",
        docId: "AAD-01000",
        revision: "Rev 1",
      });
    });

    it("Verify there are two tabs Overview and Training tab", () => {
      cy.verifyTabs("overview", "training");
    });

    it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      cy.verifyFixedTab();
    });

    it("Verify AAD opens to the “Overview” tab by default and should show all the default fields up to Attachments ",
      () => {
        cy.isTabActive({ name: "overview", index: 0 });
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

      it("Verify description is highlighted on mouse over", () => {
        cy.verifyDescriptionIsHighlightedonHover();
      });

      it("Verify title is highlighted on mouse over", () => {
        cy.get("#field-name").trigger("mouseover");
        cy.get("#field-name>div>div").should("have.css", "background-color", "rgb(235, 237, 242)");
        cy.get("#field-name").trigger("mouseout");
      });

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

      it("Click on view more description should be expanded and its in edit mode", () => {
        cy.get("[data-cy='description'] button").arrowClick();
        cy.get("div[class^='rdw-editor-toolbar']").should("exist");
        cy.get(`[data-cy="description"] [contenteditable]`).first().scrollIntoView({ ensureScrollable: false });
      });

      it("on click of description description should be editable", () => {
        cy.get(".DraftEditor-editorContainer").eq(0).arrowClick();
        cy.get(".DraftEditor-editorContainer>div").eq(0).should("have.attr", "contenteditable", "true");
        cy.get("[data-cy='description']").first().scrollIntoView({ ensureScrollable: false });
      });

      it("click on out side description field should collpase and 2 lines are visible with view more button", () => {
        cy.unClick();
        cy.get("[data-cy='description'] button").contains("View more").should("be.visible");
        cy.get("[data-text='true']").eq(0).should("be.visible");
        cy.get("[data-text='true']").eq(1).should("be.visible");
        cy.get("[data-text='true']").eq(2).should("not.be.visible");
      });

      it("Verify top header is visible on scroll", () => {
        cy.get("main").scrollTo("top", { ensureScrollable: false });
        cy.get("header").should("be.visible");
      });

      it("on click of description description should be editable", () => {
        cy.get(".DraftEditor-editorContainer").eq(0).arrowClick();
        cy.get(".DraftEditor-editorContainer>div").eq(0).should("have.attr", "contenteditable", "true");
      });

      it("save document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });
  });

  context("Verify Created New Document from Release Document", () => {
    it("verify Click Training Tab, clicking on it should open that tab and close the other one", () => {
      cy.drSelectTrainingTab();
      cy.get("[data-cy='tabCon-tabId.overview']").should("have.attr", "aria-selected", "false");
      cy.get("[data-cy='tabCon-tabId.overview']").should("be.hidden");
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

    it("Verify it is fixed when user scroll", () => {
      cy.get("[data-cy='generalInfo'").scrollTo("top", { ensureScrollable: false });
      cy.get("[data-cy='References'").should("be.visible");
    });

    it("Verify expand and collapse", () => {
      cy.verifyExpandCollpase();
    });

    it("Verify Eye icon", () => {
      cy.verifyReferencesGeneralInfo({ user: USERS[1].name });
    });

    it("Verify Reference tab Info", () => {
      cy.verifyReferenceTab({ user: USERS[1], formId: scriptData.formId, shortName: "GR" });
    });

    it("Verify References selection", () => {
      cy.get("[data-cy='referenceTo']").arrowClick({ force: true });
      cy.drSelectReferences( "FM-00001" );
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
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
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
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
      cy.drClickCreateDocumentWithoutApiCall();
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
      cy.drAddUserFromPermissionTab(USERS[2].name);
    });

    it("Add another group permission", () => {
      cy.drAddGroupFromPermissionTab("Developers");
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
          { key: "Access revoked for user", value: USERS[2].name },
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

  context("Verify book mark", () => {
    it("Verify Book Mark Navigation", () => {
      cy.get("[data-cy='bookmark-icon']").arrowClick();
      cy.get("[data-cy='Bookmarks-detail']").should("be.visible");
    });
  });

  context("Document verification before released", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
      cy.dlClearFilters();
    });

    it("Filter the DRAFT document", () => {
      cy.dlFilterByStatus({ status: "Draft" });
    });

    it(`select 'AA Title'`, () => {
      cy.listLoadingElementShouldNotExist();
      cy.dlFilterByDocTitle({ docTitle: "AA Title" });
      cy.dlSelectFirstDocument();
    });
    it("Verify Predefined Fields are Appear", () => {
      cy.get("[data-cy='field-name']").should("exist");
      cy.get("[data-cy='description']").should("exist");
      cy.get("[data-cy='select.document.documentType.id']").should("exist");
      cy.get("[data-cy='field-document.docId']").should("exist");
      cy.get("[data-cy='field-retrain']").should("exist");
      cy.get("[data-cy='AttachmentFieldPresenter-field']").should("exist");
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

    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy='References']").should("exist");
      cy.get("[data-cy='generalInfo']").should("be.visible");
    });

    it("Verify it is fixed when user scroll", () => {
      cy.get("[data-cy='generalInfo'").scrollTo("top", { ensureScrollable: false });
      cy.get("[data-cy='References'").should("be.visible");
    });


    it("Verify Reference tab Info", () => {
      cy.verifyRightSidePanelOtherTabs();
    });
  });

  context("Verify Scroll", () => {
    it("Navigate to history tab", () => {
      cy.get("[data-cy='timeline-icon']").arrowClick();
    });

    it("Click and drag the scroll bar and verify that user can scroll history tab", () => {
      cy.get("[data-cy='History-detail']").realHover().wait(2000).scrollTo("bottom", { ensureScrollable: false });
    });
  });

  context("Approve and release and complete the training ", () => {
    it("Approve and release FORM document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
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

    it("Navigate to training and verify training is completed", () => {
      cy.drSelectTrainingTab();
      cy.get("[data-cy='training-status'] span").should("contain.text", "Complete");
    });

    it("Verify form option should not visible for training tab", () => {
      cy.intPageVerifyFormOptionsNotExist();
    });
  });

  // Design document flow

  context("Add new Doc Type", () => {
    it("Navigate to document type management", () => {
      cy.navigToDocumentTypeManagement();
    });

    it("Click on 'Add Document Type'", () => {
      cy.dtmClickAddDocumentType();
    });

    it("Add Document type name", () => {
      cy.dtmAddDocType({ docType: "Design Document" });
    });

    it("Add Acronym", () => {
      cy.dtmAddAcronym({ acronym: "DD-" });
    });

    it("Check Private Number checkbox", () => {
      cy.dtmSelectPrivateNumber();
    });

    it("Check QMS checkbox", () => {
      cy.dtmSelectQMS();
    });

    it("Check Needs Signature checkbox", () => {
      cy.dtmSelectNeedsSignature();
    });


    it("Add Starting Number", () => {
      cy.get("[class='k-grid-content k-virtual-content']").scrollTo("center").wait(1000);
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
      cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(0).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Navigate to DAM and Verify training 'Training required is checked YES for Design Document'", () => {

    it("Filter Design type document", () => {
      cy.listLoadingElementShouldNotExist().wait(2000);
      cy.get(`[aria-colindex="2"] [class="k-textbox"]`).arrowType("Design");
    });

    it("Verify training checkbox is checked and internal type is other", () => {
      cy.get("[data-grid-col-index='7'] input").should("not.be.checked");
      cy.get("[data-grid-row-index='0']").contains("OTHER").should("exist");
    });

  });

  context("Create Design document", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'Design Document type", () => {
      cy.drEnterDocumentTitle({ name: "Design document type" });
    });

    it("Enter document description 'AA document description'", () => {
      cy.drEnterDocumentDescription({ description: "Design document description" });
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

    it("Select 'Design Document' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Design Document" });
      cy.unClick();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Verify created form", () => {

    it("Verify The top left of the page displays: Icon and document type, Doc ID, Rev stage, status (Draft)", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.DRAFT,
        title: "Document List",
        docId: "FM-00004",
        revision: "Rev 1",
      });
    });

    it("Verify there are two tabs Overview and Training tab", () => {
      cy.verifyTabs("overview", "training");
    });

    it("Verify DD document opens to the “Overview” tab  and show default fields up to Attachments", () => {
      cy.isTabActive({ name: "overview", index: 0 });
      cy.verifyPredefiendFields();
      cy.get("[data-cy='AttachmentFieldPresenter-field']").should("exist");
    });

    it("Click Training Tab, clicking on it should open that tab and close the other one", () => {
      cy.drSelectTrainingTab();
      cy.get("[data-cy='tabCon-tabId.training']").should("have.attr", "aria-selected", "true");
      cy.get("[data-cy='tabCon-tabId.overview']").should("be.hidden");
      cy.get("[data-cy='tabCon-tabId.overview']").should("have.attr", "aria-selected", "false");
    });

    it("Check training tab  and verify training related text", () => {
      cy.get("#sm-tabpanel-1 svg").should("exist");
      cy.get("#sm-tabpanel-1 p").should("contain.text",
        "Training can be assigned to this document once it is released");
    });

    it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      cy.verifyFixedTab();
    });

  });

  context("Approve and release and complete the training ", () => {
    it("Approve and release FORM document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
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
