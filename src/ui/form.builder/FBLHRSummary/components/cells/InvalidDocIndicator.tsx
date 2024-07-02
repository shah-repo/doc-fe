import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { DocumentRevisionStatusDisplay } from '../../../../../state/ducks/documentRevisions/types';
import { Colors } from '../../../../layout/theme-next';
import { styles } from './styles';

interface props {
  status?: DocumentRevisionStatusDisplay
  isRevRemoved?: boolean
  dataCy: string
}

export const InvalidDocIndicator: React.FC<props> = ({
  status,
  dataCy,
  isRevRemoved,
}) => {
  const classes = styles();
  const isInvalidDoc = status && [DocumentRevisionStatusDisplay.Voided, DocumentRevisionStatusDisplay.Canceled, DocumentRevisionStatusDisplay.Obsolete].includes(status);

  if (!isInvalidDoc && !isRevRemoved) {
    return null;
  }

  return <span className={classes.InvalidDocIndicator}>
    <Tooltip
      arrow
      title={translate(isRevRemoved ? 'lhr.summary.revision.removed.mpi.tooltip.message' : 'lhr.summary.status.invalid.message')}
      placement="top"
    >
      <FontAwesomeIcon
        data-cy={dataCy}
        color={Colors.warning}
        icon={regular('circle-exclamation')}
      />
    </Tooltip>
  </span>;
};
