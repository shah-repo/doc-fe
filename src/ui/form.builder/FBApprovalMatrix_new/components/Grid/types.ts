import { DocumentRevisionStatus } from "../../../../../state/ducks/documentRevisions/types";
import { TablePanelStateProps } from "../../../../components/table/types";

export interface KendoPresenterProps {
  statuses?: DocumentRevisionStatus | DocumentRevisionStatus[];
  tableName: string;
  tableCriteria: TablePanelStateProps;
  schema: object;
  defaultPayloadData: object;
}

export enum DateFields {
  CREATED_AT= "createdAt",
  DUE_ON= "dueOn",
  COMPLETED_AT="completedAt"
}
