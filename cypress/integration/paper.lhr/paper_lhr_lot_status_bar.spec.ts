import moment from "moment";
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
import { Part } from "../../utils/constants/documentTypes/part";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

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
let CSLDocumentType;
let createdLotsFormDocument;
let createdLot;

const groupOne = "Developers";
const paperlhrTitle = "Paper LHR form";
const lotDateSuffix = moment().tz("America/Los_Angeles").format("YYMMDD");

context(`Scenario 2.5.2 New Paper LHR, LHRS and LOT Status bar design`, () => {
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
  });

  context("Login admin user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create 'Paper LHR' form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Purchase Order Form'", () => {
      cy.drEnterDocumentTitle({ name: paperlhrTitle });
    });

    it("Enter description 'New Purchase Order Form description'", () => {
      cy.drEnterDocumentDescription({ description: "Paper LHR form description" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Purchase Order' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Paper Lot History Record" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Click Create New from Paper LHR form", () => {
      cy.drCreateNewDocumentFromForm();
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
    it("Select 'R&D' build type", () => {
      cy.get(`[name="lhr-build-type"]`).first().should("have.value", "R&D").check();
      cy.get(`[name="lhr-build-type"]`).eq(1).should("have.value", "Production").should("be.disabled");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.WIP,
        title: "LHR",
        docId: "LHR-00001",
        revision: "Rev A",
      });
      cy.get("#HeaderInfo-subtitle").should("contains.text", ` - LOT #${lotDateSuffix}01`);
    });

    context("Right side:", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Last save should be present", () => {
        cy.get("header").contains("Last saved").should("exist");
        cy.get("header").contains("Last saved").should("be.visible");
      });

      it("Enter initial quantity", () => {
        cy.get("[name=\"lhr_initial_quantity\"]").should("be.exist");
        cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
        cy.unClick();
      });

      it(`Verify 'Auto-saving, please wait' exist in statusbar`, () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .contains("Auto-saving, please wait");
      });

      it("Check Last save should be present in autosave", () => {
        cy.get("header").contains("Last saved a few seconds ago").should("exist");
        cy.get("header").contains("Last saved a few seconds ago").should("be.visible");
      });

      it("Wait for 2 min. It should display “Last saved 2 min ago”", () => {
        cy.wait(120000);
        cy.get(`[data-cy="header-last-saved"]`).should("have.text", "Last saved 2 minutes ago");
      });

      it(`Send to email buttons → Verify it is functional and Verify popup message File will be sent to your 
      email shortly`, () => {
        cy.sendToEmail();
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
        cy.closeAllAlertMessages();
      });

      it(`Submit for Approval`, () => {
        cy.wait(3000);
        cy.get("#ApproveAndRelease-button").arrowClick();
      });

      it("Verify it is functional and Verify popup message Approvals not present", () => {
        cy.checkToastMessageIsEqual({
          message: "Approvals not present",
        });
        cy.closeAllAlertMessages();
      });

      context(`Three dots: Clicking on it opens a menu where the “Void” and “Change Owner” options are displayed → 
        Verify they’re functional`, () => {
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
      });
    });

    context("Check the status bar background color is BLUE & static", () => {
      it(`Color of Header status bar is BLUE(rgb(77, 136, 255))`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(77, 136, 255)" });
      });

      it("Verify header is fixed when page scroll", () => {
        cy.get("#SMBodyTmpl").scrollTo("bottom", { ensureScrollable: false });
        cy.get("header").should("be.visible");
      });
    });

    context("Fill the form content", () => {
      it("Turn On autosave", () => {
        cy.cmpTurnOnAutosave();
      });

      it("Add some reference", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.drSelectReferences("FM-00002");
        });
      });

      it("Enter Intial Quantity field value", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
          cy.unClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enter End Quantity field value", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[name=\"lhr-end-quantity\"]").arrowType("20");
          cy.unClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Part document' for Part to be Manufactured", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[data-cy='lhr-selected-part']").autocompleteSelect("PRT-00001 - rev 1 - Part document");
        });
      });

      it("Add an Approval", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[data-cy^=fb-approvals-fb-approvals-]").arrowClick();
          cy.get("[data-cy^=fb-approvals-fb-approvals-]").autocompleteSelect(USERS[1].name);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click 'Submit for Approval' button", () => {
        cy.pmSubmitForApproval();
      });
    });

    context("Check the status bar content:", () => {
      it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.IN_REVIEW,
          title: "LHR",
          docId: "LHR-00001",
          revision: "Rev A",
        });
        cy.get("#HeaderInfo-subtitle").should("contains.text", ` - LOT #${lotDateSuffix}01`);
      });

      context("Right Side:", () => {
        it("Check Last save is not present in header", () => {
          cy.contains("Last saved:").should("not.exist");
        });

        it("Withdraw Submission", () => {
          SystemRequirement("REQ-0890");
          cy.get("[data-cy='document.revision.withdraw.alert']").arrowClick();
          cy.get("#AlertDialog-cancelButton").arrowClick();
        });

        it("Send to email button visible & functional", () => {
          cy.sendToEmail();
          cy.checkToastMessageContains({
            message: "File will be sent to your email shortly.",
          });
          cy.closeAllAlertMessages();
        });

        it("Check if 'Change Owner' button header menu and is functional", () => {
          cy.get("#HeaderMenuButton").arrowClick();
          cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible").arrowClick();
          cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
        });
      });

      context("Check The status bar background color is ORANGE & Static", () => {
        it(`Color of Header status bar is ORANGE(rgb(239, 162, 11))`, () => {
          cy.verifyStatusbarBgcolor({ bcolor: "rgb(239, 162, 11)" });
        });

        it("Verify header is fixed when page scroll", () => {
          cy.get(".hide-scroll>div>div>div").scrollTo("bottom", { ensureScrollable: false });
          cy.get("header").should("be.visible");
        });
      });

      context("Approve the LHR → The LHR is in Released status", () => {
        it("Approve Paper LHR", () => {
          cy.lhrApprove();
        });

        it("Verify Header info content RELEASED", () => {
          cy.verifyHeaderInfoContent({
            status: STATUS_TYPES_LABEL.RELEASED,
            title: "LHR",
            docId: "LHR-00001",
            revision: "Rev A",
          });
        });
      });
    });
  });

  context("Check the status bar content", () => {
    it("Check Last save is not present in header", () => {
      cy.get("header").contains("Last saved").should("not.exist");
    });

    it("Send to email button visible & functional", () => {
      cy.sendToEmail();
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });

    it("Check if 'Change Owner' button header menu and is functional", () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible").arrowClick();
      cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
    });
  });

  context("Scroll down the page → The status bar should be fixed", () => {
    it(`Color of Header status bar is GREEN(rgb(13, 183, 141))`, () => {
      cy.verifyStatusbarBgcolor({ bcolor: "rgb(13, 183, 141)" });
    });

    it("Verify header is fixed when page scroll", () => {
      cy.get(".hide-scroll>div>div>div").scrollTo("bottom", { ensureScrollable: false });
      cy.get("header").should("be.visible");
    });
  });

  context("Click on the References → Referenced documents open in a new tab", () => {
    // Click on the References → Referenced documents open in a new tab
  });

  context("Update the LHR & release the new revision", () => {
    it("Release the new version", () => {
      cy.drClickReviseDocument();
    });

    it("Add an Approval", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").arrowClick();
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").autocompleteSelect(USERS[1].name);
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Submit for Approval' button", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve Paper LHR", () => {
      cy.lhrApprove();
    });

    it("Open the Superseded revision", () => {
      cy.get("[data-cy='note-icon']").arrowClick();
    });

    it("Open the SUPERSEDED version", () => {
      cy.get("[data-cy='DocumentRevisionList-item']>a>span").contains("Revision A - Superseded").arrowClick();
    });
  });

  context("Check the content of the status bar SUPERSEDED version:", () => {
    it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.SUPERSEDED,
        title: "LHR",
        docId: "LHR-00001",
        revision: "Rev A",
      });
      cy.get("#HeaderInfo-subtitle").should("contains.text", ` - LOT #${lotDateSuffix}01`);
    });

    context("Right Side:", () => {
      it("Check Last save is not present in header", () => {
        cy.get("header").contains("Last saved").should("not.exist");
      });

      it("Send to email button visible & functional", () => {
        cy.sendToEmail();
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
        cy.closeAllAlertMessages();
      });

      it("Check if 'Change Owner' button header menu and is functional", () => {
        cy.get("#HeaderMenuButton").arrowClick();
        cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible").arrowClick();
        cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
      });
    });

    context("Check The status bar background color is GREEN & Static", () => {
      it(`Color of Header status bar is GREEN(rgb(13, 183, 141))`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(13, 183, 141)" });
      });

      it("Verify header is fixed when page scroll", () => {
        cy.get(".hide-scroll>div>div>div").scrollTo("bottom", { ensureScrollable: false });
        cy.get("header").should("be.visible");
      });
    });
  });

  context(`Update the LHR and select revision stage "Void" → 
    Complete the voiding process until the item goes to "Voided" state`, () => {
    it("Open the SUPERSEDED version", () => {
      cy.get("[data-cy='DocumentRevisionList-item']>a>span").contains("Revision A.1 - Released").arrowClick();
    });

    it("Revise document with 'Obsolete' option", () => {
      cy.drClickReviseDocument();
    });

    it("Select Void revision option", () => {
      cy.get("[id=\"RevisionTypeChange-obsolete\"]").arrowClick({ force: true });
    });

    it("Add an Approval", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").arrowClick();
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").autocompleteSelect(USERS[1].name);
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Submit for Approval' button", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
    });

    it("Provide description & Click Yes", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
        cy.get("[name='voidDescription']").arrowType("Voiding the document");
        cy.get("button[data-cy='fb-control-btn']").arrowClick({ force: true });
      });
    });

    it("Approve Paper LHR for VOIDED", () => {
      cy.lhrApprove();
    });
  });

  context("Check the content of the status bar VOIDED version:", () => {
    it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.OBSOLETE,
        title: "LHR",
        docId: "LHR-00001",
        revision: "Rev Void",
      });
      cy.get("#HeaderInfo-subtitle").should("contains.text", ` - LOT #${lotDateSuffix}01`);
    });

    context("Right Side:", () => {
      it("Check Last save is not present in header", () => {
        cy.get("header").contains("Last saved").should("not.exist");
      });

      it("Send to email button visible & functional", () => {
        cy.sendToEmail();
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
        cy.closeAllAlertMessages();
      });

      it("Check if 'Change Owner' button header menu and is functional", () => {
        cy.get("#HeaderMenuButton").arrowClick();
        cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible").arrowClick();
        cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
      });
    });

    context("Check The status bar background color is RED & Static", () => {
      it(`Color of Header status bar is RED(rgb(236, 43, 0))`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(236, 43, 0)" });
      });

      it("Verify header is fixed when page scroll", () => {
        cy.get(".hide-scroll>div>div>div").scrollTo("bottom", { ensureScrollable: false });
        cy.get("header").should("be.visible");
      });
    });
  });
});

export { };

