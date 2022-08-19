// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;

let developersGroup;
let adminEmployee;
let secondEmployee;
const scriptData = {
  formId: "FM-00002",
  secondformId: "AAD-01000",
};
const owner = USERS[1].name;

const history = [
  {
    owner,
    actions: [
      { key: "Updated status", value: `Set to Released by ${owner}` },
      { key: "Updated status", value: `Set to Approved by ${owner}` },
      { key: "Updated status", value: `Set to In Review by ${owner}` },
      { key: "Updated status", value: `Set to Pending Change by ${owner}` },
    ],
  },
];

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
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
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

    it("Enter document description 'test training description'", () => {
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

  context("Verify Document content and Tabs", () => {
    it("Verify there are two tabs Overview and Training tab", () => {
      cy.get("[data-cy=\"tabId.overview\"]").should("exist");
      cy.get("[data-cy=\"tabId.training\"]").should("exist");
      cy.get("[data-cy=\"tabId.details\"]").should("not.exist");
    });
    it("Verify Description tool bar option", () => {
      cy.verifyDescriptionToolbar();
    });
    it("Verify form option box exist", () => {
      cy.get(".formOptionsBox").should("exist");
    });
    it("Verify Add field button", () => {
      cy.get("[data-cy=\"form.builder.add.field\"]").should("exist");
    });

    it("Checks if document revision is 'Numeric' by default", () => {
      cy.get("[data-cy='common.Numeric']>span>span>input").should("be.checked");
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

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Verify Added fields in overview tab ", () => {
      cy.get("[data-cy=\"AttachmentFieldPresenter-field\"]").should("exist");
      cy.get("[data-cy^=\"textfield-for-inline-l6d6wdtx\"]").should("exist");
      cy.get("[name^=\"checkbox-group-for-inline-l6d6wfla\"]").should("exist");
      cy.get("[class^='fb-field-wrapper-radio-btn-group-for-inline']").should("exist");
    });

    xit("Verify that Title are lighter color when they are hovered over", () => {
      cy.get("[data-cy=\"field-name\"]").should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get("[data-cy=\"field-name\"]")
        .realHover().wait(500).should("have.css", "background-color", "rgb()");
    });

    it("Verify row with the Tabs is fixed, and that user should not be able to add/edit new Tabs", () => {
      cy.verifyFixedTab();
    });

    it("Click Training Tab, clicking on it should open that tab and close the other one", () => {
      cy.get("[data-cy=\"tabId.training\"]").arrowClick({ force: true });
      cy.verifyFixedTab();
    });

    it("Add field button should not be displayed in Training tab", () => {
      cy.get("[data-cy=\"form.builder.add.field\"]").should("not.exist");
    });

    it("Verify The top left of the page displays: Icon and document type, Doc ID, Rev stage, status (Draft)", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.get("header li>p>div>a>div").should("have.text", "Document List");
      cy.get("[data-cy='HeaderInfo'] span").should("contain.text", scriptData.formId);
      cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev 1");
    });

    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy=\"References\"]").should("exist");
      cy.get("[data-cy=\"generalInfo\"]").should("be.visible");
    });

    it("Verify that scroll bar appearing only on hover", () => {
      cy.get("[data-cy=\"timeline-icon\"]").realHover();
    });

    it("Click and drag the scroll bar and verify that user can scroll history tab", () => {
      cy.get("[data-cy=\"timeline-icon\"]").arrowClick();
      cy.get("[data-cy=\"change-key-0\"]").should("have.text", USERS[1].name);
      cy.get(".containing-box-scrollbar").should("have.class", "containing-box-scrollbar");
    });

    it("Approve and release FORM document", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    // trCompleteTraining

    it("Check for training text inside dialog box and complete training", () => {
      cy.get("#root").should("contain.text", "Click here to acknowledge training completion");
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PostCompleteTraining], () => {
          cy.get("[data-cy=training-complete]").click();
          cy.get("form>div").should("contain.text", "TRN ID");
          cy.get("form>div").should("contain.text", "Doc ID Rev");
          cy.get("form>div").should("contain.text", "Title");
          cy.get("form>div").should("contain.text", "I acknowledge I am trained on");
          cy.get("[data-cy=\"training.acknowladge.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
          cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
        });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });
  });


  context("Verify Create New Document from Release Document", () => {

    it("Click 'Create New' and AA Document Document should be created", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Verify that Training required is checked ", () => {
      cy.drIsTrainingRequired({ shouldBe: true });
    });

    it("The top left of the page displays: Icon and document type, Doc ID, Rev stage, status (Draft)", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Verify there are two tabs Overview and Training tab", () => {
      cy.get("[data-cy=\"tabId.overview\"]").should("exist");
      cy.get("[data-cy=\"tabId.training\"]").should("exist");
    });

    it("Verify there are two tabs Overview and Training tab", () => {
      cy.get("[data-cy=\"tabId.overview\"]").should("exist");
      cy.get("[data-cy=\"tabId.training\"]").should("exist");
    });

    it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      cy.verifyFixedTab();
    });

    it("Verify that user should not be able to rearrange the order of the Tabs", () => {
      cy.verifyFixedTab();
    });

    it("Verify AAD opens to the “Overview” tab by default and should show all the default fields up to Attachments ",
      () => {
        cy.get("[data-cy=\"tabId.overview\"]").should("exist");
        cy.get("[data-cy=\"AttachmentFieldPresenter-field\"]").should("exist");
      });

    it("Verify that Form Options should appear on the Overview tab", () => {
      cy.get(".formOptionsBox").should("exist");
    });

    it("Verify Description", () => {
      cy.verifyDescriptionToolbar();
      cy.drEnterDocumentTitle({ name: "AA Title" });
      cy.drEnterDocumentDescription({ description: "AA Description" });
    });
    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Verify Create New Document from Release Document", () => {
    it("verify Click Training Tab, clicking on it should open that tab and close the other one", () => {
      cy.get("[data-cy=\"tabId.training\"]").arrowClick({ force: true });
    });

    it("Verify that Form Options should not appear on the Training tab", () => {
      cy.get(".formOptionsBox").should("not.exist");
    });
  });
  context("Verify that right side panel", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
      cy.dlClearFilters();
    });

    it("Verify scroll to on history tab", () => {
      cy.drSelectHistoryTab();
      cy.get(`[data-cy="History-detail"]`).realHover().wait(500).scrollTo("top");
      cy.get("[data-cy=\"History-detail\"]").scrollTo("bottom");
    });

    it("Select the AA inline form", () => {
      cy.dlFilterByDocTitle({ docTitle: "AA Title" });
      cy.dlSelectFirstDocument();
    });
    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy=\"References\"]").should("exist");
      cy.get("[data-cy=\"generalInfo\"]").should("be.visible");
    });

    it("can be expanded or collapsed and it is fixed as the user scrolls up or down", () => {
      cy.get("main span>button").eq(0).arrowClick();
      cy.get("[data-cy=\"References\"]").should("not.exist");
      cy.get("main span>button").eq(0).arrowClick();
      cy.get("[data-cy=\"References\"]").should("exist");
      cy.get("[data-cy=\"generalInfo\"]").scrollTo("top");
      cy.get("[data-cy=\"References\"]").should("be.visible");
    });

    it("Verify Reference tab Info", () => {
      cy.get("[data-cy=\"references-icon\"]").should("be.visible");
      cy.get("[data-cy=\"generalInfo\"]>p").should("contain.text", "General Info");
      cy.get("[data-cy=\"generalInfo\"]>li>div>div").should("contain.text", "GR");
      cy.get("[data-cy=\"generalInfo\"]>li>div>p").should("contain.text", USERS[1].name);
      cy.get("[data-cy=\"generalInfo\"]>li>div>span").should("have.text", "Owner");
      cy.get("[data-cy=\"common.revision\"]").parent().should("contain.text", scriptData.formId);
    });

    it("Verify References selection", () => {
      cy.get("[data-cy=\"referenceTo\"]").arrowClick();
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
      cy.get("[data-cy=\"updateRecord\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter document description 'test training description'", () => {
      cy.drEnterDocumentDescription({ description: "AA Description Rev2" });
    });

    it("Save Record'", () => {
      cy.wrapWithWaitOnApiCalls(
        [], () => {
          cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
        });
    });

    it("Status is 'In Draft'", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("open revision tab", () => {
      cy.get("[data-cy=\"note-icon\"]").arrowClick();
    });

    it("Verify revision Rev2 Document open or not", () => {
      cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(0).arrowClick();
      cy.wait(2000);
      cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev 2");
    });

    it("Verify revision Rev1 Document open or not", () => {
      cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(1).arrowClick();
      cy.wait(2000);
      cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev 1");
    });

  });

  context("Check document history", () => {

    it("Open history drawer and compare history values", () => {
      cy.drSelectHistoryTab();
    });

    it("Verify scroll to on history tab", () => {
      cy.drSelectHistoryTab();
      cy.get(`[data-cy="History-detail"]`).realHover();
      cy.get("[data-cy=\"History-detail\"]").scrollTo("bottom");
    });

    history.forEach((element, groupIndex) => {
      it(`Check owner name for group ${groupIndex + 1}`, () => {
        cy.get(`[data-cy="change-key-${groupIndex}"]`).should("have.text", element.owner);
      });
      element.actions.forEach((action, index, identifier) => {
        it(`'${action.key}' as '${action.value}' exists`, () => {
          const typeOfChange = action.key;
          let contentOfChange = action.value;
          if (action.key === "New description" || action.key === "Description changed" ) {
            contentOfChange = "\n" + action.value + "\n";
          }
          if (typeOfChange === "s3Link added") {
            cy.get(`[data-cy^="change-key-${groupIndex}-${index}"]`).should("have.text", typeOfChange);
            cy.get("[data-cy='downloadS3link']").should("contain.text", contentOfChange);
          }
          else {
            cy.get(`[data-cy^="change-value-${groupIndex}-${index}"]`)
              .contains(action.key === "New owner" ? new RegExp("^" + action.value) : action.value)
              .parent()
              .parent()
              .within(() => {
                cy.get(`[data-cy^=change-key-${groupIndex}-${index}]`).should("have.text", typeOfChange);
                cy.get(`[data-cy^=change-value-${groupIndex}-${index}]`).should("contain.text", contentOfChange);
              });
          }
        });
      });
    });
  });

  context("Edit permissions", () => {
    it("Open permissions tab", () => {
      SystemRequirement("REQ-4240");
      cy.drSelectPermissionTab();
    });

    it("Add another user permission", () => {
      SystemRequirement("REQ-4240");
      cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
        cy.drAddUserFromPermissionTab(USERS[2].name);
      });
    });

    it("Add another group permission", () => {
      SystemRequirement("REQ-4240");
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
        cy.drAddGroupFromPermissionTab("Developers");
      });
    });
  });

  context(`Logout user: '${USERS[1].name}' and Login user: '${USERS[1].name}'`, () => {
    it("Logout existing user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });
  });

  // just for testing purpose
  // context("Login user", () => {
  //   it("Logs user in", () => {
  //     cy.authLogin({
  //       email: USERS[1].email,
  //     });
  //   });
  //   it("Selects company", () => {
  //     cy.cmpSelectCompany({ name: "Salmon Gerlach, Homenick and Walter 2347", multiple: true });
  //   });
  // });

  context("Verify User Access Permission", () => {
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

    it(`select 'AA Title'`, () => {
      cy.get("[data-cy=\"field-name\"]").arrowClick();
      cy.get("input[value=\"AA Title\"]").should("not.exist");
    });

    it("Verify without access he is able to edit or not", () => {
      cy.get("[data-cy=\"field-name\"]").arrowClick();
      cy.get("input[value=\"AA Title\"]").should("not.exist");
    });
  });


  // start of scenario 1b exisitng AA document verification

  context(`Logout user: '${USERS[1].name}' and Login user: '${USERS[1].name}'`, () => {
    it("Logout existing user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

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
      cy.get("[data-cy=\"description\"]").realHover().wait(500)
        .should("have.css", "background-color", "rgb(235, 237, 242)");
      cy.get("[data-cy=\"field-name\"]").realHover().wait(500)
        .should("have.css", "background-color", "rgb(235, 237, 242)");
      cy.get("[data-cy=\"field-name\"]").should("exist");
      cy.get("[data-cy=\"description\"]").should("exist");
      cy.get("[data-cy=\"tabId.overview\"]").should("exist");
      cy.get("[data-cy=\"tabId.taining\"]").should("exist");
      cy.get("[data-cy=\"select.document.documentType.id\"]").should("exist");
      cy.get("[data-cy=\"field-document.docId\"]").should("exist");
      cy.get("[data-cy=\"field-revisionStage\"]").should("exist");
      cy.verifyFixedTab();
    });
    it("Verify Description", () => {
      cy.verifyDescriptionToolbar();
    });

    it("Verify there are two tabs Overview and Training tab", () => {
      cy.get("[data-cy=\"tabId.overview\"]").should("exist");
      cy.get("[data-cy=\"tabId.training\"]").should("exist");
      cy.get("[data-cy=\"tabId.details\"]").should("not.exist");
    });

    it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      cy.verifyFixedTab();
    });

    it("Verify The top left of the page displays: Icon and document type, Doc ID, Rev stage, status (Draft)", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.get("header li>p>div>a>div").should("have.text", "Document List");
      cy.get("[data-cy='HeaderInfo'] span").should("contain.text", scriptData.secondformId);
      cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev 2");
    });

    // TO DO training related checks
    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy=\"References\"]").should("exist");
      cy.get("[data-cy=\"generalInfo\"]").should("be.visible");
    });

    it("Verify Reference tab Info", () => {
      cy.get("[data-cy=\"references-icon\"]").should("be.visible");
      cy.get("[data-cy=\"note-icon\"]").should("be.visible");
      cy.get("[data-cy=\"timeline-icon\"]").should("be.visible");
      cy.get("[data-cy=\"permission-icon\"]").should("be.visible");
      cy.get("[data-cy=\"bookmark-icon\"]").should("be.visible");
      cy.get("[data-cy=\"cr-icon\"]").should("be.visible");
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
      cy.get("[data-cy=\"References\"]").should("exist");
      cy.get("[data-cy=\"generalInfo\"]").should("be.visible");
    });

    it("can be expanded or collapsed and it is fixed as the user scrolls up or down", () => {
      cy.get("main span>button").eq(0).arrowClick();
      cy.get("[data-cy=\"References\"]").should("not.exist");
      cy.get("main span>button").eq(0).arrowClick();
      cy.get("[data-cy=\"References\"]").should("exist");
      cy.get("[data-cy=\"generalInfo\"]").scrollTo("top");
      cy.get("[data-cy=\"References\"]").should("be.visible");
    });

    it("Verify Reference tab Info", () => {
      cy.get("[data-cy=\"references-icon\"]").should("be.visible");
      cy.get("[data-cy=\"generalInfo\"]>p").should("contain.text", "General Info");
      cy.get("[data-cy=\"generalInfo\"]>li>div>div").should("contain.text", "GR");
      cy.get("[data-cy=\"generalInfo\"]>li>div>p").should("contain.text", USERS[1].name);
      cy.get("[data-cy=\"generalInfo\"]>li>div>span").should("have.text", "Owner");
      cy.get("[data-cy=\"common.revision\"]").parent().should("contain.text", scriptData.formId);
    });

    it("Verify References selection", () => {
      cy.get("[data-cy=\"referenceTo\"]").arrowClick();
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
      cy.get("[data-cy=\"updateRecord\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter document description 'test training description'", () => {
      cy.drEnterDocumentDescription({ description: "AA Description Rev3" });
    });

    it("Save Record'", () => {
      cy.wrapWithWaitOnApiCalls(
        [], () => {
          cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
        });
    });

    it("Status is 'In Draft'", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("open revision tab", () => {
      cy.get("[data-cy=\"note-icon\"]").arrowClick();
    });

    it("Verify revision Rev3 Document open or not", () => {
      cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(0).arrowClick();
      cy.wait(2000);
      cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev 3");
    });

    it("Verify revision Rev2 Document open or not", () => {
      cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(1).arrowClick();
      cy.wait(2000);
      cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev 2");
    });
  });

  context("Check document history", () => {
    it("Open history drawer and compare history values", () => {
      SystemRequirement("REQ-0360", "REQ-2670", "REQ-4000", "REQ-4250");
      cy.drSelectHistoryTab();
    });

    history.forEach((element, groupIndex) => {
      it(`Check owner name for group ${groupIndex + 1}`, () => {
        cy.get(`[data-cy="change-key-${groupIndex}"]`).should("have.text", element.owner);
      });

      element.actions.forEach((action, index, identifier) => {
        it(`'${action.key}' as '${action.value}' exists`, () => {
          const typeOfChange = action.key;
          let contentOfChange = action.value;

          if (action.key === "New description" || action.key === "Description changed" ) {
            contentOfChange = "\n" + action.value + "\n";
          }

          if (typeOfChange === "s3Link added") {
            cy.get(`[data-cy^="change-key-${groupIndex}-${index}"]`).should("have.text", typeOfChange);
            cy.get("[data-cy='downloadS3link']").should("contain.text", contentOfChange);
          }
          else {
            cy.get(`[data-cy^="change-value-${groupIndex}-${index}"]`)
              .contains(action.key === "New owner" ? new RegExp("^" + action.value) : action.value)
              .parent()
              .parent()
              .within(() => {
                cy.get(`[data-cy^=change-key-${groupIndex}-${index}]`).should("have.text", typeOfChange);
                cy.get(`[data-cy^=change-value-${groupIndex}-${index}]`).should("contain.text", contentOfChange);
              });
          }
        });
      });
    });
  });

  context("Edit permissions", () => {
    it("Open permissions tab", () => {
      SystemRequirement("REQ-4240");
      cy.drSelectPermissionTab();
    });

    it("Add another group permission", () => {
      SystemRequirement("REQ-4240");
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
        cy.drAddGroupFromPermissionTab("Owner as approver");
      });
    });
  });
  context("Verify History Tab scroll", () => {
    it("Verify scroll to on history tab", () => {
      cy.drSelectHistoryTab();
      cy.get(`[data-cy="History-detail"]`).realHover();
      cy.get("[data-cy=\"History-detail\"]").scrollTo("bottom");
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

  });
  context("Verify Fields After Save", () => {
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
});

export { };
