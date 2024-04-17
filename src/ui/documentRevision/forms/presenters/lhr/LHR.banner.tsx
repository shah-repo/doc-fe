import { Grid } from '@material-ui/core';
import { concat, uniqBy } from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import { DocumentRevision, LSHS, SmartReferenceType } from '../../../../../state/ducks/documentRevisions/types';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import useStyles from './LHR.banner.styles';

interface LHRBannerProps {
  documentRevision: DocumentRevision
}

const DATA_KEYS: Array<keyof LSHS> = ['lhr', 'lot', 'part'];

const LHRBanner: React.FC<LHRBannerProps> = ({ documentRevision }) => {
  const classes = useStyles();

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

  const lhrData = parentLHRReference.toDocRev?.precalc?.lshs_subtitle ?? parentLHRReference.metadata?.lhr;

  if (!lhrData || !DATA_KEYS.every(k => k in lhrData)) {
    return null;
  }

  const partUrl = documentVersionPath(lhrData.part.docRevId, lhrData.part.documentId);

  const items = [
    lhrData.lot.label,
    lhrData.lhr.label,
    <Link to={partUrl} className={classes.link}>{lhrData.part.label}</Link>,
  ];

  return (
    <Grid container className={classes.container}>
      {items.map((item, index) => (
        <>
          {index > 0 ? <Grid item className={classes.dot} /> : null}
          <Grid item>{item}</Grid>
        </>
      ))}
    </Grid>
  );
};

export default LHRBanner;
