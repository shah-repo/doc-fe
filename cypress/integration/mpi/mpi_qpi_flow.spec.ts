// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
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
              {
                documentTypeName: "Manufacturing Process Instructions Test",
                documentTypeAcronym: "MPI-",
                group: "PI",
                schema: [
                  {
                    name: "fb-mpi-procedure-section-built-in",
                    type: "section",
                    index: 0,
                    label: "form.builder.mpiprocedure",
                    deleteDisabled: false,
                    deleteInFormDisabled: true,
                  },
                  {
                    name: "mpi-procedure-built-in",
                    type: "mpiprocedure",
                    index: 1,
                    stepIndex: 1,
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    deleteInFormDisabled: false,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "lhrs-start-quantity",
                    type: "quantity",
                    index: 2,
                    label: "Start quantity",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    editorProperties: [],
                    validationAttribute: "Start quantity",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "lhrs-accepted-quantity",
                    type: "quantity",
                    index: 3,
                    label: "Accepted quantity",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    editorProperties: [],
                    validationAttribute: "Accepted quantity",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "lhrs-rejected-quantity",
                    type: "quantity",
                    index: 4,
                    label: "Rejected quantity",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    editorProperties: [],
                    validationAttribute: "Rejected quantity",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "approvals-built-in",
                    type: "approvals",
                    index: 5,
                    label: "Approvals",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    uniqueSchemaItem: true,
                    validationAttribute: "Approvals",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                ],
              },
              {
                documentTypeName: "Quantity Process Instructions Test",
                documentTypeAcronym: "QPI-",
                group: "PI",
                schema: [
                  {
                    name: "fb-mpi-procedure-section-built-in",
                    type: "section",
                    index: 0,
                    label: "form.builder.mpiprocedure",
                    deleteDisabled: false,
                    deleteInFormDisabled: true,
                  },
                  {
                    name: "mpi-procedure-built-in",
                    type: "mpiprocedure",
                    index: 1,
                    stepIndex: 1,
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "approvals-built-in",
                    type: "approvals",
                    index: 5,
                    label: "Approvals",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    uniqueSchemaItem: true,
                    validationAttribute: "Approvals",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                ],
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
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
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
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
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
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

        it("Verify MPI state should be 'Draft'", () => {
          SystemRequirement("REQ-3050");
          cy.get("[data-cy=\"HeaderInfo-status\"]").should("have.text", "Draft");
        });

        context("Fill step #1", () => {
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
            cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
              cy.drClickCreateDocumentWithApiCallForForms();
            });
          });

          it("Approve and release MPI document", () => {
            cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
              cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            });
          });

          it("Verify MPI state should be 'Released'", () => {
            SystemRequirement("REQ-3050");
            cy.get("[data-cy=\"HeaderInfo-status\"]").should("have.text", "Released");
          });
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
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Verify MPI state should be 'Draft'", () => {
          SystemRequirement("REQ-3050");
          cy.get("[data-cy=\"HeaderInfo-status\"]").should("have.text", "Draft");
        });

        context("Fill step #1", () => {
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
            cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
              cy.drClickCreateDocumentWithApiCallForForms();
            });
          });

          it("Approve and release MPI document with selecting approver", () => {
            cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
              cy.drApproveAndReleaseDocumentWithSelectingApprover([`${USERS[2].name}`]);
            });
          });

          it("Verify MPI state should be 'In Review'", () => {
            SystemRequirement("REQ-3050");
            cy.get("[data-cy=\"HeaderInfo-status\"]").should("have.text", "In Review");
          });
        });
      });
    });

    context(`Login with ${USERS[2].name} user`, () => {
      it("Logout the user", () => {
        cy.authLogout();
      });

      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[2].email,
          password: "Tester1!",
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });
    });

    context("Approve document in review", () => {
      it(`approve document`, () => {
        cy.wait(1000);
        cy.get("#root").contains("Approve").click();
      });

      it("Confirm password", () => {
        cy.get(`[data-cy="transition.action.password"]`).type("Tester1!");
        cy.wrapWithWaitOnApiCall(CyRoutes.ChangeRequestApprove,
          () => {
            cy.get(`[data-cy="passwordConfirm"]`).click();
          });
      });
    });

    context(`Login with ${USERS[1].name} user and verify MPI state`, () => {
      it("Logout the user", () => {
        cy.authLogout();
      });

      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[1].email,
          password: "Tester1!",
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });

      it("Navigate to MPI Document list", () => {
        cy.navigToDocumentList();
        cy.drFilterDocListByNameAndStatus({ title: "MPI document2", status: "Approved" });
      });

      it("Verify MPI state should be Approved", () => {
        SystemRequirement("REQ-3050");
        cy.get("[data-cy=\"HeaderInfo-status\"]").should("have.text", "Approved");
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
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Verify MPI state should be 'Draft'", () => {
          SystemRequirement("REQ-3050");
          cy.get("[data-cy=\"HeaderInfo-status\"]").should("have.text", "Draft");
        });

        context("Fill step #1", () => {
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
            cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
              cy.drClickCreateDocumentWithApiCallForForms();
            });
          });

          it("Approve and release MPI document with selecting approver", () => {
            cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
              cy.drApproveAndReleaseDocumentWithSelectingApprover([`${USERS[2].name}`]);
            });
          });

          it("Verify MPI state should be 'In Review'", () => {
            SystemRequirement("REQ-3050");
            cy.get("[data-cy=\"HeaderInfo-status\"]").should("have.text", "In Review");
          });
        });
      });
    });

    context(`Login with ${USERS[2].name} user`, () => {
      it("Logout the user", () => {
        cy.authLogout();
      });

      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[2].email,
          password: "Tester1!",
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });
    });

    context("Reject document in review", () => {
      it(`Reject document`, () => {
        cy.wait(1000);
        cy.get("#root").contains("Reject").click();
      });

      it("Confirm password", () => {
        cy.get(`[data-cy="transition.action.password"]`).type("Tester1!");
        cy.get(`[data-cy="passwordConfirm"]`).click();
      });
    });

    context(`Login with ${USERS[1].name} user and verify MPI state`, () => {
      it("Logout the user", () => {
        cy.authLogout();
      });

      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[1].email,
          password: "Tester1!",
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });

      it("Navigate to MPI Document list", () => {
        cy.navigToDocumentList();
        cy.drFilterDocListByNameAndStatus({ title: "MPI document", status: "Pending Change" });
      });

      it("Verify MPI state should be Pending Change", () => {
        SystemRequirement("REQ-3050");
        cy.get("[data-cy=\"HeaderInfo-status\"]").should("have.text", "Pending Change");
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
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Verify QPI state should be 'Draft'", () => {
          SystemRequirement("REQ-3050");
          cy.get("[data-cy=\"HeaderInfo-status\"]").should("have.text", "Draft");
        });

        context("Fill step #1", () => {
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
            cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
              cy.drClickCreateDocumentWithApiCallForForms();
            });
          });

          it("Approve and release QPI document", () => {
            cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
              cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            });
          });

          it("Verify QPI state should be 'Released'", () => {
            SystemRequirement("REQ-3050");
            cy.get("[data-cy=\"HeaderInfo-status\"]").should("have.text", "Released");
          });
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
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Verify QPI state should be 'Draft'", () => {
          SystemRequirement("REQ-3050");
          cy.get("[data-cy=\"HeaderInfo-status\"]").should("have.text", "Draft");
        });

        context("Fill step #1", () => {
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
            cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
              cy.drClickCreateDocumentWithApiCallForForms();
            });
          });

          it("Approve and release QPI document with selecting approver", () => {
            cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
              cy.drApproveAndReleaseDocumentWithSelectingApprover([`${USERS[2].name}`]);
            });
          });

          it("Verify QPI state should be 'In Review'", () => {
            SystemRequirement("REQ-3050");
            cy.get("[data-cy=\"HeaderInfo-status\"]").should("have.text", "In Review");
          });
        });
      });
    });

    context(`Login with ${USERS[2].name} user`, () => {
      it("Logout the user", () => {
        cy.authLogout();
      });

      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[2].email,
          password: "Tester1!",
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });
    });

    context("Approve document in review", () => {
      it(`approve document`, () => {
        cy.wait(1000);
        cy.get("#root").contains("Approve").click();
      });

      it("Confirm password", () => {
        cy.get(`[data-cy="transition.action.password"]`).type("Tester1!");
        cy.wrapWithWaitOnApiCall(CyRoutes.ChangeRequestApprove,
          () => {
            cy.get(`[data-cy="passwordConfirm"]`).click();
          });
      });
    });

    context(`Login with ${USERS[1].name} user and verify QPI state`, () => {
      it("Logout the user", () => {
        cy.authLogout();
      });

      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[1].email,
          password: "Tester1!",
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });

      it("Navigate to QPI Document list", () => {
        cy.navigToDocumentList();
        cy.drFilterDocListByNameAndStatus({ title: "QPI document2", status: "Approved" });
      });

      it("Verify QPI state should be Approved", () => {
        SystemRequirement("REQ-3050");
        cy.get("[data-cy=\"HeaderInfo-status\"]").should("have.text", "Approved");
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
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Verify QPI state should be 'Draft'", () => {
          SystemRequirement("REQ-3050");
          cy.get("[data-cy=\"HeaderInfo-status\"]").should("have.text", "Draft");
        });

        context("Fill step #1", () => {
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
            cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
              cy.drClickCreateDocumentWithApiCallForForms();
            });
          });

          it("Approve and release QPI document with selecting approver", () => {
            cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
              cy.drApproveAndReleaseDocumentWithSelectingApprover([`${USERS[2].name}`]);
            });
          });

          it("Verify QPI state should be 'In Review'", () => {
            SystemRequirement("REQ-3050");
            cy.get("[data-cy=\"HeaderInfo-status\"]").should("have.text", "In Review");
          });
        });
      });
    });

    context(`Login with ${USERS[2].name} user`, () => {
      it("Logout the user", () => {
        cy.authLogout();
      });

      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[2].email,
          password: "Tester1!",
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });
    });

    context("Reject document in review", () => {
      it(`Reject document`, () => {
        cy.wait(1000);
        cy.get("#root").contains("Reject").click();
      });

      it("Confirm password", () => {
        cy.get(`[data-cy="transition.action.password"]`).type("Tester1!");
        cy.get(`[data-cy="passwordConfirm"]`).click();
      });
    });

    context(`Login with ${USERS[1].name} user and verify QPI state`, () => {
      it("Logout the user", () => {
        cy.authLogout();
      });

      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[1].email,
          password: "Tester1!",
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });

      it("Navigate to QPI Document list", () => {
        cy.navigToDocumentList();
        cy.drFilterDocListByNameAndStatus({ title: "QPI document", status: "Pending Change" });
      });

      it("Verify QPI state should be Pending Change", () => {
        SystemRequirement("REQ-3050");
        cy.get("[data-cy=\"HeaderInfo-status\"]").should("have.text", "Pending Change");
      });
    });
  });

});

export { };
