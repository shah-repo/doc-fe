import React from "react";
import { Audit } from "../../../state/ducks/changeRequest";
import { Attachment } from "../../../state/ducks/attachments";
import { Approval, User } from "../../../state/ducks/common";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import Text from "../../components/Text";

interface OwnProps {
  audit: Audit[];
}

export type AuditPresenterProps = OwnProps;

export const AuditPresenter: React.FunctionComponent<AuditPresenterProps> = ({
  audit,
}) => {
  const getNextValue = (change: Audit) => {
    switch (change.field) {
      case "attachments":
        const attachment = change.nextValue as Attachment;
        return attachment.name;
      case "approvals":
        const approval = change.nextValue as Approval;
        return approval.approver.name;
      case "approvers":
        const approver = change.nextValue as User;
        return approver.name;
      case "documentRevisions":
        const documentRevision = change.nextValue as DocumentRevision;
        return documentRevision.description;
      default:
        return change.nextValue;
    }
  };

  return (
    <div style={{ marginLeft: 50 }}>
      {
        audit.map((change, index) => {
          let nextValue = getNextValue(change);

          return (
            <div
              key={index}
              style={{
                borderBottom: '1px solid lightgray',
                marginBottom: 20,
              }}
            >
              <div>
                <Text message={`changeRequest.audit.${change.field}.${change.type}`} />
              </div>
              {nextValue}
            </div>
          );
        })
      }
    </div>
  );
};

export default AuditPresenter;
