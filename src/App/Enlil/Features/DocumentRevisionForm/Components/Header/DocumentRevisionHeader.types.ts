import { DocumentRevisionFormHOCProps, DocumentRevisionFormProps } from "../../../../..";

export type DocumentRevisionHeaderProps =
& Pick<DocumentRevisionFormProps, "bannerPortal" | "shouldShowUpgrade">
& DocumentRevisionFormHOCProps
& {
  documentRevisionId?: string;
};
