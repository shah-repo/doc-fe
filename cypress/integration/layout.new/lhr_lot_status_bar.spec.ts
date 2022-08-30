import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import Colors from "../../../src/ui/layout/theme/utils/colors";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { LHRTTest } from "../../utils/constants/documentTypes/lhrt";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { Part } from "../../utils/constants/documentTypes/part";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let group;
let initialArDocument;
let developersGroup;
let formDocumentType;
let approvalRequestDocumentType;
let equipmentDocumentType;
let partDocumentType;
let equipmentDocument;
let createdPartDocument;
let MPIDocumentType;
let createdMPIDocument;
let LHRtDocumentType;
let LHRDocumentType;
let createdLHRtDocument;
let CSLDocumentType;
let createdLotsFormDocument;
let createdLot;

const groupOne = "Developers";
const reference = {
  value: "LOT #22041301 - A - API LOT 1",
  valueCode: "LOT #22041301",
};

context(`Scenario 2.5.1 New LHR, LHRS and LOT Status bar design`, () => {
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
            documentTypes: [LotHistoryRecordTest, MPITest, LHRTTest, Part],
          },
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Part");
          MPIDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Manufacturing Process Instructions Test");
          LHRtDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "LHR template");
          LHRDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Lot History Record Test");
          CSLDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specification Lot");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: groupOne,
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
          employees: [{ id: adminEmployee.id }],
          tags: [
            ...developersGroup.body[0].tags,
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
              icon: "/navigation_icons/tools.svg",
              menu: [
                {
                  icon: "/navigation_icons/icon_parts.svg",
                  type: "CATEGORY",
                  label: "Parts",
                  category: "Parts",
                  restrictedToUsersWithTags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
                },
                {
                  icon: "/navigation_icons/tag-check.svg",
                  type: "CATEGORY",
                  label: "Lots",
                  category: "Lot",
                  restrictedToUsersWithTags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
                },
                {
                  icon: "/navigation_icons/lhr_icon.svg",
                  type: "CATEGORY",
                  label: "LHR",
                  category: "Lhr",
                  restrictedToUsersWithTags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
                },
              ],
              type: "MENU",
              label: "Manufacturing",
              restrictedToUsersWithTags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
            },
          ],
        },
      }).then(() => {
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
                docId: "ET-00001",
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
                effectiveDate: new Date().toISOString(),
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
            docId: "PRT-00001",
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
            effectiveDate: new Date().toISOString(),
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
                tabId: "procedure",
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "mpi-procedure-built-in",
                type: "mpiprocedure",
                index: 1,
                tabId: "procedure",
                stepIndex: 1,
                applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                deleteDisabled: true,
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                editorProperties: ["includeNotes"],
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
                tabId: "procedure",
                applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                deleteDisabled: true,
                editorProperties: ["includeNotes"],
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
                tabId: "procedure",
                applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                deleteDisabled: true,
                editorProperties: ["includeNotes"],
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
                tabId: "procedure",
                applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                deleteDisabled: true,
                editorProperties: ["includeNotes"],
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
                tabId: "overview",
                applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                deleteDisabled: true,
                uniqueSchemaItem: true,
                validationAttribute: "Approvals",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
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
            effectiveDate: new Date().toISOString(),
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

    it("[API]Create Lots form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Lots Form document</p>",
          document: {
            docId: "FM-00002",
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
            outputDocumentTypes: [
              {
                id: CSLDocumentType[0].id,
              },
            ],
            schema: [
              {
                name: "lot_quantity",
                type: "quantity",
                index: 0,
                label: "Initial Quantity",
                tabId: "details",
                applicableOn: ["ON_STATE_TO_IN_REVIEW"],
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
                applicableOn: ["ON_STATE_TO_IN_REVIEW"],
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
                applicableOn: ["ON_STATE_TO_IN_REVIEW"],
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
                applicableOn: ["ON_STATE_TO_IN_REVIEW"],
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
                name: "fb-approvals-",
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
            effectiveDate: new Date().toISOString(),
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

    it("[API]Create Lot record", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          formDocument: {
            id: createdLotsFormDocument.id,
          },
          formInput: {
            "fb-approvals-": [],
            "lot_quantity": 5,
            "lot_usable_quantity": 3,
            "lot_expiry_date": new Date(),
            "lot_part": createdPartDocument.id,
            "100-inspection-override": ["100% Inspection Override"],
          },
          description: "",
          name: "API LOT 1",
          attachments: [],
          referenceTo: [],
          revisionStage: 3,
          revisionChangeType: RevisionChangeType.NextRevision,
          retrain: false,
          document: {
            docId: "LOT #22041301",
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
              id: CSLDocumentType[0].id,
            },
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdLot = response;
        cy.drAPIApproveAndRelease({
          documentId: createdLot.id,
          payload: {
            effectiveDate: new Date().toISOString(),
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
            docId: "LHRT-00001",
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
            outputDocumentTypes: [{ id: LHRDocumentType[0].id }],
            schema: [
              {
                name: "lhr-selected-part",
                type: "partsselection",
                index: 0,
                label: "Part to be Manufactured",
                tabId: "overview",
                deleteDisabled: true,
                deleteInFormDisabled: true,
                editorConfig: {
                  id: createdPartDocument.documentId,
                },
              },
              {
                name: "lhr_initial_quantity",
                type: "quantity",
                index: 1,
                label: "Initial Quantity",
                tabId: "overview",
                applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                deleteDisabled: true,
                validationAttribute: "Initial Quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "lhr-end-quantity",
                type: "quantity",
                index: 2,
                label: "End Quantity",
                tabId: "overview",
                applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                deleteDisabled: true,
                outputDisabled: true,
                validationAttribute: "End Quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "lhr-build-type",
                type: "radiogroup",
                index: 3,
                label: "Build Type",
                tabId: "overview",
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
                applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                deleteDisabled: true,
                validationMode: "default",
                validationAttribute: "Build Type",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "lhr-due-date",
                type: "datepicker",
                index: 4,
                label: "Due Date",
                tabId: "overview",
                applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                validationMode: "default",
                validationAttribute: "Due Date",
                applicableValidationSchema: true,
              },
              {
                name: "lhrstep-built-in",
                type: "lhrstep",
                index: 5,
                label: "LHR Step",
                tabId: "details",
                applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                validationMode: "default",
                applicableValidationSchema: true,
                stepIndex: 1,
                editorConfig: {
                  value: createdMPIDocument.id,
                },
              },
              {
                label: "form.builder.approvals",
                type: "approvals",
                tabId: "overview",
                deleteDisabled: true,
                name: "fb-approvals-kvateryo",
                uniqueSchemaItem: true,
                index: 6,
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
            effectiveDate: new Date().toISOString(),
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

    it("[API]Create LHR document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>LHR created with API</p>",
          document: {
            docId: "LHR-00001",
            documentType: {
              id: LHRDocumentType[0].id,
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
          name: "API LHR document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formDocument: { id: createdLHRtDocument.id },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then(() => done());
    });
  });

  context("Login admin user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context(`Navigate to LHR and Verify Status is ${STATUS_TYPES_LABEL.WIP}`, () => {
    it("Navigate to LHR landing page", () => {
      cy.navigToLHR();
    });

    it(`Filter document by status ${STATUS_TYPES_LABEL.WIP}, and select it`, () => {
      cy.get(`[aria-colindex="2"] [class="k-input"]`).arrowClick({ force: true });
      cy.get("li").contains("WIP").arrowClick().wait(500);
      cy.get(`td[data-grid-col-index="1"]`).eq(0).arrowClick();
    });
  });

  context("Check the content of the status bar", () => {
    it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.WIP,
        title: "LHR",
        docId: "LHR-00001",
        revision: "Rev A",
      });
      // cy.get("#HeaderInfo-subtitle").should("have.text", " - LOT #22082901");
    });

    context("Right side:", () => {
      it(`Save → Verify it is functional and the last saved should be updated every time there is a “save” event 
      (manual or auto)`, () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      });

      it("Last save should be present", () => {
        cy.contains("Last saved:").should("be.exist");
      });

      it("Enter initial quantity", () => {
        cy.get("[name=\"lhr_initial_quantity\"]").should("be.exist");
        cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
      });

      it("Check Last save should be present in autosave", () => {
        cy.contains("Last saved:").should("be.exist");
      });

      it(`Send to email buttons → Verify it is functional and Verify popup message File will be sent to your 
      email shortly`, () => {
        cy.sendToEmail();
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
        cy.wait(2000);
      });

      it(`Submit for Approval → Verify it is functional and Verify popup message Approvals not present`, () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        cy.poAMCheckForAlertMessage();
      });

      context(
        `Three dots: Clicking on it opens a menu where the “Void” and “Change Owner” options are displayed → 
      Verify they’re functional`,
        () => {
          it("Clicks on VOID button in header menu and is functional", () => {
            cy.get("#HeaderMenuButton").arrowClick();
            cy.get("[data-cy=\"void-button\"]").arrowClick();
            cy.get("#AlertDialog-cancelButton").arrowClick();
            cy.checkToastMessage({ exists: false });
          });

          it("Check if 'Change Owner' button header menu and is functional", () => {
            cy.get("#HeaderMenuButton").arrowClick();
            cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible").arrowClick();
            cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
          });
        }
      );
    });

    context(`The status bar is BLUE(${Colors.dodger_blue})`, () => {
      it(`Color of Header status bar is BLUE(${Colors.dodger_blue})`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(77, 136, 255)" });
      });
    });
  });

  context("Scroll down the page → The status bar should be fixed", () => {
    it("Scroll down to the bottom of the page", () => {
      cy.get("[class*=\"MuiGrid-root makeStyles-formOptionsBox\"]").scrollIntoView();
    });
  });

  context("Populate the fields - including adding some references and selecting R&D build type- ", () => {
    it("Select 'R&D' build type", () => {
      cy.contains("Build Type").should("be.visible");
      cy.contains("Build Type").scrollIntoView().arrowClick().wait(1000);
      cy.get("[value=\"R&D\"]").check();
    });

    it("Add some references", () => {
      cy.drSelectReferences(reference.value);
    });

    it("Add 'Due Date'", () => {
      cy.poAddDateRequired();
    });

    it("Add Approver to approvals list", () => {
      cy.get("[data-cy^=fb-approvals-fb-approvals-]").autocompleteSelect(USERS[1].name);
    });
  });

  context("Start the step → LHR Step is created in WIP", () => {
    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Click 'START MPI'", () => {
      cy.get("[data-cy=\"LHR Step 1\"]").arrowClick();
      cy.mpiStartStep({ stepNumber: 1 });
    });
  });

  context("Check the content of the status bar", () => {
    it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.WIP,
        title: "LHR",
        docId: "Step #1",
        revision: "Rev A",
      });
      // cy.get("#HeaderInfo-subtitle").should("have.text", "LHR-00001");
    });

    context(`The status bar is BLUE(${Colors.dodger_blue})`, () => {
      it(`Color of Header status bar is BLUE(${Colors.dodger_blue})`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(77, 136, 255)" });
      });
    });

    context(
      `Click on the redline → Verify the status bar continues working as specified in the previous step and there’s only a “Save” button next in it.`,
      () => {
        it(`Click on the redline`, () => {
          cy.get("#HeaderMenuButton").arrowClick();
          cy.get("[data-cy=\"redlineButton\"]").arrowClick();
        });

        it(`Save → Verify it is functional and the last saved should be updated every time there is a “save” event 
      (manual or auto)`, () => {
          cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
        });
      }
    );

    context("Right side:", () => {
      it(`Complete step → Verify it is functional and Verify popup message Approvals not present`, () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        cy.poAMCheckForAlertMessage();
      });

      it(`Save → Verify it is functional and the last saved should be updated every time there is a “save” event 
      (manual or auto)`, () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      });

      it("Add Approver to approvals list", () => {
        cy.get("[data-cy^=fb-approvals-approvals-built-in]").autocompleteSelect(USERS[1].name);
      });

      it("Last save should be present", () => {
        cy.contains("Last saved:").should("be.exist");
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

      it("Last save should be present", () => {
        cy.contains("Last saved:").should("be.exist");
      });

      context(
        `Three dots: Clicking on it opens a menu where the “Void” and “Change Owner” options are displayed → 
      Verify they’re functional`,
        () => {
          it("Clicks on VOID button in header menu and is functional", () => {
            cy.get("#HeaderMenuButton").arrowClick();
            cy.get("[data-cy=\"void-button\"]").arrowClick();
            cy.get("#AlertDialog-cancelButton").arrowClick();
            cy.checkToastMessage({ exists: false });
          });

          it("Check if 'Change Owner' button header menu and is functional", () => {
            cy.get("#HeaderMenuButton").arrowClick();
            cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible").arrowClick();
            cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
          });
        }
      );
    });
  });

  context("Scroll down the page → The status bar should be fixed", () => {
    it("Scroll down to the bottom of the page", () => {
      cy.get("[class*=\"MuiGrid-root makeStyles-formOptionsBox\"]").scrollIntoView();
    });
  });

  context("Click on “Complete step” and submit for approval → LHRS is “In Review” state", () => {
    it("Click on “Complete step", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
    });

    it(`LHRS is ${STATUS_TYPES_LABEL.IN_REVIEW}  state`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
    });
  });

  context("Check the content of the status bar", () => {
    it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.IN_REVIEW,
        title: "LHR",
        docId: "Step #1",
        revision: "Rev A",
      });
      // cy.get("#HeaderInfo-subtitle").should("have.text", "LHR-00001");
    });

    context(`The status bar is ORANGE(${Colors.school_bus_yellow})`, () => {
      it(`Color of Header status bar is ORANGE(${Colors.school_bus_yellow})`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(239, 162, 11)" });
      });
    });

    context("Right side:", () => {
      it("Last save should not be present", () => {
        cy.contains("Last saved:").should("not.exist");
      });

      it("Check if 'Change Owner' button header menu and is functional", () => {
        cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible").arrowClick();
        cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
      });

      it("Click 'Withdraw Submission' button", () => {
        cy.get("[data-cy=\"document.revision.withdraw.alert\"]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevPreview], () => {
          cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
        });
      });

      it(`Complete step → Verify it is functional and Verify status changed ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
      });
    });
  });

  context("Scroll down the page → The status bar should be fixed", () => {
    it("Scroll down to the bottom of the page", () => {
      cy.get("[class*=\"MuiGrid-root makeStyles-formOptionsBox\"]").scrollIntoView();
    });
  });

  context("Approve the submission → LHRS is in the “Completed” state ", () => {
    it("Approve LHR", () => {
      cy.wait(3000);
      cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick();
      cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
      cy.unClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview, CyRoutes.SessionDetails], () => {
        cy.get("[data-cy=\"common.confirm\"]").arrowClick();
      });
      cy.checkToastMessage({ exists: false });
      cy.listLoadingElementShouldNotExist();
    });

    it(`LHRS is in the ${STATUS_TYPES_LABEL.COMPLETED} state`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.COMPLETED });
    });
  });

  context("Check the content of the status bar", () => {
    it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.COMPLETED,
        title: "LHR",
        docId: "Step #1",
        revision: "Rev A",
      });
      // cy.get("#HeaderInfo-subtitle").should("have.text", "LHR-00001");
    });

    context(`The status bar is BLUE(${Colors.dodger_blue})`, () => {
      it(`Color of Header status bar is BLUE(${Colors.dodger_blue})`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(77, 136, 255)" });
      });
    });

    context("Right side:", () => {
      it("Last save should not be present", () => {
        cy.contains("Last saved:").should("not.exist");
      });

      it("Check if 'Change Owner' button header menu and is functional", () => {
        cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible").arrowClick();
        cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
      });

      it("Click 'Revise document' button", () => {
        cy.get("[data-cy=\"updateRecord\"]").click();
      });
    });
  });

  context("Scroll down the page → The status bar should be fixed", () => {
    it("Scroll down to the bottom of the page", () => {
      cy.get("[class*=\"MuiGrid-root makeStyles-formOptionsBox\"]").scrollIntoView();
    });
  });

  context(
    `Revise LHRS → Select “Admin Change” and Complete the step again → New revision is Completed and 
  Revision A is Superseded`,
    () => {
      it("Add Approver to approvals list", () => {
        cy.get("[data-cy^=fb-approvals-approvals-built-in]").autocompleteSelect(USERS[1].name);
      });

      it("Click on Complete step to Complete the step again", () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      });

      it("Approve LHR", () => {
        cy.wait(3000);
        cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick();
        cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
        cy.unClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview, CyRoutes.SessionDetails], () => {
          cy.get("[data-cy=\"common.confirm\"]").arrowClick();
        });
        cy.checkToastMessage({ exists: false });
        cy.listLoadingElementShouldNotExist();
      });

      it(`LHRS is in the ${STATUS_TYPES_LABEL.COMPLETED} state`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.COMPLETED });
      });

      it("Open revisions tab, click and Revision A is Superseded", () => {
        cy.drClickRevisionsSidePanel();
        cy.get(`[data-cy="revision"]`).eq(1).should("have.text", "Revision A  - Superseded");
      });
    }
  );

  context(`Open the Superseded revision → Check the content of the status bar`, () => {
    it("Open the Superseded revision", () => {
      cy.get(`[data-cy="revision"]`).eq(1).click();
    });

    context("Check the content of the status bar", () => {
      it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.SUPERSEDED,
          title: "LHR",
          docId: "Step #1",
          revision: "Rev A",
        });
        // cy.get("#HeaderInfo-subtitle").should("have.text", "LHR-00001");
      });

      context(`The status bar is GREEN(${Colors.latest_green_varient})`, () => {
        it(`Color of Header status bar is GREEN(${Colors.latest_green_varient})`, () => {
          cy.verifyStatusbarBgcolor({ bcolor: "rgb(13, 183, 141)" });
        });
      });

      context("Right side:", () => {
        it("Last save should not be present", () => {
          cy.contains("Last saved:").should("not.exist");
        });

        it("Check if 'Change Owner' button header menu and is functional", () => {
          cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible").arrowClick();
          cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
        });
      });
    });
  });

  context("Scroll down the page → The status bar should be fixed", () => {
    it("Scroll down to the bottom of the page", () => {
      cy.get("[class*=\"MuiGrid-root makeStyles-formOptionsBox\"]").scrollIntoView();
    });
  });

  context("Go back to the LHR and submit it for approval → LHR is “In Review”", () => {
    it("Go back to the LHR", () => {
      cy.get("#HeaderInfo-subtitle").click();
    });

    it(`Submit it for approval and Status is in ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
    });
  });

  context("Check the content of the status bar", () => {
    it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.IN_REVIEW,
        title: "LHR",
        docId: "LHR-00001",
        revision: "Rev A",
      });
      cy.get("#HeaderInfo-subtitle").should("have.text", "LOT #22083001RD");
    });

    context(`The status bar is ORANGE(${Colors.school_bus_yellow})`, () => {
      it(`Color of Header status bar is ORANGE(${Colors.school_bus_yellow})`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(239, 162, 11)" });
      });
    });

    context("Right side:", () => {
      it("Last save should not be present", () => {
        cy.contains("Last saved:").should("not.exist");
      });

      it("Check if 'Change Owner' button header menu and is functional", () => {
        cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible").arrowClick();
        cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
      });

      it("Click 'Withdraw Submission' button", () => {
        cy.get("[data-cy=\"document.revision.withdraw.alert\"]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevPreview], () => {
          cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
        });
      });

      it(`Submit it for approval and Verify status changed ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
      });
    });
  });

  context("Scroll down the page → The status bar should be fixed", () => {
    it("Scroll down to the bottom of the page", () => {
      cy.get("[class*=\"MuiGrid-root makeStyles-formOptionsBox\"]").scrollIntoView();
    });
  });

  context("Approve it → LHR is Released → Check the content of the status bar", () => {
    it("Approve LHR", () => {
      cy.wait(3000);
      cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick();
      cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
      cy.unClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview, CyRoutes.SessionDetails], () => {
        cy.get("[data-cy=\"common.confirm\"]").arrowClick();
      });
      cy.checkToastMessage({ exists: false });
      cy.listLoadingElementShouldNotExist();
    });

    it(`LHR is in the ${STATUS_TYPES_LABEL.RELEASED} state`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });


  });
});

export { };

