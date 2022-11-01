/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let createdOldSupplierForm;
let formDocumentType;
let suppliersDocumentType;
let createdOldReleasedSupplier;

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

    it("[API]Login first tester", (done: any) => {
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
                    tabId: "details",
                    rules: "",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "contact-information-k6cmmlse",
                    type: "texteditor",
                    index: 1,
                    label: "Contact Information (Name, title, email and phone number)",
                    tabId: "details",
                    rules: "",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "supplier-type-k6cmt37w",
                    type: "radiogroup",
                    index: 2,
                    label: "Supplier Type:",
                    tabId: "details",
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
                    index: 3,
                    label: "Purpose:",
                    tabId: "details",
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
            createdOldSupplierForm = response;
            cy.drAPIApproveAndRelease({
              documentId: createdOldSupplierForm.id,
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

    it("[API]Create draft supplier with old form document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Old draft supplier created with API</p>",
          document: {
            docId: "SUP-00001",
            documentType: {
              id: suppliersDocumentType[0].id,
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
          name: "Old draft supplier document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formDocument: { id: createdOldSupplierForm.id },
          formInput: {
            "contact-information-k6cmmlse": "<p>Old Supplier, old@supplier.com, 031/031- 931</p>",
            "supplier-type-k6cmt37w": "Manufacturer",
            "purpose-k6cmtv1h": "R&D",
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then(() => done());
    });

    it("[API]Create released supplier with old form document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Old released supplier created with API</p>",
          document: {
            docId: "SUP-00002",
            documentType: {
              id: suppliersDocumentType[0].id,
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
          name: "Old released supplier document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formDocument: { id: createdOldSupplierForm.id },
          formInput: {
            "contact-information-k6cmmlse": "<p>Old Supplier, old@supplier.com, 031/031- 931</p>",
            "supplier-type-k6cmt37w": "Manufacturer",
            "purpose-k6cmtv1h": "R&D",
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdOldReleasedSupplier = response;
        cy.drAPIApproveAndRelease({
          documentId: createdOldReleasedSupplier.id,
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
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    context("Verify that the Approval block can be added to old released Supplier form", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Select old supplier form document from document list", () => {
        cy.dlFilterByDocTitle({ docTitle: "Old supplier form" });
        cy.dlSelectFirstDocument();
      });

      it("Click on revise", () => {
        cy.drClickReviseDocument();
      });

      context("Add approvals field to form", () => {
        it("Click on 'Details' tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Click add new field", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
        });

        it("Select approvals from given fields", () => {
          cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Approvals" });
        });

        it("Click add field", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Save and release form", () => {
        it("Save form", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release form", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });

        it("Click on 'Details' tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Verify approvals block is present", () => {
          cy.get("input[data-cy^=\"fb-approvals-approvals\"]").should("exist");
        });

        it("Verify revision 2 is released", () => {
          cy.drVerifyFirstDocumentRevisionList({ revision: "Rev 2", status: STATUS_TYPES_LABEL.RELEASED });
        });
      });
    });

    context("Verify that the system enables the user to upgrade to the latest form for supplier in DRAFT", () => {
      it("Navigate to supplier list", () => {
        cy.navigToSuppliers();
      });

      it("Select old supplier document in DRAFT from supplier list", () => {
        cy.supFilterByDocTitle({ docTitle: "Old draft supplier document" });
        cy.dlSelectFirstDocument();
      });

      it("Press Click Here on banner for form upgrade to latest version", () => {
        cy.drClickUpgradeForm();
      });

      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify approvals block is present", () => {
        cy.get("input[data-cy^=\"fb-approvals-approvals\"]").should("exist");
      });

      context("Release upgraded supplier document", () => {
        it("Add approver to approvers list", () => {
          cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
        });

        it("Submit for approval", () => {
          cy.pmSubmitForApproval();
        });

        it("Click on 'Details' tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Approve supplier document", () => {
          cy.ebApprove();
        });

        it("Verify revision is revision 1 - Released", () => {
          cy.drVerifyFirstDocumentRevisionList({ revision: "Rev 1", status: STATUS_TYPES_LABEL.RELEASED });
        });
      });
    });

    context("Verify that the system enables the user to upgrade RELEASED supplier with latest version of form", () => {
      context("Revise and upgrade supplier document", () => {
        it("Navigate to supplier list", () => {
          cy.navigToSuppliers();
        });

        it("Select old supplier document in RELEASED from supplier list", () => {
          cy.dlClearFilters();
          cy.supFilterByDocTitle({ docTitle: "Old released supplier document" });
          cy.dlSelectFirstDocument();
        });

        it("Click update record", () => {
          cy.drClickReviseDocument();
        });

        it("Click save", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Press Click Here on banner for form upgrade to latest version", () => {
          cy.drClickUpgradeForm();
        });

        it("Click on 'Details' tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Verify approvals block is present", () => {
          cy.get("input[data-cy^=\"fb-approvals-approvals\"]").should("exist");
        });
      });

      context("Release upgraded supplier document", () => {
        it("Add approver to approvers list", () => {
          cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
        });

        it("Submit for approval", () => {
          cy.pmSubmitForApproval();
        });

        it("Click on 'Details' tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Approve supplier document", () => {
          cy.ebApprove();
        });

        it("Verify revision is revision 1 - Released", () => {
          cy.drVerifyFirstDocumentRevisionList({ revision: "Rev 2", status: STATUS_TYPES_LABEL.RELEASED });
        });
      });
    });
  });
});

export { };

