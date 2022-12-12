// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { NCORecord } from "../../utils/constants/documentTypes/nco";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

const ncoFormName = "NCO Form";
const randomNumberForCompany = (Math.round(Math.random() * 100000)) % 100000;
const newCompanyName = "New company " + randomNumberForCompany;
const newCompanyAbbr = "NC-" + randomNumberForCompany;
const apiCreatedCompany = {
  employees: [],
  documentTypes: [],
};
let lhrUrl;
let lhrUrl1;
let lhrUrl2;
let lhrUrl3;
let lhrUrl4;
let lhrUrl5;
let createdCompany;
let adminEmployee;
let thirdEmployee;
let loginResponse;
let multipleCompanies;
let approvalRequestDocumentType;
let equipmentDocumentType;
let partDocumentType;
let MPIDocumentType;
let LHRtDocumentType;
let LHRDocumentType;
let group;
let initialArDocument;
let equipmentDocument;
let createdPartDocument;
let createdMPIDocument;
let createdLHRtDocument;
let ceoGroup;

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

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Enters title 'New Company'", () => {
        cy.drEnterDocumentTitle({ name: "New Company" });
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
        cy.atchUploadDOMJSONForNCO({ fileName: "dam_lhr.json", queue: 0 });
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

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
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

  context("Add new User, Part doc, MPI doc, LHRt doc", () => {
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
            adminEmployee = apiCreatedCompany.employees.find((employee) => employee.user.email === USERS[1].email);
            thirdEmployee = apiCreatedCompany.employees.find((employee) => employee.user.email === USERS[3].email);
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
            LHRtDocumentType = cmpFilterDocumentTypeIdByName(apiCreatedCompany, "Lot History Record Template");
            LHRDocumentType = cmpFilterDocumentTypeIdByName(apiCreatedCompany, "Lot History Record");
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

    it("[API]Create LHRt document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>LHRt created with API</p>",
          document: {
            docId: "LHRT-00003",
            documentType: {
              id: LHRtDocumentType[0].id,
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
          name: "API LHRt document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [
              { id: LHRDocumentType[0].id },
            ],
            schema: [
              {
                name: "lhr-selected-part",
                type: "partsselection",
                index: 0,
                label: "Part to be Manufactured",
                deleteDisabled: true,
                deleteInFormDisabled: true,
                editorConfig: {
                  id: createdPartDocument.documentId,
                },
                tabId: "details",
              },
              {
                name: "lhr_initial_quantity",
                type: "quantity",
                index: 1,
                label: "Initial Quantity",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationAttribute: "Initial Quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                tabId: "details",
              },
              {
                name: "lhr-end-quantity",
                type: "quantity",
                index: 2,
                label: "End Quantity",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                outputDisabled: true,
                validationAttribute: "End Quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                tabId: "details",
              },
              {
                name: "lhr-build-type",
                type: "radiogroup",
                index: 3,
                label: "Build Type",
                options: [
                  {
                    text: "R&D",
                    value: "R&D",
                  },
                  {
                    text: "Production",
                    value: "Production",
                  },
                ],
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                validationAttribute: "Build Type",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                tabId: "details",
              },
              {
                name: "lhr-due-date",
                type: "datepicker",
                index: 4,
                label: "Due Date",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "default",
                validationAttribute: "Due Date",
                applicableValidationSchema: true,
                tabId: "details",
              },
              {
                name: "lhrstep-built-in",
                type: "lhrstep",
                index: 5,
                label: "LHR Step",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "default",
                applicableValidationSchema: true,
                stepIndex: 1,
                editorConfig: {
                  value: createdMPIDocument.id,
                },
                tabId: "details",
              },
              {
                label: "form.builder.approvals",
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-kvateryo",
                uniqueSchemaItem: true,
                index: 6,
                tabId: "details",
              },
            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdLHRtDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdLHRtDocument.id,
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

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "CEO",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        ceoGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: ceoGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: thirdEmployee.id }],
        },
      });
    });
  });

  context("Approve & Release DAM", () => {
    it("Open the DAM and its status should be Draft", () => {
      cy.navigToDocumentList();
      cy.dlClearFilters();
      cy.drFilterDocListByNameAndStatus({ title: "Document Approval Matrix", status: "Draft" });
      cy.drCheckDocumentStatus({ status: "DRAFT" });
    });

    it("Approve and release DAM document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Owner and operator in LHR", () => {
    context("Create LHR", () => {
      it("Navigate to LHR landing page", () => {
        cy.navigToLHR();
      });

      it("Click create new button", () => {
        cy.recCreateRecordFromLandingPage();
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
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
        cy.url().then((url: any) => {
          lhrUrl = url;
        });
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
      });

      it("Click on sidebar permission icon to add group", () => {
        cy.get("[data-cy='permission-icon']").arrowClick();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add another group", () => {
        cy.drAddGroupFromPermissionTab("CEO");
      });

      it("Reload page", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
          CyRoutes.GetSpecificDocumentType,
        ], () => {
          cy.reload();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click on sidebar permission icon to add Operators", () => {
        cy.get("[data-cy='permission-icon']").arrowClick();
      });

      it(`Assign operator '${USERS[3].name}'`, () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.PostOrPatchDocRev, () => {
          cy.drAssignDocumentTo({ username: USERS[3].name });
        });
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Verify DAM roles and approvers in approvals", () => {
      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify no approver should be selected", () => {
        cy.drSelectDetailsTab();
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiChip-deletable").should("not.exist");
      });

      it("Verify 3 roles should be present and disabled", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiSvgIcon-colorDisabled").should("have.length", 3);
        cy.get("[data-cy='Harry Bartoletti']").should("be.exist");
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");

        cy.get("[data-cy='Clinical Team']").should("be.exist");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");

        cy.get("[data-cy='QA team']").should("be.exist");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });

      it("Verify 3 approvers should be present", () => {
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").arrowClick();
        cy.get(".MuiAutocomplete-popper ul li").should("have.length", 3);
        cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[1].name);
        cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[2].name);
        cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[3].name);
        cy.unClick();
      });
    });

    context("Operator should edit LHR fields", () => {
      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs operator in", () => {
        cy.authLogin({
          email: USERS[3].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Goto LHR", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
          CyRoutes.GetSpecificDocumentType,
        ], () => {
          cy.visit(lhrUrl);
        });
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify no approver should be selected", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiChip-deletable").should("not.exist");
      });

      it("Verify 3 roles should be present and disabled", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiSvgIcon-colorDisabled").should("have.length", 3);
        cy.get("[data-cy='Harry Bartoletti']").should("be.exist");
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");

        cy.get("[data-cy='Clinical Team']").should("be.exist");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");

        cy.get("[data-cy='QA team']").should("be.exist");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });

      it("Verify 3 approvers should be present", () => {
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").arrowClick();
        cy.get(".MuiAutocomplete-popper ul li").should("have.length", 3);
        cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[1].name);
        cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[2].name);
        cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[3].name);
        cy.unClick();
      });

      it("Click 'LHR Step 1'", () => {
        cy.get("[data-cy^=\"LHR Step 1\"]").arrowClick();
      });

      it("Click 'START MPI'", () => {
        cy.mpiStartStep({ stepNumber: 1 });
      });

      it("Add an Approval", () => {
        cy.get("[data-cy=\"fb-approvals-approvals-built-in\"]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul>li[role=option]").contains(USERS[3].name).arrowClick();
        });
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
          CyRoutes.GetSpecificDocumentType,
        ], () => {
          cy.visit(lhrUrl);
        });
        cy.listLoadingElementShouldNotExist();
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify no approver should be selected", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiChip-deletable").should("not.exist");
      });

      it("Add operator and verify checkmark should not be ticked", () => {
        cy.lhrAddApproverOnApproverList({ approver: USERS[3].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });

      it("Add owner and verify checkmark should not be ticked", () => {
        cy.lhrAddApproverOnApproverList({ approver: USERS[1].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });

      it("Add DAM role user and verify checkmark should be ticked", () => {
        cy.lhrAddApproverOnApproverList({ approver: USERS[2].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
      });

      it("Log out user", () => {
        cy.authLogout();
      });
    });

    context("LHR should submit for approval by owner", () => {
      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[1].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Goto LHR", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
          CyRoutes.GetSpecificDocumentType,
        ], () => {
          cy.visit(lhrUrl);
        });
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Submit for approval", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
          cy.lhrSubmitForApproval();
        });
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Click Approve button", () => {
        cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick();
        cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
        cy.unClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview, CyRoutes.SessionDetails], () => {
          cy.get("[data-cy=\"common.confirm\"]").arrowClick();
        });
        cy.checkToastMessage({ exists: false });
        cy.listLoadingElementShouldNotExist();
      });
    });
  });

  context("Make one of the operators part of the DAM signatures", () => {
    context("Add a new User and add it as DAM approver", () => {
      it("Navigates to User management", () => {
        cy.usrNavigateToUserManagement();
      });

      it("Clicks on 'Add Employee'", () => {
        cy.usrClickAddEmployee();
      });

      it("Enters e-mail", () => {
        cy.usrEnterEmail({ email: USERS[4].email });
      });

      it("Enters name", () => {
        cy.usrEnterName({ name: USERS[4].name });
      });

      it("Clicks the save button", () => {
        cy.usrClickSaveButton();
      });

      it("Navigates to Group management", () => {
        cy.grpNavigateToGroupManagement();
      });

      it("Select the 'R&D' group", function() {
        cy.grpClickEditGroupWithName({ name: "R&D" });
      });

      it("Assigns user to the group", () => {
        cy.grpAssignUserDialog({ name: USERS[4].name });
      });

      it("Saves the group", () => {
        cy.grpSaveGroupPatch();
      });
    });

    context("Revise DAM", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Open the DAM and revise it", () => {
        cy.navigToDocumentList();
        cy.dlClearFilters();
        cy.drFilterDocListByNameAndStatus({ title: "Document Approval Matrix", status: "Released" });
        cy.drClickReviseDocument();
      });

      it("Open approval roles tab", () => {
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
        cy.get("[data-cy=\"tabId.approvalroles\"]").arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
      });

      it(`Add ${USERS[4].name} in approving users`, () => {
        cy.contains("Approving Users").eq(0).parent().parent().parent().parent().parent()
          .find("input").arrowClick({ force: true }).autocompleteSelect(`${USERS[4].name}`);
      });

      it("Click the save button", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Approve and release DAM document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Create LHR", () => {
      it("Navigate to LHR landing page", () => {
        cy.navigToLHR();
      });

      it("Click create new button", () => {
        cy.recCreateRecordFromLandingPage();
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Enter initial quantity", () => {
        cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Production' build type", () => {
        cy.unClick();
        cy.get("[value=\"Production\"]").check();
      });

      it("Add 'Due Date'", () => {
        cy.poAddDateRequired();
        cy.url().then((url: any) => {
          lhrUrl1 = url;
        });
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
      });

      it("Click on sidebar permission icon to add group", () => {
        cy.cmpTurnOnAutosave();
        cy.drSelectPermissionTab();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
        cy.wait(2000);
      });

      it(`Assign operator ${USERS[3].name}`, () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.PostOrPatchDocRev, () => {
          cy.drAssignDocumentTo({ username: USERS[3].name });
        });
        cy.listLoadingElementShouldNotExist();
      });

      it(`Assign operator ${USERS[4].name}`, () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.PostOrPatchDocRev, () => {
          cy.drAssignDocumentTo({ username: USERS[4].name });
        });
      });
    });

    context("Operators can edit fields", () => {
      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs in with operator which is part of DAM", () => {
        cy.authLogin({
          email: USERS[4].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Goto LHR", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
          CyRoutes.GetSpecificDocumentType,
        ], () => {
          cy.visit(lhrUrl1);
        });
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify no approver should be selected", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiChip-deletable").should("not.exist");
      });

      it("Add operator which is not part of DAM and verify checkmark should not be ticked", () => {
        cy.lhrAddApproverOnApproverList({ approver: USERS[3].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });

      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs in with operator not part of DAM", () => {
        cy.authLogin({
          email: USERS[3].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Goto LHR", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
          CyRoutes.GetSpecificDocumentType,
        ], () => {
          cy.visit(lhrUrl1);
        });
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Add operator which is part of DAM and verify checkmark should be ticked", () => {
        cy.lhrAddApproverOnApproverList({ approver: USERS[4].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });
    });
  });

  context("Revise the DAM and add/remove signatures of Owner/Operators as required signatures", () => {
    context("Revise DAM", () => {
      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs in with owner", () => {
        cy.authLogin({
          email: USERS[1].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Open the DAM and revise it", () => {
        cy.navigToDocumentList();
        cy.dlClearFilters();
        cy.drFilterDocListByNameAndStatus({ title: "Document Approval Matrix", status: "Released" });
        cy.drClickReviseDocument();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Open approval roles tab", () => {
        cy.drSelectApprovalRolesTab();
      });

      it(`Remove ${USERS[4].name} in approving users`, () => {
        cy.contains(USERS[4].name).last().parent().parent().find(".MuiChip-deleteIcon").arrowClick();
      });

      it(`Add owner ${USERS[1].name} in approving users`, () => {
        cy.contains("Approving Users").eq(0).parent().parent().parent().parent().parent()
          .find("input").arrowClick({ force: true }).autocompleteSelect(`${USERS[1].name}`);
      });

      it("Click the save button", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      });

      it("Approve and release DAM document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Create LHR", () => {
      it("Navigate to LHR landing page", () => {
        cy.navigToLHR();
      });

      it("Click create new button", () => {
        cy.recCreateRecordFromLandingPage();
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Enter initial quantity", () => {
        cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Production' build type", () => {
        cy.unClick();
        cy.get("[value=\"Production\"]").check();
      });

      it("Add 'Due Date'", () => {
        cy.poAddDateRequired();
        cy.url().then((url: any) => {
          lhrUrl2 = url;
        });
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
      });

      it("Click on sidebar permission icon to add group", () => {
        cy.get("[data-cy='permission-icon']").arrowClick();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Assign operator ${USERS[3].name}`, () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.PostOrPatchDocRev, () => {
          cy.drAssignDocumentTo({ username: USERS[3].name });
        });
        cy.listLoadingElementShouldNotExist();
      });

      it(`Assign operator ${USERS[4].name}`, () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.PostOrPatchDocRev, () => {
          cy.drAssignDocumentTo({ username: USERS[4].name });
        });
      });
    });

    context("Operators can edit fields", () => {
      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs in with operator not part of DAM", () => {
        cy.authLogin({
          email: USERS[3].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Goto LHR", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
          CyRoutes.GetSpecificDocumentType,
        ], () => {
          cy.visit(lhrUrl2);
        });
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify no approver should be selected", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiChip-deletable").should("not.exist");
      });

      it("Add operator1 which is not part of DAM and verify checkmark should not be ticked", () => {
        cy.lhrAddApproverOnApproverList({ approver: USERS[4].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });

      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs in with operator which is part of DAM", () => {
        cy.authLogin({
          email: USERS[4].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Goto LHR", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
          CyRoutes.GetSpecificDocumentType,
        ], () => {
          cy.visit(lhrUrl2);
        });
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Add operator2 which is not part of DAM and verify checkmark should not be ticked", () => {
        cy.lhrAddApproverOnApproverList({ approver: USERS[3].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });

      it("Add owner which is part of DAM and verify checkmark should be ticked", () => {
        cy.lhrAddApproverOnApproverList({ approver: USERS[1].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });
    });
  });

  context("Change ownership of the LHR to someone who is in the DAM and someone who is not in the DAM", () => {
    context("Create LHR", () => {
      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs in with owner", () => {
        cy.authLogin({
          email: USERS[1].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Navigate to LHR landing page", () => {
        cy.navigToLHR();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Click create new button", () => {
        cy.recCreateRecordFromLandingPage();
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Enter initial quantity", () => {
        cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
        cy.url().then((url: any) => {
          lhrUrl3 = url;
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Production' build type", () => {
        cy.unClick();
        cy.get("[value=\"Production\"]").check();
      });

      it("Add 'Due Date'", () => {
        cy.poAddDateRequired();
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
      });

      it("Add owner which is part of DAM and verify checkmark should be ticked", () => {
        cy.lhrAddApproverOnApproverList({ approver: USERS[1].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").parent().find(".MuiChip-deleteIcon").arrowClick();
      });

      it("Change owner of document", () => {
        cy.drChangeOwnerFromMenu({ employee: USERS[4].name });
      });
    });

    context("Check LHR with new ownership", () => {
      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs in with operator not part of DAM", () => {
        cy.authLogin({
          email: USERS[4].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Goto LHR", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
          CyRoutes.GetSpecificDocumentType,
        ], () => {
          cy.visit(lhrUrl3);
        });
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Add new owner which is not part of DAM and verify checkmark should not be ticked", () => {
        cy.lhrAddApproverOnApproverList({ approver: USERS[4].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });
    });
  });

  context("Revise the LHRS and see if the requirements are still met in the LHR", () => {
    context("Create LHR", () => {
      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs in", () => {
        cy.authLogin({
          email: USERS[2].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Navigate to LHR landing page", () => {
        cy.navigToLHR();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Click create new button", () => {
        cy.recCreateRecordFromLandingPage();
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Enter initial quantity", () => {
        cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
        cy.url().then((url: any) => {
          lhrUrl4 = url;
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Production' build type", () => {
        cy.unClick();
        cy.get("[value=\"Production\"]").check();
      });

      it("Add 'Due Date'", () => {
        cy.poAddDateRequired();
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
      });

      it("Click 'LHR Step 1'", () => {
        cy.get("[data-cy^=\"LHR Step 1\"]").arrowClick();
      });

      it("Click 'START MPI'", () => {
        cy.mpiStartStep({ stepNumber: 1 });
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Add an Approval", () => {
        cy.get("[data-cy=\"fb-approvals-approvals-built-in\"]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul>li[role=option]").contains(USERS[2].name).arrowClick();
        });
        cy.progressBarShouldNotExist();
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
      });

      it("Select Procedure tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Enter 'Start quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-start-quantity\"]").arrowType("1");
      });

      it("Enter 'Accepted quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("1");
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
      });

      it("Complete step", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve step", () => {
        cy.ebApprove();
      });

      it("Click 'Revise Document'", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.DocPreview,
          CyRoutes.GetRequiredApproversDocRev], () => {
          cy.get("[data-cy=\"updateRecord\"]").arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Add an Approval", () => {
        cy.get("[data-cy=\"fb-approvals-approvals-built-in\"]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul>li[role=option]").contains(USERS[2].name).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
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
          CyRoutes.GetSpecificDocumentType,
        ], () => {
          cy.visit(lhrUrl4);
        });
        cy.listLoadingElementShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify no approver should be selected", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiChip-deletable").should("not.exist");
      });

      it("Verify 3 roles should be present and disabled", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiSvgIcon-colorDisabled").should("have.length", 3);
        cy.get("[data-cy='Harry Bartoletti']").should("be.exist");
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");

        cy.get("[data-cy='Clinical Team']").should("be.exist");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");

        cy.get("[data-cy='QA team']").should("be.exist");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });

      it("Verify 4 approvers should be present", () => {
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").arrowClick();
        cy.get(".MuiAutocomplete-popper ul li").should("have.length", 4);
        cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[1].name);
        cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[2].name);
        cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[3].name);
        cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[4].name);
      });

      it("Add approver and verify checkmark should be ticked", () => {
        cy.unClick();
        cy.lhrAddApproverOnApproverList({ approver: USERS[2].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
      });

      it("Click save document", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.PatchDocRev], () => {
            cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
          });
        cy.checkToastMessage({ exists: false });
        cy.listLoadingElementShouldNotExist();
      });

      it("Submit for approval", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
          cy.lhrSubmitForApproval();
        });
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Click Approve button", () => {
        cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick();
        cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
        cy.unClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview, CyRoutes.SessionDetails], () => {
          cy.get("[data-cy=\"common.confirm\"]").arrowClick();
        });
        cy.checkToastMessage({ exists: false });
      });

      it("Click 'Revise Document' LHR", () => {
        cy.lhrClickReviseDocument();
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify no approver should be selected", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiChip-deletable").should("not.exist");
      });

      it("Verify 3 roles should be present and disabled", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiSvgIcon-colorDisabled").should("have.length", 3);
        cy.get("[data-cy='Harry Bartoletti']").should("be.exist");
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");

        cy.get("[data-cy='Clinical Team']").should("be.exist");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");

        cy.get("[data-cy='QA team']").should("be.exist");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });
    });
  });

  context("Change ownership and verify new owner is able to edit fields and add approvers.", () => {
    context("Create LHR", () => {
      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs in with owner", () => {
        cy.authLogin({
          email: USERS[1].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Navigate to LHR landing page", () => {
        cy.navigToLHR();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Click create new button", () => {
        cy.recCreateRecordFromLandingPage();
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Enter initial quantity", () => {
        cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Production' build type", () => {
        cy.unClick();
        cy.get("[value=\"Production\"]").check();
        cy.url().then((url: any) => {
          lhrUrl5 = url;
        });
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
      });

      it("Change owner of document", () => {
        cy.drChangeOwnerFromMenu({ employee: USERS[2].name });
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Check LHR with new ownership", () => {
      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs in with new ownership", () => {
        cy.authLogin({
          email: USERS[2].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Goto LHR", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
          CyRoutes.GetSpecificDocumentType,
        ], () => {
          cy.visit(lhrUrl5);
        });
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("New owner can add 'Due Date'", () => {
        cy.poAddDateRequired();
      });

      it("Verify 3 roles should be present", () => {
        cy.get("[data-cy='Harry Bartoletti']").should("be.exist");
        cy.get("[data-cy='Clinical Team']").should("be.exist");
        cy.get("[data-cy='QA team']").should("be.exist");
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
      });

      it("Click 'LHR Step 1'", () => {
        cy.get("[data-cy^=\"LHR Step 1\"]").arrowClick();
      });

      it("Click 'START MPI'", () => {
        cy.mpiStartStep({ stepNumber: 1 });
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Add an Approval", () => {
        cy.get("[data-cy=\"fb-approvals-approvals-built-in\"]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul>li[role=option]").contains(USERS[2].name).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
      });

      it("Select Procedure tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Enter 'Start quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-start-quantity\"]").arrowType("1");
      });

      it("Enter 'Accepted quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("1");
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
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
          CyRoutes.GetSpecificDocumentType,
        ], () => {
          cy.visit(lhrUrl5);
        });
        cy.listLoadingElementShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("New owner can add approver and verify checkmark should be ticked", () => {
        cy.unClick();
        cy.lhrAddApproverOnApproverList({ approver: USERS[2].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
      });

      it("Click save document", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.PatchDocRev], () => {
            cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
          });
        cy.checkToastMessage({ exists: false });
        cy.saveBarShouldNotExist();
      });

      it("Submit for approval", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
          cy.lhrSubmitForApproval();
        });
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Click Approve button", () => {
        cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick();
        cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
        cy.unClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview, CyRoutes.SessionDetails], () => {
          cy.get("[data-cy=\"common.confirm\"]").arrowClick();
        });
        cy.checkToastMessage({ exists: false });
      });

      it("Click 'Revise Document' LHR", () => {
        cy.lhrClickReviseDocument();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify no approver should be selected", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiChip-deletable").should("not.exist");
      });

      it("Verify 3 roles should be present and disabled", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiSvgIcon-colorDisabled").should("have.length", 3);
        cy.get("[data-cy='Harry Bartoletti']").should("be.exist");
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");

        cy.get("[data-cy='Clinical Team']").should("be.exist");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");

        cy.get("[data-cy='QA team']").should("be.exist");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });

      it("Add approver and verify checkmark should be ticked", () => {
        SystemRequirement("REQ-4710");
        cy.unClick();
        cy.lhrAddApproverOnApproverList({ approver: USERS[2].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
      });

      it("Submit for approval", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
          cy.lhrSubmitForApproval();
        });
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Click Approve button", () => {
        cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick();
        cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
        cy.unClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview, CyRoutes.SessionDetails], () => {
          cy.get("[data-cy=\"common.confirm\"]").arrowClick();
        });
        cy.checkToastMessage({ exists: false });
        cy.listLoadingElementShouldNotExist();
      });
    });
  });
});

export { };

