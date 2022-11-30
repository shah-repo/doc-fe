// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let secondUserLogin;
let supplierDocumentType;
let approvalRequestDocumentType;
let formDocumentType;
let initialArDocument;
let supplierForm;
let releasedSupplier;
let adminEmployee;
let supplierPageDetailsId;
let secondEmployee;
let group;

const COLUMN_HEADERS = [
  "SUPPLIER ID",
  "SUPPLIER NAME",
  "RISK CLASSIFICATION",
  "SUPPLIER USE STATUS",
  "STATE",
  "OWNER",
  "APPROVAL ID",
  "SUPPLIER USE",
];

context("Test Supplier Landing Page for Supira", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });


  context("Test setup", () => {
    it("[API] Creates company", (done: any) => {
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
            users: [USERS[2]],
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Change Order");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          done();
        });
      });
    });

    it("[API] Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API] Create supplier form", () => {
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
              description: "<p>Supplier form</p>",
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
                  { id: supplierDocumentType[0].id },
                ],
                schema: [
                  {
                    name: "supplier-use-kmdn6oi4",
                    type: "select",
                    index: 6,
                    label: "Supplier Use:",
                    tabId: "details",
                    options: [
                      {
                        text: "Production",
                        value: "Production",
                      },
                      {
                        text: "R&D/Prototype Only",
                        value: "R&D/Prototype Only",
                      },
                    ],
                    placeholder: "R&D/Prototype Only",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "supplier-use-status-kmdn8t3m",
                    type: "select",
                    index: 9,
                    label: "Supplier Use Status:",
                    tabId: "details",
                    rules: "",
                    options: [
                      {
                        text: "Pending Evaluation",
                        value: "Pending Evaluation",
                      },
                      {
                        text: "Conditionally Approved",
                        value: "Conditionally Approved",
                      },
                      {
                        text: "Approved",
                        value: "Approved",
                      },
                      {
                        text: "Approved - Hold new business",
                        value: "Approved - Hold new business",
                      },
                      {
                        text: "Inactive",
                        value: "Inactive",
                      },
                    ],
                    placeholder: "[Select from List]",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "visibility",
                    editorProperties: [],
                    validationAttribute: "Supplier Use Status:",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "risk-classificaiton-kmdn7qrd",
                    type: "select",
                    index: 7,
                    label: "Risk Classification:",
                    tabId: "details",
                    rules: "required_if:supplier-use-kmdn6oi4,Production",
                    options: [
                      {
                        text: "Critical",
                        value: "Critical",
                      },
                      {
                        text: "Major ",
                        value: "Major ",
                      },
                      {
                        text: "Minor",
                        value: "Minor",
                      },
                    ],
                    placeholder: "[Select from List]",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "visibility",
                    editorProperties: [],
                    validationAttribute: "Risk Classification:",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "approvals-kycw6cjf",
                    tabId: "overview",
                    type: "approvals",
                    index: 8,
                    label: "Approvals",
                    rules: "",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                ],
              },
              name: "Supplier form",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            supplierForm = response;
            cy.drAPIApproveAndRelease({
              documentId: supplierForm.id,
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

    it("[API] Patch page details", (done: any) => {
      cy.request({
        method: "GET",
        url: `${CONFIG.BE_URL}/api/v1/page_details`,
        qs: {
          category: "Supplier",
        },
        headers: {
          Authorization: `bearer ${adminEmployee.id}:${loginResponse.sessionId}`,
        },
      }).then((response) => {
        if (response.body) {
          supplierPageDetailsId = response.body[0].id;
        }
      }).then(() => {
        cy.intercept({ method: "PATCH", pathname: "/api/v1/page_details/*" }).as("response");
        cy.cmpUpdatePageDetails({
          id: supplierPageDetailsId,
          payload: {
            columns: [
              {
                label: COLUMN_HEADERS[0],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "document.docId",
                showOnAndroid: true,
              },
              {
                label: COLUMN_HEADERS[1],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "name",
                showOnAndroid: true,
              },
              {
                label: COLUMN_HEADERS[2],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "formInput.risk-classificaiton-kmdn7qrd",
                showOnAndroid: true,
              },
              {
                label: COLUMN_HEADERS[3],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "formInput.supplier-use-status-kmdn8t3m",
                showOnAndroid: true,
              },
              {
                label: COLUMN_HEADERS[4],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "displayStatus",
                showOnAndroid: true,
              },
              {
                label: COLUMN_HEADERS[5],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "owner.user.name",
                showOnAndroid: true,
              },
              {
                label: COLUMN_HEADERS[6],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "changeRequest.crId",
                showOnAndroid: true,
              },
              {
                label: COLUMN_HEADERS[7],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "formInput.supplier-use-kmdn6oi4",
                showOnAndroid: true,
              },
            ],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("[API] Create draft supplier", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Test Supplier Document - Draft</p>",
          document: {
            docId: "SUP-00001",
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
          name: "Draft Supplier",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formDocument: { id: supplierForm.id },
          formInput: {
            "supplier-use-kmdn6oi4": "Production",
            "risk-classificaiton-kmdn7qrd": "Major ",
            "supplier-use-status-kmdn8t3m": "Pending Evaluation",
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then(() => done());
    });

    it("[API] Login second user", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      }).then((response) => {
        secondUserLogin = response;
        done();
      });
    });

    it("[API] Create released supplier", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Test Supplier Document - Released</p>",
          document: {
            docId: "SUP-00002",
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
          name: "Released Supplier",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formDocument: { id: supplierForm.id },
          formInput: {
            "supplier-use-kmdn6oi4": "R&D/Prototype Only",
            "supplier-use-status-kmdn8t3m": "Conditionally Approved",
          },
        },
        employeeId: secondEmployee.id,
        sessionId: secondUserLogin.sessionId,
      }).then((response) => {
        releasedSupplier = response;
        cy.drAPIApproveAndRelease({
          documentId: releasedSupplier.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: secondEmployee.id } }],
          },
          employeeId: secondEmployee.id,
          sessionId: secondUserLogin.sessionId,
        }).then(() => {
          done();
        });
      });
    });
  });

  context("Verify Supplier landing page", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Navigate to Supplier landing page", () => {
      cy.navigToSuppliers();
    });

    it("Verify landing page table is using Kendo grid", () => {
      cy.get(`div[role="grid"]`).should("have.class", "k-grid");
    });

    context("Verify all columns are present", () => {
      COLUMN_HEADERS.forEach( (columnHeader, i) => {
        it(`Verify column '${columnHeader}' is present`, () => {
          cy.get(`th[role="columnheader"]`).eq(i).should("have.text", columnHeader);
        });
      });
    });

    context("Verify filter on each column", () => {
      [
        {
          header: COLUMN_HEADERS[0],
          index: 1,
          searchTerm: "SUP-00001",
          expectedDocId: "SUP-00001",
        },
        {
          header: COLUMN_HEADERS[1],
          index: 2,
          searchTerm: "Released",
          expectedDocId: "SUP-00002",
        },
        {
          header: COLUMN_HEADERS[2],
          index: 3,
          searchTerm: "Major",
          expectedDocId: "SUP-00001",
        },
        {
          header: COLUMN_HEADERS[3],
          index: 4,
          searchTerm: "Approved",
          expectedDocId: "SUP-00002",
        },
        // State uses dropdown, it's tested separately
        {
          header: COLUMN_HEADERS[5],
          index: 6,
          searchTerm: USERS[2].name,
          expectedDocId: "SUP-00002",
        },
        {
          header: COLUMN_HEADERS[6],
          index: 7,
          searchTerm: "AR",
          expectedDocId: "SUP-00002",
        },
        {
          header: COLUMN_HEADERS[7],
          index: 8,
          searchTerm: "Production",
          expectedDocId: "SUP-00001",
        },
      ].forEach((params) => {
        it(`Verify filter for ${params.header}`, () => {
          cy.dlClearFilters();
          cy.get(`th[aria-colindex="${params.index}"] input`).should("have.attr", "value", "");
          cy.get(`th[aria-colindex="${params.index}"] input`).arrowType(params.searchTerm);
          cy.get(`th[aria-colindex="${params.index}"] input`).should("have.attr", "value", params.searchTerm);
          cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
          cy.get("tr.k-master-row").first().find("td").eq(0).should( (cell) => {
            expect(cell).to.contain(params.expectedDocId);
          } );
        });
      });

      // State uses dropdown, so different commands are used
      it("Verify filter for State", () => {
        cy.dlClearFilters();
        cy.get(`th[aria-colindex="5"] span.k-input`).should("have.text", "All");
        cy.get(`th[aria-colindex="5"] span.k-input`).arrowClick();
        cy.get("ul>li[role=option]").contains("Draft").arrowClick();
        cy.get(`th[aria-colindex="5"] span.k-input`).should("have.text", "Draft");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
        cy.get("tr.k-master-row").first().find("td").eq(0).should( (cell) => {
          expect(cell).to.contain("SUP-00001");
        } );
        cy.dlClearFilters();
      });
    });

    context("Verify sort for each column", () => {
      COLUMN_HEADERS.forEach( (columnHeader, i) => {
        context(`Sort '${columnHeader}'`, () => {
          const columnHeaderRegex = new RegExp("^" + columnHeader + "$", "g");

          it(`${columnHeader} should be in ascending order`, () => {
            cy.contains(columnHeaderRegex).eq(0).arrowClick();
            cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-asc-sm")
              .should("be.exist");
            cy.wait(200);
            cy.verifyAscSort({ index: i, colLength: 8 });
          });

          it(`${columnHeader} should be in descending order`, () => {
            cy.contains(columnHeaderRegex).eq(0).arrowClick();
            cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-desc-sm")
              .should("be.exist");
            cy.wait(200);
            cy.verifyDesSort({ index: i, colLength: 8 });
          });
        });
      });
    });

    it(`Verify buttons "Clear Filter" and "Export List" are present`, () => {
      cy.get(`button[data-cy="clearFilter"]`).should("exist");
      cy.get(`button[data-cy="document.revision.export.list"]`).should("exist");
    });
  });
});

export { };
