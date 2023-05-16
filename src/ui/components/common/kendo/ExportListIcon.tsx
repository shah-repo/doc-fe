import { Box } from '@material-ui/core';
import React from 'react';
import { ReactComponent as DisabledExportIcon } from '../../../../assets/images/disabled_export_data.svg';
import { ReactComponent as ExportIcon } from '../../../../assets/images/export_data.svg';
import { styles } from './ExportListIcon.styles';

interface Props {
  isGrouped: boolean;
}

const ExportListIcon: React.FunctionComponent<Props> = ({ isGrouped }) => {
  const classes = styles();

  return (
    <Box display="flex">
      {isGrouped ? (
        <DisabledExportIcon
          className={classes.disabledIconSvg}
          height={14}
          width={14}
        />
      ) : (
        <ExportIcon className={classes.iconSvg} height={14} width={14} />
      )}
    </Box>
  );
};

export default ExportListIcon;
