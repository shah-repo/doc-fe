// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { LHRTTest } from "../../utils/constants/documentTypes/lhrt";
import { LotsTestWithSchama } from "../../utils/constants/documentTypes/lot";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { QPITest } from "../../utils/constants/documentTypes/qpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

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
              QPITest,
              LHRTTest,
              LotsTestWithSchama,
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
      it("Add TextField 1", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "fb-textfield-1" });
        cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder 1" });
        cy.fbEnterNameValue({ name: "rows", value: "2" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
        cy.fbAddNewFieldButton();
      });

      it("Add TextField 2", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "fb-textfield-2" });
        cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder 2" });
        cy.fbEnterNameValue({ name: "rows", value: "2" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
        cy.fbSelectRadioButtonValue({ value: "visibility" });
        cy.fbAddNewFieldButton();
      });

      it("Verify Edit, Move and Remove", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield-2" });
        cy.fbEnterPlaceholder({ placeholder: " changed" });
        cy.fbAddNewFieldButton();
        cy.get(`textarea[placeholder^="fb-textfield placeholder 2 changed"]`).should("exist");
        cy.fbClickRemoveBtn({ label: "fb-textfield-2" });
      });

      it("Move component", () => {
        cy.get("[data-cy='fb-textfield-1']").eq(0).trigger("mouseover", { force: true });
        cy.wait(2000);
        cy.get(".drag-handle").eq(1)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(".drag-handle").eq(0)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
        cy.unClick();
      });

      it("Select Procedure tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Verify Start quantity disabled", () => {
        cy.fbVerifyElementClassByLabel({
          label: "Start quantity", el: "remove-schema-item",
          class: "schema-delete-disabled",
        });
      });

      it("Verify Accepted quantity disabled", () => {
        cy.fbVerifyElementClassByLabel({
          label: "Accepted quantity", el: "remove-schema-item",
          class: "schema-delete-disabled",
        });
      });

      it("Verify Rejected quantity disabled", () => {
        cy.fbVerifyElementClassByLabel({
          label: "Rejected quantity", el: "remove-schema-item",
          class: "schema-delete-disabled",
        });
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
          .find(`[data-cy="albumMediaButton"]`).arrowClick();
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

    context("Add step and clone step", () => {
      it("Verify step can be added and add step 2", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get(`[data-cy="form.builder.add.step"]`).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.get(`[data-cy="form.builder.step.number"]`).eq(1).should("have.text", "Step #2");
      });

      it("Fill step #2 description", () => {
        cy.mpiEnterDescriptionToStep({ numbOfStep: 2, description: "Description of step two" });
      });

      it("Add attachment and check autosave", () => {
        cy.contains("Step #2").parentsUntil("li")
          .find(`[data-cy="albumMediaButton"]`).arrowClick();
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
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetAttachments,
          CyRoutes.GetAttachmentsAttached ], () => {
          cy.get(`[data-cy="form.builder.clone.step"]`).eq(0).arrowClick();
        });
      });

      it("Edit Cloned step #1 clone description", () => {
        cy.mpiEnterDescriptionToStep({ numbOfStep: 2, description: "Description of Cloned step 1" });
      });

      it("Add 'Material two' to Cloned step #1", () => {
        cy.mpiAddMaterialDocumentToStep({ numbOfStep: 2, material: "Material two", quntity: "2", unit: "Each" });
      });

      it("Add 'Equipment two' to step #1", () => {
        cy.mpiAddEquipmentToStep({ numbOfStep: 2, equipment: "Equipment two" });
      });
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

  context("export", () => {
    it("Export template", () => {
      cy.get(`[data-cy="FBWorkspace-exportTemplate"]`).eq(0).click();
      cy.get(`[data-cy="fb-template-name"]`).arrowType("MPI_Template");
      cy.get(`[data-cy="common.add"]`).arrowClick();
    });
  });

  context("Start document creation flow again", () => {
    it("Navigate to Document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Fill in the MPI attributes for form 2", () => {
    it("Enter title 'MPI document 2", () => {
      cy.drEnterDocumentTitle({ name: "MPI document 2" });
    });

    it("Enter description 'MPI document description 2'", () => {
      cy.drEnterDocumentDescription({ description: "MPI document description 2" });
    });

    it("Select 'Manufacturing Process Instructions Test 2' document type from dropdown", () => {
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
  });

  context("import", () => {
    it("Import template", () => {
      cy.get("#fb-import-schema").attachFile("../downloads/MPI_Template.json");
    });
  });

  context("Check predefined fields", () => {
    it("Verify Approvals Section", () => {
      cy.get(`[data-cy="Approvals"]`).should("exist").should("have.length", "1");
    });

    it("Verify Approvals block", () => {
      cy.get("[name=fb-approvals-approvals-built-in]").should("exist").should("have.length", "1");
    });

    it("Select Procedure tab", () => {
      cy.drSelectProcedureTab();
    });

    it("Verify PI Procedure", () => {
      cy.get(`[data-cy="form.builder.mpiprocedure"]`).should("exist").should("have.length", "1");
    });

    it("Verify Start quantity", () => {
      cy.get(`[data-cy="Start quantity"]`).should("exist").should("have.length", "1");
    });

    it("Verify Accepted quantity", () => {
      cy.get(`[data-cy="Accepted quantity"]`).should("exist").should("have.length", "1");
    });

    it("Verify Rejected quantity", () => {
      cy.get(`[data-cy="Rejected quantity"]`).should("exist").should("have.length", "1");
    });

    it("Select Overview tab", () => {
      cy.drSelectOverviewTab();
    });
  });

  context("Verify Fields", () => {
    it("Verify TextField attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-textfield-1" });
      cy.fbVerifyNameValue({ name: "placeholder", value: "fb-textfield placeholder 1" });
      cy.fbVerifyNameValue({ name: "rows", value: "2" });
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbClickButton({ el: "fb-editor-actions-cancel" });
    });
  });

  context("add and verify", () => {
    it("Add TextField 2", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield-2" });
      cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder 2" });
      cy.fbEnterNameValue({ name: "rows", value: "2" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
      cy.fbSelectRadioButtonValue({ value: "visibility" });
      cy.fbAddNewFieldButton();
    });

    it("Verify Edit, Move and Remove", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield-2" });
      cy.fbEnterPlaceholder({ placeholder: " changed" });
      cy.fbAddNewFieldButton();
      cy.get(`textarea[placeholder^="fb-textfield placeholder 2 changed"]`).should("exist");
      cy.fbClickRemoveBtn({ label: "fb-textfield-2" });
    });

    it("Move component", () => {
      cy.get("[id='fb-approvals-section-approvals-built-in']").trigger("mouseover", { force: true });
      cy.wait(2000);
      cy.get(".drag-handle").eq(1)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(0)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
    });
  });

  context("Create QPI document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in the QPI attributes", () => {
      it("Enter title 'QPI document", () => {
        cy.drEnterDocumentTitle({ name: "QPI document" });
      });

      it("Enter description 'QPI document description'", () => {
        cy.drEnterDocumentDescription({ description: "QPI document description" });
      });

      it("Select 'Quality Process Instructions Test' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Quantity Process Instructions Test" });
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
      it("Add TextField 1", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "fb-textfield-1" });
        cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder 1" });
        cy.fbEnterNameValue({ name: "rows", value: "2" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
        cy.fbAddNewFieldButton();
      });

      it("Add TextField 2", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "fb-textfield-2" });
        cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder 2" });
        cy.fbEnterNameValue({ name: "rows", value: "2" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
        cy.fbSelectRadioButtonValue({ value: "visibility" });
        cy.fbAddNewFieldButton();
      });

      it("Verify Edit, Move and Remove", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield-2" });
        cy.fbEnterPlaceholder({ placeholder: " changed" });
        cy.fbAddNewFieldButton();
        cy.get(`textarea[placeholder^="fb-textfield placeholder 2 changed"]`).should("exist");
        cy.fbClickRemoveBtn({ label: "fb-textfield-2" });
      });

      it("Move component", () => {
        cy.get("[data-cy='fb-textfield-1']").eq(0).trigger("mouseover", { force: true });
        cy.wait(2000);
        cy.get(".drag-handle").eq(1)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(".drag-handle").eq(0)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
        cy.unClick();
      });

      it("Select Procedure tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Verify Start quantity disabled", () => {
        cy.fbVerifyElementClassByLabel({
          label: "Start quantity", el: "remove-schema-item",
          class: "schema-delete-disabled",
        });
      });

      it("Verify Accepted quantity disabled", () => {
        cy.fbVerifyElementClassByLabel({
          label: "Accepted quantity", el: "remove-schema-item",
          class: "schema-delete-disabled",
        });
      });

      it("Verify Rejected quantity disabled", () => {
        cy.fbVerifyElementClassByLabel({
          label: "Rejected quantity", el: "remove-schema-item",
          class: "schema-delete-disabled",
        });
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
          .find(`[data-cy="albumMediaButton"]`).arrowClick();
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

    context("Add step and clone step", () => {
      it("Verify step can be added and add step 2", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get(`[data-cy="form.builder.add.step"]`).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.get(`[data-cy="form.builder.step.number"]`).eq(1).should("have.text", "Step #2");
      });

      it("Fill step #2 description", () => {
        cy.mpiEnterDescriptionToStep({ numbOfStep: 2, description: "Description of step two" });
      });

      it("Add attachment and check autosave", () => {
        cy.contains("Step #2").parentsUntil("li")
          .find(`[data-cy="albumMediaButton"]`).arrowClick();
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
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetAttachments,
          CyRoutes.GetAttachmentsAttached ], () => {
          cy.get(`[data-cy="form.builder.clone.step"]`).eq(0).arrowClick();
        });
      });

      it("Edit Cloned step #1 clone description", () => {
        cy.mpiEnterDescriptionToStep({ numbOfStep: 2, description: "Description of Cloned step 1" });
      });

      it("Add 'Material two' to Cloned step #1", () => {
        cy.mpiAddMaterialDocumentToStep({ numbOfStep: 2, material: "Material two", quntity: "2", unit: "Each" });
      });

      it("Add 'Equipment two' to step #1", () => {
        cy.mpiAddEquipmentToStep({ numbOfStep: 2, equipment: "Equipment two" });
      });
    });

    context("Release QPI", () => {
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

  context("export QPI", () => {
    it("Export QPI template", () => {
      cy.get(`[data-cy="FBWorkspace-exportTemplate"]`).eq(0).click();
      cy.get(`[data-cy="fb-template-name"]`).arrowType("QPI_Template");
      cy.get(`[data-cy="common.add"]`).arrowClick();
    });
  });

  context("Start document creation flow again", () => {
    it("Navigate to Document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Fill in the QPI attributes for form 2", () => {
    it("Enter title 'QPI document 2", () => {
      cy.drEnterDocumentTitle({ name: "QPI document 2" });
    });

    it("Enter description 'QPI document description 2'", () => {
      cy.drEnterDocumentDescription({ description: "QPI document description 2" });
    });

    it("Select 'Quality Process Instructions Test 2' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Quantity Process Instructions Test" });
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
  });

  context("import QPI", () => {
    it("Import template", () => {
      cy.get("#fb-import-schema").attachFile("../downloads/QPI_Template.json");
    });
  });

  context("Check predefined fields", () => {
    it("Verify Approvals Section", () => {
      cy.get(`[data-cy="Approvals"]`).should("exist").should("have.length", "1");
    });

    it("Verify Approvals block", () => {
      cy.get("[name=fb-approvals-approvals-built-in]").should("exist").should("have.length", "1");
    });

    it("Select Procedure tab", () => {
      cy.drSelectProcedureTab();
    });

    it("Verify PI Procedure", () => {
      cy.get(`[data-cy="form.builder.mpiprocedure"]`).should("exist").should("have.length", "1");
    });

    it("Verify Start quantity", () => {
      cy.get(`[data-cy="Start quantity"]`).should("exist").should("have.length", "1");
    });

    it("Verify Accepted quantity", () => {
      cy.get(`[data-cy="Accepted quantity"]`).should("exist").should("have.length", "1");
    });

    it("Verify Rejected quantity", () => {
      cy.get(`[data-cy="Rejected quantity"]`).should("exist").should("have.length", "1");
    });

    it("Select Overview tab", () => {
      cy.drSelectOverviewTab();
    });
  });

  context("Verify Fields", () => {
    it("Verify TextField attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-textfield-1" });
      cy.fbVerifyNameValue({ name: "placeholder", value: "fb-textfield placeholder 1" });
      cy.fbVerifyNameValue({ name: "rows", value: "2" });
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbClickButton({ el: "fb-editor-actions-cancel" });
    });
  });

  context("Add and remove check", () => {
    it("Add TextField 2", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield-2" });
      cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder 2" });
      cy.fbEnterNameValue({ name: "rows", value: "2" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
      cy.fbSelectRadioButtonValue({ value: "visibility" });
      cy.fbAddNewFieldButton();
    });

    it("Verify Edit, Move and Remove", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield-2" });
      cy.fbEnterPlaceholder({ placeholder: " changed" });
      cy.fbAddNewFieldButton();
      cy.get(`textarea[placeholder^="fb-textfield placeholder 2 changed"]`).should("exist");
      cy.fbClickRemoveBtn({ label: "fb-textfield-2" });
    });

    it("Move component", () => {
      cy.get("[id='fb-approvals-section-approvals-built-in']").trigger("mouseover", { force: true });
      cy.wait(2000);
      cy.get(".drag-handle").eq(1)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(0)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
    });
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
        cy.drSelectOutputDocumentType({ documentType: "Lots test with Schema" });
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
        it("Add TextField 1", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
          cy.fbEnterNameValue({ name: "label", value: "fb-textfield-1" });
          cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder 1" });
          cy.fbEnterNameValue({ name: "rows", value: "2" });
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
          cy.fbAddNewFieldButton();
        });

        it("Add TextField 2", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
          cy.fbEnterNameValue({ name: "label", value: "fb-textfield-2" });
          cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder 2" });
          cy.fbEnterNameValue({ name: "rows", value: "2" });
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
          cy.fbSelectRadioButtonValue({ value: "visibility" });
          cy.fbAddNewFieldButton();
        });

        it("Verify Edit, Move and Remove", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield-2" });
          cy.fbEnterPlaceholder({ placeholder: " changed" });
          cy.fbAddNewFieldButton();
          cy.get(`textarea[placeholder^="fb-textfield placeholder 2 changed"]`).should("exist");
          cy.fbClickRemoveBtn({ label: "fb-textfield-2" });
        });

        it("Move component", () => {
          cy.get("[data-cy='fb-textfield-1']").trigger("mouseover", { force: true });
          cy.wait(2000);
          cy.get(".drag-handle").eq(6)
            .realMouseDown({ position: "center", button: "left" });
          cy.wait(3000);
          cy.get(".drag-handle").eq(5)
            .realMouseMove(0, 0, { position: "center" })
            .realMouseUp();
          cy.unClick();
        });

        it("Verify Initial Quantity disabled", () => {
          cy.fbVerifyElementClassByLabel({
            label: "Initial Quantity", el: "remove-schema-item",
            class: "schema-delete-disabled",
          });
        });

        it("Verify Usable Quantity disabled", () => {
          cy.fbVerifyElementClassByLabel({
            label: "Usable Quantity", el: "remove-schema-item",
            class: "schema-delete-disabled",
          });
        });

        it("Verify Expiration Date disabled", () => {
          cy.fbVerifyElementClassByLabel({
            label: "Expiration Date", el: "remove-schema-item",
            class: "schema-delete-disabled",
          });
        });

        it("Verify Part Selection disabled", () => {
          cy.fbVerifyElementClassByLabel({
            label: "Part Selection", el: "remove-schema-item",
            class: "schema-delete-disabled",
          });
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
        it("Validate part to be manufactured", () => {
          cy.get(`[name="lhr-selected-part"]`).parent().parent()
            .should("contain.text", "The Part to be Manufactured is a required field.");
        });

        it("Validate Build Type", () => {
          cy.get(`[label="Build Type"]`).parent().parent()
            .should("not.contain", "The Build Type is a required field.");
        });

        it("Select Details tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Click 'LHR Step'", () => {
          cy.get(`[data-cy^="LHR Step"]`).arrowClick();
        });

        it("Validate LHR Step", () => {
          cy.get(`[name="lhrstep-built-in"]`).parent().parent()
            .should("contain.text", "The LHR Step is a required field.");
        });
      });

      context("Add Form fields and Release", () => {
        it("Select Overview tab", () => {
          cy.drSelectOverviewTab();
        });

        it("Add TextField 1", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
          cy.fbEnterNameValue({ name: "label", value: "fb-textfield-1" });
          cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder 1" });
          cy.fbEnterNameValue({ name: "rows", value: "2" });
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
          cy.fbAddNewFieldButton();
        });

        it("Add TextField 2", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
          cy.fbEnterNameValue({ name: "label", value: "fb-textfield-2" });
          cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder 2" });
          cy.fbEnterNameValue({ name: "rows", value: "2" });
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
          cy.fbSelectRadioButtonValue({ value: "visibility" });
          cy.fbAddNewFieldButton();
        });

        it("Verify Edit, Move and Remove", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield-2" });
          cy.fbEnterPlaceholder({ placeholder: " changed" });
          cy.fbAddNewFieldButton();
          cy.get(`textarea[placeholder^="fb-textfield placeholder 2 changed"]`).should("exist");
          cy.fbClickRemoveBtn({ label: "fb-textfield-2" });
        });

        it("Move component", () => {
          cy.get("[data-cy='fb-textfield-1']").eq(0).trigger("mouseover", { force: true });
          cy.wait(2000);
          cy.get(".drag-handle").eq(6)
            .realMouseDown({ position: "center", button: "left" });
          cy.wait(3000);
          cy.get(".drag-handle").eq(5)
            .realMouseMove(0, 0, { position: "center" })
            .realMouseUp();
          cy.unClick();
        });

        it("Verify Part to be Manufactured disabled", () => {
          cy.fbVerifyElementClassByLabel({
            label: "Part to be Manufactured", el: "remove-schema-item",
            class: "schema-delete-disabled",
          });
        });

        it("Verify Initial Quantity disabled", () => {
          cy.fbVerifyElementClassByLabel({
            label: "Initial Quantity", el: "remove-schema-item",
            class: "schema-delete-disabled",
          });
        });

        it("Verify End Quantity disabled", () => {
          cy.fbVerifyElementClassByLabel({
            label: "End Quantity", el: "remove-schema-item",
            class: "schema-delete-disabled",
          });
        });

        it("Verify Build Type disabled", () => {
          cy.fbVerifyElementClassByLabel({
            label: "Build Type", el: "remove-schema-item",
            class: "schema-delete-disabled",
          });
        });
      });

      context("select part", () => {
        it("Select 'Part document' for Part to be Manufactured", () => {
          cy.get(`[data-cy="lhr-selected-part"]`).arrowType("Material one");
          cy.get("ul>li[role=option]").contains("Material one").arrowClick();
        });
      });

      context("Select created MPI in LHR template", () => {
        it("Select Details tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Click 'LHR Step 1'", () => {
          cy.get(`[data-cy^="LHR Step 1"]`).arrowClick({ force: true });
        });

        it("Select MPI document for step #1 in LHRt", () => {
          cy.get(`input[data-cy="lhrstep-built-in"]`).then(($el) => {
            $el.trigger("click");
          });
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
            cy.listLoadingElementShouldNotExist();
            cy.get(`input[data-cy="lhrstep-built-in"]`).autocompleteSelect("MPI document");
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });
      });

      context("Select created QPI in LHR template", () => {
        it("Click 'Add Step'", () => {
          cy.get(`[data-cy^="form.builder.add.step"]`).arrowClick().wait(1000);
        });

        it("Click 'LHR Step 2'", () => {
          cy.get(`[data-cy^="LHR Step 2"]`).arrowClick({ force: true });
        });

        it("Select QPI document for step #2 in LHRt", () => {
          cy.get(`input[data-cy^="lhr-step"]`).then(($el) => {
            $el.trigger("click");
          });
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
            cy.listLoadingElementShouldNotExist();
            cy.get(`input[data-cy^="lhr-step"]`).autocompleteSelect("QPI document");
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

      context("export LHRT", () => {
        it("Export QPI template", () => {
          cy.get(`[data-cy="FBWorkspace-exportTemplate"]`).eq(0).click();
          cy.get(`[data-cy="fb-template-name"]`).arrowType("LHR_Template");
          cy.get(`[data-cy="common.add"]`).arrowClick();
        });
      });

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
        it("Enter document title 'LHRt document 2'", () => {
          cy.drEnterDocumentTitle({ name: "LHRt document 2" });
        });

        it("Fill LHRt document description", () => {
          cy.drEnterDocumentDescription({ description: "LHRt document description 2" });
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
      });

      context("import", () => {
        it("Import template", () => {
          cy.get("#fb-import-schema").attachFile("../downloads/LHR_Template.json");
        });
      });

      context("Check predefined fields", () => {
        it("Verify Part to be Manufactured", () => {
          cy.get(`[data-cy="Part to be Manufactured"]`).should("exist").should("have.length", 1);
        });

        it("Verify Initial Quantity", () => {
          cy.get(`[data-cy="Initial Quantity"]`).should("exist").should("have.length", 1);
        });

        it("Verify End Quantity", () => {
          cy.get(`[data-cy="End Quantity"]`).should("exist").should("have.length", 1);
        });

        it("Verify Build Type", () => {
          cy.get(`[data-cy="Build Type"]`).should("exist").should("have.length", 1);
        });

        it("Verify Due Date", () => {
          cy.get(`[data-cy="Due Date"]`).should("exist").should("have.length", 1);
        });

        it("Select Details tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Verify LHR Step", () => {
          cy.get(`[data-cy^="LHR Step"]`).should("exist").should("have.length", 1);
        });

        it("Select Overview tab", () => {
          cy.drSelectOverviewTab();
        });

        it("Verify Approvals", () => {
          cy.get(`[data-cy="form.builder.approvals"]`).should("have.length", 1);
        });

      });

      context("Verify Fields", () => {
        it("Verify TextField attributes", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield" });
          cy.fbVerifyNameValue({ name: "label", value: "fb-textfield-1" });
          cy.fbVerifyNameValue({ name: "placeholder", value: "fb-textfield placeholder 1" });
          cy.fbVerifyNameValue({ name: "rows", value: "2" });
          cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
        });
      });

      context("Add and remove check", () => {
        it("Add TextField 2", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
          cy.fbEnterNameValue({ name: "label", value: "fb-textfield-2" });
          cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder 2" });
          cy.fbEnterNameValue({ name: "rows", value: "2" });
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
          cy.fbSelectRadioButtonValue({ value: "visibility" });
          cy.fbAddNewFieldButton();
        });

        it("Verify Edit, Move and Remove", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield-2" });
          cy.fbEnterPlaceholder({ placeholder: " changed" });
          cy.fbAddNewFieldButton();
          cy.get(`textarea[placeholder^="fb-textfield placeholder 2 changed"]`).should("exist");
          cy.fbClickRemoveBtn({ label: "fb-textfield-2" });
        });

        it("Move component", () => {
          cy.get("[data-cy='fb-textfield-1']").eq(0).trigger("mouseover", { force: true });
          cy.wait(2000);
          cy.get(".drag-handle").eq(5)
            .realMouseDown({ position: "center", button: "left" });
          cy.wait(3000);
          cy.get(".drag-handle").eq(4)
            .realMouseMove(0, 0, { position: "center" })
            .realMouseUp();
          cy.unClick();
        });
      });

    });
  });
});
