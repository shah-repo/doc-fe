// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { LHRTTest } from "../../utils/constants/documentTypes/lhrt";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocumentType;
let materialsDocumentType;
let equipmentDocument;
let materialsDocument;

// Test case Id ENC-11542 4c  step 25

context("Mpi Layout", () => {
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
              {
                ...LotHistoryRecordTest,
              },
              MPITest,
              LHRTTest,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
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
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  xcontext("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });
    it("Selects company", () => {
      cy.cmpSelectCompany({ name: "Plum Murphy, Zulauf and Kuphal 77604", multiple: true });
    });
  });


  context("Create MPI document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Verify Predefined fields appears", () => {
        cy.verifyPredefiendFields();
      });

      it("Verify that it contains Overview Tab", () => {
        cy.get("[data-cy=\"tabId.overview\"]").should("exist");
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
        cy.drSelectDocumentType({ documentType: "Manufacturing Process Instructions" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Verify Training checkbox should be unchecked", () => {
        cy.get("[data-cy=\"field-revisionStage\"]").should("not.be.checked");
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      context("Verify Layout of document", () => {
        it("Verify that it contains Overview, Procedure, Material and Equipment", () => {
          cy.get("[data-cy=\"tabId.overview\"]").should("exist");
          cy.get("[data-cy=\"tabId.procedure\"]").should("exist");
          cy.get("[data-cy=\"tabId.materialsandequipment\"]").should("exist");
        });

        it("Verify The top left of the page displays: Icon and type, ID, Rev stage, status (Draft)", () => {
          cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
          cy.get("header li>p>div>a>div").should("have.text", "Document List");
          cy.get("[data-cy='HeaderInfo'] span").should("contain.text", "MPI-00001");
          cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev 1");
        });

        it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
          cy.verifyFixedTab();
        });

        it("Verify Form opens to the Details tab by default and it contains", () => {
          cy.get("[data-cy=\"tabCon-tabId.overview\"]").should("have.attr", "aria-selected", "true");
          cy.get("#sm-tabpanel-0").should("be.visible");
        });

        it("Verify overview tab predefiend fields and approval block", () => {
          cy.verifyPredefiendFields();
          cy.get("[name^=\"fb-approvals-approvals-built-in\"]").should("exist");
        });

        it("Navigate to Procedure tab", () => {
          cy.drSelectProcedureTab();
        });

        context("Verify description field", () => {
          it("Verify DescriptionToolBar", () => {
            cy.verifyDescriptionToolbar();
          });

          it("Enter a 1 line description", () => {
            cy.drEnterDocumentDescription({
              description: "This is description test to check length. Checking length of characters and lines.",
            });
            cy.unClick();
            cy.get("[data-cy=\"description\"] button").should("not.exist");
            cy.get("[data-cy=\"description\"]").first().scrollIntoView({ ensureScrollable: false });
          });

          it("Add 2nd line description", () => {
            cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
            cy.get(`[data-cy="description"] [contenteditable]`)
              .first()
              .arrowType(
                "{moveToEnd}{enter}This is description test to check length. Checking length of characters and lines."
              );
            cy.unClick();
            cy.get("[data-cy=\"description\"] button").should("not.exist");
            cy.get("[data-cy=\"description\"]").first().scrollIntoView({ ensureScrollable: false });
          });

          it("Add 3rd line description", () => {
            cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
            cy.get(`[data-cy="description"] [contenteditable]`)
              .first()
              .arrowType("{moveToEnd}{enter}This is description test to check length.");
            cy.unClick();
            cy.get("[data-cy=\"description\"] button").should("exist");
            cy.get("[data-cy=\"description\"]").first().scrollIntoView({ ensureScrollable: false });
          });

          it("Enter a description longer than 3 lines and over 245 characters", () => {
            cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
            cy.get(`[data-cy="description"] [contenteditable]`)
              .first()
              .arrowType("{moveToEnd}{enter}Checking length of characters and lines ends here.");
            cy.unClick();
            cy.get(`[data-cy="description"] [contenteditable]`).first().scrollIntoView({ ensureScrollable: false });
            cy.unClick();
          });

          it("Click on view more description should be expanded", () => {
            cy.get("[data-cy=\"description\"] button").arrowClick();
            cy.get("div[class^=\"rdw-editor-toolbar\"]").should("exist");
          });

          it("Click on view less description should be collapsed", () => {
            cy.get("[data-cy=\"description\"] button").arrowClick();
            cy.get("[data-cy=\"description\"] .rdw-editor-toolbar").should("not.exist");
          });
        });
      });

      context("Verify that Procedure tab contains", () => {
        it("PI Procedure, Notes, Start, Accept, Rejected Qty - Predefined schema fields", () => {
          cy.get(".fb-field-wrapper-mpi-procedure-built-in").should("exist");
          cy.get("[data-cy=\"mpi-procedure-built-in.description\"]").should("exist");
          cy.get("[data-cy=\"form.builder.attachments\"]").should("exist");
          cy.get("[data-cy=\"mediaUploadField\"]").should("exist");
          cy.get("[data-cy=\"form.builder.materials\"]").should("exist");
          cy.get("[data-cy=\"form.builder.equipment\"]").should("exist");
          cy.get("[name=\"lhrs-start-quantity\"]").should("exist");
          cy.get("[name=\"lhrs-accepted-quantity\"]").should("exist");
          cy.get("[name=\"lhrs-rejected-quantity\"]").should("exist");
        });

        it("Option to add FB field ", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").should("exist");
        });

        it("Add Text field, Insert label and click ADD. ", () => {
          cy.fbAddNewFieldWhenHidden();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
          cy.fbEnterNameValue({ name: "label", value: "Textfield" });
          cy.fbAddNewFieldButton();
        });

        it("Verify that fields are added", () => {
          cy.get("[data-cy^=\"textfield\"]").should("exist");
        });

        it("Verify Step #1 exists ", () => {
          cy.get("[data-cy=\"form.builder.step.number\"]>div").should("contain.text", "Step #1");
        });

        it("Verify that Form Options should appear for this tab if FB fields are added", () => {
          cy.get(".formOptionsBox").should("exist");
        });
      });

      context("Fill in the fields and clone step", () => {
        it("Fill step #1 description", () => {
          cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Step #1 description" });
        });

        it("Add 'Material one' to step #1", () => {
          cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Material one", quntity: "3", unit: "Each" });
        });

        it("Add 'Equipment one' to step #1", () => {
          cy.mpiAddEquipmentToStep({ numbOfStep: 1, equipment: "Equipment one" });
        });


        it("Upload attachment 'video.mp4'", () => {
          cy.get("[data-cy=\"albumMediaButton\"]").arrowClick();
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAttachmentsAttached], () => {
            cy.pmUploadAttachment({ fileName: "video.mp4" });
          });
          cy.progressBarShouldNotExist();
        });

        it("Save document", () => {
          cy.drClickCreateDocumentWithoutApiCall();
        });

        it("Upload attachment 'image.jpg'", () => {
          cy.wrapWithWaitOnApiCalls([ CyRoutes.GetAttachmentsAttached], () => {
            cy.pmUploadAttachment({ fileName: "image.jpg" });
          });
          cy.progressBarShouldNotExist();
        });

        it("Save document", () => {
          cy.drClickCreateDocumentWithoutApiCall();
        });

        it("Upload attachment 'test.docx'", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAttachmentsAttached], () => {
            cy.pmUploadAttachment({ fileName: "test.docx" });
          });
          cy.progressBarShouldNotExist();
        });
        it("Save document", () => {
          cy.drClickCreateDocumentWithoutApiCall();
        });

        it("Click 'Clone Step'", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev,
            CyRoutes.GetAttachments,
            CyRoutes.GetAttachmentsAttached,
          ], () => {
            cy.get("[data-cy=\"form.builder.clone.step\"]").arrowClick();
          });
          cy.wait(10000);
          cy.progressBarShouldNotExist();
        });
      });

      context("Verify 'Clone Step' feature", () => {

        it("Verify description is copied", () => {
          cy.get("[data-cy=\"form.builder.step.number\"]").eq(1).scrollIntoView();

          cy.get("div[id^=\"fb-mpiprocedure\"] p")
            .eq(1)
            .should("have.text", "Step #1 description");
        });

        it("Verify materials are copied", () => {
          cy.get("[data-cy=\"form.builder.mpi.procedure.materials.title\"]").eq(1).scrollIntoView();
          cy.get("[data-cy=\"form.builder.mpi.procedure.materials.title\"]>div")
            .eq(1).should("have.text", "MT-00004 - Material one | Qty: 3 each");

        });

        it("Verify equipments are copied", () => {
          cy.get("[data-cy=\"form.builder.mpi.procedure.equipment.title\"]>div")
            .eq(1).should("have.text", "ET-00003 - Equipment one");
        });

        it("Verify attachments are copied", () => {
          cy.get("[data-cy=\"mediaUploadField\"]>div>div>div>div>div").eq(5).arrowClick();
          cy.get("[data-cy=\"mediaUploadField\"] ul>li div[title]").each(($el) => {
            const attachName = $el.text();
            expect(attachName).to.be.oneOf(["image", "test", "video"]);
          });
        });
      });

      context("Add another step and fill the fields", () => {
        it("Add another step", () => {
          cy.get("[data-cy=\"form.builder.add.step\"]").eq(1).arrowClick();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Verify Step #3 exists ", () => {
          cy.get("[data-cy=\"form.builder.step.number\"]>div").eq(2).should("contain.text", "Step #3");
        });

        context("Fill in the fields", () => {
          it("Fill step #3 description", () => {
            cy.get("[data-cy=\"form.builder.step.number\"]").eq(2).scrollIntoView();
            cy.mpiEnterDescriptionToStep({ numbOfStep: 2, description: "Step #3 description" });
          });

          it("Add 'Material one' to step #3", () => {
            cy.mpiAddMaterialDocumentToStep({ numbOfStep: 3, material: "Material one", quntity: "3", unit: "Each" });
          });

          it("Add 'Equipment one' to step #3", () => {
            cy.mpiAddEquipmentToStep({ numbOfStep: 3, equipment: "Equipment one" });
          });

          it("Upload attachment 'video.mp4'", () => {
            cy.get("[data-cy=\"albumMediaButton\"]").arrowClick();
            cy.wrapWithWaitOnApiCalls([CyRoutes.GetAttachmentsAttached], () => {
              cy.pmUploadAttachment({ fileName: "video.mp4" });
            });
            cy.progressBarShouldNotExist();
          });

          it("Save document", () => {
            cy.drClickCreateDocumentWithoutApiCall();
          });

          it("Upload attachment 'image.jpg'", () => {
            cy.wrapWithWaitOnApiCalls([ CyRoutes.GetAttachmentsAttached], () => {
              cy.pmUploadAttachment({ fileName: "image.jpg" });
            });
            cy.progressBarShouldNotExist();
          });

          it("Save document", () => {
            cy.drClickCreateDocumentWithoutApiCall();
          });

          it("Upload attachment 'test.docx'", () => {
            cy.wrapWithWaitOnApiCalls([CyRoutes.GetAttachmentsAttached], () => {
              cy.pmUploadAttachment({ fileName: "test.docx" });
            });
            cy.progressBarShouldNotExist();
          });

          it("Save document", () => {
            cy.drClickCreateDocumentWithoutApiCall();
          });

          it("Verify that Form Options should appear for this tab if FB fields are added", () => {
            cy.get(".formOptionsBox").should("exist");
          });
        });

      });

      xcontext("Verify Material tab", () => {
        it("Should display aggregate of materials in Procedure tab in one line", () => {
          // cy.mpiEnterDescriptionToStep({ numbOfStep: 3, description: "Step #3 description" });
        });

        it("should display aggregate of equipment in Procedure tab in one line", () => {
          // cy.mpiAddMaterialDocumentToStep({ numbOfStep: 3, material: "Material one3", quntity: "3", unit: "Each" });
        });
      });

      context("Verification related to training", () => {
        it("Verify Training Tab visiblility", () => {
          cy.get("[data-cy=\"tabId.training\"]").should("be.visible");
        });

        it("Navigate to overview Tab", () => {
          cy.drSelectOverviewTab();
        });

        it("Uncheck the training chekbox", () => {
          cy.get("[data-cy=\"field-retrain\"] input[type=checkbox]").uncheck();
          cy.get("[data-cy=\"tabId.training\"]").should("not.exist");
        });

        it("check the training chekbox", () => {
          cy.get("[data-cy=\"field-retrain\"] input[type=checkbox]").check();
          cy.get("[data-cy=\"tabId.training\"]").should("exist");
        });
      });

      context("Validate Right Side Panel", () => {

        it("Verify that right side panel opens by default to the References tab", () => {
          cy.get("[data-cy=\"References\"]").should("exist");
          cy.get("[data-cy=\"generalInfo\"]").should("be.visible");
        });

        it("Verify Reference tab Info", () => {
          cy.verifyReferenceTab({ user: USERS[1], formId: "", shortName: "GR" });
        });

        it("Verify Eye Icon", () => {
          cy.get("[data-cy=\"references-icon\"]").should("exist");
        });

        it("Verify Expand and collapse", () => {
          cy.verifyExpandCollpase();
        });

        it("It is fixed as the user scrolls up or down", () => {
          cy.get("#sm-tabpanel-0").scrollIntoView().should("be.visible");
          cy.get("[data-cy='References']").should("be.visible");
        });

        it("Verify References selection Add Remove", () => {
          cy.verifyAddRemoveReference({ formId: "FM-00001" });
        });

        it("Verify Referenced By, Training ,and Release date Item exist or not", () => {
          cy.verifyReferenceInfo();
          cy.get("[data-cy='common.revision']").should("contain.text", "Revision");
          cy.get("[data-cy='common.revision']").parent().should("contain.text",
            moment().tz("America/Los_Angeles").format("YYYY.MM.DD"));
        });

        context("Verify Revision", () => {
          it("open revision tab", () => {
            cy.get("[data-cy=\"note-icon\"]").arrowClick();
          });

          it("Verify revision Rev Document open or not", () => {
            cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(0).arrowClick();
            cy.wait(2000);
            cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev 1");

          });
        });

        context("Verify User able to add Groups or other user permissions", () => {
          it("Open permissions tab", () => {
            cy.drSelectPermissionTab();
          });

          it("Add another user permission", () => {
            cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
              cy.drAddUserFromPermissionTab(USERS[3].name);
            });
          });

          it("Add another group permission", () => {
            cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
              cy.drAddGroupFromPermissionTab("Developers");
            });
          });

        });

        context("Check document history", () => {
          const groupOne = "Developers";
          let groupTwo;
          const history = [
            {
              owner: USERS[1].name,
              actions: [
                { key: "Access granted to group", value: `Developers` },
              ],
            },
            {
              owner: USERS[1].name,
              actions: [
                { key: "Access granted to user", value: `${USERS[3].name}` },
              ],
            },
          ];
          it("Verify Doc history", () => {
            cy.drSelectHistoryTab();
          });
          history.forEach((element, groupIndex) => {
            it(`Check owner name for group ${groupIndex + 1}`, () => {
              cy.get(`[data-cy="change-key-${groupIndex}"]`).should("have.text", element.owner);
            });
            element.actions.forEach((action, index, identifier) => {
              it(`'${action.key}' as '${action.value}' exists`, () => {
                const typeOfChange = action.key;
                let contentOfChange = action.value;

                if (action.key === "New description" || action.key === "Description changed" ) {
                  contentOfChange = "\n" + action.value + "\n";
                }

                if (typeOfChange === "s3Link added") {
                  cy.get(`[data-cy^="change-key-${groupIndex}-${index}"]`).should("have.text", typeOfChange);
                  cy.get("[data-cy='downloadS3link']").should("contain.text", contentOfChange);
                }
                else {
                  if (action.key === "Access granted to group") {
                    cy.get(`[data-cy^="change-value-${groupIndex}-${index}"]`).should(($identifier) =>  {
                      expect($identifier.text()).to.be.oneOf([groupOne, groupTwo, "Everyone"]);
                    });
                  }
                  else {
                    cy.get(`[data-cy^="change-value-${groupIndex}-${index}"]`)
                      .contains(action.key === "New owner" ? new RegExp("^" + action.value) : action.value)
                      .parent()
                      .parent()
                      .within(() => {
                        cy.get(`[data-cy^=change-key-${groupIndex}-${index}]`).should("have.text", typeOfChange);
                        cy.get(`[data-cy^=change-value-${groupIndex}-${index}]`)
                          .should("contain.text", contentOfChange);
                      });
                  }
                }
              });
            });
          });
        });

        context("Verify Book Mark", () => {
          it("Verify Book Mark Navigation", () => {
            cy.get("[data-cy=\"bookmark-icon\"]").arrowClick();
            cy.get("[data-cy=\"Bookmarks-detail\"]").should("be.visible");
          });
        });

      });

      context("Verify Scroll", () => {
        it("Navigate to history tab", () => {
          cy.get("[data-cy='timeline-icon']").arrowClick();
        });

        it("Click and drag the scroll bar and verify that user can scroll history tab", () => {
          cy.get("[data-cy='History-detail']").realHover().wait(2000).scrollTo("bottom");
        });

        it("Navigate to overview tab", () => {
          cy.drSelectOverviewTab();
        });
      });

      context("Release MPI", () => {

        it("Approve and release MPI document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          });
        });

      });
    });
  });

  context("Verify all fields are displayed in the tabs as it should", () => {

    it("Verify that it contains Overview, Procedure, Material and Equipment", () => {
      cy.get("[data-cy=\"tabId.overview\"]").should("exist");
      cy.get("[data-cy=\"tabId.procedure\"]").should("exist");
      cy.get("[data-cy=\"tabId.materialsandequipment\"]").should("exist");
    });

    it("Verify The top left of the page displays: Icon and type, ID, Rev stage, status (Draft)", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get("header li>p>div>a>div").should("have.text", "Document List");
      cy.get("[data-cy='HeaderInfo'] span").should("contain.text", "MPI-00001");
      cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev 1");
    });

    it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      cy.verifyFixedTab();
    });

    it("Verify Form opens to the overview tab by default and it contains", () => {
      cy.get("[data-cy=\"tabCon-tabId.overview\"]").should("have.attr", "aria-selected", "true");
      cy.get("#sm-tabpanel-0").should("be.visible");
    });

    it("Verify overview tab fields and approval block", () => {
      cy.get("[data-cy=\"field-name\"]").should("exist");
      cy.get("[data-cy=\"BaseWithhtml-editor\"]").should("exist");
      cy.get("[name^=\"fb-approvals-approvals-built-in\"]").should("exist");
    });

    it("Navigate to Procedure tab", () => {
      cy.drSelectProcedureTab();
    });

    it("Click on view more description should be expanded", () => {
      cy.get("[data-cy=\"BaseWithhtml-editor\"] button").arrowClick();
    });

    it("Verify on scroll The top bar with “Revise document” and “Change owner” are fixed", () => {
      cy.get("[data-cy=\"form.builder.step.number\"]").eq(2).scrollIntoView();
      cy.get("[data-cy=\"updateRecord\"]").should("be.visible");
      cy.get("[data-cy=\"changeOwner\"]").should("be.visible");
    });

    it("Click on view less description and scroll", () => {
      cy.get("[data-cy=\"BaseWithhtml-editor\"] button").arrowClick();
      cy.get("[data-cy=\"lhrs-start-quantity\"]").scrollIntoView();
    });

    it("Verify on scroll The top bar with “Revise document” and “Change owner” are fixed", () => {
      cy.get("[data-cy=\"updateRecord\"]").should("be.visible");
      cy.get("[data-cy=\"changeOwner\"]").should("be.visible");
    });
  });
});

export { };

