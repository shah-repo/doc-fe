/* eslint-disable object-shorthand */
/* eslint-disable max-classes-per-file */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions";
import { cmpAddNewEmployeeIds, cmpChangeGroupEmployeeIds, cmpChangeGroupIds, cmpChangeParentGroupIds, cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { documentTypes } from "../document_types.spec";
import { groups } from "../groups.spec";
import { adminUser, employees, importedUser } from "../users.spec";

let loginResponse;
let multipleCompanies;
let createdCompany;
let adminEmployee;
let superAdminResponse;
let purchaseOrderDocumentType;
let formDocumentType;
let approvalRequestDocumentType;
let initialArDocument;
let createdPOFormDocument;
let engineeringBuildDocumentType;
let everyoneGroup;

const acctCodes = [
  "92345",
  "94565",
  "92703",
  "91402"];

const addresses = [
  "3 Tarkiln Hill Street Hesperia, CA 92345",
  "609 Wild Rose Street Pittsburg, CA 94565",
  "88 E. Marconi Court Santa Ana, CA 92703",
  "17 South Saxton Street Panorama City, CA 91402"];

context("Create Test company example", () => {

  context("[API] Prepare company", () => {
    it("[API] Creates company", (done: any) => {
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response) => {
        superAdminResponse = response;

        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            name: CONFIG.TEST_COMPANY_REPLICA_NAME,
            companyAdminEmail: adminUser.email,
            helloSignIntegrationEnabled: true,
            helloSignTestMode: true,
            importerEmail: importedUser.email,
            numOfRevStages: 3,
            numOfDocDigits: 5,
            slackIntegrationEnabled: true,
            users: employees.map((user) => ({ email: user.email, name: user.name })),
            acctCodes: acctCodes,
            addresses: addresses,
            documentTypes: documentTypes,
            whiteLabeling: {
              DEV_THEME: {
                logo: "https://s3.amazonaws.com/tld-documents.llnassets.com/0004000/4056/random_testing_sm.jpg",
              },
            },
          }, sessionId: superAdminResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === adminUser.email);
          employees.push(adminUser, importedUser);
          cmpAddNewEmployeeIds(createdCompany.employees, employees);
          cmpChangeGroupEmployeeIds(employees, groups);
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          engineeringBuildDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Engineering Build");
          done();
        });
      });
    });

    it("[API] Login admin", (done: any) => {
      cy.authApiLogin({
        email: adminUser.email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    context("[API] Update user avatars and confirmed status", () => {
      it("[API] Get users and patch them", () => {
        cy.usrAdminGetUsers({ sessionId: superAdminResponse.sessionId })
          .then((users) => {
            users.forEach((user) => {
              const employee = employees.find((employee) => employee.email === user.email);
              if (employee) {
                cy.usrAdminPatchUser({
                  sessionId: superAdminResponse.sessionId,
                  userId: user.id,
                  payload: {
                    name: employee.name,
                    confirmed: user.confirmed, // need to talk about this
                    avatar: employee?.avatar,
                  },
                });
              }
            });
          });
      });
    });

    context("[API] Update employees with active or inactive state", () => {
      employees.forEach((employee) => {
        it(`[API] Update ${employee.name}`, () => {
          cy.usrAdminPatchEmployee({
            sessionId: superAdminResponse.sessionId,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            employeeId: employee.newId!,
            companyId: createdCompany.id,
            payload: {
              active: employee.active,
            },
          });
        });
      });
    });

    context("[API] Copy groups", () => {
      context("[API] Remove employees from default groups", () => {
        it("[API] Get default groups and remove their employees", (done: any) => {
          cy.grpGetGroups({ sessionId: loginResponse.sessionId, employeeId: adminEmployee.id })
            .then((groups) => {
              groups.forEach((group) => {
                cy.grpAdminPatchGroup({
                  sessionId: superAdminResponse.sessionId,
                  groupId: group.id,
                  companyId: createdCompany.id,
                  payload: {
                    name: group.name,
                    permissions: group.permissions,
                    defaultForNewUsers: group.defaultForNewUsers,
                    tags: group.tags,
                    isOfficial: group.isOfficial,
                    employees: [],
                    parents: [],
                  },
                });
              });
            }).then(() => done());
        });
      });

      context("[API] Add groups to company", () => {
        const defaultGroups = [
          "Owner as approver",
          "Can be approver",
          "Everyone",
          "Groups Management",
          "Company Admin",
          "Developers",
          "Groups Management Unofficial",
        ];
        groups.forEach((group) => {
          if (!(defaultGroups.includes(group.name))) {
            it(`[API] Add group: '${group.name}'`, () => {
              cy.grpAdminPostGroup({
                payload: {
                  name: group.name,
                  permissions: group.permissions,
                  defaultForNewUsers: group.defaultForNewUsers,
                  isOfficial: true,
                  tags: group.tags,
                  employees: group.employees,
                },
                sessionId: superAdminResponse.sessionId,
                companyId: createdCompany.id,
              });
            });
          }
        });
      });

      context("[API] Update groups", () => {
        it("[API] Get newId for created groups", (done: any) => {
          cy.grpGetGroups({ sessionId: loginResponse.sessionId, employeeId: adminEmployee.id })
            .then((response) => {
              const newGroups = response;
              cmpChangeGroupIds(groups, newGroups);
              cmpChangeParentGroupIds(groups);
            }).then(() => done());
        });

        groups.forEach((group) => {
          it(`[API] Add parent groups to: ${group.name}`, () => {
            cy.grpAdminPatchGroup({
              sessionId: superAdminResponse.sessionId,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              groupId: group.newId!,
              companyId: createdCompany.id,
              payload: {
                name: group.name,
                permissions: group.permissions,
                defaultForNewUsers: group.defaultForNewUsers,
                tags: group.tags,
                isOfficial: group.isOfficial,
                employees: group.employees,
                parents: group.parents,
              },
            });
          });
        });
      });
    });

    context("[API] Add important documents", () => {
      it("[API] Add 'PO pdf test' form document", (done: any) => {
        cy.grpGetGroupByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          groupName: "Everyone",
        }).then((response) => {
          everyoneGroup = response;
          cy.arGetArDocumentByName({
            sessionId: loginResponse.sessionId,
            employeeId: adminEmployee.id,
            name: "AR Form",
          }).then((response) => {
            initialArDocument = response;
            cy.drCreateDocumentRevision({
              payload: {
                attachments: [],
                description: "<p>PO pdf test</p>",
                document: {
                  docId: "FM-00002",
                  documentType: {
                    id: formDocumentType[0].id,
                  },
                  securityList: {
                    operators: [],
                    securityEmployees: [],
                    securityGroups: [
                      {
                        id: everyoneGroup.body[0].id,
                      },
                    ],
                  },
                },
                name: "PO pdf test",
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
                },
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
              }).then(() => done());
            });
          });
        });
      });

      it("[API] Add 'PO Form with Select Fields' form document", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>testing seelct fields</p>",
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
                    id: everyoneGroup.body[0].id,
                  },
                ],
              },
            },
            name: "PO Form with Select Fields",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formTemplate: {
              outputDocumentTypes: [{
                id: purchaseOrderDocumentType[0].id,
              }],
              schema: [
                {
                  name: "po-status-kcwo0tgx",
                  type: "select",
                  index: 0,
                  label: "PO Status",
                  options: [
                    {
                      text: "Open",
                      value: "Open",
                    },
                    {
                      text: "Closed",
                      value: "Closed",
                    },
                  ],
                  placeholder: "[Select here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  reviseDisabled: true,
                },
                {
                  name: "terms-kcwo00us",
                  type: "select",
                  index: 1,
                  label: "Terms",
                  options: [
                    {
                      text: "30",
                      value: "30",
                    },
                    {
                      text: "60",
                      value: "60",
                    },
                    {
                      text: "90",
                      value: "90",
                    },
                  ],
                  placeholder: "[Select here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "select-field-w-o-placeholder-kcwo1s03",
                  type: "select",
                  index: 2,
                  label: "Select Field w/o placeholder",
                  options: [
                    {
                      text: "AAA",
                      value: "AAA",
                    },
                    {
                      text: "BBB",
                      value: "BBB",
                    },
                    {
                      text: "CCC",
                      value: "CCC",
                    },
                  ],
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "select-field-w-placeholder-kcwo2gmi",
                  type: "select",
                  index: 3,
                  label: "Select Field w/ placeholder",
                  options: [
                    {
                      text: "111",
                      value: "111",
                    },
                    {
                      text: "222",
                      value: "222",
                    },
                    {
                      text: "333",
                      value: "333",
                    },
                  ],
                  placeholder: "Select from options here",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "requestor-kcwo1aii",
                  type: "autocomplete",
                  index: 4,
                  label: "Requestor",
                  optionId: "13",
                  placeholder: "[Select here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "purchase-order-kcwo2n4r",
                  type: "purchaseorder",
                  index: 5,
                  label: "Purchase Order",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "hyperlink-kcwtdm96",
                  type: "hyperlink",
                  index: 6,
                  label: "Hyperlink",
                  linkUrl: "www.google.com",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
              ],
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
            },
            employeeId: adminEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then(() => done());
        });
      });

      it("[API] Add 'Demo test AR form'", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Demo test form</p>",
            document: {
              docId: "FM-01131",
              documentType: {
                id: formDocumentType[0].id,
              },
              securityList: {
                operators: [],
                securityEmployees: [],
                securityGroups: [
                  {
                    id: everyoneGroup.body[0].id,
                  },
                ],
              },
            },
            name: "Demo test AR form",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formTemplate: {
              outputDocumentTypes: [{
                id: approvalRequestDocumentType[0].id,
              }],
              schema: [
                {
                  name: "cr-attachment-s-kbv4cb50",
                  type: "fileupload",
                  index: 0,
                  label: "CR Attachment(s):",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "change-request-details",
                  type: "section",
                  index: 1,
                  label: "Change Request Details",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "documentRevisions",
                  type: "documentRevisions",
                  index: 2,
                  rules: {
                    "documentRevisions.*.id": "required",
                    "documentRevisions.*.descriptionOfChange": "required",
                    "documentRevisions.*.descriptionOfJustification": "required",
                    "documentRevisions.*.proposedDocumentRevision.id": "required",
                  },
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "product-impact-assessment-kbv4crom",
                  type: "section",
                  index: 3,
                  label: "Product Impact Assessment:",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "is-there-a-change-to-the-design-kbv4dabe",
                  type: "radiogroup",
                  index: 4,
                  label: "Is there a change to the design?",
                  options: [
                    {
                      text: "Yes",
                      value: "Yes",
                    },
                    {
                      text: "No",
                      value: "No",
                    },
                  ],
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "justification-kbv4edvl",
                  rows: 3,
                  type: "textfield",
                  index: 5,
                  label: "Justification:",
                  placeholder: " (List any impact to prior tests, validations, documents, etc. here)",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "is-there-a-change-to-materials-or-packaging-kbv4fmkz",
                  type: "radiogroup",
                  index: 6,
                  label: "Is there a change to materials or packaging?",
                  options: [
                    {
                      text: "Yes",
                      value: "Yes",
                    },
                    {
                      text: "No",
                      value: "No",
                    },
                  ],
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "justification-kbv4guef",
                  rows: 3,
                  type: "textfield",
                  index: 7,
                  label: "Justification:",
                  placeholder: "[List any impact to prior tests, validations, documents, etc. here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "is-there-a-change-to-the-manufacturing-process-kbv4hsqy",
                  type: "radiogroup",
                  index: 8,
                  label: "Is there a change to the manufacturing process?",
                  options: [
                    {
                      text: "Yes",
                      value: "Yes",
                    },
                    {
                      text: "No",
                      value: "No",
                    },
                  ],
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "justification-kbv4ih7w",
                  rows: 3,
                  type: "textfield",
                  index: 9,
                  label: "Justification:",
                  placeholder: "[List any impact to prior tests, validations, documents, etc. here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "are-risk-documents-affected-kbv4j0l2",
                  type: "radiogroup",
                  index: 10,
                  label: "Are risk documents affected?",
                  options: [
                    {
                      text: "Yes",
                      value: "Yes",
                    },
                    {
                      text: "No",
                      value: "No",
                    },
                  ],
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "justification-kbv4jrvn",
                  rows: 3,
                  type: "textfield",
                  index: 11,
                  label: "Justification:",
                  placeholder: "[List any impact to prior tests, validations, documents, etc. here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "regulatory-assessment-kbv4l92m",
                  type: "section",
                  index: 12,
                  label: "Regulatory Assessment:",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "does-the-change-impact-a-regulatory-submission-kbv4lok6",
                  type: "radiogroup",
                  index: 13,
                  label: "Does the change impact a regulatory submission?",
                  options: [
                    {
                      text: "Yes",
                      value: "Yes",
                    },
                    {
                      text: "No",
                      value: "No",
                    },
                  ],
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "justification-kbv4mjet",
                  rows: 3,
                  type: "textfield",
                  index: 14,
                  label: "Justification:",
                  placeholder: "[List the country or submission ID here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "reason-for-no-action-kbv4p0t1",
                  rows: 3,
                  type: "textfield",
                  index: 15,
                  label: "Reason for no action:",
                  placeholder: "[Enter rationale for no action here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "does-the-change-require-notification-to-a-regulatory-body-kbv4mxju",
                  type: "radiogroup",
                  index: 16,
                  label: "Does the change require notification to a regulatory body?",
                  options: [
                    {
                      text: "Yes",
                      value: "Yes",
                    },
                    {
                      text: "No",
                      value: "No",
                    },
                  ],
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "justification-kbv4ntni",
                  rows: 3,
                  type: "textfield",
                  index: 17,
                  label: "Justification:",
                  placeholder: "[List the agency/country (e.g., Notified Body, EU, FDA, Canada, etc. here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "reason-for-no-action-kbv4pdrf",
                  rows: 3,
                  type: "textfield",
                  index: 18,
                  label: "Reason for no action:",
                  placeholder: "[Enter rationale for no action here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "target-date-approvers",
                  type: "section",
                  index: 19,
                  label: "Target Date & Approvers",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "effectiveDate",
                  type: "datepicker",
                  index: 20,
                  label: "Target Date",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "approvers",
                  type: "autocomplete",
                  index: 21,
                  label: "Approvers",
                  multiple: true,
                  optionId: "3",
                  placeholder: "Start typing to see the list...",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  optionValueType: "id",
                },
              ],
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
            },
            employeeId: adminEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then(() => done());
        });
      });

      it("[API] Add 'Template for EB' form document", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            description: "<p>testing template for EB</p>",
            name: "Template for EB",
            attachments: [],
            referenceTo: [],
            revisionStage: 1,
            revisionChangeType: RevisionChangeType.NextRevision,
            retrain: false,
            document: {
              docId: "FM-01480",
              securityList: {
                securityEmployees: [],
                securityGroups: [
                  {
                    id: everyoneGroup.body[0].id,
                  },
                ],
                operators: [],
              },
              documentType: {
                id: formDocumentType[0].id,
              },
            },
            formTemplate: {
              outputDocumentTypes: [
                {
                  id: engineeringBuildDocumentType[0].id,
                },
              ],
              schema: [
                {
                  label: "form.builder.approvals",
                  type: "approvals",
                  name: "fb-approvals-kh4u69vk",
                  uniqueSchemaItem: true,
                  index: 0,
                },
                {
                  type: "parts",
                  name: "fb-parts-kh4u6wve",
                  uniqueSchemaItem: true,
                  index: 1,
                },
                {
                  type: "section",
                  name: "fb-procedure-section-kh4u6wve",
                  label: "form.builder.procedure",
                  index: 2,
                },
                {
                  index: 3,
                  type: "procedure",
                  name: "-kh4u6wvf",
                  stepIndex: 1,
                  editorProperties: [
                    "copyableValue",
                  ],
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
              ],
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
            },
            employeeId: adminEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then(() => done());
        });
      });
    });
  });

  context("Log in user, select company", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: adminUser.email,
        password: "Tester1!",
      });
    });

    it(`Selects company: '${CONFIG.TEST_COMPANY_REPLICA_NAME}'`, () => {
      cy.cmpSelectCompany({ name: CONFIG.TEST_COMPANY_REPLICA_NAME, multiple: multipleCompanies });
    });
  });
});
