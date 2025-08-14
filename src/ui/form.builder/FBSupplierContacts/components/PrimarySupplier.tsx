import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../common/intl';

const PrimarySupplier = () => {
  return (
    <Box display="flex" justifyContent="center">
      <Tooltip
        title={translate('form.builder.part.vendors.primary')}
        placement="top"
        arrow
      >
        <FontAwesomeIcon icon={solid('star')} />
      </Tooltip>
    </Box>
  );
};

export default PrimarySupplier;
