import React from "react";
import { Audit } from "../../../state/ducks/changeRequest";

interface OwnProps {
  change: Audit;
}

export type AuditChangeProps = OwnProps;

export const AuditPresenter: React.FunctionComponent<AuditChangeProps> = ({
  change,
}) => {
  let nextValue: any;

  if (typeof(change.nextValue) === "string") {
    nextValue = change.nextValue;
  } 

  switch (change.field) {
    case "attachments":
      nextValue = change.nextValue;
      break;
    case "approvals":
      nextValue = change.nextValue;
      break;
    case "approvers":
      nextValue = change.nextValue;
      break;
    case "documentRevisions":
      nextValue = change.nextValue;
      break;
    default:
      nextValue =  change.nextValue;
      break;
  }

  return (
    <div>
      {nextValue}
    </div>
  );
};

export default AuditPresenter;
