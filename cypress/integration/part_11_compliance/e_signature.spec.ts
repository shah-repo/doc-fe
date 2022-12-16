// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import faker from "faker";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let companyAdmin;
let componentSpecificationDocumentType;
let group;
let approvalRequestDocumentType;
let createdDocumentRevResponse;
let initialArDocument;
const documentRevisionName = "New document for testing Approval Request list";
const newNameFirstApprover = "Approver One";
const newNameSecondApprover = "Approver Two";
const newNameThirdApprover = "User Three";
const newNameThirdApproverSecondTime = "User Three Point Two";
const nameOfFirstUserToSignUp = faker.name.findName();
const emailOfFirstUserToSignUp =
`enlil.testmail+${faker.fake("{{address.zipCode}}{{internet.userName}}")}@gmail.com`.toLocaleLowerCase();
const nameOfSecondUserToSignUp = faker.name.findName();
const emailOfSecondUserToSignUp =
`enlil.testmail+${faker.fake("{{address.zipCode}}{{internet.userName}}")}@gmail.com`.toLocaleLowerCase();
const nameOfThirdUserToSignUp = faker.name.findName();
const emailOfThirdUserToSignUp =
`enlil.testmail+${faker.fake("{{address.zipCode}}{{internet.userName}}")}@gmail.com`.toLocaleLowerCase();

context("E-signature test", () => {
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
              ClinicalProtocolDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          companyAdmin = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          componentSpecificationDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Clinical Protocol");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
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

    it("[API]Create document revisions for e-signature test", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: companyAdmin.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Test Doc Rev Description</p>",
            document: {
              docId: "CP-00004",
              documentType: {
                id: componentSpecificationDocumentType[0].id,
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
            name: documentRevisionName,
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,

          },
          employeeId: companyAdmin.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdDocumentRevResponse = response;
          done();
        });
      });
    });

    it("[API]Create change orders for created document revisions", () => {
      cy.arGetArDocumentByName({
        sessionId: loginResponse.sessionId,
        employeeId: companyAdmin.id,
        name: "AR Form",
      }).then((response) => {
        initialArDocument = response;
        cy.arCreateApprovalRequest({
          payload: {
            title: "Approval for esignature",
            description: "Description for Approval Request",
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            formInput: {
              documentRevisions: [{
                proposedDocumentRevision: { id: createdDocumentRevResponse.id },
                descriptionOfChange: "ar test",
                justificationOfChange: "ar test",
                id: faker.random.uuid(),
              }],
            },
          },
          employeeId: companyAdmin.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        });
      });
    });
  });

  context("Login in admin user", () => {
    it("Login in admin user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: companyAdmin.id });
    });
  });

  context("Start creation of first approver", () => {
    it("Navigate to User management", () => {
      cy.usrNavigateToUserManagement();
    });

    it("Click 'ADD EMPLOYEE'", () => {
      cy.usrClickAddEmployee();
    });

    it("Enters e-mail", () => {
      cy.usrEnterEmail({ email: emailOfFirstUserToSignUp });
    });

    it("Enters name", () => {
      cy.usrEnterName({ name: nameOfFirstUserToSignUp });
    });

    it("Clicks the save button", () => {
      cy.usrClickSaveButton();
      cy.checkToastMessage({ exists: false });
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Logout user", () => {
      cy.authLogout();
    });
  });

  context("Activate first user", () => {
    it("Verify activation email", () => {
      cy.imapGetActivationLink({ userEmail: emailOfFirstUserToSignUp });
    });

    it("Enter password", () => {
      cy.authEnterSignUpPassword();
    });

    it("Enter password for confirmation", () => {
      cy.authEnterSignUpConfirmPassword();
    });

    it("Click 'SIGN IN'", () => {
      cy.authClickSignIn();
    });

    it("Logout user", () => {
      cy.authLogout();
    });
  });

  context("Login in admin user", () => {
    it("Login in admin user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: companyAdmin.id });
    });
  });

  context("Start creation of second approver", () => {
    it("Navigate to User management", () => {
      cy.usrNavigateToUserManagement();
    });

    it("Click 'ADD EMPLOYEE'", () => {
      cy.usrClickAddEmployee();
    });

    it("Enters e-mail", () => {
      cy.usrEnterEmail({ email: emailOfSecondUserToSignUp });
    });

    it("Enters name", () => {
      cy.usrEnterName({ name: nameOfSecondUserToSignUp });
    });

    it("Clicks the save button", () => {
      cy.usrClickSaveButton();
      cy.checkToastMessage({ exists: false });
    });

    it("Logout user", () => {
      cy.authLogout();
    });
  });

  context("Activate second user", () => {
    it("Verify activation email", () => {
      cy.imapGetActivationLink({ userEmail: emailOfSecondUserToSignUp });
    });

    it("Enter password", () => {
      cy.authEnterSignUpPassword();
    });

    it("Enter password for confirmation", () => {
      cy.authEnterSignUpConfirmPassword();
    });

    it("Click 'SIGN IN'", () => {
      cy.authClickSignIn();
    });

    it("Logout user", () => {
      cy.authLogout();
    });
  });

  context("Login in admin user", () => {
    it("Login in admin user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: companyAdmin.id });
    });
  });

  context("Start creation of third approver", () => {
    it("Navigate to User management", () => {
      cy.usrNavigateToUserManagement();
    });

    it("Click 'ADD EMPLOYEE'", () => {
      cy.usrClickAddEmployee();
    });

    it("Enters e-mail", () => {
      cy.usrEnterEmail({ email: emailOfThirdUserToSignUp });
    });

    it("Enters name", () => {
      cy.usrEnterName({ name: nameOfThirdUserToSignUp });
    });

    it("Clicks the save button", () => {
      cy.usrClickSaveButton();
      cy.checkToastMessage({ exists: false });
    });

    it("Logout user", () => {
      cy.authLogout();
    });
  });

  context("Activate third user", () => {
    it("Verify activation email", () => {
      cy.imapGetActivationLink({ userEmail: emailOfThirdUserToSignUp });
    });

    it("Enter password", () => {
      cy.authEnterSignUpPassword();
    });

    it("Enter password for confirmation", () => {
      cy.authEnterSignUpConfirmPassword();
    });

    it("Click 'SIGN IN'", () => {
      cy.authClickSignIn();
    });

    it("Logout user", () => {
      cy.authLogout();
    });
  });

  context("Login in admin user", () => {
    it("Login in admin user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: companyAdmin.id });
    });
  });

  context("Add approvers to AR", () => {
    it("Navigate to Approval Request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Select AR document", () => {
      cy.arClearFilters();
      cy.alFilterByArId({ arId: "AR-00001" });
      cy.arSelectFirstDocument();
    });

    it("Verify email adress and full name is displayed", () => {
      cy.get("[data-cy=\"fb-approvers-approvers\"]").arrowClick();
      cy.get("ul>li[role=option]").should("contain.text", nameOfFirstUserToSignUp);
      cy.get("ul>li[role=option]").should("contain.text", nameOfSecondUserToSignUp);
      cy.get("ul>li[role=option]").should("contain.text", nameOfThirdUserToSignUp);
      cy.get("ul>li[role=option]").should("contain.text", emailOfFirstUserToSignUp);
      cy.get("ul>li[role=option]").should("contain.text", emailOfSecondUserToSignUp);
      cy.get("ul>li[role=option]").should("contain.text", emailOfThirdUserToSignUp);
      cy.unClick();
    });

    it("Add approvers to Approval Request on approver list", () => {
      cy.arAddApproverOnApproverList({ approver: emailOfFirstUserToSignUp });
      cy.wait(1000);
      cy.arAddApproverOnApproverList({ approver: emailOfSecondUserToSignUp });
      cy.wait(1000);
      cy.arAddApproverOnApproverList({ approver: emailOfThirdUserToSignUp });
      cy.unClick();
      cy.wait(5000);
    });

    it("Send to review", () => {
      cy.arClickSendToReview();
    });
  });

  context("Create EB document and add approvers", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'Create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title 'Form document for procedure'", () => {
      cy.drEnterDocumentTitle({ name: "Form document for EB" });
    });

    it("Enters description 'EB form description'", () => {
      cy.drEnterDocumentDescription({ description: "EB form description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Selects 'Engineering Build' output document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "Engineering Build" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Click create new document from FORM", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title 'EB document'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.drEnterDocumentTitle({ name: "EB document" });
      });
    });

    it("Enters description 'EB description'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.drEnterDocumentDescription({ description: "EB description" });
      });
    });

    it("Add first approver to EB document", () => {
      cy.pmAddApproverOnApproverList({ approver: emailOfFirstUserToSignUp });
      cy.wait(1000);
      cy.pmAddApproverOnApproverList({ approver: emailOfSecondUserToSignUp });
      cy.wait(1000);
      cy.pmAddApproverOnApproverList({ approver: emailOfThirdUserToSignUp });
      cy.wait(1000);
    });

    it("Submit for Approval", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview, CyRoutes.DocRevPreview], () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      });
    });

    it("Logout user", () => {
      cy.authLogout();
    });
  });

  context("Login in first user and approve AR and EB", () => {
    it("Login in first user to dashboard", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails], () => {
        cy.authLogin({ email: emailOfFirstUserToSignUp });
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Approve AR and EB`, () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover").wait(500);
      cy.get(`[data-cy="transition-approve"]`).first().trigger("mouseover").wait(500);

      cy.get(`[data-cy="transition-approve"]`).first().arrowClick();
      cy.get(`[data-cy="transition.action.password"]`).arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.wrapWithWaitOnApiCalls([CyRoutes.ChangeRequestApprove, CyRoutes.PostDashboardFeedSearch], () => {
        cy.get(`[data-cy="passwordConfirm"]`).arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover").wait(1000);
      cy.get(`[data-cy="transition-approve"]`).first().trigger("mouseover");
      cy.get(`[data-cy="transition-approve"]`).first().arrowClick();
      cy.get(`[data-cy="transition.action.password"]`).arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.wrapWithWaitOnApiCalls([CyRoutes.ChangeRequestApproveNew],
        () => {
          cy.get(`[data-cy="passwordConfirm"]`).arrowClick();
        });
      cy.progressBarShouldNotExist();
    });

    context("Change name of first approver", () => {
      it("Click on User menu button", () => {
        cy.get("[data-cy=\"UserMenuButton\"]").arrowClick();
      });

      it("Click on 'My Profile'", () => {
        cy.contains("My profile").arrowClick();
      });

      it("Change name of user", () => {
        cy.get("[id=\"DialogContent-showEdit\"]").arrowClick();
        cy.get("[id=\"DialogTitle-nameEdit\"]").clear().arrowType(newNameFirstApprover);
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchUsersMe], () => {
          cy.get("[id=\"DialogContent-updateProfile\"]").arrowClick();
        });
        cy.get("#DialogContent-close").arrowClick();
      });

      it("Logout user", () => {
        cy.authLogout();
      });
    });
  });

  context("Login in second user and approve AR and EB", () => {
    it("Login in second user to dashboard", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails], () => {
        cy.authLogin({ email: emailOfSecondUserToSignUp });
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve AR and EB", () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover");
      cy.get(`[data-cy="transition-approve"]`).first().trigger("mouseover");
      cy.get(`[data-cy="transition-approve"]`).first().arrowClick();
      cy.get(`[data-cy="transition.action.password"]`).arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.wrapWithWaitOnApiCalls([CyRoutes.ChangeRequestApprove, CyRoutes.PostDashboardFeedSearch],
        () => {
          cy.get(`[data-cy="passwordConfirm"]`).arrowClick();
        });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover");
      cy.get(`[data-cy="transition-approve"]`).first().trigger("mouseover");
      cy.get(`[data-cy="transition-approve"]`).first().arrowClick();
      cy.get(`[data-cy="transition.action.password"]`).arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.wrapWithWaitOnApiCalls([CyRoutes.ChangeRequestApproveNew],
        () => {
          cy.get(`[data-cy="passwordConfirm"]`).arrowClick();
        });
      cy.progressBarShouldNotExist();
    });

    context("Change name of second approver", () => {
      it("Click on User menu button", () => {
        cy.get("[data-cy=\"UserMenuButton\"]").arrowClick();
      });

      it("Click on 'My Profile'", () => {
        cy.contains("My profile").arrowClick();
      });

      it("Change name of user", () => {
        cy.get("[id=\"DialogContent-showEdit\"]").arrowClick();
        cy.get("[id=\"DialogTitle-nameEdit\"]").clear().arrowType(newNameSecondApprover);
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchUsersMe], () => {
          cy.get("[id=\"DialogContent-updateProfile\"]").arrowClick();
        });
        cy.get("#DialogContent-close").arrowClick();
      });

      it("Logout user", () => {
        cy.authLogout();
      });
    });
  });

  context("Login in third user and approve AR and EB", () => {
    it("Login in third user to dashboard", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails], () => {
        cy.authLogin({ email: emailOfThirdUserToSignUp });
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    context("Navigate to AR and confirm old names of approver one and two are present", () => {
      it("Navigate to Approval Request list", () => {
        cy.wait(3000);
        cy.navigToApprovalRequestList();
      });

      it("Select AR document", () => {
        cy.arClearFilters();
        cy.alFilterByArId({ arId: "AR-00001" });
        cy.arSelectFirstDocument();
      });

      it("Verify old names of approvers are present", () => {
        cy.get("[data-cy=\"SummaryBaseProps-values\"]").contains(nameOfFirstUserToSignUp);
        cy.get("[data-cy=\"SummaryBaseProps-values\"]").contains(nameOfSecondUserToSignUp);
      });
    });

    context("Navigate to EB and confirm old names of approver one and two are present", () => {
      it("Navigate to records list", () => {
        cy.navigToRecords();
      });

      it("Select EB document", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "EB-00001" });
        cy.ebSelectFirstDocument();
      });

      it("Verify old names of approvers are present", () => {
        SystemRequirement("REQ-4090");
        cy.get("[id=\"Presenter-FBWorkspace\"]").contains(nameOfFirstUserToSignUp);
        cy.get("[id=\"Presenter-FBWorkspace\"]").contains(nameOfSecondUserToSignUp);
      });
    });

    context("Change name of third approver", () => {
      it("Click on User menu button", () => {
        cy.get("[data-cy=\"UserMenuButton\"]").arrowClick();
      });

      it("Click on 'My Profile'", () => {
        cy.contains("My profile").arrowClick();
      });

      it("Change name of user", () => {
        cy.get("[id=\"DialogContent-showEdit\"]").arrowClick();
        cy.get("[id=\"DialogTitle-nameEdit\"]").clear().arrowType(newNameThirdApprover);
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchUsersMe], () => {
          cy.get("[id=\"DialogContent-updateProfile\"]").arrowClick();
        });
        cy.get("#DialogContent-close").arrowClick();
      });
    });

    context("Approve AR and EB", () => {
      it("Approve AR and EB", () => {
        cy.wait(3000);
        cy.grpNavigateToDashboard();
        cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover");
        cy.get(`[data-cy="transition-approve"]`).first().trigger("mouseover");
        cy.get(`[data-cy="transition-approve"]`).first().arrowClick();
        cy.get(`[data-cy="transition.action.password"]`).arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.ChangeRequestApprove, CyRoutes.PostDashboardFeedSearch], () => {
            cy.get(`[data-cy="passwordConfirm"]`).arrowClick();
          });
        cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover");
        cy.get(`[data-cy="transition-approve"]`).first().trigger("mouseover");
        cy.get(`[data-cy="transition-approve"]`).first().arrowClick();
        cy.get(`[data-cy="transition.action.password"]`).arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.wrapWithWaitOnApiCalls([CyRoutes.ChangeRequestApproveNew],
          () => {
            cy.get(`[data-cy="passwordConfirm"]`).arrowClick();
          });
        cy.progressBarShouldNotExist();
      });
    });

    context("Navigate to AR and confirm it's approved by thrid approver and that user and mail is correct", () => {
      it("Navigate to Approval Request list", () => {
        cy.navigToApprovalRequestList();
      });

      it("Select AR document", () => {
        cy.arClearFilters();
        cy.alFilterByArId({ arId: "AR-00001" });
        cy.arSelectFirstDocument();
      });

      it("Verify correct names and emails of approvers are present", () => {
        SystemRequirement("REQ-4090");
        cy.get("[data-cy=\"SummaryBaseProps-values\"]").contains(nameOfFirstUserToSignUp);
        cy.get("[data-cy=\"SummaryBaseProps-values\"]").contains(nameOfSecondUserToSignUp);
        cy.get("[data-cy=\"SummaryBaseProps-values\"]").contains(newNameThirdApprover);
        cy.get("[data-cy=\"SummaryBaseProps-values\"]").contains(emailOfFirstUserToSignUp);
        cy.get("[data-cy=\"SummaryBaseProps-values\"]").contains(emailOfSecondUserToSignUp);
        cy.get("[data-cy=\"SummaryBaseProps-values\"]").contains(emailOfThirdUserToSignUp);
      });
    });

    context("Navigate to EB and confirm it's approved by thrid approver and that user and mail is correct", () => {
      it("Navigate to records list", () => {
        cy.navigToRecords();
      });

      it("Select EB document", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "EB-00001" });
        cy.ebSelectFirstDocument();
      });

      it("Verify correct names and emails of approvers are present", () => {
        cy.get("[id=\"Presenter-FBWorkspace\"]").contains(nameOfFirstUserToSignUp);
        cy.get("[id=\"Presenter-FBWorkspace\"]").contains(nameOfSecondUserToSignUp);
        cy.get("[id=\"Presenter-FBWorkspace\"]").contains(newNameThirdApprover);
        cy.get("[id=\"Presenter-FBWorkspace\"]").contains(emailOfFirstUserToSignUp);
        cy.get("[id=\"Presenter-FBWorkspace\"]").contains(emailOfSecondUserToSignUp);
        cy.get("[id=\"Presenter-FBWorkspace\"]").contains(emailOfThirdUserToSignUp);
      });
    });

    context("Change name of third approver again", () => {
      it("Click on User menu button", () => {
        cy.get("[data-cy=\"UserMenuButton\"]").arrowClick();
      });

      it("Click on 'My Profile'", () => {
        cy.contains("My profile").arrowClick();
      });

      it("Change name of user", () => {
        cy.get("[id=\"DialogContent-showEdit\"]").arrowClick();
        cy.get("[id=\"DialogTitle-nameEdit\"]").clear().arrowType(newNameThirdApproverSecondTime);
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchUsersMe], () => {
          cy.get("[id=\"DialogContent-updateProfile\"]").arrowClick();
        });
        cy.get("#DialogContent-close").arrowClick();
      });

      it("Revise EB", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev, CyRoutes.GetRequiredApproversDocRev], () => {
          cy.get("[data-cy=\"updateRecord\"]").arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click on revisions tab on side panel", () => {
        cy.drClickRevisionsSidePanel();
      });

      it("Check user names and emails of approvers on old revision are not changed", () => {
        SystemRequirement("REQ-4060");
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.GetRequiredApproversDocRev], () => {
          cy.get("[data-cy=\"DocumentRevisionList-item\"]").contains("Released").arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.get("[id=\"Presenter-FBWorkspace\"]").contains(nameOfFirstUserToSignUp);
        cy.get("[id=\"Presenter-FBWorkspace\"]").contains(nameOfSecondUserToSignUp);
        cy.get("[id=\"Presenter-FBWorkspace\"]").contains(newNameThirdApprover);
        cy.get("[id=\"Presenter-FBWorkspace\"]").contains(emailOfFirstUserToSignUp);
        cy.get("[id=\"Presenter-FBWorkspace\"]").contains(emailOfSecondUserToSignUp);
        cy.get("[id=\"Presenter-FBWorkspace\"]").contains(emailOfThirdUserToSignUp);
      });

      it("Click on revisions tab on side panel", () => {
        cy.drClickRevisionsSidePanel();
      });

      it("Go back to new revision of EB, add approver", () => {
        cy.get("[data-cy=\"DocumentRevisionList-item\"]").contains("WIP").arrowClick();
        cy.pmAddApproverOnApproverList({ approver: emailOfFirstUserToSignUp });
        cy.wait(1000);
        cy.pmAddApproverOnApproverList({ approver: emailOfSecondUserToSignUp });
        cy.wait(1000);
        cy.pmAddApproverOnApproverList({ approver: emailOfThirdUserToSignUp });
        cy.wait(1000);
        cy.unClick();
      });

      it("Release EB and check if correct new name is shown", () => {
        cy.progressBarShouldNotExist();
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        cy.wait(7000);
        cy.landingPageLoadingElementShouldNotExist();
        cy.get("[data-cy=\"form.builder.request.approve\"]").arrowClick();
        cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.get("[data-cy=\"common.confirm\"]").arrowClick();
        cy.wait(7000);
        cy.progressBarShouldNotExist();
        cy.get("[id=\"Presenter-FBWorkspace\"]").contains(newNameThirdApproverSecondTime);
      });
    });
  });
});
