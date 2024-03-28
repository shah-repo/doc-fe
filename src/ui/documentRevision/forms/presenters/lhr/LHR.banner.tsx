import { Grid, Typography } from '@material-ui/core';
import { concat, uniqBy } from 'lodash';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { DocumentRevision, SmartReferenceType } from '../../../../../state/ducks/documentRevisions/types';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import { styles } from './LHR.banner.styles';

const LHR_SUBTITLE_PRECALC_KEY = 'lshs_subtitle';

interface LHRBannerProps{
  documentRevision: DocumentRevision
}

const LHRBanner: React.FunctionComponent<LHRBannerProps> = ({ documentRevision }) => {
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
  const { name } = documentRevision;
  const docLHRLabel = name.split(',')[0].trim();

  const precalcLHR = parentLHR?.precalc?.[LHR_SUBTITLE_PRECALC_KEY]?.lhr;
  const precalcLot = parentLHR?.precalc?.[LHR_SUBTITLE_PRECALC_KEY]?.lot;
  const precalcPart = parentLHR?.precalc?.[LHR_SUBTITLE_PRECALC_KEY]?.part;

  const partLabel = precalcPart?.label;
  const docRevId = precalcPart?.docRevId ?? parentLHR?.document.docId;
  const documentId = precalcPart?.documentId;
  const lotLabel = precalcLot?.label;
  const lhrLabel = precalcLHR?.label ?? docLHRLabel;

  const url = documentVersionPath(docRevId as string, documentId as string);

  return (
    <Typography className={classes.container}>
      <Grid
        container={true}
        wrap="nowrap"
        justify="flex-start"
        alignItems="center">
        <Grid item={true}>
          {lotLabel}
        </Grid>&nbsp;
        <Grid item={true} className={classes.blackDot} />&nbsp;
        <Grid item={true}>
          {lhrLabel}
        </Grid>&nbsp;
        <Grid item={true} className={classes.blackDot} />&nbsp;
        <Grid item={true} className={classes.partLabel} onClick={() => history.push(url)}>
          {partLabel}
        </Grid>
      </Grid>
    </Typography>
  );
};

export default LHRBanner;
