// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { LHRTTest } from "../../utils/constants/documentTypes/lhrt";
import { LotsTest } from "../../utils/constants/documentTypes/lot";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocumentType;
let materialsDocumentType;
let equipmentDocument;
let materialsDocument;

context("Mpi Template", () => {
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
                ...LotHistoryRecordTest,
              },
              MPITest,
              LHRTTest,
              LotsTest,
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

    it("[API]Create equipment two ", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Equipment two</p>",
          document: {
            docId: "ET-00004",
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
          name: "Equipment two",
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

    it("[API]Create material two", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Materials document</p>",
          document: {
            docId: "MT-00005",
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
          name: "Material two",
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
  });

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

      it("Check status should be Draft", () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      });

      context("Check predefined fields", () => {
        it("Verify Approvals Section", () => {
          cy.get(`[data-cy="Approvals"]`).should("exist");
        });

        it("Verify Approvals block", () => {
          cy.get("[name=fb-approvals-approvals-built-in]").should("exist");
        });

        it("Select Procedure tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Verify PI Procedure", () => {
          cy.get(`[data-cy="form.builder.mpiprocedure"]`).should("exist");
        });

        it("Verify Start quantity", () => {
          cy.get(`[data-cy="Start quantity"]`).should("exist");
        });

        it("Verify Accepted quantity", () => {
          cy.get(`[data-cy="Accepted quantity"]`).should("exist");
        });

        it("Verify Rejected quantity", () => {
          cy.get(`[data-cy="Rejected quantity"]`).should("exist");
        });

        it("Select Overview tab", () => {
          cy.drSelectOverviewTab();
        });
      });

      context("Add Form fields and Release", () => {
        it("Add TextField", () => {
          SystemRequirement("FB-0020", "FB-0030");
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
          cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
          cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder" });
          cy.fbEnterNameValue({ name: "rows", value: "2" });
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click();
          cy.fbSelectRadioButtonValue({ value: "Show/Hide" });
          cy.fbAddNewFieldButton();
        });


        it("Verify Edit, Move and Remove", () => {
          cy.get(`[data-cy="edit-schema-item"]`).arrowClick();
          cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder changed" });
          cy.fbAddNewFieldButton();
          cy.get(`textarea[placeholder^="fb-textfield placeholder changed"]`).should("exist");
          cy.get(`[data-cy="remove-schema-item"]`).arrowClick();
          cy.dragAndDrop({
            fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
            toSelector: `[class="drag-handle"]`,
          });
        });

        it("Verify Remove for Quantity items disabled", () => {
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
        });
      });

      context("Fill step #1", () => {
        it("Select Procedure tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Fill step #1 description", () => {
          cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
        });

        it("Add attachment and check autosave", () => {
          cy.contains("Step #1").parentsUntil("li")
            .find("[data-cy=\"albumMediaButton\"]").arrowClick();
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.elUploadAttachment({
              fileName: "image.jpg",
              el: "fb-mediaalbum-upload-mpi-procedure-built-in.attachments",
            });
          });
        });

        it("Add 'Material one' to step #1", () => {
          cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Material one", quntity: "3", unit: "Each" });
        });

        it("Add 'Equipment one' to step #1", () => {
          cy.mpiAddEquipmentToStep({ numbOfStep: 1, equipment: "Equipment one" });
        });
      });

      it("Verify step can be added", () => {
        SystemRequirement("REQ-2970");
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetRequiredApproversDocRev], () => {
          cy.get("[data-cy=\"form.builder.add.step\"]").arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.get("[data-cy=\"form.builder.step.number\"]").eq(1).should("have.text", "Step #2");
      });

      it("Fill step #2 description", () => {
        cy.mpiEnterDescriptionToStep({ numbOfStep: 2, description: "Description of step two" });
      });

      it("Add attachment and check autosave", () => {
        cy.contains("Step #2").parentsUntil("li")
          .find("[data-cy=\"albumMediaButton\"]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.elUploadAttachment({
            fileName: "image.jpg",
            el: "fb-mediaalbum-upload-mpi-procedure-built-in.attachments",
          });
        });
      });

      it("Add 'Material one' to step #2", () => {
        cy.mpiAddMaterialDocumentToStep({ numbOfStep: 2, material: "Material one", quntity: "3", unit: "Each" });
      });

      it("Add 'Equipment one' to step #2", () => {
        cy.mpiAddEquipmentToStep({ numbOfStep: 2, equipment: "Equipment one" });
      });

      it("Clone Step #1", () => {
        SystemRequirement("REQ-3070");
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetAttachments,
          CyRoutes.GetAttachmentsAttached ], () => {
          cy.get("[data-cy=\"form.builder.clone.step\"]").eq(0).arrowClick();
        });
      });

      it("Edit Cloned step #1 clone description", () => {
        cy.mpiEnterDescriptionToStep({ numbOfStep: 2, description: "Description of Cloned step 1" });
      });

      it("Add attachment and check autosave", () => {
        cy.contains("Step #2").parentsUntil("li")
          .find("[data-cy=\"albumMediaButton\"]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.elUploadAttachment({
            fileName: "image.jpg",
            el: "fb-mediaalbum-upload-mpi-procedure-built-in.attachments",
          });
        });
      });

      it("Add 'Material two' to Cloned step #1", () => {
        cy.mpiAddMaterialDocumentToStep({ numbOfStep: 2, material: "Material two", quntity: "2", unit: "Each" });
      });

      it("Add 'Equipment two' to step #1", () => {
        cy.mpiAddEquipmentToStep({ numbOfStep: 2, equipment: "Equipment two" });
      });

      context("Release MPI", () => {
        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Approve and release MPI document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          });
        });
      });
    });
  });

  context("import export here", () => {
    // add here
  });

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

    context("Fill in the QPI attributes", () => {
      it("Enter title 'QPI document", () => {
        cy.drEnterDocumentTitle({ name: "QPI document" });
      });

      it("Enter description 'MPI document description'", () => {
        cy.drEnterDocumentDescription({ description: "QPI document description" });
      });

      it("Select 'Quality Process Instructions Test' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Quality Process Instructions Test" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Check status should be Draft", () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      });

      context("Check predefined fields", () => {
        it("Verify Approvals Section", () => {
          cy.get(`[data-cy="Approvals"]`).should("exist");
        });

        it("Verify Approvals block", () => {
          cy.get("[name=fb-approvals-approvals-built-in]").should("exist");
        });

        it("Select Procedure tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Verify PI Procedure", () => {
          cy.get(`[data-cy="form.builder.mpiprocedure"]`).should("exist");
        });

        it("Verify Start quantity", () => {
          cy.get(`[data-cy="Start quantity"]`).should("exist");
        });

        it("Verify Accepted quantity", () => {
          cy.get(`[data-cy="Accepted quantity"]`).should("exist");
        });

        it("Verify Rejected quantity", () => {
          cy.get(`[data-cy="Rejected quantity"]`).should("exist");
        });

        it("Select Overview tab", () => {
          cy.drSelectOverviewTab();
        });
      });

      context("Add Form fields and Release", () => {
        it("Add TextField", () => {
          SystemRequirement("FB-0020", "FB-0030");
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
          cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
          cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder" });
          cy.fbEnterNameValue({ name: "rows", value: "2" });
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click();
          cy.fbSelectRadioButtonValue({ value: "Show/Hide" });
          cy.fbAddNewFieldButton();
        });


        it("Verify Edit, Move and Remove", () => {
          cy.get(`[data-cy="edit-schema-item"]`).arrowClick();
          cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder changed" });
          cy.fbAddNewFieldButton();
          cy.get(`textarea[placeholder^="fb-textfield placeholder changed"]`).should("exist");
          cy.get(`[data-cy="remove-schema-item"]`).arrowClick();
          cy.dragAndDrop({
            fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
            toSelector: `[class="drag-handle"]`,
          });
        });

        it("Verify Remove for Quantity items disabled", () => {
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
        });
      });

      context("Fill step #1", () => {
        it("Select Procedure tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Fill step #1 description", () => {
          cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
        });

        it("Add attachment and check autosave", () => {
          cy.contains("Step #1").parentsUntil("li")
            .find("[data-cy=\"albumMediaButton\"]").arrowClick();
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.elUploadAttachment({
              fileName: "image.jpg",
              el: "fb-mediaalbum-upload-mpi-procedure-built-in.attachments",
            });
          });
        });

        it("Add 'Material one' to step #1", () => {
          cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Material one", quntity: "3", unit: "Each" });
        });

        it("Add 'Equipment one' to step #1", () => {
          cy.mpiAddEquipmentToStep({ numbOfStep: 1, equipment: "Equipment one" });
        });
      });

      it("Verify step can be added", () => {
        SystemRequirement("REQ-2970");
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetRequiredApproversDocRev], () => {
          cy.get("[data-cy=\"form.builder.add.step\"]").arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.get("[data-cy=\"form.builder.step.number\"]").eq(1).should("have.text", "Step #2");
      });

      it("Fill step #2 description", () => {
        cy.mpiEnterDescriptionToStep({ numbOfStep: 2, description: "Description of step two" });
      });

      it("Add attachment and check autosave", () => {
        cy.contains("Step #2").parentsUntil("li")
          .find("[data-cy=\"albumMediaButton\"]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.elUploadAttachment({
            fileName: "image.jpg",
            el: "fb-mediaalbum-upload-mpi-procedure-built-in.attachments",
          });
        });
      });

      it("Add 'Material one' to step #2", () => {
        cy.mpiAddMaterialDocumentToStep({ numbOfStep: 2, material: "Material one", quntity: "3", unit: "Each" });
      });

      it("Add 'Equipment one' to step #2", () => {
        cy.mpiAddEquipmentToStep({ numbOfStep: 2, equipment: "Equipment one" });
      });

      it("Clone Step #1", () => {
        SystemRequirement("REQ-3070");
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetAttachments,
          CyRoutes.GetAttachmentsAttached ], () => {
          cy.get("[data-cy=\"form.builder.clone.step\"]").eq(0).arrowClick();
        });
      });

      it("Edit Cloned step #1 clone description", () => {
        cy.mpiEnterDescriptionToStep({ numbOfStep: 2, description: "Description of Cloned step 1" });
      });

      it("Add attachment and check autosave", () => {
        cy.contains("Step #2").parentsUntil("li")
          .find("[data-cy=\"albumMediaButton\"]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.elUploadAttachment({
            fileName: "image.jpg",
            el: "fb-mediaalbum-upload-mpi-procedure-built-in.attachments",
          });
        });
      });

      it("Add 'Material two' to Cloned step #1", () => {
        cy.mpiAddMaterialDocumentToStep({ numbOfStep: 2, material: "Material two", quntity: "2", unit: "Each" });
      });

      it("Add 'Equipment two' to step #1", () => {
        cy.mpiAddEquipmentToStep({ numbOfStep: 2, equipment: "Equipment two" });
      });

      context("Release MPI", () => {
        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Approve and release QPI document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          });
        });
      });
    });
  });

  context("import export here", () => {
    // add here
  });

  context("Create Lot with form", () => {
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
      it("Enters title 'Lot'", () => {
        cy.drEnterDocumentTitle({ name: "Lot" });
      });

      it("Enters description 'Lot description'", () => {
        cy.drEnterDocumentDescription({ description: "Lot description" });
      });

      it("Selects 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Selects 'Lot Document' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Lots test" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Check status should be Draft", () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      });

      context("Check predefined fields", () => {
        it("Verify Initial quantity", () => {
          cy.get(`[data-cy="Initial Quantity"]`).should("exist");
        });

        it("Verify Usable Quantity", () => {
          cy.get(`[data-cy="Usable Quantity"]`).should("exist");
        });

        it("Verify Expiration Date", () => {
          cy.get(`[data-cy="Expiration Date"]`).should("exist");
        });

        it("Verify Part Selection", () => {
          cy.get(`[data-cy="Part Selection"]`).should("exist");
        });

        it("Verify 100% Inspection Override", () => {
          cy.get(`[data-cy="100% Inspection Override"]`).should("exist");
        });

        it("Verify Approvals", () => {
          cy.get(`[data-cy="form.builder.approvals"]`).should("exist");
        });

      });

      context("Add Form fields and Release", () => {
        it("Add TextField", () => {
          SystemRequirement("FB-0020", "FB-0030");
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
          cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
          cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder" });
          cy.fbEnterNameValue({ name: "rows", value: "2" });
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click();
          cy.fbSelectRadioButtonValue({ value: "Show/Hide" });
          cy.fbAddNewFieldButton();
        });


        it("Verify Edit, Move and Remove", () => {
          cy.get(`[data-cy="edit-schema-item"]`).arrowClick();
          cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder changed" });
          cy.fbAddNewFieldButton();
          cy.get(`textarea[placeholder^="fb-textfield placeholder changed"]`).should("exist");
          cy.get(`[data-cy="remove-schema-item"]`).arrowClick();
          cy.dragAndDrop({
            fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
            toSelector: `[class="drag-handle"]`,
          });
        });

        it("Verify Remove for Quantity items disabled", () => {
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
        });

        it("Verify Remove for Expiration date disabled", () => {
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
        });

        it("Verify Remove for Part Selection disabled", () => {
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
        });
      });
    });

    context("Approve and Release document", () => {
      it("Approve and Release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
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

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
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

      it("Check status should be Draft", () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      });

      context("Check predefined fields", () => {
        it("Verify Part to be Manufactured", () => {
          cy.get(`[data-cy="Part to be Manufactured"]`).should("exist");
        });

        it("Verify Initial Quantity", () => {
          cy.get(`[data-cy="Initial Quantity"]`).should("exist");
        });

        it("Verify End Quantity", () => {
          cy.get(`[data-cy="End Quantity"]`).should("exist");
        });

        it("Verify Build Type", () => {
          cy.get(`[data-cy="Build Type"]`).should("exist");
        });

        it("Verify Due Date", () => {
          cy.get(`[data-cy="Due Date"]`).should("exist");
        });

        it("Select Details tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Verify LHR Step", () => {
          cy.get(`[data-cy^="LHR Step"]`).should("exist");
        });

        it("Select Overview tab", () => {
          cy.drSelectOverviewTab();
        });

        it("Verify Approvals", () => {
          cy.get(`[data-cy="form.builder.approvals"]`).should("exist");
        });

      });

      context("Check Validations of fields", () => {
        // write here
      });

      context("Add Form fields and Release", () => {
        it("Add TextField", () => {
          SystemRequirement("FB-0020", "FB-0030");
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
          cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
          cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder" });
          cy.fbEnterNameValue({ name: "rows", value: "2" });
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click();
          cy.fbSelectRadioButtonValue({ value: "Show/Hide" });
          cy.fbAddNewFieldButton();
        });


        it("Verify Edit, Move and Remove", () => {
          cy.get(`[data-cy="edit-schema-item"]`).arrowClick();
          cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder changed" });
          cy.fbAddNewFieldButton();
          cy.get(`textarea[placeholder^="fb-textfield placeholder changed"]`).should("exist");
          cy.get(`[data-cy="remove-schema-item"]`).arrowClick();
          cy.dragAndDrop({
            fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
            toSelector: `[class="drag-handle"]`,
          });
        });

        it("Verify Remove for Part to be manufactured disabled", () => {
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
        });

        it("Verify Remove for Initial and End quantities disabled", () => {
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
        });

        it("Verify Remove for Build type disabled", () => {
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
          cy.get(`[data-cy="remove-schema-item"] [class="schema-delete-disabled"]`).should("exist");
        });
      });

      it("Select 'Part document' for Part to be Manufactured", () => {
        cy.get("[data-cy=\"lhr-selected-part\"]").arrowType("Material one");
        cy.get("ul>li[role=option]").contains("Material one").arrowClick();
      });

      context("Select created MPI in LHR template", () => {
        it("Select Details tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Click 'LHR Step'", () => {
          cy.get("[data-cy^=\"LHR Step\"]").arrowClick();
        });

        it("Select MPI document for step #1 in LHRt", () => {
          cy.get("input[data-cy=\"lhrstep-built-in\"]").then(($el) => {
            $el.trigger("click");
          });
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
            cy.listLoadingElementShouldNotExist();
            cy.get("input[data-cy=\"lhrstep-built-in\"]").autocompleteSelect("MPI document");
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });
      });

      context("Select created QPI in LHR template", () => {
        it("Add 'LHR Step'", () => {
          // add step
        });

        it("Select QPI document for step #2 in LHRt", () => {
          cy.get("input[data-cy=\"lhrstep-built-in\"]").then(($el) => {
            $el.trigger("click");
          });
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
            cy.listLoadingElementShouldNotExist();
            cy.get("input[data-cy=\"lhrstep-built-in\"]").autocompleteSelect("QPI document");
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });
      });

      context("Release LHRt document", () => {
        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Approve and release LHRt document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });
  });
});

export { };

