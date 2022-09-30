// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import "moment-timezone";
import moment from "moment-timezone";
import { CONFIG } from "../../support/config";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
const approvalRequestTitle = "Approval request from newly created form";
const approvalRequestFormName = "New Approval request form template";


context("Approval request form layout verification", () => {
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
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
            documentTypes: [
              ClinicalProtocolDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response: any) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response: any) => {
        loginResponse = response;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create test cp document", () => {
    it("Navigate to document list", () => {
      cy.cmpTurnOnAutosave();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'CP doc'", () => {
      cy.drEnterDocumentTitle({ name: "CP doc" });
    });

    it("Enter description 'CP doc description'", () => {
      cy.drEnterDocumentDescription({ description: "CP doc description" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'CP' outputdocument type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
    });

    it("Select 'Alpha numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric Alpha" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Create new AR form", () => {
    it("Navigate to document list", () => {
      cy.cmpTurnOnAutosave();
    });

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
      cy.get("button[data-cy='fb-editor-mode-validation-1']").arrowClick();
      cy.get("[data-cy='fb-control-required']").arrowClick();
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Give label to 'Text Field' as 'TEXT FIELD'`, () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "TEXT FIELD" });
      cy.get("button[data-cy='fb-editor-mode-validation-1']").arrowClick();
      cy.get("input[value^='visibility']").check();
      cy.get(`input[name="validators.required_if_in"]`).check();
      cy.get(`[data-cy="validators.required_if_in.name"]`).autocompleteSelect("Checkbox" );
      cy.get(`input[type="checkbox"][value="3"]`).first().check();
      cy.get("button[data-cy='fb-editor-actions-add']").first().contains("Add").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.reload();
    });
  });

  context("Verify `Approval request form`", () => {
    it("Verify Form for Approval request has two tabs Change Details and Documents", () => {
      cy.verifyTabs("changedetails", "documents");
    });

    it("Verify title is highlighted on mouse over", () => {
      cy.verifyTitleIsHighlightedonHover();
    });

    it("Verify description is highlighted on mouse over", () => {
      cy.verifyDescriptionIsHighlightedonHover();
    });

    context("Verify that Change details tab should be opened by default and that contains`", () => {
      it("Verify change detail tab open by default", () => {
        cy.isTabActive({ name: "changedetails", index: 0 });
      });

      it("predefine schema fields except Approval request details", () => {
        cy.verifyPredefiendFields();
      });

      it("Verify Approver block exist", () => {
        cy.get("[data-cy='fb-approvers-approvers']").should("exist");
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
        cy.get("[data-cy='fb.add.document']").should("exist");
      });

      it("Verify FB fields added to AR form ", () => {
        cy.get("[data-cy^='text-field']").should("exist");
        cy.get("[data-cy='Checkbox']").should("exist");
      });

      it("Verify FB fields added to AR form ", () => {
        cy.get("[name^=checkbox]").should("exist");
        cy.get("[data-cy^='text-field']").should("exist");
      });

      it("Verify that Form Options should appear on the document Tab", () => {
        cy.get(".formOptionsBox").should("exist");
      });

      it("Verify Click Documents Tab, clicking on it should open that tab and close the other one", () => {
        cy.get("[data-cy='tabCon-tabId.changedetails']").should("have.attr", "aria-selected", "false");
        cy.get("#sm-tabpanel-0").should("be.hidden");
        cy.get("[data-cy='tabCon-tabId.documents']").should("have.attr", "aria-selected", "true");
      });

      it("Verify that right side panel opens by default to the References tab", () => {
        cy.get("[data-cy='References']").should("exist");
        cy.get("[data-cy='generalInfo']").should("be.visible");
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create approval request from released  form", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Click Create a Approval Request button", () => {
      cy.arClickCreateAnAR();
    });

    it("Choose newly AR Form template", () => {
      cy.get("div[data-cy='field-select-form']>#FormList-selectForm").arrowClick();
      cy.get("div[id^=react-select]").contains(approvalRequestFormName).arrowClick();
      cy.get("[data-cy='create.approval.request.continue']").arrowClick();
    });

    it("Enter title AR title: " + approvalRequestTitle, () => {
      cy.arEnterApprovalRequestTitle({ title: approvalRequestTitle });
    });

    it("Enter description 'AR from New form template for approval request'", () => {
      cy.get("[data-cy='description']").first().arrowClick({ force: true }).wait(1000);
      cy.get(`[data-cy="description"] [contenteditable]`).first().clear().arrowType("AR form description");
    });

    context("Verify `Approval request form`", () => {
      it("Verify Form for Approval request has two tabs Change Details and Documents", () => {
        cy.verifyTabs("changedetails", "documents");
      });

      it("Verify tab is fixed", () => {
        cy.verifyFixedTab();
      });

      context("Verify that Change details tab should be opened by default and that contains`", () => {
        it("Verify change detail tab open by default", () => {
          cy.isTabActive({ name: "changedetails", index: 0 });
        });

        it("Verify that Form Options should not appear on the Change Details Tab", () => {
          cy.get(".formOptionsBox").should("not.exist");
        });
      });

      context("Verify Document tab`", () => {
        it("Navigate to document tab", () => {
          cy.get("[data-cy='tabId.documents']").arrowClick({ force: true });
        });

        it("Verify add document", () => {
          cy.get("[data-cy='fb.add.document']").should("exist");
        });

        it("Verify FB fields added to AR form ", () => {
          cy.get("[name^=checkbox]").should("exist");
        });

        it("Verify add document description justification docrev field exists", () => {
          cy.get("[data-cy='fb.add.document']").should("exist");
          cy.get("[data-cy='fb.add.document']").arrowClick().wait(2000);
          cy.get("[data-cy='proposedDocumentRevision']").should("exist");
          cy.get("[name='descriptionOfChange']").should("exist");
          cy.get("[name='justificationOfChange']").should("exist");
          cy.get("[data-cy='dialog-close']").arrowClick();
        });

        it("Verify that Form Options should appear on the document Tab", () => {
          cy.get(".formOptionsBox").should("not.exist");
        });

        it("Verify Click Documents Tab, clicking on it should open that tab and close the other one", () => {
          cy.get("[data-cy='tabCon-tabId.changedetails']").should("have.attr", "aria-selected", "false");
          cy.get("#sm-tabpanel-0").should("be.hidden");
          cy.get("[data-cy='tabCon-tabId.documents']").should("have.attr", "aria-selected", "true");
        });

        it("Verify that right side panel opens by default to the References tab", () => {
          cy.get("[data-cy='References']").should("exist");
          cy.get("[data-cy='generalInfo']").should("be.visible");
        });
      });
    });
  });

  context("Verify description field", () => {
    it("Verify description is highlighted on mouse over", () => {
      cy.verifyDescriptionIsHighlightedonHover();
    });

    it("Verify title is highlighted on mouse over", () => {
      cy.get("#field-title").trigger("mouseover");
      cy.get("#field-title>div>div").should("have.css", "background-color", "rgb(235, 237, 242)");
      cy.get("#field-title").trigger("mouseout");
    });

    it("Verify DescriptionToolBar not have option to change font size, or option to change font type", () => {
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
          `{moveToEnd}{enter}This is description test to check length.Checking length of characters and lines.`
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
      cy.get("[data-cy='description'] button").contains("View more").should("exist");
      cy.unClick();
    });

    it("Click on view more description should be expanded", () => {
      cy.get("[data-cy='description'] button").arrowClick();
      cy.get("div[class^='rdw-editor-toolbar']").should("exist");
      cy.get(`[data-cy="description"] [contenteditable]`).first().scrollIntoView({ ensureScrollable: false });
    });

    it("on click of description description should be editable", () => {
      cy.get(".DraftEditor-editorContainer").eq(0).arrowClick();
      cy.get(".DraftEditor-editorContainer>div").eq(0).should("have.attr", "contenteditable", "true");
    });

    it("click on out side description field should collpase and 2 lines are visible with view more button", () => {
      cy.unClick();
      cy.get("[data-cy='description'] button").contains("View more").should("be.visible");
      cy.get("[data-text='true']").eq(0).should("be.visible");
      cy.get("[data-text='true']").eq(1).should("be.visible");
      cy.get("[data-text='true']").eq(2).should("not.be.visible");
    });

    it("Verify top header is visible on scroll", () => {
      cy.get("[data-cy='documentRevisions-1']").scrollTo("top", { ensureScrollable: false });
      cy.get("header").should("be.visible");
    });

    it("on click of description description should be editable", () => {
      cy.get(".DraftEditor-editorContainer").eq(0).arrowClick();
      cy.get(".DraftEditor-editorContainer>div").eq(0).should("have.attr", "contenteditable", "true");
    });
  });

  context("fill the fields and save", () => {
    it("Navigate to document tab", () => {
      cy.unClick();
      cy.drSelectDocumentTab();
    });

    it("Checkbox option 1 checked", () => {
      cy.get(`input[type="checkbox"][value="1"]`).last().check();
    });

    it("Navigate to change detail tab", () => {
      cy.drSelectChangeDetailsTab();
    });

    it("Save the doc", () => {
      cy.get("[data-cy='common.save']").arrowClick();
    });

    it("Add first Approver'", () => {
      cy.arAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Navigate to document tab", () => {
      cy.drSelectDocumentTab();
    });

    it("Click on Add Document", () => {
      cy.get(`[data-cy="fb.add.document"]`).arrowClick().wait(2000);
    });

    it("Select document", () => {
      cy.get(`[data-cy="proposedDocumentRevision"]`).autocompleteSelect("FM-00002");
    });

    it("Enter description of change", () => {
      cy.get(`[name="descriptionOfChange"]`).arrowType("Desc of change");
    });

    it("Enter description of change", () => {
      cy.get(`[name="justificationOfChange"]`).arrowType("justification of change");
    });

    it("selct document", () => {
      cy.get(`[data-cy="arAddDocumentDialogAddBtn"]`).arrowClick();
    });

    it("Save the doc", () => {
      cy.get("[data-cy='common.save']").arrowClick();
    });
  });

  context("Validate Right Side Panel", () => {
    it("Verify It is expanded and collpased", () => {
      cy.verifyExpandCollpase();
    });

    it("Verify Reference tab Info", () => {
      cy.verifyReferenceTab({ user: USERS[1], formId: "", shortName: "GR" });
    });

    it("Verify it is fixed when user scroll", () => {
      cy.get("[data-cy='References-detail'").scrollIntoView();
      cy.get("[data-cy='References'").should("be.visible");
    });

    it("Verify eye icon Genral info, Avtar Reference Info form Info, Created Info", () => {
      cy.get("[data-cy='references-icon']").should("be.visible");
      cy.get("[data-cy='generalInfo']").should("contain.text", "General Info");
      cy.get("[data-cy='user-avatar']").should("exist");
      cy.get("[data-cy='user-avatar']").should("contain.text", "GR");
      cy.get("[data-cy='common.revision']").should("contain.text", "Revision");
      cy.get("[data-cy='common.revision']").should("contain.text", "Revision");
      cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00003");
      cy.get("[data-cy='common.revision']").parent().should("contain.text",
        moment().tz("America/Los_Angeles").format("YYYY.MM.DD"));
      cy.get("[data-cy='References-detail']").should("contain.text",
        moment().tz("America/Los_Angeles").format("MM/DD/YYYY"));
    });

    context("Check document history", () => {
      const history = [
        {
          owner: USERS[1].name,
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

      it("Verify doc added and approver added histroy captured", () => {
        cy.get("[data-cy='History-detail']").contains("Document Added").should("exist");
        cy.get("[data-cy='History-detail']").contains("CP doc").should("exist");
        cy.get("[data-cy='History-detail']").contains("Approver Added").should("exist");
        cy.get("[data-cy='History-detail']").contains("Giovanni Reynolds").should("exist");
      });
    });

    context("Verify Book Mark", () => {
      it("Verify Book Mark Navigation", () => {
        cy.get("[data-cy='bookmark-icon']").arrowClick();
        cy.get("[data-cy='Bookmarks-detail']").should("be.visible");
      });

      it("Navigate to change detail tab", () => {
        cy.drSelectChangeDetailsTab();
      });

      it("Clicking on book mark user is navigated to the bookmark field", () => {
        cy.get("[data-cy='Bookmarks-detail'] p").eq(0).arrowClick();
        cy.get("[data-cy='Approval Request Details']").should("be.visible");
      });
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

  context("Training tab should not display", () => {
    it("Verify traing tab not exist", () => {
      cy.get("#Checkbox-box").should("not.exist");
      cy.get("[data-cy='tabId.training']").should("not.exist");
    });
  });

  context("Verify top header is fixed on scroll", () => {
    it("Verify top header is visible on scroll", () => {
      cy.get("[data-cy='tabId.changedetails']").scrollTo("top", { ensureScrollable: false });
      cy.get("header").should("be.visible");
    });
  });


  context("Approve and release document", () => {
    it("Click on send to review button", () => {
      cy.get("[data-cy='transitionButton']").arrowClick();
    });

    it("Approve submission", () => {
      cy.get("[data-cy='transition-approve']").first().arrowClick();
      cy.get("[data-cy='transition.action.password']").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy='passwordConfirm']").arrowClick().wait(5000);
    });

    it("Verify on mouse over title is not highlighted", () => {
      cy.get("#field-name").parent().trigger("mouseover");
      cy.get("#field-name").should("not.have.css", "background-color", "rgb(235, 237, 242)");
      cy.get("#field-name").trigger("mouseout");
    });

    it("Verify on mouse over description is not highlighted", () => {
      cy.get("[data-cy='BaseWithhtml-editor']").eq(0).trigger("mouseover");
      cy.get("[data-cy='BaseWithhtml-editor']>div").should("not.have.css", "background-color", "rgb(235, 237, 242)");
      cy.get("[data-cy='BaseWithhtml-editor']>div").eq(0).trigger("mouseout");
    });

    it("Click on view more description should be expanded", () => {
      cy.get("[data-cy='BaseWithhtml-editor'] button").arrowClick();
      cy.get("div[class^='rdw-editor-toolbar']").should("not.exist");
      cy.get("[data-cy='BaseWithhtml-editor'] button").contains("View less").should("be.visible");
      cy.get("[class*='descriptionSummaryEditorClass']").should("exist");
    });

    it("Verify top header is visible on scroll", () => {
      cy.get("[data-cy='tabId.changedetails']").scrollTo("top", { ensureScrollable: false });
      cy.get("header").should("be.visible");
    });

    it("click on  description field again field should collpase ", () => {
      cy.get("[data-cy='BaseWithhtml-editor'] button").contains("View less").arrowClick();
      cy.get("[data-cy='BaseWithhtml-editor'] button").contains("View more").should("be.visible");
      cy.get("[data-text='true']").eq(0).should("be.visible");
      cy.get("[data-text='true']").eq(2).should("not.be.visible");
    });
  });
});

export { };
