// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { CSLDocType } from "../../utils/constants/documentTypes/csl";
import { EForm } from "../../utils/constants/documentTypes/efm";
import { CSPart } from "../../utils/constants/documentTypes/part";
import { EFM10605TemplateSchema } from "../../utils/constants/formTemplates/efm10605";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let secondEmployee;
let createdEFM10605FormDocument;
let approvalRequestDocumentType;
let formDocumentType;
let initialArDocument;
let cslDocumentType;
let csPartDocumentType;
let createdPartFormDocument;
let createdCSPartDocument;
let group;
const groupEveryone = "Everyone";
const ARForm = "AR Form";
const MPI = "Manufacturing Process Instructions";
const CSPartDocumentTitle = "Part document";

const EFM10605Rev = "EFM-10605 form";
const lotDateSuffix = moment().tz("America/Los_Angeles").format("YYMMDD");

context("LHRS displays part number and rev for Lot created out of EFM-01065", () => {
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
            documentTypes: [
              EForm,
              CSLDocType,
              CSPart,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          cslDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, CSLDocType.documentTypeName);
          csPartDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, CSPart.documentTypeName);
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

    it("[API]Create EFM-10605", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: groupEveryone,
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: secondEmployee.id,
          name: ARForm,
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>EFM-10605</p>",
              document: {
                docId: "EFM-10605",
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
              name: EFM10605Rev,
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: cslDocumentType[0].id,
                }],
                schema: EFM10605TemplateSchema,
              },

            },
            employeeId: secondEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdEFM10605FormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdEFM10605FormDocument.id,
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

    it("[API]Create Part form", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: groupEveryone,
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: secondEmployee.id,
          name: ARForm,
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
                  id: csPartDocumentType[0].id,
                }],
                schema: csPartDocumentType[0].schema,
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

    it("[API]Create CS Part", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: groupEveryone,
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: secondEmployee.id,
          name: ARForm,
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>CS Part revision</p>",
              document: {
                docId: "CS-02001",
                documentType: {
                  id: csPartDocumentType[0].id,
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
              name: CSPartDocumentTitle,
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formDocument: { id: createdPartFormDocument.id },

            },
            employeeId: secondEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdCSPartDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdCSPartDocument.id,
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
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });
  });

  context("Create CSL revision from EFM-10605", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Open EFM-10605", () => {
      cy.drClickOnSpecificDocFromList({ item: EFM10605Rev });
    });

    it("Click on Create New button", () => {
      cy.fbClickButton({ el: "PreviewControlsContainer-createNew" });
    });

    it("Enter title", () => {
      cy.wait(3000);
      cy.drEnterDocumentTitle( { name: "CSL with part number and CS reference" });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Enter quantity received", () => {
      cy.get("input[name=\"lot_quantity\"]").clear().arrowType("12").wait(2000);
      cy.unClick();
    });

    it(`Select '${CSPartDocumentTitle}' for Part Number`, () => {
      cy.get("[data-cy=\"lot_part\"]").arrowType(CSPartDocumentTitle);
      cy.get("ul>li[role=option]").contains(CSPartDocumentTitle).arrowClick({ force: true });
    });

    it("Click create document", () => {
      cy.recClickSaveBtn();
    });

    context(`Verify '${CSPartDocumentTitle}' is selected`, () => {
      it(`Verify '${CSPartDocumentTitle}' is selected for 'References'`, () => {
        cy.get("[data-cy=\"field-referenceTo\"]").contains("CS-02001 - 1 - P ...").should("exist");
      });

      it(`Verify '${CSPartDocumentTitle}' is selected for 'Part Number'`, () => {
        cy.get("[data-cy=\"lot_part\"]").should("have.attr", "value", `CS-02001 - rev 1 - ${CSPartDocumentTitle}`);
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });

    context("Release CSL", () => {
      it("Navigate to Overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add an Approval", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[2].name });
      });

      it("Click 'Submit for Approval' button", () => {
        cy.pmSubmitForApproval();
      });

      it("Click 'Approve' button", () => {
        cy.ebApprove();
      });
    });
  });

  context("Create MPI document", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'MPI document'", () => {
      cy.drEnterDocumentTitle({ name: "MPI document" });
    });

    it("Enters description 'MPI Description'", () => {
      cy.drEnterDocumentDescription({ description: "MPI Description" });
    });

    it("Selects 'Manufacturing Process Instructions' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: MPI });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Navigate to procedure tab", () => {
      cy.drSelectProcedureTab();
    });

    it("Add 'CS Part' as Material to step #1", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: CSPartDocumentTitle, quntity: "3", unit: "Each" });
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    context("Release MPI", () => {
      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Approve and release MPI document", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });

    context("Verify Materials", () => {
      it("Navigate to procedure tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Verify materials of clone of Step #1", () => {
        cy.contains("Step #1").parentsUntil("li")
          .find("[data-cy=\"form.builder.mpi.procedure.materials.title\"]")
          .should("have.text", `CS-02001 - ${CSPartDocumentTitle} | Qty: 3 each`);
      });
    });

  });

  context("Create LHRt document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.unClick();
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill LHRt document attributes", () => {
      it("Enter document title 'LHRt document'", () => {
        cy.drEnterDocumentTitle({ name: "LHRt document" });
      });

      it("Fill LHRt document description", () => {
        cy.drEnterDocumentDescription({ description: "LHRt document description" });
      });

      it("Select 'LHRt' document type", () => {
        cy.drSelectDocumentType({ documentType: "LHR Template" });
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

      it("Select 'Part document' for Part to be Manufactured", () => {
        cy.get("[data-cy=\"lhr-selected-part\"]").arrowType(CSPartDocumentTitle);
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetAutocompleteOptions], () => {
          cy.get("ul>li[role=option]").contains(CSPartDocumentTitle).arrowClick({ force: true });
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      context("Select created MPI in LHR template", () => {
        it("Navigate to Details tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Click 'LHR Step'", () => {
          cy.get("[data-cy=\"LHR Step 1\"]").scrollIntoView().arrowClick();
        });

        it("Select MPI document for step #1 in LHRt", () => {
          // cy.wait(2000);
          // cy.get("div[class^=\"MuiExpansionPanelSummary\"]").eq(0).arrowClick();
          cy.wait(2000);
          cy.get("input[data-cy=\"lhrstep-built-in\"]").autocompleteSelect("MPI document", { force: true });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });
      });

      context("Release LHRt", () => {
        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Approve and release LHRt document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });
  });

  context("Create LHR", () => {
    it("Click create new document from LHRt", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev,
        CyRoutes.GetAutocompleteOptions], () => {
        cy.drCreateNewDocumentFromForm();
      });
    });

    it("Enter initial quantity", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
    });

    it("Select 'R&D' build type", () => {
      cy.unClick();
      cy.get("[value=\"R&D\"]").check();
    });

    it("Add 'Due Date'", () => {
      cy.poAddDateRequired();
    });

    it("Click save document", () => {
      cy.wait(4000);
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Start LHRs #1", () => {
    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy=\"LHR Step 1\"]").arrowClick();
    });

    it("Click 'START MPI'", () => {
      cy.mpiStartStep({ stepNumber: 1 });
    });

    it("Navigate to procedure tab", () => {
      cy.drSelectProcedureTab();
    });

    it(`Click 'SELECT' for CS '${CSPartDocumentTitle}'`, () => {
      cy.get("[data-cy=\"form.builder.select\"]")
        .eq(0)
        .click({ force: true });
    });

    it(`Select lot 'LOT #${lotDateSuffix}01'`, () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("input[data-cy=usedOverride]").arrowClick();
      cy.get("ul>li[role=option]").contains(`LOT #${lotDateSuffix}01`).arrowClick();
    });

    it("Select quantity in lot dialog", () => {
      cy.get("input[name=\"quantity\"]").arrowType("5");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostLHRs], () => {
        cy.get("div[role=dialog] button[data-cy=\"fb-control-btn\"]")
          .eq(0)
          .click();
      });
    });

    context(`Lot is displayed under CS '${CSPartDocumentTitle}'`, () => {
      it(`Verify LOT is selected for '${CSPartDocumentTitle}'`, () => {
        cy.get("div[data-cy=\"form.builder.lhrs.procedure.materials.title\"]").eq(0).parent()
          .should("contain.text", `LOT #${lotDateSuffix}01`);
      });
    });
  });

  context("Create CSL revision from revised EFM-10605", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Open EFM-10605", () => {
      cy.drClickOnSpecificDocFromList({ item: EFM10605Rev });
    });

    it("Clicks on revise document", () => {
      cy.drClickReviseDocument();
    });

    it("Clicks Save button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release revised EFM-10605", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Create CSL revision from revised EFM-10605", () => {
      it("Click on Create New button", () => {
        cy.fbClickButton({ el: "PreviewControlsContainer-createNew" });
        cy.wait(3000);
      });

      it("Enter title", () => {
        cy.drEnterDocumentTitle( { name: "CSL (revised EFM-10605) with part number and CS reference" });
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Enter quantity received", () => {
        cy.get("[name=\"lot_quantity\"]").arrowType("12");
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Select '${CSPartDocumentTitle}' for Part Number`, () => {
        cy.get("[data-cy=\"lot_part\"]").arrowType(CSPartDocumentTitle);
        cy.get("ul>li[role=option]").contains(CSPartDocumentTitle).arrowClick({ force: true });
        cy.unClick();
      });

      it("Click create document", () => {
        cy.recClickSaveBtn();
      });

      context(`Verify '${CSPartDocumentTitle}' is selected`, () => {
        it(`Verify '${CSPartDocumentTitle}' is selected for 'References'`, () => {
          cy.get("[data-cy=\"field-referenceTo\"]").contains("CS-02001 - 1 - P ...").should("exist");
        });

        it(`Verify '${CSPartDocumentTitle}' is selected for 'Part Number'`, () => {
          cy.get("[data-cy=\"lot_part\"]").should("have.attr", "value", `CS-02001 - rev 1 - ${CSPartDocumentTitle}`);
        });
      });

      context("Release CSL", () => {
        it("Navigate to Overview tab", () => {
          cy.drSelectOverviewTab();
        });

        it("Add an Approval", () => {
          cy.pmAddApproverOnApproverList({ approver: USERS[2].name });
        });

        it("Click 'Submit for Approval' button", () => {
          cy.pmSubmitForApproval();
        });

        it("Click 'Approve' button", () => {
          cy.ebApprove();
        });
      });
    });
  });

  context("Create MPI document", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'MPI document'", () => {
      cy.drEnterDocumentTitle({ name: "MPI document (revised EFM-10605)" });
    });

    it("Enters description 'MPI Description'", () => {
      cy.drEnterDocumentDescription({ description: "MPI Description" });
    });

    it("Selects 'Manufacturing Process Instructions' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: MPI });
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Navigate to procedure tab", () => {
      cy.drSelectProcedureTab();
    });

    it("Add 'CS Part' as Material to step #1", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: CSPartDocumentTitle, quntity: "3", unit: "Each" });
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    context("Release MPI", () => {
      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Approve and release MPI document", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });

    context("Verify Materials", () => {
      it("Navigate to procedure tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Verify materials of clone of Step #1", () => {
        cy.contains("Step #1").parentsUntil("li")
          .find("[data-cy=\"form.builder.mpi.procedure.materials.title\"]")
          .should("have.text", `CS-02001 - ${CSPartDocumentTitle} | Qty: 3 each`);
      });
    });

  });

  context("Create LHRt document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.unClick();
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill LHRt document attributes", () => {
      it("Enter document title 'LHRt document'", () => {
        cy.drEnterDocumentTitle({ name: "LHRt document (revised EFM-10605)" });
      });

      it("Fill LHRt document description", () => {
        cy.drEnterDocumentDescription({ description: "LHRt document description" });
      });

      it("Select 'LHRt' document type", () => {
        cy.drSelectDocumentType({ documentType: "LHR Template" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
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

      it("Select 'Part document' for Part to be Manufactured", () => {
        cy.get("[data-cy=\"lhr-selected-part\"]").arrowType(CSPartDocumentTitle);
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetAutocompleteOptions], () => {
          cy.get("ul>li[role=option]").contains(CSPartDocumentTitle).arrowClick({ force: true });
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      context("Select created MPI in LHR template", () => {
        it("Navigate to Details tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Click 'LHR Step'", () => {
          cy.get("[data-cy=\"LHR Step 1\"]").scrollIntoView().arrowClick();
        });

        it("Select MPI document for step #1 in LHRt", () => {
          cy.get("div[class^=\"MuiExpansionPanelSummary\"]").eq(0).arrowClick();
          cy.wait(2000);
          cy.get("input[data-cy=\"lhrstep-built-in\"]")
            .autocompleteSelect("MPI document (revised EFM-10605)", { force: true });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });
      });

      context("Release LHRt", () => {
        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Approve and release LHRt document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });
  });

  context("Create LHR", () => {
    it("Click create new document from LHRt", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev,
        CyRoutes.GetAutocompleteOptions], () => {
        cy.drCreateNewDocumentFromForm();
      });
    });

    it("Enter initial quantity", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
    });

    it("Select 'R&D' build type", () => {
      cy.unClick();
      cy.get("[value=\"R&D\"]").check();
    });

    it("Add 'Due Date'", () => {
      cy.poAddDateRequired();
    });

    it("Click save document", () => {
      cy.wait(3000);
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });
  });

  context("Start LHRs #1", () => {
    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy=\"LHR Step 1\"]").arrowClick();
    });

    it("Click 'START MPI'", () => {
      cy.mpiStartStep({ stepNumber: 1 });
    });

    it("Navigate to Procedure tab", () => {
      cy.drSelectProcedureTab();
    });

    it(`Click 'SELECT' for CS '${CSPartDocumentTitle}'`, () => {
      cy.get("[data-cy=\"form.builder.select\"]")
        .eq(0)
        .click({ force: true });
    });

    it(`Select lot 'LOT #${lotDateSuffix}03'`, () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("input[data-cy=usedOverride]").arrowClick();
      cy.get("ul>li[role=option]").contains(`LOT #${lotDateSuffix}03`).arrowClick();
    });

    it("Select quantity in lot dialog", () => {
      cy.get("input[name=\"quantity\"]").arrowType("5");
      cy.unClick();
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostLHRs], () => {
        cy.get("div[role=dialog] button[data-cy=\"fb-control-btn\"]")
          .eq(0)
          .click();
      });
    });

    context(`Lot is displayed under CS '${CSPartDocumentTitle}'`, () => {
      it(`Verify LOT is selected for '${CSPartDocumentTitle}'`, () => {
        cy.get("div[data-cy=\"form.builder.lhrs.procedure.materials.title\"]").eq(0).parent()
          .should("contain.text", `LOT #${lotDateSuffix}03`);
      });
    });
  });
});
