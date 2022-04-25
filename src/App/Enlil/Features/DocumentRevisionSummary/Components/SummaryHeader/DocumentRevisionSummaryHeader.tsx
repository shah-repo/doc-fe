import { Box, Collapse } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { DocumentRevisionSummaryHeaderProps } from "../../../../..";
import SummaryField from "../../../../../../ui/common/summary/base";
import SummaryFieldWithHtml from "../../../../../../ui/common/summary/baseWithHtml";
import ChangeRequestLink from "../../../../../../ui/document.revision/summary/changeRequestLink";
import { styles as AutoCompleteStyles } from "../../../../../../ui/form.builder/styles/FBAutocomplete.styles";
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
      <Collapse in={!_documentRevisionFormState?.isHeaderHidden}>
        <Box py={3} px={6}>
          {isCRLinkVisible && <ChangeRequestLink dataProp={documentRevision} />}
          {isTitleVisible && (
            <CustomLabelTooltip {...{ tooltipConfig }}>
              <SummaryField label={titleLabel} value={name} labelProps={AutoCompleteStyles.labelProps} labelFont={AutoCompleteStyles.labelFont} />
            </CustomLabelTooltip>
          )}
          {isDescriptionVisible && (
            <SummaryFieldWithHtml label={descriptionLabel} value={description} labelProps={AutoCompleteStyles.labelProps} labelFont={AutoCompleteStyles.labelFont} />
          )}
        </Box>
      </Collapse>
    )}
  </Observer>
);

export default withDocumentRevisionSummaryHeader(DocumentRevisionSummaryHeader);
