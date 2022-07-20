// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

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
let createdLotFromLHR;
let createdCSPartDocument;
let group;
const groupEveryone = "Everyone";
const ARForm = "AR Form";
const MPI = "Manufacturing Process Instructions";
const CSPartDocumentTitle = "Part document";

let lhrDocUrl1;

const EFM10605Rev = "EFM-10605 form";

context("LHR: RD case specs", () => {
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

    it("[API]Create Lot from LHR", (done: any) => {
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
              description: "<p>Lot from LHR</p>",
              document: {
                docId: "FM-00005",
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
              name: "Lot from LHR",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: cslDocumentType[0].id,
                }],
                schema: [
                  {
                    name: "lot_quantity",
                    type: "quantity",
                    index: 0,
                    label: "Initial Quantity",
                    tabId: "details",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Initial Quantity",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "lot_usable_quantity",
                    type: "quantity",
                    index: 1,
                    label: "Usable Quantity",
                    tabId: "details",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Usable Quantity",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "lot_expiry_date",
                    type: "datepicker",
                    index: 2,
                    label: "Expiration Date",
                    tabId: "details",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Expiration Date",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "lot_part",
                    type: "autocomplete",
                    index: 3,
                    label: "Part Selection",
                    rules: "required",
                    tabId: "details",
                    optionId: "21",
                    validators: {
                      required: true,
                    },
                    placeholder: "Select the appropriate part for this lot",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    validationAttribute: "Part Selection",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "100-inspection-override",
                    type: "checkboxgroup",
                    index: 4,
                    label: "100% Inspection Override",
                    tabId: "details",
                    options: [
                      {
                        text: "100% Inspection Override",
                        value: "100% Inspection Override",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    validationAttribute: "100% Inspection Override",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "fb-approvals-kn7jq134",
                    type: "approvals",
                    index: 5,
                    label: "form.builder.approvals",
                    tabId: "details",
                    deleteDisabled: true,
                    uniqueSchemaItem: true,
                  },
                ],
              },

            },
            employeeId: secondEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdLotFromLHR = response;
            cy.drAPIApproveAndRelease({
              documentId: createdLotFromLHR.id,
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
      cy.drEnterDocumentTitle( { name: "CSL with part number and CS reference" });
    });

    it("Enter quantity received", () => {
      cy.get("[name=\"lot_quantity\"]").arrowType("12");
    });

    it(`Select '${CSPartDocumentTitle}' for Part Number`, () => {
      cy.get("[data-cy=\"lot_part\"]").arrowType(CSPartDocumentTitle);
      cy.get("ul>li[role=option]").contains(CSPartDocumentTitle).arrowClick();
    });

    it("Click create document", () => {
      cy.recClickSaveBtn();
    });

    context(`Verify '${CSPartDocumentTitle}' is selected`, () => {
      it(`Verify '${CSPartDocumentTitle}' is selected for 'References'`, () => {
        cy.get("[data-cy=\"referenceTo\"]").should("contain.text", `CS-02001 - 1 - ${CSPartDocumentTitle}`);
      });

      it(`Verify '${CSPartDocumentTitle}' is selected for 'Part Number'`, () => {
        cy.get("[data-cy=\"lot_part\"]").should("have.attr", "value", `CS-02001 - rev 1 - ${CSPartDocumentTitle}`);
      });
    });

    context("Release CSL", () => {
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
      cy.drClickCreateDocumentWithApiCall();
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
          cy.get("ul>li[role=option]").contains(CSPartDocumentTitle).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      context("Select created MPI in LHR template", () => {
        it("Select MPI document for step #1 in LHRt", () => {
          cy.get("input[data-cy=\"lhrstep-built-in\"]").then(($el) => {
            $el.trigger("click");
          });
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions, CyRoutes.PatchDocRev], () => {
            cy.listLoadingElementShouldNotExist();
            cy.get("input[data-cy=\"lhrstep-built-in\"]").autocompleteSelect("MPI document");
          });
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

  context("#1 Create & Release LHR", () => {
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
    });

    it("Select 'Production' build type", () => {
      cy.unClick();
      cy.get("[value=\"Production\"]").check();
    });

    it("Add 'Due Date'", () => {
      cy.poAddDateRequired();
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it("Click 'START MPI'", () => {
      cy.mpiStartStep({ stepNumber: 1 });
    });

    it("Enter 'Start quantity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-start-quantity\"]").arrowType("8");
    });

    it("Enter 'Accepted quantity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("5");
    });

    it("Enter 'Rejected quantity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-rejected-quantity\"]").arrowType("3");
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[2].email });
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

    it("visit the LHR", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
        CyRoutes.GetSpecificDocumentType, CyRoutes.DocPreview,
      ], () => {
        cy.visit(lhrDocUrl1);
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[2].email });
      cy.unClick();
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record", () => {
      cy.ebApprove();
    });

    it("Verify status is 'Released'", () => {
      cy.drCheckDocumentStatus({ status: "Released" });
    });
  });

  context("#1 Revise LHR ", () => {
    it("Click Revise document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
        cy.get("[data-cy=\"updateRecord\"]").arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'R&D' build type", () => {
      cy.unClick();
      cy.get("[value=\"R&D\"]").check();
    });

    it("Select button to switch", () => {
      cy.get("[data-cy=\"form.builder.lhr.build.switch\"]").last().arrowClick();
      cy.get("[value=\"R&D\"]").check();
    });

    it("Validate Reference value", () => {
      cy.get("[data-cy='common.referenced.by']")
        .should("contain.text", "RD - A - Lot for CS-02001 - 1 - Part document");
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Check if RD exists", () => {
      cy.get(`td[data-grid-col-index="0"]`).eq(0)
        .should("contain.text", "RD");
    });

    it("visit the LHR", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
        CyRoutes.GetSpecificDocumentType, CyRoutes.DocPreview,
      ], () => {
        cy.visit(lhrDocUrl1);
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Validate Reference value", () => {
      cy.get("[data-cy='common.referenced.by']")
        .should("contain.text", "RD - A - Lot for CS-02001 - 1 - Part document");
    });
  });

  context("#2Create & Release LHR", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Navigate to document list", () => {
      cy.dlFilterByDocId({ docId: "LHRT" });
    });

    it("Select first document", () => {
      cy.dlSelectFirstDocument();
    });

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
    });

    it("Select 'Production' build type", () => {
      cy.unClick();
      cy.get("[value=\"Production\"]").check();
    });

    it("Add 'Due Date'", () => {
      cy.poAddDateRequired();
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it("Click 'START MPI'", () => {
      cy.mpiStartStep({ stepNumber: 1 });
    });

    it("Enter 'Start quantity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-start-quantity\"]").arrowType("8");
    });

    it("Enter 'Accepted quantity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("5");
    });

    it("Enter 'Rejected quantity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-rejected-quantity\"]").arrowType("3");
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[2].email });
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

    it("visit the LHR", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
        CyRoutes.GetSpecificDocumentType, CyRoutes.DocPreview,
      ], () => {
        cy.visit(lhrDocUrl1);
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[2].email });
      cy.unClick();
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record", () => {
      cy.ebApprove();
    });

    it("Verify status is 'Released'", () => {
      cy.drCheckDocumentStatus({ status: "Released" });
    });
  });

  context("#2 Revise LHR ", () => {
    it("Click Revise document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
        cy.get("[data-cy=\"updateRecord\"]").arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'R&D' build type", () => {
      cy.unClick();
      cy.get("[value=\"R&D\"]").check();
    });

    it("Select button to switch", () => {
      cy.get("[data-cy=\"form.builder.lhr.build.switch\"]").last().arrowClick();
      cy.get("[value=\"R&D\"]").check();
    });

    it("Validate Reference value", () => {
      cy.get("[data-cy='common.referenced.by']")
        .should("contain.text", "RD - A - Lot for CS-02001 - 1 - Part document");
    });
  });

  context("#2 View Step and Release LHRS", () => {
    it("View Step", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click Revise document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
        cy.get("[data-cy=\"updateRecord\"]").arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Click 'SELECT' for CS '${CSPartDocumentTitle}'`, () => {
      cy.get("[data-cy=\"form.builder.select\"]")
        .eq(0)
        .click({ force: true });
    });

    it(`Select lot'`, () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("input[data-cy=usedOverride]").arrowClick();
      cy.get("input[data-cy=usedOverride]").arrowType("RD{enter}" );
      cy.get("ul>li[role=option]").eq(0).arrowClick();
    });

    it("Select quantity in lot dialog", () => {
      cy.get("input[name=\"quantity\"]").arrowType("5");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostLHRs], () => {
        cy.get("div[role=dialog] button[data-cy=\"fb-control-btn\"]")
          .eq(0)
          .arrowClick();
      });
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[2].email });
      cy.unClick();
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record", () => {
      cy.ebApprove();
    });

    it("Verify status is completed", () => {
      cy.drCheckDocumentStatus({ status: "Completed" });
    });
  });

  context("#2 Release LHR", () => {
    it("visit the LHR", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
        CyRoutes.GetSpecificDocumentType, CyRoutes.DocPreview,
      ], () => {
        cy.visit(lhrDocUrl1);
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Draft Revision", () => {
      cy.get("[data-cy=\"common.docId\"]").eq(0).arrowClick();
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[2].email });
      cy.unClick();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record", () => {
      cy.ebApprove();
    });

    it("Verify status is 'Released'", () => {
      cy.drCheckDocumentStatus({ status: "Released" });
    });
  });
});
