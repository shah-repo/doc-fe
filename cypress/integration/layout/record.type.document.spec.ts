// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { RecordOne } from "../../utils/constants/documentTypes/record";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;

let developersGroup;
let adminEmployee;
const owner = USERS[1].name;

const history = [
  {
    owner,
    actions: [
      { key: "Description changed", value: `Test Description for record one` },
    ],
  },
];

context("Record type Document Layout verification", () => {
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

  context.skip("Login user", () => {
    it("Logs user in", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  // context("Login user", () => { // for testing purpose
  //   it("Logs user in", () => {
  //     cy.authLogin({
  //       email: USERS[1].email,
  //     });
  //   });
  //   it("Selects company", () => {
  //     cy.cmpSelectCompany({ name: "Grey Christiansen - Weissnat 60415", multiple: true });
  //   });
  // });

  context("Create a required form for Record Document", () => {

    context("Start document creation flow", () => {

      it("Navigate to document list", () => {
        cy.navigToDocumentList();
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

      it("Select 'Record Document' output document type from dropdown", () => {
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

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
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

      it("Navigate to Overview Tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Validate created form document", () => {

      context("Validate Predefined fields", () => {
        it("Verify Predefiend fields up to attachment", () => {
          cy.verifyPredefiendFields();
        });
      });

      context("Validate Tabs", () => {
        it("Verify Predefiend Tabs Exist", () => {
          cy.get("[data-cy=\"tabId.overview\"]").should("exist");
          cy.get("[data-cy=\"tabId.details\"]").should("exist");
        });

        it("Verify Tabs are fixed and order not changable", () => {
          cy.verifyFixedTab();
        });
        it("Verify Expand and Collpase Right Side Panel", () => {
          cy.verifyExpandCollpase();
        });
      });

      context("Verify Overview  Tab", () => {
        it("Verify Overview Tab Selected", () => {
          cy.get("[data-cy=\"tabCon-tabId.overview\"]").should("have.attr", "aria-selected", "true");
          cy.get("#sm-tabpanel-0").should("be.visible");
          cy.get("[data-cy^=fb-approvals-fb-approvals-]").should("exist");
        });

        it("Verify Tabs is fixed and order not changable", () => {
          cy.verifyFixedTab();
        });

      });

      context("Verify header and tabs", () => {
        it("Verify Header Info Icon and document type, Doc ID, Rev stage, status (Draft)", () => {
          cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
          cy.get("header li>p>div>a>div").should("have.text", "Document List");
          cy.get("[data-cy='HeaderInfo'] span").should("contain.text", "FM-00002");
          cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev 1");
        });

        it("Navigate to details Tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Clicking on details Tab other tabs should be closed and details tab should open", () => {
          cy.get("[data-cy=\"tabCon-tabId.overview\"]").should("have.attr", "aria-selected", "false");
          cy.get("#sm-tabpanel-0").should("be.hidden");
          cy.get("[data-cy=\"tabCon-tabId.details\"]").should("have.attr", "aria-selected", "true");
          cy.get("#sm-tabpanel-1").should("be.visible");
        });
      });

      context("Validate Newly Added  form builder fields in Details tab", () => {
        it("Validate Right Side Panel Open by default to Reference tab", () => {
          cy.get("[data-cy=\"References\"]").should("exist");
          cy.get("[data-cy=\"generalInfo\"]").should("be.visible");
        });
        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          });
        });
      });
    });
  });

  context("Create a required document from release form Verify the layout and Release It", () => {
    context("Create New Document from Release form", () => {
      it("Click 'Create New'", () => {
        cy.drCreateNewDocumentFromForm();
      });
    });
    context("Fill the form", () => {
      it("Fill the record details'", () => {
        cy.drEnterDocumentTitle({ name: "Record one Doc" });
        cy.drEnterDocumentDescription({ description: "Test Description for record one" });
      });
      it("Save the Document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });
    context("Validate Tabs", () => {
      it("Verify Predefiend Tabs Exist", () => {
        cy.get("[data-cy=\"tabId.overview\"]").should("exist");
        cy.get("[data-cy=\"tabId.details\"]").should("exist");
      });

      it("Verify Tabs are fixed and order not changable", () => {
        cy.verifyFixedTab();
      });

      it("Verify Predefiend fields up to attachment", () => {
        cy.verifyPredefiendFields();
      });
    });

    context("Verify Overview  Tab", () => {
      it("Verify Overview Tab Selected", () => {
        cy.get("[data-cy=\"tabCon-tabId.overview\"]").should("have.attr", "aria-selected", "true");
        cy.get("#sm-tabpanel-0").should("be.visible");
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").should("exist");
      });

      it("Verify Tabs is fixed and order not changable", () => {
        cy.verifyFixedTab();
      });

      it("Verify The top left of the page displays: Icon and document type, Doc ID, Rev stage, status (Draft)", () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
        cy.get("header li>p>div>a>div").should("have.text", "Records");
        cy.get("[data-cy='HeaderInfo'] span").should("contain.text", "RD-00003");
        cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev A");
      });

      it("Navigate to details Tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Clicking on details Tab other tabs should be closed and details tab should open", () => {
        cy.get("[data-cy=\"tabCon-tabId.overview\"]").should("have.attr", "aria-selected", "false");
        cy.get("#sm-tabpanel-0").should("be.hidden");
        cy.get("[data-cy=\"tabCon-tabId.details\"]").should("have.attr", "aria-selected", "true");
      });
    });

    context("Validate Newly Added form builder fields in Details tab", () => {
      xit("Verify fields in detail tab", () => {
        cy.get("[data-cy^=textfield-for-inline-]").eq(0).should("exist");
        cy.get("[data-cy^=textfield-for-inline-]").eq(1).should("exist");
        cy.get("[data-cy^=fb-ia-inline-field-]").eq(0).should("exist");
        cy.get("[data-cy^=fb-ia-inline-field-]").eq(1).should("exist");
        cy.get("[data-cy^=text-field-]").eq(0).should("exist");
        cy.get("[data-cy^=text-field-]").eq(0).should("exist");
        cy.get("[name^=checkbox--]").eq(0).should("exist");
        cy.get(".formOptionsBox").should("exist");
      });

      it("Validate Right Side Panel Open by default to Reference tab", () => {
        cy.get("[data-cy=\"References\"]").should("exist");
        cy.get("[data-cy=\"generalInfo\"]").should("be.visible");
      });

      it("Verify Expand and Collpase Right Side Panel", () => {
        cy.verifyExpandCollpase();
      });
    });

    context("Validate Right Side Panel", () => {
      it("Verify Reference tab Info", () => {
        cy.verifyReferenceTab({ user: USERS[1], formId: "FM-00002", shortName: "GR" });
      });

      it("Verify References selection", () => {
        cy.get("[data-cy=\"references-icon\"]").arrowClick();
        cy.get("[data-cy=\"referenceTo\"]").arrowClick();
        cy.drSelectReferences( "FM-00001" );
        cy.drRemoveReferences({ reference: "FM-00001" });
      });

      it("Verify Referenced By, Training ,and Release date Item exist or not", () => {
        cy.verifyReferenceInfo();
      });

      context("Verify Revision", () => {
        it("open revision tab", () => {
          cy.get("[data-cy=\"note-icon\"]").arrowClick();
        });

        it("Verify revision Rev Document open or not", () => {
          cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(0).arrowClick();
          cy.wait(2000);
          cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev A");
        });
      });

      context("Check document history", () => {
        it("Open history drawer and compare history values", () => {
          cy.drSelectHistoryTab();
        });

        xit("Verify scroll to on history tab", () => {
          cy.drSelectHistoryTab();
          cy.get(`[data-cy="History-detail"]`).realHover();
          cy.get("[data-cy=\"History-detail\"]").scrollTo("bottom");
        });
        history.forEach((element, groupIndex) => {
          it(`Check owner name for group ${groupIndex + 1}`, () => {
            cy.get(`[data-cy="change-key-${groupIndex}"]`).should("have.text", element.owner);
          });

          element.actions.forEach((action, index) => {
            it(`'${action.key}' as '${action.value}' exists`, () => {
              const typeOfChange = action.key;
              let contentOfChange = action.value;
              if (action.key === "New description" || action.key === "Description changed" ) {
                contentOfChange = "\n" + action.value + "\n";
              }
              cy.get(`[data-cy^="change-value-${groupIndex}-${index}"]`)
                .contains(action.key === "New owner" ? new RegExp("^" + action.value) : action.value)
                .parent()
                .parent()
                .within(() => {
                  cy.get(`[data-cy^=change-key-${groupIndex}-${index}]`).should("have.text", typeOfChange);
                  cy.get(`[data-cy^=change-value-${groupIndex}-${index}]`).should("contain.text", contentOfChange);
                });
            });
          });
        });
      });

      context("Verify User able to add Groups or other user permissions", () => {
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

      context("Verify Revision History", () => {
        xit("Verify Revision History Items", () => {
          cy.get("[data-cy='note-icon']").arrowClick();
          cy.get("[data-cy='common.docId']").should("contain.text", "RD-00003");
          cy.get("[data-cy='common.docId']>div").should("contain.text", "");
          cy.get("[data-cy='common.docId']>div>div").should("contain.text", USERS[1].name);
          cy.get("[data-cy='common.docId']>div>div>").should("contain.text", "Effective Date");
        });

        it("Checkbox option 1 checked", () => {
          cy.drSelectDetailsTab();
          cy.get("[data-cy=\"Checkbox\"]").should("be.visible");
          cy.get(`input[type="checkbox"][value="1"]`).last().check();
        });

        it(`Add first Approver as ${USERS[1].name}`, () => {
          cy.drSelectOverviewTab();
          cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
        });
        it("Save Record'", () => {
          cy.drSaveDocumentWithoutaudit();
        });

        it("release button click'", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview, CyRoutes.DocRevPreview], () => {
            cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
          });
        });

        it("Approve record button click", () => {
          cy.ebApprove();
        });

      });
    });
  });

  context("Validate Released Record", () => {
    it("Navigate to Records", () => {
      cy.navigToDocumentList();
      cy.navigToRecords();
      cy.dlClearFilters();
    });

    it("Select the AA inline form", () => {
      cy.dlFilterByDocId({ docId: "RD-00003" });
      cy.dlSelectFirstDocument();
    });

    it("Verify Predefined Fields", () => {
      cy.get("[data-cy=\"field-name\"]").should("exist");
      cy.get("[data-cy=\"description\"]").should("exist");
    });

    it("Verify that two tabs are displayed, Overview and Details tab", () => {
      cy.get("[data-cy=\"tabId.overview\"]").should("exist");
      cy.get("[data-cy=\"tabId.details\"]").should("exist");
    });

    it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      cy.verifyFixedTab();
    });

    it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      cy.verifyFixedTab();
    });

    it("Verify Form opens to the “Overview” tab by default and schema field Approval block", () => {
      cy.get("[data-cy=\"tabCon-tabId.overview\"]").should("have.attr", "aria-selected", "true");
      cy.get("#sm-tabpanel-0").should("be.visible");
      cy.get("[data-cy^=fb-approvals-fb-approvals-]").should("exist");
    });

    it("Verify Header Info", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get("header li>p>div>a>div").should("have.text", "Records");
      cy.get("[data-cy='HeaderInfo'] span").should("contain.text", "RD-00003");
      cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev A");
    });

    it("Click Details Tab, clicking on it should open that tab and close the other one", () => {
      cy.drSelectDetailsTab();
      cy.get("[data-cy=\"tabCon-tabId.details\"]").should("have.attr", "aria-selected", "true");
      cy.get("[data-cy=\"tabCon-tabId.overview\"]").should("have.attr", "aria-selected", "false");
    });

    it("Verify that Details tab contains FB fields then Form Options should appear for this tab", () => {
      cy.get(".formOptionsBox").should("exist");
      cy.get("[data-cy=\"Checkbox\"]").should("be.visible");
    });

    it("Verify that right side panel opens by default to the References tab and that", () => {
      cy.get("[data-cy=\"References\"]").should("exist");
      cy.get("[data-cy=\"generalInfo\"]").should("be.visible");
    });

    it("Verify Right side Pannel Can be expanded or collapsed", () => {
      cy.verifyExpandCollpase();
    });

    it("Verify Reference Tab", () => {
      cy.verifyReferenceTab({ user: USERS[1], formId: "", shortName: "GR" });
    });

    it("Verify Book Mark Navigation", () => {
      cy.verifyReferenceTab({ user: USERS[1], formId: "", shortName: "GR" });
      cy.get("[data-cy=\"bookmark-icon\"]").arrowClick();
      cy.get("[data-cy=\"Bookmarks-detail\"]").should("be.visible");
    });

    context("Verify User able to add Groups or other user permissions", () => {
      it("Open permissions tab", () => {
        cy.drSelectPermissionTab();
      });

      it("Add another user permission", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
          cy.drAddUserFromPermissionTab(USERS[3].name);
        });
      });

      it("Add another group permission", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
          cy.drAddGroupFromPermissionTab("Developers");
        });
      });
    });
  });
});

export { };
