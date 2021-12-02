/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocument;
let formDocumentType;
let suppliersDocumentType;

context("Test upgradability of old supplier form and record", () => {
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
            documentTypes: [],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          suppliersDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
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


    it("[API]Create old supplier form", () => {
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
              description: "<p>Old supplier form</p>",
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
              formTemplate: {
                outputDocumentTypes: [
                  { id: suppliersDocumentType[0].id },
                ],
                schema: [
                  {
                    name: "section-1-k6cmjc6w",
                    type: "section",
                    index: 0,
                    label: "Section 1 - Completed by Requester",
                    rules: "",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "supplier-k7qldwq0",
                    type: "autocomplete",
                    index: 1,
                    label: "Supplier:",
                    rules: "",
                    placeholder: "[Select supplier here]",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "supplier-address-k7mkeqr5",
                    rows: "2",
                    type: "textfield",
                    index: 2,
                    label: "Supplier Address:",
                    rules: "",
                    placeholder: "[Enter supplier address here]",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "contact-information-k6cmmlse",
                    type: "texteditor",
                    index: 3,
                    label: "Contact Information (Name, title, email and phone number)",
                    rules: "",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "supplier-remit-k6cmq04k",
                    type: "radiogroup",
                    index: 4,
                    label: "Supplier Remit Address:",
                    rules: "",
                    options: [
                      {
                        text: "Same as above",
                        value: "Same as above",
                      },
                      {
                        text: "Different address",
                        value: "Different address",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "remit-address-k7mklqcl",
                    rows: "2",
                    type: "textfield",
                    index: 5,
                    label: "Remit Address:",
                    rules: "required_if:supplier-remit-k6cmq04k,different-address-<-val->-supplier-remit-k6cmq04k",
                    placeholder: "[Enter supplier remit address here]",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "supplier-type-k6cmt37w",
                    type: "radiogroup",
                    index: 6,
                    label: "Supplier Type:",
                    rules: "",
                    options: [
                      {
                        text: "Manufacturer",
                        value: "Manufacturer",
                      },
                      {
                        text: "Distributor",
                        value: "Distributor",
                      },
                      {
                        text: "Service Provider",
                        value: "Service Provider",
                      },
                      {
                        text: "Consultant/Contract Employee",
                        value: "Consultant/Contract Employee",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "purpose-k6cmtv1h",
                    type: "radiogroup",
                    index: 7,
                    label: "Purpose:",
                    rules: "",
                    options: [
                      {
                        text: "Production",
                        value: "Production",
                      },
                      {
                        text: "R&D",
                        value: "R&D",
                      },
                      {
                        text: "Consulting",
                        value: "Consulting",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "product-p-n-or-k6cmuu3k",
                    type: "texteditor",
                    index: 8,
                    label: "Product (P/N) or Service:",
                    rules: "",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "requested-by-k6cmvu3e",
                    type: "autocomplete",
                    index: 9,
                    label: "Requested By:",
                    rules: "",
                    optionId: "3",
                    placeholder: "[Select name of requester]",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "requested-date-k6cmw99z",
                    type: "datepicker",
                    index: 10,
                    label: "Requested Date:",
                    rules: "",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "section-2-k6cmwq7c",
                    type: "section",
                    index: 11,
                    label: "Section 2 - Completed by Quality",
                    rules: "",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "qualification-level-k6cmxxd0",
                    type: "radiogroup",
                    index: 12,
                    label: "Qualification Level:",
                    rules: "",
                    options: [
                      {
                        text: "Level 1",
                        value: "Level 1",
                      },
                      {
                        text: "Level 2",
                        value: "Level 2",
                      },
                      {
                        text: "Level 3",
                        value: "Level 3",
                      },
                      {
                        text: "Level 4",
                        value: "Level 4",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "supplier-self-survey-k6cn1orl",
                    type: "autocomplete",
                    index: 13,
                    label: "Supplier Self-Survey",
                    rules: "required_if:qualification-level-k6cmxxd0,level-1-<-val->-qualification-level-k6cmxxd0|required_document_status:RELEASED",
                    optionId: "1",
                    placeholder: "[Select level 1 supplier self-survey completed]",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "supplier-k89g7spy",
                    type: "autocomplete",
                    index: 14,
                    label: "Supplier Self-Survey",
                    rules: "required_if:qualification-level-k6cmxxd0,level-2-<-val->-qualification-level-k6cmxxd0|required_document_status:RELEASED",
                    optionId: "1",
                    placeholder: "[Select level 2 supplier self-survey completed]",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    optionLabelKey: "name",
                    optionValueKey: "id",
                  },
                  {
                    name: "supplier-self-survey-k8aqlbuy",
                    type: "autocomplete",
                    index: 15,
                    label: "Supplier Self-Survey",
                    rules: "required_if:qualification-level-k6cmxxd0,level-3-<-val->-qualification-level-k6cmxxd0|required_document_status:RELEASED",
                    optionId: "1",
                    placeholder: "[Select level 3 supplier self-survey completed]",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    optionLabelKey: "name",
                    optionValueKey: "id",
                  },
                  {
                    name: "supplier-agreement-k6cn7vfs",
                    type: "autocomplete",
                    index: 16,
                    label: "Supplier Agreement",
                    rules: "required_if:qualification-level-k6cmxxd0,level-1-<-val->-qualification-level-k6cmxxd0|required_document_status:RELEASED",
                    optionId: "1",
                    placeholder: "[Select Supplier Agreement completed]",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "non-disclosure-k6cna1lv",
                    type: "autocomplete",
                    index: 17,
                    label: "Non-Disclosure Agreement:",
                    rules: "required_if:qualification-level-k6cmxxd0,level-1-<-val->-qualification-level-k6cmxxd0|required_document_status:RELEASED",
                    optionId: "1",
                    placeholder: "[Select non-disclosure agreement completed]",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "3rd-party-quality-k6cnchf1",
                    type: "fileupload",
                    index: 18,
                    label: "3rd Party quality system certification:",
                    rules: "required_if:qualification-level-k6cmxxd0,level-1-<-val->-qualification-level-k6cmxxd0",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "cert-expiration-date-k6co9iul",
                    type: "datepicker",
                    index: 19,
                    label: "Cert Expiration Date:",
                    rules: "",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "cv-resume-k6cndvi1",
                    type: "fileupload",
                    index: 20,
                    label: "CV/Resume (Consultant only)",
                    rules: "required_if:supplier-type-k6cmt37w,consultant-contract-employee-<-val->-supplier-type-k6cmt37w",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "completed-by-k6cnf2fl",
                    type: "autocomplete",
                    index: 21,
                    label: "Completed By:",
                    rules: "",
                    optionId: "3",
                    placeholder: "[Select name]",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "completed-date-k6cnfgnc",
                    type: "datepicker",
                    index: 22,
                    label: "Completed Date:",
                    rules: "",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "section-3-k6cng5oc",
                    type: "section",
                    index: 23,
                    label: "Section 3 - Completed by Purchasing",
                    rules: "",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "supplier-k6cnif7e",
                    type: "radiogroup",
                    index: 24,
                    label: "Supplier:",
                    rules: "",
                    options: [
                      {
                        text: "Existing Supplier",
                        value: "Existing Supplier",
                      },
                      {
                        text: "New",
                        value: "New",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "supplier-contact-s-k6cnjxre",
                    type: "radiogroup",
                    index: 25,
                    label: "Supplier Contact(s):",
                    rules: "",
                    options: [
                      {
                        text: "Check if applicable",
                        value: "Check if applicable",
                      },
                      {
                        text: "N/A",
                        value: "N/A",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "contact-type-k6cnl87n",
                    type: "texteditor",
                    index: 26,
                    label: "Contact Type:",
                    rules: "required_if:supplier-contact-s-k6cnjxre,check-if-applicable-<-val->-supplier-contact-s-k6cnjxre",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "completed-by-k6cnm7xj",
                    type: "autocomplete",
                    index: 27,
                    label: "Completed By:",
                    rules: "",
                    optionId: "3",
                    placeholder: "[Select name here]",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "completed-date-k6cnox77",
                    type: "datepicker",
                    index: 28,
                    label: "Completed Date:",
                    rules: "",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "section-4-interim-k6cntqve",
                    type: "section",
                    index: 29,
                    label: "Section 4 - Interim Approval - Completed by Quality & Purchasing",
                    rules: "",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],

                  },
                  {
                    name: "evaluation-criteria-k6cnvulp",
                    type: "checkboxgroup",
                    index: 30,
                    label: "Evaluation Criteria (Check all that apply):",
                    rules: "",
                    options: [
                      {
                        text: "Supplier Self-Survey",
                        value: "Supplier Self-Survey",
                      },
                      {
                        text: "Supplier completed Supplier Audit Report & Checklist",
                        value: "Supplier completed Supplier Audit Report & Checklist",
                      },
                      {
                        text: "Supplier Certification",
                        value: "Supplier Certification",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "approval-conditions-k6cnxayd",
                    type: "checkboxgroup",
                    index: 31,
                    label: "Approval Conditions (check all that apply):",
                    rules: "",
                    options: [
                      {
                        text: "100% Inspection",
                        value: "100% Inspection",
                      },
                      {
                        text: "Tightened inspection",
                        value: "Tightened inspection",
                      },
                      {
                        text: "Inspection data to be provided with shipments",
                        value: "Inspection data to be provided with shipments",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "notes-k6cnyg5j",
                    type: "texteditor",
                    index: 32,
                    label: "Notes:",
                    rules: "required_if:approval-conditions-k6cnxayd,tightened-inspection-approval-conditions-k6cnxayd,inspection-data-to-be-provided-with-shipments-approval-conditions-k6cnxayd",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "purchasing-approval-k6cnzm22",
                    type: "autocomplete",
                    index: 33,
                    label: "Purchasing Approval:",
                    rules: "required_if:approval-conditions-k6co496n,100-inspection-approval-conditions-k6co496n",
                    optionId: "3",
                    placeholder: "[Select name here]",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "quality-approval-k6co09wc",
                    type: "autocomplete",
                    index: 34,
                    label: "Quality Approval:",
                    rules: "",
                    optionId: "3",
                    placeholder: "[Select name here]",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "section-5-final-k6co1g5o",
                    type: "section",
                    index: 35,
                    label: "Section 5 - Final Evaluation - Completed by Quality & Purchasing",
                    rules: "",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "approval-status-k6co2t8j",
                    type: "radiogroup",
                    index: 36,
                    label: "Approval Status:",
                    rules: "",
                    options: [
                      {
                        text: "Conditional Approval",
                        value: "Conditional Approval",
                      },
                      {
                        text: "Approved",
                        value: "Approved",
                      },
                      {
                        text: "Not Approved",
                        value: "Not Approved",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "approval-conditions-k6co496n",
                    type: "checkboxgroup",
                    index: 37,
                    label: "Approval Conditions (check all that apply)",
                    rules: "required_if:approval-status-k6co2t8j,conditional-approval-<-val->-approval-status-k6co2t8j",
                    options: [
                      {
                        text: "100% Inspection",
                        value: "100% Inspection",
                      },
                      {
                        text: "Tightened inspection",
                        value: "Tightened inspection",
                      },
                      {
                        text: "Inspection data to be provided with shipments",
                        value: "Inspection data to be provided with shipments",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "reason-for-k6co4svd",
                    type: "texteditor",
                    index: 38,
                    label: "Reason for Non-Approval:",
                    rules: "required_if:approval-status-k6co2t8j,not-approved-<-val->-approval-status-k6co2t8j",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                ],
              },
              name: "Old supplier form",
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

    // it("[API]Create LHR document", (done: any) => {
    //   cy.drCreateDocumentRevision({
    //     payload: {
    //       attachments: [],
    //       description: "<p>LHR created with API</p>",
    //       document: {
    //         docId: "LHR-00004",
    //         documentType: {
    //           id: LHRDocumentType[0].id,
    //         },
    //         securityList: {
    //           operators: [],
    //           securityEmployees: [],
    //           securityGroups: [
    //             {
    //               id: group.body[0].id,
    //             },
    //           ],
    //         },
    //       },
    //       name: "API LHR document",
    //       referenceTo: [],
    //       retrain: false,
    //       revisionChangeType: RevisionChangeType.NextRevision,
    //       revisionStage: 1,
    //       formDocument: { id: createdLHRtDocument.id },
    //     },
    //     employeeId: adminEmployee.id as unknown as string,
    //     sessionId: loginResponse.sessionId as unknown as string,
    //   }).then(() => done());
    // });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });
});

export { };

