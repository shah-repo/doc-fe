// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

const runId = new Date().valueOf();
let createdCompany;
let loginResponse;
let multipleCompanies;

context("Record inline Flow", () => {
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
      SystemRequirement("REQ-0400", "REQ-0410", "REQ-0420", "REQ-0440");
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response) => {
        loginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAcronym: `T1${runId}`,
            companyAdminEmail: USERS[1].email,
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: USERS[5].email,
            numOfRevStages: 3,
            name: `Test Company ${runId}`,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                documentTypeName: "Legal Record",
                documentTypeAcronym: "LR-",
                group: "RECORD",
                isQms: true,
                needsSignature: true,
                category: "Record",
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: "Tester1!",
      });
    });

    it("Select company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("FORM document creation flow", () => {

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
        cy.drSelectOutputDocumentType({ documentType: "Legal Record" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Verify approvals field is automatically added", () => {
        SystemRequirement("REQ-0980");
        cy.get("div[data-cy=\"form.builder.approvals\"]").should("exist");
      });

      it("Add textfield", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectTextField();
        cy.fbAddLabelName({ name: "Textfield for inline" });
        cy.fbAddField();
      });

      it("Add inline approval", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.wrapWithWaitOnApiCall(CyRoutes.GetGroupsApprovalRoles, () => {
          cy.fbSelectInlineApproval();
        });
        cy.get("[name=\"label\"]").type("Inline field");
        cy.fbAddApproverToInlineDialog({ approverName: USERS[2].name });
        cy.fbAddField();
      });

      it("Add second textfield", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.wait(1000);
        cy.fbSelectTextField();
        cy.fbAddLabelName({ name: "Second textfield for inline" });
        cy.fbAddField();
      });

      it("Add second inline approval", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectInlineApproval();
        cy.get("[name=\"label\"]").type("Second inline field");
        cy.fbAddApproverToInlineDialog({ approverName: USERS[2].name });
        cy.fbAddApproverToInlineDialog({ approverName: USERS[3].name });
        cy.fbAddField();
      });
    });

    context("Create document and release it", () => {
      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create record", () => {
    it("Navigate to records", () => {
      cy.navigToRecords();
    });

    it("Click on create new and chose 'Legal Record'", () => {
      cy.recCreateRecordFromLandingPage();
      cy.recSelectRecordFormFromMultiSelect({ recordType: "Legal Record" });
    });

    context("Fill in document attributes", () => {
      it("Enter title 'Record Document Revision'", () => {
        cy.drEnterDocumentTitle({ name: "Record Document Revision" });
      });

      it("Enter description 'Record Document Revision description'", () => {
        cy.drEnterDocumentDescription({ description: "Record Document Revision description" });
      });

      it("Enter text 'First entry' in textfield for inline", () => {
        SystemRequirement("REQ-1080");
        cy.get("[data-cy^=\"textfield-for-inline\"]").click().type("First entry");
      });

      it("Enter text 'First entry' in second textfield for inline", () => {
        SystemRequirement("REQ-1080");
        cy.get("[data-cy^=\"second-textfield-for-inline\"]")
          .click().type("First entry");
      });

      it("Select approver for first inline", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals, CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit],
          () => {
            cy.get("[name*=\"fb-ia-inline-field\"] input")
              .type("enlil.testmail+cy2{downarrow}{enter}", { force: true });
          });
      });

      it("Select approver for second inline", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals],
          () => {
            cy.get("[name*=\"fb-ia-second-inline-field\"] input")
              .type("enlil.testmail+cy2{downarrow}{enter}", { force: true });
          });
      });

      it("Save record", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Check inline record creation default to numeric revision", () => {
        SystemRequirement("REQ-1020");
        cy.get("[data-cy=\"DocumentRevisionList-item\"]:nth-child(1)>a:nth-child(1)>div")
          .contains("Revision 1");
      });

      it("Check approve button is not disabled", () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").should("not.be.disabled");
      });
    });

    context("Approve Inline Approval", () => {
      it("Approve first Inline Approval", () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").first().click();
        cy.get("input[name=\"password\"]").type("Tester1!");
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.PostApprovalsApprove,
          CyRoutes.EmployeesGet,
          CyRoutes.DocPreview], () => {
          cy.get("[data-cy=\"common.confirm\"]").click();
        });
      });

      // it("Reload page", () => {
      //   cy.wrapWithWaitOnApiCall(CyRoutes.GetDocAggregatedAudit, () => {
      //     cy.reload();
      //   });
      // });

      // it("Click WIP document", () => {
      //   cy.wrapWithWaitOnApiCalls([
      //     CyRoutes.EmployeesGet,
      //     CyRoutes.DocPreview,
      //     CyRoutes.GetRequiredApproversDocRev], () => {
      //     cy.get("[data-cy=\"DocumentRevisionList-item\"]").first().click();
      //   });
      // });

      it("Check system creates new major revision after inline approve", () => {
        SystemRequirement("REQ-1040");
        cy.get("[data-cy=\"DocumentRevisionList-item\"]:nth-child(1)>a:nth-child(1)>div")
          .contains("Revision 2");
      });

      context("Change textfield and approve again", () => {
        it("Enter text 'Second entry' in textfield for inline", () => {
          SystemRequirement("REQ-1080");
          cy.get("[data-cy^=\"textfield-for-inline\"]").click().type(", Second entry");
        });

        it("Save record", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Verify system asks for another approval afer changing section", () => {
          SystemRequirement("REQ-1050");
          cy.get("[data-cy^=\"form.builder.approval.pending\"]")
            .first()
            .should("have.text", "Inline approval pending");
        });

        it("Approve first Inline Approval", () => {
          cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").first().click();
          cy.get("input[name=\"password\"]").type("Tester1!");
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.PostApprovalsApprove,
            CyRoutes.EmployeesGet,
            CyRoutes.DocPreview], () => {
            cy.get("[data-cy=\"common.confirm\"]").click();
          });
        });

        // it("Reload page", () => {
        //   cy.wrapWithWaitOnApiCall(CyRoutes.GetDocAggregatedAudit, () => {
        //     cy.reload();
        //   });
        // });

        // it("Click WIP document", () => {
        //   cy.wrapWithWaitOnApiCalls([
        //     CyRoutes.EmployeesGet,
        //     CyRoutes.DocPreview,
        //     CyRoutes.GetRequiredApproversDocRev], () => {
        //     cy.get("[data-cy=\"DocumentRevisionList-item\"]").first().click();
        //   });
        // });

        it("Approve second Inline Approval", () => {
          cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").first().click();
          cy.get("input[name=\"password\"]").type("Tester1!");
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.PostApprovalsApprove,
            CyRoutes.EmployeesGet,
            CyRoutes.DocPreview], () => {
            cy.get("[data-cy=\"common.confirm\"]").click();
          });
        });

        // it("Reload page", () => {
        //   cy.wrapWithWaitOnApiCall(CyRoutes.GetDocAggregatedAudit, () => {
        //     cy.reload();
        //   });
        // });

        // it("Click WIP document", () => {
        //   cy.wrapWithWaitOnApiCalls([
        //     CyRoutes.EmployeesGet,
        //     CyRoutes.DocPreview,
        //     CyRoutes.GetRequiredApproversDocRev], () => {
        //     cy.get("[data-cy=\"DocumentRevisionList-item\"]").first().click();
        //   });
        // });

      });

      context("Edit and try to release it ", () => {
        it("Enter text 'Third entry' in textfield for inline", () => {
          SystemRequirement("REQ-1080");
          cy.get("[data-cy^=\"textfield-for-inline\"]").click().type(", Third entry");
        });

        it("Save record", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Approve Inline Approval", () => {
          cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").first().click();
          cy.get("input[name=\"password\"]").type("Tester1!");
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.PostApprovalsApprove,
            CyRoutes.EmployeesGet,
            CyRoutes.DocPreview], () => {
            cy.get("[data-cy=\"common.confirm\"]").click();
          });
        });

        // it("Reload page", () => {
        //   cy.wrapWithWaitOnApiCall(CyRoutes.GetDocAggregatedAudit, () => {
        //     cy.reload();
        //   });
        // });

        // it("Click WIP document", () => {
        //   cy.wrapWithWaitOnApiCalls([
        //     CyRoutes.EmployeesGet,
        //     CyRoutes.DocPreview,
        //     CyRoutes.GetRequiredApproversDocRev], () => {
        //     cy.get("[data-cy=\"DocumentRevisionList-item\"]").first().click();
        //   });
        // });
      });

      context("Approve and Release document and verify record is in alpha", () => {
        it("Approve and release it", () => {
          cy.recApproveAndReleaseInlineRecord();
        });

        it("Verify record is in alpha state", () => {
          SystemRequirement("REQ-1060");
          cy.get("[data-cy=\"DocumentRevisionList-item\"]:nth-child(1)>a:nth-child(1)>div")
            .contains("Revision A");
        });
      });
    });
  });
});

export { };


