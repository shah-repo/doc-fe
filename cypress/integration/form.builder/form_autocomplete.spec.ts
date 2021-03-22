// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
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
let createdPOFormDocument;
let formDocumentType;
let purchaseOrderDocumentType;
let createdPODocument;
let supplierDocumentType;
let maintenanceRecordDocumentType;
let createdMaintenanceRecordFormDocument;
let CSLDocumentType;
let createdLotsFormDocument;

const lotsTitle = "Lots document";
const lotsFormTitle = "Lots form document";
const equipmentNo = "ET-00003";
const equipmentTitle = "Equipment document";
const materialNo = "MT-00004";
const materialTitle = "Material document";
const partNo = "PRT-00005";
const partTitle = "Part document";
const poNo = "FM-00003";
const poTitle = "PO document";
const poApiNo = "PO-00001";
const poApiTitle = "API PO document";
const supplierNo = "SUP-00005";
const supplierTitle = "Supplier document";
const maintenanceNo = "FM-00004";
const maintenanceTitle = "Maintenance document";
const companyAddress = "test address1";
const code = "test code";
const approvalFormTitle = "Approval Form document";
const approvalTitle = "Approval document";
const approvalRoleName = "approval role 1";

context("Autocomplete test", () => {
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
            importerEmail: USERS[5].email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP-",
                group: "OTHER",
                isQms: true,
              },
              {
                documentTypeName: "Part",
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
              {
                documentTypeName: "Supplier",
                documentTypeAcronym: "SUP-",
                group: "SUPPLIER",
                isQms: true,
                needsSignature: true,
                category: "Suppliers",
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Material");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Part");
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Supplier");
          maintenanceRecordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Maintenance Record");
          CSLDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specifications Lot");
          done();
        });
      });
    });

    it("[API]Login Admin", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
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
                docId: equipmentNo,
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
              name: equipmentTitle,
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

    it("[API]Create materials document", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Materials document</p>",
          document: {
            docId: materialNo,
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
          name: materialTitle,
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

    it("[API]Create part document", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Part document</p>",
          document: {
            docId: partNo,
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
          name: partTitle,
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      });
    });

    it("[API]Create PO document", (done: any) => {
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
              description: "<p>PO Form document</p>",
              document: {
                docId: poNo,
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
              name: poTitle,
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: purchaseOrderDocumentType[0].id,
                }],
                schema: [{
                  index: 0,
                  type: "purchaseorder",
                  label: "PO",
                  name: "po-kdpqvhc7",
                  applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                }],
              },

            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdPOFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdPOFormDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => {
              cy.poAPICreatePO({
                payload: {
                  name: "",
                  attachments: [],
                  referenceTo: [],
                  formDocument: { id: createdPOFormDocument.id },
                  description: poApiTitle,
                  revisionChangeType: RevisionChangeType.NextRevision,
                  document: {
                    docId: poApiNo,
                    documentType: {
                      id: purchaseOrderDocumentType[0].id,
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
                  formInput: {
                    "po-kdpqvhc7": {
                      items: [{
                        id: "kdpr51z9",
                        type: "service",
                        date: (new Date()).toISOString(),
                        tax: false,
                        capitalEquipment: false,
                        isTraceabilityRequired: false,
                        description: "office cleaning",
                        serviceId: "cleaning",
                        units: "hours",
                        order: 5,
                        glCode: "code 1",
                        unitPrice: 30,
                        received: 0,
                        totalAmount: "150.00",
                        formattedDate: (new Date()).toLocaleDateString("en-US"),
                        index: 0,
                      }],
                      tax: "0.00",
                      subTotal: "150.00",
                      totalAmount: "150.00",
                      shippingCost: "0.00",
                      currency: "USD",
                      exchangeRate: 1,
                      totalInUSD: "150.00",
                      dateOfExchangeRate: "",
                    },
                  },
                },
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
              }).then((response) => {
                createdPODocument = response;
                cy.drAPIApproveAndRelease({
                  documentId: createdPODocument.id,
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
        });
      });
    });

    it("[API]Create Company Address & Acct codes", (done: any) => {
      cy.cmpUpdateCompany({
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId as unknown as string,
        payload: {
          acctCodes: [code],
          addresses: [companyAddress],
        },
      }).then(() => {
        done();
      });
    });

    it("[API]Create supplier document", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Supplier document</p>",
          document: {
            docId: supplierNo,
            documentType: {
              id: supplierDocumentType[0].id,
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
          name: supplierTitle,
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      });
    });

    it("[API]Create Maintenance record form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Maintenance form record</p>",
          document: {
            docId: maintenanceNo,
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
          name: maintenanceTitle,
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
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
              },
              {
                name: "equipment_id",
                type: "autocomplete",
                index: 1,
                label: "Equipment",
                rules: "required",
                optionId: "20",
                placeholder: "[Select revision here]",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
              },
              {
                name: "equipment_maintainer",
                type: "autocomplete",
                index: 2,
                label: "Maintainer",
                rules: "required",
                optionId: "13",
                placeholder: "[Select name here]",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
              },
              {
                name: "fb-requipment-maintenance-section",
                type: "textfield",
                index: 3,
                label: "Equipment Maintenance Section",
                rules: "required",
                hidden: true,
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
              },
              {
                label: "form.builder.approvals",
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-ki5yh7ba",
                uniqueSchemaItem: true,
                index: 4,
              },
            ],
          },

        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdMaintenanceRecordFormDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdMaintenanceRecordFormDocument.id,
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
          name: lotsFormTitle,
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
  });

  context("Create 'Lots' document", () => {
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
      cy.drEnterDocumentTitle({ name: lotsTitle });
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
      cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: true });
      cy.wait(5000);
    });

    it("Add an Approval'", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").eq(1).click();
      cy.get("input[name=\"password\"]").type("Tester1!");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove], () => {
        cy.get("[data-cy=\"common.confirm\"]").click();
      });
    });

    it("Logs user in & Selects company", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: "Tester1!",
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Create Approval roles", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title " + approvalFormTitle, () => {
      cy.drEnterDocumentTitle({ name: approvalFormTitle });
    });

    it("Enter document description 'Approval Roles description'", () => {
      cy.drEnterDocumentDescription({ description: "Approval Roles description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Document Approval Matrix' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Document Approval Matrix" });
    });

    it("Add Approval Matrix", () => {
      cy.fbAddNewField();
      cy.fbSelectItemFromNewFieldList({ field: "Approval Matrix" });
    });

    it("Click 'Add' button", () => {
      cy.fbAddNewFieldButton();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Click Save button", () => {
      cy.fbClickButton({ el: "DocumentRevisionForm-submit" });
    });

    it("Approve and release FORM document", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        // cy.fbClickButton({ el: "updateRecord" });
      });
    });

    it("Click on 'New' button", () => {
      cy.fbClickButton({ el: "PreviewControlsContainer-createNew" });
    });

    it("Enter AR title " + approvalTitle, () => {
      cy.drEnterDocumentTitle({ name: approvalTitle });
    });

    it("Enter description 'test description'", () => {
      cy.drEnterDocumentDescription({ description: "test description" });
    });

    it("Click on 'Add Another Role' button", () => {
      cy.get("button[data-cy=\"form.builder.add.another.role\"]").click();
    });

    it("Enter Approval Role " + approvalRoleName, () => {
      cy.get("[data-cy=\"name\"]").type(approvalRoleName);
    });

    it("Click on 'Add' button", () => {
      cy.get("button[data-cy=\"common.add\"]").click();
    });

    it("Click on 'Create Document' button", () => {
      cy.get("[id=\"DocumentRevisionForm-submit\"]").wait(3000).click();
    });

    it("Click 'Add Approver' & 'confirm' button", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Reload company", () => {
      cy.fbClickButton({ el: "UserMenuButton" });
      cy.get("#switchCompanyButton").click();
      cy.cmpSelectCompanyAlreadyLoggedIn({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Create FORM document", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'FORM document'", () => {
      cy.drEnterDocumentTitle({ name: "FORM document" });
    });

    it("Enter document description 'FORM document description'", () => {
      cy.drEnterDocumentDescription({ description: "FORM document description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Component Protocol' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
    });

    context("Add Autocomplete fields", () => {
      it("Select 'Document revisions'", () => {
        cy.fbAddAutocompleteElement({ name: "Document Revision", label: "doc-revision" });
      });

      it("Select 'Approval requests'", () => {
        cy.fbAddAutocompleteElement({ name: "Approval requests", label: "approval-request" });
      });

      it("Select 'Approvers'", () => {
        cy.fbAddAutocompleteElement({ name: "Approvers", label: "approvers" });
      });

      it("Select 'Document types'", () => {
        cy.fbAddAutocompleteElement({ name: "Document types", label: "doc-types" });
      });

      it("Select 'Supplier list'", () => {
        cy.fbAddAutocompleteElement({ name: "Supplier list", label: "supplier-list" });
      });

      it("Select 'TL numbers list'", () => {
        cy.fbAddAutocompleteElement({ name: "TL numbers list", label: "tl-numbers-list" });
      });

      it("Select 'Company addresses'", () => {
        cy.fbAddAutocompleteElement({ name: "Company addresses", label: "company-addresses" });
      });

      it("Select 'GL codes'", () => {
        cy.fbAddAutocompleteElement({ name: "GL codes", label: "gl-codes" });
      });

      it("Select 'Groups'", () => {
        cy.fbAddAutocompleteElement({ name: "Groups", label: "groups" });
      });

      it("Select 'Parts'", () => {
        cy.fbAddAutocompleteElement({ name: "Parts", label: "parts" });
      });

      it("Select 'Purchase Order list'", () => {
        cy.fbAddAutocompleteElement({ name: "Purchase Order list", label: "purchase-order-list" });
      });

      it("Select 'Employees'", () => {
        cy.fbAddAutocompleteElement({ name: "Employees", label: "employees" });
      });

      it("Select 'Official Groups'", () => {
        cy.fbAddAutocompleteElement({ name: "Official Groups", label: "official-groups" });
      });

      it("Select 'Part Number in WO'", () => {
        cy.fbAddAutocompleteElement({ name: "Part Number in WO", label: "part-number-wo" });
      });

      it("Select 'Document Revisions In Draft without Records'", () => {
        cy.fbAddAutocompleteElement({
          name: "Document Revisions In Draft without Records",
          label: "doc-revisions-draft",
        });
      });

      it("Select 'Approval Roles'", () => {
        cy.fbAddAutocompleteElement({ name: "Approval Roles", label: "approval-roles" });
      });

      it("Select 'Document revisions (all versions)'", () => {
        cy.fbAddAutocompleteElement({ name: "Document revisions (all versions)", label: "doc-revisions-all" });
      });

      it("Select 'Materials'", () => {
        cy.fbAddAutocompleteElement({ name: "Materials", label: "materials" });
      });

      it("Select 'Available Parts'", () => {
        cy.fbAddAutocompleteElement({ name: "Available Parts", label: "available-parts" });
      });

      it("Select 'Lots'", () => {
        cy.fbAddAutocompleteElement({ name: "Lots", label: "lots" });
      });

      it("Select 'Available Part Documents'", () => {
        cy.fbAddAutocompleteElement({ name: "Available Part Documents", label: "available-part-doc" });
      });

      it("Select 'CSL numbers list'", () => {
        cy.fbAddAutocompleteElement({ name: "CSL numbers list", label: "csl-numbers-list" });
      });

      it("Select 'Equipment'", () => {
        cy.fbAddAutocompleteElement({ name: "Equipment", label: "equipment" });
      });

      it("Select 'Preventative Maintenance Forms'", () => {
        cy.fbAddAutocompleteElement({
          name: "Preventative Maintenance Forms",
          label: "preventative-maintenance-forms",
        });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release FORM document", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          cy.fbClickButton({ el: "updateRecord" });
        });
      });
    });
  });

  context("Verify Autocomplete list", () => {
    it("Open Preview dialog", () => {
      cy.fbClickButton({ el: "FBWorkspace-clickView" });
    });

    it("Verify count of 'Document revisions' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "doc-revision", length: 12 });
    });

    it("Verify count of 'Approval requests' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "approval-request", length: 9 });
    });

    it("Verify count of 'Approvers' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "approvers", length: 5 });
      cy.get(".MuiAutocomplete-popper ul li").should("contain.text", `${USERS[1].name} - ${USERS[1].email}`);
      cy.get(".MuiAutocomplete-popper ul li").should("contain.text", `${USERS[2].name} - ${USERS[2].email}`);
      cy.get(".MuiAutocomplete-popper ul li").should("contain.text", `${USERS[3].name} - ${USERS[3].email}`);
      cy.get(".MuiAutocomplete-popper ul li").should("contain.text", `${USERS[4].name} - ${USERS[4].email}`);
      cy.get(".MuiAutocomplete-popper ul li").should("contain.text", `Importer Admin - ${USERS[5].email}`);
    });

    it("Verify count of 'Document types' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "doc-types", length: 28 });
    });

    it("Verify count of 'Supplier list' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "supplier-list", length: 1 });
      cy.get(".MuiAutocomplete-popper ul li").should("contain", supplierNo).and("contain", supplierTitle);
    });

    it("Verify count of 'TL numbers list' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "tl-numbers-list", length: 0 });
    });

    it("Verify count of 'Company addresses' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "company-addresses", length: 1 });
      cy.get(".MuiAutocomplete-popper ul li").should("contain", companyAddress);
    });

    it("Verify count of 'GL codes' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "gl-codes", length: 1 });
      cy.get(".MuiAutocomplete-popper ul li").should("contain", code);
    });

    it("Verify count of 'Groups' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "groups", length: 8 });
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "Owner as approver");
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "Everyone");
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "Can be approver");
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "Company Admin");
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "User Management");
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "Groups Management");
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "Groups Management Unofficial");
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "Developers");
    });

    it("Verify count of 'Parts' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "parts", length: 1 });
      cy.get(".MuiAutocomplete-popper ul li").should("contain", partNo);
    });

    it("Verify count of 'Purchase Order list' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "purchase-order-list", length: 1 });
      cy.get(".MuiAutocomplete-popper ul li").should("contain", poApiNo);
    });

    it("Verify count of 'Employees' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "employees", length: 5 });
      cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[1].name);
      cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[2].name);
      cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[3].name);
      cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[4].name);
      cy.get(".MuiAutocomplete-popper ul li").should("contain.text", "Importer Admin");
    });

    it("Verify count of 'Official Groups' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "official-groups", length: 8 });
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "Owner as approver");
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "Everyone");
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "Can be approver");
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "Company Admin");
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "User Management");
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "Groups Management");
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "Groups Management Unofficial");
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "Developers");
    });

    it("Verify count of 'Part Number in WO' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "part-number-wo", length: 1 });
      cy.get(".MuiAutocomplete-popper ul li").should("contain", partNo).and("contain", partTitle);
    });

    it("Verify count of 'Document Revisions In Draft without Records' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "doc-revisions-draft", length: 2 });
      cy.get(".MuiAutocomplete-popper ul li").should("contain", supplierNo).and("contain", supplierTitle);
      cy.get(".MuiAutocomplete-popper ul li").should("contain", partNo).and("contain", partTitle);
    });

    it("Verify count of 'Approval Roles' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "approval-roles", length: 1 });
      cy.get(".MuiAutocomplete-popper ul li").should("contain", approvalRoleName);
    });

    it("Verify count of 'Document revisions (all versions)' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "doc-revisions-all", length: 12 });
    });

    it("Verify count of 'Materials' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "materials", length: 2 });
      cy.get(".MuiAutocomplete-popper ul li").should("contain", partNo).and("contain", partTitle);
      cy.get(".MuiAutocomplete-popper ul li").should("contain", materialNo).and("contain", materialTitle);
    });

    it("Verify count of 'Available Parts' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "available-parts", length: 1 });
      cy.get(".MuiAutocomplete-popper ul li").should("contain", partNo).and("contain", partTitle);
    });

    it("Verify count of 'Lots' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "lots", length: 1 });
      cy.get(".MuiAutocomplete-popper ul li").should("contain", lotsTitle);
    });

    it("Verify count of 'Available Part Documents' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "available-part-doc", length: 1 });
      cy.get(".MuiAutocomplete-popper ul li").should("contain", partNo).and("contain", partTitle);
    });

    it("Verify count of 'CSL numbers list' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "csl-numbers-list", length: 0 });
    });

    it("Verify count of 'Equipment' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "equipment", length: 1 });
      cy.get(".MuiAutocomplete-popper ul li").should("contain", equipmentNo).and("contain", equipmentTitle);
    });

    it("Verify count of 'Preventative Maintenance Forms' in the list", () => {
      cy.fbVerifyAutocompleteElementLength({ el: "preventative-maintenance-forms", length: 1 });
      cy.get(".MuiAutocomplete-popper ul li").should("contain", maintenanceNo).and("contain", maintenanceTitle);
    });
  });
});
