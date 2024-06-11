import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { BulkImportCustom } from '../../../../state/ducks/bulkImport/types';
import useStyles from './styles';

interface IconStatus {
  name: any
  className: string
}

export const iconStatuses: Record<string, IconStatus> = {
  check: { name: solid('circle-check'), className: 'checkIcon' },
  progress: { name: solid('circle-three-quarters-stroke'), className: 'progressIcon' },
  warning: { name: solid('triangle-exclamation'), className: 'warningIcon' },
  blank: { name: solid('circle'), className: 'blankIcon' },
};

interface ProgressIconsProps {
  item: BulkImportCustom
}

const ProgressIcons: React.FC<ProgressIconsProps> = ({ item }) => {
  const classes = useStyles();
  const icons = item?.icons;
  let firstBlankIconFound = false;

  if (!icons?.length) {
    return null;
  }

  return (
    <>
      <Box className={classes.statusesContainer}>
        {icons?.map(icon => {
          let iconData = iconStatuses[icon.icon] ? iconStatuses[icon.icon] : iconStatuses.blank;
          if ((!iconStatuses[icon.icon] || icon.icon === 'blank') && !firstBlankIconFound) {
            firstBlankIconFound = true;
            iconData = iconStatuses.progress;
          }

          return (
            <Box className={classes.statusContainer}>
              <FontAwesomeIcon
                className={classes[iconData.className]}
                icon={iconData.name}
              />
              <Typography className={classes.statusText}>
                {icon.text}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default ProgressIcons;
