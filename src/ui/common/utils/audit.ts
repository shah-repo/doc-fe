import _ from "lodash";
import { Audit } from "../../../state/ducks/audit/types";
import { Attachment } from "../../../state/ducks/attachments";
import { Approval, User } from "../../../state/ducks/common";
import { DocumentRevision, Reference } from "../../../state/ducks/documentRevisions";
import DateTime from "../../components/DateTime";
import DialogOpener from "../../components/textDiff/DialogOpener";
import { ChangeRequest } from "../../../state/ducks/changeRequest";

/**
 * Return nextValue only if string, otherwise it will crash FE
 * @param {any} nextValue Any audit type
 * @returns {string} nextValue if string, otherwise returns "N/A"
 */
export const getAuditDefaultValue = (nextValue: any): string => {
  if (_.isString(nextValue)) {
    return nextValue;
  }
  
  return "N/A";
}

export const getNextValue = (audit: Audit) => {
  if (!audit.nextValue) {
    return "N/A";
  }

  switch (audit.field) {
    case "attachments":
    case "justifications.attachments":
    case "assessments.process.attachments":
    case "assessments.design.attachments":
    case "assessments.regulatory.attachments":
      const { name, type } = audit.nextValue as Attachment;
      return `${name}.${type}`;
    case "approvals":
      return (audit.nextValue as Approval).approver.name;
    case "approvers":
    case "tasks.assigned":
      return (audit.nextValue as User).name;
    case "documentRevisions":
      return (audit.nextValue as DocumentRevision).name;
    case "tasks.dueDate":
    case "effectiveDate":
      return DateTime({ value: audit.nextValue as string });
    case "justifications.description":
    case "tasks.description":
    case "description":
      // id currently not included in audit
      return DialogOpener({ id: "123", text: audit.nextValue as string });
    case "referenceTo":
      return (audit.nextValue as Reference).docId;
    case "changeRequest":
      return (audit.nextValue as ChangeRequest).crId;
    default:
      return getAuditDefaultValue(audit.nextValue);
  }
};