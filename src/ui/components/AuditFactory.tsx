import { Box } from "@material-ui/core";
import { get, has } from "lodash";
import React, { Fragment } from "react";
import { useIntl } from "react-intl";
import { getFormattedDateString, MomentFormats } from "../../common/utils/date";
import { convertHtmlEntities } from "../../common/utils/helpers";
import { Attachment } from "../../state/ducks/attachments/types";
import { Audit } from "../../state/ducks/audit/types";
import { Group } from "../../state/ducks/auth/types";
import { ChangeRequest } from "../../state/ducks/changeRequest/types";
import { Approval, ApprovalStatus, Owner } from "../../state/ducks/common/types";
import { Employee } from "../../state/ducks/company/types";
import { DocumentType } from "../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision, Reference } from "../../state/ducks/documentRevisions/types";
import { getAuditDefaultValue } from "../common/utils/audit";
import Text from "../components/Text";
import { Translation } from "../translations/types";
import AuditAttachment from "./AuditAttachment";
import AuditAutocomplete from "./AuditAutocomplete";
import AuditProcedure from "./AuditProcedure";
import DialogOpener from "./textDiff/DialogOpener";

interface OwnProps {
  audit: Audit;
  dataCy?: string;
}

type Props = OwnProps;

const AuditFactory: React.FunctionComponent<Props> = ({
  audit, dataCy,
}) => {
  let returnValue;
  const intl = useIntl();
  const isFBField = has(audit, "fbSchemaItem");
  const { nextValue, previousValue } = audit;
  const { type = "" } = audit.fbSchemaItem || {};
  let auditValue: any = nextValue;

  if (!auditValue || auditValue === "undefined") {
    auditValue = previousValue;
  }

  if (auditValue === "includeNone") {
    auditValue = intl.formatMessage({ id: "form.builder.none" });
  }

  if (`${auditValue}`.includes("includeContext")) {
    auditValue = intl.formatMessage({ id: "form.builder.other" });
  }

  if (!auditValue || auditValue === "undefined" || auditValue === "{}") {
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
      procedure() {
        if (audit.field === "fileUploadCandidate") {
          return <div data-cy={dataCy}>{get(auditValue, "name")}</div>;
        }
        return <AuditProcedure {...{ audit, dataCy, auditValue }} />;
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
      case "operators":
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
        returnValue = <DialogOpener
          id={audit.id}
          text={convertHtmlEntities(audit.nextValue as string)}
          dataCy={dataCy}
        />;
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
        if (audit?.approvalStatus === ApprovalStatus.Abandoned) {
          returnValue = (audit.nextValue as Employee).user?.name;
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
