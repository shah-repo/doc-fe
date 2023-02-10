/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import "moment-timezone";
import moment from "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { verifyHistoryContent } from "../../utils/context/historyContent";
import { STATUS_TYPES_LABEL } from "./../../../src/state/ducks/dashboard.new/my.feeds/types";

let createdCompany;
let loginResponse;
let adminEmployee;

let approvalRequestDocumentType;
let formDocumentType;
let initialArDocument;
let group;
let maintenanceRecordDocumentType;
let createdPMForm;
let createdCalibrationForm;
let equipmentURL;
let calDocId;
let calId;

const fbclickOnAddCalPM = () => {
  cy.get("button[data-cy='form.builder.add.field']").eq(-1).arrowClick({ force: true });
};

context("Layout Verification of EQ", () => {
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
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          maintenanceRecordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Maintenance Record");
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

    it("[API]Create PM form", (done: any) => {
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
              description: "<p>PM form</p>",
              document: {
                docId: "FM-00004",
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
              name: "Preventative Maintenance form",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: maintenanceRecordDocumentType[0].id,
                }],
                schema: [
                  {
                    name: "fb-maintenance-details-section",
                    type: "section",
                    index: 0,
                    label: "Maintenance Details",
                    tabId: "details",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    deleteInFormDisabled: true,
                  },
                  {
                    name: "equipment_id",
                    type: "autocomplete",
                    index: 1,
                    label: "Equipment",
                    tabId: "details",
                    rules: "required",
                    optionId: "20",
                    placeholder: "[Select revision here]",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    deleteInFormDisabled: true,
                  },
                  {
                    name: "equipment_maintainer",
                    type: "autocomplete",
                    index: 2,
                    label: "Maintainer",
                    tabId: "details",
                    rules: "required",
                    optionId: "13",
                    placeholder: "[Select name here]",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    deleteInFormDisabled: true,
                  },
                  {
                    name: "fb-equipment_due_date",
                    type: "datepicker",
                    index: 3,
                    label: "Completion Date",
                    tabId: "details",
                    rules: "required",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    deleteInFormDisabled: true,
                  },
                  {
                    name: "fb-requipment-maintenance-section",
                    type: "textfield",
                    index: 4,
                    label: "Equipment Maintenance Section",
                    tabId: "details",
                    rules: "required",
                    hidden: true,
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    deleteInFormDisabled: true,
                  },
                  {
                    label: "form.builder.approvals",
                    tabId: "overview",
                    type: "approvals",
                    deleteDisabled: true,
                    name: "fb-approvals-kybkhbpt",
                    uniqueSchemaItem: true,
                    index: 5,
                  },
                ],
              },
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdPMForm = response;
            cy.drAPIApproveAndRelease({
              documentId: createdPMForm.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
        });
      });
    });

    it("[API]Create Calibration form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Calibration form</p>",
          document: {
            docId: "FM-00005",
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
          name: "Calibration form",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: maintenanceRecordDocumentType[0].id,
            }],
            schema: [
              {
                name: "fb-maintenance-details-section",
                type: "section",
                index: 0,
                label: "Maintenance Details",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "equipment_id",
                type: "autocomplete",
                index: 1,
                label: "Equipment",
                tabId: "details",
                rules: "required",
                optionId: "20",
                placeholder: "[Select revision here]",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                name: "equipment_maintainer",
                type: "autocomplete",
                index: 2,
                label: "Maintainer",
                tabId: "details",
                rules: "required",
                optionId: "13",
                placeholder: "[Select name here]",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                name: "fb-equipment_due_date",
                type: "datepicker",
                index: 3,
                label: "Completion Date",
                tabId: "details",
                rules: "required",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                name: "fb-requipment-maintenance-section",
                type: "textfield",
                index: 4,
                label: "Equipment Maintenance Section",
                tabId: "details",
                rules: "required",
                hidden: true,
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                label: "form.builder.approvals",
                type: "approvals",
                tabId: "overview",
                deleteDisabled: true,
                name: "fb-approvals-kybkhbpt",
                uniqueSchemaItem: true,
                index: 5,
              },
            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdCalibrationForm = response;
        cy.drAPIApproveAndRelease({
          documentId: createdCalibrationForm.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
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

  // create migration form
  context("Create EQ document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.unClick();
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });
  });

  context("Fill EQ document attributes", () => {
    it("Verify predefiend fields title description doc id revision output type", () => {
      cy.verifyPredefiendFields();
    });

    it("Enter document title 'EQ document'", () => {
      cy.drEnterDocumentTitle({ name: "Migartion EQ" });
    });

    it("Fill MR document description", () => {
      cy.drEnterDocumentDescription({ description: "EQ  description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Equipment' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Equipment" });
    });

    it("Click on 'Create Document'", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });
  });

  context("Add FB Fields", () => {
    it("Add autocomplete of “Approvers” and set validation", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "Autocomplete-Approvers" });
      cy.get("[data-cy='optionId']").autocompleteSelect("Approvers");
      cy.fbOpenValidation();
      cy.fbFieldRequired();
      cy.fbAddField();
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
      cy.listLoadingElementShouldNotExist();
    });

    it("Navigate to Specification tab", () => {
      cy.drSelectSpecificationTab();
    });

    it("Add textfield", () => {
      fbclickOnAddCalPM();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "Eq Textfield" });
      cy.fbAddNewFieldButton();
    });

    it("Select references", () => {
      cy.get(`[data-cy="referenceTo"]`).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.get(`[data-cy="referenceTo"]`).arrowType("FM-00004")
        .wait(2000).type(`{downarrow}{enter}`);

      cy.get(`[data-cy="referenceTo"]`).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.get(`[data-cy="referenceTo"]`).arrowType("FM-00005")
        .wait(2000).type(`{downarrow}{enter}`);
      cy.unClick();
    });

    it("Add Checkbox group", () => {
      fbclickOnAddCalPM();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
      cy.fbGroupOptions("1", "2", "3");
      cy.fbOpenValidation();
      cy.fbFieldRequired();
      cy.fbAddNewFieldButton();
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Approve and released", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });
  // end of migration form

  // Script start
  context("Create EQ document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.unClick();
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });
  });

  context("Fill EQ document attributes", () => {
    it("Verify predefiend fields title description doc id revision output type", () => {
      cy.verifyPredefiendFields();
    });

    it("Enter document title 'EQ document'", () => {
      cy.drEnterDocumentTitle({ name: "EQ Title" });
    });

    it("Fill MR document description", () => {
      cy.drEnterDocumentDescription({ description: "EQ  description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Equipment' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Equipment" });
    });

    it("Click on 'create document'", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });
  });

  context("Verify Layout of document and Tabs", () => {
    it("Verify The top left of the page displays: Icon and type, ID, Rev stage, status (Draft)", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.DRAFT,
        title: "Document List",
        docId: "FM-00003",
        revision: "Rev 1",
      });
    });

    it("Verify that it contains Overview, Specification", () => {
      cy.verifyTabs("overview", "specification");
    });

    it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      cy.verifyFixedTab();
    });

    it("Verify Form opens to the Overview tab by default", () => {
      cy.isTabActive({ name: "overview", index: 0 });
    });

    it("Verify EQ status", () => {
      cy.get("[data-cy='EQ Status']").should("exist");
    });

    it("Verify default fields up to attachment", () => {
      cy.verifyPredefiendFields();
      cy.get("#AttachmentFieldPresenter-field").should("exist");
    });

    it("Verify that Form Options should  appear for this tab ", () => {
      cy.get(".formOptionsBox").should("exist");
    });
  });

  context("Add FB Fields", () => {
    it("Add autocomplete of “Approvers” and set validation", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "Autocomplete-Approvers" });
      cy.get("[data-cy='optionId']").autocompleteSelect("Approvers");
      cy.fbOpenValidation();
      cy.fbFieldRequired();
      cy.fbAddField();
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
      cy.listLoadingElementShouldNotExist();
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Navigate to Specification tab", () => {
      cy.drSelectSpecificationTab();
    });

    it("Add textfield", () => {
      fbclickOnAddCalPM();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "Eq Textfield" });
      cy.fbAddNewFieldButton();
    });

    it("Select references", () => {
      cy.get(`[data-cy="referenceTo"]`).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.get(`[data-cy="referenceTo"]`).arrowType("FM-00004")
        .wait(2000).type(`{downarrow}{enter}`);

      cy.get(`[data-cy="referenceTo"]`).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.get(`[data-cy="referenceTo"]`).arrowType("FM-00005")
        .wait(2000).type(`{downarrow}{enter}`);
      cy.unClick();
    });

    it("Add Checkbox group", () => {
      fbclickOnAddCalPM();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
      cy.fbGroupOptions("1", "2", "3");
      cy.fbOpenValidation();
      cy.fbFieldRequired();
      cy.fbAddNewFieldButton();
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Verify overview specification tab fb and schema fields", () => {
    it("Navigate to Specification tab", () => {
      cy.drSelectSpecificationTab();
    });

    it("Verify Click on Specification Tab, clicking on it should open that tab and close the other one", () => {
      cy.get("[data-cy='tabCon-tabId.overview']").should("have.attr", "aria-selected", "false");
      cy.get("#sm-tabpanel-0").should("not.exist");
      cy.isTabActive({ name: "specification", index: 1 });
    });

    it("Verify Primary owner and co-ordinator fields", () => {
      cy.get("[data-cy='fb-primary-owner-eq']").should("exist");
      cy.get("[data-cy='fb-coordinator-eq']").should("exist");
    });

    it("Verify Add field button Exist in specification tab", () => {
      cy.get("[data-cy='form.builder.add.field']").should("exist");
    });

    it("Verify add FB Field Checked chebox", () => {
      cy.get(`input[type="checkbox"][value="1"]`).should("exist");
    });

    it("Verify add FB Field  textfield", () => {
      cy.get("[name^='eq-textfield']").should("exist");
    });

    it("Verify that Form Options should  appear for this tab ", () => {
      cy.get(".formOptionsBox").should("exist");
    });

    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy='References']").should("exist");
      cy.get("[data-cy='generalInfo']").should("be.visible");
    });

  });

  context("Release EQ", () => {
    it("Approve and release  document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });
  });

  context("Create a required document from release form, Verify the layout and Release It", () => {
    context("Create New Document from Release form", () => {
      it("Click 'Create New'", () => {
        cy.drCreateNewDocumentFromForm();
      });
    });


    context("Verify Layout of document and Tabs", () => {
      it("Verify EQ is created, The top left of the page displays: Icon and type, ID, Rev stage,status (DRAFT)", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.DRAFT,
          title: "Equipment",
          docId: "EQ-00001",
          revision: "Rev 1",
        });
      });

      it("Verify that it contains Overview, Specification tab", () => {
        cy.verifyTabs("overview", "specification");
      });

      it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
        cy.verifyFixedTab();
      });

      it("Verify EQ opens to the Overview tab by default", () => {
        cy.isTabActive({ name: "overview", index: 0 });
      });

      it("Verify overview tab predefiend fields up to attachment and FB fields Approver,Eq status", () => {
        cy.get("[data-cy='field-name']").should("exist");
        cy.get("[data-cy='description']").should("exist");
        cy.get("[data-cy='select.document.documentType.id']").should("exist");
        cy.get("[data-cy='field-document.docId']").should("exist");
        cy.get("[data-cy='field-revisionStage']").should("exist");
        cy.get("[data-cy='field-name']").should("exist");
        cy.get("[name='fb-default-eq-status']").should("exist");
        cy.get("[data-cy^='autocomplete-approvers']").should("exist");
        cy.get("[data-cy='select.document.documentType.id']").should("exist");
        cy.get("#AttachmentFieldPresenter-field").should("exist");
      });

      it("Verify that Form Options should  appear for this tab ", () => {
        cy.get(".formOptionsBox").should("exist");
      });
    });

    context("Verify form migration", () => {

      it("Navigate to specification tab", () => {
        cy.drSelectSpecificationTab();
      });

      it("Verify the checkbox field data after migration", () => {
        cy.get("[value='1']").arrowClick();
      });

      it("Verify migrate form button is visible", () => {
        cy.drClickCreateDocumentWithoutApiCall();
        cy.get("[data-cy=references-icon]").arrowClick();
        cy.get("[data-cy='common.form.migration']").should("be.visible");
      });

      it("Click on migrate form button", () => {
        cy.get("[data-cy='common.form.migration']").arrowClick();
      });

      it("Select form to be migrated", () => {
        cy.get("[data-cy='field-changeDocumentForm']").arrowClick();
        cy.get("[id^='react-select']").contains("FM-00002").arrowClick();
      });

      it("Mapped EQ Status field", () => {
        cy.get("[data-cy='field-fb-default-eq-status']" ).arrowClick();
        cy.get("[id^='react-select']").eq(1).autocompleteSelect("EQ Status");
      });

      it("Mapped Primary Owner field", () => {
        cy.get("[data-cy='field-fb-primary-owner-eq']" ).arrowClick();
        cy.get("[id^='react-select']").eq(2).autocompleteSelect("Primary Owner");
      });

      it("Mapped Coordinator field", () => {
        cy.get("[data-cy='field-fb-coordinator-eq']" ).arrowClick();
        cy.get("[id^='react-select']").eq(3).autocompleteSelect("Coordinator");
      });

      it("Mapped Autocomplete-Approvers field", () => {
        cy.get("[data-cy^='field-autocomplete-approvers']" ).arrowClick();
        cy.get("[id^='react-select']").eq(4).autocompleteSelect("Autocomplete-Approvers");
      });

      it("Mapped Eq Textfield field", () => {
        cy.get("[data-cy^='field-eq-textfield']" ).arrowClick();
        cy.get("[id^='react-select']").eq(5).autocompleteSelect("Eq Textfield");
      });

      it("Mapped checkbox field", () => {
        cy.get("[data-cy^='field-checkbox']" ).arrowClick();
        cy.get("[id^='react-select']").eq(6).autocompleteSelect("Checkbox");
      });

      it("Click on confirm change", () => {
        cy.drClickConfirmChange();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigate to specification tab", () => {
        cy.drSelectSpecificationTab();
      });

      it("Verify the checkbox field data after migration", () => {
        cy.get("[value='1']").should("be.checked");
      });

      it("Verify form info should have migrated form 'FM-00002'", () => {
        cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00002");
      });
    });

    context("Verify specification tab", () => {
      it("Navigate to Specification tab", () => {
        cy.drSelectSpecificationTab();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Verify Click Specification Tab, clicking on it should open that tab and close the other one", () => {
        cy.get("[data-cy='tabCon-tabId.overview']").should("have.attr", "aria-selected", "false");
        cy.get("#sm-tabpanel-0").should("not.exist");
        cy.get("[data-cy='tabCon-tabId.specification']").should("have.attr", "aria-selected", "true");
      });

      it("Verify Primary owner and co-ordinator fields", () => {
        cy.get("[data-cy='fb-primary-owner-eq']").should("exist");
        cy.get("[data-cy='fb-coordinator-eq']").should("exist");
      });

      it("Verify Add field button Exist", () => {
        cy.get("[data-cy='form.builder.add.field']").should("exist");
      });

      it("Verify add FB Field Checked chebox", () => {
        cy.get(`input[type="checkbox"][value="1"]`).should("exist");
      });

      it("Verify add FB Field  textfield", () => {
        cy.get("[name^='eq-textfield']").should("exist");
      });

      it("Verify Add Cal or PM is displayed", () => {
        cy.get("[data-cy='form.builder.addEquiSpec']").should("exist");
      });

      it("Add PM", () => {
        fbclickOnAddCalPM();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Equipment" });
        cy.fbEnterNameValue({ name: "label", value: "Preventative Maintenance" });
        cy.get("input[value='preventativeMaintenance']").arrowClick();
        cy.fbAddField();
      });

      it("Add CAL", () => {
        fbclickOnAddCalPM();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Equipment" });
        cy.fbEnterNameValue({ name: "label", value: "Calibration" });
        cy.get("input[value='calibration']").arrowClick();
        cy.fbAddField();
      });

      it("Verify PM section exist or not", () => {
        cy.get("[class*='fb-field-wrapper-preventative-maintenance']").should("exist");
      });

      it("Verify Cal section exist or not", () => {
        cy.get("[class*='fb-field-wrapper-calibration']").should("exist");
      });

      it("Verify that Form Options should  appear for this tab ", () => {
        cy.get(".formOptionsBox").should("exist");
      });

      it("Save the document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

    });

    context("Fill the form", () => {
      it("Navigate to overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Fill the record details'", () => {
        cy.drEnterDocumentTitle({ name: "EQ Test title" });
      });

      it("Fill the Description details'", () => {
        cy.drEnterDocumentDescription({ description: "EQ Test Description" });
      });

      it("Fill the Eq status and Approver'", () => {
        cy.get("[name='fb-default-eq-status']").eq(0).arrowClick().wait(2000);
        cy.get("[data-cy^='autocomplete-approvers']").arrowClick();
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick({ force: true });
        cy.unClick();
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
        cy.progressBarShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Click on Save", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Navigate to specification tab", () => {
        cy.drSelectSpecificationTab();
      });

      it(`Enter text field value`, () => {
        cy.get("[data-cy^='eq-textfield']").arrowType("Test");
        cy.get(`input[type="checkbox"][value="1"]`).check({ force: true }).wait(2000);
      });

      it(`Select '${USERS[1].name}' for Primary Owner`, () => {
        cy.get("input[data-cy='fb-primary-owner-eq']").autocompleteSelect(USERS[1].name);
      });

      it(`Select '${USERS[2].name}' for Coordinator`, () => {
        cy.get("input[data-cy='fb-coordinator-eq']").autocompleteSelect(USERS[2].name);
      });

      it("Select document 'Yes' for preventative maintenance required", () => {
        cy.get("[value='Yes']").eq(0).arrowClick({ force: true }).wait(2000);
      });

      it("Select 'Preventative Maintenance form' for preventative maintenance required", () => {
        cy.get("[name$='preventativeForm'] button").eq(2).arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.unClick();
        cy.get("[data-cy*='preventativeForm']").eq(0).arrowClick();
        cy.get("ul>li[role='option']").contains("Preventative Maintenance form").arrowClick();
      });

      it("Select preventative maintenance frequency", () => {
        cy.get("[name*='frequency']").eq(0).arrowType(`5`);
        cy.unClick();
      });

      it("Type preventative maintenance instruction", () => {
        cy.get("[data-cy^='preventative-maintenance'] div[contenteditable]").last()
          .click({ force: true }).clear().arrowType("Instructions for preventative maintenance");
        cy.unClick();
      });

      it("Select document 'Yes' for calibration required", () => {
        cy.get("[value='Yes']").eq(1).arrowClick({ force: true }).wait(2000);
      });

      it("Select 'Calibration form' for calibration required", () => {
        cy.get("[name$='preventativeForm'] button").eq(5).arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.unClick();
        cy.get("[data-cy*='preventativeForm']").eq(1).arrowClick();
        cy.get("ul>li[role='option']").contains("Calibration form").arrowClick();
      });

      it("Select calibration frequency", () => {
        cy.get("[name*='frequency']").eq(1).arrowType(`5`);
      });

      it("Type calibration maintenance instruction", () => {
        cy.get("[data-cy^='calibration'] div[contenteditable]").last()
          .click({ force: true }).clear().arrowType("Instructions for calibration");
        cy.unClick();
      });

      it("Click on Save", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Verify Add/Remove References from right side panel", () => {
        cy.verifyAddRemoveReference({ formId: "FM-00001" });
      });
    });

    context("Approve and released", () => {
      it("Approve and Release", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
        cy.url().then((url: any) => {
          equipmentURL = url;
        });
      });

      it("Verify tabs should visible Overview, Specification", () => {
        cy.verifyTabs("overview", "specification");
      });

      it("Switch to specification tab", () => {
        cy.drSelectSpecificationTab();
      });

      it("Button 'New PM' should be displayed", () => {
        cy.get("[data-cy='fb-control-btn']").contains("New PM").should("be.visible");
      });

      it("Button 'New Cal' should be exist", () => {
        cy.get("[data-cy='form.builder.new.calibration']").should("exist");
      });
    });

    context("Fill new calbration form", () => {
      it("Click on New CAL", () => {
        cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
        cy.get("[data-cy='form.builder.new.calibration']").arrowClick();
        cy.wait("@response").then((res) => {
          if (res.response) {
            const response = res.response.body;
            calDocId = response.documentId;
            calId = response.id;
            const newUrl = `${CONFIG.FE_URL}/document_revision/${calDocId}/version/${calId}`;
            cy.visit(newUrl);
            cy.listLoadingElementShouldExist();
            cy.progressBarShouldNotExist();
          }
        });
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Verify tabs", () => {
        cy.verifyTabs("overview", "details");
      });

      it("Verify revision is Alfa", () => {
        cy.get("[data-cy='HeaderInfo-Rev']").should("have.text", "Rev A");
      });

      it("Enter title 'Calibration document'", () => {
        cy.drEnterDocumentTitle({ name: "Calibration document" });
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it(`Select maintainer '${USERS[1].name}'`, () => {
        cy.listLoadingElementShouldNotExist();
        cy.get("[data-cy='equipment_maintainer']").arrowClick();
        cy.get("ul>li[role='option']").contains(USERS[1].name).arrowClick();
      });

      it("Fill 'Completion Date'", () => {
        const dayOfTheMonth = moment().tz("America/Los_Angeles").date();
        cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").arrowClick();
        cy.get("button.MuiPickersDay-day")
          .not(".MuiPickersDay-hidden")
          .each(($el) => {
            const dayNumber = $el.text();
            cy.log(dayNumber);
            if (dayOfTheMonth.toString() === dayNumber) {
              cy.wrap($el).arrowClick();
            }
          });
      });

      it("Create 'Calibration document' and approve", () => {
        cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: false });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Navigate to Overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add an Approval", () => {
        cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApprovalWithoutAPI();
      });

      it("Approve record", () => {
        cy.ebApproveWithoutApi();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
      });
    });

    context("Fill new PM form", () => {
      const ADMIN_USER = USERS[1];
      it("Navigate to EQ document", () => {
        cy.visit(equipmentURL);
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
      });

      it("Navigate to specification tab", () => {
        cy.drSelectSpecificationTab();
      });

      it("Click on 'New PM' on Preventative Maintenance section", () => {
        cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
        cy.get("[data-cy='form.builder.new.pm']").arrowClick();
        cy.wait("@response").then((res) => {
          if (res.response) {
            const response = res.response.body;
            calDocId = response.documentId;
            calId = response.id;
            const newUrl = `${CONFIG.FE_URL}/document_revision/${calDocId}/version/${calId}`;
            cy.visit(newUrl);
            cy.listLoadingElementShouldNotExist();
            cy.progressBarShouldNotExist();
          }
        });
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Enter title 'Preventative Maintenance'", () => {
        cy.drEnterDocumentTitle({ name: "Preventative Maintenance" });
      });

      it("Navigate to details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify tabs", () => {
        cy.verifyTabs("overview", "details");
      });

      it("Verify revision is Alfa", () => {
        cy.get("[data-cy='HeaderInfo-Rev']").should("have.text", "Rev A");
      });

      it(`Select maintainer '${ADMIN_USER.name}'`, () => {
        cy.listLoadingElementShouldNotExist();
        cy.get("[data-cy='equipment_maintainer']").arrowClick();
        cy.get("ul>li[role='option']").contains(ADMIN_USER.name).arrowClick();
      });

      it("Fill 'Completion Date'", () => {
        const dayOfTheMonth = moment().tz("America/Los_Angeles").date();
        cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").arrowClick();
        cy.get("button.MuiPickersDay-day")
          .not(".MuiPickersDay-hidden")
          .each(($el) => {
            const dayNumber = $el.text();
            cy.log(dayNumber);
            if (dayOfTheMonth.toString() === dayNumber) {
              cy.wrap($el).arrowClick();
            }
          });
      });

      it("Create 'Preventative Maintenance' and approve it", () => {
        cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: false });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Navigate to Overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add an Approval", () => {
        cy.pmAddApproverOnApproverListWithoutApi({ approver: ADMIN_USER.name });
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApprovalWithoutAPI();
      });

      it("Approve record", () => {
        cy.ebApproveWithoutApi();
      });
    });

    context("Navigate back to EQ to specification tab and Verify", () => {
      it("Navigate back to EQ", () => {
        cy.navigToEquipment();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Select 'EQ-00001'", () => {
        cy.dlFilterByDocId({ docId: "EQ-00001" });
        cy.dlSelectFirstDocument();
      });

      it("Verify tabs should visible Overview, Specification, calpmhistory", () => {
        cy.verifyTabs("overview", "specification");
      });

      it("Navigate to specification tab", () => {
        cy.drSelectSpecificationTab();
      });

      it("Verify that Specification tab displays maintainance History", () => {
        cy.get("[data-cy='document.revision.history']").eq(0).scrollIntoView();
        cy.get("[data-cy='maintenanceHistory']").eq(0).should("exist");
        cy.get("[data-cy='maintenanceHistory'] a").eq(0).contains("MR-00002").should("exist");
      });

      it("Verify it displays Cal/PM Due Date, link for Cal/PM is created and displayed", () => {
        cy.get("[data-cy='maintenance.status']").eq(0).should("exist");
        cy.get("[data-cy='form.builder.pm']").should("exist");
        cy.get("[data-cy='common.due.date']").eq(0).should("exist");
      });

      it("Check calibration status is in complience for next 5 days", () => {
        const calibrationComplianceDate = moment().tz("America/Los_Angeles")
          .add(5, "days")
          .format("ddd, MMMM D, YYYY");
        cy.get("[data-cy='maintenance.status']")
          .eq(0).then(($el) => {
            const text = $el.text().replace(/\u00a0/g, "");
            expect(text).to.contain(`PMDone - Due date: ${calibrationComplianceDate}`);
          });
      });

      it("Verify link open", () => {
        cy.get("[data-cy='maintenanceHistory'] a").eq(0).should("exist");
        cy.get("[data-cy='maintenanceHistory'] a").eq(0).invoke("removeAttr", "target").click();
        cy.listLoadingElementShouldNotExist();
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.RELEASED,
          title: "Records",
          docId: "MR-00002",
          revision: "Rev A",
        });
      });

      it("Navigate back to EQ", () => {
        cy.navigToEquipment();
        cy.dlClearFilters();
      });

      it("Select 'EQ-00001'", () => {
        cy.dlFilterByDocId({ docId: "EQ-00001" });
        cy.dlSelectFirstDocument();
      });
    });

    context("Validate Right Side Panel", () => {
      it("Verify that right side panel opens by default to the References tab", () => {
        cy.get("[data-cy='References']").should("exist");
        cy.get("[data-cy='generalInfo']").should("be.visible");
      });

      it("Verify Right side pannel Expand and collapse", () => {
        cy.verifyExpandCollpase();
      });

      it("Verify it is fixed as the user scrolls up or down", () => {
        cy.get("#sm-tabpanel-0").scrollIntoView().should("be.visible");
        cy.get("[data-cy='References']").should("be.visible");
      });

      it("Verify Eye Icon", () => {
        cy.get("[data-cy='references-icon']").should("exist");
      });

      it("Verify Reference tab Info (Avatar, username and owner)", () => {
        cy.verifyReferenceTab({ user: USERS[1], formId: "", shortName: "GR" });
      });


      it("Verify Referenced By, Training ,and Release date Item exist or not", () => {
        cy.verifyReferenceInfo();
        cy.get("[data-cy='common.revision']").should("contain.text", "Revision");
        cy.get("[data-cy='common.revision']").parent().should("contain.text",
          moment().tz("America/Los_Angeles").format("MM/DD/YYYY"));
      });

      it("Referenced By- Verify if the EQ is Referenced by", () => {
        cy.get("[data-cy='generalInfo']").should("contain.text", "Referenced By");
        cy.contains("None").eq(0).should("exist");
      });

      it("Verify form info formId,Revision, Release date", () => {
        cy.get("[data-cy='output.info']").should("be.visible");
        cy.contains("Form Info").should("be.visible");
        cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00002");
        cy.get("[data-cy='common.revision']").should("contain.text", "Revision");
        cy.get("[data-cy='common.revision']").parent().should("contain.text", "1");
        cy.get("[data-cy='common.revision']").parent().should("contain.text",
          moment().tz("America/Los_Angeles").format("MM/DD/YYYY"));
      });

      it("Verify training info should be visible", () => {
        cy.get("[data-cy='training']").should("be.visible");
        cy.contains("None").should("exist");
      });

      it("Verify released date", () => {
        cy.get("[data-cy='releaseDate']").should("be.visible");
        cy.get("[data-cy='releaseDate']").parent().parent().should("contain.text",
          moment().tz("America/Los_Angeles").format("MM/DD/YYYY"));
      });

      context("Verify Revision", () => {
        it("Revise Record", () => {
          cy.get("[data-cy='updateRecord']").arrowClick();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Turn off autosave", () => {
          cy.cmpTurnOffAutosave();
        });

        it("Enter document description 'test training description'", () => {
          cy.drEnterDocumentDescription({ description: "EQ description 2" });
        });

        it("Save Record", () => {
          cy.drClickCreateDocumentWithoutApiCall();
        });

        it("open revision tab", () => {
          cy.get("[data-cy='note-icon']").arrowClick();
        });

        it("Verify revision Rev Document open or not", () => {
          cy.get("[data-cy='DocumentRevisionList-item']").eq(0).arrowClick().wait(2000);
          cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev 2");
        });

        it("open revision tab", () => {
          cy.get("[data-cy='note-icon']").arrowClick();
        });

        it("Verify revision Rev Document open or not", () => {
          cy.get("[data-cy='DocumentRevisionList-item']").eq(1).arrowClick().wait(2000);
          cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev 1");
        });
      });

      context("Verify User able to add Groups or other user permissions", () => {
        it("Open permissions tab", () => {
          cy.drSelectPermissionTab();
        });

        it("Add another user permission", () => {
          cy.drAddUserFromPermissionTab(USERS[3].name);
          cy.listLoadingElementShouldNotExist();
          cy.progressBarShouldNotExist();
        });

        it("Add another group permission", () => {
          cy.wait(2000);
          cy.listLoadingElementShouldNotExist();
          cy.progressBarShouldNotExist();
          cy.drAddGroupFromPermissionTab("Developers");
          cy.listLoadingElementShouldNotExist();
          cy.progressBarShouldNotExist();
        });
      });

      context("Check document history", () => {
        const groupOne = "Developers";
        const history = [
          {
            owner: USERS[1].name,
            actions: [
              { key: "Access granted to group", value: "Developers" },
            ],
          },
          {
            owner: USERS[1].name,
            actions: [
              { key: "Access granted to user", value: `${USERS[3].name}` },
            ],
          },
        ];
        it("Verify Doc history", () => {
          cy.drSelectHistoryTab();
        });
        verifyHistoryContent(history, groupOne);
      });

      context("Verify Book Mark", () => {
        it("Verify Book Mark Navigation", () => {
          cy.get("[data-cy='bookmark-icon']").arrowClick();
          cy.get("[data-cy='Bookmarks-detail']").should("be.visible");
        });

        it("Navigate to specification tab", () => {
          cy.drSelectSpecificationTab();
        });

        it("Click on book mark verify user is navigate to the bookmarked field", () => {
          cy.get("[data-cy='Bookmarks-detail'] p").eq(0).arrowClick();
          cy.get("[data-cy='Calibration']").should("be.visible");
        });

        it("Click on  book mark verify procedure block is visible", () => {
          cy.get("[data-cy='Bookmarks-detail'] p").eq(1).arrowClick();
          cy.get("[data-cy='Preventative Maintenance']").should("be.visible");
        });
      });

      context("Verify Revison history", () => {
        it("Verify revision icon ", () => {
          cy.get("[data-cy='cr-icon']").should("be.visible");
        });

        it("Click on revision icon history tab should open", () => {
          cy.drSelectRevisionHistoryTab();
          cy.get("[data-cy='Revision History-detail']").should("be.visible");
        });
      });

      context("Verify Scroll", () => {
        it("Navigate to history tab", () => {
          cy.get("[data-cy='timeline-icon']").arrowClick();
        });

        it("Click and drag the scroll bar and verify that user can scroll history tab", () => {
          cy.get("[data-cy='History-detail']").realHover().wait(2000).scrollTo("bottom");
        });
      });
    });
  });

  // Doc approve using AR case
  context("Approve and release EQ using AR", () => {
    it("Navigate to Document list", () => {
      cy.unClick();
      cy.navigToDocumentList();
    });

    it("Open Released EQ", () => {
      cy.dlClearFilters();
      cy.dlFilterByDocId({ docId: "FM-00002" });
    });

    it("Select first record", () => {
      cy.dlSelectFirstDocument();
    });

    it("Click 'Create New'", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    context("Fill the form", () => {
      it("Navigate to overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Fill the record details'", () => {
        cy.drEnterDocumentTitle({ name: "AR EQ title" });
      });

      it("Fill the Description details'", () => {
        cy.drEnterDocumentDescription({ description: "EQ description 2" });
      });

      it("Select 'Alpha' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Alpha" });
      });

      it("Fill the Eq status and Approver'", () => {
        cy.get("[name='fb-default-eq-status']").eq(0).arrowClick().wait(2000);
        cy.get("[data-cy^='autocomplete-approvers']").arrowClick();
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick({ force: true });
        cy.unClick();
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
        cy.progressBarShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Click on Save", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Navigate to specification tab", () => {
        cy.drSelectSpecificationTab();
      });

      it("Add EQUIPMENT SECTIONS FOR PM", () => {
        fbclickOnAddCalPM();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Equipment" });
        cy.fbEnterNameValue({ name: "label", value: "Preventative Maintenance" });
        cy.get("input[value='preventativeMaintenance']").arrowClick();
        cy.fbAddField();
      });

      it("Add EQUIPMENT SECTIONS FOR CAL", () => {
        fbclickOnAddCalPM();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Equipment" });
        cy.fbEnterNameValue({ name: "label", value: "Calibration" });
        cy.get("input[value='calibration']").arrowClick();
        cy.fbAddField();
      });

      it("Verify PM section exist or not", () => {
        cy.get("[class*='fb-field-wrapper-preventative-maintenance']").should("exist");
      });

      it("Verify Cal section exist or not", () => {
        cy.get("[class*='fb-field-wrapper-calibration']").should("exist");
      });

      it(`Enter text field value`, () => {
        cy.get("[data-cy^='eq-textfield']").arrowType("Test");
        cy.get(`input[type="checkbox"][value="1"]`).check({ force: true }).wait(2000);
      });

      it(`Select '${USERS[1].name}' for Primary Owner`, () => {
        cy.get("input[data-cy='fb-primary-owner-eq']").autocompleteSelect(USERS[1].name);
      });

      it(`Select '${USERS[2].name}' for Coordinator`, () => {
        cy.get("input[data-cy='fb-coordinator-eq']").autocompleteSelect(USERS[2].name);
      });

      it("Select document 'Yes' for preventative maintenance required", () => {
        cy.get("[value='Yes']").eq(0).arrowClick({ force: true }).wait(2000);
      });

      it("Select 'Preventative Maintenance form' for preventative maintenance required", () => {
        cy.get("[name$='preventativeForm'] button").eq(2).arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.unClick();
        cy.get("[data-cy*='preventativeForm']").eq(0).arrowClick();
        cy.get("ul>li[role='option']").contains("Preventative Maintenance form").arrowClick();
      });

      it("Select preventative maintenance frequency", () => {
        cy.get("[name*='frequency']").eq(0).arrowType(`5`);
        cy.unClick();
      });

      it("Type preventative maintenance instruction", () => {
        cy.get("[data-cy^='preventative-maintenance'] div[contenteditable]").last()
          .click({ force: true }).clear().arrowType("Instructions for preventative maintenance");
        cy.unClick();
      });

      it("Select document 'Yes' for calibration required", () => {
        cy.get("[value='Yes']").eq(1).arrowClick({ force: true }).wait(2000);
      });

      it("Select 'Calibration form' for calibration required", () => {
        cy.get("[name$='preventativeForm'] button").eq(5).arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.unClick();
        cy.get("[data-cy*='preventativeForm']").eq(1).arrowClick();
        cy.get("ul>li[role='option']").contains("Calibration form").arrowClick();
      });

      it("Select calibration frequency", () => {
        cy.get("[name*='frequency']").eq(1).arrowType(`5`);
      });

      it("Type calibration maintenance instruction", () => {
        cy.get("[data-cy^='calibration'] div[contenteditable]").last()
          .click({ force: true }).clear().arrowType("Instructions for calibration");
        cy.unClick();
      });

      it("Click on Save", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });

    context("Create AR and select document", () => {
      it("Navigate to Approval request", () => {
        cy.navigToApprovalRequestList();
      });

      it("Click Create a Approval Request button", () => {
        cy.arClickCreateAnAR();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Enter AR title AR for EQ document`, () => {
        cy.arEnterApprovalRequestTitle({ title: "AR for EQ document" });
      });

      it(`Enter description`, () => {
        cy.arEnterApprovalRequestDescription({ description: "AR for eq description" });
      });

      it("Navigate to Items tab", () => {
        cy.get("[data-cy=\"tabCon-tabId.items\"]").arrowClick({ force: true });
        cy.listLoadingElementShouldNotExist();
        cy.wait(1000);
      });

      it("Add first document revision", () => {
        cy.arAddItems();
        cy.arChoseSpecificProposedDocument({ name: "AR EQ title" });
        cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
        cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
        cy.arClickAddItemDone();
      });

      it("Save AR", () => {
        cy.arSaveApiCall();
      });

      it("Add approvers to approval request on approver list", () => {
        cy.get("[data-cy=\"tabId.approvals\"]").arrowClick({ force: true });
        cy.arAddApproverOnApproverListWithoutApi({ approver: USERS[1].email, noWait: true });
      });

      it("Save AR", () => {
        cy.arSaveApiCall();
      });

      it("Send AR to review", () => {
        cy.contains("Send to review").arrowClick();
      });

      it("Approve the AR", () => {
        cy.get("[data-cy='transition-approve']").contains("Approve submission").arrowClick();
        cy.get("[data-cy='transition.action.password']").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.get("[data-cy='passwordConfirm']").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.checkToastMessage({ exists: false });
      });

      it("Click on close and yes", () => {
        cy.get("[data-cy='transition-closed']").arrowClick();
        cy.get("#AlertDialog-continueButton").arrowClick();
      });
    });

    context("Navigate to EQ and verify its in release state", () => {
      it("Navigate back to EQ", () => {
        cy.navigToEquipment();
        cy.dlClearFilters();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Select 'EQ-00002'", () => {
        cy.dlFilterByDocId({ docId: "EQ-00002" });
        cy.dlSelectFirstDocument();
      });

      context("Verify EQ is released and all data Preserved", () => {
        it("Verify EQ is in release state", () => {
          cy.get("div[data-cy='HeaderInfo-status']").contains(STATUS_TYPES_LABEL.RELEASED).should("be.visible");
        });

        it("Navigate to specification tab", () => {
          cy.drSelectSpecificationTab();
        });

        it("Verify Primary owner and co-ordinator fields", () => {
          cy.get("[data-cy='fb-primary-owner-eq']").should("have.value", "Giovanni Reynolds");
          cy.get("[data-cy='fb-coordinator-eq']").should("have.value", "Harry Bartoletti");
        });

        it("Verify add FB Field Checked chebox", () => {
          cy.get(`input[type="checkbox"][value="1"]`).should("be.checked");
        });

        it("Verify add FB Field  textfield", () => {
          cy.get("[name^='eq-textfield']").should("have.text", "Test");
        });

        it("Verify frequency", () => {
          cy.get("[name*='frequency']").should("exist");
        });

        it("Verify 'Yes' for preventative maintenance required", () => {
          cy.get("[value='Yes']").eq(0).should("be.checked");
        });

        it("Select document 'Yes' Cal", () => {
          cy.get("[value='Yes']").eq(1).should("be.checked");
        });

        it("Verify 'Preventative Maintenance form' for preventative maintenance required", () => {
          cy.get("[data-cy^='preventative-maintenance']").should("have.value",
            "FM-00004 - rev 1 - Preventative Maintenance form"
          );
        });

        it("Verify  cal selected form contains FM-00005 ", () => {
          cy.get("[data-cy^='calibration-']").should("have.value",
            "FM-00005 - rev 1 - Calibration form"
          );
        });
      });

      context("Fill new calbration form", () => {
        it("Switch to specification tab", () => {
          cy.drSelectSpecificationTab();
        });

        it("Click on New CAL", () => {
          cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
          cy.get("[data-cy='form.builder.new.calibration']").arrowClick();
          cy.wait("@response").then((res) => {
            if (res.response) {
              const response = res.response.body;
              calDocId = response.documentId;
              calId = response.id;
              const newUrl = `${CONFIG.FE_URL}/document_revision/${calDocId}/version/${calId}`;
              cy.visit(newUrl);
              cy.listLoadingElementShouldNotExist();
              cy.progressBarShouldNotExist();
            }
          });
          cy.checkToastMessage({ exists: false });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Turn off autosave", () => {
          cy.cmpTurnOffAutosave();
        });

        it("Enter title 'Calibration document'", () => {
          cy.drEnterDocumentTitle({ name: "Calibration document" });
        });

        it("Navigate to Details tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Verify tabs", () => {
          cy.verifyTabs("overview", "details");
        });

        it("Verify revision is Alfa", () => {
          cy.get("[data-cy='HeaderInfo-Rev']").should("have.text", "Rev A");
        });

        it(`Select maintainer '${USERS[1].name}'`, () => {
          cy.listLoadingElementShouldNotExist();
          cy.get("[data-cy='equipment_maintainer']").autocompleteSelect(USERS[1].name);
          // cy.get("[data-cy='equipment_maintainer']").arrowClick();
          // cy.get("ul>li[role='option']").contains(USERS[1].name).arrowClick();
        });

        it("Fill 'Completion Date'", () => {
          const dayOfTheMonth = moment().tz("America/Los_Angeles").date();
          cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").arrowClick();
          cy.get("button.MuiPickersDay-day")
            .not(".MuiPickersDay-hidden")
            .each(($el) => {
              const dayNumber = $el.text();
              cy.log(dayNumber);
              if (dayOfTheMonth.toString() === dayNumber) {
                cy.wrap($el).arrowClick();
              }
            });
        });

        it("Create 'Calibration document' and approve", () => {
          cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: false });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithoutApiCall();
        });

        it("Navigate to Overview tab", () => {
          cy.drSelectOverviewTab();
        });

        it("Add an Approval", () => {
          cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
        });

        it("Submit for approval", () => {
          cy.pmSubmitForApprovalWithoutAPI();
        });

        it("Approve record", () => {
          cy.ebApproveWithoutApi();
          cy.listLoadingElementShouldNotExist();
          cy.progressBarShouldNotExist();
        });
      });

      context("Fill new PM form", () => {
        const ADMIN_USER = USERS[1];
        it("Navigate to EQ document", () => {
          cy.visit(equipmentURL);
          cy.listLoadingElementShouldNotExist();
          cy.progressBarShouldNotExist();
        });

        it("Navigate to specification tab", () => {
          cy.drSelectSpecificationTab();
        });

        it("Click on 'New PM' on Preventative Maintenance section", () => {
          cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
          cy.get("[data-cy='form.builder.new.pm']").arrowClick();
          cy.wait("@response").then((res) => {
            if (res.response) {
              const response = res.response.body;
              calDocId = response.documentId;
              calId = response.id;
              const newUrl = `${CONFIG.FE_URL}/document_revision/${calDocId}/version/${calId}`;
              cy.visit(newUrl);
              cy.listLoadingElementShouldNotExist();
              cy.progressBarShouldNotExist();
            }
          });
          cy.checkToastMessage({ exists: false });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Turn off autosave", () => {
          cy.cmpTurnOffAutosave();
        });

        it("Enter title 'Preventative Maintenance'", () => {
          cy.drEnterDocumentTitle({ name: "Preventative Maintenance" });
        });

        it("Navigate to details tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Verify tabs", () => {
          cy.verifyTabs("overview", "details");
        });

        it("Verify revision is Alfa", () => {
          cy.get("[data-cy='HeaderInfo-Rev']").should("have.text", "Rev A");
        });

        it(`Select maintainer '${ADMIN_USER.name}'`, () => {
          cy.listLoadingElementShouldNotExist();
          cy.get("[data-cy='equipment_maintainer']").arrowClick();
          cy.get("ul>li[role='option']").contains(ADMIN_USER.name).arrowClick();
        });

        it("Fill 'Completion Date'", () => {
          const dayOfTheMonth = moment().tz("America/Los_Angeles").date();
          cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").arrowClick();
          cy.get("button.MuiPickersDay-day")
            .not(".MuiPickersDay-hidden")
            .each(($el) => {
              const dayNumber = $el.text();
              cy.log(dayNumber);
              if (dayOfTheMonth.toString() === dayNumber) {
                cy.wrap($el).arrowClick();
              }
            });
        });

        it("Create 'Preventative Maintenance' and approve it", () => {
          cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: false });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithoutApiCall();
        });

        it("Navigate to Overview tab", () => {
          cy.drSelectOverviewTab();
        });

        it("Add an Approval", () => {
          cy.pmAddApproverOnApproverList({ approver: ADMIN_USER.name });
        });

        it("Submit for approval", () => {
          cy.pmSubmitForApproval();
        });

        it("Approve record", () => {
          cy.ebApproveWithoutApi();
          cy.listLoadingElementShouldNotExist();
          cy.progressBarShouldNotExist();
        });
      });
    });

    context("Verify specification tab", () => {
      it("Navigate back to EQ", () => {
        cy.navigToEquipment();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Select 'EQ-00002'", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "EQ-00002" });
        cy.dlSelectFirstDocument();
      });

      it("Navigate to specification tab", () => {
        cy.drSelectSpecificationTab();
      });

      it("Verify that Specification tab displays History", () => {
        cy.get("[data-cy='maintenanceHistory']").scrollIntoView();
        cy.get("[data-cy='maintenanceHistory']").should("be.visible");
        cy.get("[data-cy='maintenanceHistory'] a").contains("MR-00003").should("be.visible");
      });

      it("Verify it displays Cal/PM Due Date, link for Cal/PM is created and displayed", () => {
        cy.get("[data-cy='maintenanceHistory'] a").should("be.visible");
        cy.get("[data-cy='maintenance.status']").should("be.visible");
        cy.get("[data-cy='form.builder.cal']").should("be.visible");
        cy.get("[data-cy='common.due.date']").should("be.visible");
      });

      it("Check calibration status is in complience for next 5 days", () => {
        const calibrationComplianceDate = moment().tz("America/Los_Angeles")
          .add(5, "days")
          .format("ddd, MMMM D, YYYY");
        cy.get("[data-cy='maintenance.status']")
          .eq(0).then(($el) => {
            const text = $el.text().replace(/\u00a0/g, "");
            expect(text).to.contain(`CALDone - Due date: ${calibrationComplianceDate}`);
          });
      });

      it("Verify that Click on the link Cal/PM and it should be opened", () => {
        cy.get("[data-cy='maintenanceHistory'] a").invoke("removeAttr", "target").click();
        cy.listLoadingElementShouldNotExist();
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.RELEASED,
          title: "Records",
          docId: "MR-00003",
          revision: "Rev A",
        });
      });
    });
  });
});

export { };
