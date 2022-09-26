// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { LHRTTest } from "../../utils/constants/documentTypes/lhrt";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { Part } from "../../utils/constants/documentTypes/part";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocumentType;
let partDocumentType;
let equipmentDocument;
let createdPartDocument;
let lhrDocUrl;

context("Autosave LHR", () => {
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
              LotHistoryRecordTest,
              MPITest,
              LHRTTest,
              Part,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Part");
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


    it("[API]Create equipment one", () => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Equipment one</p>",
              document: {
                docId: "ET-00003",
                documentType: {
                  id: equipmentDocumentType[0].id,
                },
                securityList: {
                  operators: [],
                  securityEmployees: [],
                  securityGroups: [
                    {
                      id: group.body[0].id,
                    },
                  ],
                },
              },
              name: "Equipment one",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            equipmentDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: equipmentDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            });
          });
        });
      });
    });

    it("[API]Create part document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Part document</p>",
          document: {
            docId: "PRT-00005",
            documentType: {
              id: partDocumentType[0].id,
            },
            securityList: {
              operators: [],
              securityEmployees: [],
              securityGroups: [
                {
                  id: group.body[0].id,
                },
              ],
            },
          },
          name: "Part document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdPartDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPartDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => {
          done();
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create MPI document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in the MPI attributes", () => {
      it("Enter title 'MPI document", () => {
        cy.drEnterDocumentTitle({ name: "MPI document" });
      });

      it("Enter description 'MPI document description'", () => {
        cy.drEnterDocumentDescription({ description: "MPI document description" });
      });

      it("Select 'Manufacturing Process Instructions Test' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Manufacturing Process Instructions Test" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Navigate to Procedure Tab", () => {
        cy.drSelectProcedureTab();
      });

      context("Fill step #1", () => {
        it("Fill step #1 description", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
          });
        });

        it("Add 'Part document' to step #1", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Part document", quntity: "3", unit: "Each" });
          });
        });

        it("Add 'Equipment one' to step #1", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiAddEquipmentToStep({ numbOfStep: 1, equipment: "Equipment one" });
          });
        });
      });

      context("Release MPI", () => {
        it("Approve and release MPI document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          });
        });
      });
    });
  });

  context("Create LHRt document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.unClick();
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill LHRt document attributes", () => {
      it("Enter document title 'LHRt document'", () => {
        cy.drEnterDocumentTitle({ name: "LHRt document" });
      });

      it("Fill LHRt document description", () => {
        cy.drEnterDocumentDescription({ description: "LHRt document description" });
      });

      it("Select 'LHRt' document type", () => {
        cy.drSelectDocumentType({ documentType: "LHR template" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Lot History Record Test' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Lot History Record Test" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Select 'Part document' for Part to be Manufactured", () => {
        cy.get("[data-cy=\"lhr-selected-part\"]").arrowType("Part document");
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions, CyRoutes.PatchDocRev], () => {
          cy.get("ul>li[role=option]").contains("Part document").arrowClick();
        });
      });

      it("Navigate to Detail Tab", () => {
        cy.drSelectDetailsTab();
      });

      context("Select created MPI in LHR template", () => {
        it("Select MPI document for step #1 in LHRt", () => {
          cy.get("div[class^=\"MuiExpansionPanelSummary\"]").eq(0).arrowClick({ force: true });
          cy.get("input[data-cy^=\"lhrstep-built-in\"]").autocompleteSelect("MPI document");
        });
      });

      context("Release LHRt", () => {
        it("Approve and release LHRt document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });
  });

  context("Create LHR", () => {
    it("Click create new document from LHRt", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev,
        CyRoutes.GetAutocompleteOptions], () => {
        cy.drCreateNewDocumentFromForm();
      });
    });

    it("Enter initial quantity", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
    });

    it("While autosaving, select 'Production' build type", () => {
      cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          res.setDelay(10000);
          res.setThrottle(10);
        });
      }).as("response");

      cy.unClick();
      cy.get("[value=\"Production\"]").check();
      cy.wait("@response", { requestTimeout: 60000, responseTimeout: 60000 });
    });

    it("Change build type to 'R&D'", () => {
      cy.unClick();
      cy.get("[value=\"R&D\"]").check();
    });

    it("While autosaving, add 'Due Date'", () => {
      cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          res.setDelay(10000);
          res.setThrottle(10);
        });
      }).as("response");

      cy.unClick();
      cy.poAddDateRequired();
      cy.unClick();
      cy.url().then((url: any) => {
        lhrDocUrl = url;
      });
      cy.wait("@response", { requestTimeout: 60000, responseTimeout: 60000 });
    });
  });

  context("Add/remove approver and check autosave", () => {
    it("Add first Approver'", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Add second Approver'", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[2].name });
    });

    it("Remove second Approver'", () => {
      cy.contains(`${USERS[2].name} - ${USERS[2].email}`).parent().next().arrowClick();
    });

    it("Reload Page'", () => {
      cy.reload();
      cy.wait(2000);
    });

    it("check approvers after reload page", () => {
      cy.get("[name^=\"fb-approvals-fb-approvals-\"]")
        .should("contain", `${USERS[1].name} - ${USERS[1].email}`);
      cy.get("[name^=\"fb-approvals-fb-approvals-\"]")
        .should("not.contain", `${USERS[2].name} - ${USERS[2].email}`);
    });

    it("check initial quantity", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").should("have.value", "10");
    });

    it("check build type", () => {
      cy.get("[name=\"lhr-build-type\"]").should("be.checked");
    });

    it("check due date", () => {
      cy.get("[name=\"lhr-due-date\"]").invoke("val").should("be.exist");
    });
  });

  context("Complete first step in LHR", () => {
    context("Start LHRs #1", () => {
      it("Navigate to LHR", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
          cy.visit(lhrDocUrl);
        });
      });

      it("Navigate to Detail Tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Click 'START MPI'", () => {
        cy.get("[data-cy=\"LHR Step 1\"]").arrowClick();
        cy.mpiStartStep({ stepNumber: 1 });
      });

      it("Navigate to Procedure Tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Enter 'Start quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-start-quantity\"]").arrowType("10");
        cy.unClick();
      });

      it("While autosaving, enter 'Accepted quntity' for LHRs #1", () => {
        cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
          req.reply((res) => {
            res.setDelay(10000);
            res.setThrottle(10);
          });
        }).as("response");
        cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("6");
        cy.unClick();
        cy.wait("@response", { requestTimeout: 60000, responseTimeout: 60000 });
      });

      it("Change value in 'Accepted quntity' fields", () => {
        cy.get("[name=\"lhrs-accepted-quantity\"]").arrowClick({ force: true })
          .clear().arrowType("8");
        cy.unClick();
      });

      it("While autosaving, enter 'Rejected quntity' for LHRs #1", () => {
        cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
          req.reply((res) => {
            res.setDelay(10000);
            res.setThrottle(10);
          });
        }).as("response");
        cy.get("[name=\"lhrs-rejected-quantity\"]").arrowClick({ force: true })
          .clear().arrowType("2");
        cy.unClick();
        cy.wait("@response", { requestTimeout: 60000, responseTimeout: 60000 });
      });
    });

    context("Add/remove approver and check autosave", () => {

      it("Navigate to overview Tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add first Approver'", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[2].name });
      });

      it("Add second Approver'", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
      });

      it("Remove second Approver'", () => {
        cy.contains(`${USERS[2].name} - ${USERS[2].email}`).parent().next().arrowClick();
      });

      it("check approvers", () => {
        cy.get("[name=\"fb-approvals-approvals-built-in\"]")
          .should("contain", `${USERS[1].name} - ${USERS[1].email}`);
        cy.get("[name=\"fb-approvals-approvals-built-in\"]")
          .should("not.contain", `${USERS[2].name} - ${USERS[2].email}`);
      });

      it("Navigate to Procedure Tab", () => {
        cy.drSelectProcedureTab();
      });

      it("check Start quntity", () => {
        cy.get("[name=\"lhrs-start-quantity\"]").should("have.value", "10");
      });

      it("check Accepted quntity", () => {
        cy.get("[name=\"lhrs-accepted-quantity\"]").should("have.value", "8");
      });

      it("check Rejected quntity", () => {
        cy.get("[name=\"lhrs-rejected-quantity\"]").should("have.value", "2");
      });
    });
  });
});

export { };

