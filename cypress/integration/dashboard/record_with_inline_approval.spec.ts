// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { RecordDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let firstEmployee;
let secondEmployee;

context("Records test with Inline approval", () => {
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
            companyAdminEmail: USERS[11].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[12], USERS[3], USERS[4]],
            documentTypes: [
              {
                ...RecordDocumentType,
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
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          firstEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[11].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[12].email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[12].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[11].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[11], employeeId: firstEmployee.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Create Record with form", () => {
    context("Start document creation flow", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in document attributes", () => {
      it("Enters title", () => {
        cy.drEnterDocumentTitle({ name: "first record title" });
      });

      it("Enters description", () => {
        cy.drEnterDocumentDescription({ description: "first record description" });
      });

      it("Selects 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Selects 'Record Document' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Record Document" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Open details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Add TextField", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "Name" });
        cy.fbAddNewFieldButton();
      });

      it("Add Inline Approval", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
        cy.listLoadingElementShouldNotExist();
        cy.fbEnterNameValue({ name: "label", value: "Inline Approval1" });
        cy.get("[data-cy=\"editorConfig.groups\"]").autocompleteSelect("Everyone");
        cy.fbAddNewFieldButton();
      });

      it("Add TextField", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "Age" });
        cy.fbAddNewFieldButton();
      });

      it("Add Inline Approval", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
        cy.listLoadingElementShouldNotExist();
        cy.fbEnterNameValue({ name: "label", value: "Inline Approval2" });
        cy.get("[data-cy=\"editorConfig.groups\"]").autocompleteSelect("Everyone");
        cy.fbAddNewFieldButton();
      });

      it("Save the form", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Approve and Release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create new Record", () => {
    it("Create new record button click", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title 'Record title'", () => {
      cy.drEnterDocumentTitle({ name: "Record title" });
    });

    it("Open details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Enter name", () => {
      cy.get("[name^=name-]").arrowType("test");
    });

    it("Select approver", () => {
      cy.get("[data-cy^=fb-ia-inline-approval-1-]").autocompleteSelect(`${USERS[12].name}`);
    });

    it("Save Record'", () => {
      cy.drSaveDocumentWithoutaudit();
    });

    it("Send request for approval", () => {
      cy.get("[data-cy=\"form.builder.request.approval\"]").arrowClick();
      cy.wait(5000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Record is in WIP status", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
    });

    it("The owner should have a notification that Record rev 1 is for approval of User 2", () => {
      cy.navigToDashboard();
      cy.listLoadingElementShouldNotExist();
      cy.contains(`${STATUS_TYPES_LABEL.IN_REVIEW}`).eq(0).parent().parent().parent().parent()
        .should("contain.text", "RD-00003")
        .and("contain.text", "Record title")
        .and("contain.text", `${STATUS_TYPES_LABEL.IN_REVIEW}`)
        .and("contain.text", "pending approvals from");
      cy.contains(`${STATUS_TYPES_LABEL.IN_REVIEW}`).parent().parent().parent().parent().next()
        .find("span").eq(0)
        .and("contain.text", `${USERS[12].name}`);
    });

    it("Log out", () => {
      cy.authLogout();
    });
  });

  context(`Notification for approval for ${USERS[12].name}`, () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[12], employeeId: secondEmployee.id });
    });

    it("Click approve for Record", () => {
      cy.wait(2000);
      cy.dashApproverFirstFromList();
    });

    it("Log out", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[11], employeeId: firstEmployee.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Notification to Record owner", () => {
    it("There should be a notification that Rev 1 is Released", () => {
      cy.contains("Rev 1 Record title").parent()
        .should("have.text", "Rev 1 Record title");
    });

    it("Open Record", () => {
      cy.contains("RD-00003").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Click on revisions tab on side panel", () => {
      cy.drClickRevisionsSidePanel();
    });

    it("Rev 1 will be released and rev 2 will automatically be created", () => {
      cy.get("[data-cy=\"revision\"]").eq(0).should("have.text", "Revision 2  - WIP");
      cy.get("[data-cy=\"revision\"]").eq(1).should("have.text", "Revision 1  - Last Signed");
    });
  });

  context("Add yourself as an approver of the inline and check notification", () => {
    it("Enter age", () => {
      cy.get("[data-cy=\"revision\"]").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drSelectDetailsTab();
      cy.get("[name^=age-]").should("exist");
      cy.get("[name^=age-]").arrowType("10");
    });

    it("Select approver", () => {
      cy.get("[data-cy^=fb-ia-inline-approval-2-]").autocompleteSelect(`${USERS[11].name}`);
    });

    it("Save Record'", () => {
      cy.drSaveDocumentWithoutaudit();
    });

    it("Send request for approval", () => {
      cy.get("[data-cy=\"form.builder.request.approval\"]").arrowClick();
      cy.wait(5000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Record is in WIP status", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
    });

    it("Goto Dashboard", () => {
      cy.navigToDashboard();
    });

    it("check notification", () => {
      cy.contains("needs your approval for").eq(0).parent().parent().parent().parent()
        .should("contain.text", USERS[11].name)
        .and("contain.text", "RD-00003")
        .and("contain.text", "Record title");

      cy.contains("Rev 2 Record title").parent()
        .should("have.text", "Rev 2 Record title");
    });

    it("Click approve", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PostApprovalsApprove], () => {
          cy.contains("needs your approval for").eq(0).trigger("mouseover");
          cy.get("[data-cy=\"transition-approve\"]").first().trigger("mouseover");
          cy.get("[data-cy=\"transition-approve\"]").first().arrowClick();
          cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
          cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
        });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });

    it("Open Record", () => {
      cy.contains("RD-00003").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on revisions tab on side panel", () => {
      cy.drClickRevisionsSidePanel();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("rev 3 will be created", () => {
      cy.get("[data-cy=\"revision\"]").eq(0).should("have.text", "Revision 3  - WIP");
      cy.get("[data-cy=\"revision\"]").eq(1).should("have.text", "Revision 2  - Last Signed");
      cy.get("[data-cy=\"revision\"]").eq(2).should("have.text", "Revision 1  - Archive");
      cy.wait(3000);
    });
  });

  context("Click on 'Finalize and Release', rev 3 will update to rev A and will be released", () => {
    it("Click on 'Finalize and Release'", () => {
      cy.get("[data-cy=\"revision\"]").eq(0).arrowClick().wait(500);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();

      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.ReleaseDocRevWithoutAr], () => {
        cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("There should be a notification that rev A is released", () => {
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
      cy.get("[data-cy=\"revision\"]").eq(0).should("have.text", "Revision A  - Released");
    });

    it("Goto Dashboard", () => {
      cy.navigToDashboard();
    });

    it("There should be a notification that rev A is released", () => {
      cy.contains(`${STATUS_TYPES_LABEL.RELEASED}`).eq(0).parent().parent().parent().parent()
        .should("contain.text", "RD-00003")
        .and("contain.text", "Record title")
        .and("contains.text", `${STATUS_TYPES_LABEL.RELEASED}`);

      cy.contains("Rev A Record title").parent()
        .should("have.text", "Rev A Record title");
    });
  });

  context("Revise record and check flow", () => {
    it("revise record", () => {
      cy.contains("RD-00003").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"updateRecord\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add approvals", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PostApprovals, () => {
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").autocompleteSelect(USERS[11].name);
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").autocompleteSelect(USERS[12].name);
      });
    });

    it("Save Record'", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PatchDocRev], () => {
          cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
        });
    });

    it("Submit for approval", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview, CyRoutes.DocRevPreview], () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      });
    });

    it("Status is 'In Review'", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
    });
  });

  context("Check notifications on dashboard", () => {
    it("Goto dashboard", () => {
      cy.navigToDashboard();
    });

    it("Owner should get a notification that Record is in review and pending approval from 2 users", () => {
      cy.contains(`${STATUS_TYPES_LABEL.IN_REVIEW}`).eq(0).parent().parent().parent().parent()
        .should("contain.text", "RD-00003")
        .and("contain.text", "Record title")
        .and("contain.text", `${STATUS_TYPES_LABEL.IN_REVIEW}`)
        .and("contain.text", "pending approvals from");
      cy.contains(`${STATUS_TYPES_LABEL.IN_REVIEW}`).parent().parent().parent().parent().next()
        .find("span").eq(0)
        .should("contain.text", `${USERS[11].name}`)
        .and("contain.text", `${USERS[12].name}`);
    });

    it("Log out", () => {
      cy.authLogout();
    });
  });

  context("User 2 approve the Record", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[12], employeeId: secondEmployee.id });
    });

    it("Click approve for the Record", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PostApprovalsApprove], () => {
          cy.contains("needs your approval for").eq(0).trigger("mouseover");
          cy.get("[data-cy=\"transition-approve\"]").first().trigger("mouseover");
          cy.get("[data-cy=\"transition-approve\"]").first().arrowClick();
          cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
          cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
        });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });
  });

  context("Check notifications on owner dashboard", () => {
    it("Log out", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[11], employeeId: firstEmployee.id });
    });

    it("Owner should get a notification that Record is in review and pending approval from 1 user", () => {
      cy.contains(`${STATUS_TYPES_LABEL.IN_REVIEW}`).eq(0).parent().parent().parent().parent()
        .should("contain.text", "RD-00003")
        .and("contain.text", "Record title")
        .and("contain.text", `${STATUS_TYPES_LABEL.IN_REVIEW}`)
        .and("contain.text", "pending approvals from");
      cy.contains(`${STATUS_TYPES_LABEL.IN_REVIEW}`).parent().parent().parent().parent().next()
        .find("span").eq(0)
        .should("contain.text", `${USERS[11].name}`);
    });

    it("Click approve for the Record", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PostApprovalsApprove], () => {
          cy.contains("needs your approval for").trigger("mouseover");
          cy.get("span > svg[data-cy=\"transition-approve\"]").first().trigger("mouseover");
          cy.get("span > svg[data-cy=\"transition-approve\"]").first().arrowClick().wait(1000);
          cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
          cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
        });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });

    it("Record notification should change to Released", () => {
      cy.contains(`${STATUS_TYPES_LABEL.RELEASED}`).parent().parent().parent().parent()
        .should("contain.text", "RD-00003")
        .and("contain.text", "Record title");
    });
  });
});

export { };

