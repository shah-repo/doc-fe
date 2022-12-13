// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { LHRT } from "../../utils/constants/documentTypes/lhrt";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITestProcedureDeletable } from "../../utils/constants/documentTypes/mpi";
import { PurchaseOrderDocType } from "../../utils/constants/documentTypes/purchaseOrder";
import { QPITest } from "../../utils/constants/documentTypes/qpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let equipmentDocumentType;
let equipmentDocument;
let group;
let materialsDocumentType;
let materialsDocument;

context("Mpi/Qpi test", () => {
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
                ...MPITestProcedureDeletable,
                documentTypeAcronym: "MPI-",
              },
              QPITest,
              LHRT,
              LotHistoryRecordTest,
              PurchaseOrderDocType,
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

  context("5A MPI: Create MPI document", () => {
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
        SystemRequirement("REQ-3040");
        cy.drSelectDocumentType({ documentType: "Manufacturing Process Instructions Test" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Upload logo picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });

      it("Select Procedure tab", () => {
        cy.drSelectProcedureTab();
      });

      context("Fill step #1", () => {
        it("Fill step #1 description", () => {
          cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
        });

        it("Add attachment to step #1", () => {
          cy.contains("Step #1").parentsUntil("li")
            .find("[data-cy=\"albumMediaButton\"]").arrowClick();
          cy.wrapWithWaitOnApiCalls([CyRoutes.UploadAttachment, CyRoutes.GetAttachmentsAttached], () => {
            cy.elUploadAttachment({
              fileName: "test_image.jpg",
              el: "fb-mediaalbum-upload-mpi-procedure-built-in.attachments",
            });
          });
        });

        it("Add 'Material one' to step #1", () => {
          cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Material one", quntity: "3", unit: "As Needed" });
        });

        it("Verify 'As Needed' unit is listed", () => {
          cy.get("[data-cy='form.builder.mpi.procedure.materials.title']>div")
            .contains("MT-00004 - Material one | Qty: 3 as needed");
        });

        it("Click save document", () => {
          SystemRequirement("REQ-3120");
          cy.drClickCreateDocumentWithApiCallForForms();
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

  context("5B LHRs: Create LHRt document", () => {
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
        SystemRequirement("REQ-3140");
        cy.drSelectDocumentType({ documentType: "LHR template" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Lot History Record Test' output document type", () => {
        SystemRequirement("REQ-3140");
        cy.drSelectOutputDocumentType({ documentType: "Lot History Record Test" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Select 'Part document' for Part to be Manufactured", () => {
        cy.get("[data-cy=\"lhr-selected-part\"]").arrowType("Material one");
        cy.get("ul>li[role=option]").contains("Material one").arrowClick();
      });

      it("Navigate to Detail Tab", () => {
        cy.drSelectDetailsTab();
      });

      context("Select created MPI in LHR template", () => {
        it("Select MPI document for step #1 in LHRt", () => {
          cy.get("[data-cy=\"LHR Step 1\"]").arrowClick({ force: true });
          cy.get("input[data-cy=\"lhrstep-built-in\"]").autocompleteSelect("MPI document");
        });

        it("Verify 'As Needed' unit is listed", () => {
          cy.get("[data-cy=\"LHR Step 1\"]").arrowClick({ force: true });
          cy.get("[data-cy='form.builder.mpi.procedure.materials.title']>div")
            .contains("MT-00004 - Material one | Qty: 3 as needed");
        });
      });

      context("Release LHRt", () => {
        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Approve and release LHRt document", () => {
          SystemRequirement("REQ-3640");
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });
  });

  context("5C PO: Create PO document", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Purchase Order Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Purchase Order Form" });
    });

    it("Enter description 'New Purchase Order Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Purchase Order Form description" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Purchase Order' outputdocument type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Purchase Order test" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    context("Create Purchase Order document with Product option from Form document", () => {
      it("Click on 'Purchase Order' on sidebar", () => {
        cy.navigToPurchaseOrder();
      });

      it("Click on 'Create PO' button", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
          cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order test" });
        });
      });

      it("Check for PO ID uniqueness - ID should be POT-00001", () => {
        SystemRequirement("REQ-1270");
        cy.poCheckStatus( "POT-00001" );
      });

      it("Click on 'Purchase Order' on sidebar", () => {
        cy.navigToPurchaseOrder();
      });

      it("Click on existing PO that was created before", () => {
        SystemRequirement("REQ-1370", "REQ-1210");
        cy.poClickOnSpecificPOFromList({ item: "POT-00001" });
      });

      it("Check status of PO should be Draft", () => {
        SystemRequirement( "REQ-0020", "REQ-1280", "REQ-1610");
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      });

      it("navigate to Line Items", () => {
        cy.drSelectLineItems();
      });

      it("Uploads text.docx", () => {
        SystemRequirement("REQ-1350");
        cy.atchUploadAttachment({ fileName: "test.docx" });
      });

      it("Click on 'Add item' button", () => {
        SystemRequirement("REQ-1360");
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
          cy.poAddNewFieldItem();
        });
      });

      it("Click on 'Add' inside PO dialog box and check for required fields", () => {
        SystemRequirement("REQ-1400");
        cy.get("[data-cy=\"common.add\"]").click();
        cy.get("p[class*='MuiFormHelperText-root']>span")
          .contains("The Part Number field is required when Supplier Part Number is empty.");
        cy.get("p[class*='MuiFormHelperText-root']>span")
          .contains("The Supplier Part Number field is required when Part Number is empty.");
      });

      it("Select Part Number", () => {
        SystemRequirement("REQ-1410");
        cy.poSelectPartNumber({ partNo: "ET-00003 - 1" });
      });

      it("Enter Quantity Ordered", () => {
        SystemRequirement("REQ-1410");
        cy.poEnterQuantityOrdered({ quantity: "5" });
      });

      it("Select Units", () => {
        cy.get("[name=\"units\"]").click().focused().autocompleteSelect("As Needed");
        cy.unClick();
      });

      it("Select GL code", () => {
        SystemRequirement("REQ-1410");
        cy.poSelectGLCode();
      });

      it("Enter Supplier Part Number", () => {
        SystemRequirement("REQ-1410");
        cy.poEnterSupplierPartNumber({ partNumber: "PRT-0004" });
      });

      it("Enter number of Units", () => {
        SystemRequirement("REQ-1410");
        cy.poNumberOfUnits({ number: "2" });
      });

      it("Add Required Date", () => {
        SystemRequirement("REQ-1410");
        cy.get("[name=\"date\"]").next().find("button").arrowClick();
        cy.get(".MuiPickersDay-daySelected").arrowClick();
      });

      it("Check Tax box", () => {
        SystemRequirement("REQ-1450");
        cy.poSelectTaxCheckbox();
      });

      it("Click on 'Add' inside PO dialog box", () => {
        cy.poAddPOButtonClick();
      });

      it("Verify 'As Needed' unit is listed", () => {
        cy.get("[data-cy='units']").contains("as needed");
      });

      it("Save PO", () => {
        cy.wait(2000);
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });

      it("Switch to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it(`Select '${USERS[1].name}' for Requestor`, () => {
        cy.get("[data-cy='po-requestor-autocomplete']").arrowClick();
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
      });

      it("Select Order Date", () => {
        cy.get("input[name^=ordered]").parent().find("button").arrowClick();
        cy.get("button.MuiPickersDay-day[tabindex=\"0\"]").last().arrowClick();
      });

      it("Save PO document", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.PatchDocRev], () => {
            cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
          });
        cy.checkToastMessage({ exists: false });
      });

      it("Click 'Submit for Approval' button", () => {
        cy.pmSubmitForApproval();
      });

      it("Click 'Approve' button", () => {
        cy.ebApproveWithoutApi();
      });
    });
  });
});

export { };

