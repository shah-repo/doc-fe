import { Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { concat, truncate, uniqBy } from 'lodash';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { DocumentRevision, SmartReferenceType } from '../../../../state/ducks/documentRevisions/types';
import { documentVersionPath } from '../../../document.revision/utils/paths';
import { checkIsDocumentLHR, checkIsDocumentMPIOutput } from '../../../documentRevision/helpers/checkDocumentGroup';

const LHR_SUBTITLE_PRECALC_KEY = 'lshs_subtitle';
const LABEL_LENGTH = 50;

const useStyles = makeStyles({
  link: {
    textDecoration: 'none',
    fontSize: '14px',
  },
});

interface LinkProps {
  title: string
  documentId: string
  docRevId: string
}

const DocRevLink: React.FC<LinkProps> = ({
  title,
  documentId,
  docRevId,
}) => {
  const classes = useStyles();

  return (
    <Link
      component={RouterLink}
      to={documentVersionPath(docRevId, documentId)}
      className={classes.link}
      underline="hover"
    >
      {truncate(title, { length: LABEL_LENGTH, omission: '...' })}
    </Link>
  );
};

const generateLHRSubtitle = (documentRevision: DocumentRevision) => documentRevision.document?.lot?.lotId;

const generateLHRsSubtitle = (documentRevision: DocumentRevision) => {
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
  const precalcLHR = parentLHR?.precalc?.[LHR_SUBTITLE_PRECALC_KEY]?.lhr;
  const title = precalcLHR?.label ?? parentLHR?.document.docId;
  const documentId = precalcLHR?.documentId ?? parentLHR?.documentId;
  const docRevId = precalcLHR?.docRevId ?? parentLHR?.id;

  if (!title || !documentId || !docRevId) {
    return null;
  }

  return (
    <DocRevLink
      {...{
        title,
        docRevId,
        documentId,
      }}
    />
  );
};

export const generateSubtitle = (documentRevision: DocumentRevision): React.ReactNode => {
  switch (true) {
    case checkIsDocumentMPIOutput(documentRevision.document.documentType.groupOptions):
      return generateLHRsSubtitle(documentRevision);
    case checkIsDocumentLHR(documentRevision.document.documentType.groupOptions):
      return generateLHRSubtitle(documentRevision);
    default:
      return null;
  }
};
