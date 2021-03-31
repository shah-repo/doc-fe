// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
let secondEmployee;
let componentSpecificationDocumentType;
let group;
const documentRevisionName = "New document for testing document list";
const secondDocumentRevName = "Second document for testing";
const currentDate = moment().tz("America/Los_Angeles").format("l");

context("Document list test", () => {
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
            documentTypes: [
              {
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP",
                group: "OTHER",
                isQms: true,
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          componentSpecificationDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Clinical Protocol");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    it("[API]Creates document revision for document list test 1", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Test Doc Rev Description1</p>",
            document: {
              docId: "CP-00003",
              documentType: {
                id: componentSpecificationDocumentType[0].id,
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
            name: documentRevisionName,
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,

          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => {
          done();
        });
      });
    });
    it("[API]Creates document revision for document list test 2", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Test Doc Rev Description2</p>",
          document: {
            docId: "CP-00004",
            documentType: {
              id: componentSpecificationDocumentType[0].id,
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
          name: secondDocumentRevName,
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,

        },
        employeeId: secondEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then(() => {
        done();
      });
    });
  });
  context("Login user", () => {
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

  context("Check document list defaults to Released documents at start of session", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Verify default filter status", () => {
      SystemRequirement("REQ-0070");
      cy.dlVerifyFilterByStatus({ status: "RELEASED" });
    });
  });

  context("Prepare document", () => {
    it("Filter document by name and status, and select it", () => {
      SystemRequirement("REQ-0120");
      cy.drFilterDocListByNameAndStatus({ title: documentRevisionName, status: "Draft" });
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clear filters", () => {
      cy.dlClearFilters();
    });
  });

  context("Verify most recent edited document is first on list", () => {
    it("Verify first document is: " + documentRevisionName, () => {
      SystemRequirement("REQ-0090");
      cy.dlVerifyFilterByDocTitle({ docTitle: documentRevisionName });
    });
  });

  context("Validate document values exist on document list", () => {
    it("Verify document id is present on document list", () => {
      SystemRequirement("REQ-0030");
      cy.dlVerifyDocIdIsPresentOnFirstDocument();
    });

    it("Verify document revision is present on document list", () => {
      SystemRequirement("REQ-0030");
      cy.dlVerifyRevisionIsPresentOnFirstDocument();
    });

    it("Verify document title is present on document list", () => {
      SystemRequirement("REQ-0030");
      cy.dlVerifyTitleIsPresentOnFirstDocument();
    });

    it("Verify document type is present on document list", () => {
      SystemRequirement("REQ-0030");
      cy.dlVerifyTypeIsPresentOnFirstDocument();
    });

    it("Verify document owner is present on document list", () => {
      SystemRequirement("REQ-0030");
      cy.dlVerifyOwnerIsPresentOnFirstDocument();
    });

    it("Verify document AR ID is present on document list", () => {
      SystemRequirement("REQ-0030");
      cy.dlVerifyARIdIsPresentOnFirstDocument();
    });

    it("Verify document status is present on document list", () => {
      SystemRequirement("REQ-0030");
      cy.dlVerifyStatusIsPresentOnFirstDocument();
    });

    it("Verify document effective date is present on document list", () => {
      SystemRequirement("REQ-0030");
      cy.dlVerifyEffectiveDateIsPresentOnFirstDocument();
    });
  });
  context("Check for documents only on document list", () => {
    it("Clear filters", () => {
      cy.dlClearFilters();
    });

    it("Check only documents are shown on document list", () => {
      SystemRequirement("REQ-0050");
      // SystemRequirement("REQ-0510");
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
    });
  });

  context("Check for filters", () => {

    context("Check docId filter", () => {
      it("Clear filters", () => {
        cy.dlClearFilters();
      });

      it("Filter list by docId", () => {
        cy.dlFilterByDocId({ docId: "CP-00003" });
      });

      it("Verify filter by docId", () => {
        SystemRequirement("REQ-0060");
        cy.dlVerifyFilterByDocId({ docId: "CP-00003" });
      });

      it("Verify document counter on document list", () => {
        SystemRequirement("REQ-0110");
        cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      });
    });

    context("Check revision filter", () => {
      it("Clear filters", () => {
        cy.dlClearFilters();
      });

      it("Filter list by revision", () => {
        cy.dlFilterByRev({ revision: "1" });
      });

      it("Verify filter by revision", () => {
        SystemRequirement("REQ-0060");
        cy.dlVerifyFilterByRev({ revision: "1" });
      });

      it("Verify document counter on document list", () => {
        SystemRequirement("REQ-0110");
        cy.dlVerifyDocCounter({ docCounterNumber: 3 });
      });
    });

    context("Check document title filter", () => {
      it("Clear filters", () => {
        cy.dlClearFilters();
      });

      it("Filter list by document title", () => {
        cy.dlFilterByDocTitle({ docTitle: documentRevisionName });
      });

      it("Verify filter by document title", () => {
        SystemRequirement("REQ-0060");
        cy.dlVerifyFilterByDocTitle({ docTitle: documentRevisionName });
      });

      it("Verify document counter on document list", () => {
        SystemRequirement("REQ-0110");
        cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      });
    });

    context("Check type filter", () => {
      it("Clear filters", () => {
        cy.dlClearFilters();
      });

      it("Filter list by type", () => {
        cy.dlFilterByType({ type: "CP" });
      });

      it("Verify filter by type", () => {
        SystemRequirement("REQ-0060");
        cy.dlVerifyFilterByType({ type: "CP" });
      });

      it("Verify document counter on document list", () => {
        SystemRequirement("REQ-0110");
        cy.dlVerifyDocCounter({ docCounterNumber: 2 });
      });
    });

    context("Check owner filter", () => {
      it("Clear filters", () => {
        cy.dlClearFilters();
      });

      it("Filter list by owner", () => {
        cy.dlFilterByOwner({ owner: USERS[2].name });
      });

      it("Verify filter by owner", () => {
        SystemRequirement("REQ-0060");
        cy.dlVerifyFilterByOwner({ owner: USERS[2].name });
      });

      it("Verify document counter on document list", () => {
        SystemRequirement("REQ-0110");
        cy.dlVerifyDocCounter({ docCounterNumber: 2 });
      });
    });

    context("Check AR ID filter", () => {
      it("Clear filters", () => {
        cy.dlClearFilters();
      });

      it("Filter list by AR ID", () => {
        cy.dlFilterByArId({ arId: "AR99999" });
      });

      it("Verify filter by AR ID", () => {
        SystemRequirement("REQ-0060");
        cy.dlVerifyFilterByArId({ arId: "AR99999" });
      });

      it("Verify document counter on document list", () => {
        SystemRequirement("REQ-0110");
        cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      });
    });

    context("Check status filter", () => {
      it("Clear filters", () => {
        cy.dlClearFilters();
      });

      it("Filter list by status", () => {
        cy.dlFilterByStatus({ status: "Released" });
      });

      it("Verify filter by status", () => {
        SystemRequirement("REQ-0060");
        cy.dlVerifyFilterByStatus({ status: "RELEASED" });
      });

      it("Verify document counter on document list", () => {
        SystemRequirement("REQ-0110");
        cy.dlVerifyDocCounter({ docCounterNumber: 2 });
      });
    });

    context("Check effective date filter", () => {
      it("Clear filters", () => {
        cy.dlClearFilters();
      });

      it("Filter list by effective date", () => {
        cy.dlFilterByEffectiveDate({ effectiveDate: "Last 7 days" });
      });

      it("Verify filter by effective date", () => {
        SystemRequirement("REQ-0060");
        // cy.dlVerifyFilterByEffectiveDate({ effectiveDate: (new Date()).toLocaleDateString("en-US") });
        cy.dlVerifyFilterByEffectiveDate({ effectiveDate: currentDate });
      });
    });

    context("Check for maintaining document list filter options", () => {
      it("Clear filters", () => {
        cy.dlClearFilters();
      });

      it("Filter list by status", () => {
        cy.dlFilterByStatus({ status: "Draft" });
      });

      it("Filter list by document title", () => {
        cy.dlFilterByDocTitle({ docTitle: secondDocumentRevName });
      });

      it("Navigate to Dashboard", () => {
        cy.navigToDashboard();
      });

      it("Navigate back to document list", () => {
        cy.navigToDocumentList();
      });

      it("Verify filter by status", () => {
        SystemRequirement("REQ-0080");
        cy.dlVerifyFilterByStatus({ status: "DRAFT" });
      });

      it("Verify filter by document title", () => {
        SystemRequirement("REQ-0080");
        cy.dlVerifyFilterByDocTitle({ docTitle: secondDocumentRevName });
      });
    });
    context("Check clear button is clearing all filters", () => {
      it("Clear filters", () => {
        cy.dlClearFilters();
      });

      it("Verify filters are cleared", () => {
        SystemRequirement("REQ-0100");
        cy.dlVerifyFilterClear();
      });
    });
  });
  context("Verify description is shown on hover", () => {
    it("Verify description", () => {
      // SystemRequirement("REQ-0130");
      cy.dlVerifyDescriptionOnHover({ description: "\nTest Doc Rev Description1\n" });
    });
  });
});

