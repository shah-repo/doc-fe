import React, { Fragment } from "react";
import { toStartOfDay } from "../../common/utils/date";
import { Attachment } from "../../state/ducks/attachments";
import { Audit } from "../../state/ducks/audit";
import { Group } from "../../state/ducks/auth/types";
import { ChangeRequest } from "../../state/ducks/changeRequest";
import { Approval, Owner, User } from "../../state/ducks/common";
import { DocumentRevision, Reference } from "../../state/ducks/documentRevisions";
import { DocumentType } from "../../state/ducks/documentRevisions/documentType";
import { getAuditDefaultValue } from "../common/utils/audit";
import Text from "../components/Text";
import { Translation } from "../translations/types";
import DateFormatter from "./Date";
import DialogOpener from "./textDiff/DialogOpener";

interface OwnProps {
  audit: Audit;
  dataCy?: string;
}

export type Props = OwnProps;

export const AuditFactory: React.FunctionComponent<Props> = ({
  audit, dataCy,
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
    case "securityEmployees":
      returnValue = (<div data-cy={dataCy}>{(audit.nextValue as Owner).user.name}</div>);
      break;
    case "documentRevisions":
      returnValue = (audit.nextValue as DocumentRevision).name;
      break;
    case "tasks.dueDate":
    case "effectiveDate":
      returnValue = <DateFormatter value={toStartOfDay(audit.nextValue as string)} />;
      break;
    case "justifications.description":
    case "tasks.description":
    case "description":
      returnValue = <DialogOpener id={audit.id} text={audit.nextValue as string} dataCy={dataCy} />;
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
    case "status":
      returnValue = (
        <Text
          dataCy={dataCy}
          translation="changeRequest.audit.status.updated.by"
          values={{
            status: <Text translation={audit.nextValue as Translation} />,
            name: audit.owner?.user.name,
          }}
        />
      );
      break;
    case "securityGroups":
      returnValue = (<div data-cy={dataCy}>{(audit.nextValue as Group).name}</div>);
      break;
    default:
      returnValue = (<div data-cy={dataCy}>{getAuditDefaultValue(audit.nextValue)}</div>);
  }

  return (
    <Fragment>
      {returnValue}
    </Fragment>
  );
};

export default AuditFactory;
