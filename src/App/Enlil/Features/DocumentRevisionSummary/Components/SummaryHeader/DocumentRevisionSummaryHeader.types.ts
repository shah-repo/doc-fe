import { DocumentRevisionSummaryProps, SMProviderProps } from "../../../../..";
import { TooltipLabelConfig } from "../../../../../../state/ducks/documentRevisions/documentType/types";

export type DocumentRevisionSummaryHeaderProps =
& Pick<SMProviderProps, "_documentRevisionFormState">
& Pick<DocumentRevisionSummaryProps, "documentRevision">
& {
  isCRLinkVisible?: boolean;
  isTitleVisible?: boolean;
  isDescriptionVisible?: boolean;
  tooltipConfig?: TooltipLabelConfig;
  titleLabel?: string;
  name?: string;
  descriptionLabel?: string;
  description?: string;
};
