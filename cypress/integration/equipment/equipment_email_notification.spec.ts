/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import faker from "faker";
import moment from "moment";
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { IMAPEmail } from "../../support/commands/imap/imap";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

const ADMIN_USER = USERS[25];
const FIRST_USER = USERS[26];
const SECOND_USER = USERS[27];
const THIRD_USER = USERS[28];

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
let createdMaintenanceRecordFormDocument;
let createdARForEquipNoOwnerCoordinator;
let firstEmployee;
let createdSecondEquipmentDocID;
let createdMaintenanceRecord;
let approvalForFirstEquipment;
let group;
let emailsFromInbox: IMAPEmail[];
let companyId: string;

const dateOffset = (5 * 1000);
const dateAfterEmailShouldArrive = new Date();
dateAfterEmailShouldArrive.setTime(dateAfterEmailShouldArrive.getTime() - dateOffset);

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
          companyId = createdCompany.id;
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
              description: "<p>Equipment form</p>",
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
              name: "Equipment form document",
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
            }).then(() => done());
          });
        });
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
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
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
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigate to equipment list", () => {
        cy.navigToEquipment();
      });

      it("Click 'ADD NEW EQUIPMENT'", () => {
        cy.equipClickCreateNew();
      });

      it("Enter title 'Equipment maintenance document'", () => {
        cy.drEnterDocumentTitle({ name: "Equipment maintenance document" });
      });

      it("Enter description 'Equipment maintenance'", () => {
        cy.drEnterDocumentDescription({ description: "Equipment maintenance" });
        cy.wait(5000);
      });

      it("Select 'Active' as EQ status", () => {
        cy.get("input[name=fb-default-eq-status][value=Active]").check();
      });

      it("Select document 'Yes' for preventative maintenance required", () => {
        cy.get("[value=\"Yes\"]").eq(0).click();
      });

      it("Select 'Maintenance record form' for preventative maintenance required", () => {
        cy.get("[data-cy*=\"preventativeForm\"]").eq(0).click();
        cy.get("ul>li[role=\"option\"]").contains("Maintenance record form").click();
      });

      it("Enter preventative maintenance frequency", () => {
        cy.get("[name*=\"frequency\"]").eq(0).type("16");
      });

      it("Type preventative maintenance instruction", () => {
        cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy, \"pm\")]/../div[2]")
          .type("Instructions for preventative maintenance");
      });

      it("Save document", () => {
        cy.unClick();
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
                approvers: [
                  {
                    approver: {
                      id: adminEmployee.id,
                    },
                    signatureGroupId: {
                      id: null,
                    },
                  },
                ],
              },
            },
            employeeId: adminEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then((response) => {
            createdARForEquipNoOwnerCoordinator = response;
            cy.arPatchAR({
              payload: {
                formInput: {
                  documentRevisions: [{
                    proposedDocumentRevision: { id: createdSecondEquipmentDocID },
                    descriptionOfChange: "ar test",
                    justificationOfChange: "ar test",
                    id: faker.random.uuid(),
                  }],
                  approvers: [
                    {
                      approver: {
                        id: adminEmployee.id,
                      },
                      signatureGroupId: {
                        id: null,
                      },
                    },
                  ],
                },
              },
              arID: createdARForEquipNoOwnerCoordinator.id,
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => {
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
      });

      it("Reload Equipment document", () => {
        cy.equipReloadDocument();
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
        cy.equipReloadDocument();
      });

      it("Verify maintenance record is present", () => {
        cy.xpath("//div[@data-cy=\"form.builder.maintenance.history\"]/../..")
          .eq(0)
          .contains("MR-00001 - MR for EQ with no primary owner and coordinator");
      });
    });
  });

  context("Test notification with maintenance due date in 4 days", () => {
    context("Create equipment maintenace document", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigate to equipment list", () => {
        cy.navigToEquipment();
      });

      it("Click 'ADD NEW EQUIPMENT'", () => {
        cy.equipClickCreateNew();
      });

      it("Equipment maintenance document due date in 4 days'", () => {
        cy.drEnterDocumentTitle({ name: "Equipment maintenance document due date in 4 days" });
      });

      it("Enter description 'Equipment maintenance'", () => {
        cy.drEnterDocumentDescription({ description: "Equipment maintenance" });
      });

      it("Select 'Active' as EQ status", () => {
        cy.get("input[name=fb-default-eq-status][value=Active]").check();
      });

      it(`Select "${ADMIN_USER.name}" as Primary Owner`, () => {
        cy.get("[name=fb-primary-owner-eq]").click();
        cy.get("ul[role=listbox]>li").contains(ADMIN_USER.name).click();
      });

      it(`Select "${FIRST_USER.name}" as Coordinator`, () => {
        cy.get("[name=fb-coordinator-eq]").click();
        cy.get("ul[role=listbox]>li").contains(FIRST_USER.name).click();
      });

      it("Select document 'Yes' for preventative maintenance required", () => {
        cy.get("[value=\"Yes\"]").eq(0).click();
      });

      it("Select 'Maintenance record form' for preventative maintenance required", () => {
        cy.get("[data-cy*=\"preventativeForm\"]").eq(0).click();
        cy.get("ul>li[role=\"option\"]").contains("Maintenance record form").click();
      });

      it("Enter preventative maintenance frequency", () => {
        cy.get("[name*=\"frequency\"]").eq(0).type("4");
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
              description: "Approval for equipment due in 4 days",
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
            cy.arPatchAR({
              payload: {
                formInput: {
                  documentRevisions: [{
                    proposedDocumentRevision: { id: createdSecondEquipmentDocID },
                    descriptionOfChange: "ar test",
                    justificationOfChange: "ar test",
                    id: faker.random.uuid(),
                  }],
                  approvers: [
                    {
                      approver: {
                        id: adminEmployee.id,
                      },
                      signatureGroupId: {
                        id: null,
                      },
                    },
                  ],
                },
              },
              arID: createdARForEquipNoOwnerCoordinator.id,
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => {
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
      });

      it("Reload Equipment document", () => {
        cy.equipReloadDocument();
      });

      it("Verify status is 'Released'", () => {
        cy.drCheckDocumentStatus({ status: "Released" });
      });
    });

    context("Create maintenance record for equipment with due date in 4 days", () => {
      it("[API] Create maintenance record", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>MR for EQ with maintenance in 4 days</p>",
            document: {
              docId: "MR-00002",
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
            name: "MR for EQ with maintenance in 4 days",
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
        cy.equipReloadDocument();
      });

      it("Verify maintenance record is present", () => {
        cy.xpath("//div[@data-cy=\"form.builder.maintenance.history\"]/../..")
          .eq(0)
          .contains("MR-00002 - MR for EQ with maintenance in 4 days");
      });
    });
  });

  context("Test notification with maintenance due date in 17 days", () => {
    context("Create equipment maintenace document", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigate to equipment list", () => {
        cy.navigToEquipment();
      });

      it("Click 'ADD NEW EQUIPMENT'", () => {
        cy.equipClickCreateNew();
      });

      it("Equipment maintenance document due date in 17 days'", () => {
        cy.drEnterDocumentTitle({ name: "Equipment maintenance document due date in 17 days" });
      });

      it("Enter description 'Equipment maintenance'", () => {
        cy.drEnterDocumentDescription({ description: "Equipment maintenance" });
      });

      it("Select 'Active' as EQ status", () => {
        cy.get("input[name=fb-default-eq-status][value=Active]").check();
      });

      it(`Select "${ADMIN_USER.name}" as Primary Owner`, () => {
        cy.get("[name=fb-primary-owner-eq]").click();
        cy.get("ul[role=listbox]>li").contains(ADMIN_USER.name).click();
      });

      it(`Select "${FIRST_USER.name}" as Coordinator`, () => {
        cy.get("[name=fb-coordinator-eq]").click();
        cy.get("ul[role=listbox]>li").contains(FIRST_USER.name).click();
      });

      it("Select document 'Yes' for preventative maintenance required", () => {
        cy.get("[value=\"Yes\"]").eq(0).click();
        cy.wait(500);
      });

      it("Select 'Maintenance record form' for preventative maintenance required", () => {
        cy.get("[data-cy*=\"preventativeForm\"]").eq(0).click();
        cy.get("ul>li[role=\"option\"]").contains("Maintenance record form").click();
      });

      it("Enter preventative maintenance frequency", () => {
        cy.get("[name*=\"frequency\"]").eq(0).type("17");
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
              description: "Approval for equipment due in 17 days",
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
            cy.arPatchAR({
              payload: {
                formInput: {
                  documentRevisions: [{
                    proposedDocumentRevision: { id: createdSecondEquipmentDocID },
                    descriptionOfChange: "ar test",
                    justificationOfChange: "ar test",
                    id: faker.random.uuid(),
                  }],
                  approvers: [
                    {
                      approver: {
                        id: adminEmployee.id,
                      },
                      signatureGroupId: {
                        id: null,
                      },
                    },
                  ],
                },
              },
              arID: createdARForEquipNoOwnerCoordinator.id,
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => {
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
      });

      it("Reload Equipment document", () => {
        cy.equipReloadDocument();
      });

      it("Verify status is 'Released'", () => {
        cy.drCheckDocumentStatus({ status: "Released" });
      });
    });

    context("Create maintenance record for equipment with due date in 17 days", () => {
      it("[API] Create maintenance record", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>MR for EQ with maintenance in 17 days</p>",
            document: {
              docId: "MR-00003",
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
            name: "MR for EQ with maintenance in 17 days",
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
        cy.equipReloadDocument();
      });

      it("Verify maintenance record is present", () => {
        cy.xpath("//div[@data-cy=\"form.builder.maintenance.history\"]/../..")
          .eq(0)
          .contains("MR-00003 - MR for EQ with maintenance in 17 days");
      });
    });
  });

  context("Test notification with maintenance done due date", () => {
    context("Create equipment maintenace document", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigate to equipment list", () => {
        cy.navigToEquipment();
      });

      it("Click 'ADD NEW EQUIPMENT'", () => {
        cy.equipClickCreateNew();
      });

      it("Equipment maintenance document done due date'", () => {
        cy.drEnterDocumentTitle({ name: "Equipment maintenance document done due date" });
      });

      it("Enter description 'Equipment maintenance'", () => {
        cy.drEnterDocumentDescription({ description: "Equipment maintenance" });
      });

      it("Select 'Active' as EQ status", () => {
        cy.get("input[name=fb-default-eq-status][value=Active]").check();
      });

      it(`Select "${ADMIN_USER.name}" as Primary Owner`, () => {
        cy.get("[name=fb-primary-owner-eq]").click();
        cy.get("ul[role=listbox]>li").contains(ADMIN_USER.name).click();
      });

      it(`Select "${FIRST_USER.name}" as Coordinator`, () => {
        cy.get("[name=fb-coordinator-eq]").click();
        cy.get("ul[role=listbox]>li").contains(FIRST_USER.name).click();
      });

      it("Select document 'Yes' for preventative maintenance required", () => {
        cy.get("[value=\"Yes\"]").eq(0).click();
      });

      it("Select 'Maintenance record form' for preventative maintenance required", () => {
        cy.get("[data-cy*=\"preventativeForm\"]").eq(0).click();
        cy.get("ul>li[role=\"option\"]").contains("Maintenance record form").click();
      });

      it("Enter preventative maintenance frequency", () => {
        cy.get("[name*=\"frequency\"]").eq(0).type("1");
      });

      it("Type preventative maintenance instruction", () => {
        cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy, \"pm\")]/../div[2]")
          .type("Instructions for preventative maintenance");
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Release equipment doc with done due date", () => {
      it("[API] Approve and release", (done: any) => {
        cy.url().then((url: any) => {
          createdSecondEquipmentDocID = url.split("/").pop();
          cy.arCreateApprovalRequest({
            payload: {
              title: "For first equipment",
              description: "Approval for equipment with done due date",
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
            cy.arPatchAR({
              payload: {
                formInput: {
                  documentRevisions: [{
                    proposedDocumentRevision: { id: createdSecondEquipmentDocID },
                    descriptionOfChange: "ar test",
                    justificationOfChange: "ar test",
                    id: faker.random.uuid(),
                  }],
                  approvers: [
                    {
                      approver: {
                        id: adminEmployee.id,
                      },
                      signatureGroupId: {
                        id: null,
                      },
                    },
                  ],
                },
              },
              arID: createdARForEquipNoOwnerCoordinator.id,
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => {
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
      });

      it("Reload Equipment document", () => {
        cy.equipReloadDocument();
      });

      it("Verify status is 'Released'", () => {
        cy.drCheckDocumentStatus({ status: "Released" });
      });
    });

    context("Create maintenance record for equipment with done due date", () => {
      it("[API] Create maintenance record", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>MR for EQ with maintenance with done due date</p>",
            document: {
              docId: "MR-00004",
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
            name: "MR for EQ with maintenance done date",
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
              "fb-equipment_due_date": moment().tz("America/Los_Angeles").subtract(5, "days").toISOString(),
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
        cy.equipReloadDocument();
      });

      it("Verify maintenance record is present", () => {
        cy.xpath("//div[@data-cy=\"form.builder.maintenance.history\"]/../..")
          .eq(0)
          .contains("MR-00004 - MR for EQ with maintenance done date");
      });
    });

    context("Trigger script and verify email is not received", () => {
      it("Trigger email script", () => {
        cy.triggerDueDateEmailScript({
          sessionId: adminEmployeeLoginResponse.sessionId,
          currentDate: moment().tz("America/Los_Angeles").toISOString(),
        });
        cy.wait(100000);
      });
    });

    context("Verify emails", () => {
      it("Get emails", () => {
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          wait_time_sec: 5,
          max_wait_time_sec: 50,
          include_body: true,
          after: dateAfterEmailShouldArrive,
        };

        cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).should((emails) => {
          if (emails) {
            emailsFromInbox = emails;
          }
          else {
            assert.fail("No email found");
          }
        });
      });

      it("Verify emails that should be received", () => {
        const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
          {
            sentToUser: FIRST_USER.email,
            contains: ["EQ-00002 Equipment maintenance document due date in 4 days", companyId],
          },
          {
            sentToUser: ADMIN_USER.email,
            contains: ["EQ-00002 Equipment maintenance document due date in 4 days", companyId],
          },
          {
            sentToUser: FIRST_USER.email,
            contains: ["EQ-00003 Equipment maintenance document due date in 17 days", companyId],
          },
          {
            sentToUser: ADMIN_USER.email,
            contains: ["EQ-00003 Equipment maintenance document due date in 17 days", companyId],
          },
        ];
        cy.imapVerifyEmailsInList({
          receivedEmails: emailsFromInbox,
          emailsToTest: emailsThatShouldBeReceived,
          getEmailsSincedate: dateAfterEmailShouldArrive,
          assertNumberOfEmailsFoundInList: 1,
        });
      });

      it("Verify emails that should not be received", () => {
        const emailsThatShouldNotBeReceived: IMAPEmailsInTesting[] = [
          {
            sentToUser: ADMIN_USER.email,
            contains: ["EQ-00001"],
          },
          {
            sentToUser: FIRST_USER.email,
            contains: ["EQ-00001"],
          },
          {
            sentToUser: ADMIN_USER.email,
            contains: ["EQ-00004"],
          },
          {
            sentToUser: FIRST_USER.email,
            contains: ["EQ-00004"],
          },
        ];
        cy.imapVerifyEmailsInList({
          receivedEmails: emailsFromInbox,
          emailsToTest: emailsThatShouldNotBeReceived,
          getEmailsSincedate: dateAfterEmailShouldArrive,
          assertNumberOfEmailsFoundInList: 0,
        });
      });
    });
  });
});
