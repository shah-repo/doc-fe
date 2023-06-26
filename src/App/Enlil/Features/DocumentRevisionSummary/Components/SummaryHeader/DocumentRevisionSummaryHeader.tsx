import { Box } from '@material-ui/core';
import { Observer } from 'mobx-react';
import React from 'react';
import { DocumentRevisionSummaryHeaderProps } from '../../../../..';
import SummaryField from '../../../../../../ui/common/summary/NewBase';
import SummaryFieldWithHtml from '../../../../../../ui/common/summary/NewBaseWithHtml';
import ChangeRequestLink from '../../../../../../ui/document.revision/summary/changeRequestLink';
import CustomLabelTooltip from '../../../../../../ui/hooks/docCustomization/CustomLabelTooltip';
import { withDocumentRevisionSummaryHeader } from './DocumentRevisionSummaryHeader.wrap';

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
      <Box px={4.25} paddingBottom={2.5}>
        {isCRLinkVisible && documentRevision.changeRequest && <Box py={2}>
          <ChangeRequestLink dataProp={documentRevision} />
        </Box>}
        <Box paddingBottom={2} paddingTop={1}>
          {isTitleVisible && (
            <CustomLabelTooltip {...{ tooltipConfig }}>
              <SummaryField label={titleLabel} value={name} />
            </CustomLabelTooltip>
          )}
        </Box>
        {isDescriptionVisible && (
          <SummaryFieldWithHtml label={descriptionLabel} value={description}
            _documentRevisionFormState={_documentRevisionFormState} />
        )}
      </Box>
    )}
  </Observer>
);

export default withDocumentRevisionSummaryHeader(DocumentRevisionSummaryHeader);
