// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import moment from "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CSLDocTypeLot } from "../../utils/constants/documentTypes/componentSpecificationLot";
import { EForm } from "../../utils/constants/documentTypes/efm";
import { CSPart } from "../../utils/constants/documentTypes/part";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let adminEmployee;
let loginResponse;
let approvalRequestDocumentType;
let formDocumentType;
let initialArDocument;
let createdCSLFormDocument;
let csPartDocumentType;
let createdPartFormDocument;
let createdCSPartDocument;
let CSLDocumentType;
let group;
const groupEveryone = "Everyone";
const ARForm = "AR Form";
const MPI = "Manufacturing Process Instructions";
const CSPartDocumentTitle = "Part document";
const FORMNAME = "FM-00006";
const currentDate = moment().tz("America/Los_Angeles").format("YYMMDD");

context("Released_lots_verify_in_lhr", () => {
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
              CSLDocTypeLot,
              CSPart,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          csPartDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, CSPart.documentTypeName);
          CSLDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specification Lot");
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

    it("[API]Create and release inline form for CSL", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
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
              description: "<p>CSL inline form</p>",
              document: {
                docId: "FM-00006",
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
              name: "CSL inline form",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: CSLDocumentType[0].id,
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
                    editorProperties: [],
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
                    editorProperties: [],
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
                    tabId: "details",
                    optionId: "21",
                    placeholder: "Select the appropriate part for this lot",
                    deleteDisabled: true,
                    deleteInFormDisabled: true,
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
                    editorProperties: [],
                    validationAttribute: "100% Inspection Override",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    label: "form.builder.approvals",
                    tabId: "details",
                    type: "approvals",
                    deleteDisabled: true,
                    name: "fb-approvals-l02u8tzp",
                    uniqueSchemaItem: true,
                    index: 5,
                  },
                  {
                    index: 6,
                    type: "section",
                    name: "textfield-kn7fc209",
                    validationMode: "default",
                    label: "Section 1",
                    tabId: "details",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "textfield",
                  },
                  {
                    index: 7,
                    type: "textfield",
                    name: "textfield1-kn7fc7w4",
                    rows: 1,
                    validationMode: "default",
                    label: "textfield 1",
                    tabId: "details",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "textfield",
                  },
                  {
                    index: 8,
                    type: "inlineapproval",
                    name: "inline-approval-kw6gbxwm",
                    hidden: false,
                    outputDisabled: false,
                    deleted: false,
                    deleteInFormDisabled: false,
                    validationMode: "default",
                    validationAttribute: "Inline approval",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    editorProperties: [],
                    label: "Inline approval",
                    tabId: "details",
                    editorConfig: {
                      groups: [
                        group.body[0].id,
                      ],
                    },
                  },
                ],
              },
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdCSLFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdCSLFormDocument.id,
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

  context("Create a CSL from inline form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Open CSL form", () => {
      cy.drClickOnSpecificDocFromList({ item: FORMNAME });
      cy.wait(2000);
    });

    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromFormRecord();
    });

    it("Enter title", () => {
      cy.wait(3000);
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"field-name\"]").should("exist");
      cy.get("[data-cy=\"field-name\"]").arrowClick({ force: true }).wait(1000);
      cy.get("[data-cy=\"field-name\"]").arrowType("CSL with part selection");
      cy.unClick();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Enter quantity received", () => {
      cy.get("[name=\"lot_quantity\"]").focus().arrowType("12");
    });

    it(`Select '${CSPartDocumentTitle}'  Part `, () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"lot_part\"]").focus().arrowType(CSPartDocumentTitle);
      cy.get("ul>li[role=option]").contains(CSPartDocumentTitle).arrowClick();
    });

    it("Click create document", () => {
      cy.recClickSaveBtn();
    });

    it("Record is in WIP status", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
    });
  });

  context("Create a CSL2 from inline form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Open CSL form", () => {
      cy.drClickOnSpecificDocFromList({ item: FORMNAME });
    });

    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromFormRecord();
    });

    it("Enter title", () => {
      cy.wait(3000);
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"field-name\"]").should("exist");
      cy.get("[data-cy=\"field-name\"]").arrowClick({ force: true }).wait(1000);
      cy.get("[data-cy=\"field-name\"]").arrowType("CSL2 with part selection");
      cy.unClick();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Enter quantity received", () => {
      cy.get("[name=\"lot_quantity\"]").focus().arrowType("12");
    });

    it(`Select '${CSPartDocumentTitle}'  Part `, () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"lot_part\"]").focus().arrowType(CSPartDocumentTitle);
      cy.get("ul>li[role=option]").contains(CSPartDocumentTitle).arrowClick();
    });

    it("Click create document", () => {
      cy.recClickSaveBtn();
    });

    context("Approve CSL", () => {
      context("Approve CSL", () => {
        it("Add inline approver", () => {
          cy.get("[name*=\"fb-ia-inline-approval\"] input").eq(0)
            .autocompleteSelect(USERS[1].name);
          cy.listLoadingElementShouldNotExist();
          cy.progressBarShouldNotExist();
          cy.wait(2000);
        });

        it("Click Request Approval button", () => {
          cy.contains("Request approval").arrowClick();
          cy.listLoadingElementShouldNotExist();
          cy.progressBarShouldNotExist();
        });

        it("Approve inline approval", () => {
          cy.inlineApproval();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
          cy.wait(3000);
        });

        it("Finalize and release button click'", () => {
          cy.recFinalizeAndReleaseRecordWithoutApi();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist().wait(1000);
        });

        it("Record is in RELEASED status", () => {
          cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
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
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Select Procedure tab", () => {
      cy.drSelectProcedureTab();
    });

    it("Add 'CS Part' as Material to step #1", () => {
      cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: CSPartDocumentTitle, quntity: "3", unit: "Each" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    context("Release MPI", () => {
      it("Click save document", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });

      it("Approve and release MPI document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
        cy.listLoadingElementShouldNotExist();
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
        cy.listLoadingElementShouldNotExist().wait(1000);
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Lot History Record' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Lot History Record" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Select 'Part document' for Part to be Manufactured", () => {
        cy.get("[data-cy=\"lhr-selected-part\"]").autocompleteSelect(CSPartDocumentTitle);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      context("Select created MPI in LHR template", () => {
        it("Select Details tab", () => {
          cy.drSelectDetailsTab();
          cy.listLoadingElementShouldNotExist();
        });

        it("Click 'LHR Step'", () => {
          cy.get("[data-cy=\"LHR Step 1\"]").arrowClick();
        });

        it("Select MPI document for step #1 in LHRt", () => {
          cy.wait(2000);
          cy.get("input[data-cy=\"lhrstep-built-in\"]").then(($el) => {
            $el.trigger("click");
          });
          cy.listLoadingElementShouldNotExist();
          cy.get("input[data-cy=\"lhrstep-built-in\"]").autocompleteSelect("MPI document");
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
          cy.wait(2000);
        });
      });

      context("Release LHRt", () => {
        it("Approve and release LHRt document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
          cy.listLoadingElementShouldNotExist();
        });
      });
    });
  });

  context("Create LHR", () => {
    it("Click create new document from LHRt", () => {
      cy.drCreateNewDocumentFromForm();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter initial quantity", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").focus().arrowType("10");
      cy.unClick();
      cy.saveBarShouldNotExist();
    });

    it("Select 'Production' build type", () => {
      cy.get("[value=\"Production\"]").check();
      cy.unClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add 'Due Date'", () => {
      cy.poAddDateRequired();
      cy.unClick();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy=\"LHR Step 1\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'START MPI'", () => {
      cy.mpiStartStepWithoutApi({ stepNumber: 1 });
    });

    it("Select Procedure tab", () => {
      cy.drSelectProcedureTab();
    });

    it("Click on Select from Materials", () => {
      cy.get("[data-cy=\"form.builder.select\"]").eq(0).arrowClick({ force: true });
    });

    it("Lot dialog should open", () => {
      cy.get("[data-cy=\"form.builder.lot.number\"]").should("exist");
    });

    it("Select Lot", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"usedOverride\"]").arrowType(`LOT #${currentDate}02`);
      cy.get("ul>li[role=option]").contains(`LOT #${currentDate}02`).arrowClick();
      cy.get("[data-cy=\"usedOverride\"]").should("contain.value", `LOT #${currentDate}02 | `);
    });

    it(`LOT #${currentDate}01 should not be present`, () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"usedOverride\"]").clear().should("not.contain.value", `LOT #${currentDate}01`);
    });

    it("Lot dialog should close", () => {
      cy.get("[data-cy=\"dialog-close\"]").arrowClick();
    });
  });

  context("Release CSL document", () => {
    it("Navigate to Lots", () => {
      cy.navigToLots();
    });

    it("Search for specific LOT", () => {
      cy.get("[aria-colindex=\"1\"] > .k-filtercell > .k-filtercell-wrapper > .k-textbox")
        .focus().arrowType(`LOT #${currentDate}01`);
    });

    it("Click on LOT", () => {
      cy.wait(1000);
      cy.get("[data-grid-col-index=\"0\"]").eq(0).arrowClick({ force: true });
    });

    it("Click on DETAILS", () => {
      cy.drSelectDetailsTab();
    });

    it("Add inline approver", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[name*=\"fb-ia-inline-approval\"] input").eq(0)
        .autocompleteSelect(USERS[1].name);
    });

    it("Click Request Approval button", () => {
      cy.contains("Request approval").arrowClick();
    });

    it("Approve inline approval", () => {
      cy.inlineApproval();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(2000);
    });

    it("Finalize and release button click'", () => {
      cy.recFinalizeAndReleaseRecord();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist().wait(1000);
    });

    it("Record is in RELEASED status", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });
  });

  context("Update LHR", () => {
    it("Navigate to LHR landing page", () => {
      cy.navigToLHR();
    });

    it("Select created LHR record", () => {
      cy.get("tr.k-master-row").first().arrowClick();
      cy.wait(2000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy=\"LHR Step 1 - Rev A\"] > .MuiBox-root > span").arrowClick();
    });

    it("Click View step", () => {
      cy.get(`[data-cy="form.builder.view.step"]`).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.wait(3000);
    });

    it("Click on Procedure", () => {
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.drSelectProcedureTab();
    });

    it("Click on Select from Materials", () => {
      cy.get("[data-cy=\"form.builder.select\"]").eq(0).arrowClick({ force: true });
    });

    it("Lot dialog should open", () => {
      cy.get("[data-cy=\"form.builder.lot.number\"]").should("exist");
    });

    it("Select Lot", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"usedOverride\"]").clear().arrowType(`LOT #${currentDate}02`);
      cy.get("ul>li[role=option]").contains(`LOT #${currentDate}02`).arrowClick();
      cy.get("[data-cy=\"usedOverride\"]").should("contain.value", `LOT #${currentDate}02 | `);
    });

    it("Select Lot", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"usedOverride\"]").clear().arrowType(`LOT #${currentDate}01`);
      cy.get("ul>li[role=option]").contains(`LOT #${currentDate}01`).arrowClick();
      cy.get("[data-cy=\"usedOverride\"]").should("contain.value", `LOT #${currentDate}01 | `);
    });

    it("Lot dialog should close", () => {
      cy.get("[data-cy=\"dialog-close\"]").arrowClick();
    });
  });

  context("Revise CSL Document", () => {
    it("Navigate to Lots", () => {
      cy.navigToLots();
    });

    it("Search for specific LOT", () => {
      cy.get("[aria-colindex=\"1\"] > .k-filtercell > .k-filtercell-wrapper > .k-textbox").clear()
        .focus().arrowType(`LOT #${currentDate}01`);
    });

    it("Click on LOT", () => {
      cy.wait(1000);
      cy.get("[data-grid-col-index=\"0\"]").eq(0).arrowClick({ force: true });
    });

    it("Revise document", () => {
      cy.drClickReviseDocument();
    });

    it("Record is in WIP status", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
    });
  });

  context("Revise & Release CSL2 document", () => {
    it("Navigate to Lots", () => {
      cy.navigToLots();
    });

    it("Search for specific LOT", () => {
      cy.get("[aria-colindex=\"1\"] > .k-filtercell > .k-filtercell-wrapper > .k-textbox").clear()
        .focus().arrowType(`LOT #${currentDate}02`);
    });

    it("Click on LOT", () => {
      cy.wait(1000);
      cy.get("[data-grid-col-index=\"0\"]").eq(0).arrowClick({ force: true });
    });

    it("Revise document", () => {
      cy.drClickReviseDocument();
    });

    it("Click on Details", () => {
      cy.drSelectDetailsTab();
    });

    it("Select approvals", () => {
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
      cy.unClick();
    });

    it("Click on approve and submit", () => {
      cy.lhrSubmitForApprovalWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Click on Details", () => {
      cy.drSelectDetailsTab();
    });

    it("Click on approve", () => {
      cy.ebApproveWithoutApi();
    });

    it("Record is in RELEASED status", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });
  });

  context("Update LHR", () => {
    it("Navigate to LHR landing page", () => {
      cy.navigToLHR();
    });

    it("Select created LHR record", () => {
      cy.get("tr.k-master-row").first().arrowClick();
      cy.wait(2000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy=\"LHR Step 1 - Rev A\"] > .MuiBox-root > span").arrowClick();
    });

    it("Click View step", () => {
      cy.get(`[data-cy="form.builder.view.step"]`).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.wait(3000);
    });

    it("Click on Procedure", () => {
      cy.drSelectProcedureTab();
    });

    it("Click on Select from Materials", () => {
      cy.get("[data-cy=\"form.builder.select\"]").eq(0).arrowClick({ force: true });
    });

    it("Lot dialog should open", () => {
      cy.get("[data-cy=\"form.builder.lot.number\"]").should("exist");
    });

    it(`LOT #${currentDate}02 should be present`, () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"usedOverride\"]").arrowType(`LOT #${currentDate}02`);
      cy.get("ul>li[role=option]").contains(`LOT #${currentDate}02`).arrowClick();
      cy.get("[data-cy=\"usedOverride\"]").should("contain.value", `LOT #${currentDate}02 | `);
    });

    it(`LOT #${currentDate}01 should not be present`, () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"usedOverride\"]").should("not.contain.value", `LOT #${currentDate}01`);
    });

    it("Lot dialog should close", () => {
      cy.get("[data-cy=\"dialog-close\"]").arrowClick();
    });
  });

  context("Release CSL document", () => {
    it("Navigate to Lots", () => {
      cy.navigToLots();
    });

    it("Search for specific LOT", () => {
      cy.get("[aria-colindex=\"1\"] > .k-filtercell > .k-filtercell-wrapper > .k-textbox").clear()
        .focus().arrowType(`LOT #${currentDate}01`);
    });

    it("Click on LOT", () => {
      cy.wait(1000);
      cy.get("[data-grid-col-index=\"0\"]").eq(0).arrowClick({ force: true });
    });

    it("Click on Details", () => {
      cy.drSelectDetailsTab();
    });

    it("Select approvals", () => {
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
      cy.unClick();
    });

    it("Click on approve and submit", () => {
      cy.lhrSubmitForApprovalWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Click on Details", () => {
      cy.drSelectDetailsTab();
    });

    it("Click on approve", () => {
      cy.ebApproveWithoutApi();
    });

    it("Record is in RELEASED status", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });
  });

  context("Update LHR", () => {
    it("Navigate to LHR landing page", () => {
      cy.navigToLHR();
    });

    it("Select created LHR record", () => {
      cy.get("tr.k-master-row").first().arrowClick();
      cy.wait(2000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy=\"LHR Step 1 - Rev A\"] > .MuiBox-root > span").arrowClick();
    });

    it("Click View step", () => {
      cy.get(`[data-cy="form.builder.view.step"]`).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.wait(3000);
    });

    it("Click on Procedure", () => {
      cy.drSelectProcedureTab();
    });

    it("Click on Select from Materials", () => {
      cy.get("[data-cy=\"form.builder.select\"]").eq(0).arrowClick({ force: true });
    });

    it("Lot dialog should open", () => {
      cy.get("[data-cy=\"form.builder.lot.number\"]").should("exist");
    });

    it("Select Lot", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"usedOverride\"]").clear().arrowType(`LOT #${currentDate}02`);
      cy.get("ul>li[role=option]").contains(`LOT #${currentDate}02`).arrowClick();
      cy.get("[data-cy=\"usedOverride\"]").should("contain.value", `LOT #${currentDate}02 | `);
    });

    it("Select Lot", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"usedOverride\"]").clear().arrowType(`LOT #${currentDate}01`);
      cy.get("ul>li[role=option]").contains(`LOT #${currentDate}01`).arrowClick();
      cy.get("[data-cy=\"usedOverride\"]").should("contain.value", `LOT #${currentDate}01 | `);
    });

    it("Lot dialog should close", () => {
      cy.get("[data-cy=\"dialog-close\"]").arrowClick();
    });
  });
});

