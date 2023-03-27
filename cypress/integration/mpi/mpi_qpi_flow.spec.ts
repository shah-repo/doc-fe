// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { QPITest } from "../../utils/constants/documentTypes/qpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocumentType;
let materialsDocumentType;
let equipmentDocument;
let materialsDocument;

context("Mpi/Qpi flow", () => {
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
              MPITest,
              QPITest,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
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

    it("[API]Create material one", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Materials document</p>",
          document: {
            docId: "MT-00004",
            documentType: {
              id: materialsDocumentType[0].id,
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
          name: "Material one",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        materialsDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: materialsDocument.id,
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

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("MPI Draft -> Released lifecycle", () => {

    context("Create MPI document", () => {
      context("Start document creation flow", () => {
        it("Navigate to Document list", () => {
          cy.navigToDocumentList();
        });

        it("Click on 'Create a document' button", () => {
          cy.cmpClickCreateNewDocument();
        });
      });

      context("Fill in the MPI attributes and verify state", () => {
        it("Enter title 'MPI document", () => {
          cy.drEnterDocumentTitle({ name: "MPI document1" });
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

        it("Turn on autosave", () => {
          cy.cmpTurnOnAutosave();
        });

        it("Verify MPI state should be 'Draft'", () => {
          SystemRequirement("REQ-3050");
          cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
        });
      });

      context("Fill step #1 and check autosave", () => {
        it("Select Procedure tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Add attachment and check autosave", () => {
          cy.contains("Step #1").parentsUntil("li")
            .find("[data-cy=\"albumMediaButton\"]").arrowClick();
          cy.elUploadAttachment({
            fileName: "image.jpg",
            el: "fb-mediaalbum-upload-mpi-procedure-built-in.attachments",
          });
          cy.listLoadingElementShouldAppear();
          cy.progressBarShouldNotExist();
        });

        it("While autosaving, fill step #1 description and check autosave", () => {
          cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
            req.reply((res) => {
              res.setDelay(10000);
              res.setThrottle(10);
            });
          }).as("response");
          cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
          cy.wait("@response", { requestTimeout: 60000, responseTimeout: 60000 });
        });

        it("Delete attachment and check autosave", () => {
          cy.get(`[id="fb-mediaalbum-upload-mpi-procedure-built-in.attachments"]`).parent()
            .find("button").eq(3).click({ force: true });
          cy.progressBarShouldAppear();
        });

        it("Add 'Material one' to step #1 and check autosave", () => {
          cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Material one", quntity: "3", unit: "Each" });
        });

        it("While autosaving, add 'Equipment one' to step #1 and check autosave", () => {
          cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
            req.reply((res) => {
              res.setDelay(10000);
              res.setThrottle(10);
            });
          }).as("response");
          cy.mpiAddEquipmentToStep({ numbOfStep: 1, equipment: "Equipment one" });
          cy.wait("@response", { requestTimeout: 60000, responseTimeout: 60000 });
        });

        it("While autosaving, delete Material and check for autosave", () => {
          cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
            req.reply((res) => {
              res.setDelay(10000);
              res.setThrottle(10);
            });
          }).as("response");
          cy.get("[data-cy=\"form.builder.mpi.procedure.materials.title\"]").parent().parent()
            .find("button").last().click();
          cy.wait("@response", { requestTimeout: 60000, responseTimeout: 60000 });
        });
      });

      context("Refresh page and check data should exist", () => {
        it("Refresh the page", () => {
          cy.reload();
        });

        it("Select Procedure tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Step description should be exist", () => {
          cy.get("[data-cy=\"mpi-procedure-built-in.description\"]").next()
            .should("have.text", "Description of step one");
        });

        it("Equipment should be exist", () => {
          cy.get("[data-cy=\"form.builder.mpi.procedure.equipment.title\"]")
            .should("have.text", "ET-00003 - Equipment one");
        });
      });

      context("Release MPI and verify state", () => {
        it("Approve and release MPI document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
        });

        it("Verify MPI state should be 'Released'", () => {
          SystemRequirement("REQ-3050");
          cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        });
      });
    });
  });

  context("MPI Draft -> In Review -> Approve lifecycle", () => {

    context("Create MPI document", () => {
      context("Start document creation flow", () => {
        it("Navigate to Document list", () => {
          cy.navigToDocumentList();
        });

        it("Click on 'Create a document' button", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Turn off autosave", () => {
          cy.cmpTurnOffAutosave();
        });
      });

      context("Fill in the MPI attributes and verify state", () => {
        it("Enter title 'MPI document", () => {
          cy.drEnterDocumentTitle({ name: "MPI document2" });
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
          cy.drClickCreateDocumentWithoutApiCall();
        });

        it("Verify MPI state should be 'Draft'", () => {
          SystemRequirement("REQ-3050");
          cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
        });
      });

      context("Fill step #1", () => {
        it("Select Procedure tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Fill step #1 description", () => {
          cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
        });

        it("Add 'Material one' to step #1", () => {
          cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Material one", quntity: "3", unit: "Each" });
        });

        it("Add 'Equipment one' to step #1", () => {
          cy.mpiAddEquipmentToStep({ numbOfStep: 1, equipment: "Equipment one" });
        });
      });

      context("Release MPI and verify state", () => {
        it("Click save document", () => {
          cy.drClickSaveWithoutApiCall();
        });

        it("Approve and release MPI document with selecting approver", () => {
          cy.drApproveAndReleaseDocumentWithSelectingApprover([`${USERS[2].name}`]);
        });

        it("Verify MPI state should be 'In Review'", () => {
          SystemRequirement("REQ-3050");
          cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
        });
      });
    });

    context(`Login with ${USERS[2].name} user`, () => {
      it("Logout the user", () => {
        cy.authLogout();
      });

      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
      });
    });

    context("Approve document in review", () => {
      it("approve document", () => {
        cy.arApproveARFromDashboardWithoutApi();
      });
    });

    context(`Login with ${USERS[1].name} user and verify MPI state`, () => {
      it("Logout the user", () => {
        cy.authLogout();
      });

      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      });

      it("Navigate to MPI Document list", () => {
        cy.navigToDocumentList();
        cy.drFilterDocListByNameAndStatus({ title: "MPI document2", status: "Approved" });
      });

      it("Verify MPI state should be Approved", () => {
        SystemRequirement("REQ-3050");
        cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.APPROVED });
      });
    });
  });

  context("MPI Draft -> In Review -> Reject lifecycle", () => {

    context("Create MPI document", () => {
      context("Start document creation flow", () => {
        it("Navigate to Document list", () => {
          cy.navigToDocumentList();
        });

        it("Click on 'Create a document' button", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Turn off autosave", () => {
          cy.cmpTurnOffAutosave();
        });
      });

      context("Fill in the MPI attributes and verify state", () => {
        it("Enter title 'MPI document", () => {
          cy.drEnterDocumentTitle({ name: "MPI document3" });
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
          cy.drClickCreateDocumentWithoutApiCall();
        });

        it("Verify MPI state should be 'Draft'", () => {
          SystemRequirement("REQ-3050");
          cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
        });
      });

      context("Fill step #1", () => {
        it("Select Procedure tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Fill step #1 description", () => {
          cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
        });

        it("Add 'Material one' to step #1", () => {
          cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Material one", quntity: "3", unit: "Each" });
        });

        it("Add 'Equipment one' to step #1", () => {
          cy.mpiAddEquipmentToStep({ numbOfStep: 1, equipment: "Equipment one" });
        });
      });

      context("Release MPI and verify state", () => {
        it("Click save document", () => {
          cy.drClickSaveWithoutApiCall();
        });

        it("Approve and release MPI document with selecting approver", () => {
          cy.drApproveAndReleaseDocumentWithSelectingApprover([`${USERS[2].name}`]);
        });

        it("Verify MPI state should be 'In Review'", () => {
          SystemRequirement("REQ-3050");
          cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
        });
      });
    });

    context(`Login with ${USERS[2].name} user`, () => {
      it("Logout the user", () => {
        cy.authLogout();
      });

      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
      });
    });

    context("Reject document in review", () => {
      it("Reject document", () => {
        cy.get(`.MuiListItemText-dense`).first().trigger("mouseover");
        cy.get(`[data-cy="transition-reject"]`).first().trigger("mouseover");
        cy.get(`[data-cy="transition-reject"]`).first().arrowClick();
      });

      it("Confirm password", () => {
        cy.get(`[data-cy="transition.action.password"]`).arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.get(`[data-cy="passwordConfirm"]`).arrowClick();
        cy.progressBarShouldAppear();
      });
    });

    context(`Login with ${USERS[1].name} user and verify MPI state`, () => {
      it("Logout the user", () => {
        cy.authLogout();
      });

      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      });

      it("Navigate to MPI Document list", () => {
        cy.navigToDocumentList();
        cy.drFilterDocListByNameAndStatus({ title: "MPI document", status: "Pending Change" });
      });

      it("Verify MPI state should be Pending Change", () => {
        SystemRequirement("REQ-3050");
        cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.PENDING_CHANGE });
      });
    });
  });

  context("QPI Draft -> Released lifecycle", () => {

    context("Create QPI document", () => {
      context("Start document creation flow", () => {
        it("Navigate to Document list", () => {
          cy.navigToDocumentList();
        });

        it("Click on 'Create a document' button", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Turn off autosave", () => {
          cy.cmpTurnOffAutosave();
        });
      });

      context("Fill in the QPI attributes and verify state", () => {
        it("Enter title 'QPI document", () => {
          cy.drEnterDocumentTitle({ name: "QPI document1" });
        });

        it("Enter description 'QPI document description'", () => {
          cy.drEnterDocumentDescription({ description: "QPI document description" });
        });

        it("Select 'Quantity Process Instructions Test' document type from dropdown", () => {
          cy.drSelectDocumentType({ documentType: "Quantity Process Instructions Test" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithoutApiCall();
        });

        it("Verify QPI state should be 'Draft'", () => {
          SystemRequirement("REQ-3050");
          cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
        });
      });

      context("Fill step #1", () => {
        it("Select Procedure tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Fill step #1 description", () => {
          cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
        });

        it("Add 'Material one' to step #1", () => {
          cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Material one", quntity: "3", unit: "Each" });
        });

        it("Add 'Equipment one' to step #1", () => {
          cy.mpiAddEquipmentToStep({ numbOfStep: 1, equipment: "Equipment one" });
        });
      });

      context("Release QPI and verify state", () => {
        it("Click save document", () => {
          cy.drClickSaveWithoutApiCall();
        });

        it("Approve and release QPI document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
        });

        it("Verify QPI state should be 'Released'", () => {
          SystemRequirement("REQ-3050");
          cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        });
      });
    });
  });

  context("QPI Draft -> In Review -> Approve lifecycle", () => {

    context("Create QPI document", () => {
      context("Start document creation flow", () => {
        it("Navigate to Document list", () => {
          cy.navigToDocumentList();
        });

        it("Click on 'Create a document' button", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Turn off autosave", () => {
          cy.cmpTurnOffAutosave();
        });
      });

      context("Fill in the QPI attributes and verify state", () => {
        it("Enter title 'QPI document", () => {
          cy.drEnterDocumentTitle({ name: "QPI document2" });
        });

        it("Enter description 'QPI document description'", () => {
          cy.drEnterDocumentDescription({ description: "QPI document description" });
        });

        it("Select 'Quantity Process Instructions Test' document type from dropdown", () => {
          cy.drSelectDocumentType({ documentType: "Quantity Process Instructions Test" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithoutApiCall();
        });

        it("Verify QPI state should be 'Draft'", () => {
          SystemRequirement("REQ-3050");
          cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
        });
      });

      context("Fill step #1", () => {
        it("Select Procedure tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Fill step #1 description", () => {
          cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
        });

        it("Add 'Material one' to step #1", () => {
          cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Material one", quntity: "3", unit: "Each" });
        });

        it("Add 'Equipment one' to step #1", () => {
          cy.mpiAddEquipmentToStep({ numbOfStep: 1, equipment: "Equipment one" });
        });
      });

      context("Release QPI and verify state", () => {
        it("Click save document", () => {
          cy.drClickSaveWithoutApiCall();
        });

        it("Approve and release QPI document with selecting approver", () => {
          cy.drApproveAndReleaseDocumentWithSelectingApprover([`${USERS[2].name}`]);
        });

        it("Verify QPI state should be 'In Review'", () => {
          SystemRequirement("REQ-3050");
          cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
        });
      });
    });

    context(`Login with ${USERS[2].name} user`, () => {
      it("Logout the user", () => {
        cy.authLogout();
      });

      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
      });
    });

    context("Approve document in review", () => {
      it("approve document", () => {
        cy.arApproveARFromDashboardWithoutApi();
      });
    });

    context(`Login with ${USERS[1].name} user and verify QPI state`, () => {
      it("Logout the user", () => {
        cy.authLogout();
      });

      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      });

      it("Navigate to QPI Document list", () => {
        cy.navigToDocumentList();
        cy.drFilterDocListByNameAndStatus({ title: "QPI document2", status: "Approved" });
      });

      it("Verify QPI state should be Approved", () => {
        SystemRequirement("REQ-3050");
        cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.APPROVED });
      });
    });
  });

  context("QPI Draft -> In Review -> Reject lifecycle", () => {

    context("Create QPI document", () => {
      context("Start document creation flow", () => {
        it("Navigate to Document list", () => {
          cy.navigToDocumentList();
        });

        it("Click on 'Create a document' button", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Turn off autosave", () => {
          cy.cmpTurnOffAutosave();
        });
      });

      context("Fill in the QPI attributes and verify state", () => {
        it("Enter title 'QPI document", () => {
          cy.drEnterDocumentTitle({ name: "QPI document3" });
        });

        it("Enter description 'QPI document description'", () => {
          cy.drEnterDocumentDescription({ description: "QPI document description" });
        });

        it("Select 'Quantity Process Instructions Test' document type from dropdown", () => {
          cy.drSelectDocumentType({ documentType: "Quantity Process Instructions Test" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithoutApiCall();
        });

        it("Verify QPI state should be 'Draft'", () => {
          SystemRequirement("REQ-3050");
          cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
        });
      });

      context("Fill step #1", () => {
        it("Select Procedure tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Fill step #1 description", () => {
          cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
        });

        it("Add 'Material one' to step #1", () => {
          cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Material one", quntity: "3", unit: "Each" });
        });

        it("Add 'Equipment one' to step #1", () => {
          cy.mpiAddEquipmentToStep({ numbOfStep: 1, equipment: "Equipment one" });
        });
      });

      context("Release QPI and verify state", () => {
        it("Click save document", () => {
          cy.drClickSaveWithoutApiCall();
        });

        it("Approve and release QPI document with selecting approver", () => {
          cy.drApproveAndReleaseDocumentWithSelectingApprover([`${USERS[2].name}`]);
        });

        it("Verify QPI state should be 'In Review'", () => {
          SystemRequirement("REQ-3050");
          cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
        });
      });
    });

    context(`Login with ${USERS[2].name} user`, () => {
      it("Logout the user", () => {
        cy.authLogout();
      });

      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
      });
    });

    context("Reject document in review", () => {
      it("Reject document", () => {
        cy.get(`.MuiListItemText-dense`).first().trigger("mouseover");
        cy.get(`[data-cy="transition-reject"]`).first().trigger("mouseover");
        cy.get(`[data-cy="transition-reject"]`).first().arrowClick();
      });

      it("Confirm password", () => {
        cy.get(`[data-cy="transition.action.password"]`).arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.get(`[data-cy="passwordConfirm"]`).arrowClick();
        cy.progressBarShouldAppear();
      });
    });

    context(`Login with ${USERS[1].name} user and verify QPI state`, () => {
      it("Logout the user", () => {
        cy.authLogout();
      });

      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      });

      it("Navigate to QPI Document list", () => {
        cy.navigToDocumentList();
        cy.drFilterDocListByNameAndStatus({ title: "QPI document", status: "Pending Change" });
      });

      it("Verify QPI state should be Pending Change", () => {
        SystemRequirement("REQ-3050");
        cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.PENDING_CHANGE });
      });
    });
  });

});

export { };

