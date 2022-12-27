import "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import Colors from "../../../src/ui/layout/theme/utils/colors";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { ReceivableTest } from "../../utils/constants/documentTypes/receivable";
import { RecordDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { TrainingCurriculum } from "../../utils/constants/documentTypes/trainingCurriculum";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let developersGroup;
let adminSessionId;
let adminEmployee;
let employeeToDevs;
let dateAfterEmailShouldArrive;

const reference = {
  value: "FM-00001",
  valueCode: "FM-00001",
};

const owner = USERS[1].name;
const dateOffset = (5 * 1000);

const verifyEmail = () => {

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
      subject: `Export for document RCT-00001`,
    };
    cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
      expect(emails[0].subject).match(/Export for document RCT-00001/);
      expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
    });
  });

};

const verifyChangeOwner = () => {
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
};

context(`Scenario 2.1 Status bar design of new items approved via approval block (RC).`, () => {
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
            documentTypes: [RecordDocumentType, ReceivableTest, TrainingCurriculum],
          },
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          employeeToDevs = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          done();
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

  context(`Create a new form with an output of internal type Receivable`, () => {
    context("Create Receivable with form", () => {
      context("Start document creation flow", () => {
        it("Navigates to document list", () => {
          cy.navigToDocumentList();
        });

        it("Clicks on 'create a document' button", () => {
          cy.cmpClickCreateNewDocument();
        });
      });

      context("Fill in Form attributes", () => {
        it("Enters title 'Receivable Form Title'", () => {
          cy.drEnterDocumentTitle({ name: "Receivable Form Title" });
        });

        it("Enters description 'Receivable Form description'", () => {
          cy.drEnterDocumentDescription({ description: "Receivable Form description" });
        });

        it("Select 'Form' document type from dropdown", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'ReceivableTest' output document type from dropdown", () => {
          cy.drSelectOutputDocumentType({ documentType: "Receivable test" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });

      context("Approve and Release Form", () => {
        it("Approve and Release document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });

    context(`Create New → The Receiving will be in ${STATUS_TYPES_LABEL.WIP}. state`, () => {
      it("Click on Create New button", () => {
        cy.fbClickButton({ el: "PreviewControlsContainer-createNew" });
      });
    });

    context("Check the content of the status bar", () => {
      it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.WIP,
          title: "Receiving",
          docId: "RCT-00001",
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

        it("Make a change 'Add Approver'", () => {
          cy.pmAddApproverOnApproverList({ approver: owner });
        });

        it("Verify Status bar displays “Last saved a few seconds ago", () => {
          cy.get(`[data-cy="header-last-saved"]`).should("have.text", "Last saved a few seconds ago");
        });

        it("Turn on autosave", () => {
          cy.cmpTurnOnAutosave();
        });

        it("Make a change 'Remove Approver'", () => {
          cy.get(`[class*="MuiChip-root MuiAutocomplete-tag MuiChip-deletable"] div`).contains(owner)
            .parent().parent().find("svg").arrowClick({ force: true });
        });

        it("Make a change Upload attachement picture 'dummy.pdf'", () => {
          cy.atchUploadAttachment({ fileName: "dummy.pdf" });
          cy.progressBarShouldNotExist();
          cy.landingPageLoadingElementShouldNotExist();
        });

        it(`Verify auto save is functional and the Check Auto-saving, please wait… is present)`, () => {
          cy.get(`[data-cy="header.autoSaving"]`).should("have.text", "Auto-saving, please wait…");
        });

        it("Wait for 2 min. It should display “Last saved 2 min ago”", () => {
          cy.wait(120000);
          cy.get(`[data-cy="header-last-saved"]`).should("have.text", "Last saved 2 minutes ago");
        });

        context("Edit all the fields, and make sure the “last saved” data is updated each time", () => {

          it("Make a change Upload attachement picture 'image.jpg'", () => {
            cy.atchUploadAttachment({ fileName: "image.jpg" });
            cy.progressBarShouldNotExist();
            cy.landingPageLoadingElementShouldNotExist();
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

        context("Verify three dot and send to Email option and its functional", () => {
          verifyEmail();
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
          verifyChangeOwner();
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

    context(
      `Add an approver and submit for approval → The record will be in 
      ${STATUS_TYPES_LABEL.PENDING_APPROVAL}`,
      () => {
        it("Add Approver to approvals list", () => {
          cy.pmAddApproverOnApproverList({ approver: owner });
        });

        it("Click on Submit For Approval", () => {
          cy.pmSubmitForApproval();
        });
      }
    );

    context("Check the content of the status bar", () => {
      it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.PENDING_APPROVAL,
          title: "Receiving",
          docId: "RCT-00001",
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

        context("Verify three dot and send to Email option and its functional", () => {
          verifyEmail();
        });

        context(
          `Three dots: Clicking on it opens a menu where the  “Change Owner” options are displayed → 
          Verify they’re functional`,
          () => {
            verifyChangeOwner();
          });

        it("Click 'Withdraw Submission' button", () => {
          cy.get("[data-cy=\"document.revision.withdraw.alert\"]").arrowClick();
          cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
          cy.listLoadingElementShouldNotExist();
          cy.progressBarShouldNotExist();
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

    context("Approve Receiving → The Receiving is in the Released status", () => {
      it("Approve the record", () => {
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

      it(`The Receiving is in the ${STATUS_TYPES_LABEL.RELEASED}  state`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      });
    });

    context("Check the content of the status bar", () => {
      it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.RELEASED,
          title: "Receiving",
          docId: "RCT-00001",
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

        context("Verify three dot and send to Email option and its functional", () => {
          verifyEmail();
        });

        context(
          `Three dots: Clicking on it opens a menu where the  “Change Owner” options are displayed → 
          Verify they’re functional`,
          () => {
            verifyChangeOwner();
          });

        context(`Update Receiving and release the new revision`, () => {
          it("Check if 'Update Record' button header menu and is functional", () => {
            cy.get("[data-cy=\"updateRecord\"]").should("be.visible").arrowClick();
            cy.listLoadingElementShouldNotExist();
            cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").should("be.visible").arrowClick();
          });

          it("Add Approver to approvals list", () => {
            cy.wait(3000);
            cy.pmAddApproverOnApproverList({ approver: owner });
          });

          it("Click on Submit For Approval", () => {
            cy.pmSubmitForApproval();
          });

          it("Approve the Receiving", () => {
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

    context(`Update the Receiving and release the new revision`, () => {
      it("Check if 'Update Record' button header menu and is functional", () => {
        cy.get("[data-cy=\"updateRecord\"]").should("be.visible").arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").should("be.visible").arrowClick();
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
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview, CyRoutes.SessionDetails], () => {
          cy.get("[data-cy=\"common.confirm\"]").arrowClick();
        });
        cy.checkToastMessage({ exists: false });
        cy.listLoadingElementShouldNotExist();
      });
    });

    context(
      `Update the Receiving and select revision stage “Void” → Complete the voiding process until 
      the item goes to ${STATUS_TYPES_LABEL.VOID} state`,
      () => {
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

        it("Approve the Receiving", () => {
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
          status: STATUS_TYPES_LABEL.VOID,
          title: "Receiving",
          docId: "RCT-00001",
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

        context("Verify three dot and send to Email option and its functional", () => {
          verifyEmail();
        });

        context(
          `Three dots: Clicking on it opens a menu where the  “Change Owner” options are displayed → 
          Verify they’re functional`,
          () => {
            verifyChangeOwner();
          });
      });
    });

    context("Scroll down the page → The status bar should be fixed", () => {
      it("Scroll down to the bottom of the page", () => {
        cy.get(`[data-cy="HeaderInfo"]`).should("be.visible");
      });
    });
  });
});

export { };

