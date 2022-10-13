// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { RecordDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let developersGroup;
let adminSessionId;
let adminEmployee;
let employeeToDevs;
let RDdocumentType;
let dynamicFormDocumentType;
let dynamicFormDocument;
let approvalRequestDocumentType;
let group;
let initialArDocument;

context("Records flow", () => {
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
              RecordDocumentType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          employeeToDevs = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          RDdocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Record Document");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          dynamicFormDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Dynamic Form");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        adminSessionId = loginResponse.sessionId;
        done();
      });
    });

    it("[API]Create Dynamic form", () => {
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
              formTemplate: {
                outputDocumentTypes: [],
                schema: [],
              },
              description: "<p>Dynamic form created with API description</p>",
              name: "Dynamic form created with API",
              attachments: [],
              referenceTo: [],
              revisionStage: 1,
              revisionChangeType: RevisionChangeType.NextRevision,
              retrain: false,
              document: {
                docId: "DFM-00008",
                securityList: {
                  securityEmployees: [],
                  securityGroups: [
                    {
                      id: group.body[0].id,
                    },
                  ],
                  operators: [],
                },
                documentType: {
                  id: dynamicFormDocumentType[0].id,
                },
              },
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            dynamicFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: dynamicFormDocument.id,
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

    context("[API]Update record document type", () => {
      it("Change fields config in record document type", () => {
        cy.drUpdateDocumentTypeName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          id: RDdocumentType[0].id,
          payload: {
            fieldsConfig: {
              D: {
                visible: false,
                required: false,
              },
              E: {
                label: "Record Type",
                visible: false,
                required: true,
              },
              F: {
                label: "Record ID",
                visible: false,
                required: true,
              },
              G: {
                visible: false,
                required: false,
              },
              I: {
                visible: false,
              },
              J: {
                visible: false,
              },
              K: {
                label: "Void",
                visible: true,
              },
              L: {
                label: "Correction",
                visible: true,
              },
              N: {
                label: "Approve and Release",
                visible: true,
              },
              O: {
                label: "Record History",
                visible: true,
              },
              R: {
                visible: false,
              },
              S: {
                label: "Update Record",
                visible: true,
              },
              A1: {
                label: "WIP",
                visible: true,
              },
              A2: {
                label: "Voided",
                visible: true,
              },
              A3: {
                label: "Archive",
                visible: true,
              },
              P1: {
                label: "WIP",
                visible: true,
              },
              P2: {
                label: "Voided",
                visible: true,
              },
              P3: {
                label: "Archive",
                visible: true,
              },
            },
          },
        });
      });
    });
  });

  context("[API]Add employee to developers group", () => {
    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: adminSessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: adminSessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: employeeToDevs.id }],
        },
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: employeeToDevs.id });
    });
  });

  context("Create first Record with form", () => {
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
      it("Enters title 'Lot History Record'", () => {
        cy.drEnterDocumentTitle({ name: "Lot History Record" });
      });

      it("Enters description 'Lot History Record description'", () => {
        cy.drEnterDocumentDescription({ description: "Lot History Record description" });
      });

      it("Selects 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Selects 'Record Document' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Record Document" });
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

    context("Verification of Form Fields Components", () => {
      context("verify FBL", () => {
        it("Verify Form Builder Library", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.contains("Form Builder Library").should("exist");
          cy.get(`input[placeholder^="Search"]`).should("exist");
          cy.fbVerifySectionsOnAddField("Section", "Inputs", "Approvals", "Custom Controls",
            "Instructions", "Buttons", "Actions");
        });
      });

      context("Verify Section Component", () => {
        it("Verify Nested Section", () => {
          cy.get(`[data-cy="Section-btn"]`).arrowClick();
          cy.get(`[data-cy="Section"]`).eq(1).should("exist");
          cy.get(`[data-cy="Section"]`).eq(1).arrowClick();
          cy.verifyFieldConfigExist();
          cy.verifySetRulesExist();
          cy.VerifyFBfieldLabel();
          cy.VerifyFBfieldInspectionSection();
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
          cy.VerifySetRuleswithAllSections();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Subsection", () => {
          cy.get(`[data-cy="Section-btn"]`).arrowClick();
          cy.get(`[data-cy="Subsection"]`).eq(0).should("exist");
          cy.get(`[data-cy="Subsection"]`).arrowClick();
          cy.verifyFieldConfigExist();
          cy.verifySetRulesExist();
          cy.VerifyFBfieldLabel();
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
          cy.VerifySetRuleswithAllSections();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Step", () => {
          cy.get(`[data-cy="Section-btn"]`).arrowClick();
          cy.get(`[data-cy="Step"]`).eq(0).should("exist");
          cy.get(`[data-cy="Step"]`).arrowClick();
          cy.verifyFieldConfigExist();
          cy.verifySetRulesExist();
          cy.VerifyFBfieldLabel();
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
          cy.VerifySetRuleswithAllSections();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });
      });

      context("Verify Input Component", () => {
        it("Verify Text field", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="Text field"]`).should("exist");
          cy.get(`[data-cy="Text field"]`).arrowClick();
          cy.verifyFieldConfigExist();
          cy.verifySetRulesExist();
          cy.VerifyFBfieldLabel();
          cy.VerifyFBfieldPlaceholder();
          cy.VerifyFBfieldRowNumber();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
          cy.VerifySetRuleswithAllSections();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Checkbox group", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="Checkbox group"]`).should("exist");
          cy.get(`[data-cy="Checkbox group"]`).arrowClick();
          cy.verifyFieldConfigExist();
          cy.verifySetRulesExist();
          cy.VerifyFBfieldLabel();
          cy.verifyOptions();
          cy.verifyIncludeOther();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
          cy.VerifySetRuleswithAllSections();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Autocomplete", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="Autocomplete"]`).should("exist");
          cy.get(`[data-cy="Autocomplete"]`).arrowClick();
          cy.verifyFieldConfigExist();
          cy.verifySetRulesExist();
          cy.VerifyFBfieldLabel();
          cy.VerifyFBfieldPlaceholder();
          cy.VerifyFBfieldSelectOptions();
          cy.verifyMultiSelect();
          cy.verifyIncludeQRScan();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
          cy.VerifySetRuleswithAllSections();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Text Editor", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="Text Editor"]`).should("exist");
          cy.get(`[data-cy="Text Editor"]`).arrowClick();
          cy.verifyFieldConfigExist();
          cy.verifySetRulesExist();
          cy.VerifyFBfieldLabel();
          cy.VerifyFBfieldDescriptionOptions();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
          cy.VerifySetRuleswithAllSections();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Date picker", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="Date picker"]`).should("exist");
          cy.get(`[data-cy="Date picker"]`).arrowClick();
          cy.verifyFieldConfigExist();
          cy.verifySetRulesExist();
          cy.VerifyFBfieldLabel();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.VerifyFBfieldSetCurrentDate();
          cy.VerifyFBfieldDisablePastDates();
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
          cy.VerifySetRuleswithAllSections();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Hyperlink", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="Hyperlink"]`).should("exist");
          cy.get(`[data-cy="Hyperlink"]`).arrowClick();
          cy.VerifyFBfieldLabel();
          cy.VerifyFBfieldURL();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Select", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="Select"]`).should("exist");
          cy.get(`[data-cy="Select"]`).arrowClick();
          cy.verifyFieldConfigExist();
          cy.verifySetRulesExist();
          cy.VerifyFBfieldLabel();
          cy.VerifyFBfieldPlaceholder();
          cy.verifyOptions();
          cy.verifyIncludeNone();
          cy.verifyIncludeOther();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
          cy.VerifySetRuleswithAllSections();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Radio Button group", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="Radio Button group"]`).should("exist");
          cy.get(`[data-cy="Radio Button group"]`).arrowClick();
          cy.verifyFieldConfigExist();
          cy.verifySetRulesExist();
          cy.VerifyFBfieldLabel();
          cy.verifyOptions();
          cy.verifyIncludeOther();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
          cy.VerifySetRuleswithAllSections();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Paragraph", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="Paragraph"]`).should("exist");
          cy.get(`[data-cy="Paragraph"]`).arrowClick();
          cy.get(`[data-cy="paragraph"]`).should("exist");
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify File Upload", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="File Upload"]`).should("exist");
          cy.get(`[data-cy="File Upload"]`).arrowClick();
          cy.verifyFieldConfigExist();
          cy.verifySetRulesExist();
          cy.VerifyFBfieldLabel();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
          cy.VerifySetRuleswithAllSections();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Blank Template Form", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="Blank Template Form"]`).should("exist");
          cy.get(`[data-cy="Blank Template Form"]`).arrowClick();
          cy.verifyFieldConfigExist();
          cy.verifySetRulesExist();
          cy.VerifyFBfieldLabel();
          cy.VerifyFBfieldIncludeNotes();
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
          cy.VerifySetRuleswithAllSections();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Quantity", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="Quantity"]`).should("exist");
          cy.get(`[data-cy="Quantity"]`).arrowClick();
          cy.VerifyFBfieldLabel();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Timer", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="Timer"]`).should("exist");
          cy.get(`[data-cy="Timer"]`).arrowClick();
          cy.VerifyFBfieldLabel();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Purchase Order", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="Purchase Order"]`).should("exist");
          cy.get(`[data-cy="Purchase Order"]`).arrowClick();
          cy.VerifyFBfieldLabel();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Receive Purchase Order", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="Receive Purchase Order"]`).should("exist");
          cy.get(`[data-cy="Receive Purchase Order"]`).arrowClick();
          cy.VerifyFBfieldLabel();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify PO Approval Matrix", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="PO Approval Matrix"]`).should("exist");
          cy.get(`[data-cy="PO Approval Matrix"]`).arrowClick();
          cy.VerifyFBfieldLabel();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Instructions Media upload", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="Instructions Media upload"]`).should("exist");
          cy.get(`[data-cy="Instructions Media upload"]`).arrowClick();
          cy.VerifyFBfieldLabel();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Evidence Media upload", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="Evidence Media upload"]`).should("exist");
          cy.get(`[data-cy="Evidence Media upload"]`).arrowClick();
          cy.VerifyFBfieldLabel();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify EB Procedure", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="EB Procedure"]`).should("exist");
          cy.get(`[data-cy="EB Procedure"]`).arrowClick();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify PI Procedure", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="PI Procedure"]`).should("exist");
          cy.get(`[data-cy="PI Procedure"]`).arrowClick();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Equipment", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="Equipment"]`).should("exist");
          cy.get(`[data-cy="Equipment"]`).arrowClick();
          cy.VerifyFBfieldLabel();
          cy.get(`[data-cy="form.builder.choose.form"]`).should("exist");
          cy.get(`[value="preventativeMaintenance"]`).should("exist");
          cy.get(`[value="calibration"]`).should("exist");
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Text field with range", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="Text field with range"]`).should("exist");
          cy.get(`[data-cy="Text field with range"]`).arrowClick();
          cy.VerifyFBfieldLabel();
          cy.VerifyFBfieldPlaceholder();
          cy.get(`[data-cy="fb-control-form.builder.range"]`).should("exist");
          cy.get(`[data-cy="fb-control-form.builder.critical.to.quality"]`).should("exist");
          cy.get(`[data-cy="fb-control-form.builder.inspection"]`).should("exist");
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Supplier", () => {
          cy.get(`[data-cy="Inputs"]`).arrowClick();
          cy.get(`[data-cy="Supplier"]`).should("exist");
          cy.get(`[data-cy="Supplier"]`).arrowClick();
          cy.verifyFieldConfigExist();
          cy.verifySetRulesExist();
          cy.VerifyFBfieldLabel();
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
          cy.VerifySetRuleswithAllSections();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });
      });

      context("Verify Approvals Component", () => {
        it("Verify Nested Approvals", () => {
          cy.get(`[data-cy="Approvals-btn"]`).arrowClick();
          cy.get(`[data-cy="Approvals"]`).eq(1).should("exist");
          cy.get(`[data-cy="Approvals"]`).eq(1).arrowClick();
          cy.VerifyFBfieldLabel();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Inline Approval", () => {
          cy.get(`[data-cy="Approvals-btn"]`).arrowClick();
          cy.get(`[data-cy="Inline Approval"]`).should("exist");
          cy.get(`[data-cy="Inline Approval"]`).arrowClick();
          cy.verifyFieldConfigExist();
          cy.verifySetRulesExist();
          cy.VerifyFBfieldLabel();
          cy.get(`[data-cy="common.approvers"]`).should("exist");
          cy.get(`[data-cy="form.builder.approver.groups"]`).should("exist");
          cy.get(`[data-cy="form.builder.approval.roles"]`).should("exist");
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.get(`[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
          cy.VerifySetRuleswithAllSections();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Request Approval", () => {
          cy.get(`[data-cy="Approvals-btn"]`).arrowClick();
          cy.get(`[data-cy="Request Approval"]`).should("exist");
          cy.get(`[data-cy="Request Approval"]`).arrowClick();
          cy.VerifyFBfieldLabel();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });
      });

      context("Verify Custom Controls Component", () => {
        it("Verify Dymanic form created with API", () => {
          cy.get(`[data-cy="Custom Controls-btn"]`).arrowClick();
          cy.get(`[data-cy="Dynamic form created with API"]`).should("exist");
          cy.wait(1000);
        });
      });

      context("Verify Instructions Component", () => {
        it("Verify MPI", () => {
          cy.get(`[data-cy="Instructions-btn"]`).arrowClick();
          cy.get(`[data-cy="MPI"]`).should("exist");
          cy.get(`[data-cy="MPI"]`).arrowClick();
          cy.VerifyFBfieldLabel();
          cy.get(`[data-cy="form.builder.document"]`).should("exist");
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Select Document(s)", () => {
          cy.get(`[data-cy="Instructions-btn"]`).arrowClick();
          cy.get(`[data-cy="Select Document(s)"]`).should("exist");
          cy.get(`[data-cy="Select Document(s)"]`).arrowClick();
          cy.VerifyFBfieldLabel();
          cy.verifyOptions();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });
      });

      context("Verify Buttons Component", () => {
        it("Verify Checkpoint", () => {
          cy.get(`[data-cy="Buttons-btn"]`).arrowClick();
          cy.get(`[data-cy="Checkpoint"]`).should("exist");
          cy.get(`[data-cy="Checkpoint"]`).arrowClick();
          cy.VerifyFBfieldLabel();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Create a Label", () => {
          cy.get(`[data-cy="Buttons-btn"]`).arrowClick();
          cy.get(`[data-cy="Create a Label"]`).should("exist");
          cy.get(`[data-cy="Create a Label"]`).arrowClick();
          cy.VerifyFBfieldLabel();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });

        it("Verify Implementation Task", () => {
          cy.get(`[data-cy="Buttons-btn"]`).arrowClick();
          cy.get(`[data-cy="Implementation Task"]`).should("exist");
          cy.get(`[data-cy="Implementation Task"]`).arrowClick();
          cy.VerifyFBfieldLabel();
          cy.VerifyFBfieldRevisionDisabled();
          cy.VerifyFBfieldDeletionDisabled();
          cy.VerifyFBfieldCopyableValue();
          cy.VerifyFBfieldIncludeNotes();
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });
      });

      context("Verify Actions Component", () => {
        it("Verify Action Button", () => {
          cy.get(`[data-cy="Actions-btn"]`).arrowClick();
          cy.get(`[data-cy="Action Button"]`).should("exist");
          cy.get(`[data-cy="Action Button"]`).arrowClick();
          cy.get(`[value="SendEmailWithFormToFill"]`).should("exist");
          cy.get(`[value="SendSurveyEmailWithFormToFill"]`).should("exist");
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          cy.wait(1000);
        });
      });

      context("Verify LHR Step", () => {
        it("Verify LHR Step doesn't exist in Form Builder Library", () => {
          cy.fbCheckFieldsDoesntExistOnInputsList("LHR Step");
        });

        it("Close Form Builder Library", () => {
          cy.contains("Form Builder Library").parent().find("button").arrowClick({ force: true });
        });
      });
    });

    context("Search Fields Verification", () => {
      it("Verify Search Field for `text`", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.get(`input[placeholder^="Search"]`).clear().arrowType("text").arrowClick();
        cy.unClick();
        cy.get(`[data-cy="Text field"]`).should("exist");
        cy.get(`[data-cy="Text Editor"]`).should("exist");
        cy.get(`[data-cy="Text field with range"]`).should("exist");
      });

      it("Verify Search Field for `upload`", () => {
        cy.get(`input[placeholder^="Search"]`).clear().arrowType("upload").arrowClick();
        cy.unClick();
        cy.get(`[data-cy="File Upload"]`).should("exist");
        cy.get(`[data-cy="Instructions Media upload"]`).should("exist");
        cy.get(`[data-cy="Evidence Media upload"]`).should("exist");
      });

      it("Verify Search Field for `inline`", () => {
        cy.get(`input[placeholder^="Search"]`).clear().arrowType("inline").arrowClick();
        cy.unClick();
        cy.get(`[data-cy="Inline Approval"]`).should("exist");
      });
    });

    context("Favourites Verification", () => {
      it("Verify Favorites", () => {
        cy.get(`[data-cy="Inline Approval"]`).parent()
          .find("button").eq(1).click();
        cy.wait(1000);
        cy.get(`[data-cy="Inline Approval"]`).parent()
          .find("button").eq(1).find("path").invoke("attr", "fill").should("equal", "#FFD874");
        cy.get(`input[placeholder^="Search"]`).clear();
        cy.fbVerifySectionsOnAddField("Favorites");
        cy.fbCheckFieldsExistFavoritesList("Inline Approval");
        cy.get(`[data-cy="Inline Approval"]`).parent()
          .find(`[class="MuiButtonBase-root MuiIconButton-root"]`).eq(0).click();
        cy.fbVerifySectionsNotOnAddField("Favorites");
        cy.get(`[data-cy="Approvals-btn"]`).arrowClick();
        cy.wait(1000);
        cy.get(`[data-cy="Inline Approval"]`).parent()
          .find("button").eq(1).find("path").invoke("attr", "fill").should("equal", "#C8CACF");
      });
    });

    context("Create FORM document with Form fields", () => {
      it("Add TextField", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
        cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder" });
        cy.fbEnterNameValue({ name: "rows", value: "2" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Checkbox group", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
        cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbSelectCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Autocomplete", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
        cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
        cy.fbEnterPlaceholder({ placeholder: "fb-autocomplete placeholder" });
        cy.get(`[data-cy="optionId"]`).autocompleteSelect("Document Revision");
        cy.fbSelectCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Text Editor", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text Editor" });
        cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
        cy.fbGroupOptions("SelectOne", "SelectTwo", "SelectThree");
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Date picker", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Date picker" });
        cy.fbEnterNameValue({ name: "label", value: "fb-datepicker" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Hyperlink", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Hyperlink" });
        cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink" });
        cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Select Field", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
        cy.fbEnterNameValue({ name: "label", value: "fb-select-field" });
        cy.fbEnterPlaceholder({ placeholder: "fb-select-field placeholder" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbSelectCheckboxValue("includeNone", "includeContext", "reviseDisabled",
          "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Radio Button group", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
        cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbSelectCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Paragraph", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Paragraph" });
        cy.get(`[data-cy="paragraph"]>div>div>div>div>div[contenteditable]`)
          .click({ force: true }).clear().arrowType("fb-paragraph");
        cy.fbAddNewFieldButton();
      });

      it("Add File Upload", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
        cy.fbEnterNameValue({ name: "label", value: "fb-fileupload" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
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
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Timer", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Timer" });
        cy.fbEnterNameValue({ name: "label", value: "fb-timer" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Section", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Section" });
        cy.fbEnterNameValue({ name: "label", value: "fb-section" });
        cy.fbSelectCheckboxValue("inspectionSection");
        cy.fbAddNewFieldButton();
      });

      it("Add Subsection", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Subsection" });
        cy.fbEnterNameValue({ name: "label", value: "fb-subsection" });
        cy.fbAddNewFieldButton();
      });

      it("Add Inline Approval", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
        cy.listLoadingElementShouldNotExist();
        cy.fbEnterNameValue({ name: "label", value: "fb-inline-approval" });
        cy.get(`[data-cy="editorConfig.approvers"]`).autocompleteSelect(`${USERS[1].email }`);
        cy.get(`[data-cy="editorConfig.groups"]`).autocompleteSelect("Everyone");
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });
    });

    context("Verify Form fields", () => {
      it("Verify TextField attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-textfield" });
        cy.fbVerifyNameValue({ name: "placeholder", value: "fb-textfield placeholder" });
        cy.fbEnterPlaceholder({ placeholder: " changed" });
        cy.fbVerifyNameValue({ name: "rows", value: "2" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.get(`textarea[placeholder^="fb-textfield placeholder changed"]`).should("exist");
      });

      it("move component", () => {
        cy.get("[data-cy='textfield-1']").trigger("mouseover");
        cy.wait(2000);
        cy.get(".drag-handle").eq(1)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(".drag-handle").eq(0)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
        cy.unClick();
        cy.fbClickRemoveBtn({ label: "fb-textfield" });
      });

      it("Verify Checkbox group attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-checkbox-group" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-checkbox-group" });
        cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group-changed" });
        cy.fbVerifyOptions("option1", "option2");
        cy.fbVerifyCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.get(`[data-cy="fb-checkbox-group-changed"]`).should("exist");
      });

      it("move component", () => {
        cy.get("[data-cy='checkboxgroup-2']").trigger("mouseover");
        cy.wait(2000);
        cy.get(".drag-handle").eq(1)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(".drag-handle").eq(0)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
        cy.unClick();
        cy.fbClickRemoveBtn({ label: "fb-checkbox-group-changed" });
      });

      it("Verify Subsection attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "FB-SUBSECTION" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-subsection" });
        cy.fbEnterNameValue({ name: "label", value: "fb-subsection-changed" });
        cy.fbAddNewFieldButton();
        cy.get(`[name^="fb-subsection"]`).should("contain", "FB-SUBSECTION-CHANGED");
      });

      it("move component", () => {
        cy.get("[data-cy='subsection-15']").trigger("mouseover");
        cy.wait(2000);
        cy.get(".drag-handle").eq(13)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(".drag-handle").eq(12)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
        cy.unClick();
        cy.fbClickRemoveBtn({ label: "FB-SUBSECTION-CHANGED" });
      });

      it("Verify Section attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-section" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-section" });
        cy.fbEnterNameValue({ name: "label", value: "fb-section-changed" });
        cy.fbVerifyCheckboxValue("inspectionSection");
        cy.fbAddNewFieldButton();
        cy.get(`[data-cy="fb-section-changed"]`).should("exist");
      });

      it("move component", () => {
        cy.get("[data-cy='fb-section-changed']").trigger("mouseover");
        cy.wait(2000);
        cy.get(".drag-handle").eq(12)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(".drag-handle").eq(11)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
        cy.unClick();
        cy.fbClickRemoveBtn({ label: "fb-section-changed" });
      });

      it("Verify Timer attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-timer" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-timer" });
        cy.fbEnterNameValue({ name: "label", value: "fb-timer-changed" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.get(`[data-cy="fb-timer-changed"]`).should("exist");
      });

      it("move component", () => {
        cy.get("[data-cy='textfield-14']").trigger("mouseover");
        cy.wait(2000);
        cy.get(".drag-handle").eq(11)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(".drag-handle").eq(10)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
        cy.unClick();
        cy.fbClickRemoveBtn({ label: "fb-timer-changed" });
      });

      it("Verify Quantity attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-quantity" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-quantity" });
        cy.fbEnterNameValue({ name: "label", value: "fb-quantity-changed" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.get(`[data-cy="fb-quantity-changed"]`).should("exist");
      });

      it("move component", () => {
        cy.get("[data-cy='textfield-13']").trigger("mouseover");
        cy.wait(2000);
        cy.get(".drag-handle").eq(10)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(".drag-handle").eq(9)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
        cy.unClick();
        cy.fbClickRemoveBtn({ label: "fb-quantity-changed" });
      });


      it("Verify Blank Template Form attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-blank-template" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-blank-template" });
        cy.fbEnterNameValue({ name: "label", value: "fb-blank-template-changed" });
        cy.fbAddNewFieldButton();
        cy.get(`[data-cy="fb-blank-template-changed"]`).should("exist");
        cy.contains("image.jpg").should("exist");
      });

      it("move component", () => {
        cy.get("[data-cy='blanktplform-12']").trigger("mouseover");
        cy.wait(2000);
        cy.get(".drag-handle").eq(9)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(".drag-handle").eq(8)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
        cy.unClick();
        cy.fbClickRemoveBtn({ label: "fb-blank-template-changed" });
      });

      it("Verify File Upload attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-fileupload" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-fileupload" });
        cy.fbEnterNameValue({ name: "label", value: "fb-fileupload-changed" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.get(`[data-cy="fb-fileupload-changed"]`).should("exist");
      });

      it("move component", () => {
        cy.get("[data-cy='fileupload-11']").trigger("mouseover");
        cy.wait(2000);
        cy.get(".drag-handle").eq(8)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(".drag-handle").eq(7)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
        cy.unClick();
        cy.fbClickRemoveBtn({ label: "fb-fileupload-changed" });
      });

      it("Verify Paragraph attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-paragraph" });
        cy.get(`[data-cy="paragraph"]`).parent().find("div p").eq(-1).should("have.text", "fb-paragraph");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
        cy.fbClickRemoveBtn({ label: "fb-paragraph" });
      });


      it("Verify Radio Button group attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-radiobutton-group" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-radiobutton-group" });
        cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group-changed" });
        cy.fbVerifyOptions("option1", "option2");
        cy.fbVerifyOptions("option1", "option2");
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.get(`[data-cy="fb-radiobutton-group-changed"]`).should("exist");
      });

      it("move component", () => {
        cy.get("[data-cy='radiogroup-8']").trigger("mouseover");
        cy.wait(2000);
        cy.get(".drag-handle").eq(6)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(".drag-handle").eq(5)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
        cy.unClick();
        cy.fbClickRemoveBtn({ label: "fb-radiobutton-group-changed" });
      });

      it("Verify Select Field attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-select-field" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-select-field" });
        cy.fbEnterNameValue({ name: "label", value: "fb-select-field-changed" });
        cy.fbVerifyNameValue({ name: "placeholder", value: "fb-select-field placeholder" });
        cy.fbVerifyOptions("option1", "option2");
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.get(`[data-cy="fb-select-field-changed"]`).should("exist");
      });

      it("move component", () => {
        cy.get("[data-cy='select-8']").trigger("mouseover");
        cy.wait(2000);
        cy.get(".drag-handle").eq(5)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(".drag-handle").eq(4)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
        cy.unClick();
        cy.fbClickRemoveBtn({ label: "fb-select-field-changed" });
      });

      it("Verify Hyperlink attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-hyperlink" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-hyperlink" });
        cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink-changed" });
        cy.fbVerifyNameValue({ name: "linkUrl", value: "google.com" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.get(`[name^="fb-hyperlink"]`).should("contain", "fb-hyperlink-changed");
      });

      it("move component", () => {
        cy.get("[data-cy='hyperlink-7']").trigger("mouseover");
        cy.wait(2000);
        cy.get(".drag-handle").eq(4)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(".drag-handle").eq(3)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
        cy.unClick();
      });

      it("Verify location linked on Hyperlink and remove it", () => {
        cy.window().then((win) => {
          cy.spy(win, "open").as("redirect");
        });
        cy.get("[name^=fb-hyperlink-]").arrowClick();
        cy.get("@redirect").should("be.calledWith", "https://google.com");
        cy.fbClickRemoveBtn({ label: "fb-hyperlink-changed" });
      });


      it("Verify Date picker attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-datepicker" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-datepicker" });
        cy.fbEnterNameValue({ name: "label", value: "fb-datepicker-changed" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.get(`[data-cy="fb-datepicker-changed"]`).should("exist");
      });

      it("move component", () => {
        cy.get("[data-cy='datepicker-6']").trigger("mouseover");
        cy.wait(2000);
        cy.get(".drag-handle").eq(3)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(".drag-handle").eq(2)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
        cy.unClick();
        cy.fbClickRemoveBtn({ label: "fb-datepicker-changed" });
      });

      it("Verify Text Editor attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-text-editor" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-text-editor" });
        cy.fbEnterNameValue({ name: "label", value: "fb-text-editor-changed" });
        cy.fbVerifyOptions("SelectOne", "SelectTwo", "SelectThree");
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.get(`[data-cy="fb-text-editor-changed"]`).should("exist");
      });

      it("move component", () => {
        cy.get("[data-cy='texteditor-5']").trigger("mouseover");
        cy.wait(2000);
        cy.get(".drag-handle").eq(2)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(".drag-handle").eq(1)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
        cy.unClick();
        cy.fbClickRemoveBtn({ label: "fb-text-editor-changed" });
      });

      it("Verify Autocomplete attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-autocomplete" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-autocomplete" });
        cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete-changed" });
        cy.fbVerifyNameValue({ name: "placeholder", value: "fb-autocomplete placeholder" });
        cy.get(`[data-cy="optionId"]`).should("have.value", "Document revisions");
        cy.fbVerifyCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.get(`[data-cy="fb-autocomplete-changed"]`).should("exist");
      });

      it("move component", () => {
        cy.get("[data-cy='autocomplete-4']").trigger("mouseover");
        cy.wait(2000);
        cy.get(".drag-handle").eq(1)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(".drag-handle").eq(0)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
        cy.unClick();
        cy.fbClickRemoveBtn({ label: "fb-autocomplete-changed" });
      });

      it("Verify Inline Approval attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-inline-approval" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-inline-approval" });
        cy.fbEnterNameValue({ name: "label", value: "fb-inline-approval-changed" });
        cy.get(`[data-cy="editorConfig.approvers"]`).parent().should("contain", USERS[1].email);
        cy.get(`[data-cy="editorConfig.groups"]`).parent().should("contain", "Everyone");
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.get(`[data-cy="fb-inline-approval-changed"]`).should("exist");
        cy.fbClickRemoveBtn({ label: "fb-inline-approval-changed" });
      });
    });

    context("Create FORM document with Form fields again", () => {
      it("Add TextField", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
        cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder" });
        cy.fbEnterNameValue({ name: "rows", value: "2" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Checkbox group", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
        cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbSelectCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Autocomplete", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
        cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
        cy.fbEnterPlaceholder({ placeholder: "fb-autocomplete placeholder" });
        cy.get(`[data-cy="optionId"]`).autocompleteSelect("Document Revision");
        cy.fbSelectCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Text Editor", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text Editor" });
        cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
        cy.fbGroupOptions("SelectOne", "SelectTwo", "SelectThree");
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Date picker", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Date picker" });
        cy.fbEnterNameValue({ name: "label", value: "fb-datepicker" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Hyperlink", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Hyperlink" });
        cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink" });
        cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Select Field", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
        cy.fbEnterNameValue({ name: "label", value: "fb-select-field" });
        cy.fbEnterPlaceholder({ placeholder: "fb-select-field placeholder" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbSelectCheckboxValue("includeNone", "includeContext", "reviseDisabled",
          "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Radio Button group", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
        cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbSelectCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Paragraph", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Paragraph" });
        cy.get(`[data-cy="paragraph"]>div>div>div>div>div[contenteditable]`)
          .click({ force: true }).clear().arrowType("fb-paragraph");
        cy.fbAddNewFieldButton();
      });

      it("Add File Upload", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
        cy.fbEnterNameValue({ name: "label", value: "fb-fileupload" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
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
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Timer", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Timer" });
        cy.fbEnterNameValue({ name: "label", value: "fb-timer" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Section", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Section" });
        cy.fbEnterNameValue({ name: "label", value: "fb-section" });
        cy.fbSelectCheckboxValue("inspectionSection");
        cy.fbAddNewFieldButton();
      });

      it("Add Subsection", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Subsection" });
        cy.fbEnterNameValue({ name: "label", value: "fb-subsection" });
        cy.fbAddNewFieldButton();
      });

      it("Add Inline Approval", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
        cy.listLoadingElementShouldNotExist();
        cy.fbEnterNameValue({ name: "label", value: "fb-inline-approval" });
        cy.get(`[data-cy="editorConfig.approvers"]`).autocompleteSelect(`${USERS[1].email }`);
        cy.get(`[data-cy="editorConfig.groups"]`).autocompleteSelect("Everyone");
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Save the document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Approve and Release document", () => {
      it("Approve and Release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Export the template", () => {
      it("Export template", () => {
        cy.wait(2000);
        cy.get(`[data-cy="FBWorkspace-exportTemplate"]`).eq(0).click({ force: true });
        cy.get(`[data-cy="fb-template-name"]`).arrowType("Record_form_fields");
        cy.get(`[data-cy="common.add"]`).arrowClick();
      });
    });

    context("Fill in record attributes and release document", () => {
      it("Click on 'New' button", () => {
        cy.fbClickButton({ el: "PreviewControlsContainer-createNew" });
      });

      it("Check status should be Draft", () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
      });

      it("Enters title 'Test Record title'", () => {
        cy.drEnterDocumentTitle({ name: "Test Record title" });
        cy.unClick();
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.get("#attachments-button-file").attachFile("test_image.jpg");
        cy.listLoadingElementShouldNotExist();
      });

      it("Save Record'", () => {
        cy.drSaveDocumentWithoutaudit();
      });
    });
  });


  context("Start New document creation flow", () => {
    it("Navigate back to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enters title 'Lot History Record import'", () => {
      cy.drEnterDocumentTitle({ name: "Lot History Record import" });
    });

    it("Enters description 'Lot History Record description import'", () => {
      cy.drEnterDocumentDescription({ description: "Lot History Record description import" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Selects 'Record Document' output document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "Record Document" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Import template", () => {
      cy.get("#fb-import-schema").attachFile("../downloads/Record_form_fields.json");
    });
  });

  context("Verify Form fields", () => {
    it("Verify TextField attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-textfield" });
      cy.fbVerifyNameValue({ name: "placeholder", value: "fb-textfield placeholder" });
      cy.fbEnterPlaceholder({ placeholder: " changed" });
      cy.fbVerifyNameValue({ name: "rows", value: "2" });
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get(`textarea[placeholder^="fb-textfield placeholder changed"]`).should("exist");
    });

    it("move component", () => {
      cy.get("[data-cy='textfield-17']").trigger("mouseover");
      cy.wait(2000);
      cy.get(".drag-handle").eq(1)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(0)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
      cy.fbClickRemoveBtn({ label: "fb-textfield" });
    });

    it("Verify Subsection attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "FB-SUBSECTION" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-subsection" });
      cy.fbEnterNameValue({ name: "label", value: "fb-subsection-changed" });
      cy.fbAddNewFieldButton();
      cy.get(`[name^="fb-subsection"]`).should("contain", "FB-SUBSECTION-CHANGED");
    });

    it("move component", () => {
      cy.get("[data-cy='subsection-31']").trigger("mouseover");
      cy.wait(2000);
      cy.get(".drag-handle").eq(14)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(13)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
      cy.fbClickRemoveBtn({ label: "FB-SUBSECTION-CHANGED" });
    });

    it("Verify Section attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-section" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-section" });
      cy.fbEnterNameValue({ name: "label", value: "fb-section-changed" });
      cy.fbVerifyCheckboxValue("inspectionSection");
      cy.fbAddNewFieldButton();
      cy.get(`[data-cy="fb-section-changed"]`).should("exist");
    });

    it("move component", () => {
      cy.get("[data-cy='fb-section-changed']").trigger("mouseover");
      cy.wait(2000);
      cy.get(".drag-handle").eq(13)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(12)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
      cy.fbClickRemoveBtn({ label: "fb-section-changed" });
    });

    it("Verify Timer attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-timer" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-timer" });
      cy.fbEnterNameValue({ name: "label", value: "fb-timer-changed" });
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get(`[data-cy="fb-timer-changed"]`).should("exist");
    });

    it("move component", () => {
      cy.get("[data-cy='textfield-30']").trigger("mouseover");
      cy.wait(2000);
      cy.get(".drag-handle").eq(12)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(11)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
      cy.fbClickRemoveBtn({ label: "fb-timer-changed" });
    });

    it("Verify Quantity attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-quantity" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-quantity" });
      cy.fbEnterNameValue({ name: "label", value: "fb-quantity-changed" });
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get(`[data-cy="fb-quantity-changed"]`).should("exist");
    });

    it("move component", () => {
      cy.get("[data-cy='textfield-29']").trigger("mouseover");
      cy.wait(2000);
      cy.get(".drag-handle").eq(11)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(10)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
      cy.fbClickRemoveBtn({ label: "fb-quantity-changed" });
    });


    it("Verify Blank Template Form attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-blank-template" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-blank-template" });
      cy.fbEnterNameValue({ name: "label", value: "fb-blank-template-changed" });
      cy.fbAddNewFieldButton();
      cy.get(`[data-cy="fb-blank-template-changed"]`).should("exist");
      cy.contains("image.jpg").should("exist");
    });

    it("move component", () => {
      cy.get("[data-cy='blanktplform-28']").trigger("mouseover");
      cy.wait(2000);
      cy.get(".drag-handle").eq(10)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(9)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
      cy.fbClickRemoveBtn({ label: "fb-blank-template-changed" });
    });

    it("Verify File Upload attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-fileupload" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-fileupload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-fileupload-changed" });
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get(`[data-cy="fb-fileupload-changed"]`).should("exist");
    });

    it("move component", () => {
      cy.get("[data-cy='fileupload-27']").trigger("mouseover");
      cy.wait(2000);
      cy.get(".drag-handle").eq(9)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(8)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
      cy.fbClickRemoveBtn({ label: "fb-fileupload-changed" });
    });

    it("Verify Paragraph attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-paragraph" });
      cy.get(`[data-cy="paragraph"]`).parent().find("div p").eq(-1).should("have.text", "fb-paragraph");
      cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      cy.fbClickRemoveBtn({ label: "fb-paragraph" });
    });


    it("Verify Radio Button group attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-radiobutton-group" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-radiobutton-group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group-changed" });
      cy.fbVerifyOptions("option1", "option2");
      cy.fbVerifyOptions("option1", "option2");
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get(`[data-cy="fb-radiobutton-group-changed"]`).should("exist");
    });

    it("move component", () => {
      cy.get("[data-cy='radiogroup-24']").trigger("mouseover");
      cy.wait(2000);
      cy.get(".drag-handle").eq(7)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(6)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
      cy.fbClickRemoveBtn({ label: "fb-radiobutton-group-changed" });
    });

    it("Verify Select Field attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-select-field" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-select-field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-select-field-changed" });
      cy.fbVerifyNameValue({ name: "placeholder", value: "fb-select-field placeholder" });
      cy.fbVerifyOptions("option1", "option2");
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get(`[data-cy="fb-select-field-changed"]`).should("exist");
    });

    it("move component", () => {
      cy.get("[data-cy='select-24']").trigger("mouseover");
      cy.wait(2000);
      cy.get(".drag-handle").eq(6)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(5)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
      cy.fbClickRemoveBtn({ label: "fb-select-field-changed" });
    });

    it("Verify Hyperlink attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-hyperlink" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-hyperlink" });
      cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink-changed" });
      cy.fbVerifyNameValue({ name: "linkUrl", value: "google.com" });
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get(`[name^="fb-hyperlink"]`).should("contain", "fb-hyperlink-changed");
    });

    it("move component", () => {
      cy.get("[data-cy='hyperlink-23']").trigger("mouseover");
      cy.wait(2000);
      cy.get(".drag-handle").eq(5)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(4)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
    });

    it("Verify location linked on Hyperlink and remove it", () => {
      cy.window().then((win) => {
        cy.spy(win, "open").as("redirect");
      });
      cy.get("[name^=fb-hyperlink-]").arrowClick();
      cy.get("@redirect").should("be.calledWith", "https://google.com");
      cy.fbClickRemoveBtn({ label: "fb-hyperlink-changed" });
    });


    it("Verify Date picker attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-datepicker" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-datepicker" });
      cy.fbEnterNameValue({ name: "label", value: "fb-datepicker-changed" });
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get(`[data-cy="fb-datepicker-changed"]`).should("exist");
    });

    it("move component", () => {
      cy.get("[data-cy='datepicker-22']").trigger("mouseover");
      cy.wait(2000);
      cy.get(".drag-handle").eq(4)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(3)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
      cy.fbClickRemoveBtn({ label: "fb-datepicker-changed" });
    });

    it("Verify Text Editor attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-text-editor" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-text-editor" });
      cy.fbEnterNameValue({ name: "label", value: "fb-text-editor-changed" });
      cy.fbVerifyOptions("SelectOne", "SelectTwo", "SelectThree");
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get(`[data-cy="fb-text-editor-changed"]`).should("exist");
    });

    it("move component", () => {
      cy.get("[data-cy='texteditor-21']").trigger("mouseover");
      cy.wait(2000);
      cy.get(".drag-handle").eq(3)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(2)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
      cy.fbClickRemoveBtn({ label: "fb-text-editor-changed" });
    });

    it("Verify Autocomplete attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-autocomplete" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete-changed" });
      cy.fbVerifyNameValue({ name: "placeholder", value: "fb-autocomplete placeholder" });
      cy.get(`[data-cy="optionId"]`).should("have.value", "Document revisions");
      cy.fbVerifyCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get(`[data-cy="fb-autocomplete-changed"]`).should("exist");
    });

    it("move component", () => {
      cy.get("[data-cy='autocomplete-20']").trigger("mouseover");
      cy.wait(2000);
      cy.get(".drag-handle").eq(2)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(1)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
      cy.fbClickRemoveBtn({ label: "fb-autocomplete-changed" });
    });

    it("Verify Checkbox group attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-checkbox-group" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-checkbox-group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group-changed" });
      cy.fbVerifyOptions("option1", "option2");
      cy.fbVerifyCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get(`[data-cy="fb-checkbox-group-changed"]`).should("exist");
    });

    it("move component", () => {
      cy.get("[data-cy='checkboxgroup-19']").trigger("mouseover");
      cy.wait(2000);
      cy.get(".drag-handle").eq(1)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(0)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
      cy.fbClickRemoveBtn({ label: "fb-checkbox-group-changed" });
    });

    it("Verify Inline Approval attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-inline-approval" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-inline-approval" });
      cy.fbEnterNameValue({ name: "label", value: "fb-inline-approval-changed" });
      cy.get(`[data-cy="editorConfig.approvers"]`).parent().should("contain", USERS[1].email);
      cy.get(`[data-cy="editorConfig.groups"]`).parent().should("contain", "Everyone");
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get(`[data-cy="fb-inline-approval-changed"]`).should("exist");
      cy.fbClickRemoveBtn({ label: "fb-inline-approval-changed" });
    });
  });
});

