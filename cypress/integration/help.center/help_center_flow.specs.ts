// / <reference types="Cypress" />

import { GroupTag } from "../../../src/state/ducks/auth/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let adminEmployee;

context("Help Center behaviour", () => {
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
    let equipmentDocumentType;
    let formDocumentType;
    let approvalRequestDocumentType;
    let loginResponse;
    let group;

    it("[API] Create company", (done: any) => {
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
            users: [USERS[2]],
            documentTypes: [
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          done();
        });
      });
    });

    it("[API] Login user", (done: any) => {
      cy.authApiLogin({
        email: adminEmployee.user.email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    context("[API] Add employee to developers group", () => {
      let developersGroup;

      it("[API] Get group", (done: any) => {
        cy.grpGetGroupByName({
          groupName: "Developers",
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
        }).then((response) => {
          developersGroup = response;
          done();
        });
      });

      it("[API] Patch group", () => {
        cy.grpPatchGroup({
          groupId: developersGroup.body[0].id,
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          payload: {
            employees: [{ id: adminEmployee.id }],
          },
        });
      });
    });

    it("[API] Update company navigation", (done: any) => {
      cy.cmpUpdateCompany({
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId,
        payload: {
          navigation: [
            {
              icon: "/navigation_icons/dashboard.svg",
              path: "/",
              type: "LINK",
              label: "Dashboard",
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              menu: [
                {
                  icon: "/navigation_icons/document.svg",
                  path: "/document_revision",
                  type: "LINK",
                  label: "Document List",
                },
                {
                  icon: "/navigation_icons/cr.svg",
                  path: "/change_request",
                  type: "LINK",
                  label: "Approval Requests",
                },
                {
                  icon: "/navigation_icons/text-paper.svg",
                  type: "CATEGORY",
                  label: "Records",
                  category: "Record",
                },
              ],
              type: "MENU",
              label: "Document Control",
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              type: "CATEGORY",
              label: "Equipment",
              category: "Equipment",
            },
            {
              icon: "/navigation_icons/supplier-menu.svg",
              menu: [
                {
                  icon: "/navigation_icons/supplier-list.svg",
                  type: "CATEGORY",
                  label: "Supplier List",
                  category: "Supplier",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
              ],
              type: "MENU",
              label: "Supplier Management",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/receipt_list.svg",
              type: "CATEGORY",
              label: "Purchase Orders",
              category: "Purchase Order",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/cart-simple-in.svg",
              type: "CATEGORY",
              label: "Receiving",
              category: "Receive",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/tools.svg",
              menu: [
                {
                  icon: "/navigation_icons/icon_parts.svg",
                  type: "CATEGORY",
                  label: "Parts",
                  category: "Parts",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
                {
                  icon: "/navigation_icons/todo.svg",
                  type: "CATEGORY",
                  label: "Work Orders",
                  category: "Work Order",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
                {
                  icon: "/navigation_icons/tag-check.svg",
                  type: "CATEGORY",
                  label: "Lots",
                  category: "Lot",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
                {
                  icon: "/navigation_icons/lhr_icon.svg",
                  type: "CATEGORY",
                  label: "LHR",
                  category: "Lhr",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
              ],
              type: "MENU",
              label: "Manufacturing",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/group-management.svg",
              path: "/group_management",
              type: "LINK",
              label: "Group Management",
              restrictedToUsersWithTags: [
                GroupTag.GROUP_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/user-management.svg",
              path: "/user_management",
              type: "LINK",
              label: "User Management",
              restrictedToUsersWithTags: [
                GroupTag.USER_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/receipt_list.svg",
              path: "/page_details_management",
              type: "LINK",
              label: "Page Details Management",
              restrictedToUsersWithTags: [
                GroupTag.PAGE_DETAILS_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              path: "/document_type_management",
              type: "LINK",
              label: "Document Type Management",
              restrictedToUsersWithTags: [
                GroupTag.DOCUMENT_TYPE_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/receipt_list.svg",
              menu: [
                {
                  icon: "/navigation_icons/computer.svg",
                  path: "/training",
                  type: "LINK",
                  label: "Training Records",
                },
                {
                  icon: "/navigation_icons/receipt_list.svg",
                  path: "/document_by_category/Training Curriculums",
                  type: "LINK",
                  label: "Training Curriculums",
                },
              ],
              type: "MENU",
              label: "Training",
            },
          ],
        },
      }).then(() => {
        done();
      });
    });

    context("[API] Prepare documents", () => {
      let initialArDocument;
      let createdEquipmentFormDocument;
      let createdEquipmentNumericRevision;

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
                description: "<p>Maintenance and Calibration form</p>",
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
                name: "Maintenance and calibration form document",
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
                      tabId: "overview",
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
                      tabId: "specification",
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
                      tabId: "specification",
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

      it("[API] Create Equipment document with Numeric revision", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Equipment document</p>",
            document: {
              docId: "EQ-00001",
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
            name: "Equipment document",
            formDocument: {
              id: createdEquipmentFormDocument.id,
            },
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formInput: {
              "fb-default-eq-status": "Active",
              "fb-primary-owner-eq": adminEmployee.id,
              "fb-coordinator-eq": adminEmployee.id,
            },
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdEquipmentNumericRevision = response;
          cy.drAPIApproveAndRelease({
            documentId: createdEquipmentNumericRevision.id,
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

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Verify general behaviour", () => {
    context("Navigation behaviour", () => {
      it("Open HelpCenter navigation", () => {
        cy.openHelpCenterNavigation();
      });
      it("Close HelpCenter navigation", () => {
        cy.closeHelpCenterNavigation();
      });
    });
    context("Content behaviour", () => {
      it("Open HelpCenter navigation", () => {
        cy.openHelpCenterNavigation();
      });

      it("Open HelpCenter content", () => {
        cy.openHelpCenterContent();
      });

      it("Close HelpCenter content", () => {
        cy.closeHelpCenterContent();
      });

      it("Verify HelpCenter navigation visibility", () => {
        cy.get("[data-cy='help-center.navigation'", { timeout: 500 }).should("not.exist");
      });
    });
  });

  context("Verify static links behaviour", () => {
    it("Open HelpCenter navigation", () => {
      cy.openHelpCenterNavigation();
    });

    it("Check HelpCenter navigation links", () => {
      cy.get("[data-cy='help-center.navigation'] a[role='menuitem']")
        .each((link) => {
          cy.wrap(link.closest("a"))
            .should("have.attr", "target", "_blank")
            .should("have.attr", "rel", "noopener noreferrer")
            .should("have.attr", "href");
        });
    });

    it("Close HelpCenter navigation", () => {
      cy.closeHelpCenterNavigation();
    });
  });

  context("Verify behaviour for non-existing module", () => {
    it("Navigate to Page Details Management", () => {
      cy.navigToPageDetailsManagement();
    });

    it("Open HelpCenter navigation", () => {
      cy.openHelpCenterNavigation();
    });

    it("Veriyf Help Guides Link is external", () => {
      cy.get("[data-cy='help-center.content-opener']").closest("a")
        .should("have.attr", "target", "_blank")
        .should("have.attr", "rel", "noopener noreferrer")
        .should("have.attr", "href");
    });

    it("Close HelpCenter navigation", () => {
      cy.closeHelpCenterNavigation();
    });
  });

  context("Verify visibily behaviour", () => {
    context("Should close when navigating to other module", () => {
      it("Navigate to Dashboard", () => {
        cy.navigToDashboard();
      });

      it("Open HelpCenter navigation", () => {
        cy.openHelpCenterNavigation();
      });

      it("Open HelpCenter content", () => {
        cy.openHelpCenterContent();
      });

      it("Navigate to Documents", () => {
        cy.navigToDocumentList();
      });

      it("Verify that HelpCenter is closed", () => {
        cy.checkIfHelpCenterClosed();
      });
    });

    context("Should stay opened when navigating within current module", () => {
      context("Within Approval Request", () => {
        let helpCenterTitle: string;

        it("Navigate to Approval Request List", () => {
          cy.navigToApprovalRequestList();
        });

        it("Open HelpCenter navigation", () => {
          cy.openHelpCenterNavigation();
        });

        it("Open HelpCenter content", () => {
          cy.openHelpCenterContent();
        });

        it("Remember HelpCenter content title", () => {
          cy.get("[data-cy='help-center.content-title']").then((title) => {
            helpCenterTitle = title.text();
          });
        });

        it("Navigate to AR document", () => {
          cy.dlClearFilters();
          cy.dlSelectFirstDocumentItem();
        });

        it("Verify HelpCenter state", () => {
          cy.verifyHelpCenterTitle(helpCenterTitle);
        });
      });

      context("Within Equipment", () => {
        let helpCenterTitle: string;

        it("Navigate to Equipment List", () => {
          cy.navigToEquipment();
        });

        it("Open HelpCenter navigation", () => {
          cy.openHelpCenterNavigation();
        });

        it("Open HelpCenter content", () => {
          cy.openHelpCenterContent();
        });

        it("Remember HelpCenter content title", () => {
          cy.get("[data-cy='help-center.content-title']").then((title) => {
            helpCenterTitle = title.text();
          });
        });

        it("Navigate to Equipment document", () => {
          cy.dlClearFilters();
          cy.dlSelectFirstDocumentItem();
        });

        it("Verify HelpCenter state", () => {
          cy.verifyHelpCenterTitle(helpCenterTitle);
        });

        it("Go back in browser", () => {
          cy.go("back");
        });

        it("Verify HelpCenter state", () => {
          cy.verifyHelpCenterTitle(helpCenterTitle);
        });
      });
    });
  });
});
