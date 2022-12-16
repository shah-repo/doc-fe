// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { LHRTTest } from "../../utils/constants/documentTypes/lhrt";
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

      context("Add FB components", () => {
        it("Add TextField", () => {
          cy.fbAddNewFieldWhenHidden2ndLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
          cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
          cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder" });
          cy.fbEnterNameValue({ name: "rows", value: 2 });
          cy.fbAddNewFieldButton();
          cy.get(`[name^="fb-textfield"`).parent().trigger("mouseover");
        });

        it("Add Checkbox group", () => {
          cy.fbAddNewFieldWhenHidden2ndLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
          cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
          cy.fbGroupOptions("option1", "option2");
          cy.fbAddNewFieldButton();
        });

        it("Add Autocomplete", () => {
          cy.fbAddNewFieldWhenHidden2ndLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
          cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
          cy.fbEnterPlaceholder({ placeholder: "fb-autocomplete placeholder" });
          cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
          cy.fbAddNewFieldButton();
        });

        it("Add Text Editor", () => {
          cy.fbAddNewFieldWhenHidden2ndLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text Editor" });
          cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
          cy.fbGroupOptions("SelectOne", "SelectTwo", "SelectThree");
          cy.fbAddNewFieldButton();
        });

        it("Add Date picker", () => {
          cy.fbAddNewFieldWhenHidden2ndLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Date picker" });
          cy.fbEnterNameValue({ name: "label", value: "fb-datepicker" });
          cy.fbAddNewFieldButton();
        });

        it("Add Hyperlink", () => {
          cy.fbAddNewFieldWhenHidden2ndLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Hyperlink" });
          cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink" });
          cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
          cy.fbAddNewFieldButton();
        });

        it("Add Select Field", () => {
          cy.fbAddNewFieldWhenHidden2ndLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
          cy.fbEnterNameValue({ name: "label", value: "fb-select-field" });
          cy.fbEnterPlaceholder({ placeholder: "fb-select-field placeholder" });
          cy.fbGroupOptions("option1", "option2");
          cy.fbAddNewFieldButton();
        });

        it("Add Radio Button group", () => {
          cy.fbAddNewFieldWhenHidden2ndLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
          cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
          cy.fbGroupOptions("option1", "option2");
          cy.fbAddNewFieldButton();
        });

        it("Add Paragraph", () => {
          cy.fbAddNewFieldWhenHidden2ndLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Paragraph" });
          cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]")
            .click({ force: true }).clear().arrowType("fb-paragraph");
          cy.fbAddNewFieldButton();
        });

        it("Add File Upload", () => {
          cy.fbAddNewFieldWhenHidden2ndLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
          cy.fbEnterNameValue({ name: "label", value: "fb-fileupload" });
          cy.fbAddNewFieldButton();
        });

        it("Add Blank Template Form", () => {
          cy.fbAddNewFieldWhenHidden2ndLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Blank Template Form" });
          cy.fbEnterNameValue({ name: "label", value: "fb-blank-template" });
          cy.fbAddNewFieldButton();
          cy.elUploadAttachment({ fileName: "image.jpg", el: "fb-attachment-field-fb-blank-template-" });
        });

        it("Add Quantity", () => {
          cy.fbAddNewFieldWhenHidden2ndLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Quantity" });
          cy.fbEnterNameValue({ name: "label", value: "fb-quantity" });
          cy.fbAddNewFieldButton();
        });

        it("Add Instructions Media upload", () => {
          cy.fbAddNewFieldWhenHidden2ndLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Instructions Media upload" });
          cy.fbEnterNameValue({ name: "label", value: "fb-instructions" });
          cy.fbAddNewFieldButton();
        });

        it("Add Evidence Media upload", () => {
          cy.fbAddNewFieldWhenHidden2ndLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Evidence Media upload" });
          cy.fbEnterNameValue({ name: "label", value: "fb-evidence" });
          cy.fbAddNewFieldButton();
        });

        it("Add Procedure", () => {
          cy.fbAddNewFieldWhenHidden2ndLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "PI Procedure" });
          cy.fbAddNewFieldButton();
        });

        it("Add Text field with range", () => {
          SystemRequirement("REQ-3120");
          cy.fbAddNewFieldWhenHidden2ndLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field with range" });
          cy.fbEnterNameValue({ name: "label", value: "fb-range" });
          cy.fbEnterNameValue({ name: "placeholder", value: "fb-range placeholder" });
          cy.fbSelectCheckboxName("editorConfig.rangeOption",
            "editorConfig.criticalToQuality", "editorConfig.inspection");
          cy.fbAddNewFieldButton();
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
          cy.get("div[class^=\"MuiExpansionPanelSummary\"]").eq(0).arrowClick({ force: true });
          cy.get("input[data-cy^=\"lhrstep-built-in\"]").autocompleteSelect("MPI document", { force: true });
        });
      });

      context("Add FB components", () => {
        it("Add TextField", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
          cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
          cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder" });
          cy.fbEnterNameValue({ name: "rows", value: 2 });
          cy.fbAddNewFieldButton();
        });

        it("Add Checkbox group", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
          cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
          cy.fbGroupOptions("option1", "option2");
          cy.fbAddNewFieldButton();
        });

        it("Add Autocomplete", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
          cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
          cy.fbEnterPlaceholder({ placeholder: "fb-autocomplete placeholder" });
          cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
          cy.fbAddNewFieldButton();
        });

        it("Add Text Editor", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text Editor" });
          cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
          cy.fbGroupOptions("SelectOne", "SelectTwo", "SelectThree");
          cy.fbAddNewFieldButton();
        });

        it("Add Date picker", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Date picker" });
          cy.fbEnterNameValue({ name: "label", value: "fb-datepicker" });
          cy.fbAddNewFieldButton();
        });

        it("Add Hyperlink", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Hyperlink" });
          cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink" });
          cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
          cy.fbAddNewFieldButton();
        });

        it("Add Select Field", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
          cy.fbEnterNameValue({ name: "label", value: "fb-select-field" });
          cy.fbEnterPlaceholder({ placeholder: "fb-select-field placeholder" });
          cy.fbGroupOptions("option1", "option2");
          cy.fbAddNewFieldButton();
        });

        it("Add Radio Button group", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
          cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
          cy.fbGroupOptions("option1", "option2");
          cy.fbAddNewFieldButton();
        });

        it("Add Paragraph", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Paragraph" });
          cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]")
            .click({ force: true }).clear().arrowType("fb-paragraph");
          cy.fbAddNewFieldButton();
        });

        it("Add File Upload", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
          cy.fbEnterNameValue({ name: "label", value: "fb-fileupload" });
          cy.fbAddNewFieldButton();
        });

        it("Add Blank Template Form", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Blank Template Form" });
          cy.fbEnterNameValue({ name: "label", value: "fb-blank-template" });
          cy.fbAddNewFieldButton();
          cy.elUploadAttachment({ fileName: "image.jpg", el: "fb-attachment-field-fb-blank-template-" });
        });

        it("Add Quantity", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Quantity" });
          cy.fbEnterNameValue({ name: "label", value: "fb-quantity" });
          cy.fbAddNewFieldButton();
        });

        it("Add Instructions Media upload", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Instructions Media upload" });
          cy.fbEnterNameValue({ name: "label", value: "fb-instructions" });
          cy.fbAddNewFieldButton();
        });

        it("Add Evidence Media upload", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Evidence Media upload" });
          cy.fbEnterNameValue({ name: "label", value: "fb-evidence" });
          cy.fbAddNewFieldButton();
        });

        it("Add Procedure", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "EB Procedure" });
          cy.fbAddNewFieldButton();
        });

        it("Add Text field with range", () => {
          SystemRequirement("REQ-3160");
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field with range" });
          cy.fbEnterNameValue({ name: "label", value: "fb-range" });
          cy.fbEnterNameValue({ name: "placeholder", value: "fb-range placeholder" });
          cy.fbSelectCheckboxName("editorConfig.rangeOption",
            "editorConfig.criticalToQuality", "editorConfig.inspection");
          cy.fbAddNewFieldButton();
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

