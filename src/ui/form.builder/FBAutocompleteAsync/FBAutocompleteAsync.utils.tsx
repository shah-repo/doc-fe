import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputAdornment } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { AutocompleteAdornmentTagProps, AutocompleteLinkTagProps, BuildAutocompleteConfig, BuildAutocompleteConfigProps, FBAutocompleteAsyncOption, OptionDocument, OptionDocumentRevision } from '..';
import { translate } from '../../../common/intl';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { documentVersionPath } from '../../document.revision/utils/paths';
import FBTooltip from '../FBTooltip/FBTooltip';
import useStyles from './FBAutocompleteAsync.styles';

const VIABLE_STATUSES = new Set<DocumentRevisionStatus>([
  DocumentRevisionStatus.Draft,
  DocumentRevisionStatus.PendingChange,
  DocumentRevisionStatus.InReview,
  DocumentRevisionStatus.Approved,
  DocumentRevisionStatus.Released,
]);

const findLatestViableRevision = (revisions: OptionDocumentRevision[] = [], documentStatuses?: DocumentRevisionStatus[]): OptionDocumentRevision | undefined => {
  const viableStatuses = documentStatuses?.length ? new Set(documentStatuses) : VIABLE_STATUSES;
  return revisions.reduce<OptionDocumentRevision | undefined>((best, r) => {
    if (!viableStatuses.has(r.status)) return best;
    return !best || r.version > best.version ? r : best;
  }, undefined);
};

const isDocument = (
  value: OptionDocument | OptionDocumentRevision,
): value is OptionDocument => Object.prototype.hasOwnProperty.call(value, 'docId');

type LinkResolver = (
  value: OptionDocument | OptionDocumentRevision,
  documentStatuses?: DocumentRevisionStatus[],
) => string | null;

const getLinkFromDocument: LinkResolver = (value, documentStatuses) => {
  if (!isDocument(value) || !value.id) return null;
  const revision = findLatestViableRevision(value.documentRevisions, documentStatuses);
  return revision?.id ? documentVersionPath(revision.id, value.id) : null;
};

const getLinkFromDocumentRevision: LinkResolver = (value) => {
  if (isDocument(value) || !value?.id || !value.document?.id) return null;
  return documentVersionPath(value.id, value.document.id);
};

const LinkTag: React.FC<AutocompleteLinkTagProps> = ({ to, children }) => {
  const classes = useStyles();
  return (
    <Link className={classes.link} to={to} target="_blank">
      {children}
    </Link>
  );
};

const AdornmentTag: React.FC<AutocompleteAdornmentTagProps> = ({
  position = 'start',
  to,
}) => {
  return (
    <InputAdornment position={position} onClick={(e) => e.stopPropagation()}>
      <FBTooltip title={translate('common.open.in.new.tab')}>
        <LinkTag to={to}>
          <FontAwesomeIcon icon={solid('external-link')} size="sm" />
        </LinkTag>
      </FBTooltip>
    </InputAdornment>
  );
};

const DOCUMENT_OPTIONS: FBAutocompleteAsyncOption[] = [
  FBAutocompleteAsyncOption.allDocuments,
  FBAutocompleteAsyncOption.availablePartDocuments,
  FBAutocompleteAsyncOption.preventativeMaintenaceForms,
  FBAutocompleteAsyncOption.trainingDocuments,
];

const DOCUMENT_REVISION_OPTIONS: FBAutocompleteAsyncOption[] = [
  FBAutocompleteAsyncOption.activeDocumentRevisions,
  FBAutocompleteAsyncOption.suppliers,
  FBAutocompleteAsyncOption.TLList,
  FBAutocompleteAsyncOption.CSLList,
  FBAutocompleteAsyncOption.parts,
  FBAutocompleteAsyncOption.POList,
  FBAutocompleteAsyncOption.WOParts,
  FBAutocompleteAsyncOption.DRAFTdocumentRevisions,
  FBAutocompleteAsyncOption.documentRevisions,
  FBAutocompleteAsyncOption.materials,
  FBAutocompleteAsyncOption.equipment,
  FBAutocompleteAsyncOption.availableParts,
  FBAutocompleteAsyncOption.lots,
  FBAutocompleteAsyncOption.ebLots,
  FBAutocompleteAsyncOption.seed,
  FBAutocompleteAsyncOption.mpiDocuments,
  FBAutocompleteAsyncOption.releasedEquipment,
  FBAutocompleteAsyncOption.releasedFormDocuments,
  FBAutocompleteAsyncOption.releasedParts,
  FBAutocompleteAsyncOption.lotBuilds,
  FBAutocompleteAsyncOption.records,
  FBAutocompleteAsyncOption.shippingInformation,
  FBAutocompleteAsyncOption.equipmentSpecifications,
];

const LINKABLE_OPTIONS = new Map<string, LinkResolver>([
  ...DOCUMENT_OPTIONS.map((id): [string, LinkResolver] => [id, getLinkFromDocument]),
  ...DOCUMENT_REVISION_OPTIONS.map((id): [string, LinkResolver] => [id, getLinkFromDocumentRevision]),
]);

export const buildAutocompleteConfig: BuildAutocompleteConfig = ({
  optionId,
  getOptionLabel,
  documentStatuses,
}: BuildAutocompleteConfigProps) => {
  const resolveLink = optionId ? LINKABLE_OPTIONS.get(optionId) : undefined;
  if (!resolveLink) return {};
  return {
    getTagLabel: (value) => {
      const text = getOptionLabel(value, documentStatuses);
      const to = resolveLink(value, documentStatuses);
      return to ? <LinkTag to={to}>{text}</LinkTag> : text;
    },
    renderStartAdornment: (value) => {
      if (Array.isArray(value)) return undefined;
      const to = resolveLink(value, documentStatuses);
      return to ? <AdornmentTag to={to} /> : undefined;
    },
  };
};
