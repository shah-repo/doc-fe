/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
// / <reference types="Cypress" />
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { CONFIG } from "../../support/config";
import { FONT_SIZE_12, FONT_SIZE_12_8, FONT_SIZE_13, FONT_SIZE_14, FONT_WT_400, FONT_WT_600, FONT_WT_700, LINE_HT_17_1419, LINE_HT_18_304, LINE_HT_19_5, LINE_HT_20, LINE_HT_21, soraSansserif, TEXT_TRANS_UPPER } from "../../utils/constants/fonts_constants";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let multipleCompanies;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let employeeLoginFirst;
let createdCompanyA;
let loginResponse;
let developersGroup;
const arID = "AR ID";
const arTitle = "AR TITLE";
const owner = "OWNER";
const status = "STATUS";
const suppId = "SUPPLIER ID";
const suppName = "SUPPLIER NAME";
const suppLevel = "SUPPLIER LEVEL";
const suppStatus = "SUPPLIER STATUS";
const state = "STATE";
const appId = "APPROVAL ID";
const recId = "RECEIVE ID";
const docTitle = "DOCUMENT TITLE";
const ebId = "EB ID";
const revision = "REVISION";
const title = "TITLE";
const relDate = "RELEASED DATE";
const formId = "FORM ID";
const partId = "PART ID";
const docType = "DOCUMENT TYPE";
const acronym = "ACRONYM";
const privateNumberPool = "PRIVATE NUMBER POOL";
const redline = "REDLINE";
const qms = "QMS";
const needsSign = "NEEDS SIGNATURE";
const training = "TRAINING";
const startNumber = "STARTING NUMBER";
const revStage = "REVISION STAGE";
const usersWithoutTags = "USERS WITHOUT TAGS";
const group = "GROUP";
const eqProdEnforce = "EQUIPMENT PROD ENFORCE";
const category = "CATEGORY";
const schema = "SCHEMA";
const fieldConfig = "FIELDS CONFIG";

context("User Creation Flow", () => {
  context("[API]Prepare company A", () => {
    it("[API]Creates company A", (done: any) => {
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
          createdCompanyA = response;
          employeeLoginFirst = createdCompanyA.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: loginResponse.sessionId,
        employeeId: employeeLoginFirst.id,
      }).then((response) => {
        developersGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: employeeLoginFirst.id,
        payload: {
          employees: [{ id: employeeLoginFirst.id }],
          tags: [...developersGroup.body[0].tags,
            GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
            GroupTag.NAVIGATION_WITH_RESTRICTED_DOC_TYPES,
          ],
        },
      });
    });

    it("[API]API request for updating company navigation", (done: any) => {
      cy.cmpUpdateCompany({
        employeeId: employeeLoginFirst.id,
        sessionId: loginResponse.sessionId as unknown as string,
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
                  icon: "/navigation_icons/eb_icon.svg",
                  type: "CATEGORY",
                  label: "Engineering Builds",
                  category: "EB",
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
              icon: "/navigation_icons/document-menu.svg",
              path: "/document_type_management",
              type: "LINK",
              label: "Document Type Management",
              restrictedToUsersWithTags: [
                GroupTag.DOCUMENT_TYPE_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              path: "/page_details_management",
              type: "LINK",
              label: "Page Details Management",
              restrictedToUsersWithTags: [
                GroupTag.PAGE_DETAILS_MANAGEMENT,
              ],
            },
          ],
        },
      }).then(() => {
        done();
      });
    });

    it("[API]POST EB page details", (done: any) => {
      cy.request({
        method: "POST",
        url: `${CONFIG.BE_URL}/api/v1/page_details`,
        headers: {
          Authorization: `bearer ${employeeLoginFirst.id}:${loginResponse.sessionId}`,
        },
        body: {
          category: "EB",
          addNewBtnLabel: "Create Engineering Build",
          config: {},
          columns: [
            {
              label: "EB ID",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "document.docId",
              showOnAndroid: true,
            },
            {
              fn: "DOCUMENT_REVISION_VERSION",
              label: "Revision",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "precalc.revision",
              sourcePath: ["revisionStage:revision"],
              showOnAndroid: true,
            },
            {
              label: "State",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "status",
              showOnAndroid: true,
            },
            {
              label: "Title",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "name",
              showOnAndroid: true,
            },
            {
              label: "Owner",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "owner.user.name",
              showOnAndroid: true,
            },
            {
              label: "Released Date",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "releasedAt",
              showOnAndroid: true,
            },
            {
              fn: "FORM_DOC_ID",
              label: "Form ID",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "precalc.formDocId",
              sourcePath: ["irrelevant"],
              showOnAndroid: true,
            },
            {
              fn: "PART_ID_FROM_EB",
              label: "Part ID",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "precalc.partFromEb",
              sourcePath: ["irrelevant"],
              showOnAndroid: true,
            },
          ],
        },
      }).then(() =>  done());
    });
  });

  context("Login with admin user", () => {
    it("Logs user in", () => {
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompanyA.name, multiple: true });
    });
  });


  context("Approval Requests", () => {
    context("Navigate to Approval Requests", () => {
      it("Navigate to Approval Requests", () => {
        cy.navigToApprovalRequestList();
      });
    });

    context("Verify font for nagigation bar 'Approval Requests'", () => {
      it(`Verify 'Approval Requests' font-size ${FONT_SIZE_13} and font-family ${soraSansserif} line-height ${LINE_HT_19_5} font-weight ${FONT_WT_400}`, () => {
        cy.get(`[data-cy="navigation.approvalRequests"]>span>span`).should("have.css", "font-size", "13px")
          .and("have.css", "font-family", "Sora, sans-serif")
          .and("have.css", "font-weight", "700")
          .and("have.css", "line-height", "19.5px");
      });
    });

    context("Verify font for 'Create an Approval Request' button", () => {
      it(`Verify 'Create an Approval Request' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"change.request.create\"]")
          .checkStylePropExists({
            content: "Create an Approval Request",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for 'Export list' button", () => {
      it(`Verify 'Export list' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"document.revision.export.list\"]")
          .checkStylePropExists({
            content: "Export list",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for 'Clear Filters' button", () => {
      it(`Verify 'Clear Filters' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"clearFilter\"]")
          .checkStylePropExists({
            content: "Clear Filters",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for Landing page table columns headers", () => {
      it(`Verify ${arID} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: arID,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${arTitle} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: arTitle,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${owner} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: owner,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${status} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: status,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });
    });

    context("Verify font for 'Drag & drop column header to group'", () => {
      it(`Verify 'Drag & drop column header to group' font-size ${FONT_SIZE_12} and font-family ${soraSansserif} line-height ${LINE_HT_17_1419} font-weight ${FONT_WT_400}`, () => {
        cy.checkStylePropExists({
          content: "Drag & drop column header to group",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_17_1419, "font-weight": FONT_WT_400 },
        });
      });
    });
  });

  context("Supplier List", () => {
    context("Navigate to Supplier List", () => {
      it("Navigate to Supplier List", () => {
        cy.navigToSuppliers();
      });
    });

    context("Verify font for nagigation bar 'Supplier List'", () => {
      it(`Verify 'Supplier List' font-size ${FONT_SIZE_13} and font-family ${soraSansserif} line-height ${LINE_HT_19_5} font-weight ${FONT_WT_400}`, () => {
        cy.get(`[data-cy="navigation.supplierList"]>span>span`).should("have.css", "font-size", "13px")
          .and("have.css", "font-family", "Sora, sans-serif")
          .and("have.css", "font-weight", "700")
          .and("have.css", "line-height", "19.5px");
      });
    });

    context("Verify font for 'Add new Supplier' button", () => {
      it(`Verify 'Add new Supplier' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[id=\"DocumentByTypeListPresenter-openDocRev\"]")
          .checkStylePropExists({
            content: "Add new Supplier",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for 'Export list' button", () => {
      it(`Verify 'Export list' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"document.revision.export.list\"]")
          .checkStylePropExists({
            content: "Export list",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for 'Clear Filters' button", () => {
      it(`Verify 'Clear Filters' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"clearFilter\"]")
          .checkStylePropExists({
            content: "Clear Filters",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for Landing page table columns headers", () => {
      it(`Verify ${suppId} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: suppId,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${suppName} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: suppName,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${suppLevel} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: suppLevel,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${suppStatus} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: suppStatus,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${state} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: state,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${owner} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: owner,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${appId} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: appId,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });
    });

    context("Verify font for 'Drag & drop column header to group'", () => {
      it(`Verify 'Drag & drop column header to group' font-size ${FONT_SIZE_12} and font-family ${soraSansserif} line-height ${LINE_HT_17_1419} font-weight ${FONT_WT_400}`, () => {
        cy.checkStylePropExists({
          content: "Drag & drop column header to group",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_17_1419, "font-weight": FONT_WT_400 },
        });
      });
    });
  });

  context("Receiving", () => {
    context("Navigate to Receiving", () => {
      it("Navigate to Receiving", () => {
        cy.navigToReceivableList();
      });
    });

    context("Verify font for nagigation bar 'Receiving'", () => {
      it(`Verify 'Receiving' font-size ${FONT_SIZE_13} and font-family ${soraSansserif} line-height ${LINE_HT_19_5} font-weight ${FONT_WT_400}`, () => {
        cy.get(`[data-cy="navigation.receiving"]>span>span`).should("have.css", "font-size", "13px")
          .and("have.css", "font-family", "Sora, sans-serif")
          .and("have.css", "font-weight", "700")
          .and("have.css", "line-height", "19.5px");
      });
    });

    context("Verify font for 'Add new Receiving' button", () => {
      it(`Verify 'Add new Receiving' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[id=\"DocumentByTypeListPresenter-openDocRev\"]")
          .checkStylePropExists({
            content: "Add new Receiving",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for 'Export list' button", () => {
      it(`Verify 'Export list' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"document.revision.export.list\"]")
          .checkStylePropExists({
            content: "Export list",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for 'Clear Filters' button", () => {
      it(`Verify 'Clear Filters' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"clearFilter\"]")
          .checkStylePropExists({
            content: "Clear Filters",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for Landing page table columns headers", () => {
      it(`Verify ${recId} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: recId,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${docTitle} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: docTitle,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${owner} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: owner,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${state} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: state,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${appId} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: appId,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });
    });

    context("Verify font for 'Drag & drop column header to group'", () => {
      it(`Verify 'Drag & drop column header to group' font-size ${FONT_SIZE_12} and font-family ${soraSansserif} line-height ${LINE_HT_17_1419} font-weight ${FONT_WT_400}`, () => {
        cy.checkStylePropExists({
          content: "Drag & drop column header to group",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_17_1419, "font-weight": FONT_WT_400 },
        });
      });
    });
  });

  context("Engineering Build", () => {
    context("Navigate to Engineering Build", () => {
      it("Navigate to Engineering Build", () => {
        cy.navigToEB();
      });
    });

    context("Verify font for nagigation bar 'Engineering Build'", () => {
      it(`Verify 'Engineering Build' font-size ${FONT_SIZE_13} and font-family ${soraSansserif} line-height ${LINE_HT_19_5} font-weight ${FONT_WT_700}`, () => {
        cy.get(`[data-cy="navigation.engineeringBuilds"]>span>span`).should("have.css", "font-size", "13px")
          .and("have.css", "font-family", "Sora, sans-serif")
          .and("have.css", "font-weight", "700")
          .and("have.css", "line-height", "19.5px");
      });
    });

    context("Verify font for 'Create Engineering Build' button", () => {
      it(`Verify 'Create Engineering Build' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[id=\"DocumentByTypeListPresenter-openDocRev\"]")
          .checkStylePropExists({
            content: "Create Engineering Build",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for 'Export list' button", () => {
      it(`Verify 'Export list' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"document.revision.export.list\"]")
          .checkStylePropExists({
            content: "Export list",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for 'Clear Filters' button", () => {
      it(`Verify 'Clear Filters' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"clearFilter\"]")
          .checkStylePropExists({
            content: "Clear Filters",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for Landing page table columns headers", () => {
      it(`Verify ${ebId} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: ebId,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${revision} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: revision,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${state} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: state,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${title} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: title,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${owner} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: owner,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${relDate} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: relDate,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${formId} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: formId,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${partId} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: partId,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });
    });

    context("Verify font for 'Drag & drop column header to group'", () => {
      it(`Verify 'Drag & drop column header to group' font-size ${FONT_SIZE_12} and font-family ${soraSansserif} line-height ${LINE_HT_17_1419} font-weight ${FONT_WT_400}`, () => {
        cy.checkStylePropExists({
          content: "Drag & drop column header to group",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_17_1419, "font-weight": FONT_WT_400 },
        });
      });
    });
  });

  context("Document Type Management", () => {
    context("Navigate to Document Type Management", () => {
      it("Navigate to Document Type Management", () => {
        cy.navigToDocTypeManagement();
      });
    });

    context("Verify font for nagigation bar 'Document Type Management'", () => {
      it(`Verify 'Document Type Management' font-size ${FONT_SIZE_13} and font-family ${soraSansserif} line-height ${LINE_HT_19_5} font-weight ${FONT_WT_700}`, () => {
        cy.get(`[data-cy="navigation.documentTypeManagement"]>span>span`).should("have.css", "font-size", "13px")
          .and("have.css", "font-family", "Sora, sans-serif")
          .and("have.css", "font-weight", "700")
          .and("have.css", "line-height", "19.5px");
      });
    });

    context("Verify font for 'Add Document Type' button", () => {
      it(`Verify 'Add Document Type' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get(`[data-cy="Add-DocumentType-Button"]`)
          .checkStylePropExists({
            content: "Add Document Type",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for 'Export DAM Details' button", () => {
      it(`Verify 'Export DAM Details' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"Export-Dam-Button\"]")
          .checkStylePropExists({
            content: "Export DAM Details",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for 'Clear Filters' button", () => {
      it(`Verify 'Clear Filters' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.contains("button", "Clear Filters")
          .checkStylePropExists({
            content: "Clear Filters",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for Landing page table columns headers", () => {
      it(`Verify ${docType} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: docType,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${status} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: status,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${acronym} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: acronym,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${privateNumberPool} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: privateNumberPool,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${redline} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: redline,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${qms} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: qms,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${needsSign} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: needsSign,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${training} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: training,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${startNumber} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: startNumber,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${revStage} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: revStage,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${usersWithoutTags} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: usersWithoutTags,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${group} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: group,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${eqProdEnforce} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: eqProdEnforce,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${category} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: category,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${schema} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: schema,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${fieldConfig} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: fieldConfig,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });
    });

    context("Verify font for 'Drag & drop column header to group'", () => {
      it(`Verify 'Drag & drop column header to group' font-size ${FONT_SIZE_12} and font-family ${soraSansserif} line-height ${LINE_HT_17_1419} font-weight ${FONT_WT_400}`, () => {
        cy.checkStylePropExists({
          content: "Drag & drop column header to group",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_17_1419, "font-weight": FONT_WT_400 },
        });
      });
    });
  });

  context("Page Details Management", () => {
    context("Navigate to Page Details Management", () => {
      it("Navigate to Page Details Management", () => {
        cy.navigToPageDetailsManagement();
      });
    });

    context("Verify font for nagigation bar 'Page Details Management'", () => {
      it(`Verify 'Page Details Management' font-size ${FONT_SIZE_13} and font-family ${soraSansserif} line-height ${LINE_HT_19_5} font-weight ${FONT_WT_700}`, () => {
        cy.get(`[data-cy="navigation.pageDetailsManagement"]>span>span`).should("have.css", "font-size", "13px")
          .and("have.css", "font-family", "Sora, sans-serif")
          .and("have.css", "font-weight", "700")
          .and("have.css", "line-height", "19.5px");
      });
    });

    context("Verify font for 'Add Page Details' button", () => {
      it(`Verify 'Add Page Details' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.checkStylePropExists({
          content: "Add Page Details",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
      });
    });

    context("Verify font for Landing page table row headers", () => {
      it(`Verify Bulk Create font-size ${FONT_SIZE_12_8} font-family ${soraSansserif}  line-height ${LINE_HT_18_304} font-weight ${FONT_WT_400}`, () => {
        cy.get(`th[scope="row"]`).eq(0)
          .checkStylePropExists({
            content: "Bulk Create",
            props: { "font-size": FONT_SIZE_12_8, "font-family": soraSansserif, "line-height": LINE_HT_18_304, "font-weight": FONT_WT_400 },
          });
      });

      it(`Verify EB font-size ${FONT_SIZE_12_8} font-family ${soraSansserif}  line-height ${LINE_HT_18_304} font-weight ${FONT_WT_400}`, () => {
        cy.get(`th[scope="row"]`).eq(1)
          .checkStylePropExists({
            content: "EB",
            props: { "font-size": FONT_SIZE_12_8, "font-family": soraSansserif, "line-height": LINE_HT_18_304, "font-weight": FONT_WT_400 },
          });
      });

      it(`Verify Lhr font-size ${FONT_SIZE_12_8} font-family ${soraSansserif}  line-height ${LINE_HT_18_304} font-weight ${FONT_WT_400}`, () => {
        cy.get(`th[scope="row"]`).eq(3)
          .checkStylePropExists({
            content: "Lhr",
            props: { "font-size": FONT_SIZE_12_8, "font-family": soraSansserif, "line-height": LINE_HT_18_304, "font-weight": FONT_WT_400 },
          });
      });

      it(`Verify Lot Inspection font-size ${FONT_SIZE_12_8} font-family ${soraSansserif}  line-height ${LINE_HT_18_304} font-weight ${FONT_WT_400}`, () => {
        cy.get(`th[scope="row"]`).eq(5)
          .checkStylePropExists({
            content: "Lot Inspection",
            props: { "font-size": FONT_SIZE_12_8, "font-family": soraSansserif, "line-height": LINE_HT_18_304, "font-weight": FONT_WT_400 },
          });
      });

      it(`Verify Receive font-size ${FONT_SIZE_12_8} font-family ${soraSansserif}  line-height ${LINE_HT_18_304} font-weight ${FONT_WT_400}`, () => {
        cy.get(`th[scope="row"]`).eq(8)
          .checkStylePropExists({
            content: "Receive",
            props: { "font-size": FONT_SIZE_12_8, "font-family": soraSansserif, "line-height": LINE_HT_18_304, "font-weight": FONT_WT_400 },
          });
      });

      it(`Verify Training Curriculums font-size ${FONT_SIZE_12_8} font-family ${soraSansserif}  line-height ${LINE_HT_18_304} font-weight ${FONT_WT_400}`, () => {
        cy.get(`th[scope="row"]`).eq(11)
          .checkStylePropExists({
            content: "Training Curriculums",
            props: { "font-size": FONT_SIZE_12_8, "font-family": soraSansserif, "line-height": LINE_HT_18_304, "font-weight": FONT_WT_400 },
          });
      });
    });
  });
});

export { };
