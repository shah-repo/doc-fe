// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { LHRTTest } from "../../utils/constants/documentTypes/lhrt";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocumentType;
let materialsDocumentType;
let partDocumentType;
let equipmentDocument;
let materialsDocument;
let mpiDocument;
let mpiDocumentType;
let createdPartDocument;
let developersGroup;
let secondEmployee;
let createdLotsFormDocument;
let formDocumentType;
let CSLDocumentType;
let startMpiUrl;
let lhrtUrl;
let startMpiUrl1;
let startMpiUrl2;
let lhrDocUrl1;
let lhrDocUrl2;


context("LHR Build type flow", () => {
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
              LotHistoryRecordTest,
              MPITest,
              LHRTTest,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specification");
          mpiDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Manufacturing Process Instructions Test");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
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


    it("[API]Create equipment one", () => {
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

    it("[API]Create material one", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Materials document</p>",
          document: {
            docId: "MT-00004",
            documentType: {
              id: materialsDocumentType[0].id,
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
          name: "Material one",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        materialsDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: materialsDocument.id,
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

    it("[API]Create part document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Part document</p>",
          document: {
            docId: "CS-00005",
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

    it("[API]Create unreleased part document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>unreleased part document</p>",
          document: {
            docId: "CS-00010",
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
          name: "Unreleased part document",
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

    it("[API]Create MPI document", () => {
      cy.drCreateDocumentRevision({
        payload: {
          formTemplate: {
            outputDocumentTypes: [],
            schema: [
              {
                name: "fb-mpi-procedure-section-built-in",
                type: "section",
                index: 0,
                label: "form.builder.mpiprocedure",
                tabId: "details",
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "mpi-procedure-built-in",
                type: "mpiprocedure",
                tabId: "details",
                index: 1,
                stepIndex: 1,
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                editorConfig: {
                  materials: [
                    {
                      id: "kolg5zka",
                      title: materialsDocument.id,
                      quantity: 1,
                      unit: "sets",
                    },
                  ],
                  equipment: [
                    {
                      id: "kolg6pz4",
                      title: equipmentDocument.id,
                    },
                  ],
                  description: "<p>Description of MPI step created with API</p>",
                },
              },
              {
                name: "lhrs-start-quantity",
                type: "quantity",
                index: 2,
                label: "Start quantity",
                tabId: "details",
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
              },
              {
                name: "lhrs-accepted-quantity",
                type: "quantity",
                index: 3,
                label: "Accepted quantity",
                tabId: "details",
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
              },
              {
                name: "lhrs-rejected-quantity",
                type: "quantity",
                index: 4,
                label: "Rejected quantity",
                tabId: "details",
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
              },
              {
                name: "approvals-built-in",
                type: "approvals",
                index: 5,
                label: "Approvals",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                uniqueSchemaItem: true,
                validationAttribute: "Approvals",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
            ],
          },
          description: "<p>MPI created with API description</p>",
          name: "MPI created with API",
          attachments: [],
          referenceTo: [],
          revisionStage: 1,
          revisionChangeType: RevisionChangeType.NextRevision,
          retrain: false,
          document: {
            docId: "PI-00008",
            securityList: {
              securityEmployees: [],
              securityGroups: [
                {
                  id: group.body[0].id,
                },
              ],
              operators: [],
            },
            documentType: {
              id: mpiDocumentType[0].id,
            },
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        mpiDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: mpiDocument.id,
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

    it("[API]Create Lots form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Lots Form document</p>",
          document: {
            docId: "FM-00008",
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
          name: "Lots form document",
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
                name: "fb-approvals-ksherq6d",
                uniqueSchemaItem: true,
                index: 5,
              },
            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdLotsFormDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdLotsFormDocument.id,
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
        groupName: "Developers",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: secondEmployee.id }],
          tags: [...developersGroup.body[0].tags,
            GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
            GroupTag.NAVIGATION_WITH_RESTRICTED_DOC_TYPES,
          ],
        },
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
                  icon: "/navigation_icons/todo.svg",
                  type: "CATEGORY",
                  label: "Work Orders",
                  category: "Work Order",
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

  context("Create lot document", () => {
    it("Navigate to Lots", () => {
      cy.navigToLots();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on Create new", () => {
      cy.poClickCreatePO();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Component Specification Lot' from the dropdown", () => {
      cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();

      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.DocPreview], () => {
        cy.get("div[id^=react-select]").contains("Component Specification Lot").arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add lot title", () => {
      cy.drEnterDocumentTitle({ name: "Component specification lot document" });
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter quantity received", () => {
      cy.get("[name=\"lot_quantity\"]").arrowType("12");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Usable Quantity", () => {
      cy.get("[name=\"lot_usable_quantity\"]").arrowType("12");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Material one' for Part lot", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"lot_part\"]").arrowType("Material one");
      cy.get("ul>li[role=option]").contains("Material one").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check 100% override", () => {
      cy.get("[value=\"100% Inspection Override\"]").check();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add 'Expiry Date'", () => {
      cy.poAddDateRequired();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
      cy.unClick();
      cy.wait(5000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      cy.wait(5000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve record", () => {
      cy.ebApprove();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify status is 'Released'", () => {
      cy.drCheckDocumentStatus({ status: "RELEASED" });
    });
  });

  context("Create MPI document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in the MPI attributes", () => {
      it("Enter title 'MPI document", () => {
        cy.drEnterDocumentTitle({ name: "MPI document" });
      });

      it("Enter description 'MPI document description'", () => {
        cy.drEnterDocumentDescription({ description: "MPI document description" });
      });

      it("Select 'Manufacturing Process Instructions Test' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Manufacturing Process Instructions Test" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
        cy.wait(3000);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      context("Release MPI", () => {
        it("Approve and release MPI document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });
      });
    });
  });

  context("Create LHRt document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.unClick();
        cy.navigToDocumentList();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
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
        cy.drSelectDocumentType({ documentType: "LHR template" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Lot History Record' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Lot History Record" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click create document", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
        cy.wait(3000);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Part document' for Part to be Manufactured", () => {
        cy.get("[data-cy=\"lhr-selected-part\"]").arrowType("Part document");
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
          cy.get("ul>li[role=option]").contains("Part document").arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      context("Enable notes in LHR step", () => {
        it("Click edit on LHR step", () => {
          cy.drSelectDetailsTab();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
          cy.get("[data-cy=\"edit-schema-item\"]").eq(0).arrowClick({ force: true });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Check 'Include Notes' checkbox", () => {
          cy.get("input[value=\"includeNotes\"]").check();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Save changes made to field", () => {
          cy.get("[data-cy=\"common.add\"]").arrowClick();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });
      });

      context("Select created MPI in LHR template", () => {
        it("Select Details tab", () => {
          cy.drSelectDetailsTab();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Click 'LHR Step'", () => {
          cy.get("[data-cy=\"LHR Step 1\"]").arrowClick();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Select MPI document for step #1 in LHRt", () => {
          cy.get("div[class^=\"MuiExpansionPanelSummary\"]").eq(0).arrowClick({ force: true });
          cy.get("input[data-cy=\"lhrstep-built-in\"]").autocompleteSelect("MPI document", { force: true });
          cy.unClick();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });
      });

      context("Release LHRt", () => {
        it("Approve and release LHRt document", () => {
          cy.drApproveAndReleaseDialog();
          cy.get("input[name=password]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
          cy.wrapWithWaitOnApiCall(
            CyRoutes.ReleaseDocRev,
            () => {
              cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
            });
          cy.wait(5000);
        });

        it("Goto LHRt", () => {
          cy.url().then((url: any) => {
            lhrtUrl = url;
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
          cy.wait(5000);
        });
      });
    });
  });

  context("Create LHR", () => {
    it("Click create new document from LHRt", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev], () => {
        cy.drCreateNewDocumentFromForm();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter initial quantity", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify initial state of build type is unchecked", () => {
      cy.get("[value=\"R&D\"]").should("not.be.checked");
      cy.get("[value=\"Production\"]").should("not.be.checked");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Production' build type", () => {
      cy.unClick();
      cy.get("[value=\"Production\"]").check();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Notes icon should not present on fields with includeNotes", () => {
      cy.get("#fb-notes").should("not.exist");
    });

    it("Add 'Due Date'", () => {
      cy.poAddDateRequired();
      cy.wait(3000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.wait(3000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn on autosave", () => {
      cy.cmpTurnOnAutosave();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy=\"LHR Step 1\"]").arrowClick();
      cy.wait(3000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'START MPI'", () => {
      cy.mpiStartStep({ stepNumber: 1 });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
      cy.url().then((url: any) => {
        startMpiUrl = url;
      });
    });

    it("Verify notes and redline button should not be present", () => {
      cy.wait(2000);
      SystemRequirement("REQ-4770");
      cy.get("#fb-notes").should("not.exist");
    });
  });

  context("Navigate back to LHR and revise it", () => {
    it("Navigate to LHR landing page", () => {
      cy.navigToLHR();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select created LHR record", () => {
      cy.get("tr.k-master-row").first().arrowClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Alert message should display on change 'Production' to 'R&D' build type", () => {
      cy.unClick();
      cy.get("[value=\"R&D\"]").check();
      cy.listLoadingElementShouldNotExist();
      cy.get(".MuiDialogContent-root").should("have.text",
        "You are about to switch the build type from Production to R&D. Are you sure you want to make this change?");
      cy.wrapWithWaitOnApiCalls([ CyRoutes.PatchDocRev ], () => {
        cy.contains("Yes switch build type").arrowClick();
      });
      cy.wait(2000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Build type 'Production' radiobutton should be disabled", () => {
      cy.get("[value=\"Production\"]").should("have.attr", "disabled");
    });

    it("Goto start MPI", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
        cy.visit(startMpiUrl);
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Procedure tab", () => {
      cy.drSelectProcedureTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify notes and redline button should present", () => {
      SystemRequirement("REQ-4770");
      cy.get("#fb-notes").should("be.exist");
    });
  });

  context("Create LHR with 'Production' build type", () => {
    it("Click create new document from LHRt", () => {
      cy.visit(lhrtUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
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

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter initial quantity", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Production' build type", () => {
      cy.unClick();
      cy.get("[value=\"Production\"]").check();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add 'Due Date'", () => {
      cy.poAddDateRequired();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.wait(3000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn on autosave", () => {
      cy.cmpTurnOnAutosave();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy^=\"LHR Step 1\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'START MPI'", () => {
      cy.mpiStartStep({ stepNumber: 1 });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.url().then((url: any) => {
        startMpiUrl1 = url;
      });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Select Procedure tab", () => {
      cy.drSelectProcedureTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
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

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Overview tab", () => {
      cy.drSelectOverviewTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
      cy.wait(5000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Complete step", () => {
      cy.pmSubmitForApprovalWithoutAPI();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve step", () => {
      cy.ebApprove();
      cy.wait(5000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("visit the LHR", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
        CyRoutes.GetSpecificDocumentType,
      ], () => {
        cy.visit(lhrDocUrl1);
      });
      cy.wait(5000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Add an Approval", () => {
      cy.get(`[data-cy="form.builder.approvers"]`).scrollIntoView().wait(500);
      cy.get(`[data-cy^="fb-approvals-fb-approvals-"]`).autocompleteSelect(`${USERS[1].name}`);
      cy.unClick();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.checkToastMessage({ exists: false });
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      cy.wait(5000);
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Approve record", () => {
      cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick();
      cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
      cy.unClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.SessionDetails], () => {
        cy.get("[data-cy=\"common.confirm\"]").arrowClick();
      });
      cy.checkToastMessage({ exists: false });
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify status is 'Released'", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });
  });

  context("Create LHR with 'R&D' build type", () => {
    it("Click create new document from LHRt", () => {
      cy.visit(lhrtUrl);
      cy.listLoadingElementShouldNotExist();
      cy.wait(5000);
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev,
        CyRoutes.GetAutocompleteOptions], () => {
        cy.drCreateNewDocumentFromForm();
        cy.url().then((url: any) => {
          lhrDocUrl2 = url;
        });
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter initial quantity", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
    });

    it("Select 'R&D' build type", () => {
      cy.get("[value=\"R&D\"]").check();
      cy.wait(3000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Add 'Due Date'", () => {
      cy.poAddDateRequired();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy^=\"LHR Step 1\"]").arrowClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'START MPI'", () => {
      cy.mpiStartStep({ stepNumber: 1 });
      cy.listLoadingElementShouldNotExist();
      cy.url().then((url: any) => {
        startMpiUrl2 = url;
      });
    });

    it("Select Procedure tab", () => {
      cy.drSelectProcedureTab();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter 'Start quntity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-start-quantity\"]").arrowType("8");
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter 'Accepted quntity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("5");
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter 'Rejected quntity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-rejected-quantity\"]").arrowType("3");
      cy.listLoadingElementShouldNotExist();
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Overview tab", () => {
      cy.drSelectOverviewTab();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add an Approval", () => {
      cy.get(`[data-cy="form.builder.approvers"]`).scrollIntoView().wait(500);
      cy.get(`[data-cy^="fb-approvals-approvals-built-in"]`).autocompleteSelect(`${USERS[1].name}`);
      cy.unClick();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Complete step", () => {
      cy.pmSubmitForApprovalWithoutAPI();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve step", () => {
      cy.ebApprove();
      cy.wait(5000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("visit the LHR", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
        cy.visit(lhrDocUrl2);
      });
      cy.wait(5000);
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Add an Approval", () => {
      cy.get(`[data-cy="form.builder.approvers"]`).scrollIntoView().wait(500);
      cy.get(`[data-cy^="fb-approvals-fb-approvals-"]`).autocompleteSelect(`${USERS[1].name}`);
      cy.unClick();
      cy.listLoadingElementShouldNotExist();
      cy.wait(5000);
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.checkToastMessage({ exists: false });
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      cy.wait(5000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve record", () => {
      cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick();
      cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
      cy.get("[data-cy=\"common.confirm\"]").arrowClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify status is 'Released'", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify notes should not present on revise LHR of 'Production' build type", () => {
    it("Revise LHR of 'Production' build type", () => {
      cy.visit(lhrDocUrl1);
      cy.wait(5000);
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Click Revise document", () => {
      cy.get("[data-cy=\"updateRecord\"]").arrowClick();
      cy.wait(5000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.checkToastMessage({ exists: false });
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
      cy.wait(2000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy^=\"LHR Step 1\"]").arrowClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click View step", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.SessionDetails, () => {
        cy.get(`[data-cy="form.builder.view.step"]`).arrowClick();
      });
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Procedure tab", () => {
      cy.drSelectProcedureTab();
      cy.wait(2000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify notes icon should not be present", () => {
      cy.get("#fb-notes").should("not.exist");
    });
  });

  context("Verify notes should be present on revise LHR of 'R&D' build type", () => {
    it("Revise LHR of 'R&D' build type", () => {
      cy.visit(lhrDocUrl2);
      cy.wait(5000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Click Revise document", () => {
      cy.get("[data-cy=\"updateRecord\"]").arrowClick();
      cy.wait(3000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.checkToastMessage({ exists: false });
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
      cy.wait(2000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy^=\"LHR Step 1\"]").arrowClick();
    });

    it("Click View step", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.SessionDetails, () => {
        cy.get(`[data-cy="form.builder.view.step"]`).arrowClick();
      });
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Procedure tab", () => {
      cy.drSelectProcedureTab();
      cy.wait(2000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify notes icon should be present", () => {
      cy.get("#fb-notes").should("be.exist");
    });
  });

  context("Verify notes should not present on revise LHR step of 'Production' build type LHR", () => {
    it("Revise LHRs of 'Production' build type LHR", () => {
      cy.visit(startMpiUrl1);
      cy.wait(5000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Click Revise document", () => {
      cy.get("[data-cy=\"updateRecord\"]").arrowClick();
      cy.wait(5000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify notes icon should not be present", () => {
      cy.get("#fb-notes").should("not.exist");
    });
  });

  context("Verify notes should present on revise LHR step of 'R&D' build type LHR", () => {
    it("Revise LHRs of 'R&D' build type LHR", () => {
      cy.visit(startMpiUrl2);
      cy.wait(5000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Click Revise document", () => {
      cy.get("[data-cy=\"updateRecord\"]").arrowClick();
      cy.wait(3000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.checkToastMessage({ exists: false });
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Procedure tab", () => {
      cy.drSelectProcedureTab();
      cy.wait(2000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify notes icon should be present", () => {
      cy.get("#fb-notes").should("be.exist");
    });
  });
});

export { };
