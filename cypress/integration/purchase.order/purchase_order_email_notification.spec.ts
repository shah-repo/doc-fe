/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { purchaseOrderDefaultSchema } from "../../fixtures/default_po_schema";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { IMAPEmail } from "../../support/commands/imap/imap";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let supplierDocumentType;
let secondEmployee;
let group;
let formDocumentType;
let purchaseOrderDocumentType;
let createdPurchaseOrderFormDocument;
let approvalRequestDocumentType;
let initialArDocument;
const dateAfterEmailShouldArrive = new Date();
let emailsFromInbox: IMAPEmail[];

context("Send PO Owner an email notification when a PO is approved", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

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
          importerEmail: IMPORTER_USER.email,
          users: [USERS[2], USERS[3], USERS[4]],
          documentTypes: [
            {
              documentTypeName: "PO Part",
              documentTypeAcronym: "PRT-",
              group: "PART",
              category: "Parts",
              isQms: true,
            },
            {
              documentTypeName: "Purchase Order test",
              documentTypeAcronym: "POT-",
              group: "PO",
              category: "Purchase Order",
              isQms: true,
              privateNumberPool: true,
              needsSignature: true,
              fieldsConfig: {
                C: {
                  visible: false,
                  required: false,
                },
                D: {
                  label: "Description",
                  visible: true,
                  required: false,
                },
                E: {
                  visible: false,
                  required: true,
                },
                F: {
                  visible: false,
                  required: true,
                },
                G: {
                  visible: false,
                  required: false,
                },
                I: {
                  label: "Revise PO",
                  visible: true,
                },
                J: {
                  visible: false,
                },
                K: {
                  label: "Cancel PO",
                  visible: true,
                },
                L: {
                  label: "Correct PO",
                  visible: true,
                },
                M: {
                  label: "Type of Change",
                  visible: true,
                  required: true,
                },
                N: {
                  label: "Add Approvers",
                  visible: false,
                  required: false,
                },
                O: {
                  label: "PO History",
                  visible: true,
                },
                R: {
                  visible: false,
                },
                S: {
                  label: "Revise PO",
                  visible: true,
                },
                V: {
                  label: "Create PO",
                  visible: true,
                },
                A1: {
                  label: "Draft",
                  visible: true,
                },
                A2: {
                  label: "Void",
                  visible: true,
                },
                A3: {
                  label: "History",
                  visible: true,
                },
                A4: {
                  visible: false,
                },
                A5: {
                  label: "Pending Approval",
                  visible: true,
                },
                A6: {
                  label: "Draft",
                  visible: true,
                },
                P1: {
                  label: "Draft",
                  visible: true,
                },
                P2: {
                  label: "Void",
                  visible: true,
                },
                P3: {
                  label: "History",
                  visible: true,
                },
                P4: {
                  visible: false,
                },
                P5: {
                  label: "Pending Approval",
                  visible: true,
                },
                P6: {
                  label: "Draft",
                  visible: true,
                },
              },
              schema: [
                {
                  name: "po-status-built-in",
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
                    {
                      text: "Cancelled",
                      value: "Cancelled",
                    },
                  ],
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  validationMode: "default",
                  validationAttribute: "PO Status",
                  deleteInFormDisabled: true,
                  applicableValidationSchema: true,
                },
                {
                  name: "po-supplier-built-in",
                  type: "supplier",
                  index: 1,
                  label: "Supplier ",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  validationMode: "default",
                  validationAttribute: "Supplier",
                  deleteInFormDisabled: true,
                  applicableValidationSchema: true,
                },
                {
                  name: "po-items-built-in",
                  type: "purchaseorder",
                  index: 2,
                  label: "Purchase Order",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  validationAttribute: "Purchase Order",
                  deleteInFormDisabled: true,
                  applicableValidationSchema: true,
                },
              ],
            },
          ],
          acctCodes: ["code 1", "code 2"],
          addresses: ["Address 1", "Address 2"],
        }, sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdCompany = response;
        adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
        secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
        supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
        formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
        purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order test");
        approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
        done();
      });
    });
  });

  context("[API]Create supplier document", () => {
    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Creates suplier document for PO", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Test Supplier Document</p>",
            document: {
              docId: "SUP-00003",
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
            name: "API supplier",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => {
          done();
        });
      });
    });
  });

  context("[API]Create PO form", () => {
    it("[API] Create PO record form", (done: any) => {
      cy.arGetArDocumentByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        name: "AR Form",
      }).then((response) => {
        initialArDocument = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Purchase order form record</p>",
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
            name: "Purchase Order form",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formTemplate: {
              outputDocumentTypes: [{
                id: purchaseOrderDocumentType[0].id,
              }],
              schema: purchaseOrderDefaultSchema,
            },

          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdPurchaseOrderFormDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: createdPurchaseOrderFormDocument.id,
            payload: {
              effectiveDate: (new Date()).toISOString(),
              documentType: { id: approvalRequestDocumentType[0].id },
              formDocument: { id: initialArDocument[0].id },
              approversWithSignatures: [{ approver: { id: secondEmployee.id } }],
            },
            employeeId: secondEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then(() => done());
        });
      });
    });
  });

  context("Create Purchase Order", () => {
    context("Log user to company", () => {
      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      });

      it("Go to Purchase Order module", () => {
        cy.navigToPurchaseOrder();
      });

      it("Click on 'Create PO' button", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
          cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order test" });
        });
      });

      context("Fill out PO fields", () => {
        it("Enter description 'New Purchase Order'", () => {
          cy.drEnterDocumentDescription({ description: "New Purchase Order" });
        });

        it("Select 'Open' for PO status", () => {
          cy.poSelectPOStatus({ status: "Open" });
        });

        it(`Select '${USERS[1].name}' for Requestor`, () => {
          cy.get("[data-cy^=requestor]").arrowClick();
          cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
        });

        it("Select 'SUP-00003' Supplier ", () => {
          cy.get("[data-cy=\"po-supplier-built-in\"]").autocompleteSelect("SUP-00003");
        });

        it("Select Order Date", () => {
          cy.get("input[name^=ordered]").parent().find("button").arrowClick();

          cy.get("button.MuiPickersDay-day[tabindex=\"0\"]").last().arrowClick();
        });
      });

      context("Add purchase order item", () => {
        it("Click on 'Add item' button to add item without Part Number", () => {
          cy.get("[data-cy=\"fb-control-btn\"]").last().arrowClick();
        });

        it("Enter Quantity Ordered", () => {
          cy.poEnterQuantityOrdered({ quantity: "2" });
        });

        it("Select Units", () => {
          cy.poSelectUnits();
        });

        it("Select GL code", () => {
          cy.poSelectGLCode();
        });

        it("Enter Supplier Part Number", () => {
          cy.poEnterSupplierPartNumber({ partNumber: "PRT-0004" });
        });

        it("Enter number of Units", () => {
          cy.poNumberOfUnits({ number: "10" });
        });

        it("Add Required Date", () => {
          cy.get("input[name^=date]").parent().find("button").arrowClick();
          cy.get("button.MuiPickersDay-day[tabindex=\"0\"]").last().arrowClick();
        });

        it("Check Tax box", () => {
          cy.poSelectTaxCheckbox();
        });

        it("Click on 'Add' inside PO dialog box", () => {
          cy.poAddPOButtonClick();
        });

        it("Clicks Save button", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });
  });

  context("Submit PO for Approval", () => {
    it("Add an Approval", () => {
      cy.get("[data-cy^=\"fb-po-approvals-\"]").arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get("ul>li[role=option]").contains(USERS[2].name).arrowClick();
      });
    });

    it("Click 'Submit for Approval' button", () => {
      cy.pmSubmitForApproval();
    });
  });

  context("Login as approver", () => {
    it("Login user to dashboard", () => {
      cy.authLogout();
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });

    it("Click approve for the Purchase Order", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PostApprovalsApprove], () => {
          cy.contains("needs your approval for").eq(0).trigger("mouseover");
          cy.get("[data-cy=\"transition-approve\"]").first().trigger("mouseover");
          cy.get("[data-cy=\"transition-approve\"]").first().arrowClick();
          cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
          cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
        });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });
  });

  context("Login as PO owner", () => {
    it("Login user to dashboard", () => {
      cy.authLogout();
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Dashboard shows that PO has been approved", () => {
      cy.contains(USERS[2].name).eq(0).parent().parent()
        .should("contain.text", "APPROVED")
        .and("contain.text", "POT-00001");
    });

    context("Verify email for approved PO", () => {


      it("Verify emails", () => {
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          // eslint-disable-next-line @typescript-eslint/camelcase
          wait_time_sec: 5,
          // eslint-disable-next-line @typescript-eslint/camelcase
          max_wait_time_sec: 50,
          // eslint-disable-next-line @typescript-eslint/camelcase
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

      it("Verify the emails that should be received", () => {
        const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
          {
            sentToUser: USERS[1].email,
            contains: [
              `Hello <b>${USERS[1].name},</b><br /><br />`,
              "Purchase Order <b>POT-00001</b> has been approved and released for company",
            ],
          }];

        cy.imapVerifyEmailsInList({
          receivedEmails: emailsFromInbox,
          emailsToTest: emailsThatShouldBeReceived,
          getEmailsSincedate: dateAfterEmailShouldArrive,
          assertNumberOfEmailsFoundInList: 1,
        });
      });
    });
  });
});
