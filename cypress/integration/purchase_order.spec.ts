/* eslint-disable max-classes-per-file */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { SystemRequirement } from "../utils/context/systemRequirement";

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});


let createdCompany;
let loginResponse;
let multipleCompanies;


// context("Create company via API and create Purchase Order Form document", () => {
//   it("[API] Creates company", (done: any) => {
//     cy.authApiLogin({
//       email: "zoran.kovacevic+admin@codecons.com",
//       password: "Tester1!",
//     }).then((response) => {
//       loginResponse = response;

//       cy.cmpCreateCompany({
//         payload: {
//           companyAcronym: `T1${runId}`,
//           companyAdminEmail: "enlil.testmail+cy1@gmail.com",
//           helloSignIntegrationEnabled: false,
//           helloSignTestMode: false,
//           importerEmail: "enlil.testmail+cy5@gmail.com",
//           maxRevisionStages: 3,
//           name: `Test Company ${runId}`,
//           numOfDocDigits: 5,
//           remoteValidatorBundleName: "default",
//           slackIntegrationEnabled: false,
//           users: [
//             {
//               name: "Second Tester",
//               email: "enlil.testmail+cy2@gmail.com",
//             },
//             {
//               name: "Third Tester",
//               email: "enlil.testmail+cy3@gmail.com",
//             },
//             {
//               name: "Fourth Tester",
//               email: "enlil.testmail+cy4@gmail.com",
//             }],
//             documentTypes: [
//               {
//                 documentTypeName: "PO Part",
//                 documentTypeAcronym: "PRT-",
//                 group: "PART",
//                 isQms: true,
//               },
//             ],
//           acctCodes: ["code 1"],
//           addresses: ["Address 1"],
//         }, sessionId: loginResponse.sessionId as unknown as string,
//       }).then((response) => {
//         createdCompany = response;
//         adminEmployee = createdCompany.employees.find((employee) => employee.user.name === "Company Admin");
//         createdCompany.documentTypes.forEach((item: { documentTypeName: string; id: any }) => {
//           if (item.documentTypeName == "Purchase Order")
//           {
//             docTypeId = item.id;
//           }
//         });
//         done();
//       });
//     });
//   });

//   it("[API] Updates company", (done: any) => {
//     cy.authApiLogin({
//       email: "enlil.testmail+cy1@gmail.com",
//       password: "Tester1!",
//     }).then((response) => {
//       loginResponse = response;

//       cy.cmpUpdateCompany({
//         employeeId: adminEmployee.id,
//         sessionId: loginResponse.sessionId as unknown as string,
//         payload: {
//           navigation:
//           [
//             {
//               label: "Dashboard",
//               path: "/",
//               type: "LINK"
//             },
//             {
//               label: "Document List",
//               path: "/document_revision",
//               type: "LINK"
//             },
//             {
//               label: "Approval Request List",
//               path: "/change_request",
//               type: "LINK"
//             },
//             {
//               label: "User Management",
//               path: "/user_management",
//               restrictedToUsersWithTags:[
//                 "USER_MANAGEMENT"
//               ],
//               type: "LINK"
//             },
//             {
//               label: "Group Management",
//               path: "/group_management",
//               restrictedToUsersWithTags:[
//                 "GROUP_MANAGEMENT"
//               ],
//               type: "LINK"
//             },
//             {
//               label: "Purchase Order",
//               path: "/document_by_type/" + docTypeId,
//               type: "LINK",
//             }
//           ],
//         }).then(() => {
//         done();
//       });
//     });
//   });

//   it("[API] Login second tester", (done: any) => {
//     cy.authApiLogin({
//       email: "enlil.testmail+cy2@gmail.com",
//       password: "Tester1!",
//     }).then((response) => {
//       loginResponse = response;
//       multipleCompanies = loginResponse.employees.length > 1 ? true : false;
//       done();
//     });
//   });

//   it("Logs user in", () => {
//     cy.authLogin({
//       email: "enlil.testmail+cy2@gmail.com",
//       password: "Tester1!",
//     });
//   });

//   it("Selects company", () => {
//     cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
//   });

//   it("Navigate to document list", () => {
//     cy.cmpNavigateToDocumentList();
//   });

//   it("Click on 'Create a document'", () => {
//     cy.cmpClickCreateNewDocument();
//   });

//   it("Enter title 'New Purchase Order Form'", () => {
//     cy.drEnterDocumentTitle({ name: "New Purchase Order Form" });
//   });

//   it("Enter description 'New Purchase Order Form description'", () => {
//     cy.drEnterDocumentDescription({ description: "New Purchase Order Form description" });
//   });

//   it("Click on 'Form' document type", () => {
//     cy.drSelectDocumentType({ documentType: "Form" });
//   });

//   it("Click on 'Purchase Order' outputdocument type", () => {
//     cy.drSelectOutputDocType({ documentType: "Purchase Order" });
//   });

//   it("Click 'Add New Field'", () => {
//     cy.addNewFieldOption();
//   });

//   it("Select 'Purchase Order' from list", () => {
//     cy.selectItemFromNewFieldList({ field: "Purchase Order" });
//   });

//   it("Fill label field with 'New Purchase Order'", () => {
//     cy.enterPOLabelName({ name: "New Purchase Order" });
//   });

//   it("Click 'Add' to finish adding new field", () => {
//     cy.addNewFieldButton();
//   });

//   it("Click create document after filling document", () => {
//     cy.drClickCreateDocument();
//   });

//   it("Approve and release document", () => {
//     cy.drApproveAndReleaseDocument();
//   });
// });

// context("Create Part document for PO", () => {
//   it("Navigates to document list", () => {
//     cy.cmpNavigateToDocumentList();
//   });

//   it("Clicks on 'create a document' button", () => {
//     cy.cmpClickCreateNewDocument();
//   });

//   it("Enters title 'New Part'", () => {
//     cy.drEnterDocumentTitle({ name: "New Part" });
//   });

//   it("Enters description 'New Part description'", () => {
//     cy.drEnterDocumentDescription({ description: "New Part description" });
//   });

//   it("Selects 'PO Part' document type from dropdown", () => {
//     cy.drSelectDocumentType({ documentType: "PO Part" });
//   });

//   it("Click create document after filling document", () => {
//     cy.drClickCreateDocument();
//   });
// });

context("Create Purchase Order document from Form document", () => {
  it("[API] Login second tester", (done: any) => {
    cy.authApiLogin({
      email: "enlil.testmail+cy2@gmail.com",
      password: "Tester1!",
    }).then((response) => {
      loginResponse = response;
      multipleCompanies = loginResponse.employees.length > 1 ? true : false;
      done();
    });
  });

  it("Logs user in", () => {
    cy.authLogin({
      email: "enlil.testmail+cy2@gmail.com",
      password: "Tester1!",
    }).wait(5000);
  });

  // it("Selects company", () => {
  //   cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
  // });

  it("Click on 'Purchase Order' on sidebar", () => {
    cy.cmpNavigateToPurchaseOrder();
  });

  it("Click on 'Create PO' button", () => {
    cy.createNewPO();
  });

  it("Click on 'Add item' button", () => {
    cy.addNewFieldItem();
  });

  it("Select Part Number", () => {
    cy.selectPartNumber();
  });

  it("Click on 'Add' inside PO dialog box", () => {
    cy.addPOButtonClick();
  });

  it("Enter description 'New Purchase Order'", () => {
    SystemRequirement("REQ-1290");
    cy.poEnterDocumentDescription({ description: "New Purchase Order" });
  });
});


export { };
