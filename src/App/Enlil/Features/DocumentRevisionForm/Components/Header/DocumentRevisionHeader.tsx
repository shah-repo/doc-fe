import { Box } from '@material-ui/core';
import { Observer } from 'mobx-react';
import React from 'react';
import { DocumentRevisionHeaderProps, SM } from '../../../../..';
import { DOCUMENT_REVISION_CREATE_URL } from '../../../../../../ui/constants/urls';
import FormHeader from '../../../../../../ui/document.revision/header/FormHeader';
import { withDocumentRevisionHeaderWrap } from './DocumentRevisionHeader.wrap';

// Prep for switching the form header here
const DocumentRevisionHeader: React.FunctionComponent<DocumentRevisionHeaderProps> = ({
  _documentRevisionFormState,
  bannerPortal,
  documentRevisionId,
  shouldShowUpgrade,
  setDoNotPrompt,
}) => {
  const isCreateUrl = SM.pathname.includes(DOCUMENT_REVISION_CREATE_URL);
  return (
    <Box minHeight={isCreateUrl ? 64 : 84 }>
      <Observer>
        {() => (
          <FormHeader
            isCreateDocumentDisabled={_documentRevisionFormState?.createDocumentDisabled || false}
            {...{ setDoNotPrompt }}
          />
        )}
      </Observer>
    </Box>
  );
};

export default withDocumentRevisionHeaderWrap(DocumentRevisionHeader);
