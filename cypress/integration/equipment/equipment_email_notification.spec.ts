// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import faker from "faker";
import moment from "moment";
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { USERS } from "../../utils/constants/users";

const ADMIN_USER = USERS[25];
const FIRST_USER = USERS[26];
const SECOND_USER = USERS[27];
const THIRD_USER = USERS[28];
const IMPORTER_USER = USERS[29];
const CAL_DUE_DATE = moment().tz("America/Los_Angeles")
  .add(5, "days")
  .format("l");
const PM_DUE_DATE = moment().tz("America/Los_Angeles")
  .add(10, "days")
  .format("l");

let createdCompany;
let loginResponse;
let adminEmployeeLoginResponse;
let multipleCompanies;
let adminEmployee;
let equipmentDocumentType;
let formDocumentType;
let maintenanceRecordDocumentType;
let approvalRequestDocumentType;
let initialArDocument;
let createdEquipmentFormDocument;
let secondCreatedEquipmentFormDocument;
let createdMaintenanceRecordFormDocument;
let createdARForEquipNoOwnerCoordinator;
let firstEmployee;
let createdSecondEquipmentDocID;
let createdMaintenanceRecord;
let approvalForFirstEquipment;
let group;

context("Test Equipment maintenance email notifications", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  context("[API] Prepare company", () => {
    it("[API] Creates company", (done: any) => {
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response) => {
        adminEmployeeLoginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: ADMIN_USER.email,
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: IMPORTER_USER.email,
            numOfRevStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [FIRST_USER, SECOND_USER, THIRD_USER],
            documentTypes: [],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          firstEmployee = createdCompany.employees.find((employee) => employee.user.email === FIRST_USER.email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          maintenanceRecordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Maintenance Record");
          done();
        });
      });
    });

    it("[API] Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: ADMIN_USER.email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    it("Trigger email script", () => {
      cy.triggerDueDateEmailScript({
        sessionId: adminEmployeeLoginResponse.sessionId,
        currentDate: moment().tz("America/Los_Angeles").toISOString(),
      });
      cy.wait(10000);
    });

    it("[API] Create Equipment form", (done: any) => {
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
              description: "<p>First Equipment form</p>",
              document: {
                docId: "FM-00003",
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
              name: "First Equipment form document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: equipmentDocumentType[0].id,
                }],
                schema: [
                  {
                    name: "fb-default-eq-status",
                    type: "radiogroup",
                    index: 0,
                    label: "EQ Status",
                    rules: "required",
                    options: [
                      {
                        text: "Active",
                        value: "Active",
                      },
                      {
                        text: "Inactive",
                        value: "Inactive",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    deleteInFormDisabled: true,
                  },
                  {
                    name: "fb-primary-owner-eq",
                    type: "autocomplete",
                    index: 1,
                    label: "Primary Owner",
                    optionId: "13",
                    placeholder: "Select employee as primary owner",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Primary Owner",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "fb-coordinator-eq",
                    type: "autocomplete",
                    index: 2,
                    label: "Coordinator",
                    optionId: "13",
                    placeholder: "Select employee as coordinator",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Coordinator",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    index: 3,
                    type: "eqmaintenance",
                    name: "pm-ki5wtk5l",
                    editorConfig: {
                      fields: [],
                      type: "preventativeMaintenance",
                    },
                    editorProperties: [],
                    label: "Preventative Maintenance",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "PM",
                  },
                  {
                    index: 4,
                    type: "eqmaintenance",
                    name: "pm-ki5wtk5p",
                    editorConfig: {
                      fields: [],
                      type: "preventativeMaintenance",
                    },
                    editorProperties: [],
                    label: "DONE Preventative Maintenance",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "PM",
                  },
                  {
                    index: 5,
                    type: "eqmaintenance",
                    name: "calibration-ki5wtyj0",
                    editorConfig: {
                      fields: [],
                      type: "calibration",
                    },
                    editorProperties: [],
                    label: "Calibration",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "Calibration",
                  },
                  {
                    index: 6,
                    type: "eqmaintenance",
                    name: "calibration-ki5wtyjl",
                    editorConfig: {
                      fields: [],
                      type: "calibration",
                    },
                    editorProperties: [],
                    label: "Calibration",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "Calibration",
                  },
                ],
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
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
        });
      });
    });

    it("[API] Create second Equipment form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Second Equipment form</p>",
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
          name: "Second Equipment form document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: equipmentDocumentType[0].id,
            }],
            schema: [
              {
                name: "fb-default-eq-status",
                type: "radiogroup",
                index: 0,
                label: "EQ Status",
                rules: "required",
                options: [
                  {
                    text: "Active",
                    value: "Active",
                  },
                  {
                    text: "Inactive",
                    value: "Inactive",
                  },
                ],
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "fb-primary-owner-eq",
                type: "autocomplete",
                index: 1,
                label: "Primary Owner",
                optionId: "13",
                placeholder: "Select employee as primary owner",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationAttribute: "Primary Owner",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "fb-coordinator-eq",
                type: "autocomplete",
                index: 2,
                label: "Coordinator",
                optionId: "13",
                placeholder: "Select employee as coordinator",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationAttribute: "Coordinator",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                index: 3,
                type: "eqmaintenance",
                name: "pm-ki5wtk5q",
                editorConfig: {
                  fields: [],
                  type: "preventativeMaintenance",
                },
                editorProperties: [],
                label: "Preventative Maintenance",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                applicableValidationSchema: true,
                validationAttribute: "PM",
              },
            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        secondCreatedEquipmentFormDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: secondCreatedEquipmentFormDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("[API] Create Maintenance record form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Maintenance form record</p>",
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
          name: "Maintenance record form",
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
                deleteInFormDisabled: true,
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
                deleteInFormDisabled: true,
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
                deleteInFormDisabled: true,
              },
              {
                name: "fb-equipment_due_date",
                type: "datepicker",
                index: 3,
                label: "Completion Date",
                rules: "required",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "fb-requipment-maintenance-section",
                type: "textfield",
                index: 4,
                label: "Equipment Maintenance Section",
                rules: "required",
                hidden: true,
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                deleteInFormDisabled: true,
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
        createdMaintenanceRecordFormDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdMaintenanceRecordFormDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: ADMIN_USER.email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Test notification with no Primary owner and coordinator", () => {
    context("Create equipment maintenace document", () => {
      it("Navigate to document list", () => {
        cy.navigToEquipment();
      });

      it("Click 'ADD NEW EQUIPMENT' with second form", () => {
        cy.equipSelectRecordFormFromMultiSelect({
          recordType: "Equipment",
          recordForm: "Second Equipment form document",
        });
      });

      it("Enter title 'Equipment maintenance document'", () => {
        cy.drEnterDocumentTitle({ name: "Equipment maintenance document" });
      });

      it("Enter description 'Equipment maintenance'", () => {
        cy.drEnterDocumentDescription({ description: "Equipment maintenance" });
      });

      it("Select 'Active' as EQ status", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetDocAggregatedAudit, () => {
          cy.get("input[name=fb-default-eq-status][value=Active]").check();
        });
      });

      it("Select document 'Yes' for preventative maintenance required", () => {
        cy.get("[value=\"Yes\"]").eq(0).click();
      });

      it("Select 'Maintenance record form' for preventative maintenance required", () => {
        cy.get("[data-cy*=\"preventativeForm\"]").eq(0).click();
        cy.get("ul>li[role=\"option\"]").contains("Maintenance record form").click();
      });

      it("Select preventative maintenance frequency", () => {
        cy.get("[name*=\"frequency\"]").eq(0).type("16");
      });

      it("Type preventative maintenance instruction", () => {
        cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy, \"pm\")]/../div[2]")
          .type("Instructions for preventative maintenance");
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Create equipment maintenace document", () => {
      it("Navigate to document list", () => {
        cy.navigToEquipment();
      });

      it("Click 'ADD NEW EQUIPMENT' with second form", () => {
        cy.equipSelectRecordFormFromMultiSelect({
          recordType: "Equipment",
          recordForm: "Second Equipment form document",
        });
      });

      it("Enter title 'Equipment maintenance document'", () => {
        cy.drEnterDocumentTitle({ name: "Equipment maintenance document" });
      });

      it("Enter description 'Equipment maintenance'", () => {
        cy.drEnterDocumentDescription({ description: "Equipment maintenance" });
      });

      it("Select 'Active' as EQ status", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetDocAggregatedAudit, () => {
          cy.get("input[name=fb-default-eq-status][value=Active]").check();
        });
      });

      it(`Select "${ADMIN_USER.name}" as Primary Owner`, () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetDocAggregatedAudit, () => {
          cy.get("[name=fb-primary-owner-eq]").click();
          cy.get("ul[role=listbox]>li").contains(ADMIN_USER.name).click();
        });
      });

      it(`Select "${FIRST_USER.name}" as Coordinator`, () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetDocAggregatedAudit, () => {
          cy.get("[name=fb-coordinator-eq]").click();
          cy.get("ul[role=listbox]>li").contains(FIRST_USER.name).click();
        });
      });

      it("Select document 'Yes' for preventative maintenance required", () => {
        cy.get("[value=\"Yes\"]").eq(0).click();
      });

      it("Select 'Maintenance record form' for preventative maintenance required", () => {
        cy.get("[data-cy*=\"preventativeForm\"]").eq(0).click();
        cy.get("ul>li[role=\"option\"]").contains("Maintenance record form").click();
      });

      it("Select preventative maintenance frequency", () => {
        cy.get("[name*=\"frequency\"]").eq(0).type("16");
      });

      it("Type preventative maintenance instruction", () => {
        cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy, \"pm\")]/../div[2]")
          .type("Instructions for preventative maintenance");
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Release equipment doc with no primary owner and coordinator", () => {
      it("[API] Approve and release", (done: any) => {
        cy.url().then((url: any) => {
          createdSecondEquipmentDocID = url.split("/").pop();
          cy.arCreateApprovalRequest({
            payload: {
              title: "For first equipment",
              description: "Approval for equipment with no primary owner and coordinator",
              documentType: { id: approvalRequestDocumentType[0].id },
              formDocument: { id: initialArDocument[0].id },
              formInput: {
                documentRevisions: [{
                  proposedDocumentRevision: { id: createdSecondEquipmentDocID },
                  descriptionOfChange: "ar test",
                  justificationOfChange: "ar test",
                  id: faker.random.uuid(),
                }],
                approvers: [{
                  id: adminEmployee.id,
                }],
              },
            },
            employeeId: adminEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then((response) => {
            createdARForEquipNoOwnerCoordinator = response;
            cy.arInReview({
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
              arID: createdARForEquipNoOwnerCoordinator.id,
            }).then(() => {
              cy.arApprove({
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
                arID: createdARForEquipNoOwnerCoordinator.id,
              }).then(() => {
                cy.arClose({
                  employeeId: adminEmployee.id,
                  sessionId: loginResponse.sessionId,
                  arID: createdARForEquipNoOwnerCoordinator.id,
                }).then(() => {
                  done();
                });
              });
            });
          });
        });
      });

      it("Reload Equipment document", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.EmployeesGet], () => {
          cy.reload();
        });
      });

      it("Verify status is 'Released'", () => {
        cy.drCheckDocumentStatus({ status: "Released" });
      });
    });

    context("Create maintenance record for equipment with no primary owner and coordinator", () => {
      it("[API] Create maintenance record", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Maintenance record for equipment with no primary owner and coordinator</p>",
            document: {
              docId: "MR-00001",
              documentType: {
                id: maintenanceRecordDocumentType[0].id,
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
            name: "MR for EQ with no primary owner and coordinator",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formDocument: {
              id: createdMaintenanceRecordFormDocument.id,
            },
            formInput: {
              "equipment_id": createdSecondEquipmentDocID,
              "fb-approvals-fb-approvals-ki5yh7ba": [adminEmployee.id],
              "equipment_maintainer": firstEmployee.id,
              "fb-equipment_due_date": moment().tz("America/Los_Angeles").toISOString(),
            },
            parentEquipment: {
              id: createdSecondEquipmentDocID,
            },
            equipmentSection: "pm-ki5wtk5q",
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdMaintenanceRecord = response;
          cy.approvals({
            assignedEmployeeId: adminEmployee.id,
            fieldId: "fb-approvals-ki5yh7ba",
            recordId: createdMaintenanceRecord.id,
            employeeId: adminEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then((response) => {
            approvalForFirstEquipment = response;
            cy.approvalSubmitForApproval({
              docRevId: createdMaintenanceRecord.id,
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => {
              cy.approvalApprove({
                approvalsId: approvalForFirstEquipment.id,
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
              }).then(() => done());
            });
          });
        });
      });

      it("Reload Equipment document ", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.EmployeesGet], () => {
          cy.reload();
        });
      });

      it("Verify maintenance record is present", () => {
        cy.xpath("//div[@data-cy=\"form.builder.maintenance.history\"]/../..")
          .eq(0)
          .contains("MR-00001 - MR for EQ with no primary owner and coordinator");
      });
    });

    context("Trigger script and verify email is not received", () => {
      it("Trigger email script", () => {
        cy.triggerDueDateEmailScript({
          sessionId: adminEmployeeLoginResponse.sessionId,
          currentDate: moment().tz("America/Los_Angeles").toISOString(),
        });
        cy.wait(10000);
      });

      it("Verify email is not received for EQ-00001", () => {
        cy.imapVerifyLastEmailIsNot({ userEmail: ADMIN_USER.email, documentId: "EQ-00001" });
        cy.imapVerifyLastEmailIsNot({ userEmail: FIRST_USER.email, documentId: "EQ-00001" });
      });
    });
  });

  // context("Create equipment maintenace document", () => {
  //   it("Navigate to document list", () => {
  //     cy.navigToEquipment();
  //   });

  //   it("Click 'ADD NEW EQUIPMENT' with new form", () => {
  //     cy.equipSelectRecordFormFromMultiSelect({
  //       recordType: "Equipment",
  //       recordForm: "First Equipment form document",
  //     });
  //   });

  //   it("Enter title 'Equipment maintenance document'", () => {
  //     cy.drEnterDocumentTitle({ name: "Equipment maintenance document" });
  //   });

  //   it("Enter description 'Equipment maintenance'", () => {
  //     cy.drEnterDocumentDescription({ description: "Equipment maintenance" });
  //   });

  //   it("Select 'Active' as EQ status", () => {
  //     cy.wrapWithWaitOnApiCall(CyRoutes.GetDocAggregatedAudit, () => {
  //       cy.get("input[name=fb-default-eq-status][value=Active]").check();
  //     });
  //   });

  //   it(`Select "${ADMIN_USER.name}" as Primary Owner`, () => {
  //     cy.wrapWithWaitOnApiCall(CyRoutes.GetDocAggregatedAudit, () => {
  //       cy.get("[name=fb-primary-owner-eq]").click();
  //       cy.get("ul[role=listbox]>li").contains(ADMIN_USER.name).click();
  //     });
  //   });

  //   it(`Select "${FIRST_USER.name}" as Coordinator`, () => {
  //     cy.wrapWithWaitOnApiCall(CyRoutes.GetDocAggregatedAudit, () => {
  //       cy.get("[name=fb-coordinator-eq]").click();
  //       cy.get("ul[role=listbox]>li").contains(FIRST_USER.name).click();
  //     });
  //   });

  //   it("Select document 'Yes' for preventative maintenance required", () => {
  //     cy.get("[value=\"Yes\"]").eq(0).click();
  //   });

  //   it("Select 'Maintenance record form' for preventative maintenance required", () => {
  //     cy.get("[data-cy*=\"preventativeForm\"]").eq(0).click();
  //     cy.get("ul>li[role=\"option\"]").contains("Maintenance record form").click();
  //   });

  //   it("Select preventative maintenance frequency", () => {
  //     cy.get("[name*=\"frequency\"]").eq(0).type("10");
  //   });

  //   it("Type preventative maintenance instruction", () => {
  //     cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy, \"pm\")]/../div[2]")
  //       .type("Instructions for preventative maintenance");
  //   });

  //   it("Select document 'Yes' for calibration required", () => {
  //     cy.get("[value=\"Yes\"]").eq(1).click();
  //   });

  //   it("Select 'Maintenance record form' for calibration required", () => {
  //     cy.get("[data-cy*=\"preventativeForm\"]").eq(1).click();
  //     cy.get("ul>li[role=\"option\"]").contains("Maintenance record form").click();
  //   });

  //   it("Select calibration frequency", () => {
  //     cy.get("[name*=\"frequency\"]").eq(1).type("5");
  //   });

  //   it("Type preventative maintenance instruction", () => {
  //     cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy,\"calibration\")]/../div[2]")
  //       .type("Instructions for calibration");
  //   });

  //   it("Select document 'Yes' for done preventative maintenance required", () => {
  //     cy.get("[value=\"Yes\"]").eq(2).click();
  //   });

  //   it("Select 'Maintenance record form' for preventative maintenance required", () => {
  //     cy.get("[data-cy*=\"preventativeForm\"]").eq(2).click();
  //     cy.get("ul>li[role=\"option\"]").contains("Maintenance record form").click();
  //   });

  //   it("Select preventative maintenance frequency", () => {
  //     cy.get("[name*=\"frequency\"]").eq(2).type("1");
  //   });

  //   it("Type done preventative maintenance instruction", () => {
  //     cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy, \"pm\")]/../div[2]")
  //       .eq(1)
  //       .type("Instructions for DONE preventative maintenance");
  //   });

  //   it("Save document", () => {
  //     cy.drClickCreateDocumentWithApiCallForForms();
  //   });

  //   context("Approve and release equipment maintenance document", () => {
  //     it("Navigate to approval request list", () => {
  //       cy.navigToApprovalRequestList();
  //     });

  //     it("Click Create a Approval Request button", () => {
  //       cy.cmpClickCreateApprovalRequest();
  //     });

  //     it("Enter title AR title: ", () => {
  //       cy.arEnterApprovalRequestTitle({ title: "Approval request for equipment document" });
  //     });

  //     it("Enter description 'AR from New form template for approval request'", () => {
  //       cy.arEnterApprovalRequestDescription({ description: "equipment document AR" });
  //     });

  //     it("Add created document revision", () => {
  //       cy.arClickAddDocument().wait(500);
  //       cy.arChoseSpecificProposedDocument({ name: "EQ-00001" });
  //       cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
  //       cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
  //       cy.arClickAddBtnOnAddDocumentsDialog();
  //     });

  //     it("Add first approver to approval request on approver list", () => {
  //       cy.arAddApproverOnApproverList({ approver: ADMIN_USER.email });
  //     });

  //     it("Click Create Approval Request", () => {
  //       cy.arClickCreateApprovalRequestAfterCompletingForm();
  //     });

  //     it("Click 'Send To Review'", () => {
  //       cy.arClickSendToReview();
  //     });

  //     it("Verify AR status is 'In Review'", () => {
  //       cy.arVerifyStatus({ status: "In Review" });
  //     });

  //     it("Approve AR", () => {
  //       cy.arApproveAR();
  //     });

  //     it("Check approval request status is 'Approved'", () => {
  //       cy.arVerifyStatus({ status: "Approved" });
  //     });

  //     it("Close AR", () => {
  //       cy.arCloseAR();
  //     });

  //     it("Check approval request status is 'Closed'", () => {
  //       cy.arVerifyStatus({ status: "Closed" });
  //     });

  //     context("Navig to released 'Equipment maintenance document'", () => {
  //       it("Navig to equipment", () => {
  //         cy.navigToEquipment();
  //       });

  //       it("Select 'Equipment maintenance document'", () => {
  //         cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.DocPreview, CyRoutes.EmployeesGet], () => {
  //           cy.get("div.ReactVirtualized__Table__rowColumn").first().click();
  //         });
  //       });
  //     });
  //   });
  // });

  // context("Fill new preventative maintenance form", () => {
  //   it("Click 'NEW PM' on preventative maintenace section", () => {
  //     cy.url().then((url: any) => {
  //       const docIdFromUrl = url.split("/").pop();
  //       // eslint-disable-next-line max-len
  //       const newPMUrl = `${CONFIG.FE_URL}/document_revision/${createdMaintenanceRecordFormDocument.id}/create_maintenance/${docIdFromUrl}/pm-ki5wtk5l`;
  //       cy.wrapWithWaitOnApiCalls([CyRoutes.GroupsGet, CyRoutes.GetAvailableApprovers], () => {
  //         cy.visit(newPMUrl);
  //       });
  //     });
  //   });

  //   it("Enter title 'Preventative maintenance document'", () => {
  //     cy.drEnterDocumentTitle({ name: "Preventative maintenance document" });
  //   });

  //   it("Select document type 'Maintenance Record'", () => {
  //     cy.drSelectDocumentType({ documentType: "Maintenance Record" });
  //   });

  //   it("Select revision stage 'Numeric'", () => {
  //     cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
  //   });

  //   it(`Select maintainer '${ADMIN_USER.name}'`, () => {
  //     cy.get("[data-cy=\"equipment_maintainer\"]").click();
  //     cy.get("ul>li[role=\"option\"]").contains(ADMIN_USER.name).click();
  //   });

  //   it("Fill 'Completion Date'", () => {
  //     cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").click();
  //     cy.wait(500);
  //     cy.get("button.MuiPickersDay-current").click();
  //     cy.wait(500);
  //   });

  //   it("Create 'Preventative maintenance document'", () => {
  //     cy.drClickCreateDocumentWithApiCall();
  //   });

  //   it("Add an Approval'", () => {
  //     cy.pmAddApproverOnApproverList({ approver: ADMIN_USER.name });
  //   });

  //   it("Submit for approval", () => {
  //     cy.pmSubmitForApproval();
  //   });

  //   it("Approve record", () => {
  //     cy.ebApprove();
  //   });

  //   it("Verify status is 'Released'", () => {
  //     cy.drCheckDocumentStatus({ status: "Released" });
  //   });
  // });

  // context("Check equipment maintenance history on equipment maintenance document", () => {
  //   it("Navig to equipment", () => {
  //     cy.navigToEquipment();
  //   });

  //   it("Select 'Equipment maintenance document'", () => {
  //     cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.DocPreview, CyRoutes.EmployeesGet], () => {
  //       cy.get("div.ReactVirtualized__Table__rowColumn").first().click();
  //     });
  //     cy.wait(5000);
  //   });

  //   it("Check preventative maintenance document existance", () => {
  //     cy.xpath("//div[@data-cy=\"form.builder.maintenance.history\"]/../..")
  //       .eq(0)
  //       .contains("MR-00001 - Preventative maintenance document");
  //   });

  //   it("Check preventative maintenance status is in complience for next 10 days", () => {
  //     const prevMaintenanceComplianceDate = moment().tz("America/Los_Angeles")
  //       .add(10, "days")
  //       .format("ddd MMMM D YYYY");
  //     cy.get("[data-cy=\"maintenance.status\"]")
  //       .eq(0)
  //       .contains(`PM Done - Due Date: ${prevMaintenanceComplianceDate}`);
  //   });
  // });

  // context("Fill new calbration form", () => {
  //   it("Click 'NEW PM' on calibration section", () => {
  //     cy.url().then((url: any) => {
  //       const docIdFromUrl = url.split("/").pop();
  //       // eslint-disable-next-line max-len
  //       const newPMUrl = `${CONFIG.FE_URL}/document_revision/${createdMaintenanceRecordFormDocument.id}/create_maintenance/${docIdFromUrl}/calibration-ki5wtyj0`;
  //       cy.wrapWithWaitOnApiCalls([CyRoutes.GroupsGet, CyRoutes.GetAvailableApprovers], () => {
  //         cy.visit(newPMUrl);
  //       });
  //     });
  //   });

  //   it("Enter title 'Calibration document'", () => {
  //     cy.drEnterDocumentTitle({ name: "Calibration document" });
  //   });

  //   it("Select document type 'Maintenance Record'", () => {
  //     cy.drSelectDocumentType({ documentType: "Maintenance Record" });
  //   });

  //   it("Select revision stage 'Numeric'", () => {
  //     cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
  //   });

  //   it(`Select maintainer '${ADMIN_USER.name}'`, () => {
  //     cy.get("[data-cy=\"equipment_maintainer\"]").click();
  //     cy.get("ul>li[role=\"option\"]").contains(ADMIN_USER.name).click();
  //   });

  //   it("Fill 'Completion Date'", () => {
  //     cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").click();
  //     cy.wait(500);
  //     cy.get("button.MuiPickersDay-current").click();
  //     cy.wait(500);
  //   });

  //   it("Create 'Calibration document'", () => {
  //     cy.drClickCreateDocumentWithApiCall();
  //   });

  //   it("Add an Approval", () => {
  //     cy.pmAddApproverOnApproverList({ approver: ADMIN_USER.name });
  //   });

  //   it("Submit for approval", () => {
  //     cy.pmSubmitForApproval();
  //   });

  //   it("Approve record", () => {
  //     cy.ebApprove();
  //   });

  //   it("Verify status is 'Released'", () => {
  //     cy.drCheckDocumentStatus({ status: "Released" });
  //   });
  // });

  // context("Check equipment calibration history on maintenance document", () => {
  //   it("Navig to Equipment", () => {
  //     cy.navigToDashboard();
  //     cy.navigToEquipment();
  //   });

  //   it("Verify 'CAL DUE DATE'", () => {
  //     cy.get("div[aria-rowindex=\"1\"]>div:nth-child(6)").should("contain.text", CAL_DUE_DATE);
  //   });

  //   it("Verify 'PM DUE DATE'", () => {
  //     cy.get("div[aria-rowindex=\"1\"]>div:nth-child(7)").should("contain.text", PM_DUE_DATE);
  //   });

  //   it("Select 'Equipment maintenance document'", () => {
  //     cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.DocPreview, CyRoutes.EmployeesGet], () => {
  //       cy.get("div.ReactVirtualized__Table__rowColumn").first().click();
  //     });
  //     cy.wait(5000);
  //   });

  //   it("Check Calibration document existance", () => {
  //     cy.xpath("//div[@data-cy=\"form.builder.maintenance.history\"]/../..")
  //       .eq(1)
  //       .contains("MR-00002 - Calibration document");
  //   });

  //   it("Check calibration status is in complience for next 5 days", () => {
  //     const calibrationComplianceDate = moment().tz("America/Los_Angeles")
  //       .add(5, "days")
  //       .format("ddd MMMM D YYYY");
  //     cy.get("[data-cy=\"maintenance.status\"]")
  //       .eq(1)
  //       .contains(`CAL Done - Due Date: ${calibrationComplianceDate}`);
  //   });

  //   it("Verify status is 'Released'", () => {
  //     cy.drCheckDocumentStatus({ status: "Released" });
  //   });

  //   it("Trigger email script", () => {
  //     cy.triggerDueDateEmailScript({
  //       sessionId: adminEmployeeLoginResponse,
  //       currentDate: moment().tz("America/Los_Angeles").toString(),
  //     });
  //   });
  // });
});
