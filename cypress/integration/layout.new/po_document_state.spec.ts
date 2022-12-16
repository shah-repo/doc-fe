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

const reference = {
  value: "FM-00001",
  valueCode: "FM-00001",
};

context(`Scenario 2.1 Status bar design of new items approved via approval block (PO).`, () => {
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

  context(`Create a new form with an output of internal type PO`, () => {
    context("Create PO with form", () => {
      context("Start document creation flow", () => {
        it("Navigates to document list", () => {
          cy.navigToDocumentList();
        });

        it("Clicks on 'create a document' button", () => {
          cy.cmpClickCreateNewDocument();
        });
      });

      context("Fill in Form attributes", () => {
        it("Enters title 'PO Form Title'", () => {
          cy.drEnterDocumentTitle({ name: "PO Form Title" });
        });

        it("Enters description 'PO Form description'", () => {
          cy.drEnterDocumentDescription({ description: "PO Form description" });
        });

        it("Select 'Form' document type from dropdown", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Purchase Order' output document type from dropdown", () => {
          cy.drSelectOutputDocumentType({ documentType: "Purchase Order" });
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

    context(`Create New → The record will be in ${STATUS_TYPES_LABEL.DRAFT} state`, () => {
      it("Click on Create New button", () => {
        cy.fbClickButton({ el: "PreviewControlsContainer-createNew" });
      });
    });

    context("Check the content of the status bar", () => {
      it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.DRAFT,
          title: "Purchase Orders",
          docId: "PO-00001",
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

        it("Enter title", () => {
          cy.drEnterDocumentDescription({ description: "Purchase order document" });
        });

        it(`Save → Verify it is functional and the Check Auto-saving, please wait… is present)`, () => {
          cy.wrapWithWaitOnApiCalls([], () => {
            cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
            cy.get(`[data-cy="header.autoSaving"]`).should("have.text", "Auto-saving, please wait…");
          });
        });

        it("Last save should be present", () => {
          cy.listLoadingElementShouldNotExist();
          cy.get(`[data-cy="header-last-saved"]`).should("have.text", "Last saved a few seconds ago");
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
            cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
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
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.drSelectReferences(reference.value);
        });
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Add Required Fields", () => {
      it(`Select '${USERS[1].name}' for Requestor`, () => {
        cy.get("[data-cy='po-requestor-autocomplete']").arrowClick({ force: true });
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("ul>li[role=option]").contains(USERS[2].name).arrowClick();
        });
        cy.listLoadingElementShouldNotExist().wait(2000);
      });

      it("Add Required Date", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[name=\"po-order-date\"]").next().find("button").arrowClick();
          cy.get(".MuiPickersDay-daySelected").arrowClick();
        });
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Add an approver and submit for approval → The record will be in “In Review”", () => {
      it("Add Approver to approvals list", () => {
        cy.wait(3000);
        cy.get("[data-cy^=fb-po-approvals-]").autocompleteSelect(USERS[1].name);
        cy.listLoadingElementShouldNotExist();
      });

      it("Click on Submit For Approval", () => {
        cy.pmSubmitForApprovalWithoutAPI();
      });
    });

    context("Check the content of the status bar", () => {
      it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.PENDING_APPROVAL,
          title: "Purchase Orders",
          docId: "PO-00001",
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

        it("Click 'Withdraw Submission' button", () => {
          cy.get("[data-cy=\"document.revision.withdraw.alert\"]").arrowClick();
          cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevPreview], () => {
            cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
          });
        });

        it("Click on Submit For Approval", () => {
          cy.wait(3000);
          cy.pmSubmitForApprovalWithoutAPI();
        });
      });
    });

    context("Scroll down the page → The status bar should be fixed", () => {
      it("Scroll down to the bottom of the page", () => {
        cy.get("#sm-tabpanel-0").find(".formOptionsBox").scrollIntoView();
        cy.get(`[data-cy="HeaderInfo"]`).should("be.visible");
      });
    });

    context("Approve the PO → The PO is in the Released status", () => {
      it("Approve the PO", () => {
        cy.ebApproveWithoutApi();
      });
    });

    context("Check the content of the status bar", () => {
      it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
        cy.verifyHeaderInfoContent({
          title: "Purchase Orders",
          docId: "PO-00001",
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

        it("Check if 'Change Owner' button header menu and is functional", () => {
          cy.get("#HeaderMenuButton").arrowClick();
          cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible").arrowClick();
          cy.get("[data-cy=\"changeOwner-submit\"]").arrowClick();
        });

        context(`Update the PO and release the new revision`, () => {
          it("Check if 'Revise PO' button header menu and is functional", () => {
            cy.get("[data-cy=\"updateRecord\"]").should("be.visible").arrowClick();
          });

          it("Add Approver to approvals list", () => {
            cy.drClickCreateDocumentWithoutApiCall();
            cy.wait(3000);
            cy.get("[data-cy^='fb-po-approvals-']").autocompleteSelect(USERS[1].name);
            cy.listLoadingElementShouldNotExist();
          });

          it("Click on Submit For Approval", () => {
            cy.pmSubmitForApproval();
          });

          it("Approve the PO", () => {
            cy.ebApproveWithoutApi();
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

    context(`Update the PO and release the new revision`, () => {
      it("Check if 'Update PO' button header menu and is functional", () => {
        cy.get("[data-cy=\"updateRecord\"]").should("be.visible").arrowClick();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add Approver to approvals list", () => {
        cy.drClickCreateDocumentWithoutApiCall();
        cy.wait(3000);
        cy.get("[data-cy^=fb-po-approvals-]").scrollIntoView();
        cy.get("[data-cy^=fb-po-approvals-]").autocompleteSelect(USERS[1].name);
        cy.listLoadingElementShouldNotExist();
      });

      it("Click on Submit For Approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve the PO", () => {
        cy.ebApproveWithoutApi();
      });
    });

    context(
      `Update the PO and select revision stage “Void” → Complete the voiding process until 
      the item goes to ${STATUS_TYPES_LABEL.VOIDED} state`,
      () => {
        it("Revise document with 'Void' option", () => {
          cy.wait(3000);
          cy.drClickReviseDocument();
          cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
          cy.listLoadingElementShouldNotExist();
          cy.drChooseTypeOfRevisionChangeOption({ option: "Void" });
          cy.drClickCreateDocumentWithoutApiCall();
          cy.wait(3000);
          cy.get("[data-cy^=fb-po-approvals-]").scrollIntoView();
          cy.get("[data-cy^=fb-po-approvals-]").autocompleteSelect(`${USERS[1].name}`);
          cy.listLoadingElementShouldNotExist();
          cy.wait(2000);
          cy.drApproveAndReleaseDialog();
          cy.get("[name=\"voidDescription\"]").arrowType("Voiding");
          cy.get("[data-cy=\"fb-control-btn\"]").last().arrowClick();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Approve the record", () => {
          cy.ebApproveWithoutApi();
        });
      }
    );

    context("Check the content of the status bar", () => {
      it("Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.VOID,
          title: "Purchase Orders",
          docId: "PO-00001",
          revision: "Rev OBS",
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

