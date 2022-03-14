
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

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
let supplierDocumentType;
let adminEmployee;
let secondEmployee;
let thirdEmployee;
let group;
let supplierDocument;
let dateOfApproval1;
let dateOfApproval1MinuteAfter;
let dateOfApproval2;
let dateOfApproval2MinuteAfter;
let dateOfApproval3;
let dateOfApproval3MinuteAfter;
const CheckForSome = (bits) => (string) => bits.some((bit) => string.includes(bit));

context("Create company via API and create Suppliers document", () => {
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
          helloSignIntegrationEnabled: false,
          helloSignTestMode: false,
          importerEmail: IMPORTER_USER.email,
          numOfRevStages: 3,
          numOfDocDigits: 5,
          remoteValidatorBundleName: "default",
          slackIntegrationEnabled: false,
          users: [USERS[2], USERS[3], USERS[4]],
          acctCodes: ["code 1"],
          addresses: ["Address 1"],
        }, sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdCompany = response;
        adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
        secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
        thirdEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[3].email);
        supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
        done();
      });
    });
  });

  it("[API] Login admin tester", (done: any) => {
    cy.authApiLogin({
      email: USERS[1].email,
      password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
    }).then((response) => {
      loginResponse = response;
      done();
    });
  });

  it("[API]Creates suplier document", (done: any) => {
    cy.grpGetGroupByName({
      sessionId: loginResponse.sessionId,
      employeeId: adminEmployee.id,
      groupName: "Everyone",
    }).then((response) => {
      group = response;
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Test Supplier Document</p>",
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
          name: "API supplier",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then(() => {
        done();
      });
    });
  });

  it("Login user to dashboard", () => {
    cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
  });

  context("Create supplier form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Supplier Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Supplier Form" });
    });

    it("Enter description 'New Supplier Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Supplier Form description" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Supplier' document type", () => {
      SystemRequirement("REQ-2400");
      cy.drSelectOutputDocumentType({ documentType: "Supplier" });
      cy.unClick();
    });

    it("Verify approval field is added as result of predefined schema", () => {
      SystemRequirement("REQ-2400");
      cy.get("[id^=\"fb-approvals-section-fb-approvals\"]").should("exist");
      cy.get("input[data-cy^=\"fb-approvals-fb-approvals\"]").should("exist");
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create supplier document", () => {
    it("Navigate to supplier list", () => {
      SystemRequirement("REQ-2230");
      cy.navigToSuppliers();
    });

    it("Click create new to create supplier", () => {
      SystemRequirement("REQ-2330");
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
        cy.supCreateNew();
      });
    });

    it("Enter 'Supplier Address/Phone'", () => {
      SystemRequirement("REQ-2360");
      cy.drEnterDocumentDescription({ description: "Test Supplier address" });
    });

    it("Enter 'Supplier Name'", () => {
      SystemRequirement("REQ-2360");
      cy.supEnterSuppName({ name: "Test Supplier" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateSupplierWithApiCall();
    });

    it("Add approver to approvers list", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
      cy.pmAddApproverOnApproverList({ approver: USERS[2].email });
      cy.pmAddApproverOnApproverList({ approver: USERS[3].email });
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
      cy.url().then((url: any) => {
        supplierDocument = url;
      });
    });

    context(`Approve supplier with approval block for user ${USERS[2].name}`, () => {
      it(`Logout ${USERS[1].name}`, () => {
        cy.authLogout();
      });

      it(`Login ${USERS[2].name}`, () => {
        cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
      });

      it("Navigate to Supplier", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev, CyRoutes.SessionDetails], () => {
          cy.visit(supplierDocument);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve supplier document", () => {
        cy.ebApprove();
        dateOfApproval2 = moment().tz("America/Los_Angeles").format("MMMM D, YYYY hh:mm A");
        dateOfApproval2MinuteAfter = moment().tz("America/Los_Angeles").add(1, "minute").format("MMMM D, YYYY hh:mm A");
      });
    });

    context(`Approve supplier with approval block for user ${USERS[3].name}`, () => {
      it(`Logout ${USERS[2].name}`, () => {
        cy.authLogout();
      });

      it(`Login ${USERS[3].name}`, () => {
        cy.authLoginToDashboard({ USER: USERS[3], employeeId: thirdEmployee.id });
      });

      it("Navigate to Supplier", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev, CyRoutes.SessionDetails], () => {
          cy.visit(supplierDocument);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve supplier document", () => {
        cy.ebApprove();
        dateOfApproval3 = moment().tz("America/Los_Angeles").format("MMMM D, YYYY hh:mm A");
        dateOfApproval3MinuteAfter = moment().tz("America/Los_Angeles").add(1, "minute").format("MMMM D, YYYY hh:mm A");
      });
    });

    context(`Approve supplier with approval block for user ${USERS[1].name}`, () => {
      it(`Logout ${USERS[3].name}`, () => {
        cy.authLogout();
      });

      it(`Login ${USERS[1].name}`, () => {
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      });

      it("Navigate to Supplier", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev, CyRoutes.SessionDetails], () => {
          cy.visit(supplierDocument);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve supplier document", () => {
        cy.ebApprove();
        dateOfApproval1 = moment().tz("America/Los_Angeles").format("MMMM D, YYYY hh:mm A");
        dateOfApproval1MinuteAfter = moment().tz("America/Los_Angeles").add(1, "minute").format("MMMM D, YYYY hh:mm A");
      });
    });

    context("Verify approval data", () => {
      it(`Verify approval data for ${USERS[1].name}`, () => {
        cy.get(`[data-cy="approved-${USERS[1].name}"]`).then(($el) => {
          const elementText = $el.text();
          expect(elementText).to.include(USERS[1].name,);
          expect(elementText).to.include(USERS[1].email);
          expect(elementText).to.include("APPROVED");
          const containsSome = CheckForSome([dateOfApproval1, dateOfApproval1MinuteAfter]);
          expect(elementText).to.satisfy(containsSome);
        });
      });

      it(`Verify approval data for ${USERS[2].name}`, () => {
        cy.get(`[data-cy="approved-${USERS[2].name}"]`).then(($el) => {
          const elementText = $el.text();
          expect(elementText).to.include(USERS[2].name,);
          expect(elementText).to.include(USERS[2].email);
          expect(elementText).to.include("APPROVED");
          const containsSome = CheckForSome([dateOfApproval2, dateOfApproval2MinuteAfter]);
          expect(elementText).to.satisfy(containsSome);
        });
      });

      it(`Verify approval data for ${USERS[3].name}`, () => {
        cy.get(`[data-cy="approved-${USERS[3].name}"]`).then(($el) => {
          const elementText = $el.text();
          expect(elementText).to.include(USERS[3].name,);
          expect(elementText).to.include(USERS[3].email);
          expect(elementText).to.include("APPROVED");
          const containsSome = CheckForSome([dateOfApproval3, dateOfApproval3MinuteAfter]);
          expect(elementText).to.satisfy(containsSome);
        });
      });
    });
  });

  context("Verify supplier is created", () => {
    it("Navigate to supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Filter supplier Title/Name", () => {
      cy.filterSupplierTitle({ name: "Test" });
      cy.listLoadingElementShouldNotExist();
    });

    it("Check for filtered values", () => {
      SystemRequirement("REQ-2320");
      cy.filterCheckNumberOfDisplayedRecords({ numberOfRecords: "1" });
    });

    it("Clear filter", () => {
      SystemRequirement("REQ-2310");
      cy.filterClear();
      cy.filterCheckNumberOfDisplayedRecords({ numberOfRecords: "2" });
    });

    it("Click on existing supplier file from list", () => {
      SystemRequirement("REQ-2340");
      cy.supClickOnSpecificSupplierFileFromList({ item: "SUP-00001" });
    });
  });

  context("Create another supplier form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Supplier Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Supplier Form 2" });
    });

    it("Enter description 'New Supplier Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Supplier Form description 2" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Supplier' document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Supplier" });
      cy.unClick();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Verify there is two forms to create supplier", () => {
    it("Navigate to supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Click on create supplier to prompt option of which supplier form we should use", () => {
      SystemRequirement("REQ-2350");
      cy.supCreateNew();
    });

    it("Check if forms are suggested on creating new supplier", () => {
      SystemRequirement("REQ-2350");
      cy.supCheckForSuggestedForms("New Supplier Form", "New Supplier Form 2");
    });
  });

  context("Verify life cycle of supplier document", () => {
    it("Navigate to created supplier", () => {
      cy.unClick();
      cy.get("[data-cy=\"suggestFormCancelBtn\"]").arrowClick();
      cy.dlFilterByDocId({ docId: "SUP-00001" });
      cy.dlSelectFirstDocument();
    });

    context("Verify next revision update of supplier document", () => {
      it("Press button update record", () => {
        cy.drClickReviseDocument();
      });

      it("Update supplier address", () => {
        cy.drEnterDocumentDescription({ description: "Updated Supplier address" });
      });

      it("Leave Update for Type of Change and save", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Add approval", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve supplier document", () => {
        cy.ebApprove();
      });

      it("Verify revision after update is equal to 2", () => {
        cy.drVerifyFirstDocumentRevisionList({ revision: "Revision 2  - Current" });
      });
    });

    context("Verify correction revision update of supplier document", () => {
      it("Press button update record", () => {
        cy.drClickReviseDocument();
      });

      it("Update supplier address", () => {
        cy.drEnterDocumentDescription({ description: "Updated for second time, Supplier address" });
      });

      it("Select correction upgrade type 2.1", () => {
        cy.drChooseTypeOfRevisionChangeOption({ option: "Correction" });
      });

      it("Leave Update for Type of Change and save", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Add approval", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve supplier document", () => {
        cy.ebApprove();
      });

      it("Verify revision after update is equal to 2", () => {
        cy.drVerifyFirstDocumentRevisionList({ revision: "Revision 2.1  - Current" });
      });
    });
  });
});

export { };

