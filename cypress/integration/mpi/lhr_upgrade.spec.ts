// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
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
              {
                documentTypeName: "LHR Step Test",
                documentTypeAcronym: "LHRS-",
                group: "PI_INSTANCE",
                privateNumberPool: true,
                needsSignature: true,
                fieldsConfig: {
                  C: {
                    visible: false,
                    required: false,
                  },
                  D: {
                    visible: false,
                    required: false,
                  },
                  E: {
                    visible: false,
                    required: false,
                  },
                  F: {
                    visible: false,
                    required: false,
                  },
                  N: {
                    label: "Complete Step",
                    visible: true,
                  },
                  U: {
                    label: "Operators",
                    visible: true,
                  },
                  A1: {
                    label: "WIP",
                    visible: true,
                  },
                  A4: {
                    label: "Completed",
                    visible: true,
                  },
                },
              },
              {
                documentTypeName: "Lot History Record Test",
                documentTypeAcronym: "LHR-",
                group: "LHR",
                privateNumberPool: false,
                needsSignature: true,
                category: "Lhr",
                fieldsConfig: {
                  C: {
                    visible: false,
                  },
                  D: {
                    visible: false,
                  },
                  E: {
                    visible: false,
                  },
                  U: {
                    visible: true,
                  },
                  A1: {
                    label: "WIP",
                    visible: true,
                  },
                },
                schema: [
                  {
                    name: "lhr-selected-part",
                    type: "partsselection",
                    index: 0,
                    label: "Part to be Manufactured",
                    deleteDisabled: true,
                    deleteInFormDisabled: true,
                  },
                  {
                    name: "lhr_initial_quantity",
                    type: "quantity",
                    index: 1,
                    label: "Initial Quantity",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Initial Quantity",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "lhr-end-quantity",
                    type: "quantity",
                    index: 2,
                    label: "End Quantity",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    outputDisabled: true,
                    validationAttribute: "End Quantity",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "lhr-build-type",
                    type: "radiogroup",
                    index: 3,
                    label: "Build Type",
                    options: [
                      {
                        text: "R&D",
                        value: "R&D",
                      },
                      {
                        text: "Production",
                        value: "Production",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    validationAttribute: "Build Type",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "lhr-due-date",
                    type: "datepicker",
                    index: 4,
                    label: "Due Date",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Due Date",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "lhrstep-built-in",
                    type: "lhrstep",
                    index: 5,
                    label: "LHR Step",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    applicableValidationSchema: true,
                  },
                ],
              },
              {
                documentTypeName: "Manufacturing Process Instructions Test",
                documentTypeAcronym: "PI-",
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
                documentTypeName: "LHR template",
                documentTypeAcronym: "LHRT-",
                group: "FORM",
              },
              {
                documentTypeName: "Part",
                documentTypeAcronym: "PRT-",
                group: "PART",
                isQms: true,
                needsSignature: true,
                category: "Parts",
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          // materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Subassembly");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Part");
          // mpiDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Manufacturing Process Instructions Test");
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

      context("Fill step #1", () => {
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
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
            cy.drClickCreateDocumentWithApiCallForForms();
          });
        });

        it("Approve and release MPI document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          });
        });

        it("Get created MPI ID", () => {
          cy.get("#HeaderInfo-docId").then((x) => { mpiID = x.text(); });
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
        cy.get("[data-cy=\"lhr-selected-part\"]").type("Part document");
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
          cy.get("ul[role=listbox]>li").contains("Part document").click();
        });
      });

      context("Select created MPI in LHR template", () => {
        it("Select MPI document for step #1 in LHRt", () => {
          cy.get("input[data-cy=\"lhrstep-built-in\"]").then(($el) => {
            $el.trigger("click");
          });
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
            cy.get("input[data-cy=\"lhrstep-built-in\"]").type("MPI document{downarrow}{enter}", { force: true });
          });
        });
      });

      context("Release LHRt", () => {
        it("Click save document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
            cy.drClickCreateDocumentWithApiCallForForms();
          });
        });

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
      cy.get("[name=\"lhr_initial_quantity\"]").typeFieldLock("10");
    });

    it("Select 'R&D' build type", () => {
      cy.unClick();
      cy.get("[value=\"R&D\"]").check();
    });

    it("Add 'Due Date'", () => {
      cy.poAddDateRequired();
    });

    it("Click save document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.url().then((url: any) => {
          lhrDocUrl = url;
        });
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
      cy.get("[data-cy=\"updateRecord\"]").click();
    });

    it("change Part title to 'Part document 1'", () => {
      cy.drClearDocumentTitle();
      cy.drEnterDocumentTitle({ name: "Part document 1" });
    });

    it("Click on 'Save for Approval' button", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Verfiy banner on LHR after change Part", () => {
    it("Navigate to LHR", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
        cy.visit(lhrDocUrl);
      });
    });

    it("Verfiy banner should not be present", () => {
      SystemRequirement("REQ-3460");
      cy.get("input[data-cy=\"formUpgradeButton\"]").should("not.exist");
    });
  });

  context("Complete first step in LHR", () => {
    context("Start LHRs #1", () => {
      it("Navigate to LHR", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
          cy.visit(lhrDocUrl);
        });
      });

      it("Click 'START MPI'", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
          cy.get("[data-cy=\"form.builder.start.mpi\"]").eq(0).click();
        });
        cy.wait(500);
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Enter 'Start quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-start-quantity\"]").typeFieldLock("10");
      });

      it("Enter 'Accepted quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-accepted-quantity\"]").typeFieldLock("8");
      });

      it("Enter 'Rejected quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-rejected-quantity\"]").typeFieldLock("2");
      });

      it("Add an Approval", () => {
        cy.get("[data-cy^=\"fb-approvals-approvals\"]").click();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul[role=\"listbox\"]>li").contains(USERS[1].name).click();
        });
      });

      it("Click save document", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });
      });

      it("Complete step", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve step", () => {
        cy.ebApprove();
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
      cy.get("[data-cy=\"updateRecord\"]").click();
    });

    it("change MPI title to 'MPI document 1'", () => {
      cy.drClearDocumentTitle();
      cy.drEnterDocumentTitle({ name: "MPI document 1" });
    });

    it("Click on 'Save for Approval' button", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Verfiy banner on LHR after change MPI", () => {
    it("Navigate to LHR", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
        cy.visit(lhrDocUrl);
      });
    });

    it("Verfiy banner should not be present", () => {
      SystemRequirement("REQ-3450");
      cy.get("input[data-cy=\"formUpgradeButton\"]").should("not.exist");
    });
  });
});

export { };
