import { find, isEmpty, some } from "lodash";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { ApprovalStatus } from "../../../state/ducks/documents";
import { FBFormState, FBSchemaProps } from "../../form.builder";

export const getInlineApprovalFields = (schema?: FBSchemaProps[]) => {
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
const isSectionApproved = (fieldName: string, documentRevision: DocumentRevision, formState: FBFormState) => (
  documentRevision?.version > 1 &&
  isEmpty(getFieldApprovals(fieldName, documentRevision)) &&
  Boolean(formState?.getFieldValue(fieldName))
) ? some(getFieldApprovals(fieldName, documentRevision), (approval) => approval.status === ApprovalStatus.Approved)
|| !getFieldApprovals(fieldName, documentRevision)?.length
  : find(getFieldApprovals(fieldName, documentRevision), { status: ApprovalStatus.Approved }) !== undefined;

/** Filter approvals by field.
  * @param fieldName Unique name of the form field.
  */
const getFieldApprovals = (fieldName: string, documentRevision: DocumentRevision) =>
 documentRevision.approvals?.filter((app) => app.fieldId === fieldName);
