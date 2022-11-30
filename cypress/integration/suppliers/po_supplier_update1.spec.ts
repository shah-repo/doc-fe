import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

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

context("Purchase Supplier Update1", () => {
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
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Change Order");
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

    it("[API]Create released supplier with old form document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>released supplier</p>",
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
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
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
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document after filling document", () => {
        cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }, (req) => {
          req.reply((res) => {
            if (res.body !== "") {
              const response = res.body;
              supplierFieldName = response.formTemplate.schema[3].name;
              poFieldName = response.formTemplate.schema[5].name;
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

      it("Enters description 'Test description'", () => {
        cy.drEnterDocumentDescription({ description: "Test description" });
      });

      it("Click 'Create A New Supplier'", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
          cy.get("[data-cy=\"form.builder.create.new.supplier\"]").arrowClick();
        });
      });

      it("Enter Supplier Title 'Supplier'", () => {
        cy.get("[data-cy='name']").arrowType("Supplier");
      });

      it("Enter Supplier Description 'Supplier Description'", () => {
        cy.xpath("//div[@data-cy='description']/../div[2]").eq(1).arrowClick();
        cy.get("[data-cy='description']>div>div>div>div>div[contenteditable]").eq(1).clear()
          .arrowType("Supplier Description").wait(500);
        cy.unClick();
      });

      it("Select Document Type 'Supplier'", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetSpecificDocumentType, () => {
          cy.listLoadingElementShouldNotExist();
          cy.get("[name=\"document.documentType.id\"]").arrowType("{downarrow}{enter}");
        });
      });

      it("Create new supplier", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRev, CyRoutes.PatchDocRev], () => {
          cy.get("[data-cy=\"common.confirm\"]").arrowClick();
        });
      });

      it("Verify Supplier", () => {
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00002 - rev 1 - Supplier");
      });

      it("Add Required Date", () => {
        cy.get("[name=\"po-order-date\"]").next().find("button").arrowClick();
        cy.get(".MuiPickersDay-daySelected").arrowClick();
      });

      it("clicks on 'Save' button", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
        cy.poVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      });

      it("Navigates to Supplier and Select created supplier", () => {
        cy.navigToSuppliers();
        cy.supClickOnSpecificSupplierFileFromList({ item: "SUP-00002" });
      });

      it(`Verify supplier status should be '${STATUS_TYPES_LABEL.DRAFT}'`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      });

      it("Add an approval", () => {
        cy.get("[data-cy^=fb-approvals-approvals-]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve the suppller", () => {
        cy.ebApprove();
      });

      it("Update Supplier name and Release it", () => {
        cy.drClickReviseDocument();
        cy.drEnterDocumentTitle({ name: "1" });
        cy.drClickCreateDocumentWithApiCall();

        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
        cy.pmSubmitForApproval();
        cy.ebApprove();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Open PO again - verify PO in Draft is updated to the newly released version of the Supplier", () => {
        cy.navigToPurchaseOrder();
        cy.dlSelectFirstDocument();
        cy.poVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00002 - rev 2 - Supplier1");
      });

      it(`Select '${USERS[2].name}' for Requestor`, () => {
        cy.get("[data-cy='po-requestor-autocomplete']").arrowClick();
        cy.get("ul>li[role=option]").contains(USERS[2].name).arrowClick();
      });

      it("clicks on 'Save' button", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Add an Approval", () => {
        cy.poAddApproverOnApproverList({ approver: USERS[2].name });
      });

      it("Click 'Submit for Approval' button", () => {
        cy.pmSubmitForApproval();
      });

      it(`check status should be '${STATUS_TYPES_LABEL.PENDING_APPROVAL}'`, () => {
        cy.poVerifyStatus({ status: STATUS_TYPES_LABEL.PENDING_APPROVAL });
      });

      it("Update Supplier name and Release it", () => {
        cy.navigToSuppliers();
        cy.dlFilterByDocId({ docId: "SUP-00002" });
        cy.dlSelectFirstDocument();
        cy.drClickReviseDocument();
        cy.drEnterDocumentTitle({ name: "2" });
        cy.drClickCreateDocumentWithApiCall();

        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
        cy.pmSubmitForApproval();
        cy.ebApprove();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Click on 'Purchase Order' on sidebar", () => {
        cy.navigToPurchaseOrder();
        cy.dlClearFilters();
      });

      it("verify the correct data are displayed in Supplier field", () => {
        cy.dlFilterByDocId({ docId: "PO-00001" });
        cy.dlVerifyFilterByDocId({ docId: "PO-00001" });
        cy.poListVerifyFilterBySupplier({ supplier: "New Supplier12" });
        cy.dlClearFilters();
      });

      it("Open PO again - verify PO in Pending Approval updated to the newly released version of the Supplier", () => {
        cy.poClickOnSpecificPOFromList({ item: "PO-00001" });
        cy.poVerifyStatus({ status: STATUS_TYPES_LABEL.PENDING_APPROVAL });
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00002 - rev 3 - Supplier12");
      });

      it("Log out user", () => {
        cy.authLogout();
      });

      it(`Logs user ${USERS[2].name} in`, () => {
        cy.authLogin({
          email: USERS[2].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });

      it("Approve PO", () => {
        cy.contains("PO-00001").arrowClick();
        cy.ebApprove();
      });

      it("Log out user", () => {
        cy.authLogout();
      });

      it(`Logs user ${USERS[1].name} in`, () => {
        cy.authLogin({
          email: USERS[1].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });

      it("Update Supplier name and Release it", () => {
        cy.navigToSuppliers();
        cy.dlFilterByDocId({ docId: "SUP-00002" });
        cy.dlSelectFirstDocument();
        cy.drClickReviseDocument();
        cy.drEnterDocumentTitle({ name: "3" });
        cy.drClickCreateDocumentWithApiCall();
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
        cy.pmSubmitForApproval();
        cy.ebApprove();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigate to PO Landing Page", () => {
        cy.navigToPurchaseOrder();
      });

      it("verify the correct data are displayed in Supplier field", () => {
        cy.dlFilterByDocId({ docId: "PO-00001" });
        cy.dlVerifyFilterByDocId({ docId: "PO-00001" });
        cy.poListVerifyFilterBySupplier({ supplier: "New Supplier12" });
      });

      it("Open released PO", () => {
        cy.dlClearFilters();
        cy.poClickOnSpecificPOFromList({ item: "PO-00001" });
      });

      it("Verify the system does not update Supplier to the latest revision when PO is released", () => {
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00002 - rev 3 - Supplier12");
      });

      it("[API]Get html document and verify supplier", () => {
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
              .contains("Name: Supplier12");
          });
        });
      });

      it("Revise and release Purchase order document", () => {
        cy.navigToPurchaseOrder();
        cy.dlClearFilters();
        cy.poClickOnSpecificPOFromList({ item: "PO-00001" });
        cy.drClickReviseDocument();
        cy.drClickCreateDocumentWithApiCall();
        cy.cmpTurnOffAutosave();
        cy.drEnterDocumentDescription({ description: "Test description1" });
        cy.unClick();
        cy.poAddApproverOnApproverList({ approver: USERS[1].name });
      });

      it("Click Save button", () => {
        cy.drClickCreateDocumentWithApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Submit for Approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve the doc", () => {
        cy.ebApprove();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Verify the system is updating Supplier to the latest revision when PO is revised", () => {
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00002 - rev 4 - Supplier123");
      });

      it("Click on 'Purchase Order' on sidebar", () => {
        cy.navigToPurchaseOrder();
        cy.dlClearFilters();
      });

      it("verify the correct data are displayed in Supplier field", () => {
        cy.dlFilterByDocId({ docId: "PO-00001" });
        cy.dlVerifyFilterByDocId({ docId: "PO-00001" });
        cy.poListVerifyFilterBySupplier({ supplier: "New Supplier123" });
        cy.dlClearFilters();
      });

    });

  });
});

export { };

