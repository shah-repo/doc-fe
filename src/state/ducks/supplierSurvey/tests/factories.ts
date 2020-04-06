import faker from "faker";
import { FBFormTemplateProps } from "../../../../ui/form.builder/types/formik";
import { getDocumentRevision } from "../../documentRevisions/tests/factories";
import { SupplierSurveyForm } from "../types";

export const getFormTemplate = (formTemplate: Partial<FBFormTemplateProps> = {}): FBFormTemplateProps => ({
  outputDocumentType: [{
    id: faker.random.uuid(),
  }],
  schema: [{
    type: "textfield",
    index: 0,
    name: faker.random.word(),
    label: faker.random.word(),
  }],
});

export const getSurveyFormDocumentRevision = (supplierSurvey: Partial<SupplierSurveyForm> = {}): SupplierSurveyForm => ({
  createdAt: faker.date.recent().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  id: faker.random.word(),
  token: faker.random.uuid(),
  surveyFormDocumentRevision: { ...getDocumentRevision(), formTemplate: getFormTemplate() },
  surveySubmission: null,
});
