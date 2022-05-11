import { Box } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { DocumentRevisionSummaryHeaderProps } from "../../../../..";
import SummaryField from "../../../../../../ui/common/summary/NewBase";
import SummaryFieldWithHtml from "../../../../../../ui/common/summary/NewBaseWithHtml";
import ChangeRequestLink from "../../../../../../ui/document.revision/summary/changeRequestLink";
import CustomLabelTooltip from "../../../../../../ui/hooks/docCustomization/CustomLabelTooltip";
import { withDocumentRevisionSummaryHeader } from "./DocumentRevisionSummaryHeader.wrap";

const DocumentRevisionSummaryHeader: React.FunctionComponent<DocumentRevisionSummaryHeaderProps> = ({
  _documentRevisionFormState,
  documentRevision,
  isCRLinkVisible,
  isTitleVisible,
  isDescriptionVisible,
  tooltipConfig,
  titleLabel,
  name,
  descriptionLabel,
  description,
}) => (
  <Observer>
    {() => (
      <Box px={4.25} pt={0.75}>
        {isCRLinkVisible && <ChangeRequestLink dataProp={documentRevision} />}
        {isTitleVisible && (
          <CustomLabelTooltip {...{ tooltipConfig }}>
            <SummaryField label={titleLabel} value={name} />
          </CustomLabelTooltip>
        )}
        {isDescriptionVisible && (
          <SummaryFieldWithHtml label={descriptionLabel} value={description} />
        )}
      </Box>
    )}
  </Observer>
);

export default withDocumentRevisionSummaryHeader(DocumentRevisionSummaryHeader);
