/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;


context("Verification of Equipment Specification", () => {
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
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create ES document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.unClick();
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });
  });
  context("Fill ES document attributes", () => {
    it("Verify predefiend fields title description doc id revision output type", () => {
      cy.verifyPredefiendFields();
    });

    it("Enter document title 'ES document'", () => {
      cy.drEnterDocumentTitle({ name: "Equipment specification form" });
    });

    it("Fill ES document description", () => {
      cy.drEnterDocumentDescription({ description: "Equipment specification description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Equipment specification' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Equipment Specification" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });


  context("Verify Layout of document and Tabs", () => {
    it("Verify The top left of the page displays: Icon and type, ID, Rev stage, status (Draft)", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.get("header li>p>div>a>div").should("have.text", "Document List");
      cy.get("[data-cy='HeaderInfo'] span").should("contain.text", "FM-00002");
      cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev 1");
    });

    it("Verify that it contains Overview, specification", () => {
      cy.get("[data-cy=\"tabId.overview\"]").should("exist");
      cy.get("[data-cy=\"tabId.specification\"]").should("exist");
    });

    it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      cy.verifyFixedTab();
    });

    it("Verify ES opens to the Overview tab by default", () => {
      cy.get("[data-cy=\"tabCon-tabId.overview\"]").should("have.attr", "aria-selected", "true");
      cy.get("#sm-tabpanel-0").should("be.visible");
    });

    it("Verify overview tab predefiend fields up to attachment", () => {
      cy.verifyPredefiendFields();
    });

    it("Verify Render HTML or comment field ", () => {
      cy.get("[data-cy=\"field-renderHTML\"]").should("exist");
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

  });

  context("Add FB Fields", () => {
    it("Navigate to specification tab", () => {
      cy.drSelectSpecificationTab();
    });

    it("Add textfield", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "ES Speciffication Textfield" });
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

    it("Save the document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Verify Specification tab", () => {
    it("Verify Click Specification Tab", () => {
      cy.drSelectSpecificationTab();
    });

    it("Verify Click Specification Tab, clicking on it should open that tab and close the other one", () => {
      cy.get("[data-cy=\"tabCon-tabId.overview\"]").should("have.attr", "aria-selected", "false");
      cy.get("#sm-tabpanel-0").should("be.hidden");
      cy.get("[data-cy=\"tabCon-tabId.specification\"]").should("have.attr", "aria-selected", "true");
    });

    it("Verify Add field button Exist in Specification tab", () => {
      cy.get("[data-cy=\"form.builder.add.field\"]").should("exist");

    });

    it("Verify Add field button Exist in Specification tab", () => {
      cy.get("[data-cy=\"form.builder.add.field\"]").should("exist");

    });

    it("Verify add FB Field Checked chebox", () => {
      cy.get(`input[type="checkbox"][value="1"]`).should("exist");
    });

    it("Verify that Form Options should  appear for this tab ", () => {
      cy.get(".formOptionsBox").should("exist");
    });

  });

  context("Release ES", () => {
    it("Approve and release  document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create a required document from release form Verify the layout and Release It", () => {

    context("Create New Document from Release form", () => {
      it("Click 'Create New'", () => {
        cy.drCreateNewDocumentFromForm();
      });
    });

    context("Verify Layout of document and Tabs", () => {
      it("Verify The top left of the page displays: Icon and type, ID, Rev stage, status (Draft)", () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
        cy.get("header li>p>div>a>div").should("have.text", "Document List");
        cy.get("[data-cy='HeaderInfo'] span").should("contain.text", "ES-00003");
        cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev 1");
      });

      it("Verify that it contains Overview, specification", () => {
        cy.get("[data-cy=\"tabId.overview\"]").should("exist");
        cy.get("[data-cy=\"tabId.specification\"]").should("exist");
      });

      it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
        cy.verifyFixedTab();
      });

      it("Verify ES opens to the Overview tab by default", () => {
        cy.get("[data-cy=\"tabCon-tabId.overview\"]").should("have.attr", "aria-selected", "true");
        cy.get("#sm-tabpanel-0").should("be.visible");
      });

      it("Verify overview tab predefiend fields up to attachment", () => {
        cy.verifyPredefiendFields();
      });
    });

    context("Verify Specification tab", () => {
      it("Verify Click Specification Tab", () => {
        cy.drSelectSpecificationTab();
      });

      it("Verify Click Specification Tab, clicking on it should open that tab and close the other one", () => {
        cy.get("[data-cy=\"tabCon-tabId.overview\"]").should("have.attr", "aria-selected", "false");
        cy.get("#sm-tabpanel-0").should("be.hidden");
        cy.get("[data-cy=\"tabCon-tabId.specification\"]").should("have.attr", "aria-selected", "true");
      });

      it("Verify Add field button Exist in Specification tab", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").should("exist");

      });

      it("Verify add FB Field Checked chebox", () => {
        cy.get(`input[type="checkbox"][value="1"]`).should("exist");
      });

      it("Verify add FB Field  textfield", () => {
        cy.get("[name^=\"es-speciffication-textfield\"]").should("exist");
      });

      it("Verify that Form Options should  appear for this tab ", () => {
        cy.get(".formOptionsBox").should("exist");
      });

    });

    context("Fill the form", () => {
      it("Fill the record details'", () => {
        cy.drEnterDocumentTitle({ name: "ES Test title" });
        cy.drEnterDocumentDescription({ description: "ES Test Description" });
      });
      it("Save the Document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });


    context("Validate Right Side Panel", () => {


      it("Verify that right side panel opens by default to the References tab", () => {
        cy.get("[data-cy=\"References\"]").should("exist");
        cy.get("[data-cy=\"generalInfo\"]").should("be.visible");
      });

      it("Verify Reference tab Info", () => {
        cy.verifyReferenceTab({ user: USERS[1], formId: "", shortName: "GR" });
      });

      it("Verify Right side pannel Expand and collapse", () => {
        cy.verifyExpandCollpase();
      });

      it("Verify Eye Icon", () => {
        cy.get("[data-cy=\"references-icon\"]").should("exist");
      });


      it("Verify References selection Add Remove", () => {
        cy.verifyAddRemoveReference({ formId: "FM-00001" });
      });

      it("Verify Referenced By, Training ,and Release date Item exist or not", () => {
        cy.verifyReferenceInfo();
        cy.get("[data-cy='common.revision']").should("contain.text", "Revision");
        cy.get("[data-cy='common.revision']").parent().should("contain.text",
          moment().tz("America/Los_Angeles").format("YYYY.MM.DD"));
      });

      context("Verify Revision", () => {
        it("open revision tab", () => {
          cy.get("[data-cy=\"note-icon\"]").arrowClick();
        });

        it("Verify revision Rev Document open or not", () => {
          cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(0).arrowClick();
          cy.wait(2000);
          cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev 1");
        });
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

      context("Check document history", () => {
        const groupOne = "Developers";
        let groupTwo;
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
              { key: "Access granted to user", value: `${USERS[3].name}` },
            ],
          },
        ];
        it("Verify Doc history", () => {
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
                if (action.key === "Access granted to group") {
                  cy.get(`[data-cy^="change-value-${groupIndex}-${index}"]`).should(($identifier) =>  {
                    expect($identifier.text()).to.be.oneOf([groupOne, groupTwo, "Everyone"]);
                  });
                }
                else {
                  cy.get(`[data-cy^="change-value-${groupIndex}-${index}"]`)
                    .contains(action.key === "New owner" ? new RegExp("^" + action.value) : action.value)
                    .parent()
                    .parent()
                    .within(() => {
                      cy.get(`[data-cy^=change-key-${groupIndex}-${index}]`).should("have.text", typeOfChange);
                      cy.get(`[data-cy^=change-value-${groupIndex}-${index}]`)
                        .should("contain.text", contentOfChange);
                    });
                }
              }
            });
          });
        });
      });

      context("Verify Book Mark", () => {
        it("Verify Book Mark Navigation", () => {
          cy.get("[data-cy=\"bookmark-icon\"]").arrowClick();
          cy.get("[data-cy=\"Bookmarks-detail\"]").should("be.visible");
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

    });


    context("Fill the fields and Released", () => {
      it("Navigate to overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
        cy.progressBarShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Navigate to specification tab", () => {
        cy.drSelectSpecificationTab();
      });

      it("Checked chebox value", () => {
        cy.get(`input[type="checkbox"][value="1"]`).check({ force: true });
      });

      it("Enter value in textfield", () => {
        cy.get("[name^=\"es-speciffication-textfield\"]").arrowType("Test");
      });

      it("Click on Save", () => {
        cy.wrapWithWaitOnApiCalls([], () => {
          cy.drClickCreateDocumentWithoutApiCall();
        });
      });

      it("Approve and release  document", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });
  });
});

export { };
