// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { SystemRequirement } from "../../utils/context/systemRequirement";

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

const runId = new Date().valueOf();
let company;

const groupOne = "Group One";
const groupTwo = "Group Two";

const memberAdmin = "Zoran";
const memberSecond = "Second";
const memberThird = "Third";
const individualMember = "Importer Admin";

const FormTitle = "New Form";
const DAMTitle = "My DAM";
const DDTitle = "Test DD";

const roleOne = "Role One";
const roleTwo = "Role Two";
const individualRole = "Role Three";

context("Document Approval Matrix Flow", () => {

  context("[API] Prepare company", () => {
    it("[API] Creates company", (done: any) => {
      cy.authApiLogin({
        email: "zoran.kovacevic+admin@codecons.com",
        password: "Tester1!",
      }).then((response: any) => {

        cy.cmpCreateCompany({
          payload: {
            companyAcronym: `T1${runId}`,
            companyAdminEmail: "zoran.kovacevic+admin@codecons.com",
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: `enlil.testmail+cy5@gmail.com`,
            maxRevisionStages: 3,
            name: `Test Company ${runId}`,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [{
              name: "Second Tester",
              email: "enlil.testmail+cy2@gmail.com",
            },
            {
              name: "Third Tester",
              email: "enlil.testmail+cy3@gmail.com",
            },
            {
              name: "Fourth Tester",
              email: "enlil.testmail+cy4@gmail.com",
            }],
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
            whiteLabeling: null,
            documentTypes: [],
          }, sessionId: response.sessionId,
        }).then((response) => {
          company = response;
          done();
        });
      });
    });
  })

  context("Log in user, select company and open 'Group Management'", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: "zoran.kovacevic+admin@codecons.com",
        password: "Tester1!",
      });
    });

    it("Selects company", () => cy.cmpSelectCompany({ name: company.name, multiple: true }));

    context("Open 'Group Management'", () => {
      it("Navigate to group management", () => cy.grpNavigateToGroupManagement());
    });
  })

  context("Add Group One", () => {
    it("Open 'Add Group' dialog", () => cy.grpClickAddGroup());

    it("Create official group", () => cy.grpSelectGroupType({ isOfficial: true }));

    it(`Fill group name: ${groupOne}`, () => cy.grpTypeGroupName({ name: groupOne }));

    it("Select members: Zoran & Second", () => cy.grpTypeMembers(memberAdmin, memberSecond));

    it("Add parent group: Everyone", () => cy.grpAddParentGroups("Everyone"));

    it("Save group", () => cy.grpAddGroup());

    it("Close group dialog", () => cy.grpCloseGroupBtn());
  })

  context("Add Group Two", () => {
    it("Open 'Add Group' dialog", () => cy.grpClickAddGroup());

    it("Create official group", () => cy.grpSelectGroupType({ isOfficial: true }));

    it(`Fill group name: ${groupTwo}`, () => cy.grpTypeGroupName({ name: groupTwo }));

    it("Select members: Second & Third", () => cy.grpTypeMembers(memberSecond, memberThird));

    it("Add parent group: Everyone", () => cy.grpAddParentGroups("Everyone"));

    it("Save group", () => cy.grpAddGroup());

    it("Close group dialog", () => cy.grpCloseGroupBtn());
  })

  context("Open 'Create Document'", () => {
    it("Navigate to document list", () => cy.cmpNavigateToDocumentList());

    it("Click on 'create a document'", () => cy.cmpClickCreateNewDocument());
  });

  context("Create a Document", () => {
    it("type a title", () => cy.drEnterDocumentTitle({ name: `${FormTitle}{enter}` }));

    it("type a description", () => cy.drEnterDocumentDescription({ description: "Desription" }));

    it("fill in document type: Form", () => cy.drSelectDocumentType({ documentType: "Form" }));

    it("fill in output document type: Document Approval Matrix", () => {
      cy.drAddOutputDocType({ documentType: "Document Approval Matrix" });
    });

    it("open add field dialogue", () => cy.fbAddNewField());

    it("select 'Approval Matrix'", () => cy.fbSelectApprovalMatrix());

    it("add 'Approval Matrix' field", () => cy.fbAddField());
  });

  context("Save document And 'Approve & Release Document", () => {

    it("clicks on 'Save' button", () => cy.drClickCreateDocument());

    it("'Approve and Release' the document", () => {
      cy.drReleaseDocument({ template: "Initial AR Form" });
      cy.wait(3000);
    });

  });

  context("Create New Document out of the Form", () => {
    it("open new document", () => {
      cy.get("[data-cy=\"PreviewControlsContainer-createNew\"]", { timeout: 50 * 1000 }).click();
    })
  });

  context("fills in Title and Description", () => {
    it(`type a title: ${DAMTitle}`, () => cy.drEnterDocumentTitle({ name: `${DAMTitle}{enter}` }));

    it("type a description", () => cy.drEnterDocumentDescription({ description: "Desription" }));
  });

  context("Add Role One", () => {
    it("Open 'Add Role' dialog", () => cy.drAddAnotherRoleBtn());

    it(`Fill role name: ${roleOne}`, () => cy.drEnterApprovalRole({ name: roleOne }));

    it(`Add approving groups: ${groupOne}`, () => cy.drEnterApprovingGroups(groupOne));

    it("Save role", () => {
      SystemRequirement("REQ-0590");
      cy.drAddApprovalRole();
    });
  });

  context("Add Role Two", () => {
    it("Open 'Add Role' dialog", () => cy.drAddAnotherRoleBtn());

    it(`Fill role name: ${roleTwo}`, () => cy.drEnterApprovalRole({ name: roleTwo }));

    it(`Add approving groups: ${groupTwo}`, () => cy.drEnterApprovingGroups(groupTwo));

    it("Save role", () => cy.drAddApprovalRole());
  });

  context("Add Individual Role", () => {
    it("Open 'Add Role' dialog", () => cy.drAddAnotherRoleBtn());

    it(`Fill role name: ${individualRole}`, () => cy.drEnterApprovalRole({ name: individualRole }));

    it(`Add approving users: ${individualMember}`, () => cy.drEnterApprovingUsers(individualMember));

    it("Save role", () => {
      SystemRequirement("REQ-0600");
      cy.drAddApprovalRole();
    });
  });

  context("Add Approval Matrix Item", () => {
    it("Click on 'Add Item' button", () => cy.drAddApprovalMatrixItem());

    it("Add prefix", () => cy.drAddAMItemValue({ identity: "prefix", value: "DD" }));

    it("Add internalType", () => cy.drAMInternalType({ value: "OTHER" }));

    it("Add document type", () => cy.drAddAMItemValue({ identity: "documentType", value: "Design Document" }));

    it("Mark needs signature", () => cy.drAMCheckValue({ identity: "needsSignature" }));

    it("Add Category", () => cy.drAddAMItemValue({ identity: "category", value: "Test" }));

    it(`Mark 'Approvals Numeric' for ${roleOne}`, () => cy.drAMCheckRole({ stage: 'stage1', index: 0 }));

    it(`Mark 'Approvals Numeric Alpha' for ${roleOne}`, () => cy.drAMCheckRole({ stage: 'stage2', index: 0 }));

    it(`Mark 'Approvals Numeric Alpha' for ${roleTwo}`, () => cy.drAMCheckRole({ stage: 'stage2', index: 1 }));

    it(`Mark 'Approvals Alpha' for ${roleOne}`, () => cy.drAMCheckRole({ stage: 'stage3', index: 0 }));

    it(`Mark 'Approvals Alpha' for ${roleTwo}`, () => cy.drAMCheckRole({ stage: 'stage3', index: 1 }));

    it(`Mark 'Approvals Alpha' for ${individualRole}`, () => cy.drAMCheckRole({ stage: 'stage3', index: 2 }));

    it(`Mark 'Approvals Administrative' for ${individualRole}`, () => cy.drAMCheckRole({ stage: 'admStage', index: 2 }));

    it("Save Approval Matrix Item", () => {
      SystemRequirement("REQ-0630");
      SystemRequirement("REQ-0650");
      cy.get("[data-cy=\"fb-control-btn\"]").contains("Save").click();
    });
  });

  context("'Approve & Release Document", () => {

    it("'Approve and Release' the document", () => {
      cy.drReleaseDocument({ template: "Initial AR Form" });
      cy.wait(5000);
    });

    // This is mandatory to see Design Document Type, it needs to be fixed to eradicate this step
    it("Logout the user", () => {
      cy.get("[data-cy=\"UserMenuButton\"]").click({ timeout: 50 * 1000 });
      cy.contains("Logout").click();
    })
  });

  context("Log in user and select company", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: "zoran.kovacevic+admin@codecons.com",
        password: "Tester1!",
      });
    });

    it("Selects company", () => cy.cmpSelectCompany({ name: company.name, multiple: true }));
  })

  context("Open 'Create Document'", () => {
    it("Navigate to document list", () => cy.cmpNavigateToDocumentList());

    it("Click on 'create a document'", () => cy.cmpClickCreateNewDocument());
  });

  context("Create a Document", () => {
    it("type a title", () => cy.drEnterDocumentTitle({ name: `${DDTitle}{enter}` }));

    it("type a description", () => cy.drEnterDocumentDescription({ description: "Desription" }));

    it("fill in document type: Design Document", () => cy.drSelectDocumentType({ documentType: "Design Document" }));
  });

  context("Save document And 'Approve & Release' Document", () => {

    it("clicks on 'Create Document' button", () => cy.drClickCreateDocument());

    it("click on 'Approve and Release' button", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]", { timeout: 5 * 1000 }).click();
    });

    it(`Check ${roleOne} exists and is checked`, () => {
      cy.get("[data-cy=\"group-0\"]").contains(roleOne);
      cy.get("[data-cy=\"checked-0\"]").should("be.visible");
    });

    it("'Approve and Release' the document", () => {
      cy.get("#FormList-selectForm").type(`${"Initial AR Form"}{enter}`);
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click();
      cy.wait(3000);
    });

  });

  context("'Login second user now", () => {

    it("Logout the user", () => {
      cy.get("[data-cy=\"UserMenuButton\"]").click({ timeout: 50 * 1000 });
      cy.contains("Logout").click();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: "enlil.testmail+cy2@gmail.com",
        password: "Tester1!",
      });
    });

    it("Selects company", () => cy.cmpSelectCompany({ name: company.name, multiple: true }));
  });

  context(`Open '${DDTitle}' Document`, () => {

    it("Navigate to document list", () => cy.cmpNavigateToDocumentList());

    it(`select '${DDTitle}'`, () => {
      cy.get("#root").contains(DDTitle).click();
    });
  });

  context("Upgrade to next revision level", () => {
    it("Revise document", () => cy.drClickReviseDocument());

    it("Upgrade to next revision level", () => cy.drUpgradeRevisionLevel());

    it("Save document", () => cy.drClickCreateDocument());
  });

  context("'Approve & Release' Document", () => {

    it("click on 'Approve and Release' button", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]", { timeout: 5 * 1000 }).click();
    });

    it(`Check ${roleOne} exists and is checked`, () => {
      cy.get("[data-cy=\"group-1\"]").contains(roleOne);
      cy.get("[data-cy=\"checked-1\"]").should("be.visible");
    });

    it(`Check ${roleTwo} exists and is checked`, () => {
      cy.get("[data-cy=\"group-0\"]").contains(roleTwo);
      cy.get("[data-cy=\"checked-0\"]").should("be.visible");
    });

    it("'Approve and Release' the document", () => {
      cy.get("#FormList-selectForm").type(`${"Initial AR Form"}{enter}`);
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click();
    });

  });

  context("No validation error, submission is successful", () => {

    it("Check returned errors are empty", () => {
      SystemRequirement("REQ-0010");
      cy.checkToastMessage({ exists: false });
    })
  });

});

// for TS error "All files must be modules when the '--isolatedModules' flag is provided" uncomment line below
export { };
