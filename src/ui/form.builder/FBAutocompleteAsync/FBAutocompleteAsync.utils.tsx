import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputAdornment } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../common/intl';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { documentVersionPath } from '../../document.revision/utils/paths';
import FBTooltip from '../FBTooltip/FBTooltip';
import useStyles from './FBAutocompleteAsync.styles';
import { AutocompleteAdornmentTagProps, AutocompleteLinkRefs, AutocompleteValue, BuildAutocompleteConfig, BuildAutocompleteConfigProps, FBAutocompleteAsyncOption, OptionDocument, OptionDocumentRevision } from './FBAutocompleteAsync.types';

const VIABLE_STATUSES = new Set<DocumentRevisionStatus>([
  DocumentRevisionStatus.Draft,
  DocumentRevisionStatus.PendingChange,
  DocumentRevisionStatus.InReview,
  DocumentRevisionStatus.Approved,
  DocumentRevisionStatus.Released,
]);

const findLatestViableRevision = (revisions: OptionDocumentRevision[] = []) =>
  revisions.reduce<OptionDocumentRevision | undefined>((best, r) => {
    if (!VIABLE_STATUSES.has(r.status)) return best;
    return !best || r.version > best.version ? r : best;
  }, undefined);

const isDocument = (
  value: OptionDocument | OptionDocumentRevision,
): value is OptionDocument => Object.prototype.hasOwnProperty.call(value, 'docId');

export const getLinkRefs = (
  value: AutocompleteValue,
): AutocompleteLinkRefs | null => {
  if (Array.isArray(value)) {
    return null;
  }
  if (isDocument(value)) {
    if (!value.id) return null;
    const revision = findLatestViableRevision(value.documentRevisions);
    return revision?.id ? { documentId: value.id, revisionId: revision.id } : null;
  }
  if (!value?.id || !value.document?.id) return null;
  return { documentId: value.document.id, revisionId: value.id };
};

const LinkTag: React.FC<AutocompleteLinkRefs> = ({
  documentId,
  revisionId,
  children,
}) => {
  const classes = useStyles();
  return (
    <Link
      className={classes.link}
      to={documentVersionPath(revisionId, documentId)}
      target="_blank"
    >
      {children}
    </Link>
  );
};

const AdornmentTag: React.FC<AutocompleteAdornmentTagProps> = ({
  position = 'start',
  ...refs
}) => {
  return (
    <InputAdornment position={position}>
      <FBTooltip title={translate('common.open.in.new.tab')}>
        <LinkTag {...refs}>
          <FontAwesomeIcon icon={solid('external-link')} size="sm" />
        </LinkTag>
      </FBTooltip>
    </InputAdornment>
  );
};

const LINKABLE_OPTIONS = new Set<string>([
  FBAutocompleteAsyncOption.allDocuments,
  FBAutocompleteAsyncOption.activeDocumentRevisions,
]);

export const buildAutocompleteConfig: BuildAutocompleteConfig = ({
  optionId,
  getOptionLabel,
}: BuildAutocompleteConfigProps) => {
  if (!optionId || !LINKABLE_OPTIONS.has(optionId)) return {};
  return {
    getTagLabel: (value) => {
      const text = getOptionLabel(value);
      const refs = getLinkRefs(value);
      return refs ? <LinkTag {...refs}>{text}</LinkTag> : text;
    },
    renderStartAdornment: (value) => {
      const refs = getLinkRefs(value);
      return refs ? <AdornmentTag {...refs} /> : undefined;
    },
  };
};
