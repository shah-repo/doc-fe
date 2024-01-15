import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { translate } from '../../../../../common/intl';
import useStyles from './styles';

interface Props {
  isActive?: boolean
}

const EnabledLabel: React.FC<Props> = ({ isActive }) => {
  const classes = useStyles();
  if (!isActive) {
    return null;
  }
  return (
    <>
      <FontAwesomeIcon icon={regular('circle-check')} className={classes.enabledIcon} />
      <span className={classes.enabledLabel}>{translate('integrations.enabled')}</span>
    </>
  );
};

export default EnabledLabel;
