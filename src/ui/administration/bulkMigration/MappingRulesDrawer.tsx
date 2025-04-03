import { Box, Button, Drawer, Typography } from '@material-ui/core';
import React from 'react';
import useStyles from './styles';

const MappingRulesDrawer: React.FC<{
  isOpen: boolean
  handleClosePanel: () => void
}> = ({ isOpen, handleClosePanel }) => {
  const classes = useStyles();
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClosePanel}
      classes={{ paper: classes.drawerDialogPaper }}
    >
      <Box className={classes.drawerDialog}>
        <Button onClick={handleClosePanel} className={classes.drawerDialogCloseButton}>Close</Button>
        <Box className={classes.drawerContent}>
          <Typography variant="h5"> Rules governing mapping, based on the type of the item. This is to minimize data loss.
          </Typography>
          <ul className={classes.drawerList}>
            <li className={classes.compactListItem}>
              <b>Autocomplete type:</b> Must be mapped to an <code>autocomplete</code>, OR to a column in <code>object</code> | <code>array</code> type.
            </li>
            <li className={classes.compactListItem}>
              <b>Checkbox Group:</b> Must be mapped to a <code>Checkbox Group</code>, OR to a column in <code>object</code> | <code>array</code> type.
            </li>
            <li className={classes.compactListItem}>
              <b>Textfield and Text Editor:</b> When mapped to a reference data (<code>object</code>/<code>array</code>) type, they use an AI-powered system to understand and extract structured values from the content.
              <ul>
                <li>
                  <b>Comments Field:</b> If the data type has a <em>comments</em> field, the original value is mapped to it.
                </li>
              </ul>
            </li>
            <li className={classes.compactListItem}>
              <b>Driving Column:</b>
              <ul>
                <li> A field mapped to a table column that can have multiple values (e.g., <code>checkbox</code> and <code>autocomplete</code>). </li>
                <li> Rows are replicated based on the number of selected values, and rules are applied to all other columns. </li>
              </ul>
            </li>
            <li className={classes.compactListItem}>
              <b>Driving Column Rules:</b>
              <ul>
                <li> If any of the <code>mappedEntries</code> is an <code>autocomplete</code>, that is the driving column. </li>
                <li> If no <code>autocomplete</code> is present, and any of the entries is a <code>checkboxGroup</code>, that becomes the driving column. </li>
              </ul>
            </li>
            <li className={classes.compactListItem}>
              <b>Row Constraints:</b>
              <ul>
                <li>In a table row, only one column can be an <code>autocomplete</code>.</li>
                <li>The same column can have multiple <code>autocomplete</code>, but no other column in the same row can have another <code>autocomplete</code> mapped.</li>
                <li>In a table row, only one column can be a <code>checkboxGroup</code>.</li>
                <li>The same column can have multiple <code>checkboxGroup</code>, but no other column in the same row can have another <code>checkboxGroup</code>.</li>
              </ul>
            </li>
            <li className={classes.compactListItem}>
              <b>Adding Multiple Components:</b> If you wish to add multiple <code>Checkbox Group</code> or <code>Autocomplete</code>, it is recommended to add them to separate rows.
            </li>
            <li className={classes.compactListItem}>
              <b>Checkbox with Autocomplete:</b> If there is an <code>autocomplete</code> field mapped to a column, you can assign a <code>checkbox</code> to another column in the same row. However:
              <ul>
                <li>It will not be broken into values.</li>
                <li>It will show up as <code>comma-separated values</code>.</li>
              </ul>
            </li>
          </ul>
        </Box>
      </Box>
    </Drawer>

  );
};

export default MappingRulesDrawer;
