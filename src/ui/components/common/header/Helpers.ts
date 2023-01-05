import { POStatusType } from "../../../../state/ducks/documentRevisions/types";

export enum FormHeaderStatusClassMapping {
  "Pending Approval"="PENDING_STATUS",
  "In Review"="PENDING_STATUS",
  "IN REVIEW" = "PENDING_STATUS",
  "Pending Change"="WIP_STATUS",
  "PENDING CHANGE"="WIP_STATUS",
  "IN_REVIEW" = "PENDING_STATUS",
  "Approved"="PENDING_STATUS",
  "Quarantine" = "PENDING_STATUS",
  "Accepted"="GREEN_STATUS",
  "Released"="GREEN_STATUS",
  "RELEASED"="GREEN_STATUS",
  "Completed"="GREEN_STATUS",
  "Last Signed"="GREEN_STATUS",
  "History"="GREEN_STATUS",
  "APPROVED" = "GREEN_STATUS",
  "Archive"="GREEN_STATUS",
  "Obsolete"="RED_STATUS",
  "OBSOLETE"="RED_STATUS",
  "WIP" = "WIP_STATUS",
  "Voided"="RED_STATUS",
  "CLOSED" = "CLOSED_STATUS",
  "CANCELED" = "CLOSED_STATUS",
  "Canceled" = "CLOSED_STATUS",
  "VOIDED" = "RED_STATUS",
  "Superseded"="GREEN_STATUS",
  "Void"="RED_STATUS",
  "IMPLEMENTATION"="GREEN_STATUS",
  "Implementation"="GREEN_STATUS",
}

export const getPOStatusLabel = (poStatus) => {
  let label = "form.builder.header.po.status.open";
  switch (poStatus) {
    case POStatusType.CLOSE:
      label = "form.builder.header.po.status.close";
      break;
    case POStatusType.VOID:
      label = "form.builder.header.po.status.void";
      break;
    case POStatusType.VOIDED:
      label = "form.builder.header.po.status.voided";
      break;
    default:
  }
  return label;
};
