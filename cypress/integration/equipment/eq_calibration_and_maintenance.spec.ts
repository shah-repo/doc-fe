// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let adminEmployee;
let createdCompany;
let adminEmployeeLoginResponse;
let equipmentURL;
let createdPMFormDocumentId;
let createdCalibrationFormDocumentId;
let pmSchemaFieldName;
let calibrationSchemaFieldName;

const ADMIN_USER = USERS[1];
const FIRST_USER = USERS[2];
const SECOND_USER = USERS[3];
const THIRD_USER = USERS[4];

context("Equipment maintenance and calibration", () => {
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
        adminEmployeeLoginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: ADMIN_USER.email,
            importerEmail: IMPORTER_USER.email,
            users: [FIRST_USER, SECOND_USER, THIRD_USER],
            documentTypes: [],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          done();
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: ADMIN_USER, employeeId: adminEmployee.id });
    });
  });

  context("Create form for Equipment", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Equpment form'", () => {
      cy.drEnterDocumentTitle({ name: "Equipment form" });
    });

    it("Enter description 'Equpment formdescription'", () => {
      cy.drEnterDocumentDescription({ description: "Equpment form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Equipment" });
      cy.unClick();
    });

    context("Add preventative maintenance section", () => {
      it("Click add a field", () => {
        cy.fbClickAddNewHiddenBtn();
      });

      it("Select equipment", () => {
        cy.fbSelectItemFromNewFieldList({ field: "Equipment" });
      });

      it("Add label for preventative maintenance", () => {
        cy.fbEnterNameValue({ name: "label", value: "Preventative Maintenance" });
      });

      it("Mark Preventative Maintenance radio button", () => {
        cy.get("input[value=preventativeMaintenance]").check();
      });

      it("Add field", () => {
        cy.fbAddNewFieldButton();
      });
    });

    context("Add calibration section", () => {
      it("Click add a field", () => {
        cy.fbClickAddNewHiddenBtn();
      });

      it("Select equipment", () => {
        cy.fbSelectItemFromNewFieldList({ field: "Equipment" });
      });

      it("Add label for Calibration", () => {
        cy.fbEnterNameValue({ name: "label", value: "Calibration" });
      });

      it("Mark Calibration radio button", () => {
        cy.get("input[value=calibration]").check();
      });

      it("Add field", () => {
        cy.fbAddNewFieldButton();
      });
    });

    context("Create and release form", () => {
      it("Click create document", () => {
        cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");

        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();

        cy.wait("@response").then((res) => {
          if (res.response) {
            const response = res.response.body;
            pmSchemaFieldName = response.formTemplate.schema[3].name;
            calibrationSchemaFieldName = response.formTemplate.schema[4].name;
          }
        });

        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve and release Bulk create form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create form for Preventative maintenance", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Preventative Maintenance form'", () => {
      cy.drEnterDocumentTitle({ name: "Preventative Maintenance form" });
    });

    it("Enter description 'Preventative Maintenance form description'", () => {
      cy.drEnterDocumentDescription({ description: "Preventative Maintenance form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Maintenance Record" });
      cy.unClick();
    });

    context("Create and release form", () => {
      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release Bulk create form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        cy.url().then((url: any) => {
          createdPMFormDocumentId = url.split("/").pop();
        });
      });
    });
  });

  context("Create form for Calibration", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Calibration form'", () => {
      cy.drEnterDocumentTitle({ name: "Calibration form" });
    });

    it("Enter description 'Calibration form description'", () => {
      cy.drEnterDocumentDescription({ description: "Calibration form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Maintenance Record" });
      cy.unClick();
    });

    context("Create and release form", () => {
      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release Bulk create form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        cy.url().then((url: any) => {
          createdCalibrationFormDocumentId = url.split("/").pop();
        });
      });
    });
  });

  context("Create Equipment document", () => {
    it("Navig to equipment", () => {
      cy.navigToEquipment();
    });

    it("Click add new Equipment", () => {
      cy.equipClickCreateNew();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Equipment document'", () => {
      cy.drEnterDocumentTitle({ name: "Equipment document" });
    });

    it("Enter description 'Equipment description'", () => {
      cy.drEnterDocumentDescription({ description: "Equipment description" });
    });

    it("Select 'Active' as EQ status", () => {
      cy.get("input[name=fb-default-eq-status][value=Active]").check();
    });

    it(`Select '${USERS[1].name}' for Primary Owner`, () => {
      cy.get("input[data-cy=\"fb-primary-owner-eq\"]").arrowClick();
      cy.get("ul>li[role=\"option\"]").contains(USERS[1].name).arrowClick();
    });

    it(`Select '${USERS[1].name}' for Coordinator`, () => {
      cy.get("input[data-cy=\"fb-coordinator-eq\"]").arrowClick();
      cy.get("ul>li[role=\"option\"]").contains(USERS[1].name).arrowClick();
    });

    it("Select document 'Yes' for preventative maintenance required", () => {
      cy.get("[value=\"Yes\"]").eq(0).arrowClick();
    });

    it("Select 'Preventative Maintenance form' for preventative maintenance required", () => {
      cy.get("[name$=\"preventativeForm\"] button").eq(2).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.unClick();
      cy.get("[data-cy*=\"preventativeForm\"]").eq(0).arrowClick();
      cy.get("ul>li[role=\"option\"]").contains("Preventative Maintenance form").arrowClick();
    });

    it("Select preventative maintenance frequency", () => {
      cy.get("[name*=\"frequency\"]").eq(0).arrowType("365");
    });

    it("Type preventative maintenance instruction", () => {
      cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy, \"preventative\")]/../div[2]")
        .type("Instructions for preventative maintenance").wait(500);
      cy.unClick();
    });

    it("Select document 'Yes' for calibration required", () => {
      cy.get("[value=\"Yes\"]").eq(1).arrowClick();
    });

    it("Select 'Calibration form' for calibration required", () => {
      cy.get("[name$=\"preventativeForm\"] button").eq(5).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.unClick();
      cy.get("[data-cy*=\"preventativeForm\"]").eq(1).arrowClick();
      cy.get("ul>li[role=\"option\"]").contains("Calibration form").arrowClick();
    });

    it("Select calibration frequency", () => {
      cy.get("[name*=\"frequency\"]").eq(1).arrowType("365");
    });

    it("Type preventative maintenance instruction", () => {
      cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy,\"calibration\")]/../div[2]")
        .type("Instructions for calibration").wait(500);
      cy.unClick();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.url().then((url: any) => {
        equipmentURL = url;
      });
    });
  });

  context("Create Preventative Maintenance record", () => {
    it("Click 'NEW PM' on preventative maintenace section", () => {
      cy.url().then((url: any) => {
        const docIdFromUrl = url.split("/").pop();
        // eslint-disable-next-line max-len
        const newPMUrl = `${CONFIG.FE_URL}/document_revision/${createdPMFormDocumentId}/create_maintenance/${docIdFromUrl}/${pmSchemaFieldName}`;
        cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails,
          CyRoutes.GetAvailableApprovers,
          CyRoutes.GetAutocompleteOptions], () => {
          cy.visit(newPMUrl);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Preventative maintenance document'", () => {
      cy.drEnterDocumentTitle({ name: "Preventative maintenance document" });
    });

    it("Select document type 'Maintenance Record'", () => {
      cy.drSelectDocumentType({ documentType: "Maintenance Record" });
    });

    it("Select revision stage 'Numeric'", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it(`Select maintainer '${ADMIN_USER.name}'`, () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"equipment_maintainer\"]").arrowClick();
      cy.get("ul>li[role=\"option\"]").contains(ADMIN_USER.name).arrowClick();
    });

    it("Fill 'Completion Date'", () => {
      const dayOfTheMonth = moment().tz("America/Los_Angeles").date();
      cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").arrowClick();
      cy.get("button.MuiPickersDay-day")
        .not(".MuiPickersDay-hidden")
        .each(($el) => {
          const dayNumber = $el.text();
          if (dayOfTheMonth.toString() === dayNumber) {
            cy.wrap($el).arrowClick();
          }
        });
    });

    it("Create 'Preventative maintenance document'", () => {
      cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: true });
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverList({ approver: ADMIN_USER.name });
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAvailableApprovers], () => {
        cy.ebApprove();
      });
    });

    it("Verify status is 'Released'", () => {
      cy.drCheckDocumentStatus({ status: "Released" });
    });
  });

  context("Create Calibration record", () => {
    it("Navigate to Equipment document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails, CyRoutes.DocPreview, CyRoutes.EmployeesGet], () => {
        cy.visit(equipmentURL);
      });
    });

    it("Click 'NEW PM' on calibration section", () => {
      cy.url().then((url: any) => {
        const docIdFromUrl = url.split("/").pop();
        // eslint-disable-next-line max-len
        const newPMUrl = `${CONFIG.FE_URL}/document_revision/${createdCalibrationFormDocumentId}/create_maintenance/${docIdFromUrl}/${calibrationSchemaFieldName}`;
        cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails,
          CyRoutes.GetAvailableApprovers,
          CyRoutes.GetAutocompleteOptions], () => {
          cy.visit(newPMUrl);
        });
      });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Calibration document'", () => {
      cy.drEnterDocumentTitle({ name: "Calibration document" });
    });

    it("Select document type 'Maintenance Record'", () => {
      cy.drSelectDocumentType({ documentType: "Maintenance Record" });
    });

    it("Select revision stage 'Numeric'", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it(`Select maintainer '${ADMIN_USER.name}'`, () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"equipment_maintainer\"]").arrowClick();
      cy.get("ul>li[role=\"option\"]").contains(ADMIN_USER.name).arrowClick();
    });

    it("Fill 'Completion Date'", () => {
      const dayOfTheMonth = moment().tz("America/Los_Angeles").date();
      cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").arrowClick();

      cy.get("button.MuiPickersDay-day")
        .not(".MuiPickersDay-hidden")
        .each(($el) => {
          const dayNumber = $el.text();
          cy.log(dayNumber);
          if (dayOfTheMonth.toString() === dayNumber) {
            cy.wrap($el).arrowClick();
          }
        });

    });

    it("Create 'Calibration document'", () => {
      cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: true });
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverList({ approver: ADMIN_USER.name });
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAvailableApprovers], () => {
        cy.ebApprove();
      });
    });

    it("Verify status is 'Released'", () => {
      cy.drCheckDocumentStatus({ status: "Released" });
      cy.wait(10000);
    });
  });

  context("Verify Maintenance History is now only History", () => {
    it("Navigate to Equipment document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails, CyRoutes.DocPreview, CyRoutes.EmployeesGet], () => {
        cy.visit(equipmentURL);
      });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    context("Verify Maintenance History is changed to History", () => {
      it("Verify for pm", () => {
        cy.get("[data-cy=\"document.revision.history\"]").should("have.length", "2");
        cy.get("[data-cy=\"document.revision.history\"]").eq(0).should("have.text", "History");
      });

      it("Verify for calibration", () => {
        cy.get("[data-cy=\"document.revision.history\"]").eq(1).should("have.text", "History");
      });
    });
  });

  context("Verify Due date calculation", () => {
    it("Check preventative maintenance due date calculation is 365 days from now", () => {
      const prevMaintenanceComplianceDate = moment().tz("America/Los_Angeles")
        .add(365, "days")
        .format("ddd, MMMM D, YYYY");
      cy.get("[data-cy=\"maintenance.status\"]")
        .eq(0).then(($el) => {
          const text = $el.text().replace(/\u00a0/g, "");
          expect(text).to.contain(`PMDone - Due Date: ${prevMaintenanceComplianceDate}`);
        });
    });

    it("Check calibration due date calculation is 365 days from now", () => {
      const calibrationComplianceDate = moment().tz("America/Los_Angeles")
        .add(365, "days")
        .format("ddd, MMMM D, YYYY");
      cy.get("[data-cy=\"maintenance.status\"]")
        .eq(1).then(($el) => {
          const text = $el.text().replace(/\u00a0/g, "");
          expect(text).to.contain(`CALDone - Due Date: ${calibrationComplianceDate}`);
        });
    });
  });

  context("Revise PM completion date to 10 days earlier", () => {
    it("Navigate to records", () => {
      cy.navigToRecords();
    });

    it("Select PM document", () => {
      cy.recFilterRecordListByNameAndStatus({ title: "Preventative maintenance", status: "Released" });
    });

    it("Click revise on maintenance record", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev, CyRoutes.EmployeesGet], () => {
        cy.drClickReviseDocument();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Change 'Completion Date' to 10 days prior", () => {
      const completionDate = moment().tz("America/Los_Angeles").subtract(10, "days");
      const month = completionDate.format("MMMM");
      const day = completionDate.format("D");

      cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").arrowClick();
      cy.get("div.MuiPickersCalendarHeader-transitionContainer").then(($el) => {
        const monthYearText = $el.text();

        if (!monthYearText.includes(month)) {
          cy.get("div.MuiPickersCalendarHeader-switchHeader>button").eq(0).arrowClick();
        }

        cy.get("button.MuiPickersDay-day")
          .not(".MuiPickersDay-hidden")
          .each(($el) => {
            const dayNumber = $el.text();

            if (day === dayNumber) {
              cy.wrap($el).arrowClick();
            }
          });
      });
    });

    it("Add approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record", () => {
      cy.ebApprove();
    });
  });

  context("Revise Calibration completion date to 10 days later", () => {
    it("Navigate to records", () => {
      cy.navigToRecords();
    });

    it("Select PM document", () => {
      cy.recFilterRecordListByNameAndStatus({ title: "Calibration document", status: "Released" });
    });

    it("Click revise on maintenance record", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev, CyRoutes.EmployeesGet], () => {
        cy.drClickReviseDocument();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Change 'Completion Date' to 10 days later", () => {
      const completionDate = moment().tz("America/Los_Angeles").add(10, "days");
      const month = completionDate.format("MMMM");
      const day = completionDate.format("D");

      cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").arrowClick();
      cy.get("div.MuiPickersCalendarHeader-transitionContainer").then(($el) => {
        const monthYearText = $el.text();

        if (!monthYearText.includes(month)) {
          cy.get("div.MuiPickersCalendarHeader-switchHeader>button").eq(1).arrowClick();
        }

        cy.wait(500);
        cy.get("button.MuiPickersDay-day")
          .not(".MuiPickersDay-hidden")
          .each(($el) => {
            const dayNumber = $el.text();

            if (day === dayNumber) {
              cy.wrap($el).arrowClick();
            }
          });
      });
    });

    it("Add approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record", () => {
      cy.ebApprove();
      cy.wait(10000);
    });
  });

  context("Verify Due date calculation", () => {
    it("Navigate to Equipment document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails, CyRoutes.DocPreview, CyRoutes.EmployeesGet], () => {
        cy.visit(equipmentURL);
      });
    });

    it("Check preventative maintenance due date calculation is 365 days from completion date", () => {
      const prevMaintenanceComplianceDate = moment().tz("America/Los_Angeles")
        .add(355, "days")
        .format("ddd, MMMM D, YYYY");
      cy.get("[data-cy=\"maintenance.status\"]")
        .eq(0).then(($el) => {
          const text = $el.text().replace(/\u00a0/g, "");
          expect(text).to.contain(`PMDone - Due Date: ${prevMaintenanceComplianceDate}`);
        });
    });

    it("Check calibration due date calculation is 365 days from completion date", () => {
      const calibrationComplianceDate = moment().tz("America/Los_Angeles")
        .add(375, "days")
        .format("ddd, MMMM D, YYYY");
      cy.get("[data-cy=\"maintenance.status\"]")
        .eq(1).then(($el) => {
          const text = $el.text().replace(/\u00a0/g, "");
          expect(text).to.contain(`CALDue - Due Date: ${calibrationComplianceDate}`);
        });
    });
  });
});
