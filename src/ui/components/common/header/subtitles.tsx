import { Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { concat, uniqBy } from 'lodash';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { DocumentRevision, SmartReferenceType } from '../../../../state/ducks/documentRevisions/types';
import { checkIsDocumentLHR, checkIsDocumentMPIOutput } from '../../../documentRevision/helpers/checkDocumentGroup';

const LHR_SUBTITLE_PRECALC_KEY = 'lshs_subtitle';

const LABEL_LENGTH = 50;

const styles = makeStyles({
  link: {
    textDecoration: 'none',
    fontSize: '14px',
  },
});

const generateDocRevUrl: (params: {docRevId: string, documentId: string, label: string}) => any
  = ({ docRevId, documentId, label }) => {
    const classes = styles();

    return (
      <Link
        component={RouterLink}
        to={`/document_revision/${documentId}/version/${docRevId}`}
        className={classes.link}
        underline="hover"
      >
        {label.length < LABEL_LENGTH ? label : `${label.substr(0, LABEL_LENGTH - 3)}...`}
      </Link>
    );
  };

const generateLHRSubtitle = (documentRevision: DocumentRevision) => <React.Fragment>
  {`${documentRevision.document?.lot?.lotId}`}
</React.Fragment>;

const generateLHRsSubtitle = (documentRevision: DocumentRevision) => {
  const subtitle
    = uniqBy(
      concat(documentRevision?.smartReferencesTo, documentRevision?.document.smartReferencesTo),
      'id',
    )
    ?.find((ref) => ref?.active && ref?.type === SmartReferenceType.HiddenPiInstance)
    ?.toDocRev
    ?.precalc
    ?.[LHR_SUBTITLE_PRECALC_KEY];

  const lhrLink = subtitle?.lhr?.docRevId && subtitle?.lhr?.documentId && generateDocRevUrl(subtitle.lhr);

  return <React.Fragment>
    {lhrLink}
  </React.Fragment>;
};

export const generateSubtitle = (documentRevision: DocumentRevision) => {
  if (checkIsDocumentMPIOutput(documentRevision.document.documentType.groupOptions)) {
    return generateLHRsSubtitle(documentRevision);
  }
  if (checkIsDocumentLHR(documentRevision.document.documentType.groupOptions)) {
    return generateLHRSubtitle(documentRevision);
  }
  return null;
};
