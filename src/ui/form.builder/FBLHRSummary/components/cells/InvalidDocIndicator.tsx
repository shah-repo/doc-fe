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
  dataCy: string
}

export const InvalidDocIndicator: React.FC<props> = ({
  status,
  dataCy,
}) => {
  const classes = styles();
  const isInvalidDoc = status && [DocumentRevisionStatusDisplay.Voided, DocumentRevisionStatusDisplay.Canceled, DocumentRevisionStatusDisplay.Obsolete].includes(status);
  if (!isInvalidDoc) {
    return null;
  }

  return <span className={classes.InvalidDocIndicator}>
    <Tooltip
      arrow
      title={translate('lhr.summary.status.invalid.message')}
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
