import moment from "moment";
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;

const currentDate = moment().tz("America/Los_Angeles").format("MMMM Do YYYY");
let supplierFieldName;
let poFieldName;
let baererSessionId;
let employeeId;
let developersGroup;
let adminEmployee;
let adminSessionId;
let group;
let supplierDocumentType;
const documentSupplierRevisionName = "New suplier for PO";
const documentSupplierDescription = "<p>Test Supplier Document</p>";
let poHTMLDocRevId;

context("Purchase order HTML template form", () => {
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
        adminSessionId = loginResponse.sessionId;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        baererSessionId = loginResponse.sessionId;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    it("[API]Creates suplier document for PO", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: adminSessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: documentSupplierDescription,
            document: {
              docId: "SUP-00004",
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
            name: documentSupplierRevisionName,
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
          },
          employeeId: employeeId as unknown as string,
          sessionId: baererSessionId as unknown as string,
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
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Start document creation flow", () => {
    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
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
      // SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Purchase Order' output document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "Purchase Order" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Click 'Add New Field'", () => {
      cy.fbAddNewFieldWhenHidden();
    });

    it("Select 'Purchase Order' from list", () => {
      cy.fbSelectItemFromNewFieldList({ field: "Purchase Order" });
    });

    it("Fill label field with 'New Purchase Order with Product item'", () => {
      cy.fbEnterPOLabelName({ name: "New Purchase Order with Product item" });
    });

    it("Click 'Add' to finish adding new field", () => {
      cy.fbAddNewFieldButton();
    });

    it("Click 'Add New Field'", () => {
      cy.fbAddNewFieldWhenHidden();
    });

    it("Add supplier form builder field", () => {
      cy.fbSelectCustomFieldToAdd({ name: "Supplier" });
    });

    it("Fill label field with 'Supplier'", () => {
      cy.fbEnterLabel({ label: "Supplier" });
    });

    it("Click 'Add' to finish adding new field", () => {
      cy.fbAddNewFieldButton();
    });

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            const response = res.body;
            supplierFieldName = response.formTemplate.schema[1].name;
            poFieldName = response.formTemplate.schema[2].name;
          }
        });
      }).as("response");
      cy.wait("@response");
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

    it("Create new document from form", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters description 'New Document Revision description'", () => {
      cy.drEnterDocumentDescription({ description: "New HTML template description" });
    });

    it("Click on 'Add item' button", () => {
      cy.poAddNewFieldItem();
    });

    it("Click on 'Service' select option", () => {
      SystemRequirement("REQ-1390", "REQ-1420");
      cy.poSelectOption({ optionName: "service" });
    });

    it("Enter ServiceID", () => {
      SystemRequirement("REQ-1420");
      cy.poEnterServiceID({ serviceId: "SRV123" });
    });

    it("Enter Description", () => {
      SystemRequirement("REQ-1420");
      cy.poEnterDescription({ description: "Description for SRV123" });
    });

    it("Enter Quantity Ordered", () => {
      SystemRequirement("REQ-1420");
      cy.poEnterQuantityOrdered({ quantity: "5" });
    });

    it("Select Units", () => {
      SystemRequirement("REQ-1420");
      cy.poSelectUnits();
    });

    it("Select GL code", () => {
      SystemRequirement("REQ-1420");
      cy.poSelectGLCode();
    });

    it("Enter number of Units", () => {
      SystemRequirement("REQ-1420");
      cy.poNumberOfUnits({ number: "2" });
    });

    it("Add Required Date", () => {
      SystemRequirement("REQ-1420");
      cy.poAddDateRequired();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
    });

    it("Select Supplier", () => {
      cy.get("[data-cy^=\"supplier-\"]").type("SUP-00004{downarrow}{enter}");
    });

    it("Add an Approval", () => {
      cy.get("[data-cy^=\"fb-po-approvals-\"]").click();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get("ul[role=\"listbox\"]>li").contains(USERS[1].name).click();
      });
    });

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Click 'Submit for Approval' button", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
      });
    });

    it("Click 'Approve' button", () => {
      cy.get("[data-cy=\"form.builder.request.approve\"]").click();
      cy.get("input[name=\"password\"]").type("Tester1!");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove,
        CyRoutes.EmployeesGet], () => {
        cy.get("[data-cy=\"common.confirm\"]").click();
      });
    });

    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToPurchaseOrder();
    });

    it("Filters document by name and status, and select it", () => {
      cy.recClickOnFirstReceivableOnList();
    });

    it("[API]Get html document and assert string value", () => {
      cy.url().then((url: any) => {
        poHTMLDocRevId = url.split("/").pop();
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/document_revisions/generate_html/${poHTMLDocRevId}`,
          headers: {
            Authorization: `bearer ${employeeId}:${baererSessionId}`,
          },
        }).then((response) => {
          const responseBody = response.body.toString();
          expect(responseBody)
            .contains(`Purchase order: PO-00001-A`)
            .and.contains(`Name: ${documentSupplierRevisionName}`)
            .and.contains(`Description: ${documentSupplierDescription}`)
            .and.contains(`Name: SRV123`)
            .and.contains(`Description: Description for SRV123`)
            .and.contains(`Ordered: 5 each`)
            .and.contains(`GL codes: code 1`)
            .and.contains(`Total amount: 10`)
            .and.contains(`Name: ${USERS[1].name}`)
            .and.contains(`Date: ${currentDate}`);
        });
      });
    });
  });
});

export { };

