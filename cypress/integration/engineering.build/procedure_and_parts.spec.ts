
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let multipleCompanies;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocumentType;
let materialsDocumentType;
let partDocumentType;
let equipmentDocument;
let materialsDocument;
let formDocumentType;
let CSLDocumentType;
let createdLotsFormDocument;
let createdPartDocument;

const NOT_RELEASED_TOAST_ERROR_MESSAGE = "Last docRev for Part linked to EB after copying is not in RELEASED status.";
const currentDate = moment().tz("America/Los_Angeles").format("MMMM D, YYYY");
const PART_DOCUMENT_TYPE_NAME = "Part";

context("Procedure and parts flow test", () => {
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
    it("[API]Create company", (done: any) => {
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response) => {
        loginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[1].email,
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: USERS[5].email,
            numOfRevStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                documentTypeName: PART_DOCUMENT_TYPE_NAME,
                documentTypeAcronym: "PRT-",
                group: "PART",
                isQms: true,
                needsSignature: true,
                category: "Parts",
              },
              {
                documentTypeName: "Material",
                documentTypeAcronym: "MT-",
                group: "MATERIAL",
                isQms: true,
                needsSignature: true,
                category: "Materials",
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Material");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, PART_DOCUMENT_TYPE_NAME);
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          CSLDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specifications Lot");
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1;
        done();
      });
    });

    it("[API]Create equipment document", () => {
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
              description: "<p>Equipment document</p>",
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
              name: "Equipment document",
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
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            });
          });
        });
      });
    });

    it("[API]Create materials document", () => {
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
          name: "Materials document",
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
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
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
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => {
          done();
        });
      });
    });

    it("[API]Create part for eb document", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Part for EB document</p>",
          document: {
            docId: "PRT-00006",
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
          name: "Part for EB document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      });
    });

    it("[API]Create Lots form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Lots Form document</p>",
          document: {
            docId: "FM-00008",
            documentType: {
              id: formDocumentType[0].id,
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
          name: "Lots form document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: CSLDocumentType[0].id,
            }],
            schema: [
              {
                name: "lot_quantity",
                type: "quantity",
                index: 0,
                label: "Quantity Received",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                editorProperties: [

                ],
                validationAttribute: "Quantity Received",
                applicableValidationSchema: true,
              },
              {
                name: "expiry-date",
                type: "datepicker",
                index: 1,
                label: "Expiry Date",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                editorProperties: [],
                validationAttribute: "Expiry Date",
                applicableValidationSchema: true,
              },
              {
                name: "100-inspection-override",
                type: "checkboxgroup",
                index: 2,
                label: "100% Inspection Override",
                options: [
                  {
                    text: "100% Inspection Override",
                    value: "100% Inspection Override",
                  },
                ],
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                editorProperties: [],
                validationAttribute: "100% Inspection Override",
                applicableValidationSchema: true,
              },
              {
                label: "form.builder.approvals",
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-ki5yh7ba",
                uniqueSchemaItem: true,
                index: 5,
              },
            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdLotsFormDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdLotsFormDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => {
          done();
        });
      });
    });
  });

  context("Login second user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Create lot document", () => {
    it("Navigate to Records", () => {
      cy.navigToRecords();
    });

    it("Click on Create new", () => {
      cy.poClickCreatePO();
    });

    it("Select 'Component Specifications Lot' from the dropdown", () => {
      cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").click();
      cy.wait(500);
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.DocPreview, CyRoutes.GetAvailableApprovers], () => {
        cy.get("div[id^=react-select]").contains("Component Specifications Lot").click();
      });
    });

    it("Add lot title", () => {
      cy.drEnterDocumentTitle({ name: "Component specification lot document" });
    });

    it("Select 'Part document' in references", () => {
      cy.drSelectReferences( "Part document" );
    });

    it("Enter quantity received", () => {
      cy.get("[name=\"lot_quantity\"]").type("12");
    });

    it("Check 100% override", () => {
      cy.get("[value=\"100% Inspection Override\"]").check();
    });

    it("Add 'Expiry Date'", () => {
      cy.poAddDateRequired();
    });

    it("Create 'Preventative maintenance document'", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.wait(5000);
    });

    it("Add an Approval'", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record", () => {
      cy.ebApprove();
    });

    it("Verify status is 'Released'", () => {
      cy.drCheckDocumentStatus({ status: "Released" });
    });
  });

  context("Create equipment document", () => {
    context("Fill document attributes", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enters title 'New Equipment for procedure'", () => {
        cy.drEnterDocumentTitle({ name: "New Equipment for procedure" });
      });

      it("Enters description 'Equipment description'", () => {
        cy.drEnterDocumentDescription({ description: "Equipment description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Selects 'Equipment' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Equipment" });
      });
    });

    context("Create document and release it", () => {
      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      context("Create Approval Request for equipment document", () => {
        it("Navigate to approval request list", () => {
          cy.navigToApprovalRequestList();
        });

        it("Click Create a Approval Request button", () => {
          cy.cmpClickCreateApprovalRequest();
        });

        it("Enter title AR title: ", () => {
          cy.arEnterApprovalRequestTitle({ title: "Approval request for equipment document" });
        });

        it("Enter description 'AR from New form template for approval request'", () => {
          cy.arEnterApprovalRequestDescription({ description: "equipment document AR" });
        });

        it("Add created document revision", () => {
          cy.arClickAddDocument().wait(500);
          cy.arChoseSpecificProposedDocument({ name: "EQ-00001" });
          cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
          cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
          cy.arClickAddBtnOnAddDocumentsDialog();
        });

        it("Add first approver to approval request on approver list", () => {
          cy.arAddApproverOnApproverList({ approver: USERS[1].email });
        });

        it("Click Create Approval Request", () => {
          cy.arClickCreateApprovalRequestAfterCompletingForm();
        });

        it("Click 'Send To Review'", () => {
          cy.arClickSendToReview();
        });

        it("Verify AR status is 'In Review'", () => {
          cy.arVerifyStatus({ status: "In Review" });
        });

        it("Approve AR", () => {
          cy.arApproveAR();
        });

        it("Check approval request status is 'Approved'", () => {
          cy.arVerifyStatus({ status: "Approved" });
        });

        it("Close AR", () => {
          cy.arCloseAR();
        });

        it("Check approval request status is 'Closed'", () => {
          cy.arVerifyStatus({ status: "Closed" });
        });
      });
    });
  });

  context("Create materials document", () => {
    context("Fill document attributes", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enters title 'New Material for procedure'", () => {
        cy.drEnterDocumentTitle({ name: "New Material for procedure" });
      });

      it("Enters description 'Material description'", () => {
        cy.drEnterDocumentDescription({ description: "Material description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Selects 'Equipment' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Material" });
      });
    });

    context("Create document and release it", () => {
      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCall();
        cy.wait(8000);
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create FORM document with procedure field", () => {
    context("Fill document attributes", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enters title 'Form document for procedure'", () => {
        cy.drEnterDocumentTitle({ name: "Form document for EB" });
      });

      it("Enters description 'Procedure description'", () => {
        cy.drEnterDocumentDescription({ description: "EB form description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Selects 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Selects 'Engineering Build' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Engineering Build" });
      });

      it("Add procedure field", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectCustomFieldToAdd({ name: "Procedure" });
        cy.get("[value=\"copyableValue\"]").check();
        cy.fbAddField();
      });
    });

    context("Create document and release it", () => {
      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCall();
        cy.wait(8000);
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });


  context("Create EB from created FORM document", () => {
    it("Click create new document from FORM", () => {
      cy.drCreateNewDocumentFromForm();
    });
    context("Fill EB document attributes", () => {
      it("Enters title 'Form document for procedure'", () => {
        cy.drEnterDocumentTitle({ name: "EB document" });
      });

      it("Add approver to approvals", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Add material document", () => {
        cy.pmAddMaterialDocumentToProcedure({
          materialDoc: "Part document",
          partLotDoc: "Component specification lot document",
          numberOfMaterial: 2,
          typeOfMaterial: "gram",
        });
      });

      it("Add free material text", () => {
        cy.pmAddFreeTextMaterial({
          material: "Free text material",
          partLot: "Test",
          numberOfMaterial: 3,
          typeOfMaterial: "pounds",
        });
      });

      it("Add equipment document", () => {
        cy.pmAddEquipmentDocument({ equipmentDoc: "Equipment document" });
      });

      it("Add free equipment text", () => {
        cy.pmAddFreeTextEquipment({ equipment: "Free text equipment" });
      });

      it("Upload attachment 'image.jpg'", () => {
        cy.get("[data-cy=\"media.upload\"]>div>div>button").click();
        cy.pmUploadAttachment({ fileName: "image.jpg" });
      });

      it("Upload attachment 'test.docx'", () => {
        cy.pmUploadAttachment({ fileName: "test.docx" });
      });
    });

    context("Choose a part and approve EB", () => {
      it("Choose an existing part from the list of available parts", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
          cy.get("[data-cy=\"childrenParts\"]").type("Part for EB document{downarrow}{enter}");
        });
      });

      it("Submit for Approval", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview, CyRoutes.DocRevPreview], () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
        });
      });

      it("Check if the part is displayed in the document summary", () => {
        cy.ebCheckIfPartIsInSummary({ partName: "Part for EB document" });
      });

      it("Approve record button click", () => {
        cy.ebApprove();
      });
    });
  });

  context("Clone EB and verify materials and equipment tracking", () => {
    it("Click Clone EB", () => {
      cy.ebClickClone();
    });

    context("Add materials and equipments", () => {
      it("Add material document", () => {
        cy.pmAddMaterialDocumentToProcedure({
          materialDoc: "New Material for procedure",
          numberOfMaterial: 3,
          typeOfMaterial: "gram",
        });
      });

      it("Add free material text", () => {
        cy.pmAddFreeTextMaterial({
          material: "Free text material",
          numberOfMaterial: 2,
          typeOfMaterial: "pounds",
        });
      });

      it("Add equipment document", () => {
        cy.pmAddEquipmentDocument({ equipmentDoc: "New Equipment for procedure" });
      });

      it("Add free equipment text", () => {
        cy.pmAddFreeTextEquipment({ equipment: "Free text equipment" });
      });

      it("Add approver to approvals", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Verify change from previous build", () => {
      it("Click 'Show changes from previous build'", () => {
        cy.pmToggleChangesFromPrevBuild();
      });

      it("Verify 'New Material for procedure' is added to materials", () => {
        cy.get("[data-cy=\"form.builder.procedure.materials.title\"]").eq(0)
          .should("contain.text", "New Material for procedure")
          .should("contain.text", "Qty: 3")
          .should("contain.text", "gram");
      });

      it("Verify 'Free text material' has increased number of materials to '5'", () => {
        cy.get("[data-cy=\"form.builder.procedure.materials.title\"]").eq(2)
          .should("contain.text", "Free text material")
          .should("contain.text", "Qty: 5 pounds");
      });

      it("Verify 'New Equipment for procedure' is added to equipments", () => {
        cy.get("[data-cy=\"form.builder.procedure.equipment.title\"]").eq(0)
          .should("contain.text", "New Equipment for procedure");
      });
    });

    context("Create EB and release it", () => {
      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
      });

      context("Release the part", () => {
        it("Navigate to the part document", () => {
          cy.get("[data-cy=\"BuildsPresenter-link-form.builder.part\"]").then(($el) => {
            const link = $el.attr("href");
            cy.wrapWithWaitOnApiCalls([
              CyRoutes.DocPreview,
              CyRoutes.EmployeesGet,
              CyRoutes.GetRequiredApprovers], () =>
            {
              cy.visit(CONFIG.FE_URL + link);
            });
          });
          cy.wait(5000);
        });

        it("Approve and release the part", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });

      context("Approve and release the EB", () => {
        it("Navigate to the EB", () => {
          cy.get("[data-cy=\"BuildsPresenter-link-common.part.of\"]").then(($el) => {
            const link = $el.attr("href");
            cy.wrapWithWaitOnApiCalls([
              CyRoutes.GetRequiredApproversDocRev,
              CyRoutes.GetAvailableApprovers,
              CyRoutes.DocPreview], () =>
            {
              cy.visit(CONFIG.FE_URL + link);
            });
          });

          cy.get("[data-cy=\"BuildsPresenter-link-common.next.build\"]").then(($el) => {
            const link = $el.attr("href");
            cy.wrapWithWaitOnApiCalls([
              CyRoutes.GetRequiredApproversDocRev,
              CyRoutes.GetAvailableApprovers,
              CyRoutes.DocPreview], () =>
            {
              cy.visit(CONFIG.FE_URL + link);
            });
          });
        });

        it("Approve record button click", () => {
          cy.ebApprove();
        });
      });
    });
  });

  context("Copy to EB and verify materials and equipment tracking", () => {
    it("Click copy to EB", () => {
      cy.ebClickClone();
    });

    context("Add materials and equipments", () => {
      it("Remove 'Materials document'", () => {
        cy.xpath("//div[@data-cy=\"form.builder.procedure.materials.title\"]/../div[3]/button").eq(1).click();
      });

      it("Remove 'Free text material'", () => {
        cy.xpath("//div[@data-cy=\"form.builder.procedure.materials.title\"]/../div[3]/button").eq(2).click();
      });

      it("Remove 'Free text equipment'", () => {
        cy.xpath("//div[@data-cy=\"form.builder.procedure.equipment.title\"]/../div[3]/button").eq(2).click();
      });

      it("Remove 'Free text equipment'", () => {
        cy.xpath("//div[@data-cy=\"form.builder.procedure.equipment.title\"]/../div[3]/button").eq(2).click();
      });

      it("Remove 'Equipment document'", () => {
        cy.xpath("//div[@data-cy=\"form.builder.procedure.equipment.title\"]/../div[3]/button").eq(1).click();
      });

      it("Add approver to approvals", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
          cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
        });
      });
    });

    context("Verify change from previous build", () => {
      it("Click 'Show changes from previous build'", () => {
        cy.pmToggleChangesFromPrevBuild();
      });

      it("Verify 'Materials document' is removed from materials", () => {
        cy.get("[data-cy=\"form.builder.procedure.materials.title\"]").eq(2)
          .should("contain.text", "PRT-00005 - Part document | CSL-00001 | Qty: 2 gram");
      });

      it("Verify 'Free text material' is removed from materials", () => {
        cy.get("[data-cy=\"form.builder.procedure.materials.title\"]").eq(1)
          .should("contain.text", "Free text material | ? | Qty: 5 pounds");
      });

      it("Verify 'Equipment document' is removed from equipment", () => {
        cy.get("[data-cy=\"form.builder.procedure.equipment.title\"]").eq(1)
          .should("contain.text", "ET-00003 - Equipment document");
      });

      it("Verify 'Free text equipment' is removed from equipment", () => {
        cy.get("[data-cy=\"form.builder.procedure.equipment.title\"]").eq(2)
          .should("contain.text", "Free text equipment");
      });
    });

    context("Create EB", () => {
      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
      });

      context("Verify that EB cannot be released unless 1st revision of part is released", () => {
        it("Try approving the EB", () => {
          cy.get("[data-cy=\"fb-control-btn\"]").eq(1).click();
          cy.get("input[name=\"password\"]").type("Tester1!");
          cy.get("[data-cy=\"common.confirm\"]").click();
        });

        it("Check for a toast error", () => {
          cy.checkToastMessageContains({ message: NOT_RELEASED_TOAST_ERROR_MESSAGE });
        });
      });

      context("Release the part", () => {
        it("Navigate to the part document", () => {
          cy.get("[data-cy=\"BuildsPresenter-link-form.builder.part\"]").then(($el) => {
            const link = $el.attr("href");
            cy.wrapWithWaitOnApiCalls([
              CyRoutes.DocPreview,
              CyRoutes.EmployeesGet,
              CyRoutes.GetRequiredApprovers], () =>
            {
              cy.visit(CONFIG.FE_URL + link);
            });
          });
          cy.wait(5000);
        });

        it("Approve and release the part", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });

      context("Approve and release the EB", () => {
        it("Navigate to the EB", () => {
          cy.get("[data-cy=\"BuildsPresenter-link-common.part.of\"]").then(($el) => {
            const link = $el.attr("href");
            cy.wrapWithWaitOnApiCalls([
              CyRoutes.GetRequiredApproversDocRev,
              CyRoutes.GetAvailableApprovers,
              CyRoutes.DocPreview], () =>
            {
              cy.visit(CONFIG.FE_URL + link);
            });
          });

          cy.get("[data-cy=\"BuildsPresenter-link-common.next.build\"]").then(($el) => {
            const link = $el.attr("href");
            cy.wrapWithWaitOnApiCalls([
              CyRoutes.GetRequiredApproversDocRev,
              CyRoutes.GetAvailableApprovers,
              CyRoutes.DocPreview], () =>
            {
              cy.visit(CONFIG.FE_URL + link);
            });
          });
        });

        it("Approve record button click", () => {
          cy.ebApprove();
        });

        it("Check if Approved date exists", () => {
          cy.get("[id=\"Presenter-FBWorkspace\"]").contains(currentDate);
        });

        it("Check if the part is displayed in the document summary", () => {
          cy.ebCheckIfPartIsInSummary({ partName: "PRT-00006 - Part for EB document" });
        });
      });
    });
  });
});

export { };

