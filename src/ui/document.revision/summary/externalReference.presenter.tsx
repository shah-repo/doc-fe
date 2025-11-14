import { Box, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Text from '../../components/Text';
import { styles } from './references.styles';
import { DocumentRevision, ExternalReference, ExternalReferencesResponse } from '../../../state/ducks/documentRevisions/types';
import { toastError } from '../../components/notifications';
import useAsync from '../../hooks/useAsync';
import useActionCreator from '../../hooks/useActionCreator';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';

export interface ExternalReferencesProps {
  selectedDocument?: DocumentRevision
  label: string
}

const ExternalReferencesPresenter: React.FunctionComponent<ExternalReferencesProps> = ({
  selectedDocument,
  label,
}) => {
  const classes = styles();
  const [externalReferencesResponse, setExternalReferencesResponse] = useState<ExternalReferencesResponse>();

  const externalReferencesRenderer = () =>
    externalReferencesResponse?.externalReferences.map((externalReference: ExternalReference, index) => (
      <Box component="span" key={externalReference.id} data-cy={label}>
        <Grid
          key={index}
          justify="space-between"
          alignItems="center"
          container
          className={classes.selectedUsersGrid}
        >
          <Grid item className={classes.avatarSection}>
            <Typography
              component="span"
              variant="body2"
              color="textPrimary"
            >
              <a href={externalReference.resourceUrl}
                className={classes.link}
                target="_blank"
                rel="noopener noreferrer">
                {`${externalReference.resourceType} - ${externalReference.resourceId} - ${externalReference.resourceName}`}
              </a>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    ));

  const externalReferencesEmptyRenderer = () => (
    <>
      <Typography variant="h5" className={classes.noHeader} >
        <Text message="common.none" />
      </Typography>
    </>
  );

  const getExternalReferences = useActionCreator(
    documentRevisionsActions.getExternalReferences,
  );

  const externalReferencesReqAsync = useAsync<ExternalReferencesResponse>({
    onSuccess: (response?: ExternalReferencesResponse) => {
      setExternalReferencesResponse(response);
      console.log('>>>>>>>>>>>>');
      console.log(externalReferencesResponse);
      toastError(response);
    },
    onError: () => toastError('Error'),
  });

  useEffect(() => {
    const docId = selectedDocument?.documentId;
    externalReferencesReqAsync.start(getExternalReferences, docId, externalReferencesReqAsync);
  }, []);

  return (
    <Box mb={2.5}>
      <Box>
        <Typography variant="h6" className={classes.header}>
          <Text message={label} />
        </Typography>
      </Box>
      {externalReferencesRenderer()}
      {!externalReferencesResponse?.externalReferences.length && externalReferencesEmptyRenderer()}
    </Box>
  );
};

export default ExternalReferencesPresenter;
