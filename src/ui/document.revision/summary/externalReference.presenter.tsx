import { Box, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Text from '../../components/Text';
import useStyles from './references.styles';
import { DocumentRevision, ExternalReference, ExternalReferencesResponse } from '../../../state/ducks/documentRevisions/types';
import { toastError } from '../../components/notifications';
import useAsync from '../../hooks/useAsync';
import useActionCreator from '../../hooks/useActionCreator';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { translate } from '../../../common/intl';
import { withThemeNext } from '../../layout/theme-next';

interface ExternalReferencesProps {
  selectedDocument?: DocumentRevision
  label: string
}

const ExternalReferencesPresenter: React.FunctionComponent<ExternalReferencesProps> = ({
  selectedDocument,
  label,
}) => {
  const classes = useStyles();
  const [externalReferences, setExternalReferences] = useState<ExternalReference[]>([]);

  const externalReferenceItem = ({ title, value, classes }) => (
    <div className={classes.row}>
      <span className={classes.title}>{title}:</span>
      <span className={classes.value}>{value}</span>
    </div>
  );

  const externalReferencesRenderer = () =>
    externalReferences.map((externalReference: ExternalReference, index) => (
      <Box component="span" key={externalReference.id} data-cy={`external-reference-${index}`} >
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
                  <div className={classes.externalRefDetails}>
                    {[
                      {
                        title: translate('documentRevision.externalReferences.resourceType.title'),
                        value:
                          (externalReference.externalSystem?.name
                            ? externalReference.externalSystem.name + ' - '
                            : '') + externalReference.resourceType,
                      },
                      { title: translate('documentRevision.externalReferences.resourceName.title'), value: externalReference.resourceName },
                    ].map((item) => externalReferenceItem({ ...item, classes }))}
                  </div>
              </a>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    ));

  const externalReferencesEmptyRenderer = () => (
    <Typography variant="h5" className={classes.noHeader} >
      <Text message="common.none" />
    </Typography>
  );

  const getExternalReferences = useActionCreator(
    documentRevisionsActions.getExternalReferences,
  );

  const externalReferencesReqAsync = useAsync<ExternalReferencesResponse>({
    onSuccess: (response?: ExternalReferencesResponse) => {
      setExternalReferences(response ? response.externalReferences : []);
      toastError(response);
    },
    onError: () => {
      toastError(translate('documentRevision.externalReferences.error'));
      setExternalReferences([]);
    },
  });

  useEffect(() => {
    const docId = selectedDocument?.documentId;
    externalReferencesReqAsync.start(getExternalReferences, docId, externalReferencesReqAsync);
  }, []);

  return (
    <Box className={classes.externalReferencesBox}>
      <Box>
        <Typography variant="h6" className={classes.header}>
          <Text message={label} />
        </Typography>
      </Box>
      {externalReferencesRenderer()}
      {!externalReferences.length && externalReferencesEmptyRenderer()}
    </Box>
  );
};

export default withThemeNext(ExternalReferencesPresenter);
