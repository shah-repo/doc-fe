// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { NCORecord } from "../../utils/constants/documentTypes/nco";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocumentType;
let partDocumentType;
let equipmentDocument;
let createdPartDocument;
let lhrDocUrl1;
let MPIDocumentType;
let multipleCompanies;
let createdMPIDocument;
const apiCreatedCompany = {
  employees: [],
  documentTypes: [],
};

const ncoFormName = "NCO Form";
const randomNumberForCompany = (Math.round(Math.random() * 100000)) % 100000;
const newCompanyName = "New company " + randomNumberForCompany;
const newCompanyAbbr = "NC-" + randomNumberForCompany;

context("Create new company and verify Internal Type for LHR Template is LHRT", () => {
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
            companyAdminEmail: USERS[11].email,
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
        email: USERS[11].email,
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
        email: USERS[11].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Create form for NCO document", () => {
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

    it("Enters title 'New Company'", () => {
      cy.drEnterDocumentTitle({ name: "New Company" });
    });

    it("Enters description 'New Company description'", () => {
      cy.drEnterDocumentDescription({ description: "New Company description" });
    });

    it("Click on 'Details' tab", () => {
      cy.drSelectDetailsTab();
    });

    it(`Enters company name '${newCompanyName}'`, () => {
      cy.get("input[name^=company-name-]").arrowType(newCompanyName, { force: true });
    });

    it(`Enters company abbriviation '${newCompanyAbbr}'`, () => {
      cy.get("[name^=company-abbreviation-]").arrowType(newCompanyAbbr, { force: true });
    });

    it(`Enters company email '${USERS[11].email}'`, () => {
      cy.get("[name^=company-admin-email-]").arrowType(USERS[11].email, { force: true });
    });

    it("Select 'Yes' for 'Approved DAM json is used'", () => {
      cy.get("[name*='approved-dam-json-is-used']").eq(0)
        .should("have.value", "Yes").click({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Upload DOM JSON", () => {
      cy.atchUploadDOMJSONForNCO({ fileName: "lhrt_dam.json", queue: 0 });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Yes' for 'Approved Page Details json is used'", () => {
      cy.get("[name*='approved-page-details-json-is-used-']").eq(0)
        .should("have.value", "Yes").click({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Upload Page Details JSON", () => {
      cy.atchUploadPageDetailsJSONForNCO({ fileName: "PageDetails.json", queue: 0 });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Yes' for 'Approved Navigation json is used'", () => {
      cy.get("[name*='approved-navigation-json-is-used-']").eq(0)
        .should("have.value", "Yes").click({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Upload Navigation JSON", () => {
      cy.atchUploadNavigationJSONForNCO({ fileName: "doc_type_navigation.json", queue: 0 });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Upload Users List JSON", () => {
      cy.atchUploadUserListJSONForNCO({ fileName: "users.csv", queue: 0 });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Upload logo picture 'image.jpg'", () => {
      cy.get("[data-cy='albumMediaButton']").eq(0).arrowClick({ force: true });
      cy.pmUploadAttachment({ fileName: "image.jpg" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Approve and release document for create company", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Log out user", () => {
      cy.authLogout();
    });
  });

  context("Login User", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[11].email,
      });
    });

    it("Intercept APIs", () => {
      cy.intercept({ method: "GET", pathname: "/api/v1/company/mine" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            const response = res.body;
            apiCreatedCompany.employees = response.employees;
            adminEmployee = apiCreatedCompany.employees.find((employee) => employee.user.email === USERS[11].email);
          }
        });
      }).as("response");

      cy.intercept({ method: "GET", pathname: "/api/v1/document_type" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            apiCreatedCompany.documentTypes = res.body;
            approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(apiCreatedCompany, "Approval Request");
            equipmentDocumentType = cmpFilterDocumentTypeIdByName(apiCreatedCompany, "Equipment or Fixture");
            partDocumentType = cmpFilterDocumentTypeIdByName(apiCreatedCompany, "Component Specification");
            MPIDocumentType = cmpFilterDocumentTypeIdByName(apiCreatedCompany, "Manufacturing Process Instruction");
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

    it("[API]Create equipment one", () => {
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
              description: "<p>Equipment one</p>",
              document: {
                docId: "ET-00003",
                documentType: {
                  id: equipmentDocumentType[0].id,
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
              name: "Equipment one",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            equipmentDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: equipmentDocument.id,
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

    it("[API]Create part document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Part document</p>",
          document: {
            docId: "PRT-00005",
            documentType: {
              id: partDocumentType[0].id,
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
          name: "Part document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdPartDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPartDocument.id,
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

    it("[API]Create MPI document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>MPI created through API</p>",
          document: {
            docId: "PI-00001",
            documentType: {
              id: MPIDocumentType[0].id,
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
          name: "API MPI",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [],
            schema: [
              {
                name: "fb-mpi-procedure-section-built-in",
                type: "section",
                index: 0,
                label: "form.builder.mpiprocedure",
                deleteDisabled: true,
                deleteInFormDisabled: true,
                tabId: "procedure",
              },
              {
                name: "mpi-procedure-built-in",
                type: "mpiprocedure",
                index: 1,
                tabId: "procedure",
                stepIndex: 1,
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                editorProperties: [
                  "includeNotes",
                ],
                includeNotes: true,
                editorConfig: {
                  description: "<p>Description for step 1</p>",
                  materials: [
                    {
                      id: "kvasuama",
                      title: createdPartDocument.id,
                      quantity: 3,
                      unit: "each",
                    },
                  ],
                  equipment: [
                    {
                      id: "kvasulmm",
                      title: equipmentDocument.id,
                    },
                  ],
                },
              },
              {
                name: "lhrs-start-quantity",
                type: "quantity",
                index: 2,
                label: "Start quantity",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [
                  "includeNotes",
                ],
                validationAttribute: "Start quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                includeNotes: true,
                tabId: "procedure",
              },
              {
                name: "lhrs-accepted-quantity",
                type: "quantity",
                index: 3,
                label: "Accepted quantity",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [
                  "includeNotes",
                ],
                validationAttribute: "Accepted quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                includeNotes: true,
                tabId: "procedure",
              },
              {
                name: "lhrs-rejected-quantity",
                type: "quantity",
                index: 4,
                label: "Rejected quantity",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [
                  "includeNotes",
                ],
                validationAttribute: "Rejected quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                includeNotes: true,
                tabId: "procedure",
              },
              {
                name: "approvals-built-in",
                type: "approvals",
                index: 5,
                label: "Approvals",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                uniqueSchemaItem: true,
                validationAttribute: "Approvals",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                tabId: "overview",
              },
            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdMPIDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdMPIDocument.id,
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

  context("Verify DAM", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Filter list by status", () => {
      cy.dlFilterByStatus({ status: "Draft" });
      cy.listLoadingElementShouldNotExist();
    });

    it("Click document", () => {
      cy.get("[data-grid-col-index=\"2\"]").arrowClick();
    });

    it("Verify matrix details", () => {
      cy.drSelectMatrixDetailsTab();
      cy.get(".MuiTableBody-root")
        .should("contain", "LHRT-")
        .and("contain", "LHRT")
        .and("contain", "Lot History Record Template");
    });
  });

  context("Verify in document type management", () => {
    it("Navigate to document type management", () => {
      cy.navigToDocumentTypeManagement();
    });

    it("Filter items", () => {
      cy.get(`[aria-colindex="12"] [class="k-input"]`).arrowClick({ force: true });
      cy.get("li").contains("LHRT").arrowClick().wait(500);
      cy.get(`[data-grid-col-index="0"]`).should("exist");
      cy.listLoadingElementShouldNotExist();
      cy.get(`[aria-rowindex="3"] td`).eq(1).should("have.text", "Lot History Record Template");
      cy.get(`[aria-rowindex="3"] td`).eq(11).should("have.text", "LHRT");
    });
  });

  context("Create LHRT document", () => {
    it("Navigate to Document list", () => {
      cy.unClick();
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'LHRt document'", () => {
      cy.drEnterDocumentTitle({ name: "LHRt document" });
    });

    it("Fill LHRt document description", () => {
      cy.drEnterDocumentDescription({ description: "LHRt document description" });
    });

    it("Select 'LHRt' document type", () => {
      cy.drSelectDocumentType({ documentType: "Lot History Record Template" });
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Lot History Record' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Lot History Record" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Verify if exist LHR fields", () => {
      cy.get("[data-cy=\"Part to be Manufactured\"]").should("exist");
      cy.get("[data-cy=\"Initial Quantity\"]").should("exist");
      cy.get("[data-cy=\"Build Type\"]").should("exist");
      cy.get("[data-cy=\"Due Date\"]").should("exist");
    });

    it("Verify Group for LHR Template", () => {
      cy.intercept({ method: "GET", pathname: "/api/v1/document_type" }, (req) => {
        req.reply((res) => {
          const item = res.body.find((item) => item.documentTypeName === "LHR Template");
          expect(item.group).to.equal("LHRT");
        });
      }).as("response");
    });

    it("Verify LHRT is in DRAFT status", () => {
      cy.drCheckDocumentStatus({ status: "DRAFT" });
      cy.get("[data-cy=HeaderInfo-Rev]").should("contain", "Rev 1");
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy^=\"LHR Step\"]").arrowClick({ force: true });
      cy.wait(2000);
    });

    it("Select Overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Select 'Part document' for Part to be Manufactured", () => {
      cy.get("[data-cy=\"lhr-selected-part\"]").focus().arrowType("Part document");
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
        cy.get("ul>li[role=option]").contains("Part document").arrowClick();
      });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    context("Select created MPI in LHR template", () => {
      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Click 'LHR Step'", () => {
        cy.get("[data-cy=\"LHR Step 2\"]").arrowClick({ force: true });
        cy.wait(2000);
      });

      it("Select MPI document for step #1 in LHRt", () => {
        cy.get("input[data-cy=\"lhrstep-built-in\"]").then(($el) => {
          $el.trigger("click");
        });
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
          cy.get("input[data-cy=\"lhrstep-built-in\"]").autocompleteSelect("API MPI");
        });
      });
    });

    context("Release LHRT", () => {
      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Approve and release LHRt document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });

      it("Verify LHRT is in RELEASED status", () => {
        cy.drCheckDocumentStatus({ status: "RELEASED" });
        cy.get("[data-cy=HeaderInfo-Rev]").should("contain", "Rev 1");
      });
    });
  });

  context("Create & Release LHR", () => {
    it("Click create new document from LHRt", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev,
        CyRoutes.GetAutocompleteOptions], () => {
        cy.drCreateNewDocumentFromForm();
        cy.url().then((url: any) => {
          lhrDocUrl1 = url;
        });
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter initial quantity", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
      cy.unClick();
    });

    it("Select 'Production' build type", () => {
      cy.get("[value=\"Production\"]").check();
      cy.unClick();
    });

    it("Add 'Due Date'", () => {
      cy.poAddDateRequired();
      cy.unClick();
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy=\"LHR Step 2\"]").arrowClick().wait(2000);
    });

    it("Click 'START MPI'", () => {
      cy.mpiStartStep({ stepNumber: 1 });
    });

    it("Select Procedure tab", () => {
      cy.drSelectProcedureTab();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter 'Start quantity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-start-quantity\"]").arrowType("8");
      cy.unClick();
    });

    it("Enter 'Accepted quantity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("5");
      cy.unClick();
    });

    it("Enter 'Rejected quantity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-rejected-quantity\"]").arrowType("3");
      cy.unClick();
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
      cy.wait(2000);
    });

    it("Select Overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[11].email });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Complete step", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve step", () => {
      cy.ebApprove();
    });

    it("Visit the LHR", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
        CyRoutes.GetSpecificDocumentType,
      ], () => {
        cy.visit(lhrDocUrl1);
      });
    });

    it("Add approval", () => {
      cy.get(`[data-cy^="fb-approvals"]`).should("exist");
      cy.lhrAddApproverOnApproverList({ approver: USERS[11].name });
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it("Submit for approval", () => {
      cy.lhrSubmitForApproval();
    });

    it("Approve approval", () => {
      cy.lhrApprove();
    });

    it(`Verify status is 'RELEASED'`, () => {
      cy.drCheckDocumentStatus({ status: "RELEASED" });
    });
  });
});
