/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { verifyHistoryContent } from "../../utils/context/historyContent";

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

  context("Create ES document for migration", () => {
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
      cy.get("#AttachmentFieldPresenter-field").should("exist");
    });

    it("Enter document title 'ES document'", () => {
      cy.drEnterDocumentTitle({ name: "Migration Equipment specification form" });
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

      it("Add Section", () => {
        cy.fbAddNewFieldWhenHidden();
        cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Section" });
        cy.fbEnterNameValue({ name: "label", value: "Section1" });
        cy.fbAddNewFieldButton();
      });

      it("Save the document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Approve and released", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
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
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.DRAFT,
        title: "Document List",
        docId: "FM-00003",
        revision: "Rev 1",
      });
    });

    it("Verify that it contains Overview, specification", () => {
      cy.verifyTabs("overview", "specification");
    });

    it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      cy.verifyFixedTab();
    });

    it("Verify ES opens to the Overview tab by default", () => {
      cy.isTabActive({ name: "overview", index: 0 });
    });

    it("Verify overview tab predefiend fields up to attachment", () => {
      cy.verifyPredefiendFields();
      cy.get("#AttachmentFieldPresenter-field").should("exist");
    });

    it("Verify Render HTML or comment field ", () => {
      cy.get("[data-cy='field-renderHTML']").should("exist");
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

    it("Add Section", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Section" });
      cy.fbEnterNameValue({ name: "label", value: "Section1" });
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
      cy.get("[data-cy='tabCon-tabId.overview']").should("have.attr", "aria-selected", "false");
      cy.get("#sm-tabpanel-0").should("not.exist");
      cy.get("[data-cy='tabCon-tabId.specification']").should("have.attr", "aria-selected", "true");
    });

    it("Verify Add field button Exist in Specification tab", () => {
      cy.get("[data-cy='form.builder.add.field']").should("exist");
    });

    it("Verify add FB Field Checked checbox", () => {
      cy.get(`input[type="checkbox"][value="1"]`).should("exist");
    });

    it("Verify section", () => {
      cy.get(`[data-cy='Section1']`).should("exist");
    });

    it("Verify that Form Options should  appear for this tab ", () => {
      cy.get(".formOptionsBox").should("exist");
    });
  });

  context("Release ES", () => {
    it("Approve and release  document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Create a required document from release form Verify the layout and Release It", () => {
    context("Create New Document from Release form", () => {
      it("Click 'Create New'", () => {
        cy.drCreateNewDocumentFromForm();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });
    });

    context("Verify Layout of document and Tabs", () => {
      it("Verify The top left of the page displays: Icon and type, ID, Rev stage, status (Draft)", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.DRAFT,
          title: "Document List",
          docId: "ES-00004",
          revision: "Rev 1",
        });
      });

      it("Verify that it contains Overview, specification", () => {
        cy.verifyTabs("overview", "specification");
      });

      it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
        cy.verifyFixedTab();
      });

      it("Verify ES opens to the Overview tab by default", () => {
        cy.isTabActive({ name: "overview", index: 0 });
      });

      it("Verify overview tab predefiend fields up to attachment", () => {
        cy.verifyPredefiendFields();
        cy.get("#AttachmentFieldPresenter-field").should("exist");
      });
    });

    context("Verify Specification tab", () => {
      it("Verify Click Specification Tab", () => {
        cy.drSelectSpecificationTab();
      });

      it("Verify Click Specification Tab, clicking on it should open that tab and close the other one", () => {
        cy.get("[data-cy='tabCon-tabId.overview']").should("have.attr", "aria-selected", "false");
        cy.get("#sm-tabpanel-0").should("not.exist");
        cy.get("[data-cy='tabCon-tabId.specification']").should("have.attr", "aria-selected", "true");
      });

      it("Verify Add field button Exist in Specification tab", () => {
        cy.get("[data-cy='form.builder.add.field']").should("exist");
      });

      it("Verify add FB Field Checked chebox", () => {
        cy.get(`input[type="checkbox"][value="1"]`).should("exist");
      });

      it("Verify add FB Field  textfield", () => {
        cy.get("[name^='es-speciffication-textfield']").should("exist");
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

      it("Navigate to specification tab", () => {
        cy.drSelectSpecificationTab();
      });

      it("Checked chebox value", () => {
        cy.get(`input[type="checkbox"][value="1"]`).check({ force: true });
      });

      it("Enter value in textfield", () => {
        cy.get("[name^='es-speciffication-textfield']").arrowType("Test");
      });

      it("Save the Document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });

    context("Validate Right Side Panel", () => {
      it("Verify that right side panel opens by default to the References tab", () => {
        cy.get("[data-cy='References']").should("exist");
        cy.get("[data-cy='generalInfo']").should("be.visible");
      });

      it("Verify Reference tab Info", () => {
        cy.verifyReferenceTab({ user: USERS[1], formId: "", shortName: "GR" });
      });

      it("Verify Right side pannel Expand and collapse", () => {
        cy.verifyExpandCollpase();
      });

      it("Verify Eye Icon", () => {
        cy.get("[data-cy='references-icon']").should("exist");
      });

      it("Verify References selection Add Remove", () => {
        it("Verify Add/Remove References", () => {
          cy.get(`[data-cy="referenceTo"]`).arrowClick();
          cy.listLoadingElementShouldNotExist();
          cy.get(`[data-cy="referenceTo"]`).arrowType("FM-00001");
          cy.wait(2000).type(`{downarrow}{enter}`);
          cy.drRemoveReferences({ reference: "FM-00001" });
        });
      });

      it("Verify Referenced By, Training ,and Release date Item exist or not", () => {
        cy.verifyReferenceInfo();
        cy.get("[data-cy='common.revision']").should("contain.text", "Revision");
        cy.get("[data-cy='common.revision']").parent().should("contain.text",
          moment().tz("America/Los_Angeles").format("MM/DD/YYYY"));
      });

      context("Verify Revision", () => {
        it("open revision tab", () => {
          cy.get("[data-cy='note-icon']").arrowClick();
        });

        it("Verify revision Rev Document open or not", () => {
          cy.get("[data-cy='DocumentRevisionList-item']").eq(0).arrowClick();
          cy.wait(2000);
          cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev 1");
        });
      });

      context("Verify User able to add Groups or other user permissions", () => {
        it("Open permissions tab", () => {
          cy.drSelectPermissionTab();
        });

        it("Add another user permission", () => {
          cy.drAddUserFromPermissionTab(USERS[3].name);
          cy.listLoadingElementShouldNotExist();
          cy.progressBarShouldNotExist();
        });

        it("Add another group permission", () => {
          cy.wait(2000);
          cy.listLoadingElementShouldNotExist();
          cy.progressBarShouldNotExist();
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocSecurity], () => {
            cy.drAddGroupFromPermissionTab("Developers");
          });
        });
      });

      context("Check document history", () => {
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
              { key: "Access granted to user", value: `${USERS[3].name}` },
            ],
          },
        ];

        it("Verify Doc history", () => {
          cy.drSelectHistoryTab();
        });

        verifyHistoryContent(history, groupOne);
      });

      context("Verify Book Mark", () => {
        it("Verify Book Mark Navigation", () => {
          cy.get("[data-cy='bookmark-icon']").arrowClick();
          cy.get("[data-cy='Bookmarks-detail']").should("be.visible");
        });

        it("Navigate to overview tab", () => {
          cy.drSelectOverviewTab();
        });

        it("Click on bookmarked section, section should be navigated", () => {
          cy.contains("Section1").arrowClick();
          cy.get("[data-cy='Section1']").should("be.visible");
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

        it("Mapped Es Specification text field", () => {
          cy.get("[data-cy^='field-es-speciffication-textfield']" ).arrowClick();
          cy.get("[id^='react-select']").eq(1).autocompleteSelect("ES Speciffication Textfield");
        });

        it("Mapped section1 field", () => {
          cy.get("[data-cy^='field-section-1']" ).arrowClick();
          cy.get("[id^='react-select']").eq(2).autocompleteSelect("Section1");
        });

        it("Mapped checkbox field", () => {
          cy.get("[data-cy^='field-checkbox']" ).arrowClick();
          cy.get("[id^='react-select']").eq(3).autocompleteSelect("Checkbox");
        });

        it("Click on confirm change", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.PostOrPatchDocRev, () => {
            cy.get("[data-cy='common.confirm.change']").arrowClick();
          });
        });

        it("Turn off autosave", () => {
          cy.cmpTurnOffAutosave();
        });

        it("Navigate to specification Tab", () => {
          cy.drSelectSpecificationTab();
        });

        it("Verify the fields data after migration", () => {
          cy.get("[name^='es-speciffication-textfield']").should("have.value", "Test");
          cy.get("[data-cy='Section1']").should("exist");
          cy.get("[value='1']").should("be.checked");
        });

        it("Verify form info should have migrated form 'FM-00002'", () => {
          cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00002");
        });
      });
    });

    context("Fill the fields and Released", () => {
      it("Enter document title 'ES document'", () => {
        cy.drEnterDocumentTitle({ name: "Equipment specification form" });
      });

      it("Fill ES document description", () => {
        cy.drEnterDocumentDescription({ description: "Equipment specification description" });
      });

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
        cy.get("[name^='es-speciffication-textfield']").arrowType("Test");
      });

      it("Click on Save", () => {
        cy.wrapWithWaitOnApiCalls([], () => {
          cy.drClickCreateDocumentWithoutApiCall();
        });
      });

      it("Approve and release  document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });
  });
});

export { };
