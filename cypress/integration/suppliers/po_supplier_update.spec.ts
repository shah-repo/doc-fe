import moment from "moment";
import "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

const currentDate = moment().tz("America/Los_Angeles").format("MMMM Do YYYY");
let createdCompany;
let loginResponse;
let supplierFieldName;
let poFieldName;
let employeeId;
let developersGroup;
let adminEmployee;
let adminSessionId;
let group;
let supplierDocumentType;
let poHTMLDocRevId;
let initialArDocument;
let createdOldSupplierForm;
let formDocumentType;
let approvalRequestDocumentType;
let createdReleasedSupplier;

context("Purchase Supplier Update", () => {
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
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          const employee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          employeeId = employee.id;
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        adminSessionId = loginResponse.sessionId;
        done();
      });
    });

    it("[API]Create supplier form", () => {
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
              description: "<p>supplier form</p>",
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
                    name: "approvals-kycw6cjf",
                    type: "approvals",
                    tabId: "overview",
                    index: 0,
                    label: "Approvals",
                    rules: "",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                ],
              },
              name: "supplier form",
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
          description: "<p>Test Supplier Document</p>",
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
          name: "New suplier for PO",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formDocument: { id: createdOldSupplierForm.id },
          formInput: {},
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then(() => done());
    });

    it("[API]Create released supplier with old form document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>released supplier</p>",
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
          name: "released supplier",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formDocument: { id: createdOldSupplierForm.id },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdReleasedSupplier = response;
        cy.drAPIApproveAndRelease({
          documentId: createdReleasedSupplier.id,
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

  context("[API]Add employee to developers group", () => {
    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: adminSessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: adminSessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: employeeId }],
        },
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Verify revision is displayed when selecting Supplier in PO", () => {
    context("Start document creation flow", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });
    });

    context("Fill in document attributes", () => {
      it("Enters title 'New PO HTML Template Form'", () => {
        cy.drEnterDocumentTitle({ name: "New PO HTML Template Form" });
      });

      it("Enters description 'New HTML template description'", () => {
        cy.drEnterDocumentDescription({ description: "New HTML template description" });
      });

      it("Selects 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Purchase Order' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Purchase Order" });
        cy.unClick();
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document after filling document", () => {
        cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }, (req) => {
          req.reply((res) => {
            if (res.body !== "") {
              const response = res.body;
              supplierFieldName = response.formTemplate.schema[4].name;
              poFieldName = response.formTemplate.schema[6].name;
            }
          });
        }).as("response");
        cy.drClickCreateDocumentWithoutApiCall();
        cy.wait("@response");
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enter html code into 'Render HTML' field", () => {
        cy.drEnterHtmlText({
          htmlText:
            `<html>
            <body>
               <h1>Purchase order: {{documentRevision.document.docId}}-{{documentRevision.displayRevision}}</h1>
               <div>
                  <strong>Supplier</strong>                                                                             
                  <ul>
                     <li>Name: {{autocompletes.${supplierFieldName}.name}}</li>
                     <li>Description: {{{autocompletes.${supplierFieldName}.description}}}</li>
                  </ul>
               </div>
               <div>
                  <strong>Ordered</strong>                                                                             
                  <ul>
                     {{#documentRevision.formInput.${poFieldName}.items}}                        
                     <li>Name: {{serviceId}}{{^serviceId}}{{/serviceId}}</li>
                     <li>Description: {{description}}{{^description}}{{/description}}</li>
                     <li>Ordered: {{order}} {{units}}</li>
                     <li>GL codes: {{glCode}} </li>
                     {{/documentRevision.formInput.${poFieldName}.items}}                  
                  </ul>
               </div>
               <div>
                  <strong>Total cost</strong>
                  <ul>
                     <li>Total amount: {{documentRevision.formInput.${poFieldName}.totalAmount}}</li>
                  </ul>
               </div>
               <div>
               <strong>Tax</strong>                                                                             
               <ul>
                  <li>Tax Rate: {{documentRevision.formInput.${poFieldName}.taxRate}}</li>
                  <li>Tax: {{documentRevision.formInput.${poFieldName}.tax}}</li>
               </ul>
              </div>
               <div>
                  <strong>Approvals </strong>
                  <ul>
                    {{#documentRevision.approvals}}
                     <li>Name: {{approver.user.name}}</li>
                     {{#validApprovalDates}}
                     <li>Date: {{reviewedAt}} </li>
                     {{/validApprovalDates}} 
                    {{/documentRevision.approvals}}
                  </ul>
               </div>
            </body>
         </html>`,
        });
      });

      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Approve and Release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Create Purchase Order document and verify supplier", () => {
      it("Create new document from form", () => {
        cy.drCreateNewDocumentFromForm();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Enters description 'Test description'", () => {
        cy.drEnterDocumentDescription({ description: "Test description" });
      });

      it("Check supplier list", () => {
        cy.get("[data-cy^=\"po-supplier-built-in\"]").arrowClick();
        cy.get("ul>li[role=option]").should("contain.text", "SUP-00001 - rev 1 - New suplier for PO");
      });

      it("Select Supplier", () => {
        cy.poSelectSupplier({ supplier: "SUP-00001 - rev 1 - New suplier for PO" });
      });

      it("clicks on 'Save' button", () => {
        cy.drClickCreateDocumentWithApiCall();
        cy.poVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      });

      it("reload page", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.GetDocumentTypes, CyRoutes.GroupsGetClearFilter,
            CyRoutes.GetAvailableApprovers], () => {
            cy.reload();
          });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Navigates to Purchase order page", () => {
        cy.navigToPurchaseOrder();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("verify the correct data are displayed in Supplier field", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "PO-00001" });
        cy.dlVerifyFilterByDocId({ docId: "PO-00001" });
        cy.poListVerifyFilterBySupplier({ supplier: "New suplier for PO" });
        cy.dlClearFilters();
      });

      it(`open PO and check status should be '${STATUS_TYPES_LABEL.DRAFT}'`, () => {
        cy.dlSelectFirstDocument();
        cy.poVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(2000);
      });

      it("Update Supplier name and Release it", () => {
        cy.navigToSuppliers();
        cy.dlClearFilters();
        cy.supFilterById({ docId: "SUP-00001" });
        cy.dlSelectFirstDocument();
        cy.drEnterDocumentTitle({ name: "1" });
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.pmSubmitForApprovalWithoutAPI();
        cy.poApproveWithoutApi();
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.drVerifyFirstDocumentRevisionList({ revision: "Rev 1", status: STATUS_TYPES_LABEL.RELEASED });
      });

      it("reload page", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.GetDocumentTypes, CyRoutes.GroupsGetClearFilter,
            CyRoutes.GetAvailableApprovers], () => {
            cy.reload();
          });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Navigates to Purchase order page", () => {
        cy.navigToPurchaseOrder();
      });

      it("Select first PO", () => {
        cy.dlSelectFirstDocument();
      });

      it("Verify PO status", () => {
        cy.poVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      });

      it("Check PO supplier", () => {
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00001 - rev 1 - New suplier for PO1");
      });

      it("Click on 'Purchase Order' on sidebar", () => {
        cy.navigToPurchaseOrder();
      });

      it("reload page", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.GetDocumentTypes, CyRoutes.GroupsGetClearFilter,
            CyRoutes.GetDocRevStatusesCategory,
            CyRoutes.GetAvailableApprovers], () => {
            cy.reload();
          });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("verify the correct data are displayed in Supplier field", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "PO-00001" });
        cy.dlVerifyFilterByDocId({ docId: "PO-00001" });
        cy.poListVerifyFilterBySupplier({ supplier: "New suplier for PO1" });
        cy.dlClearFilters();
      });
    });

    context("Open existing Purchase Order document and verify supplier", () => {
      it("Open PO again - verify Supplier", () => {
        cy.dlSelectFirstDocument();
        cy.poVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00001 - rev 1 - New suplier for PO1");
      });


      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Update Supplier name and Release it", () => {
        cy.navigToSuppliers();
        cy.dlClearFilters();
        cy.supFilterById({ docId: "SUP-00001" });
        cy.dlSelectFirstDocument();
        cy.drClickReviseDocument();
        cy.drClickCreateDocumentWithoutApiCall();
        cy.cmpTurnOffAutosave();
        cy.drEnterDocumentTitle({ name: "2" });
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.pmSubmitForApprovalWithoutAPI();
        cy.poApproveWithoutApi();
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.drVerifyFirstDocumentRevisionList({ revision: "Rev 2", status: STATUS_TYPES_LABEL.RELEASED });
      });

      it("reload page", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.GetDocumentTypes, CyRoutes.GroupsGetClearFilter,
            CyRoutes.GetAvailableApprovers], () => {
            cy.reload();
          });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Navigates to Purchase order page", () => {
        cy.navigToPurchaseOrder();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Open PO again - verify PO in Draft is updated to the newly released version of the Supplier", () => {
        cy.dlSelectFirstDocument();
        cy.poVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00001 - rev 2 - New suplier for PO12");
      });

      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Purchase Order' on sidebar", () => {
        cy.navigToPurchaseOrder();
        cy.dlClearFilters();
      });

      it("verify the correct data are displayed in Supplier field", () => {
        cy.dlFilterByDocId({ docId: "PO-00001" });
        cy.dlVerifyFilterByDocId({ docId: "PO-00001" });
        cy.poListVerifyFilterBySupplier({ supplier: "New suplier for PO12" });
        cy.dlClearFilters();
      });
    });
  });

  context("Verify POs 'Pending Approval' are updated when new version of Supplier is released", () => {
    context("for newly PO", () => {
      it("Click 'New Purchase order' button", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetDocumentType, () => {
          cy.poClickCreatePO();
        });
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Enter description", () => {
        cy.drEnterDocumentDescription({ description: "Test description" });
      });

      it("Select Supplier", () => {
        cy.poSelectSupplier({ supplier: "SUP-00001 - rev 2 - New suplier for PO12" });
      });

      it("Add Required Date", () => {
        cy.get("[name=\"po-order-date\"]").next().find("button").arrowClick();
        cy.get(".MuiPickersDay-daySelected").arrowClick();
      });

      it(`Select '${USERS[1].name}' for Requestor`, () => {
        cy.get("[data-cy='po-requestor-autocomplete']").arrowClick();
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
      });

      it("clicks on 'Save' button", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Add an Approval", () => {
        cy.poAddApproverOnApproverList({ approver: USERS[2].name });
      });

      it("Click 'Submit for Approval' button", () => {
        cy.pmSubmitForApprovalWithoutAPI();
      });

      it(`check status should be '${STATUS_TYPES_LABEL.PENDING_APPROVAL}'`, () => {
        cy.poVerifyStatus({ status: STATUS_TYPES_LABEL.PENDING_APPROVAL });
      });

      it("Update Supplier name and Release it", () => {
        cy.navigToSuppliers();
        cy.dlClearFilters();
        cy.supFilterById({ docId: "SUP-00001" });
        cy.dlSelectFirstDocument();
        cy.drClickReviseDocument();
        cy.drClickCreateDocumentWithoutApiCall();
        cy.cmpTurnOffAutosave();
        cy.drEnterDocumentTitle({ name: "3" });
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.pmSubmitForApprovalWithoutAPI();
        cy.poApproveWithoutApi();
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.drVerifyFirstDocumentRevisionList({ revision: "Rev 3", status: STATUS_TYPES_LABEL.RELEASED });
      });

      it("reload page", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.GetDocumentTypes, CyRoutes.GroupsGetClearFilter,
            CyRoutes.GetAvailableApprovers], () => {
            cy.reload();
          });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Navigates to Purchase order page", () => {
        cy.navigToPurchaseOrder();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("verify the correct data are displayed in Supplier field", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "PO-00002" });
        cy.wait(2000);
        cy.dlVerifyFilterByDocId({ docId: "PO-00002" });
        cy.poListVerifyFilterBySupplier({ supplier: "New suplier for PO123" });
        cy.dlClearFilters();
      });

      it("Open PO again - verify PO in Pending Approval updated to the newly released version of the Supplier", () => {
        cy.poClickOnSpecificPOFromList({ item: "PO-00002" });
        cy.poVerifyStatus({ status: STATUS_TYPES_LABEL.PENDING_APPROVAL });
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00001 - rev 3 - New suplier for PO123");
      });
    });

    context("for existing PO", () => {
      it(`Open existing PO and verify PO in ${STATUS_TYPES_LABEL.PENDING_APPROVAL} and verify Supplier`, () => {
        cy.navigToPurchaseOrder();
        cy.wait(1000);
        cy.poClickOnSpecificPOFromList({ item: "PO-00002" });
        cy.poVerifyStatus({ status: STATUS_TYPES_LABEL.PENDING_APPROVAL });
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00001 - rev 3 - New suplier for PO123");
      });

      it("Update Supplier name and Release it", () => {
        cy.navigToSuppliers();
        cy.dlClearFilters();
        cy.supFilterById({ docId: "SUP-00001" });
        cy.dlSelectFirstDocument();
        cy.drClickReviseDocument();
        cy.drClickCreateDocumentWithoutApiCall();
        cy.cmpTurnOffAutosave();
        cy.drEnterDocumentTitle({ name: "4" });
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.pmSubmitForApprovalWithoutAPI();
        cy.poApproveWithoutApi();
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.drVerifyFirstDocumentRevisionList({ revision: "Rev 4", status: STATUS_TYPES_LABEL.RELEASED });
      });

      it("reload page", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.GetDocumentTypes, CyRoutes.GroupsGetClearFilter,
            CyRoutes.GetAvailableApprovers], () => {
            cy.reload();
          });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Navigates to Purchase order page", () => {
        cy.navigToPurchaseOrder();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("verify the correct data are displayed in Supplier field", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "PO-00002" });
        cy.wait(2000);
        cy.dlVerifyFilterByDocId({ docId: "PO-00002" });
        cy.poListVerifyFilterBySupplier({ supplier: "New suplier for PO1234" });
        cy.dlClearFilters();
      });

      it(`Open PO again - verify PO in PENDING_APPROVAL updated to the newly released version of the Supplier`, () => {
        cy.poClickOnSpecificPOFromList({ item: "PO-00002" });
        cy.poVerifyStatus({ status: STATUS_TYPES_LABEL.PENDING_APPROVAL });
        cy.get("[data-cy^=\"po-supplier-built-in\"]")
          .should("have.value", "SUP-00001 - rev 4 - New suplier for PO1234");
      });
    });
  });

  context("Verify the system is updating Supplier to the latest revision when PO is revised", () => {
    context("for newly PO", () => {
      it("create 'New Purchase order'", () => {
        cy.navigToPurchaseOrder();
        cy.wrapWithWaitOnApiCall(CyRoutes.GetDocumentType, () => {
          cy.poClickCreatePO();
        });
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Enter description", () => {
        cy.drEnterDocumentDescription({ description: "Test description" });
      });

      it(`Select '${USERS[1].name}' for Requestor`, () => {
        cy.get("[data-cy='po-requestor-autocomplete']").arrowClick();
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
      });

      it("Select Supplier", () => {
        cy.poSelectSupplier({ supplier: "SUP-00002 - rev 1 - released supplier" });
      });

      it("Add Required Date", () => {
        cy.get("[name=\"po-order-date\"]").next().find("button").arrowClick();
        cy.get(".MuiPickersDay-daySelected").arrowClick();
      });

      it("clicks on 'Save' button", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Add an Approval", () => {
        cy.poAddApproverOnApproverList({ approver: USERS[1].name });
      });

      it("Click 'Submit for Approval' button", () => {
        cy.pmSubmitForApprovalWithoutAPI();
      });

      it("Approve PO", () => {
        cy.poApproveWithoutApi();
      });

      it("Update Supplier name and Release it", () => {
        cy.navigToSuppliers();
        cy.dlClearFilters();
        cy.supFilterById({ docId: "SUP-00002" });
        cy.dlSelectFirstDocument();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.get("[data-cy=\"updateRecord\"]").should("exist");
        cy.drClickReviseDocument();
        cy.drClickCreateDocumentWithoutApiCall();
        cy.cmpTurnOffAutosave();
        cy.drEnterDocumentTitle({ name: "1" });
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.pmSubmitForApprovalWithoutAPI();
        cy.poApproveWithoutApi();
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.drVerifyFirstDocumentRevisionList({ revision: "Rev 2", status: STATUS_TYPES_LABEL.RELEASED });
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Revise and release Purchase order document", () => {
        cy.navigToPurchaseOrder();
        cy.dlClearFilters();
        cy.poClickOnSpecificPOFromList({ item: "PO-00003" });
        cy.drClickReviseDocument();
        cy.drClickCreateDocumentWithoutApiCall();
        cy.cmpTurnOffAutosave();
        cy.drEnterDocumentDescription({ description: "Test description1" });
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.progressBarShouldNotExist();
        cy.poAddApproverOnApproverList({ approver: USERS[1].name });
        cy.pmSubmitForApprovalWithoutAPI();
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.PENDING_APPROVAL });
        cy.poApproveWithoutApi();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Verify the system is updating Supplier to the latest revision when PO is revised", () => {
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00002 - rev 2 - released supplier1");
      });

      it("reload page", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.GetDocumentTypes, CyRoutes.GroupsGetClearFilter,
            CyRoutes.GetAvailableApprovers], () => {
            cy.reload();
          });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Navigates to Purchase order page", () => {
        cy.navigToPurchaseOrder();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("verify the correct data are displayed in Supplier field", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "PO-00003" });
        cy.dlVerifyFilterByDocId({ docId: "PO-00003" });
        cy.poListVerifyFilterBySupplier({ supplier: "released supplier1" });
        cy.dlClearFilters();
      });
    });

    context("for existing PO", () => {
      it("Open existing PO and verify Supplier", () => {
        cy.poClickOnSpecificPOFromList({ item: "PO-00003" });
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00002 - rev 2 - released supplier1");
      });

      it("Update Supplier name and Release it", () => {
        cy.navigToSuppliers();
        cy.dlClearFilters();
        cy.supFilterById({ docId: "SUP-00002" });
        cy.dlSelectFirstDocument();
        cy.drClickReviseDocument();
        cy.drClickCreateDocumentWithoutApiCall();
        cy.cmpTurnOffAutosave();
        cy.drEnterDocumentTitle({ name: "2" });
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
        cy.pmSubmitForApprovalWithoutAPI();
        cy.poApproveWithoutApi();
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.drVerifyFirstDocumentRevisionList({ revision: "Rev 3", status: STATUS_TYPES_LABEL.RELEASED });
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Revise and release Purchase order document", () => {
        cy.navigToPurchaseOrder();
        cy.dlClearFilters();
        cy.poClickOnSpecificPOFromList({ item: "PO-00003" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.get("[data-cy=\"updateRecord\"]").should("exist");
        cy.drClickReviseDocument();
        cy.drClickCreateDocumentWithoutApiCall();
        cy.cmpTurnOffAutosave();
        cy.drEnterDocumentDescription({ description: "Test description2" });
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.progressBarShouldNotExist();
        cy.poAddApproverOnApproverList({ approver: USERS[1].name });
        cy.pmSubmitForApprovalWithoutAPI();
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.PENDING_APPROVAL });
        cy.poApproveWithoutApi();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Verify the system is updating Supplier to the latest revision when PO is revised", () => {
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00002 - rev 3 - released supplier12");
      });

      it("reload page", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.GetDocumentTypes, CyRoutes.GroupsGetClearFilter,
            CyRoutes.GetAvailableApprovers], () => {
            cy.reload();
          });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Navigates to Purchase order page", () => {
        cy.navigToPurchaseOrder();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("verify the correct data are displayed in Supplier field", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "PO-00003" });
        cy.dlVerifyFilterByDocId({ docId: "PO-00003" });
        cy.poListVerifyFilterBySupplier({ supplier: "released supplier12" });
        cy.dlClearFilters();
      });
    });
  });

  context("Verify the system does not update Supplier to the latest revision when PO is released", () => {
    context("for newly PO", () => {
      it("create 'New Purchase order'", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetDocumentType, () => {
          cy.poClickCreatePO();
        });
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Enter description", () => {
        cy.drEnterDocumentDescription({ description: "Test description" });
      });

      it("Navigate to Lineitem tab", () => {
        cy.drSelectLineItems();
      });

      it("Click on 'Add item' button", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
          cy.poAddNewFieldItem();
        });
      });

      it("Click on 'Service' select option", () => {
        cy.poSelectOption({ optionName: "service" });
      });

      it("Enter ServiceID", () => {
        cy.poEnterServiceID({ serviceId: "SRV123" });
      });

      it("Enter Description", () => {
        cy.poEnterDescription({ description: "Description for SRV123" });
      });

      it("Enter Quantity Ordered", () => {
        cy.poEnterQuantityOrdered({ quantity: "5" });
      });

      it("Select Units", () => {
        cy.poSelectUnits();
      });

      it("Select GL code", () => {
        cy.poSelectGLCode();
      });

      it("Enter number of Units", () => {
        cy.poNumberOfUnits({ number: "2" });
      });

      it("Check Tax box", () => {
        cy.poSelectTaxCheckbox();
      });

      it("Click on 'Add' inside PO dialog box", () => {
        cy.poAddPOButtonClick();
      });

      it("clicks on 'Save' button", () => {
        cy.wait(2000);
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Select Supplier", () => {
        cy.poSelectSupplier({ supplier: "SUP-00002 - rev 3 - released supplier12" });
      });

      it("Add Required Date", () => {
        cy.get("[name=\"po-order-date\"]").next().find("button").arrowClick();
        cy.get(".MuiPickersDay-daySelected").arrowClick();
      });

      it(`Select '${USERS[1].name}' for Requestor`, () => {
        cy.get("[data-cy='po-requestor-autocomplete']").arrowClick();
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
      });

      it("Fill order Date", () => {
        cy.xpath("//input[@name]/ ../div/button").last().arrowClick();
        cy.xpath("//div[@class=\"MuiPickersCalendar-week\"]" +
        "[last()]/div[@role=\"presentation\"]/button[not(@tabindex=\"-1\")]").last()
          .click();
      });

      it("Add an Approval", () => {
        cy.poAddApproverOnApproverList({ approver: USERS[1].name });
      });

      it("clicks on 'Save' button", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Click 'Submit for Approval' button", () => {
        cy.pmSubmitForApprovalWithoutAPI();
      });

      it("Approve PO", () => {
        cy.poApproveWithoutApi();
      });

      it("reload page", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.GetDocumentTypes, CyRoutes.GroupsGetClearFilter,
            CyRoutes.GetAvailableApprovers], () => {
            cy.reload();
          });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Navigates to Purchase order page", () => {
        cy.navigToPurchaseOrder();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("verify the correct data are displayed in Supplier field", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "PO-00004" });
        cy.dlVerifyFilterByDocId({ docId: "PO-00004" });
        cy.poListVerifyFilterBySupplier({ supplier: "released supplier12" });
        cy.dlClearFilters();
      });

      it("Update Supplier name and Release it", () => {
        cy.navigToSuppliers();
        cy.dlClearFilters();
        cy.supFilterById({ docId: "SUP-00002" });
        cy.dlSelectFirstDocument();
        cy.drClickReviseDocument();
        cy.drClickCreateDocumentWithoutApiCall();
        cy.cmpTurnOffAutosave();
        cy.drEnterDocumentTitle({ name: "3" });
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
        cy.pmSubmitForApprovalWithoutAPI();
        cy.poApproveWithoutApi();
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.drVerifyFirstDocumentRevisionList({ revision: "Rev 4", status: STATUS_TYPES_LABEL.RELEASED });
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("reload page", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.GetDocumentTypes, CyRoutes.GroupsGetClearFilter,
            CyRoutes.GetAvailableApprovers], () => {
            cy.reload();
          });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Navigates to Purchase order page", () => {
        cy.navigToPurchaseOrder();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("verify the correct data are displayed in Supplier field", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "PO-00004" });
        cy.dlVerifyFilterByDocId({ docId: "PO-00004" });
        cy.poListVerifyFilterBySupplier({ supplier: "released supplier12" });
      });

      it("Open released PO", () => {
        cy.dlClearFilters();
        cy.poClickOnSpecificPOFromList({ item: "PO-00004" });
      });

      it("Verify the system does not update Supplier to the latest revision when PO is released", () => {
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00002 - rev 3 - released supplier12");
      });

      it("[API]Get html document and verify supplier", () => {
        SystemRequirement("REQ -1450");
        cy.url().then((url: any) => {
          poHTMLDocRevId = url.split("/").pop();
          cy.request({
            method: "GET",
            url: `${CONFIG.BE_URL}/api/v1/document_revisions/generate_html/${poHTMLDocRevId}`,
            headers: {
              Authorization: `bearer ${adminEmployee.id}:${loginResponse.sessionId}`,
            },
          }).then((response) => {
            const responseBody = response.body.toString();
            expect(responseBody)
              .contains(`Purchase order: PO-00004`)
              .and.contains(`Name: released supplier12`)
              .and.contains(`Description: <p>released supplier</p>`)
              .and.contains(`Name: SRV123`)
              .and.contains(`Description: Description for SRV123`)
              .and.contains(`Ordered: 5 each`)
              .and.contains(`GL codes: code 1`)
              .and.contains(`Total amount: 10`)
              .and.contains(`Name: ${USERS[1].name}`)
              .and.contains(`Date: ${currentDate}`)
              .and.contains(`Tax Rate: 9.25`)
              .and.contains(`Tax: 0.925000`);
          });
        });
      });
    });

    context("for existing PO", () => {
      it("Navigate to PO Landing Page", () => {
        cy.navigToPurchaseOrder();
      });

      it("Open existing PO and verify Supplier", () => {
        cy.poClickOnSpecificPOFromList({ item: "PO-00004" });
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00002 - rev 3 - released supplier12");
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Update Supplier name and Release it", () => {
        cy.navigToSuppliers();
        cy.dlClearFilters();
        cy.supFilterById({ docId: "SUP-00002" });
        cy.dlSelectFirstDocument();
        cy.drClickReviseDocument();
        cy.drClickCreateDocumentWithoutApiCall();
        cy.cmpTurnOffAutosave();
        cy.drEnterDocumentTitle({ name: "4" });
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
        cy.pmSubmitForApprovalWithoutAPI();
        cy.poApproveWithoutApi();
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.drVerifyFirstDocumentRevisionList({ revision: "Rev 5", status: STATUS_TYPES_LABEL.RELEASED });
      });

      it("reload page", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.GetDocumentTypes, CyRoutes.GroupsGetClearFilter,
            CyRoutes.GetAvailableApprovers], () => {
            cy.reload();
          });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Navigates to Purchase order page", () => {
        cy.navigToPurchaseOrder();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("verify the correct data are displayed in Supplier field", () => {
        cy.dlFilterByDocId({ docId: "PO-00004" });
        cy.dlVerifyFilterByDocId({ docId: "PO-00004" });
        cy.poListVerifyFilterBySupplier({ supplier: "released supplier12" });
      });

      it("Open released PO", () => {
        cy.dlClearFilters();
        cy.poClickOnSpecificPOFromList({ item: "PO-00004" });
      });

      it("Verify the system does not update Supplier to the latest revision when PO is released", () => {
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00002 - rev 3 - released supplier12");
      });

      it("[API]Get html document and verify supplier", () => {
        SystemRequirement("REQ -1450");
        cy.url().then((url: any) => {
          poHTMLDocRevId = url.split("/").pop();
          cy.request({
            method: "GET",
            url: `${CONFIG.BE_URL}/api/v1/document_revisions/generate_html/${poHTMLDocRevId}`,
            headers: {
              Authorization: `bearer ${adminEmployee.id}:${loginResponse.sessionId}`,
            },
          }).then((response) => {
            const responseBody = response.body.toString();
            expect(responseBody)
              .contains(`Purchase order: PO-00004`)
              .and.contains(`Name: released supplier12`)
              .and.contains(`Description: <p>released supplier</p>`)
              .and.contains(`Name: SRV123`)
              .and.contains(`Description: Description for SRV123`)
              .and.contains(`Ordered: 5 each`)
              .and.contains(`GL codes: code 1`)
              .and.contains(`Total amount: 10`)
              .and.contains(`Name: ${USERS[1].name}`)
              .and.contains(`Date: ${currentDate}`)
              .and.contains(`Tax Rate: 9.25`)
              .and.contains(`Tax: 0.925000`);
          });
        });
      });
    });
  });

});


export { };

