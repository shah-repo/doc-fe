// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { RecordDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let secondEmployee;
let adminEmployee;
let asyncTasksGroup;

context("Record inline approval dates flow", () => {
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
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          done();
        });
      });
    });

    it("[API]Login admin user", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Async Tasks",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        asyncTasksGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: asyncTasksGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [
            {
              id: adminEmployee.id,
            },
            {
              id: secondEmployee.id,
            },
          ],
        },
      });
    });

    context("Login user", () => {
      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
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

        it("Turn off autosave", () => {
          cy.cmpTurnOffAutosave();
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

        it("Add Inline Approval", () => {
          cy.fbClickAddNewHiddenBtn();
          cy.fbSelectItemFromNewFieldList({ field: "Inline Approval" });
          cy.listLoadingElementShouldNotExist();
          cy.fbEnterNameValue({ name: "label", value: "Inline Approval1" });
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

      it("Select approver", () => {
        cy.get("[data-cy^=fb-ia-inline-approval-1-]").autocompleteSelect(`${USERS[2].name}`);
      });

      it("Save Record'", () => {
        cy.drSaveDocumentWithoutaudit();
      });

      it("Send request for approval", () => {
        cy.get("[data-cy=\"form.builder.request.approval\"]").arrowClick();
      });

      it("The owner should have a notification that Record rev 1 is for approval of User 2", () => {
        cy.navigToDashboard();
        cy.contains("IN REVIEW").eq(0).parent().parent().parent().parent()
          .should("contain.text", "RD-00003")
          .and("contain.text", "Record title")
          .and("contain.text", "IN REVIEW")
          .and("contain.text", "pending approvals from");
        cy.contains("IN REVIEW").parent().parent().parent().parent().next()
          .find("span").eq(0)
          .and("contain.text", `${USERS[2].name}`);
      });

      context(`Notification of approval for ${USERS[2].name}`, () => {
        it(`Login as ${USERS[2].name} to dashboard`, () => {
          cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
        });

        it("check notification", () => {
          cy.contains(`${USERS[1].name}needs your approval for`).eq(0).parent().parent().parent().parent()
            .should("contain.text", USERS[1].name)
            .and("contain.text", "RD-00003")
            .and("contain.text", "Record title");
        });

        it(`Login as ${USERS[1].name} to dashboard`, () => {
          cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
        });
      });
    });

    context("Time travel 10 days back to the future", () => {
      it(`Time travel 10 days back to the future`, () => {
        cy.recSetTimeTravelInDays({ days: 10 });
      });
    });

    context(`Approval from ${USERS[2].name}`, () => {
      it(`Login as ${USERS[2].name} to dashboard`, () => {
        cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
      });

      it("check notification", () => {
        cy.contains("needs your approval for").eq(0).parent().parent().parent().parent()
          .should("contain.text", USERS[1].name)
          .and("contain.text", "RD-00003")
          .and("contain.text", "Record title");
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

      it("Notification should disappear from dashboard now for user 2", () => {
        cy.dashVerifyNoPendingActions();
      });
    });

    context(`Notification of approved record for ${USERS[1].name}`, () => {
      it(`Login as ${USERS[1].name} to dashboard`, () => {
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      });

      it("There should be a notification that Rev 1 is approved", () => {
        cy.contains("Rev 1 Record title").parent()
          .should("have.text", "Rev 1 Record title");
      });

      it("Open Record", () => {
        cy.contains("RD-00003").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.cmpTurnOffAutosave();
      });

      it("Rev 1 will be released and rev 2 will automatically be created", () => {
        cy.get("[data-cy=\"revision\"]").eq(0).should("have.text", "Revision 2  - WIP");
        cy.get("[data-cy=\"revision\"]").eq(1).should("have.text", "Revision 1  - Last Signed");
      });
    });

    context("Time travel 5 days back to the future", () => {
      it(`Time travel 5 days back to the future`, () => {
        cy.recSetTimeTravelInDays({ days: 5 });
      });
    });

    context("Click on 'Finalize and Release', rev 2 will update to rev A and will be released", () => {
      it("Goto Records", () => {
        cy.navigToRecords();
      });

      it("Open Record", () => {
        cy.contains("RD-00003").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.cmpTurnOffAutosave();
      });

      it("Click on 'Finalize and Release'", () => {
        cy.get("[data-cy=\"revision\"]").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();

        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.ReleaseDocRevWithoutAr], () => {
          cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
        });
      });

      it("Goto Dashboard", () => {
        cy.navigToDashboard();
      });

      it("There should be a notification that rev A is released", () => {
        cy.contains("RELEASED").eq(0).parent().parent().parent().parent()
          .should("contain.text", "RD-00003")
          .and("contain.text", "Record title")
          .and("contains.text", "RELEASED");

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
          cy.get("[data-cy^=fb-approvals-fb-approvals-]").autocompleteSelect(USERS[2].name);
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
        cy.drCheckDocumentStatus({ status: "In Review" });
      });
    });

    context(`Notification of record for ${USERS[1].name}`, () => {
      it("The owner should have a notification that Record rev 1 is for approval of User 2", () => {
        cy.navigToDashboard();
        cy.contains("IN REVIEW").eq(0).parent().parent().parent().parent()
          .should("contain.text", "RD-00003")
          .and("contain.text", "Record title")
          .and("contain.text", "IN REVIEW")
          .and("contain.text", "pending approvals from");
        cy.contains("IN REVIEW").parent().parent().parent().parent().next()
          .find("span").eq(0)
          .and("contain.text", `${USERS[2].name}`);
      });
    });

    context("Time travel 5 days back to the future", () => {
      it(`Time travel 5 days back to the future`, () => {
        cy.recSetTimeTravelInDays({ days: 5 });
      });
    });

    context(`Notification for approval for ${USERS[2].name}`, () => {
      it(`Login as ${USERS[2].name} to dashboard`, () => {
        cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
      });

      it("Reject approval", () => {
        cy.get("[data-cy=dashboardFeedList]>div").contains(`${USERS[1].name}needs your approval forRD-00003`)
          .parent()
          .parent()
          .parent().trigger("mouseover")
          .find(`[data-cy="transition-reject"]`).first()
          .arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.checkToastMessage({ exists: false });
      });
    });

    context(`Notification of rejected record for ${USERS[1].name}`, () => {
      it(`Login as ${USERS[1].name} to dashboard`, () => {
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      });

      it("There should be a notification that User 2 has rejected AR", () => {
        cy.contains(`${USERS[2].name}REJECTEDRD-00003`).eq(0).parent().parent().parent().parent()
          .should("contain.text", "RD-00003")
          .and("contain.text", "REJECTED")
          .and("contain.text", USERS[2].name);
      });

      it("Open Record", () => {
        cy.contains("RD-00003").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.cmpTurnOffAutosave();
      });

      it("Record should be in WIP status", () => {
        cy.drCheckDocumentStatus({ status: "WIP" });
      });
    });
  });
});

export { };
