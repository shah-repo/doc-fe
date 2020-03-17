import React, { Fragment } from "react";
import { Attachment } from "../../state/ducks/attachments";
import { Audit } from "../../state/ducks/audit";
import { ChangeRequest } from "../../state/ducks/changeRequest";
import { Approval, Owner, User } from "../../state/ducks/common";
import { DocumentRevision, Reference } from "../../state/ducks/documentRevisions";
import { DocumentType } from "../../state/ducks/documentRevisions/documentType";
import { getAuditDefaultValue } from "../common/utils/audit";
import Text from "../components/Text";
import DateTime from "./DateTime";
import DialogOpener from "./textDiff/DialogOpener";

interface OwnProps {
  audit: Audit;
}

export type Props = OwnProps;

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
    case "assessments.regulatory.attachments": {
      const { name, type } = audit.nextValue as Attachment;
      returnValue = `${name}.${type}`;
      break;
    }
    case "approvals":
      returnValue = (audit.nextValue as Approval).approver.user.name;
      break;
    case "approvers":
      returnValue = (audit.nextValue as User).name;
      break;
    case "tasks.assigned":
    case "owner":
      returnValue = (audit.nextValue as Owner).user.name;
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
    case "documentType":
      returnValue = (audit.nextValue as DocumentType).documentTypeName;
      break;
    case "approvals.status":
    case "state":
      returnValue = (
        <Text
          translation="changeRequest.audit.status.updated.by"
          values={{
            status: audit.nextValue as string,
            name: audit.owner.user.name,
          }}
        />
      );
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
