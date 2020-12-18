import { Box } from "@material-ui/core";
import React, { Fragment } from "react";
import { getFormattedDateString, MomentFormats } from "../../common/utils/date";
import { Attachment } from "../../state/ducks/attachments";
import { Audit } from "../../state/ducks/audit";
import { Group } from "../../state/ducks/auth/types";
import { ChangeRequest } from "../../state/ducks/changeRequest";
import { Approval, ApprovalStatus, Owner } from "../../state/ducks/common";
import { Employee } from "../../state/ducks/company";
import { DocumentRevision, Reference } from "../../state/ducks/documentRevisions";
import { DocumentType } from "../../state/ducks/documentRevisions/documentType";
import { getAuditDefaultValue } from "../common/utils/audit";
import Text from "../components/Text";
import { Translation } from "../translations/types";
import AuditAttachment from "./AuditAttachment";
import AuditAutocomplete from "./AuditAutocomplete";
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
  const isFBField = audit.field.includes("formInput");
  const { nextValue, previousValue } = audit;
  const { type = "" } = audit.fbSchemaItem || {};
  let auditValue: any = nextValue;

  if (!auditValue || auditValue === "undefined") {
    auditValue = previousValue;
  }

  if (!auditValue || auditValue === "undefined") {
    return <Fragment>N/A</Fragment>;
  }

  if (isFBField) {
    const fbValue = {
      texteditor() {
        return (
          <div style={{ width: "100%", height: "100%" }} dangerouslySetInnerHTML={{ __html: auditValue as string }}/>
        );
      },
      datepicker() {
        return (
          <Box>
            {getFormattedDateString(auditValue as string, MomentFormats.MonthDateYear)}
          </Box>
        );
      },
      autocomplete() {
        return <AuditAutocomplete audit={audit} />;
      },
      fileupload() { return (<AuditAttachment audit={audit} />); },
      checkboxgroup() {
        let arrayValue: string[] = [];
        try {
          arrayValue = JSON.parse(auditValue);
        } catch {
          arrayValue.push(auditValue);
        }
        return (<div>{arrayValue.join(", ")}</div>);
      },
      default() { return (<div data-cy={dataCy}>{getAuditDefaultValue(auditValue)}</div>); },
    };
    returnValue = (fbValue[type] || fbValue.default)();

  } else {
    switch (audit.field) {
      case "attachments":
      case "justifications.attachments":
      case "assessments.process.attachments":
      case "assessments.design.attachments":
      case "assessments.regulatory.attachments": {
        const { name, type } = audit.nextValue as Attachment;
        returnValue = (<div data-cy={dataCy}>{`${name}.${type}`}</div>);
        break;
      }
      case "approvals":
        returnValue = (audit.nextValue as Approval).approver.user.name;
        break;
      case "approvals.approver":
        returnValue = (audit.nextValue as Employee).user?.name;
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
        returnValue = getFormattedDateString(audit.nextValue as string, MomentFormats.MonthDateYear);
        break;
      case "justifications.description":
      case "tasks.description":
      case "description":
        returnValue = <DialogOpener id={audit.id} text={audit.nextValue as string} dataCy={dataCy} />;
        break;
      case "referenceTo":
        returnValue = (<div data-cy={dataCy}>{(audit.nextValue as Reference).docId}</div>);
        break;
      case "changeRequest":
        returnValue = (audit.nextValue as ChangeRequest).crId;
        break;
      case "documentType":
        returnValue = (audit.nextValue as DocumentType).documentTypeName;
        break;
      case "approvals.status":
      case "status":
        if (audit.nextValue === ApprovalStatus.Abandoned) {
        /** Temporary solution until BE adds additional info (who was abandoned) to audit.
         * TODO: should be replaced with abandoned approval's name.
        */
          returnValue = "";
          break;
        }
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
      case "state":
        // Added for closing AR in the future because there is no owner
        if (audit.nextValue === "CLOSED" && !audit.owner) {
          returnValue = (<div data-cy={dataCy}>
            {(audit.nextValue as string)}{"-"}
            <Text translation={"common.server.automation"} />
          </div>);
          break;
        }
        returnValue = (<div data-cy={dataCy}>{(audit.nextValue as string)}</div>);
        break;
      default:
        returnValue = (<div data-cy={dataCy}>{getAuditDefaultValue(audit.nextValue)}</div>);
    }
  }

  return (
    <Fragment>
      {returnValue}
    </Fragment>
  );
};

export default AuditFactory;
