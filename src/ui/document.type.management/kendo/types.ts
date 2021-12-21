// Document Type Management
export interface DocumentTypeManagementProps {
  field: string;
  title: string;
  cell?: any;
  filter?: "boolean" | "numeric" | "text" | "date" | undefined;
  filterCell?: any;
  show?: boolean;
  columnMenu?: any;
  width?: string;
  locked?: boolean;
  filterable?: boolean;
}
