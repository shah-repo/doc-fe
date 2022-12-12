// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { NCORecord } from "../../utils/constants/documentTypes/nco";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

const ncoFormName = "NCO Form";
const randomNumberForCompany = (Math.round(Math.random() * 100000)) % 100000;
const newCompanyName = "New company " + randomNumberForCompany;
const newCompanyAbbr = "NC-" + randomNumberForCompany;
const apiCreatedCompany: any = {
  employees: [],
  documentTypes: [],
};

let multipleCompanies;
let createdCompany;
let loginResponse;
let supplierFieldName;
let poFieldName;
let adminEmployee;
let group;
let supplierDocumentType;
let poHTMLDocRevId;
let initialArDocument;
let createdOldSupplierForm;
let formDocumentType;
let approvalRequestDocumentType;
let createdReleasedSupplier;

context("DAM approvals in LHR", () => {
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
            documentTypes: [
              NCORecord,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
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
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Create NCO", () => {
    context("Create form for NCO document", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it(`Enters title '${ncoFormName}'`, () => {
        cy.drEnterDocumentTitle({ name: ncoFormName });
      });

      it("Enters description 'New NCO Form description'", () => {
        cy.drEnterDocumentDescription({ description: "New NCO Form description" });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'New Company Record' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "New Company Record" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click on 'Save' button", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("'Approve and Release' the document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Create NCO document from Form", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Select released NCO Form", () => {
        cy.drFilterDocListByNameAndStatus({ title: ncoFormName, status: "Released" });
      });

      it("Create new document from form", () => {
        cy.drCreateNewDocumentFromForm();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Enters title 'New Company'", () => {
        cy.drEnterDocumentTitle({ name: "New Company" });
      });

      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Enters description 'New Company description'", () => {
        cy.drEnterDocumentDescription({ description: "New Company description" });
      });

      it(`Enters company name '${newCompanyName}'`, () => {
        cy.get("[name^=company-name-]").arrowType(newCompanyName);
      });

      it(`Enters company abbriviation '${newCompanyAbbr}'`, () => {
        cy.get("[name^=company-abbreviation-]").arrowType(newCompanyAbbr);
      });

      it(`Enters company email '${USERS[1].email}'`, () => {
        cy.get("[name^=company-admin-email-]").arrowType(USERS[1].email);
      });

      it("Select 'Yes' for 'Approved DAM json is used'", () => {
        cy.get("[name*=\"approved-dam-json-is-used-\"]").check("Yes");
      });

      it("Upload DAM JSON", () => {
        cy.atchUploadDOMJSONForNCO({ fileName: "dam1.json", queue: 0 });
      });

      it("Select 'Yes' for 'Approved Page Details json is used'", () => {
        cy.get("[name*=\"approved-page-details-json-is-used-\"]").check("Yes");
      });

      it("Upload Page Details JSON", () => {
        cy.atchUploadPageDetailsJSONForNCO({ fileName: "PageDetails.json", queue: 0 });
      });

      it("Select 'Yes' for 'Approved Navigation json is used'", () => {
        cy.get("[name*=\"approved-navigation-json-is-used-\"]").check("Yes");
      });

      it("Upload Navigation JSON", () => {
        cy.atchUploadNavigationJSONForNCO({ fileName: "navigation.json", queue: 0 });
      });

      it("Upload Users List JSON", () => {
        cy.atchUploadUserListJSONForNCO({ fileName: "dam_users.csv", queue: 0 });
      });

      it("Save document", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.PatchDocRev], () => {
            cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
          });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve and release document - create company", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });

      it("Log out user", () => {
        cy.authLogout();
      });
    });
  });

  context(`Login with user ${USERS[1].name}`, () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Intercept APIs", () => {
      cy.intercept({ method: "GET", pathname: "/api/v1/company/mine" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            const response = res.body;
            apiCreatedCompany.employees = response.employees;
            createdCompany = response;
            adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          }
        });
      }).as("response");

      cy.intercept({ method: "GET", pathname: "/api/v1/document_type" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            apiCreatedCompany.documentTypes = res.body;
            supplierDocumentType = cmpFilterDocumentTypeIdByName(apiCreatedCompany, "Supplier");
            approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(apiCreatedCompany, "Approval Request");
            formDocumentType = cmpFilterDocumentTypeIdByName(apiCreatedCompany, "Form");
          }
        });
      }).as("response1");

      cy.intercept({ method: "GET", pathname: "/api/v1/auth/sessionDetails" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            loginResponse = res.body;
          }
        });
      }).as("response2");

      cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      cy.wait("@response");
      cy.wait("@response1");
      cy.wait("@response2");
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("[API]Create supplier form", () => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "All Users",
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

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Set document type", () => {
        cy.drSetDocTypeId({ docId: "00006" });
      });

      it("Select 'Purchase Order' output document type from dropdown", () => {
        cy.get("[data-cy=\"field-outputDocumentTypes\"]").arrowClick();
        cy.wait(1500);
        cy.get(`[id^="react-select"]`).contains("Purchase Order").arrowClick();
        cy.unClick();
      });

      it("Click create document after filling document", () => {
        cy.intercept({ method: "GET", pathname: "/api/v1/document_revisions/*" }, (req) => {
          req.reply((res) => {
            if (res.body !== "") {
              const response = res.body;
              supplierFieldName = response.formTemplate.schema[3].name;
              poFieldName = response.formTemplate.schema[5].name;
            }
          });
        }).as("response");
        cy.drClickCreateDocumentWithoutApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
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
      it("Turn on autosave", () => {
        cy.cmpTurnOnAutosave();
      });

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
        cy.get("[data-cy=\"name\"]").arrowType("New Supplier");
      });

      it("Enter Supplier Description 'Supplier Description'", () => {
        cy.xpath("//div[@data-cy=\"description\"]/../div[2]").eq(-1).arrowClick();
        cy.get("#fb-mpiprocedure-ref-description").find("div[contenteditable]").arrowType("Supplier Description");
        cy.wait(4000);
        cy.checkToastMessage({ exists: false });
      });

      it("Select Document Type 'Supplier'", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetSpecificDocumentType, () => {
          cy.listLoadingElementShouldNotExist();
          cy.get("[name=\"document.documentType.id\"]").arrowType("{downarrow}{enter}");
        });
      });

      it("Create new supplier", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRev], () => {
          cy.get("[data-cy=\"common.confirm\"]").arrowClick();
        });
      });

      it("Verify Supplier", () => {
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00002 - rev 1 - New Supplier");
      });

      it("Add Required Date", () => {
        cy.get("[name^=\"ordered-\"]").next().find("button").arrowClick();
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

      it("Verify supplier status should be 'Draft'", () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      });

      it("Add approver", () => {
        cy.get("[data-cy^=fb-approvals-approvals-]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Release supplier", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApprovers], () => {
          cy.get("button[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.get("input[name=password]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(500);
        cy.unClick();
        cy.wrapWithWaitOnApiCall(
          CyRoutes.ReleaseDocRev,
          () => {
            cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
          });
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Update Supplier name", () => {
        cy.drClickReviseDocument();
        cy.drEnterDocumentTitle({ name: "1" });
      });

      it("Click Save button", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add approver", () => {
        cy.get("[data-cy^=fb-approvals-approvals-]").arrowClick();
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click Save button", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      });

      it("Release supplier", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApprovers], () => {
          cy.get("button[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.get("input[name=password]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(500);
        cy.unClick();
        cy.wrapWithWaitOnApiCall(
          CyRoutes.ReleaseDocRev,
          () => {
            cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
          });
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(2000);
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Open PO again - verify PO in Draft is updated to the newly released version of the Supplier", () => {
        cy.navigToPurchaseOrder();
        cy.dlSelectFirstDocument();
        cy.poVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00002 - rev 2 - New Supplier1");
      });

      it("Add an Approval", () => {
        cy.get("[data-cy^=\"fb-po-approvals-\"]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul>li[role=option]").contains(USERS[2].name).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("clicks on 'Save' button", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Click 'Submit for Approval' button", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });
      });

      it(`check status should be '${STATUS_TYPES_LABEL.PENDING_APPROVAL}'`, () => {
        cy.poVerifyStatus({ status: STATUS_TYPES_LABEL.PENDING_APPROVAL });
      });

      it("Update Supplier name and Release it", () => {
        cy.navigToSuppliers();
        cy.supClickOnSpecificSupplierFileFromList({ item: "SUP-00002" });
        cy.drClickReviseDocument();
        cy.drEnterDocumentTitle({ name: "2" });
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.PostDocRev], () => {
            cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
          });
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();

        cy.get("[data-cy^=fb-approvals-approvals-]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApprovers], () => {
          cy.get("button[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve supplier", () => {
        cy.get("input[name=password]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(500);
        cy.unClick();
        cy.wrapWithWaitOnApiCall(
          CyRoutes.ReleaseDocRev,
          () => {
            cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
          });
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(2000);
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
        cy.get("tr.k-master-row").first().find("td").eq(0).should("have.text", "PO-00001");
        cy.get("tr.k-master-row").first().find("td").eq(3).should("have.text", "New Supplier12");
        cy.dlClearFilters();
      });

      it("Open PO again - verify PO in Pending Approval updated to the newly released version of the Supplier", () => {
        cy.poClickOnSpecificPOFromList({ item: "PO-00001" });
        cy.poVerifyStatus({ status: STATUS_TYPES_LABEL.PENDING_APPROVAL });
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00002 - rev 3 - New Supplier12");
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
        cy.cmpSelectCompany({ name: newCompanyName, multiple: true });
      });

      it("Approve PO", () => {
        cy.contains("PO-00001").arrowClick();
        cy.poApproveWithoutApi();
      });

      it("Log out user", () => {
        cy.authLogout();
      });

      it(`Logs user ${USERS[1].name} in`, () => {
        cy.authLogin({
          email: USERS[1].email,
        });
      });

      it("Selects company and intercept APIs", () => {
        cy.intercept({ method: "GET", pathname: "/api/v1/auth/sessionDetails" }, (req) => {
          req.reply((res) => {
            if (res.body !== "") {
              loginResponse = res.body;
            }
          });
        }).as("response");

        cy.cmpSelectCompany({ name: newCompanyName, multiple: true });
        cy.wait("@response");
      });

      it("Update Supplier name and Release it", () => {
        cy.navigToSuppliers();
        cy.supClickOnSpecificSupplierFileFromList({ item: "SUP-00002" });
        cy.drClickReviseDocument();
        cy.drEnterDocumentTitle({ name: "3" });
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.PostDocRev], () => {
            cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
          });
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();

        cy.get("[data-cy^=fb-approvals-approvals-]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApprovers], () => {
          cy.get("button[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve supplier", () => {
        cy.get("input[name=password]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(500);
        cy.unClick();
        cy.wrapWithWaitOnApiCall(
          CyRoutes.ReleaseDocRev,
          () => {
            cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
          });
        cy.checkToastMessage({ exists: false });
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
        cy.get("tr.k-master-row").first().find("td").eq(0).should("have.text", "PO-00001");
        cy.get("tr.k-master-row").first().find("td").eq(3).should("have.text", "New Supplier12");
      });

      it("Open released PO", () => {
        cy.dlClearFilters();
        cy.poClickOnSpecificPOFromList({ item: "PO-00001" });
      });

      it("Verify the system does not update Supplier to the latest revision when PO is released", () => {
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00002 - rev 3 - New Supplier12");
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
              .contains("Name: New Supplier12");
          });
        });
      });

      it("Revise and release Purchase order document", () => {
        cy.navigToPurchaseOrder();
        cy.dlClearFilters();
        cy.poClickOnSpecificPOFromList({ item: "PO-00001" });
        cy.drClickReviseDocument();
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.PostDocRev], () => {
            cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
          });
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.get("[data-cy^=\"fb-po-approvals-\"]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.drEnterDocumentDescription({ description: "Test description1" });
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Submit for Approval", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve PO", () => {
        cy.poApproveWithoutApi();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Verify the system is updating Supplier to the latest revision when PO is revised", () => {
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00002 - rev 4 - New Supplier123");
      });

      it("Click on 'Purchase Order' on sidebar", () => {
        cy.navigToPurchaseOrder();
        cy.dlClearFilters();
      });

      it("verify the correct data are displayed in Supplier field", () => {
        cy.dlFilterByDocId({ docId: "PO-00001" });
        cy.get("tr.k-master-row").first().find("td").eq(0).should("have.text", "PO-00001");
        cy.get("tr.k-master-row").first().find("td").eq(3).should("have.text", "New Supplier123");
        cy.dlClearFilters();
      });
    });
  });
});

export { };

