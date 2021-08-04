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

context("LHR flow", () => {
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
                schema: [],
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
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Subassembly");
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

        it("Add 'Material one' to step #1", () => {
          cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Material one", quntity: "3", unit: "Each" });
        });

        it("Add 'Equipment one' to step #1", () => {
          cy.mpiAddEquipmentToStep({ numbOfStep: 1, equipment: "Equipment one" });
        });
      });

      context("Add FB components", () => {
        SystemRequirement("REQ-3120");
        it("Add TextField", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Text field" });
          cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
          cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder" });
          cy.fbEnterNameValue({ name: "rows", value: "2" });
          cy.fbAddNewFieldButton();
          cy.get(`[name^="fb-textfield"`).parent().trigger("mouseover");
        });

        it("Add Checkbox group", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Checkbox group" });
          cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
          cy.fbGroupOptions("option1", "option2");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-checkbox-group" });
        });

        it("Add Autocomplete", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
          cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
          cy.fbEnterPlaceholder({ placeholder: "fb-autocomplete placeholder" });
          cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
          cy.fbAddNewFieldButton();
          cy.wait(2000);
          cy.contains("fb-autocomplete").trigger("mouseover");
        });

        it("Add Text Editor", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Text Editor" });
          cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
          cy.fbGroupOptions("SelectOne", "SelectTwo", "SelectThree");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-text-editor" } );
        });

        it("Add Date picker", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Date picker" });
          cy.fbEnterNameValue({ name: "label", value: "fb-datepicker" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-datepicker" } );
        });

        it("Add Hyperlink", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Hyperlink" });
          cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink" });
          cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-hyperlink" } );
        });

        it("Add Select Field", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Select" });
          cy.fbEnterNameValue({ name: "label", value: "fb-select-field" });
          cy.fbEnterPlaceholder({ placeholder: "fb-select-field placeholder" });
          cy.fbGroupOptions("option1", "option2");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-select-field" } );
        });

        it("Add Radio Button group", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Radio Button group" });
          cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
          cy.fbGroupOptions("option1", "option2");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-radiobutton-group" } );
        });

        it("Add Paragraph", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Paragraph" });
          cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]")
            .click({ force: true }).clear().type("fb-paragraph");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-paragraph" } );
        });

        it("Add File Upload", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "File Upload" });
          cy.fbEnterNameValue({ name: "label", value: "fb-fileupload" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-fileupload" } );
        });

        it("Add Blank Template Form", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Blank Template Form" });
          cy.fbEnterNameValue({ name: "label", value: "fb-blank-template" });
          cy.fbAddNewFieldButton();
          cy.elUploadAttachment({ fileName: "image.jpg", el: "fb-attachment-field-fb-blank-template-" });
          cy.fbMouseOverByLabel({ label: "fb-blank-template" } );
        });

        it("Add Quantity", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Quantity" });
          cy.fbEnterNameValue({ name: "label", value: "fb-quantity" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-quantity" } );
        });

        it("Add Instructions Media upload", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Instructions Media upload" });
          cy.fbEnterNameValue({ name: "label", value: "fb-instructions" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-instructions" } );
        });

        it("Add Evidence Media upload", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Evidence Media upload" });
          cy.fbEnterNameValue({ name: "label", value: "fb-evidence" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-evidence" } );
        });

        it("Add Procedure", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Procedure" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "Step #1" } );
        });

        it("Add Text field with range", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Text field with range" });
          cy.fbEnterNameValue({ name: "label", value: "fb-range" });
          cy.fbEnterNameValue({ name: "placeholder", value: "fb-range placeholder" });
          cy.fbSelectCheckboxName("editorConfig.rangeOption",
            "editorConfig.criticalToQuality", "editorConfig.inspection");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-range" } );
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

      context("Add FB components", () => {
        SystemRequirement("REQ-3160");
        it("Add TextField", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Text field" });
          cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
          cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder" });
          cy.fbEnterNameValue({ name: "rows", value: "2" });
          cy.fbAddNewFieldButton();
          cy.get(`[name^="fb-textfield"`).parent().trigger("mouseover");
        });

        it("Add Checkbox group", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Checkbox group" });
          cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
          cy.fbGroupOptions("option1", "option2");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-checkbox-group" });
        });

        it("Add Autocomplete", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
          cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
          cy.fbEnterPlaceholder({ placeholder: "fb-autocomplete placeholder" });
          cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
          cy.fbAddNewFieldButton();
          cy.wait(2000);
          cy.contains("fb-autocomplete").trigger("mouseover");
        });

        it("Add Text Editor", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Text Editor" });
          cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
          cy.fbGroupOptions("SelectOne", "SelectTwo", "SelectThree");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-text-editor" } );
        });

        it("Add Date picker", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Date picker" });
          cy.fbEnterNameValue({ name: "label", value: "fb-datepicker" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-datepicker" } );
        });

        it("Add Hyperlink", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Hyperlink" });
          cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink" });
          cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-hyperlink" } );
        });

        it("Add Select Field", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Select" });
          cy.fbEnterNameValue({ name: "label", value: "fb-select-field" });
          cy.fbEnterPlaceholder({ placeholder: "fb-select-field placeholder" });
          cy.fbGroupOptions("option1", "option2");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-select-field" } );
        });

        it("Add Radio Button group", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Radio Button group" });
          cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
          cy.fbGroupOptions("option1", "option2");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-radiobutton-group" } );
        });

        it("Add Paragraph", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Paragraph" });
          cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]")
            .click({ force: true }).clear().type("fb-paragraph");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-paragraph" } );
        });

        it("Add File Upload", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "File Upload" });
          cy.fbEnterNameValue({ name: "label", value: "fb-fileupload" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-fileupload" } );
        });

        it("Add Blank Template Form", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Blank Template Form" });
          cy.fbEnterNameValue({ name: "label", value: "fb-blank-template" });
          cy.fbAddNewFieldButton();
          cy.elUploadAttachment({ fileName: "image.jpg", el: "fb-attachment-field-fb-blank-template-" });
          cy.fbMouseOverByLabel({ label: "fb-blank-template" } );
        });

        it("Add Quantity", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Quantity" });
          cy.fbEnterNameValue({ name: "label", value: "fb-quantity" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-quantity" } );
        });

        it("Add Instructions Media upload", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Instructions Media upload" });
          cy.fbEnterNameValue({ name: "label", value: "fb-instructions" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-instructions" } );
        });

        it("Add Evidence Media upload", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Evidence Media upload" });
          cy.fbEnterNameValue({ name: "label", value: "fb-evidence" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-evidence" } );
        });

        it("Add Procedure", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Procedure" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "Step #1" } );
        });

        it("Add Text field with range", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Text field with range" });
          cy.fbEnterNameValue({ name: "label", value: "fb-range" });
          cy.fbEnterNameValue({ name: "placeholder", value: "fb-range placeholder" });
          cy.fbSelectCheckboxName("editorConfig.rangeOption",
            "editorConfig.criticalToQuality", "editorConfig.inspection");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "fb-range" } );
        });
      });

      context("Release LHRt document", () => {
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
});

export { };
