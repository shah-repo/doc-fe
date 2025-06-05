import { Box, Drawer, Typography } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../common/intl';
import DialogHeader from './DrawerHeader';
import useStyles from './styles';

interface MappingRulesDrawerProps {
  isOpen: boolean
  handleClosePanel: () => void
}

interface RuleItem {
  titleKey: string
  subItems?: string[]
}

const rules: RuleItem[] = [
  { titleKey: 'bulk.migration.rules.autocomplete.message' },
  { titleKey: 'bulk.migration.rules.checkbox.group.message' },
  {
    titleKey: 'bulk.migration.rules.textfield.message',
    subItems: ['bulk.migration.rules.comments.field.message'],
  },
  {
    titleKey: 'bulk.migration.rules.driving.column.title',
    subItems: ['bulk.migration.rules.driving.column.message1', 'bulk.migration.rules.driving.column.message2'],
  },
  {
    titleKey: 'bulk.migration.rules.driving.column.rules.title',
    subItems: [
      'bulk.migration.rules.driving.column.rules.message1',
      'bulk.migration.rules.driving.column.rules.message2',
    ],
  },
  {
    titleKey: 'bulk.migration.rules.constraints.title',
    subItems: [
      'bulk.migration.rules.constraints.message1',
      'bulk.migration.rules.constraints.message2',
      'bulk.migration.rules.constraints.message3',
      'bulk.migration.rules.constraints.message4',
    ],
  },
  { titleKey: 'bulk.migration.rules.include.multiple.components' },
  {
    titleKey: 'bulk.migration.rules.include.multiple.components.message1',
    subItems: [
      'bulk.migration.rules.include.multiple.components.message2',
      'bulk.migration.rules.include.multiple.components.message3',
    ],
  },
];

const MappingRulesDrawer: React.FC<MappingRulesDrawerProps> = ({ isOpen, handleClosePanel }) => {
  const classes = useStyles();

  return (
    <Drawer anchor="right" open={isOpen} onClose={handleClosePanel} classes={{ paper: classes.drawerDialogPaper }}>
      <DialogHeader title={translate('bulk.migration.mapping.rules')} onDialogClose={handleClosePanel} />
      <Box className={classes.drawerDialogContent}>
        <Typography variant="h5">{translate('bulk.migration.rules.title.message')}</Typography>

        <Box component="ul" className={classes.drawerList}>
          {rules.map((rule, idx) => (
            <Box key={idx} component="li" className={classes.compactListItem}>
              <Typography className={classes.rulesText} dangerouslySetInnerHTML={{ __html: translate(rule.titleKey) }} />
              {rule.subItems && (
                <Box component="ul">
                  {rule.subItems.map((subKey, subIdx) => (
                    <Box key={subIdx} component="li">
                      <Typography className={classes.rulesText} dangerouslySetInnerHTML={{ __html: translate(subKey) }} />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};

export default MappingRulesDrawer;
