// / <reference types="Cypress" />

import { GroupTag } from "../../../src/state/ducks/auth/types";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let adminEmployee;

context("Help Center custom content", () => {
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
    let loginResponse;
    let poPageDetailsId;
    const COLUMN_HEADERS = [
      "PO #",
      "REVISION",
      "PO STATUS",
      "PO STATE",
      "SUPPLIER",
      "PART NUMBER",
      "AMOUNT",
      "REQUESTOR",
      "ORDER DATE",
    ];

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

      it("[API] Patch page details", (done: any) => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/page_details`,
          qs: {
            category: "Purchase Order",
          },
          headers: {
            Authorization: `bearer ${adminEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
          if (response.body) {
            poPageDetailsId = response.body[0].id;
          }
        }).then(() => {
          cy.intercept({ method: "PATCH", pathname: "/api/v1/page_details/*" }).as("response");
          cy.cmpUpdatePageDetails({
            id: poPageDetailsId,
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
                  fn: "DOCUMENT_REVISION_VERSION",
                  label: COLUMN_HEADERS[1],
                  fieldName: "irrelevant",
                  showOnWeb: true,
                  valuePath: "precalc.version",
                  sourcePath: [
                    "revisionStage:revision",
                  ],
                  showOnAndroid: true,
                },
                {
                  fn: "PO_STATUS_FROM_PURCHASE_ORDER",
                  label: COLUMN_HEADERS[2],
                  fieldName: "irrelevant",
                  showOnWeb: true,
                  valuePath: "precalc.po_status",
                  sourcePath: [
                    "formDocument.formTemplate.schema",
                  ],
                  showOnAndroid: true,
                },
                {
                  label: COLUMN_HEADERS[3],
                  fieldName: "irrelevant",
                  showOnWeb: true,
                  valuePath: "displayStatus",
                  showOnAndroid: true,
                },
                {
                  fn: "SUPPLIER_NAME_FROM_PURCHASE_ORDER",
                  label: COLUMN_HEADERS[4],
                  fieldName: "irrelevant",
                  showOnWeb: true,
                  valuePath: "precalc.supplier",
                  sourcePath: [
                    "formDocument.formTemplate.schema",
                  ],
                  showOnAndroid: true,
                },
                {
                  fn: "PO_PART_NUMBER_FROM_PURCHASE_ORDER",
                  label: COLUMN_HEADERS[5],
                  fieldName: "irrelevant",
                  showOnWeb: true,
                  valuePath: "precalc.po_partNumber",
                  sourcePath: [
                    "formDocument.formTemplate.schema",
                  ],
                  showOnAndroid: true,
                },
                {
                  fn: "PO_AMOUNT_FROM_PURCHASE_ORDER",
                  label: COLUMN_HEADERS[6],
                  fieldName: "irrelevant",
                  showOnWeb: true,
                  valuePath: "precalc.po_amount",
                  sourcePath: [
                    "formDocument.formTemplate.schema",
                  ],
                  showOnAndroid: true,
                },
                {
                  fn: "USER_NAME",
                  label: COLUMN_HEADERS[7],
                  fieldName: "irrelevant",
                  showOnWeb: true,
                  valuePath: "precalc.po-requestor-autocomplete",
                  sourcePath: [
                    "formInput.po-requestor-autocomplete",
                    "formInput.po-requestor-autocomplete",
                  ],
                  showOnAndroid: true,
                },
                {
                  fn: "DATE_FORMAT_MM_DD_YYYY",
                  label: COLUMN_HEADERS[8],
                  fieldName: "irrelevant",
                  showOnWeb: true,
                  valuePath: "precalc.order-date-formatted",
                  sourcePath: [
                    "formInput.ordered-k6mlhan7",
                    "formInput.po-order-date",
                  ],
                  showOnAndroid: true,
                },
              ],
            },
            employeeId: adminEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then(() => done());
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
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Verify help content assigment to module", () => {
    let helpCenterTitle;

    context("Get HelpCenter state to compare", () => {
      it("Navigate to Purchase Orders", () => {
        cy.navigToPurchaseOrder();
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
    });

    context("Change help content for Purchase Orders", () => {
      it("Navigate to Page Details Management", () => {
        cy.navigToPageDetailsManagement();
      });

      it("Set custom help content for Purchase Order", () => {
        cy.get("[data-cy='page-detail.purchaseOrder']").arrowClick();
        cy.get("[data-cy='select.helpModule']").arrowClick();
        cy.get("[data-cy='selectItem.helpModule.General']").arrowClick();
        cy.get("[data-cy='submit.purchaseOrder']").arrowClick();
      });
    });

    context("Verify HelpCenter state", () => {
      it("Navigate to Purchase Orders", () => {
        cy.navigToPurchaseOrder();
      });

      it("Open HelpCenter navigation", () => {
        cy.openHelpCenterNavigation();
      });

      it("Open HelpCenter content", () => {
        cy.openHelpCenterContent();
      });

      it("Verify changed HelpCenter content title", () => {
        cy.verifyHelpCenterTitle(helpCenterTitle, "not.have.text");
      });
    });
  });
});
