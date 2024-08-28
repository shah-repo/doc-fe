import { Box } from '@material-ui/core';
import { Observer } from 'mobx-react';
import React from 'react';
import { DocumentRevisionFormHeaderProps, SM } from '../../../../..';
import { DOCUMENT_REVISION_CREATE_URL } from '../../../../../../ui/constants/urls';
import Title from '../../../../../../ui/document.revision/form/Title';
import ChangeRequestLink from '../../../../../../ui/document.revision/summary/changeRequestLink';
import Description from '../../../../../../ui/documentRevision/forms/presenters/Description';
import { withDocumentRevisionFormHeader } from './DocumentRevisionFormHeader.wrap';

const DocumentRevisionFormHeader: React.FunctionComponent<DocumentRevisionFormHeaderProps> = ({
  _documentRevisionFormState,
  isDisabledInput,
  inRestrictedEditMode,
  documentTypeId,
  type,
  inDialog,
}) => (
  <Observer>
    {() => (
      <Box
        id="SMHeaderTmpl"
        paddingTop={SM.pathname.includes(DOCUMENT_REVISION_CREATE_URL) ? 2 : 0}
        pl={3.25}
        pr={3.75}
        pb={1.5}
      >
        {
          type !== 'newOutput' && _documentRevisionFormState?.documentRevision
            && <ChangeRequestLink dataProp={_documentRevisionFormState?.documentRevision} inDialog={inDialog} />
        }
        <Title
          name="name"
          documentTypeId={documentTypeId}
          disabled={isDisabledInput || inRestrictedEditMode}
        />
        <Description
          isQms={_documentRevisionFormState?.docInfo.isQms || false}
          documentTypeId={documentTypeId}
          isDisabled={isDisabledInput || inRestrictedEditMode}
        />
      </Box>
    )}
  </Observer>
);

export default withDocumentRevisionFormHeader(DocumentRevisionFormHeader);
