import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Collapse } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../common/intl';
import useStyles from '../FBBuildTypeChangeApproval.styles';

interface CollapsibleSectionProps {
  title: string
  count: number
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

const CollapsibleSection: React.FunctionComponent<CollapsibleSectionProps> = ({
  title,
  count,
  isOpen,
  onToggle,
  children,
}) => {
  const classes = useStyles();
  return (
    <Box className={classes.sectionContainer}>
      <Box className={classes.sectionHeader} onClick={onToggle}>
        <Box display="flex" alignItems="center">
          <FontAwesomeIcon
            icon={isOpen ? solid('chevron-up') : solid('chevron-down')}
            className={classes.sectionChevron}
          />
          <Box className={classes.sectionTitle}>{title}</Box>
        </Box>
        <Box className={classes.sectionCount}>
          {translate('common.items.count', { count })}
        </Box>
      </Box>
      <Collapse in={isOpen}>
        {children}
      </Collapse>
    </Box>
  );
};

export default CollapsibleSection;
