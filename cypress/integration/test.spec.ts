/* eslint-disable object-shorthand */
import { CONFIG } from "../support/config";

let loginResponse;
let multipleCompanies;
let createdCompany;

// company bootstrap
const acctCodes = [
  "92345",
  "94565",
  "92703",
  "91402"];
const addresses = [
  "3 Tarkiln Hill Street Hesperia, CA 92345",
  "609 Wild Rose Street Pittsburg, CA 94565",
  "88 E. Marconi Court Santa Ana, CA 92703",
  "17 South Saxton Street Panorama City, CA 91402"];
const adminUser = {
  email: "zoran.kovacevic+test@codecons.com",
  name: "Zoran Kovacevic",
};
const importedUser = {
  email: "en.lil+tomislav.kusevic+ca7@gmail.com",
  name: "Imported User Test",
};
const users = [
  {
    name: "Luka Stosic - Admin",
    email: "luka.stosic+test@codecons.com",
  },
  {
    name: "Luka Stosic - Importer",
    email: "luka.stosic+testi@codecons.com",
  },
  {
    name: "Abbie Valencia",
    email: "abigail.valencia08+test@gmail.com",
  },
  {
    name: "Abbie test2",
    email: "abigail.valencia08+test2@gmail.com",
  },
  {
    name: "Zahra Salahieh",
    email: "zahrasalahieh+test@gmail.com",
  },
  {
    name: "Zahra test2",
    email: "zahrasalahieh+test2@gmail.com",
  },
  {
    name: "Faye Faye",
    email: "fayemasbate9+test@gmail.com",
  },
  {
    name: "Faye test2",
    email: "fayemasbate9+test2@gmail.com",
  },
  {
    name: "Enlil Tester",
    email: "enliltester+test@gmail.com",
  },
  {
    name: "Tomislav Kusevic",
    email: "tomislav.kusevic+test@codecons.com",
  },
  {
    name: "Ivan the Test User",
    email: "ivan.veselin+test@codecons.com",
  },
  {
    name: "Ivan Salamon",
    email: "ivan.salamon+test@codecons.com",
  },
  {
    name: "Dario Tislar",
    email: "dario.tislar+test@codecons.com",
  },
  {
    name: "Mirela Validzic",
    email: "mirela.validzic+test@codecons.com",
  },
  {
    name: "Zoran Babic",
    email: "zoran.babic+test@codecons.com",
  },
  {
    name: "Zahra Shifamed",
    email: "zsalahieh@shifamed.com",
  },
  {
    name: "Maureen Gamarra",
    email: "mgamarra@shifamed.com",
  },
  {
    name: "Maureen Test1",
    email: "polhygat3m+test1@gmail.com",
  },
  {
    name: "Maureen test2",
    email: "polhygat3m+test2@gmail.com",
  },
  {
    name: "shifamed b1",
    email: "shifamed+b1@prplbx.com",
  },
  {
    name: "shifamed b2",
    email: "shifamed+b2@prplbx.com",
  },
  {
    name: "shifamed b3",
    email: "shifamed+b3@prplbx.com",
  },
  {
    name: "Nathaniel Boas",
    email: "nboas@shifamed.com",
  },
  {
    name: "Gabriela Test",
    email: "gabriela@codecons.com",
  },
  {
    name: "Vitalii Sobchuk",
    email: "vitalii.sobchuk@gmail.com",
  },
  {
    name: "Ryan Smith",
    email: "sufyan+ryan@codecons.com",
  },
  {
    name: "William Berger",
    email: "sufyan+william@codecons.com",
  },
  {
    name: "Ammar test2",
    email: "adarkazanli+test2@gmail.com",
  },
  {
    name: "Clarissa Test",
    email: "clarissamclariza+test@gmail.com",
  },
  {
    name: "Sara Aleksi +Test",
    email: "sara.aleksi+test@codecons.com",
  },
  {
    name: "Test Test",
    email: "luka.stosic+users_test10@codecons.com",
  },
  {
    name: "Iva Majic",
    email: "zoran.babic+1@codecons.com",
  },
  {
    name: "barbara",
    email: "barbara@myvirtualpartnr.com",
  },
  {
    name: "Julia",
    email: "yuliya.makarenko@gmail.com",
  },
  {
    name: "Sara Aleksi",
    email: "sara.aleksi+testuser@codecons.com",
  },
  {
    name: "Sara 1",
    email: "sara.aleksi+testuser1@codecons.com",
  },
  {
    name: "Sara 2",
    email: "sara.aleksi+testuser2@codecons.com",
  },
  {
    name: "Sara Aleksi",
    email: "sara.aleksi+testuser3@codecons.com",
  },
  {
    name: "Sara Aleksi",
    email: "sara.aleksi+testuser4@codecons.com",
  },
  {
    name: "Sara Aleksi",
    email: "sara.aleksi+testuser5@codecons.com",
  },
  {
    name: "Sara Aleksi",
    email: "sara.aleksi+testuser6@codecons.com",
  },
  {
    name: "Sara 7",
    email: "sara.aleksi+testuser7@codecons.com",
  },
  {
    name: "Sara Aleksi",
    email: "sara.aleksi+testuser8@codecons.com",
  },
  {
    name: "Sara Aleksi",
    email: "sara.aleksi+testuser9@codecons.com",
  },
  {
    name: "Sara Aleksi",
    email: "sara.aleksi+testuser10@codecons.com",
  },
  {
    name: "Sara Aleksi",
    email: "sara.aleksi+testuser11@codecons.com",
  },
  {
    name: "Sara Aleksi +Test",
    email: "sara.aleksi+testuser12@codecons.com",
  },
  {
    name: "Sara Aleksi",
    email: "sara.aleksi+test13@codecons.com",
  },
  {
    name: "Sara Aleksi +Test",
    email: "sara.aleksi+test14@codecons.com",
  },
  {
    name: "Sara Aleksi +Test",
    email: "sara.aleksi+test15@codecons.com",
  },
  {
    name: "Sara Aleksi +Test",
    email: "sara.aleksi+test20@codecons.com",
  },
  {
    name: "Sonja Stepanov",
    email: "sonja.stepanov10@gmail.com",
  },
  {
    name: "Sonja Test2",
    email: "www.myworkplace@gmail.com",
  },
  {
    name: "Sara",
    email: "sara.aleksi+1@codecons.com",
  },
  {
    name: "Ammar Test0115",
    email: "adarkazanli+test0115@gmail.com",
  },
  {
    name: "FakeName",
    email: "sara.aleksi+novinovi@email.com",
  },
  {
    name: "FakeName",
    email: "sara.aleksi+novinovi@codecons.com",
  },
  {
    name: "FakeName",
    email: "sara.aleksi+novinovi2@codecons.com",
  },
  {
    name: "Sara New User",
    email: "sara.aleksi+test_new_user@codecons.com",
  },
  {
    name: "test",
    email: "enlil.testmail+testing@gmail.com",
  },
  {
    name: "test",
    email: "enlil.testmail+test123@gmail.com",
  },
  {
    name: "test",
    email: "enlil.testmail+test1234@gmail.com",
  },
  {
    name: "Tom",
    email: "tomislav.kusevic+probaproba23@codecons.com",
  },
  {
    name: "Name",
    email: "tomislav.kusevic+existingdev5@codecons.com",
  },
  {
    name: "Tom",
    email: "tomislav.kusevic+probaproba30@codecons.com",
  },
  {
    name: "test",
    email: "enlil.testmail+testflow12@gmail.com",
  },
  {
    name: "Tester1!",
    email: "enlil.testmail+testexistinguser@gmail.com",
  },
  {
    name: "Zoran Kova",
    email: "zorankova@example.com",
  },
  {
    name: "Kova",
    email: "kova@example.com",
  },
  {
    name: "Maja Test Account",
    email: "testuser@codecons.com",
  },
  {
    name: "FakeName2",
    email: "tomislav.kusevic+testtesttest2@codecons.com",
  },
  {
    name: "FakeName3",
    email: "tomislav.kusevic+testtesttest3@codecons.com",
  },
  {
    name: "TestFlowBojan",
    email: "enlil.testmail+testflow@gmail.com",
  },
  {
    name: "testname",
    email: "enlil.testmail+testflow123@gmail.com",
  },
  {
    name: "Ammar Darkazanli - Admin",
    email: "adarkazanli@shifamed.com",
  },
  {
    name: "Ammar Darkazanli",
    email: "adarkazanli+test@gmail.com",
  },
  {
    name: "Ammar Test3",
    email: "adarkazanli+test3@gmail.com",
  },
  {
    name: "Julia Makarenko",
    email: "julia@codecons.com",
  },
  {
    name: "Maja Main acc",
    email: "maja.ivezic+1@codecons.com",
  },
  {
    name: "Syed Sufyan Pervez",
    email: "sufyan+shifamed_test@codecons.com",
  },
  {
    name: "Zarko S DEV",
    email: "zarko.stepanov10@gmail.com",
  },
  {
    name: "Clarissa Dev",
    email: "clarissamclariza+devtest@gmail.com",
  },
  {
    name: "Julia QA",
    email: "julia+qa@codecons.com",
  },
  {
    name: "Ammar Testing with C and G",
    email: "adarkazanli+testcandg@gmail.com",
  },
  {
    name: "Clene Dario",
    email: "clenedario+test@gmail.com",
  },
  {
    name: "Clene New",
    email: "clenedario+new@gmail.com",
  },
  {
    name: " Chiratana Pot",
    email: "cpot@shifamed.com",
  },
  {
    name: "Tomke Lambda",
    email: "tomislav.kusevic+schox@codecons.com",
  },
  {
    name: "Tomke Lambda11",
    email: "tomislav.kusevic+schox11@codecons.com",
  },
  {
    name: "Tomke Lambda12",
    email: "tomislav.kusevic+schox12@codecons.com",
  },
  {
    name: "Tomke Lambda13",
    email: "tomislav.kusevic+schox13@codecons.com",
  },
  {
    name: "Tomke Lambda14",
    email: "tomislav.kusevic+schox14@codecons.com",
  },
  {
    name: "Tomislav Testing Lambda",
    email: "tomislav.kusevic+sadmorabiti@codecons.com",
  },
  {
    name: "Jennifer Brandt",
    email: "jbrandt@shifamed.com",
  },
  {
    name: "Tomislav Kusevic",
    email: "tomislav.kusevic+prod@codecons.com",
  },
  {
    name: "Tomislav Cajbert",
    email: "tcajbert@test.com",
  },
];

const documentTypes = [
  {
    documentTypeName: "Type With Approval Groups",
    documentTypeAcronym: "TWG-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Administrative",
    documentTypeAcronym: "ADM-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Business",
    documentTypeAcronym: "BUS-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Tooling Lot",
    documentTypeAcronym: "TLL-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Standard Opcedure",
    documentTypeAcronym: "SOP",
    group: "FORM",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Record Document",
    documentTypeAcronym: "RD-",
    group: "RECORD",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Clinical Protocol",
    documentTypeAcronym: "CP-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Environmental Health & Safety",
    documentTypeAcronym: "EHS-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Finished Good",
    documentTypeAcronym: "FG-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Clinical Report",
    documentTypeAcronym: "CR-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Design Document",
    documentTypeAcronym: "DD-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Equipment Specifications",
    documentTypeAcronym: "ES-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Labeling",
    documentTypeAcronym: "LBL-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Marketing",
    documentTypeAcronym: "MKT-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Manufacturing Process Instructions",
    documentTypeAcronym: "MPI-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Master Validation Plan",
    documentTypeAcronym: "MVP-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Quality Manual",
    documentTypeAcronym: "QM-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Quality Plan",
    documentTypeAcronym: "QP-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Quality Specifications",
    documentTypeAcronym: "QS-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "General Document",
    documentTypeAcronym: "GD-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Report",
    documentTypeAcronym: "RPT-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Risk Management",
    documentTypeAcronym: "RM-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Supply Item",
    documentTypeAcronym: "SI-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Training Curriculum",
    documentTypeAcronym: "TC-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Tooling",
    documentTypeAcronym: "TL-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Test Method",
    documentTypeAcronym: "TM-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Test Protocol",
    documentTypeAcronym: "TP-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Test Report",
    documentTypeAcronym: "TR-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Work Instructions",
    documentTypeAcronym: "WI-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Equipment Specifications Lot",
    documentTypeAcronym: "ESL-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Component Specifications Lot",
    documentTypeAcronym: "CSL-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Model/Catalog Number",
    documentTypeAcronym: "REF-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Non-product Software",
    documentTypeAcronym: "NSW-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Concept",
    documentTypeAcronym: "CPT-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Non-Conformance Report",
    documentTypeAcronym: "NCR-",
    group: "OTHER",
    privateNumberPool: true,
    startingNumber: 10,
  },
  {
    documentTypeName: "Corrective Action / Preventive Action",
    documentTypeAcronym: "CAPA-",
    group: "OTHER",
    privateNumberPool: true,
    startingNumber: 0,
  },
  {
    documentTypeName: "Equipment",
    documentTypeAcronym: "EQ-",
    group: "OTHER",
    privateNumberPool: true,
    startingNumber: 0,
  },
  {
    documentTypeName: "Impact Assessment",
    documentTypeAcronym: "IA-",
    group: "OTHER",
    privateNumberPool: true,
    startingNumber: 0,
  },
  {
    documentTypeName: "Non-Disclosure Agreement",
    documentTypeAcronym: "NDA-",
    group: "OTHER",
    privateNumberPool: true,
    startingNumber: 0,
  },
  {
    documentTypeName: "Parts",
    documentTypeAcronym: "PRT-",
    group: "PART",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Kova Super Test",
    documentTypeAcronym: "KST-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Supplier Self Survey",
    documentTypeAcronym: "SSR-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Contract",
    documentTypeAcronym: "CT-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Standard Operating Procedure",
    documentTypeAcronym: "SOP-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Sara Test Supplier",
    documentTypeAcronym: "TSL-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Component Specifications",
    documentTypeAcronym: "CS-",
    group: "WO_PARTS",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Device Master Record",
    documentTypeAcronym: "DMR-",
    group: "RECORD",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Test Record",
    documentTypeAcronym: "TREC-",
    group: "RECORD",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Supplier",
    documentTypeAcronym: "SUPP-",
    group: "SUPPLIER",
    privateNumberPool: true,
    startingNumber: 1,
  },
];

// after company bootstrap
const trackConfigEmails = [
  "zoran.kovacevic@codecons.com",
  "luka.stosic@codecons.com"];

context("Create Test company example", () => {

  context("[API] Prepare company", () => {
    it("[API] Creates company", (done: any) => {
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response) => {
        loginResponse = response;

        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: adminUser.email,
            helloSignIntegrationEnabled: true,
            helloSignTestMode: true,
            importerEmail: importedUser.email,
            numOfRevStages: 3,
            numOfDocDigits: 5,
            slackIntegrationEnabled: true,
            users: users,
            acctCodes: acctCodes,
            addresses: addresses,
            documentTypes: documentTypes,
            whiteLabeling: {
              DEV_THEME: {
                logo: "https://s3.amazonaws.com/tld-documents.llnassets.com/0004000/4056/random_testing_sm.jpg",
              },
            },
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: adminUser.email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });
  });

  context("Log in user, select company and open 'Create Document'", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: adminUser.email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });
});
