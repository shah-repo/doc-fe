import { find, isEmpty, some } from "lodash";
import { DocumentRevision, RevisionChangeType } from "../../../state/ducks/documentRevisions";
import { ApprovalStatus } from "../../../state/ducks/documents";
import { FBFormState, FBSchemaProps } from "../../form.builder";
import { checkIsDocumentRecord } from "./checkDocumentGroup";

const getInlineApprovalFields = (schema?: FBSchemaProps[]) => {
  if (!schema) { return []; }
  return schema.filter((field) => (field.type === "inlineapproval" as string));
};

export const isFormWithInlineApproval = (schema?: FBSchemaProps[]) => {
  if (!schema) { return false; }
  const inlineApprovalFields = getInlineApprovalFields(schema);
  return Boolean(inlineApprovalFields && inlineApprovalFields.length > 0);
};

/** Every form field that is inline approval should have
   * at least one approval in status approved in order to be considered as approved. */
export const isInlineFormApproved = (documentRevision, formState, schema) => {
  const inlineApprovalFields = getInlineApprovalFields(schema);
  return inlineApprovalFields.every((field) => isInlineSectionApproved(documentRevision, formState, schema));
};

const isInlineSectionApproved = (documentRevision, formState, schema?: FBSchemaProps[]) => {
  if (!schema) { return false; }
  const inlineApprovalFields = getInlineApprovalFields(schema);
  return inlineApprovalFields?.every((field) => isSectionApproved(field.name || "", documentRevision, formState));
};

/** Function that checks if a form section is approved.
   * @param fieldName Unique name of the form field.
  */
const isSectionApproved = (fieldName: string, documentRevision: DocumentRevision, formState: FBFormState) => {
  const fieldApprovals = getFieldApprovals(fieldName, documentRevision);
  if (
    documentRevision?.version > 1 &&
    isEmpty(fieldApprovals) &&
    Boolean(formState?.getFieldValue(fieldName))
  ) {
    return some(fieldApprovals, (approval) => approval.status === ApprovalStatus.Approved)
    || !fieldApprovals?.length;
  }
  return find(fieldApprovals, { status: ApprovalStatus.Approved }) !== undefined; };

/** Filter approvals by field.
  * @param fieldName Unique name of the form field.
  */
const getFieldApprovals = (fieldName: string, documentRevision: DocumentRevision) =>
 documentRevision.approvals?.filter((app) => app.fieldId === fieldName);

export const getShouldShowUpgradeForRecord = (documentRevision: DocumentRevision) => {
  const isInlineApproval = isFormWithInlineApproval(documentRevision?.formDocument?.formTemplate?.schema);
  const isRecord = checkIsDocumentRecord(documentRevision?.document?.documentType?.groupOptions);
  const version = documentRevision?.version;
  const isAdministrativeChange = documentRevision?.revisionChangeType === RevisionChangeType.AdministrativeChange;

  return (isRecord && !isInlineApproval && version === 1) || (isInlineApproval && !isAdministrativeChange);
};
