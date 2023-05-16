import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import { styles } from './LHR.banner.styles';

interface LHRBannerProps{
  documentRevision: DocumentRevision;
}

const LHRBanner: React.FunctionComponent<LHRBannerProps> = ({ documentRevision }) => {
  const { smartReferencesTo } = documentRevision;
  const classes = styles();
  const history = useHistory();
  if (!smartReferencesTo || (smartReferencesTo && smartReferencesTo.length === 0)) {
    return null;
  }

  const lhrData = smartReferencesTo[0].toDocRev?.precalc?.lshs_subtitle;
  if (!lhrData?.part.docRevId || !lhrData?.part.documentId) {
    return null;
  }
  const url = documentVersionPath(lhrData?.part.docRevId || '', lhrData?.part.documentId || '');

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
        <Grid item={true} className={classes.blackDot}></Grid>&nbsp;
        <Grid item={true}>
          {lhrData?.lhr.label}
        </Grid>&nbsp;
        <Grid item={true} className={classes.blackDot}></Grid>&nbsp;
        <Grid item={true} className={classes.partLabel} onClick={() => history.push(url)}>
          {lhrData?.part.label}
        </Grid>
      </Grid>
    </Typography>
  );
};

export default LHRBanner;
