import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../common/intl';

const PrimarySupplier = () => {
  return (
    <div>
      <Tooltip
        title={translate('form.builder.part.vendors.primary')}
        placement="top"
        arrow
      >
        <FontAwesomeIcon icon={solid('star')} />
      </Tooltip></div>
  );
};

export default PrimarySupplier;
