import "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import Colors from "../../../src/ui/layout/theme/utils/colors";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { RecordDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let developersGroup;
let adminSessionId;
let adminEmployee;
let employeeToDevs;
let RDdocumentType;
let dateAfterEmailShouldArrive;

const reference = {
  value: "FM-00001",
  valueCode: "FM-00001",
};

const owner = USERS[1].name;
const dateOffset = (5 * 1000);

context(
  `Scenario 2.1 Status bar design of new items approved via approval block (Regular Record).`,
  () => {
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
              documentTypes: [RecordDocumentType],
            },
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdCompany = response;
            adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
            employeeToDevs = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
            RDdocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Record Document");
            done();
          });
        });
      });

      context("[API]Update record document type", () => {
        it("Change fields config in record document type", () => {
          cy.drUpdateDocumentTypeName({
            sessionId: loginResponse.sessionId,
            employeeId: adminEmployee.id,
            id: RDdocumentType[0].id,
            payload: {
              fieldsConfig: {
                D: {
                  visible: false,
                  required: false,
                },
                E: {
                  label: "Record Type",
                  visible: false,
                  required: true,
                },
                F: {
                  label: "Record ID",
                  visible: false,
                  required: true,
                },
                G: {
                  visible: false,
                  required: false,
                },
                I: {
                  visible: false,
                },
                J: {
                  visible: false,
                },
                K: {
                  label: "Void",
                  visible: true,
                },
                L: {
                  label: "Correction",
                  visible: true,
                },
                N: {
                  label: "Approve and Release",
                  visible: true,
                },
                O: {
                  label: "Record History",
                  visible: true,
                },
                R: {
                  visible: false,
                },
                S: {
                  label: "Update Record",
                  visible: true,
                },
                A1: {
                  label: "WIP",
                  visible: true,
                },
                A2: {
                  label: "Voided",
                  visible: true,
                },
                A3: {
                  label: "Archive",
                  visible: true,
                },
                P1: {
                  label: "WIP",
                  visible: true,
                },
                P2: {
                  label: "Voided",
                  visible: true,
                },
                P3: {
                  label: "Archive",
                  visible: true,
                },
              },
            },
          });
        });
      });

      it("[API]Login admin tester", (done: any) => {
        cy.authApiLogin({
          email: USERS[1].email,
        }).then((response) => {
          loginResponse = response;
          adminSessionId = loginResponse.sessionId;
          done();
        });
      });
    });

    context("[API]Add employee to developers group", () => {
      it("[API]Get group", (done: any) => {
        cy.grpGetGroupByName({
          groupName: "Developers",
          sessionId: adminSessionId,
          employeeId: adminEmployee.id,
        }).then((response) => {
          developersGroup = response;
          done();
        });
      });

      it("[API]Patch group", () => {
        cy.grpPatchGroup({
          groupId: developersGroup.body[0].id,
          sessionId: adminSessionId,
          employeeId: adminEmployee.id,
          payload: {
            employees: [{ id: employeeToDevs.id }],
          },
        });
      });
    });

    context("Login user", () => {
      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      });
    });

    context(`Create a new form with an output of internal type Record`, () => {
      context("Create Record with form", () => {
        context("Start document creation flow", () => {
          it("Navigates to document list", () => {
            cy.navigToDocumentList();
          });

          it("Clicks on 'create a document' button", () => {
            cy.cmpClickCreateNewDocument();
          });
        });

        context("Fill in Form attributes", () => {
          it("Enters title 'Regular Record Form Title'", () => {
            cy.drEnterDocumentTitle({ name: "Regular Record Form Title" });
          });

          it("Enters description 'Regular Record Form description'", () => {
            cy.drEnterDocumentDescription({ description: "Regular Record Form description" });
          });

          it("Select 'Form' document type from dropdown", () => {
            cy.drSelectDocumentType({ documentType: "Form" });
          });

          it("Select 'Record Document' output document type from dropdown", () => {
            cy.drSelectOutputDocumentType({ documentType: "Record Document" });
          });

          it("Select 'Numeric' revision stage", () => {
            cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
          });

          it("Click create document", () => {
            cy.drClickCreateDocumentWithApiCall();
          });

          it("Upload attachement picture 'image.jpg'", () => {
            cy.atchUploadAttachment({ fileName: "image.jpg" });
          });
        });

        context("Approve and Release Form", () => {
          it("Approve and Release document", () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          });
        });
      });

      context(`Create New → The record will be in WIP. state`, () => {
        it("Click on Create New button", () => {
          cy.fbClickButton({ el: "PreviewControlsContainer-createNew" });
        });
      });

      context("Check the content of the status bar", () => {
        it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
          cy.verifyHeaderInfoContent({
            status: STATUS_TYPES_LABEL.WIP,
            title: "Records",
            docId: "RD-00003",
            revision: "Rev A",
          });
        });

        context(`The status bar is BLUE(${Colors.dodger_blue})`, () => {
          it(`Color of Header status bar is BLUE(${Colors.dodger_blue})`, () => {
            cy.verifyStatusbarBgcolor({ bcolor: "rgb(77, 136, 255)" });
          });
        });

        context("Right side:", () => {
          it("Turn off autosave", () => {
            cy.cmpTurnOffAutosave();
          });

          it("Make a change to title", () => {
            cy.drEnterDocumentTitle({ name: "Regular Record" });
          });

          it("Verify Status bar displays “Last saved a few seconds ago", () => {
            cy.get(`[data-cy="header-last-saved"]`).should("have.text", "Last saved a few seconds ago");
          });

          it("Turn on autosave", () => {
            cy.cmpTurnOnAutosave();
          });

          it("Make a change to title", () => {
            cy.drClearDocumentTitle();
            cy.drEnterDocumentTitle({ name: "Regular Record title" });
          });

          it(`Verify auto save is functional and the Check Auto-saving, please wait… is present)`, () => {
            cy.get(`[data-cy="header.autoSaving"]`).should("have.text", "Auto-saving, please wait…");
          });

          it("Wait for 2 min. It should display “Last saved 2 min ago”", () => {
            cy.wait(120000);
            cy.get(`[data-cy="header-last-saved"]`).should("have.text", "Last saved 2 minutes ago");
          });

          context("Edit all the fields, and make sure the “last saved” data is updated each time", () => {
            it("Enters title 'Regular Record '", () => {
              cy.drEnterDocumentTitle({ name: "Regular Record " });
              cy.progressBarShouldNotExist();
            });

            it("Check Last save should be present in autosave", () => {
              cy.get(`[data-cy="header-last-saved"]`).should("have.text", "Last saved a few seconds ago");
            });

            it("Add Approver to approvals list", () => {
              cy.wait(3000);
              cy.pmAddApproverOnApproverList({ approver: owner });
              cy.progressBarShouldNotExist();
            });

            it("Check Last save should be present in autosave", () => {
              cy.get(`[data-cy="header-last-saved"]`).should("have.text", "Last saved a few seconds ago");
            });

            it("remove Approver to approvals list", () => {
              cy.wait(3000);
              cy.get(`[class*="MuiChip-root MuiAutocomplete-tag MuiChip-deletable"] div`).contains(owner)
                .parent().parent().find("svg").arrowClick({ force: true });
            });

            it("Check Last save should be present in autosave", () => {
              cy.get(`[data-cy="header-last-saved"]`).should("have.text", "Last saved a few seconds ago");
            });
          });
        });

        context("Verify three dot and send to Email option", () => {
          it("check three dots are visible", () => {
            cy.get(`[data-cy="HeaderMenuButton"]`).should("be.visible");
          });

          it("Verify on click of three dots menu should open", () => {
            cy.get(`[data-cy="HeaderMenuButton"]`).arrowClick();
            cy.get("[data-cy='exportToEmail']").contains("Send To Email").should("be.visible");
          });

          it("Verify Send To Email option should be visible", () => {
            cy.get("[data-cy='exportToEmail']").contains("Send To Email").should("be.visible");
            dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
          });

          it(`Send to email buttons → Verify it is functional and Verify popup message File will be sent to your 
          email shortly`, () => {
            cy.sendToEmailFromHeader();
            cy.checkToastMessageContains({
              message: "File will be sent to your email shortly.",
            });
            cy.closeAllAlertMessages();
          });

          it("Get sent email", () => {
            const getEmailSetting =  {
              to: CONFIG.TEST_EMAIL,
              after: dateAfterEmailShouldArrive,
              subject: `Export for document RD-00003`,
            };
            cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
              expect(emails[0].subject).match(/Export for document RD-00003/);
              expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
            });
          });
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
              cy.get("#OwnerChangerPresenter-selectField").autocompleteSelect(USERS[2].name);
              cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
            });

            it(`Verify changed ${USERS[2].name}`, () => {
              cy.get("[data-cy='user-name']").should("have.text", USERS[2].name);
            });

            it("change owner back to company Admin", () => {
              cy.get("#HeaderMenuButton").arrowClick();
              cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible").arrowClick();
              cy.get("#OwnerChangerPresenter-selectField").autocompleteSelect(owner);
              cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
            });

            it(`Verify changed onwer ${owner}`, () => {
              cy.get("[data-cy='user-name']").should("have.text", owner);
            });
          }
        );
      });

      context("Scroll down the page → The status bar should be fixed", () => {
        it("Scroll down to the bottom of the page", () => {
          cy.get("#sm-tabpanel-0").find(".formOptionsBox").scrollIntoView();
          cy.get(`[data-cy="HeaderInfo"]`).should("be.visible");
        });

        it("Turn on autosave", () => {
          cy.cmpTurnOnAutosave();
        });
      });

      context("Add some references", () => {
        it("Add some references", () => {
          cy.drSelectReferences(reference.value);
        });
      });

      context("Add an approver and submit for approval → The record will be in “In Review”", () => {
        it("Add Approver to approvals list", () => {
          cy.pmAddApproverOnApproverList({ approver: owner });
        });

        it("Click on Submit For Approval", () => {
          cy.pmSubmitForApproval();
        });
      });

      context("Check the content of the status bar", () => {
        it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
          cy.verifyHeaderInfoContent({
            status: STATUS_TYPES_LABEL.IN_REVIEW,
            title: "Records",
            docId: "RD-00003",
            revision: "Rev A",
          });
        });

        context(`The status bar is ORANGE(${Colors.school_bus_yellow})`, () => {
          it(`Color of Header status bar is ORANGE(${Colors.school_bus_yellow})`, () => {
            cy.verifyStatusbarBgcolor({ bcolor: "rgb(239, 162, 11)" });
          });
        });

        context("Right side:", () => {
          it("Last save should not be present", () => {
            cy.get(`[data-cy="header-last-saved"]`).should("not.exist");
          });

          it("Check if 'Change Owner' button header menu and is functional", () => {
            cy.get("#HeaderMenuButton").arrowClick();
            cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible").arrowClick();
            cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
          });

          it(`Send to email buttons → Verify it is functional and Verify popup message File will be sent to your 
          email shortly`, () => {
            cy.get("#HeaderMenuButton").arrowClick();
            cy.get("[data-cy=\"exportToEmail\"]").contains("Send To Email").arrowClick();
            cy.checkToastMessageContains({
              message: "File will be sent to your email shortly.",
            });
            cy.closeAllAlertMessages();
          });

          it("Click 'Withdraw Submission' button", () => {
            cy.get("[data-cy=\"document.revision.withdraw.alert\"]").arrowClick();
            cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevPreview], () => {
              cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
            });
          });

          it("Click on Submit For Approval", () => {
            cy.pmSubmitForApproval();
          });
        });
      });

      context("Scroll down the page → The status bar should be fixed", () => {
        it("Scroll down to the bottom of the page", () => {
          cy.get("#sm-tabpanel-0").find(".formOptionsBox").scrollIntoView();
          cy.get(`[data-cy="HeaderInfo"]`).should("be.visible");
        });
      });

      context("Approve the record → The record is in the Released status", () => {
        it("Approve the record", () => {
          cy.wait(3000);
          cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick();
          cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
          cy.unClick();
          cy.wrapWithWaitOnApiCalls(
            [CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview, CyRoutes.SessionDetails],
            () => {
              cy.get("[data-cy=\"common.confirm\"]").arrowClick();
            }
          );
          cy.checkToastMessage({ exists: false });
          cy.listLoadingElementShouldNotExist();
        });

        it(`The record is in the ${STATUS_TYPES_LABEL.RELEASED}  state`, () => {
          cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        });
      });

      context("Check the content of the status bar", () => {
        it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
          cy.verifyHeaderInfoContent({
            status: STATUS_TYPES_LABEL.RELEASED,
            title: "Records",
            docId: "RD-00003",
            revision: "Rev A",
          });
        });

        context(`The status bar is GREEN(${Colors.latest_green_varient})`, () => {
          it(`Color of Header status bar is GREEN(${Colors.latest_green_varient})`, () => {
            cy.verifyStatusbarBgcolor({ bcolor: "rgb(13, 183, 141)" });
          });
        });

        context("Right side:", () => {
          it("Last save should not be present", () => {
            cy.get(`[data-cy="header-last-saved"]`).should("not.exist");
          });

          context("Verify three dot and send to Email option and functionality", () => {
            it("check three dots are visible", () => {
              cy.get(`[data-cy="HeaderMenuButton"]`).should("be.visible");
            });

            it("Verify on click of three dots menu should open", () => {
              cy.get(`[data-cy="HeaderMenuButton"]`).arrowClick();
              cy.get("[data-cy='exportToEmail']").contains("Send To Email").should("be.visible");
            });

            it("Verify Send To Email option should be visible", () => {
              cy.get("[data-cy='exportToEmail']").contains("Send To Email").should("be.visible");
              dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
            });

            it(`Send to email buttons → Verify it is functional and Verify popup message File will be sent to your 
            email shortly`, () => {
              cy.sendToEmailFromHeader();
              cy.checkToastMessageContains({
                message: "File will be sent to your email shortly.",
              });
              cy.closeAllAlertMessages();
            });

            it("Get sent email", () => {
              const getEmailSetting =  {
                to: CONFIG.TEST_EMAIL,
                after: dateAfterEmailShouldArrive,
                subject: `Export for document RD-00003`,
              };
              cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
                expect(emails[0].subject).match(/Export for document RD-00003/);
                expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
              });
            });
          });

          context("Verify three dots change owner option and functionality", () => {

            it("Check if 'Change Owner' button header menu and is functional", () => {
              cy.get("#HeaderMenuButton").arrowClick();
              cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible").arrowClick();
              cy.get("#OwnerChangerPresenter-selectField").autocompleteSelect(USERS[2].name);
              cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
            });

            it(`Verify changed ${USERS[2].name}`, () => {
              cy.get("[data-cy='user-name']").should("have.text", USERS[2].name);
            });

            it("change owner back to company Admin", () => {
              cy.get("#HeaderMenuButton").arrowClick();
              cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible").arrowClick();
              cy.get("#OwnerChangerPresenter-selectField").autocompleteSelect(owner);
              cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
            });

            it(`Verify changed onwer ${owner}`, () => {
              cy.get("[data-cy='user-name']").should("have.text", owner);
            });
          });

          context(`Update the record and release the new revision`, () => {
            it("Check if 'Update Record' button header menu and is functional", () => {
              cy.get("[data-cy=\"updateRecord\"]").should("be.visible").arrowClick();
            });

            it("Add Approver to approvals list", () => {
              cy.wait(3000);
              cy.pmAddApproverOnApproverList({ approver: owner });
            });

            it("Click on Submit For Approval", () => {
              cy.pmSubmitForApproval();
            });

            it("Approve the record", () => {
              cy.wait(3000);
              cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick();
              cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
              cy.unClick();
              cy.wrapWithWaitOnApiCalls(
                [CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview, CyRoutes.SessionDetails],
                () => {
                  cy.get("[data-cy=\"common.confirm\"]").arrowClick();
                }
              );
              cy.checkToastMessage({ exists: false });
              cy.listLoadingElementShouldNotExist();
            });
          });
        });
      });

      context("Scroll down the page → The status bar should be fixed", () => {
        it("Scroll down to the bottom of the page", () => {
          cy.get("#sm-tabpanel-0").find(".formOptionsBox").scrollIntoView();
          cy.get(`[data-cy="HeaderInfo"]`).should("be.visible");
        });
      });

      context("Click on the References added in step 5 → Referenced documents open in a new tab", () => {
        it("Open References Tab", () => {
          cy.get("[data-cy=\"references-icon\"]").click();
        });

        it("Click on the references", () => {
          cy.get("#ReferencePresenter-link").click();
        });
      });

      context(`Update the record and release the new revision`, () => {
        it("Check if 'Update Record' button header menu and is functional", () => {
          cy.get("[data-cy=\"updateRecord\"]").should("be.visible").arrowClick();
        });

        it("Add Approver to approvals list", () => {
          cy.wait(3000);
          cy.pmAddApproverOnApproverList({ approver: owner });
        });

        it("Click on Submit For Approval", () => {
          cy.pmSubmitForApproval();
        });

        it("Approve the record", () => {
          cy.wait(3000);
          cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick();
          cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
          cy.unClick();
          cy.wrapWithWaitOnApiCalls(
            [CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview, CyRoutes.SessionDetails],
            () => {
              cy.get("[data-cy=\"common.confirm\"]").arrowClick();
            }
          );
          cy.checkToastMessage({ exists: false });
          cy.listLoadingElementShouldNotExist();
        });
      });

      context("Open the Archive revision and verify", () => {

        it("Click on revision tab", () => {
          cy.get("[data-cy='note-icon']").arrowClick();
        });

        it("Open archive revision", () => {
          cy.get("[data-cy='DocumentRevisionList-item']").contains("Archive").arrowClick();
        });


        context("Check the content of the status bar", () => {
          it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
            cy.verifyHeaderInfoContent({
              status: STATUS_TYPES_LABEL.ARCHIVE,
              title: "Records",
              docId: "RD-00003",
              revision: "Rev A.1",
            });
          });

          context("Right side:", () => {
            it("Last save should not be present", () => {
              cy.get(`[data-cy="header-last-saved"]`).should("not.exist");
            });

            context("Verify three dot and send to Email option and functionality", () => {
              it("check three dots are visible", () => {
                cy.get(`[data-cy="HeaderMenuButton"]`).should("be.visible");
              });

              it("Verify on click of three dots menu should open", () => {
                cy.get(`[data-cy="HeaderMenuButton"]`).arrowClick();
                cy.get("[data-cy='exportToEmail']").contains("Send To Email").should("be.visible");
              });

              it("Verify Send To Email option should be visible", () => {
                cy.get("[data-cy='exportToEmail']").contains("Send To Email").should("be.visible");
                dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
              });

              it(`Send to email buttons → Verify it is functional and Verify popup message File will be sent to your 
              email shortly`, () => {
                cy.sendToEmailFromHeader();
                cy.checkToastMessageContains({
                  message: "File will be sent to your email shortly.",
                });
                cy.closeAllAlertMessages();
              });

              it("Get sent email", () => {
                const getEmailSetting =  {
                  to: CONFIG.TEST_EMAIL,
                  after: dateAfterEmailShouldArrive,
                  subject: `Export for document RD-00003`,
                };
                cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
                  expect(emails[0].subject).match(/Export for document RD-00003/);
                  expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
                });
              });
            });

            context("Verify three dots change owner option and functionality", () => {

              it("Check if 'Change Owner' button header menu and is functional", () => {
                cy.get("[data-cy='references-icon']").arrowClick();
                cy.get("#HeaderMenuButton").arrowClick();
                cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible").arrowClick();
                cy.get("#OwnerChangerPresenter-selectField").autocompleteSelect(USERS[2].name);
                cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
              });

              it(`Verify changed ${USERS[2].name}`, () => {
                cy.get("[data-cy='user-name']").should("have.text", USERS[2].name);
              });

              it("change owner back to company Admin", () => {
                cy.get("#HeaderMenuButton").arrowClick();
                cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible").arrowClick();
                cy.get("#OwnerChangerPresenter-selectField").autocompleteSelect(owner);
                cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
              });

              it(`Verify changed onwer ${owner}`, () => {
                cy.get("[data-cy='user-name']").should("have.text", owner);
              });
            });
          });

          context(`The status bar is GREEN(${Colors.latest_green_varient})`, () => {
            it(`Color of Header status bar is GREEN(${Colors.latest_green_varient})`, () => {
              cy.verifyStatusbarBgcolor({ bcolor: "rgb(13, 183, 141)" });
            });
          });

        });

        context("Scroll down the page → The status bar should be fixed", () => {
          it("Scroll down to the bottom of the page", () => {
            cy.get("#sm-tabpanel-0").find(".formOptionsBox").scrollIntoView();
            cy.get(`[data-cy="HeaderInfo"]`).should("be.visible");
          });
        });
      });

      context(
        `Update the record and select revision stage “Void” → Complete the voiding process until 
      the item goes to ${STATUS_TYPES_LABEL.VOIDED} state`,
        () => {

          it("Click on revision tab", () => {
            cy.get("[data-cy='note-icon']").arrowClick();
          });

          it("Open archive revision", () => {
            cy.get("[data-cy='DocumentRevisionList-item']").contains("Released").arrowClick();
          });

          it("Revise document with 'Void' option", () => {
            cy.drClickReviseDocument();
            cy.drChooseTypeOfRevisionChangeOption({ option: "Void" });
            cy.drClickCreateDocumentWithoutApiCall();
            cy.wait(3000);
            cy.get("[data-cy^=fb-approvals-fb-approvals-]").autocompleteSelect(`${USERS[1].name}`);
            cy.drApproveAndReleaseDialog();
            cy.get("[name=\"voidDescription\"]").arrowType("Voiding");
            cy.get("[data-cy=\"fb-control-btn\"]").last().arrowClick();
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });

          it("Approve the record", () => {
            cy.wait(3000);
            cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick();
            cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
            cy.unClick();
            cy.wrapWithWaitOnApiCalls(
              [CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview, CyRoutes.SessionDetails],
              () => {
                cy.get("[data-cy=\"common.confirm\"]").arrowClick();
              }
            );
            cy.checkToastMessage({ exists: false });
            cy.listLoadingElementShouldNotExist();
          });
        }
      );

      context("Check the content of the status bar", () => {
        it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
          cy.verifyHeaderInfoContent({
            status: STATUS_TYPES_LABEL.VOIDED,
            title: "Records",
            docId: "RD-00003",
            revision: "Rev Void",
          });
        });

        context(`The status bar is RED(${Colors.latest_red_varient})`, () => {
          it(`Color of Header status bar is RED(${Colors.latest_red_varient})`, () => {
            cy.verifyStatusbarBgcolor({ bcolor: "rgb(236, 43, 0)" });
          });
        });

        context("Right side:", () => {
          it("Last save should not be present", () => {
            cy.get(`[data-cy="header-last-saved"]`).should("not.exist");
          });

          it("Check if 'Change Owner' button header menu and is functional", () => {
            cy.get("#HeaderMenuButton").arrowClick();
            cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible").arrowClick();
            cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
          });

          it(`Send to email buttons → Verify it is functional and Verify popup message File will be sent to your 
          email shortly`, () => {
            cy.get("#HeaderMenuButton").arrowClick();
            cy.get("[data-cy=\"exportToEmail\"]").contains("Send To Email").arrowClick();
            cy.checkToastMessageContains({
              message: "File will be sent to your email shortly.",
            });
            cy.closeAllAlertMessages();
          });
        });
      });

      context("Scroll down the page → The status bar should be fixed", () => {
        it("Scroll down to the bottom of the page", () => {
          cy.get(`[data-cy="HeaderInfo"]`).should("be.visible");
        });
      });
    });
  }
);

export { };

