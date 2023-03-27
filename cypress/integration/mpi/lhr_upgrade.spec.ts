// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { LHRTTest } from "../../utils/constants/documentTypes/lhrt";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { Part } from "../../utils/constants/documentTypes/part";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

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
let mpiID;

context("LHR Upgrade", () => {
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

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
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
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });

    context("Fill step #1", () => {
      it("Select Procedure tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Fill step #1 description", () => {
        cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
      });

      it("Add 'Part document' to step #1", () => {
        cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Part document", quntity: "3", unit: "Each" });
      });

      it("Add 'Equipment one' to step #1", () => {
        cy.mpiAddEquipmentToStep({ numbOfStep: 1, equipment: "Equipment one" });
      });
    });

    context("Release MPI", () => {
      it("Click save document", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Approve and release MPI document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });

      it("Get created MPI ID", () => {
        cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => { mpiID = x.text(); });
      });
    });
  });

  context("Create LHRt document", () => {
    context("Start document creation flow", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

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
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Select 'Part document' for Part to be Manufactured", () => {
        cy.get("[data-cy=\"lhr-selected-part\"]").arrowType("Part document");
        cy.get("ul>li[role=option]").contains("Part document").arrowClick();
      });

      it("Add 'Part document' in reference", () => {
        cy.drSelectReferences("Part document");
      });
    });

    context("Select created MPI in LHR template", () => {
      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Click 'LHR Step'", () => {
        cy.get("[data-cy=\"LHR Step 1\"]").arrowClick();
      });

      it("Select MPI document for step #1 in LHRt", () => {
        cy.get("input[data-cy^=\"lhrstep-built-in\"]").autocompleteSelect("MPI document", { force: true });
      });
    });

    context("Release LHRt", () => {
      it("Click save document", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Approve and release LHRt document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });
  });

  context("Create LHR", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click create new document from LHRt", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter initial quantity", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
    });

    it("Select 'R&D' build type", () => {
      cy.unClick();
      cy.get("[value=\"R&D\"]").check();
    });

    it("Add 'Due Date'", () => {
      cy.poAddDateRequired();
    });

    it("Click save document", () => {
      cy.drClickSaveWithoutApiCall();

      cy.url().then((url: any) => {
        lhrDocUrl = url;
      });
    });
  });

  context("Update Part document", () => {
    it("Navigate to Parts", () => {
      cy.navigToParts();
    });

    it("Select Part document", () => {
      cy.dlClearFilters();
      cy.dlFilterByDocId({ docId: "PRT-00005" });
      cy.dlSelectFirstDocument();
    });

    it("Click Revise document button", () => {
      cy.drClickReviseDocument();
    });

    it("change Part title to 'Part document 1'", () => {
      cy.drClearDocumentTitle();
      cy.drEnterDocumentTitle({ name: "Part document 1" });
    });

    it("Click on 'Save for Approval' button", () => {
      cy.drClickSaveWithoutApiCall();
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context("Verfiy banner and Part on LHR after change Part", () => {
    it("Navigate to LHR", () => {
      cy.visit(lhrDocUrl);
      cy.listLoadingElementShouldAppear();
    });

    it("Verfiy banner should not be present", () => {
      SystemRequirement("REQ-3460");
      cy.get("input[data-cy=\"formUpgradeButton\"]").should("not.exist");
    });

    it("LHR should hold first version of Part", () => {
      SystemRequirement("REQ-3460");
      cy.get("input[data-cy=\"lhr-selected-part\"]").should("have.value", "PRT-00005 - rev 1 - Part document");
    });
  });

  context("Complete first step in LHR", () => {
    context("Start LHRs #1", () => {
      it("Navigate to LHR", () => {
        cy.visit(lhrDocUrl);
        cy.listLoadingElementShouldAppear();
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Click 'LHR Step'", () => {
        cy.get("[data-cy=\"LHR Step 1\"]").arrowClick();
      });

      it("Click 'START MPI'", () => {
        cy.mpiStartStepWithoutApi({ stepNumber: 1 });
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Select Procedure tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Enter 'Start quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-start-quantity\"]").arrowType("10");
      });

      it("Enter 'Accepted quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("8");
      });

      it("Enter 'Rejected quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-rejected-quantity\"]").arrowType("2");
      });

      it("Click save document", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Select Overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add an Approval", () => {
        cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
      });

      it("Click save document", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Complete step", () => {
        cy.pmSubmitForApprovalWithoutAPI();
      });

      it("Approve step", () => {
        cy.ebApproveWithoutApi();
      });
    });
  });

  context("Update MPI document", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select document", () => {
      cy.dlClearFilters();
      cy.dlFilterByDocId({ docId: mpiID });
      cy.dlSelectFirstDocument();
    });

    it("Click Revise document button", () => {
      cy.drClickReviseDocument();
    });

    it("change MPI title to 'MPI document 1'", () => {
      cy.drClearDocumentTitle();
      cy.drEnterDocumentTitle({ name: "MPI document 1" });
    });

    it("Click on 'Save for Approval' button", () => {
      cy.drClickSaveWithoutApiCall();
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context("Verfiy banner and MPI on LHR after change MPI", () => {
    it("Navigate to LHR", () => {
      cy.visit(lhrDocUrl);
      cy.listLoadingElementShouldAppear();
    });

    it("Verfiy banner should not be present", () => {
      SystemRequirement("REQ-3450");
      cy.get("input[data-cy=\"formUpgradeButton\"]").should("not.exist");
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy=\"LHR Step 1 - Rev A\"]").arrowClick();
    });

    it("LHR should hold first version of MPI", () => {
      SystemRequirement("REQ-3450");
      cy.get("[name=\"lhrstep-built-in\"]").trigger("mouseover");
      cy.get("input[data-cy=\"lhrstep-built-in\"]")
        .should("have.value", "LHR-00004, Step #1 (PI-00002, MPI document, Rev 1)");
    });
  });
});

export { };

