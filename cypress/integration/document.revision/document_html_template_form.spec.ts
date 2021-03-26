import moment from "moment";
import "moment-timezone";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;

const documentRevisionName = "New HTML Template Document Revision";
const currentDate = moment().tz("America/Los_Angeles").format("MMMM Do YYYY");
let customFieldId;
let docRevisionId;
let baererSessionId;
let employeeId;
let developersGroup;
let adminEmployee;
let adminSessionId;

context("Document HTML template form", () => {
  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      SystemRequirement("REQ-0400", "REQ-0420", "REQ-0440");
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
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP-",
                group: "OTHER",
                isQms: true,
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          const employee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          employeeId = employee.id;
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        adminSessionId = loginResponse.sessionId;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        baererSessionId = loginResponse.sessionId;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
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
          employees: [{ id: employeeId }],
        },
      });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Start document creation flow", () => {
    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Fill in document attributes", () => {
    it("Enters title 'New HTML Template Form Revision'", () => {
      cy.drEnterDocumentTitle({ name: "New HTML Template Form Revision" });
    });

    it("Enters description 'New HTML template description'", () => {
      cy.drEnterDocumentDescription({ description: "New HTML template description" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Form" });
    });


    it("Select 'Clinical Protocol' output document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Click on 'Add a field'", () => {
      cy.fbAddNewField();
    });

    it("Select 'Text Field' field", () => {
      cy.fbSelectTextField();
    });

    it("Give label to 'Text Field' as 'New Text Field'", () => {
      cy.fbAddLabelName({ name: "New Text Field" });
    });

    it("Add 'Text Field' field", () => {
      cy.fbAddNewFieldButton();
    });

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            const response = res.body;
            customFieldId = response.formTemplate.schema[0].name;
          }
        });
      }).as("response");
      cy.wait("@response");
    });

    it("Enter html code into 'Render HTML' field", () => {
      cy.drEnterHtmlText({
        htmlText:
          `<html>` +
            `<body>` +
              `<h1>Heading - {{}{{}documentRevision.formInput.${customFieldId}}} </h1><p>Paragraph.</p>` +
              `<div><strong>Name</strong>` +
                `{{}{{}#documentRevision.changeRequest.approvals}}` +
                `<ul><li>{{}{{}approver.user.name}}</li></ul>` +
                `{{}{{}/documentRevision.changeRequest.approvals}}` +
              `</div>` +
              `<div><strong>Date & Signature</strong>` +
                `{{}{{}#validApprovalDates}}` +
                `<ul><li>{{}{{}reviewedAt}}</li></ul>` +
                `{{}{{}/validApprovalDates}}` +
              `</div>` +
            `</body>` +
          `</html>`,
      });
    });

    it("Approve and Release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Create new document from form", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it(`Enters title '${documentRevisionName}'`, () => {
      cy.drEnterDocumentTitle({ name: documentRevisionName });
    });

    it("Enters description 'New Document Revision description'", () => {
      cy.drEnterDocumentDescription({ description: "New HTML template description" });
    });

    it("Enter text 'First entry' in the custom textfield", () => {
      SystemRequirement("REQ-1080");
      cy.get("[data-cy^=\"new-text-field-\"]").click().type("First entry");
    });

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Approve and Release document", () => {
      // cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.drApproveAndReleaseDocumentWithSelectingApprover([`${USERS[2].name}`, `${USERS[3].name}`]);
    });

    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Filters document by name and status, and select it", () => {
      cy.intercept({ method: "GET", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            const response = res.body;
            docRevisionId = response.id;
          }
        });
      }).as("response");
      cy.drFilterDocListByNameAndStatus({ title: documentRevisionName, status: "None" });
      cy.wait("@response");
    });

    it("[API]Get html document and assert string value", () => {
      cy.request({
        method: "GET",
        url: `${CONFIG.BE_URL}/api/v1/document_revisions/generate_html/${docRevisionId}`,
        headers: {
          Authorization: `bearer ${employeeId}:${baererSessionId}`,
        },
      }).then((response) => {
        const responseBody = response.body.toString();
        expect(responseBody)
          .to.have.string(
            `<html>` +
              `<body>` +
                `<h1>Heading - First entry </h1><p>Paragraph.</p>`)
          .and.have.string(
            `<div>` +
              `<strong>Name</strong>`)
          .and.have.string(`<ul><li>${USERS[1].name}</li></ul>`)
          .and.have.string(`<ul><li>${USERS[3].name}</li></ul>`)
          .and.have.string(`<ul><li>${USERS[2].name}</li></ul>`)
          .and.have.string(`<strong>Date & Signature</strong>`)
          .and.have.string(`${currentDate}`);
      });
    });
  });
});

export { };

