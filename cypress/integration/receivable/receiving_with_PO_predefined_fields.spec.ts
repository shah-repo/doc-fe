import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { PurchaseOrderDocType } from "../../utils/constants/documentTypes/purchaseOrder";
import { ReceivableTestWithSchema } from "../../utils/constants/documentTypes/receivable";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let adminEmployeeLoginResponse;
let createdCompany;
let adminEmployee;
let secondEmployee;
let loginResponse;
let developersGroup;


const predefinedSchema = `
{
  "name": "fb-receive-po",
  "type": "poreceive",
  "index": 1,
  "label": "Receive PO",
  "tabId": "details",
  "applicableOn": 
    [
      "ON_STATE_TO_IN_REVIEW"
    ],
  "deleteDisabled": true,
  "validationMode": "default",
  "editorProperties": [],
  "uniqueSchemaItem": true,
  "validationAttribute": "Receive PO",
  "deleteInFormDisabled": true,
  "applicableValidationSchema": true
}`;

context("Receivable test with Page Details", () => {
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
        adminEmployeeLoginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              PurchaseOrderDocType,
              ReceivableTestWithSchema,
            ],
            acctCodes: ["code 1"],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Get group Developers", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
        done();
      });
    });

    it("[API]Patch group Developers", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: adminEmployee.id }, { id: secondEmployee.id }],
          tags: [...developersGroup.body[0].tags,
            GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
            GroupTag.NAVIGATION_WITH_RESTRICTED_DOC_TYPES,
          ],
        },
      });
    });

    it("[API]API request for updating company navigation", (done: any) => {
      cy.cmpUpdateCompany({
        employeeId: adminEmployee.id,
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
                  label: "Change Orders",
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

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Verify Predefined schema for Receivable", () => {
    it("Navigate to document type management", () => {
      cy.navigToDocTypeManagement();
    });

    it("Filter DocType name", () => {
      cy.dtmClearFilters();
      cy.get(".k-textbox").eq(0).arrowType("Receivable test with schema").wait(500);
      cy.listLoadingElementShouldNotExist();
    });

    it("Expand Schema", () => {
      cy.get("[data-grid-row-index='0']>td[data-grid-col-index='14']>span>svg").arrowClick({ force: true });
    });

    it("Verify Schema", () => {
      cy.writeFile("cypress/fixtures/schema.json", predefinedSchema);
      cy.fixture("schema").then( (el) => {
        expect(el.name).to.eq("fb-receive-po");
        expect(el.type).to.eq("poreceive");
        expect(el.label).to.eq("Receive PO");
        expect(el.tabId).to.eq("details");
        expect(el.applicableOn[0]).to.eq("ON_STATE_TO_IN_REVIEW");
        expect(el.deleteDisabled).to.eq(true);
        expect(el.validationMode).to.eq("default");
        expect(el.uniqueSchemaItem).to.eq(true);
        expect(el.validationAttribute).to.eq("Receive PO");
        expect(el.deleteInFormDisabled).to.eq(true);
        expect(el.applicableValidationSchema).to.eq(true);
      });
    });

    it("Close Schema pop up", () => {
      cy.get(".k-form").find("button").eq(0).click();
    });
  });

  context("Create a Form for PO", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle( { name: "Form for Purchase Order" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Purchase Order' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Purchase Order test" });
      cy.unClick();
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create Purchase Order Released", () => {
    it("Go to Purchase Order module", () => {
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.navigToPurchaseOrder();
    });

    it("Click on 'Create PO' button", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
        cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order test" });
      });
    });

    context("Fill out PO fields", () => {
      it("Enter description 'New Purchase Order Released 1'", () => {
        cy.drEnterDocumentDescription({ description: "New Purchase Order Released" });
      });

      it("Select 'Open' for PO status", () => {
        cy.poSelectPOStatus({ status: "Open" });
      });

      it(`Select '${USERS[1].name}' for Requestor`, () => {
        cy.get("[data-cy^=po-requestor]").arrowClick();
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
      });

      it("Select Order Date", () => {
        cy.get("input[name^=ordered]").parent().find("button").arrowClick();
        cy.get("button.MuiPickersDay-day[tabindex=\"0\"]").eq(-1).arrowClick();
      });

      it("Clicks Save button", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Add an Approval", () => {
        cy.poAddApproverOnApproverList({ approver: USERS[1].name });
      });

      it("Click 'Submit for Approval' button", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve", () => {
        cy.poApprove();
      });
    });
  });

  context("Create a Form for RC and Verify PO Receive", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle( { name: "Form for Receiving" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Receivable test with schema' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Receivable test with schema" });
      cy.unClick();
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Veirfy PO Receive item", () => {
      cy.get(`[data-cy="Receive PO"]`).should("exist");
    });

    it("Verify Approval Request Details disabled", () => {
      cy.fbVerifyElementClassByLabel({
        label: "Receive PO", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Approve and release Bulk create form", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create receiving document", () => {
    it("Navigate to receiving", () => {
      cy.navigToReceivableList();
    });

    it("Create new record button click", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Select 'Receivable test with schema' form", () => {
      cy.recSelectRecordFormFromMultiSelect({ recordType: "Receivable test with schema" });
    });

    it("Add an Approval", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get(`[data-cy^="fb-approvals-fb-approvals"]`).scrollIntoView().arrowClick().wait(500);
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get(`[data-cy^="fb-approvals-fb-approvals"]`).autocompleteSelect(USERS[1].name).wait(500);
      });
      cy.unClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Search for PO document and select it", () => {
      cy.get(`input[data-cy^="porec-fb-receive-po"]`).arrowClick();
      cy.get("ul>li[role=option]").contains("New Purchase Order Released").arrowClick();
      cy.unClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Submit for Approval' button", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve", () => {
      cy.poApprove();
    });
  });
});

