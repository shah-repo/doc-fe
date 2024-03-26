import { Grid, Typography } from '@material-ui/core';
import { concat, uniqBy } from 'lodash';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { DocumentRevision, SmartReferenceType } from '../../../../../state/ducks/documentRevisions/types';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import { styles } from './LHR.banner.styles';

interface LHRBannerProps{
  documentRevision: DocumentRevision
}

const LHRBanner: React.FunctionComponent<LHRBannerProps> = ({ documentRevision }) => {
  // const { smartReferencesTo } = documentRevision;
  const classes = styles();
  const history = useHistory();

  const allReferences = concat(
    documentRevision?.smartReferencesTo ?? [],
    documentRevision?.document.smartReferencesTo ?? [],
  );

  const parentLHRReference = uniqBy(allReferences, 'id').find(
    ref => ref.active && ref.type === SmartReferenceType.HiddenPiInstance,
  );

  if (!parentLHRReference) {
    return null;
  }

  const parentLHR = parentLHRReference.toDocRev;

  const lhrData = parentLHR?.precalc.lshs_subtitle;

  if (!lhrData?.lot?.label || !lhrData?.lhr?.label || !lhrData?.part?.label || !lhrData?.part?.docRevId || !lhrData?.part?.documentId) {
    return null;
  }

  const { docRevId, documentId } = lhrData.part;
  const url = documentVersionPath(docRevId, documentId);

  return (
    <Typography className={classes.container}>
      <Grid
        container={true}
        wrap="nowrap"
        justify="flex-start"
        alignItems="center">
        <Grid item={true}>
          {lhrData?.lot.label}
        </Grid>&nbsp;
        <Grid item={true} className={classes.blackDot} />&nbsp;
        <Grid item={true}>
          {lhrData?.lhr.label}
        </Grid>&nbsp;
        <Grid item={true} className={classes.blackDot} />&nbsp;
        <Grid item={true} className={classes.partLabel} onClick={() => history.push(url)}>
          {lhrData?.part.label}
        </Grid>
      </Grid>
    </Typography>
  );
};

export default LHRBanner;
