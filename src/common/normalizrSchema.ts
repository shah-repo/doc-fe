import { schema } from "normalizr";

// copied from BE, src/utils/normalizr/normalizrSchema.ts

const userSch = new schema.Entity("User", {});
const employeeSch = new schema.Entity("Employee", {});
const groupSch = new schema.Entity("Group", {});
export const docRevSch = new schema.Entity("DocumentRevision", {});
const documentSch = new schema.Entity("Document", {});
const documentTypeSch = new schema.Entity("DocumentType", {});
export const changeRequestSch = new schema.Entity("ChangeRequest", {});
const companySch = new schema.Entity("Company", {});
const approvalSch = new schema.Entity("Approval", {});
const taskSch = new schema.Entity("Task", {});
const implPlanSch = new schema.Entity("ImplementationPlan", {});
const trainingPlanSch = new schema.Entity("TrainingPlan", {});
const trainingRecordsSch = new schema.Entity("TrainingRecord", {});
const suppSurvReqSch = new schema.Entity("SupplierSurveyRequest", {});
const attachmentSch = new schema.Entity("Attachment", {});
const attachmentWatermarkSch = new schema.Entity("AttachmentWatermark", {});
const pdfSch = new schema.Entity("PDFAsAttachment", {});

employeeSch.define({
  user: userSch,
});
groupSch.define({
  employees: [employeeSch],
  parents: [groupSch],
  children: [groupSch],
  joinedParents: [groupSch],
  joinedChildren: [groupSch],
  joinedEmployees: [employeeSch],
});
docRevSch.define({
  document: documentSch,
  owner: employeeSch,
  referenceTo: [documentSch],
  changeRequest: changeRequestSch,
  company: companySch,
  parents: [groupSch],
  children: [groupSch],
});
documentSch.define({
  referencedBy: [docRevSch],
  operators: [employeeSch],
  documentType: documentTypeSch,
});
approvalSch.define({
  changeRequest: changeRequestSch,
  documentRevision: docRevSch,
});
implPlanSch.define({
  changeRequest: changeRequestSch,
});
taskSch.define({
  assigned: employeeSch,
  implementationPlan: implPlanSch,
  changeRequest: changeRequestSch,
  documentRevision: docRevSch,
});
trainingRecordsSch.define({
  documentRevision: docRevSch,
});
trainingPlanSch.define({
  employee: employeeSch,
  document: documentSch,
  trainingRecords: [trainingRecordsSch],
});
suppSurvReqSch.define({
  surveyFormDocumentRevision: docRevSch,
});
attachmentWatermarkSch.define({
  requestedBy: employeeSch,
});
pdfSch.define({
  documentRevision: docRevSch,
});
pdfSch.define({
  documentRevision: docRevSch,
});
attachmentSch.define({
  documentRevisions: [docRevSch],
  inheritedOnDocumentRevisions: [docRevSch],
  documentRevision: docRevSch,
  implPlan: implPlanSch,
  task: taskSch,
  owner: employeeSch,
  watermarks: [attachmentWatermarkSch],
  pdf: pdfSch,
});

export class NormalizerData {
  constructor({ entities, result }) {
    this.entities = entities;
    this.result = result;
  }
  entities: any;
  result: any;
}
