
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { Material } from "../../utils/constants/documentTypes/material";
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
let materialsDocumentType;
let partDocumentType;
let equipmentDocument;
let materialsDocument;
let formDocumentType;
let CSLDocumentType;
let createdLotsFormDocument;
let createdPartDocument;
let createdEquipmentFormDocument;

const NOT_RELEASED_TOAST_ERROR_MESSAGE = "Last docRev for Part linked to EB after copying is not in RELEASED status.";
const lotDateSuffix = moment().tz("America/Los_Angeles").format("YYMMDD");
const PART_DOCUMENT_TYPE_NAME = "Part";
const EquipmentFormTitle = "Equipment form";

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
            importerEmail: IMPORTER_USER.email,
            numOfRevStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              Part,
              Material,
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
          CSLDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specification Lot");
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
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
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            });
          });
        });
      });
    });

    it("[API]Create Equipment form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Equipment Form document</p>",
          document: {
            docId: "FM-00009",
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
          name: EquipmentFormTitle,
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: equipmentDocumentType[0].id,
            }],
            schema: [],
          },

        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdEquipmentFormDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdEquipmentFormDocument.id,
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
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
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
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
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
                label: "Initial Quantity",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [],
                validationAttribute: "Initial Quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "lot_usable_quantity",
                type: "quantity",
                index: 1,
                label: "Usable Quantity",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [],
                validationAttribute: "Usable Quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "lot_expiry_date",
                type: "datepicker",
                index: 2,
                label: "Expiration Date",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationAttribute: "Expiration Date",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "lot_part",
                type: "autocomplete",
                index: 3,
                label: "Part Selection",
                tabId: "details",
                optionId: "21",
                placeholder: "Select the appropriate part for this lot",
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "100-inspection-override",
                type: "checkboxgroup",
                index: 4,
                label: "100% Inspection Override",
                tabId: "details",
                options: [
                  {
                    text: "100% Inspection Override",
                    value: "100% Inspection Override",
                  },
                ],
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                editorProperties: [],
                validationAttribute: "100% Inspection Override",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                label: "form.builder.approvals",
                type: "approvals",
                tabId: "details",
                deleteDisabled: true,
                name: "fb-approvals-ksherq6d",
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

  context("Login second user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create lot document", () => {
    it("Navigate to Lots", () => {
      cy.navigToLots();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click on Create new", () => {
      cy.poClickCreatePO();
    });

    it("Select 'Component Specification Lot' from the dropdown", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").arrowClick();
      cy.get("div[id^=react-select]").contains("Component Specification Lot").arrowClick();
      cy.progressBarShouldAppear();
    });

    it("Add lot title", () => {
      cy.drEnterDocumentTitle({ name: "Component specification lot document" });
    });

    it("Save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Enter quantity received", () => {
      cy.get("[name=\"lot_quantity\"]").arrowType("12");
    });

    it("Enter Usable Quantity", () => {
      cy.get("[name=\"lot_usable_quantity\"]").arrowType("12");
    });

    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select 'Part document' for Part lot", () => {
      cy.get("[data-cy=\"lot_part\"]").autocompleteSelect("Part document");
      cy.wait(1000);
    });

    it("Add 'Part document' in reference", () => {
      cy.drSelectReferences("Part document");
      cy.wait(1000);
    });

    it("Check 100% override", () => {
      cy.get("[value=\"100% Inspection Override\"]").check();
      cy.wait(1000);
    });

    it("Add 'Expiry Date'", () => {
      cy.poAddDateRequired();
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
      cy.unClick();
    });

    it("Save document", () => {
      cy.wait(10000);
      // 10 sec. wait is required here, without this add material step fails
      cy.drClickSaveWithoutApiCall();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
      cy.wait(1000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Navigate to details tab", () => {
      cy.wait(1000);
      cy.drSelectDetailsTab();
    });

    it("Approve record", () => {
      cy.ebApproveWithoutApi();
    });

    it("Verify status is 'Released'", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });
  });

  context("Create equipment document", () => {
    context("Fill document attributes", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it(`Select document named '${EquipmentFormTitle}'`, () => {
        cy.drClickOnSpecificDocFromList({ item: EquipmentFormTitle });
      });

      it("Create new Supplier document from Form", () => {
        cy.drCreateNewDocumentFromFormRecord();
      });

      it("Enters title 'New Equipment for procedure'", () => {
        cy.drEnterDocumentTitle({ name: "New Equipment for procedure" });
      });

      it("Enters description 'Equipment description'", () => {
        cy.drEnterDocumentDescription({ description: "Equipment description" });
      });
    });

    context("Create document and release it", () => {
      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      context("Approve equipment", () => {
        it("Approve and release equipment", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
        });

        it("Check equipment status is 'Released'", () => {
          cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        });
      });
    });
  });

  context("Create materials document", () => {
    context("Fill document attributes", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
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
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
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

      it("Enters description 'EB form description'", () => {
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
    });

    context("Create document and release it", () => {
      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Add procedure field", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "EB Procedure" });
        cy.get("[value=\"copyableValue\"]").check();
        cy.fbAddField();
      });

      it("Save document", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });
  });


  context("Create EB from created FORM document", () => {
    it("Reload Page", () => {
      cy.reload();
      cy.progressBarShouldAppear();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click create new document from FORM", () => {
      cy.drCreateNewDocumentFromFormRecord();
    });
  });

  context("Fill EB document attributes", () => {
    it("Enters title 'EB document'", () => {
      cy.drEnterDocumentTitleWithWait({ name: "EB document" });
    });

    it("Enters description 'EB description'", () => {
      cy.drEnterDocumentDescription({ description: "EB description" });
      cy.wait(1000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add approver to approvals", () => {
      cy.pmAddApproverOnApproverListNw({ approver: USERS[1].email });
    });

    it("Verify step can be added", () => {
      SystemRequirement("REQ-2970");
      cy.get("[data-cy=\"form.builder.add.step\"]").arrowClick();
      cy.wait(1000);
      cy.progressBarShouldNotExist();
      cy.get("[data-cy=\"form.builder.step.number\"]").eq(1).should("have.text", "Step #2");
      cy.listLoadingElementShouldNotExist();
    });

    it("Remove step", () => {
      cy.fbRemoveLastAddedItem();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save document", () => {
      cy.drClickSaveWithoutApiCall();
      cy.get("[data-cy='form.builder.step.number']").eq(1).should("not.exist");
    });

    it("Add textfield to eb", () => {
      SystemRequirement("REQ-2980");
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbAddLabelName({ name: "Textfield for eb test" });
      cy.fbAddField();
      cy.wait(1000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"Textfield for eb test\"]").should("have.text", "Textfield for eb test");
    });

    it("Remove textfield", () => {
      cy.get("[data-cy=\"remove-schema-item\"]").last().arrowClick({ force: true });
      cy.wait(1000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"Textfield for eb test\"]").should("not.exist");
    });

    it("Add material document", () => {
      cy.pmAddMaterialDocumentToProcedure({
        materialDoc: "Part document",
        partLotDoc: "Component specification lot document",
        numberOfMaterial: 2,
        typeOfMaterial: "Each",
      });
      cy.wait(2000);
    });

    it("Add free material text", () => {
      cy.pmAddFreeTextMaterial({
        material: "Free text material",
        partLot: "Test",
        numberOfMaterial: 3,
        typeOfMaterial: "Set(s)",
      });
      cy.wait(2000);
    });

    it("Enter description to step #1", () => {
      cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Step #1 description" });
    });

    it("Add equipment document", () => {
      cy.pmAddEquipmentDocument({ equipmentDoc: "Equipment document" });
    });

    it("Add free equipment text", () => {
      cy.pmAddFreeTextEquipment({ equipment: "Free text equipment" });
    });

    it("Upload attachment 'video.mp4'", () => {
      SystemRequirement("REQ-2990");
      cy.get("[data-cy=\"albumMediaButton\"]").arrowClick();
      cy.pmUploadAttachment({ fileName: "video.mp4" });
      cy.wait(1000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Upload attachment 'image.jpg'", () => {
      cy.pmUploadAttachment({ fileName: "image.jpg" });
      cy.wait(1000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Upload attachment 'test.docx'", () => {
      cy.pmUploadAttachment({ fileName: "test.docx" });
      cy.wait(1000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save document", () => {
      cy.drClickSaveWithoutApiCall();
    });
  });

  context("Verify 'Clone Step' feature", () => {
    it("Click 'Clone Step'", () => {
      SystemRequirement("REQ-3010");
      cy.get("[data-cy=\"form.builder.clone.step\"]").arrowClick();
      cy.wait(2000);
      cy.progressBarShouldNotExist();
    });

    it("Save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Verify description is copied", () => {
      SystemRequirement("REQ-3020");
      cy.get("div[id^=\"fb-mpiprocedure\"] p")
        .eq(1)
        .should("have.text", "Step #1 description");
      cy.wait(2000);
    });

    it("Verify materials are copied", () => {
      SystemRequirement("REQ-3020");
      cy.get("[data-cy='form.builder.procedure.materials.title']")
        .eq(2).should("have.text", "PRT-00005 - Part document | LOT #" + lotDateSuffix + "01 | Qty: 2 each");
      cy.get("[data-cy='form.builder.procedure.materials.title']")
        .eq(3).should("have.text", "Free text material | Test | Qty: 3 sets");

    });

    it("Verify equipments are copied", () => {
      SystemRequirement("REQ-3020");
      cy.get("[data-cy='form.builder.procedure.equipment.title']")
        .eq(2).should("have.text", "ET-00003 - Equipment document ");
      cy.get("[data-cy='form.builder.procedure.equipment.title']")
        .eq(3).should("have.text", "Free text equipment ");
    });

    it("Verify attachments are copied", () => {
      SystemRequirement("REQ-3020");
      cy.get("[data-cy=\"mediaUploadField\"]>div>div>div>div>div").eq(5).arrowClick();
      cy.get("[data-cy=\"mediaUploadField\"] ul>li div[title]").each(($el) => {
        const attachName = $el.text();
        expect(attachName).to.be.oneOf(["image", "test", "video"]);
      });
    });

    it("Remove step", () => {
      cy.get("[data-cy='remove-schema-item']").last().arrowClick({ force: true });
      cy.wait(1000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy='form.builder.step.number']").eq(2).should("not.exist");
    });
  });

  context("Choose a part and approve EB", () => {
    it("Choose an existing part from the list of available parts", () => {
      SystemRequirement("REQ-3830");
      cy.get("[data-cy=\"childrenParts\"]").autocompleteSelect("Part for EB document");
      cy.wait(1000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Submit for Approval", () => {
      cy.drApproveAndReleaseDialog();
      cy.wait(1000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check if the part is displayed in the document summary", () => {
      cy.ebCheckIfPartIsInSummary({ partName: "Part for EB document" });
    });

    it("Approve record button click", () => {
      cy.wait(2000);
      cy.ebApproveWithoutApi();
    });
  });

  context("Clone EB and verify materials and equipment tracking", () => {
    it("Click Clone EB", () => {
      cy.ebClickCloneWithoutApi();
    });

    it("Save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    context("Verify 'Clone EB' feature copied EB", () => {
      it("Verify title is copied", () => {
        SystemRequirement("REQ-3020");
        cy.get("[data-cy=\"field-name\"]")
          .should("have.text", "EB document");
      });

      it("Verify description is copied", () => {
        SystemRequirement("REQ-3020");
        cy.get("[data-cy=\"description\"] div[data-editor]")
          .should("have.text", "EB description");
      });

      it("Verify part revision", () => {
        SystemRequirement("REQ-3020");
        cy.get("input[value=documentRevision]").should("have.attr", "checked");
      });

      it("Verify part document is same", () => {
        SystemRequirement("REQ-3020");
        cy.get("[data-cy=childForRevise]")
          .should("have.attr", "value", "PRT-00006 - Part for EB document");
      });

      it("Verify step description is copied", () => {
        SystemRequirement("REQ-3020");
        cy.get("div[id^='fb-mpiprocedure'] p").eq(0)
          .should("have.text", "Step #1 description");
      });

      it("Verify materials are copied", () => {
        SystemRequirement("REQ-3020");

        cy.get("[data-cy=\"form.builder.procedure.materials.title\"]")
          .eq(0).should("contain.text", "PRT-00005 - Part document | LOT #" + lotDateSuffix + "01 | Qty: 2 each");
        cy.get("[data-cy=\"form.builder.procedure.materials.title\"]")
          .eq(1).should("have.text", "Free text material | Test | Qty: 3 sets");
      });

      it("Verify equipments are copied", () => {
        SystemRequirement("REQ-3020");
        cy.get("[data-cy=\"form.builder.procedure.equipment.title\"]")
          .eq(0).should("have.text", "ET-00003 - Equipment document ");
        cy.get("[data-cy=\"form.builder.procedure.equipment.title\"]")
          .eq(1).should("have.text", "Free text equipment ");
      });

      it("Verify attachments are copied", () => {
        SystemRequirement("REQ-3020");
        cy.get("[data-cy=\"mediaUploadField\"]>div>div>div>div>div").eq(1).arrowClick();
        cy.get("[data-cy=\"mediaUploadField\"] ul>li div[title]").each(($el) => {
          const attachName = $el.text();
          expect(attachName).to.be.oneOf(["image", "test", "video"]);
        });
      });
    });

    context("Add materials and equipments", () => {
      it("Add material document", () => {
        cy.pmAddMaterialDocumentToProcedure({
          materialDoc: "New Material for procedure",
          numberOfMaterial: 3,
          typeOfMaterial: "Each",
        });
      });

      it("Add free material text", () => {
        cy.pmAddFreeTextMaterial({
          material: "Free text material",
          numberOfMaterial: 2,
          typeOfMaterial: "Set(s)",
        });
      });

      it("Add equipment document", () => {
        cy.pmAddEquipmentDocument({ equipmentDoc: "New Equipment for procedure" });
      });

      it("Add free equipment text", () => {
        cy.pmAddFreeTextEquipment({ equipment: "Free text equipment" });
      });

      it("Add approver to approvals", () => {
        cy.pmAddApproverOnApproverListNw({ approver: USERS[1].email });
      });
    });

    context("Verify change from previous build", () => {
      it("navigate to Materials & Equipments", () => {
        cy.get(`[data-cy="tabId.materialsandequipment"]`).arrowClick();
      });

      it("Click 'Show changes from previous build'", () => {
        SystemRequirement("REQ-3030");
        cy.pmToggleChangesFromPrevBuild();
      });

      it("Verify 'New Material for procedure' is added to materials", () => {
        cy.get("[data-cy='form.builder.materials']").eq(0).arrowClick();
        cy.wait(1000);
        SystemRequirement("REQ-3030");
        cy.get("#sm-tabpanel-2")
          .contains("MT-00002 - New Material for procedure | each :3").should("exist");
      });

      it("Verify 'Free text material' has increased number of materials to '5'", () => {
        cy.get("#sm-tabpanel-2")
          .contains("Free text material | sets :5").should("exist");
      });

      it("Verify 'New Equipment for procedure' is added to equipments", () => {
        cy.get("[data-cy='form.builder.equipment']").eq(0).arrowClick();
        cy.wait(1000);
        cy.get("#sm-tabpanel-2")
          .contains("New Equipment for procedure").should("exist");
      });

      it("navigate to Overview", () => {
        cy.drSelectOverviewTab();
      });
    });

    context("Create EB and release it", () => {
      it("Submit for approval", () => {
        cy.pmSubmitForApprovalWithoutAPI();
        cy.wait(1000);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      context("Release the part", () => {
        it("Navigate to the part document", () => {
          cy.get("[data-cy=\"BuildsPresenter-link-form.builder.part\"]").then(($el) => {
            const link = $el.attr("href");
            cy.wrapWithWaitOnApiCalls([], () =>
            {
              cy.visit(CONFIG.FE_URL + link);
            });
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });
        });

        it("Approve and release the part", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
        });
      });

      context("Approve and release the EB", () => {
        it("Navigate to the EB", () => {
          cy.get("[data-cy=\"BuildsPresenter-link-common.part.of\"]").then(($el) => {
            const link = $el.attr("href");
            cy.visit(CONFIG.FE_URL + link);
            cy.wait(3000);
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });

          cy.get("[data-cy=\"BuildsPresenter-link-common.next.build\"]").then(($el) => {
            const link = $el.attr("href");
            cy.visit(CONFIG.FE_URL + link);
            cy.wait(3000);
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });
        });

        it("Approve record button click", () => {
          cy.ebApproveWithoutApi();
        });
      });
    });
  });

  context("Copy to EB and verify materials and equipment tracking", () => {
    it("Click copy to EB", () => {
      cy.ebClickCloneWithoutApi();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    context("Add materials and equipments", () => {
      it("Remove 'Materials document'", () => {
        cy.xpath("//div[@data-cy=\"form.builder.procedure.materials.title\"]/../div[3]/button").eq(1).arrowClick();
      });

      it("Remove 'Free text material'", () => {
        cy.xpath("//div[@data-cy=\"form.builder.procedure.materials.title\"]/../div[3]/button").eq(2).arrowClick();
      });

      it("Remove 'Free text equipment'", () => {
        cy.xpath("//div[@data-cy=\"form.builder.procedure.equipment.title\"]/../div[3]/button").eq(2).arrowClick();
      });

      it("Remove 'Free text equipment'", () => {
        cy.xpath("//div[@data-cy=\"form.builder.procedure.equipment.title\"]/../div[3]/button").eq(2).arrowClick();
      });

      it("Remove 'Equipment document'", () => {
        cy.xpath("//div[@data-cy=\"form.builder.procedure.equipment.title\"]/../div[3]/button").eq(1).arrowClick();
      });

      it("Add approver to approvals", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
      });

      it("Save EB", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Verify change from previous build", () => {
      it("navigate to Materials & Equipments", () => {
        cy.get(`[data-cy="tabId.materialsandequipment"]`).arrowClick();
      });

      it("Click 'Show changes from previous build'", () => {
        cy.pmToggleChangesFromPrevBuild();
      });

      it("Verify 'Materials document' is removed from materials", () => {
        cy.get("[data-cy='form.builder.materials']").eq(0).arrowClick();
        cy.wait(1000);
        cy.get("#sm-tabpanel-2")
          .contains("PRT-00005 - Part document | each :2").should("exist");
      });

      it("Verify 'Free text material' is removed from materials", () => {
        cy.get("#sm-tabpanel-2")
          .contains("Free text material | sets :3").should("exist");
      });

      it("Verify 'Equipment document' is removed from equipment", () => {
        cy.get("[data-cy='form.builder.equipment']").eq(0).arrowClick();
        cy.wait(1000);
        cy.get("#sm-tabpanel-2")
          .contains("ET-00003 - Equipment document").should("exist");
      });

      it("Verify 'Free text equipment' is removed from equipment", () => {
        cy.get("#sm-tabpanel-2")
          .contains("Free text equipment").should("exist");
      });

      it("navigate to Overview", () => {
        cy.drSelectOverviewTab();
      });
    });

    context("Create EB", () => {
      it("Submit for approval", () => {
        cy.pmSubmitForApprovalWithoutAPI();
        cy.wait(1000);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      context("Verify that EB cannot be released unless 1st revision of part is released", () => {
        it("Try approving the EB", () => {
          cy.ebApproveWithoutApi();
          cy.wait(1000);
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Check for a toast error", () => {
          cy.checkToastMessageContains({ message: NOT_RELEASED_TOAST_ERROR_MESSAGE });
        });
      });

      context("Release the part", () => {
        it("Navigate to the part document", () => {
          cy.get("[data-cy=\"BuildsPresenter-link-form.builder.part\"]").then(($el) => {
            const link = $el.attr("href");
            cy.wrapWithWaitOnApiCalls([], () =>
            {
              cy.visit(CONFIG.FE_URL + link);
            });
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });
        });

        it("Approve and release the part", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
        });
      });

      context("Approve and release the EB", () => {
        it("Navigate to the EB", () => {
          cy.get("[data-cy=\"BuildsPresenter-link-common.part.of\"]").then(($el) => {
            const link = $el.attr("href");

            cy.visit(CONFIG.FE_URL + link);
            cy.wait(3000);
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });

          cy.get("[data-cy=\"BuildsPresenter-link-common.next.build\"]").then(($el) => {
            const link = $el.attr("href");
            cy.visit(CONFIG.FE_URL + link);
            cy.wait(3000);
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });
        });

        it("Approve record button click", () => {
          cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick();
          cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
          cy.unClick();
          cy.get("[data-cy=\"common.confirm\"]").arrowClick();
        });

        it("Check if Approved date exists", () => {
          const currentDate = moment().tz("America/Los_Angeles").format("MMMM D, YYYY hh:mm A");
          cy.get("[data-cy=\"approved-Giovanni Reynolds\"]").contains(currentDate).should("exist");
        });

        it("Check if the part is displayed in the document summary", () => {
          cy.ebCheckIfPartIsInSummary({ partName: "PRT-00006 - Part for EB document" });
        });
      });
    });
  });
});

