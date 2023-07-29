import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../common/intl';

export const PrimarySupplierTitle: React.FC = () => {
  return (
    <Tooltip
      title={translate('form.builder.part.vendors.primary')}
      placement="top-start"
      arrow
    >
      <FontAwesomeIcon icon={solid('star')} />
    </Tooltip>
  );
};
