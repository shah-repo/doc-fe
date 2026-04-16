import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputAdornment, makeStyles } from '@material-ui/core';
import { GetTagProps } from '@material-ui/lab/Autocomplete';
import cx from 'classnames';
import { isArray } from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { documentVersionPath } from '../../document.revision/utils/paths';
import { Colors } from '../../layout/theme-next';
import FBTooltip from '../FBTooltip/FBTooltip';
import { FBAutocompleteAsyncOption } from './FBAutocompleteAsync.types';

interface BuildAutocompleteConfigProps {
  optionId?: string
  getOptionLabel: (value: any) => string
}

interface BuildAutocompleteConfigReturn {
  getTagLabel: ((value: any, getTagProps: GetTagProps) => React.ReactNode) | undefined
  renderEndAdornment: ((value: any, getTagProps: GetTagProps) => React.ReactNode) | undefined
  renderStartAdornment: ((value: any, getTagProps: GetTagProps) => React.ReactNode) | undefined
}

const DOCUMENT_REVISION_STATUSES = [
  DocumentRevisionStatus.Draft,
  DocumentRevisionStatus.PendingChange,
  DocumentRevisionStatus.InReview,
  DocumentRevisionStatus.Approved,
  DocumentRevisionStatus.Released,
];

const findLatestRevision = (revisions) => {
  if (!revisions || revisions.length === 0) {
    return null;
  }
  return revisions
    .filter((revision) => DOCUMENT_REVISION_STATUSES.includes(revision.status))
    .sort((a, b) => b.version - a.version)
    .at(0);
};

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: Colors.primary,
    position: 'relative',

    '&:hover .icon-wrap': {
      opacity: 1,
      pointerEvents: 'auto',
    },
  },
  iconWrap: {
    position: 'absolute',
    padding: theme.spacing(0, 1.5),
    top: 0,
    right: -32,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    opacity: 0,
    cursor: 'pointer',
    transition: theme.transitions.create('opacity', { duration: 100 }),
    background: Colors.primaryBg,
    pointerEvents: 'none',
  },
}));

export const useAutocompleteConfig = ({
  optionId,
  getOptionLabel,
}: BuildAutocompleteConfigProps): BuildAutocompleteConfigReturn => {
  const classes = useStyles();

  switch (optionId) {
    case FBAutocompleteAsyncOption.allDocuments:
      return {
        getTagLabel: (value, getTagProps: GetTagProps) => {
          const text = getOptionLabel(value);
          const revision = findLatestRevision(value?.documentRevisions);

          if (!value?.id || !revision || !revision.id) {
            return text;
          }
          return (
            <Link
              className={classes.link}
              style={{ textDecoration: 'none', color: Colors.primary }}
              to={documentVersionPath(revision.id, value.id)}
              target="_blank"
            >
              {text}
              <span className={cx(classes.iconWrap, 'icon-wrap')}>
                <FontAwesomeIcon icon={solid('external-link-alt')} size="sm" />
              </span>
            </Link>
          );
        },
        renderStartAdornment: (value, getTagProps: GetTagProps) => {
          if (isArray(value)) {
            return undefined;
          }
          const revision = findLatestRevision(value?.documentRevisions);

          if (!value?.id || !revision || !revision.id) {
            return undefined;
          }
          return (
            <InputAdornment position="start">
              <FBTooltip title="Open in new tab">
                <Link
                  style={{ textDecoration: 'none', color: Colors.primary, marginLeft: 4 }}
                  to={documentVersionPath(revision.id, value.id)}
                  target="_blank"
                >
                  <FontAwesomeIcon icon={solid('external-link-alt')} size="sm" />
                </Link>
              </FBTooltip>
            </InputAdornment>
          );
        },
        renderEndAdornment: undefined,
      };
    default:
      return {
        getTagLabel: undefined,
        renderEndAdornment: undefined,
        renderStartAdornment: undefined,
      };
  }
};
