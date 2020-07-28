// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

const runId = new Date().valueOf();
let company;

const groupOne = "Group One";
const groupTwo = "Group Two";
const groupThree = "Group Three";

const memberAdmin = "Zoran";
const memberSecond = "Second";
const memberThird = "Third";
const memberFourth = "Fourth";

const FormTitle = "New Form";
const DAMTitle = "My DAM";

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

  context("Add Group Three", () => {
    it("Open 'Add Group' dialog", () => cy.grpClickAddGroup());

    it("Create official group", () => cy.grpSelectGroupType({ isOfficial: true }));

    it(`Fill group name: ${groupThree}`, () => cy.grpTypeGroupName({ name: groupThree }));

    it("Select members: Fourth", () => cy.grpTypeMembers(memberFourth));

    it("Add parent group: Everyone", () => cy.grpAddParentGroups("Everyone"));

    it("Save group", () => cy.grpAddGroup());

    it("Close group dialog", () => cy.grpCloseGroupBtn());
  });

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

});

// for TS error "All files must be modules when the '--isolatedModules' flag is provided" uncomment line below
export { };

