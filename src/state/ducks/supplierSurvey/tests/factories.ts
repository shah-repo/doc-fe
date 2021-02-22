import faker from "faker";
import { SupplierSurveyForm } from "..";
import { FBFormTemplateProps } from "../../documentRevisions";
import { getDocumentRevision } from "../../documentRevisions/tests/factories";

export const getFormTemplate = (formTemplate: Partial<FBFormTemplateProps> = {}): FBFormTemplateProps => ({
  outputDocumentTypes: [{
    id: faker.random.uuid(),
    documentTypeName: faker.random.word(),
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
