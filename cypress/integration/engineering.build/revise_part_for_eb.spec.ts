// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
let secondEmployee;
let group;
let initialArDocument;
let partDocumentType;
let approvalRequestDocumentType;
let createdPartFormDocument;
let formDocumentType;

const PART_DOCUMENT_TYPE_NAME = "Parts";
const PART_NAME = "Test Part";

context("Revise Part from EB and release cloned EB test", () => {
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
    it("[API]Create company", (done: any) => {
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
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, PART_DOCUMENT_TYPE_NAME);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Create Part form", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: secondEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Part form</p>",
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
              name: "Part form document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: partDocumentType[0].id,
                }],
                schema: [],
              },

            },
            employeeId: secondEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdPartFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdPartFormDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: secondEmployee.id } }],
              },
              employeeId: secondEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });
  });

  context("Create EB form", () => {
    context("Start document creation flow", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in the form attributes", () => {
      it("Enter title 'Engineering Build Form", () => {
        cy.drEnterDocumentTitle({ name: "Engineering Build Form" });
      });

      it("Enter description 'Engineering Build Form description'", () => {
        cy.drEnterDocumentDescription({ description: "Engineering Build Form description" });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Engineering Build' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Engineering Build" });
      });
    });

    context("Create the form and release it", () => {
      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Verify that Approvals field is automatically added", () => {
        cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
      });

      it("Approve and release the form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create an EB with revision canceled draft", () => {
    context("Create a part", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigate to parts", () => {
        cy.navigToParts();
      });

      it("Clicks on 'Add new part' button", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.DocPreview], () => {
          cy.ptClickCreateNewPart();
        });
      });

      it(`Enter title '${PART_NAME}'`, () => {
        cy.drEnterDocumentTitle({ name: PART_NAME });
      });

      it("Enter description 'Test Part description'", () => {
        cy.drEnterDocumentDescription({ description: "Test Part description" });
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Approve and Release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });

      it("Revise document", () => {
        cy.drClickReviseDocument();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Click on 'Cancel Draft'", () => {
        cy.drCancelDraftFromMenu();
      });
    });

    context("Create an EB", () => {
      it("Navigate to Records", () => {
        cy.navigToRecords();
      });

      it("Click on 'Create new'", () => {
        cy.poClickCreatePO();
      });

      it("Select 'Engineering Build' from the dropdown", () => {
        cy.recSelectRecordFormFromMultiSelect({
          recordType: "Engineering Build",
        });
      });

      it("Enter title 'Test Engineering Build'", () => {
        cy.drEnterDocumentTitle({ name: "Test Engineering Build" });
      });

      it("Enter description 'Test Engineering Build description'", () => {
        cy.drEnterDocumentDescription({ description: "Test Engineering Build description" });
      });

      it("Save the EB", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Choose a part", () => {
      it("Choose an released part from the list of available parts", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
          cy.get("[data-cy=\"childrenParts\"]").arrowType(PART_NAME + "{downarrow}{enter}");
        });
      });
    });


    context("Clone EB", () => {
      it("Click Clone EB button", () => {
        cy.ebClickCloneFromMenu();
      });

      it("Verify that the selected part is copied to the new build", () => {
        cy.get("[data-cy=\"childForRevise\"]").arrowType(PART_NAME + "{downarrow}{enter}");
        cy.get("[data-cy=\"childForRevise\"]").should("contains.attr", "value", "PRT-00004 - rev 1 - Test Part");
      });
    });

    context("Select First EB and release it", () => {
      it("Navigate to records list", () => {
        cy.navigToRecords();
      });

      it("Select EB document", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "EB-00001" });
        cy.ebSelectFirstDocument();
      });

      it("Add an Approval", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
      });

      it("Submit for Approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Check if the part is displayed in the document summary", () => {
        cy.ebCheckIfPartIsInSummary({ partName: PART_NAME });
      });

      it("Approve record button click", () => {
        cy.ebApprove();
      });
    });

    context("Select Cloned EB and release it", () => {
      it("Navigate to records list", () => {
        cy.navigToRecords();
      });

      it("Select EB document", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "EB-00002" });
        cy.ebSelectFirstDocument();
      });

      it("Add an Approval", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
      });

      it("Submit for Approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Check if the part is displayed in the document summary", () => {
        cy.ebCheckIfPartIsInSummary({ partName: PART_NAME });
      });

      it("Approve record button click", () => {
        cy.ebApprove();
      });
    });
  });
});


export { };

