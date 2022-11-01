// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
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
let adminEmployee;
let loginResponse;
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
const currentDate = moment().tz("America/Los_Angeles").format("YYMMDD");

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
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
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
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Create EFM-10605", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: groupEveryone,
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
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
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdEFM10605FormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdEFM10605FormDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
        });
      });
    });

    it("[API]Create Lot from LHR", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: groupEveryone,
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
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
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdLotFromLHR = response;
            cy.drAPIApproveAndRelease({
              documentId: createdLotFromLHR.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
        });
      });
    });

    it("[API]Create Part form", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: groupEveryone,
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
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
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdPartFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdPartFormDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
        });
      });
    });

    it("[API]Create CS Part", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: groupEveryone,
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
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
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdCSPartDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdCSPartDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
        });
      });
    });

    it("[API]API request for updating company navigation", (done: any) => {
      cy.cmpUpdateCompany({
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId as unknown as string,
        payload: {
          navigation: [
            {
              icon: "/navigation_icons/dashboard.svg",
              path: "/",
              type: "LINK",
              label: "Dashboard",
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              menu: [
                {
                  icon: "/navigation_icons/document.svg",
                  path: "/document_revision",
                  type: "LINK",
                  label: "Document List",
                },
                {
                  icon: "/navigation_icons/cr.svg",
                  path: "/change_request",
                  type: "LINK",
                  label: "Approval Requests",
                },
                {
                  icon: "/navigation_icons/text-paper.svg",
                  type: "CATEGORY",
                  label: "Records",
                  category: "Record",
                },
              ],
              type: "MENU",
              label: "Document Control",
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              type: "CATEGORY",
              label: "Equipment",
              category: "Equipment",
            },
            {
              icon: "/navigation_icons/supplier-menu.svg",
              menu: [
                {
                  icon: "/navigation_icons/supplier-list.svg",
                  type: "CATEGORY",
                  label: "Supplier List",
                  category: "Supplier",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
              ],
              type: "MENU",
              label: "Supplier Management",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/receipt_list.svg",
              type: "CATEGORY",
              label: "Purchase Orders",
              category: "Purchase Order",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/cart-simple-in.svg",
              type: "CATEGORY",
              label: "Receiving",
              category: "Receive",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/tools.svg",
              menu: [
                {
                  icon: "/navigation_icons/icon_parts.svg",
                  type: "CATEGORY",
                  label: "Parts",
                  category: "Parts",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
                {
                  icon: "/navigation_icons/eb_icon.svg",
                  type: "CATEGORY",
                  label: "Engineering Builds",
                  category: "EB",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
                {
                  icon: "/navigation_icons/tag-check.svg",
                  type: "CATEGORY",
                  label: "Lots",
                  category: "Lot",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
                {
                  icon: "/navigation_icons/lhr_icon.svg",
                  type: "CATEGORY",
                  label: "LHR",
                  category: "Lhr",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
              ],
              type: "MENU",
              label: "Manufacturing",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/group-management.svg",
              path: "/group_management",
              type: "LINK",
              label: "Group Management",
              restrictedToUsersWithTags: [
                GroupTag.GROUP_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/user-management.svg",
              path: "/user_management",
              type: "LINK",
              label: "User Management",
              restrictedToUsersWithTags: [
                GroupTag.USER_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              path: "/document_type_management",
              type: "LINK",
              label: "Document Type Management",
              restrictedToUsersWithTags: [
                GroupTag.DOCUMENT_TYPE_MANAGEMENT,
              ],
            },
          ],
        },
      }).then(() => {
        done();
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create CSL revision from EFM-10605", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Open EFM-10605", () => {
      cy.drClickOnSpecificDocFromList({ item: EFM10605Rev });
      cy.wait(2000);
    });

    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter title", () => {
      cy.get("[data-cy=\"field-name\"]").should("exist");
      cy.get("[data-cy=\"field-name\"]").arrowClick({ force: true }).wait(1000);
      cy.get("[data-cy=\"field-name\"]").arrowType("CSL with part number and CS reference");
      cy.unClick();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Enter quantity received", () => {
      cy.get("[name=\"lot_quantity\"]").arrowType("12");
    });

    it(`Select '${CSPartDocumentTitle}' for Part Number`, () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"lot_part\"]").arrowType(CSPartDocumentTitle);
      cy.get("ul>li[role=option]").contains(CSPartDocumentTitle).arrowClick();
    });

    it("Click create document", () => {
      cy.recClickSaveBtn();
    });

    context("Release CSL", () => {
      it("Select Overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add an Approval", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
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
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Select Procedure tab", () => {
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
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Approve and release MPI document", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });

    context("Verify Materials", () => {
      it("Select Procedure tab", () => {
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
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
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
        it("Select Details tab", () => {
          cy.wrapWithWaitOnApiCalls(
            [CyRoutes.GetAutocompleteOptions, CyRoutes.GetFieldLocks], () => {
              cy.drSelectDetailsTab();
            });
        });

        it("Click 'LHR Step'", () => {
          cy.get("[data-cy='LHR Step 1']").arrowClick({ force: true });
        });

        it("Select MPI document for step #1 in LHRt", () => {
          cy.wait(2000);
          cy.get("input[data-cy=\"lhrstep-built-in\"]").autocompleteSelect("MPI document");
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });
      });

      context("Release LHRt", () => {
        it("Click save document", () => {
          cy.drClickCreateDocumentWithoutApiCall();
        });

        it("Approve and release LHRt document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
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
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
        cy.unClick();
      });
    });

    it("Select 'Production' build type", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.get("[value=\"Production\"]").check();
        cy.unClick();
      });
    });

    it("Add 'Due Date'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.poAddDateRequired();
        cy.unClick();
      });
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy=\"LHR Step 1\"]").arrowClick();
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
      cy.drClickCreateDocumentWithoutApiCall();
      cy.wait(2000);
    });

    it("Select Overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
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
        cy.visit(lhrDocUrl1);
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Add approval", () => {
      cy.get(`[data-cy^="fb-approvals"]`).should("exist");
      cy.lhrAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Submit for approval", () => {
      cy.lhrSubmitForApproval();
    });

    it("Approve approval", () => {
      cy.lhrApprove();
    });

    it(`Verify status is '${STATUS_TYPES_LABEL.RELEASED}'`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });
  });

  context("Revise LHR ", () => {
    it("Click Revise document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
        cy.get("[data-cy=\"updateRecord\"]").arrowClick();
      });
      cy.wait(5000);
    });

    it("Select 'R&D' build type", () => {
      cy.contains("Build Type").scrollIntoView().arrowClick().wait(1000);
      cy.contains("Build Type").should("be.visible");
      cy.get("[value='R&D']").arrowClick({ force: true }).wait(2000);
    });

    it("Select button to switch", () => {
      cy.get("[data-cy=\"form.builder.lhr.build.switch\"]").last().arrowClick();
    });

    it("Validate Reference value", () => {
      cy.get("[data-cy='common.referenced.by']")
        .should("contain.text", `LOT #${currentDate}02RD - A - Lot for CS-02001 - 1 - Part document`);
    });

    it("Verify history tab is capturing the changes to R&D Build Type", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAudit], () => {
        cy.drSelectHistoryTab();
      });
      cy.get("[data-cy=\"form.builder.audit.STRING_EDITED\"]").should("have.text", "Build Type Updated");
      cy.get("[data-cy=\"change-value-0-0\"]").should("have.text", "R&D");
    });

    it("Add approval", () => {
      cy.get(`[data-cy^="fb-approvals"]`).should("exist");
      cy.lhrAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Submit for approval", () => {
      cy.lhrSubmitForApproval();
    });

    it("Approve approval", () => {
      cy.lhrApprove();
    });

    it(`Verify status is '${STATUS_TYPES_LABEL.RELEASED}'`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });

    it("Navigate to LHR Landing page", () => {
      cy.navigToLHR();
    });

    it("Search for the LOT with RD suffix", () => {
      cy.get(`th[aria-colindex="1"] input`).arrowType(`LOT #${currentDate}02RD`);
      cy.landingPageLoadingElementShouldAppear();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.dlClearFilters();
      cy.wait(2000);
    });
  });
});
