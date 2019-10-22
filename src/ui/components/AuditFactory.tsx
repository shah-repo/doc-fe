import _ from "lodash";
import React, { Fragment } from "react";
import { Attachment } from "../../state/ducks/attachments";
import { Audit } from "../../state/ducks/audit";
import { ChangeRequest } from "../../state/ducks/changeRequest";
import { Approval, User } from "../../state/ducks/common";
import { DocumentRevision, Reference } from "../../state/ducks/documentRevisions";
import DateTime from "./DateTime";
import DialogOpener from "./textDiff/DialogOpener";

interface OwnProps {
  audit: Audit;
}

export type Props = OwnProps;

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
};

export const AuditFactory: React.FunctionComponent<Props> = ({
  audit,
}) => {
  let returnValue;

  if (!audit.nextValue) {
    return <Fragment>N/A</Fragment>;
  }

  switch (audit.field) {
    case "attachments":
    case "justifications.attachments":
    case "assessments.process.attachments":
    case "assessments.design.attachments":
    case "assessments.regulatory.attachments":
      const { name, type } = audit.nextValue as Attachment;
      returnValue = `${name}.${type}`;
      break;
    case "approvals":
      returnValue = (audit.nextValue as Approval).approver.name;
      break;
    case "approvers":
    case "tasks.assigned":
      returnValue = (audit.nextValue as User).name;
      break;
    case "documentRevisions":
      returnValue = (audit.nextValue as DocumentRevision).name;
      break;
    case "tasks.dueDate":
    case "effectiveDate":
      returnValue = <DateTime value={audit.nextValue as string} />;
      break;
    case "justifications.description":
    case "tasks.description":
    case "description":
      returnValue = <DialogOpener id={audit.id} text={audit.nextValue as string} />;
      break;
    case "referenceTo":
      returnValue = (audit.nextValue as Reference).docId;
      break;
    case "changeRequest":
      returnValue = (audit.nextValue as ChangeRequest).crId;
      break;
    default:
      returnValue = getAuditDefaultValue(audit.nextValue);
  }

  return (
    <Fragment>
      {returnValue}
    </Fragment>
  );
};

export default AuditFactory;
