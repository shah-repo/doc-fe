import { Box, Drawer, Typography } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../common/intl';
import DialogHeader from './DrawerHeader';
import useStyles from './styles';

const MappingRulesDrawer: React.FC<{
  isOpen: boolean
  handleClosePanel: () => void
}> = ({ isOpen, handleClosePanel }) => {
  const classes = useStyles();
  return (
    <Drawer anchor="right" open={isOpen} onClose={handleClosePanel} classes={{ paper: classes.drawerDialogPaper }}>
      <DialogHeader title={translate('bulk.migration.mapping.rules')} onDialogClose={handleClosePanel} />
      <Box className={classes.drawerDialogContent}>
        <Typography variant="h5">
            Rules governing mapping, based on the type of the item. This is to minimize data loss.
        </Typography>
        <Box component="ul" className={classes.drawerList} >
          <Box component="li" className={classes.compactListItem}>
            <Typography>
              <b>Autocomplete type:</b> Must be mapped to an <code>autocomplete</code>, OR to a column in <code>object</code> | <code>array</code> type.
            </Typography>
          </Box>

          <Box component="li" className={classes.compactListItem}>
            <Typography>
              <b>Checkbox Group:</b> Must be mapped to a <code>Checkbox Group</code>, OR to a column in <code>object</code> | <code>array</code> type.
            </Typography>
          </Box>

          <Box component="li" className={classes.compactListItem}>
            <Typography>
              <b>Textfield and Text Editor:</b> When mapped to a reference data (<code>object</code>/<code>array</code>) type, they use an AI-powered system to understand and extract structured values from the content.
            </Typography>
            <Box component="ul" >
              <Box component="li">
                <Typography>
                  <b>Comments Field:</b> If the data type has a <em>comments</em> field, the original value is mapped to it.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box component="li" className={classes.compactListItem}>
            <Typography><b>Driving Column:</b></Typography>
            <Box component="ul" >
              <Box component="li">
                <Typography>
          A field mapped to a table column that can have multiple values (e.g., <code>checkbox</code> and <code>autocomplete</code>).
                </Typography>
              </Box>
              <Box component="li">
                <Typography>
          Rows are replicated based on the number of selected values, and rules are applied to all other columns.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box component="li" className={classes.compactListItem}>
            <Typography><b>Driving Column Rules:</b></Typography>
            <Box component="ul" >
              <Box component="li">
                <Typography>
          If any of the <code>mappedEntries</code> is an <code>autocomplete</code>, that is the driving column.
                </Typography>
              </Box>
              <Box component="li">
                <Typography>
          If no <code>autocomplete</code> is present, and any of the entries is a <code>checkboxGroup</code>, that becomes the driving column.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box component="li" className={classes.compactListItem}>
            <Typography><b>Row Constraints:</b></Typography>
            <Box component="ul" >
              <Box component="li">
                <Typography>In a table row, only one column can be an <code>autocomplete</code>.</Typography>
              </Box>
              <Box component="li">
                <Typography>The same column can have multiple <code>autocomplete</code>, but no other column in the same row can have another <code>autocomplete</code> mapped.</Typography>
              </Box>
              <Box component="li">
                <Typography>In a table row, only one column can be a <code>checkboxGroup</code>.</Typography>
              </Box>
              <Box component="li">
                <Typography>The same column can have multiple <code>checkboxGroup</code>, but no other column in the same row can have another <code>checkboxGroup</code>.</Typography>
              </Box>
            </Box>
          </Box>

          <Box component="li" className={classes.compactListItem}>
            <Typography>
              <b>Adding Multiple Components:</b> If you wish to add multiple <code>Checkbox Group</code> or <code>Autocomplete</code>, it is recommended to add them to separate rows.
            </Typography>
          </Box>

          <Box component="li" className={classes.compactListItem}>
            <Typography><b>Checkbox with Autocomplete:</b> If there is an <code>autocomplete</code> field mapped to a column, you can assign a <code>checkbox</code> to another column in the same row. However:</Typography>
            <Box component="ul" >
              <Box component="li">
                <Typography>It will not be broken into values.</Typography>
              </Box>
              <Box component="li">
                <Typography>It will show up as <code>comma-separated values</code>.</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default MappingRulesDrawer;
