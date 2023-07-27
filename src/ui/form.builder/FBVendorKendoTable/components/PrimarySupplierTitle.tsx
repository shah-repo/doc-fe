import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import React from 'react';
import FBTooltip from '../../FBTooltip/FBTooltip';

export const PrimarySupplierTitle: React.FC = () => {
  return (
    <Box>
      <FBTooltip title="form.builder.primary.supplier" placement="top" arrow >
        <FontAwesomeIcon icon={solid('star')} />
      </FBTooltip>
    </Box>
  );
};
