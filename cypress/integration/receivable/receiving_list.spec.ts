// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { GroupTag } from "../../../src/state/ducks/auth";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { NavigationItems } from "../../utils/constants/navigationItems";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
let adminEmployee;
let secondEmployee;
let purchaseOrderDocumentType;
let formDocumentType;
let receivableDocumentType;
let group;
let approvalRequestDocumentType;
let initialArDocument;
let createdPOFormDocument;
let createdPODocument;
let createdRecivableFormDocument;
let createdReceivable1;

context("Receivable list test", () => {
  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      SystemRequirement("REQ-0400", "REQ-0420", "REQ-0440");
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
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order");
          receivableDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Receivable");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    it("[API]Create receivables", (done: any) => {
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
              name: "PO Form document",
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
                  description: "API PO document",
                  revisionChangeType: RevisionChangeType.NextRevision,
                  document: {
                    docId: "PO-00001",
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
                  cy.drCreateDocumentRevision({
                    payload: {
                      attachments: [],
                      description: "<p>document form for Receivable</p>",
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
                      name: "Receivable form",
                      referenceTo: [],
                      retrain: false,
                      revisionChangeType: RevisionChangeType.NextRevision,
                      revisionStage: 1,
                      formTemplate: {
                        outputDocumentTypes: [{
                          id: receivableDocumentType[0].id,
                        }],
                        schema: [{
                          index: 0,
                          type: "poreceive",
                          label: "Receivable",
                          name: "receivable-kdptzei2",
                          applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                        }],
                      },
                    },
                    employeeId: adminEmployee.id as unknown as string,
                    sessionId: loginResponse.sessionId as unknown as string,
                  }).then((response) => {
                    createdRecivableFormDocument = response;
                    cy.drAPIApproveAndRelease({
                      documentId: createdRecivableFormDocument.id,
                      payload: {
                        effectiveDate: (new Date()).toISOString(),
                        documentType: { id: approvalRequestDocumentType[0].id },
                        formDocument: { id: initialArDocument[0].id },
                        approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
                      },
                      employeeId: adminEmployee.id,
                      sessionId: loginResponse.sessionId,
                    }).then(() => {
                      cy.recAPICreateReceivable({
                        payload: {
                          name: "",
                          description: "",
                          attachments: [],
                          referenceTo: [],
                          formDocument: { id: createdRecivableFormDocument.id },
                          revisionChangeType: RevisionChangeType.NextRevision,
                          document: {
                            docId: "RC-00005",
                            documentType: {
                              id: receivableDocumentType[0].id,
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
                            "receivable-kdptzei2": createdPODocument.id,
                          },
                        },
                        employeeId: adminEmployee.id,
                        sessionId: loginResponse.sessionId,
                      }).then((response) => {
                        createdReceivable1 = response;
                        cy.drAPIApproveAndRelease({
                          documentId: createdReceivable1.id,
                          payload: {
                            effectiveDate: (new Date()).toISOString(),
                            documentType: { id: approvalRequestDocumentType[0].id },
                            formDocument: { id: initialArDocument[0].id },
                            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
                          },
                          employeeId: adminEmployee.id,
                          sessionId: loginResponse.sessionId,
                        }).then(() => {
                          cy.recAPICreateReceivable({
                            payload: {
                              name: "",
                              description: "",
                              attachments: [],
                              referenceTo: [],
                              formDocument: { id: createdRecivableFormDocument.id },
                              revisionChangeType: RevisionChangeType.NextRevision,
                              document: {
                                docId: "RC-00006",
                                documentType: {
                                  id: receivableDocumentType[0].id,
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
                                "receivable-kdptzei2": createdPODocument.id,
                              },
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
            });
          });
        });
      });
    });
  });

  context("Login user", () => {
    context("Login user when he doesn't have privileges", () => {
      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[2].email,
          password: "Tester1!",
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });
    });

    context("Check for access to receivable list", () => {
      it("Verify user can't access receivable list", () => {
        // SystemRequirement("REQ-1700");
        cy.navigListNotExistsCheck( NavigationItems.RECEIVING );
      });
    });

    context("Create group with privilages to restricted doc types", () => {
      it("Create group with permission to access receivable list", () => {
        // SystemRequirement("REQ-1700");
        cy.grpAPICreateNewGroup({
          payload: {
            name: "Group with access to restricted doc types",
            tags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
            permissions: [],
            employees: [{ id: secondEmployee.id }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        });
      });
    });

    context("Login user when he does have privileges", () => {
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

    context("Check for access to receivable list", () => {
      it("Verify user can access receivable list", () => {
        // SystemRequirement("REQ-1700");
        cy.navigListExistsCheck( NavigationItems.RECEIVING );
      });
    });
  });

  context("Check for default receivable filter", () => {
    it("Navigate to receivable list", () => {
      cy.navigToReceivableList();
    });

    // it.skip("Verify receivable list defaults to show receivables in DRAFT status", () => {
    //   // SystemRequirement("REQ-1720");
    //   cy.recVerifyStartingFilter();
    // });
  });

  context("Check for displaying default columns", () => {
    it("Verify receivable id is present", () => {
      // SystemRequirement("REQ-1680");
      cy.recVerifyFilterByReceivableId({ recId: "RC-00006" });
    });

    // it.skip("Verify supplier name is present", () => {
    //   fail;
    // });

    it("Verify owner is present", () => {
      // SystemRequirement("REQ-1680");
      cy.recVerifyFilterByOwner({ owner: USERS[1].name });
    });

    it("Verify record state is present", () => {
      // SystemRequirement("REQ-1680");
      cy.recVerifyFilterByState({ state: "DRAFT" });
    });

    // it.skip("Verify approval date is present", () => {
    //   // SystemRequirement("REQ-1680");
    //   cy.recVerifyFilterByState({ state: "DRAFT" });
    //   fail;
    // });
  });

  context("Edit receivable", () => {
    it("Filter receivable list by id", () => {
      cy.recFilterByReceivableId({ id: "RC-00005" });
    });

    it("Enter first receivable on list", () => {
      // SystemRequirement("REQ-1780");
      cy.recClickOnFirstReceivableOnList();
    });

    it("Click on update record", () => {
      cy.recClickUpdateRecord();
    });

    it("Click on save record", () => {
      cy.recClickSaveBtn();
    });

    it("Approve and release", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Verify last edited receivable is first on list", () => {
    it("Navigate to receivable list", () => {
      cy.navigToReceivableList();
    });

    it("Verify last edited receivable is first on list", () => {
      // SystemRequirement("REQ-1740");
      cy.dlClearFilters();
      cy.recVerifyFilterByReceivableId({ recId: "RC-00005" });
    });
  });

  context("Check for filters", () => {
    context("Verify filter by receivable id", () => {
      it("Filter list by id 'RC-00006'", () => {
        cy.recFilterByReceivableId({ id: "RC-00006" });
      });

      it("Verify filter by receivable id", () => {
        // SystemRequirement("REQ-1710");
        cy.recVerifyFilterByReceivableId({ recId: "RC-00006" });
      });

      it("Verify receivable counter on document list", () => {
        // SystemRequirement("REQ-1760");
        cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      });
    });

    context("Verify filter by owner", () => {
      it("Clear filter", () => {
        cy.dlClearFilters();
      });

      it(`Filter list by owner '${USERS[1].name}'`, () => {
        cy.recFilterByOwner({ owner: USERS[1].name });
      });

      it("Verify filter by owner", () => {
        // SystemRequirement("REQ-1710");
        cy.recVerifyFilterByOwner({ owner: USERS[1].name });
      });

      it("Verify receivable counter on document list", () => {
        // SystemRequirement("REQ-1760");
        cy.dlVerifyDocCounter({ docCounterNumber: 2 });
      });
    });

    context("Verify filter by state", () => {
      it("Clear filter", () => {
        cy.dlClearFilters();
      });

      it("Filter list by state 'DRAFT'", () => {
        cy.recFilterByState({ state: "Draft" });
      });

      it("Verify filter by state", () => {
        // SystemRequirement("REQ-1710");
        cy.recVerifyFilterByState({ state: "DRAFT" });
      });

      it("Verify receivable counter on document list", () => {
        // SystemRequirement("REQ-1760");
        cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      });
    });

    context("Verify filter by approval id", () => {
      it("Clear filter", () => {
        cy.dlClearFilters();
      });

      it("Filter list by approval id 'AR00005'", () => {
        cy.recFilterByARId({ arId: "AR00005" });
      });

      it("Verify filter by approval id", () => {
        // SystemRequirement("REQ-1710");
        cy.recVerifyFilterByARId({ arId: "AR00005" });
      });

      it("Verify receivable counter on document list", () => {
        // SystemRequirement("REQ-1760");
        cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      });
    });

    context("Verify clear filter option", () => {
      it("Clear filter", () => {
        cy.dlClearFilters();
      });

      it("Verify filter clear", () => {
        // SystemRequirement("REQ-1750");
        cy.recVerifyFilterClear();
      });
    });

    context("Verify filter settings are maintained after navigating away", () => {
      it("Filter list", () => {
        cy.recFilterByOwner({ owner: USERS[1].name });
        cy.recFilterByReceivableId({ id: "RC-00006" });
      });

      it("Navigate to dashboard", () => {
        cy.navigToDashboard();
      });

      it("Navigate back to receivables list", () => {
        cy.navigToReceivableList();
      });

      it("Verify filter by owner", () => {
        // SystemRequirement("REQ-1730");
        cy.recVerifyFilterByOwner({ owner: USERS[1].name });
      });

      it("Verify filter by receivable id", () => {
        // SystemRequirement("REQ-1730");
        cy.recVerifyFilterByReceivableId({ recId: "RC-00006" });
      });
    });
  });

});
