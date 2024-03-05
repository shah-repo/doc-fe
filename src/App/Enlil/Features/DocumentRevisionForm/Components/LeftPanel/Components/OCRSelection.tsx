import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Checkbox, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import FBButton from '../../../../../../../ui/form.builder/FBButton/FBButton';
import { withThemeNext } from '../../../../../../../ui/layout/theme-next';
import styles from './OCRSelection.styles';

const attachmentsList = [{ label: 'Manufacturing Process Instructions.pdf', id: 1 }, { label: 'Linear Platform Subassembly_LHR.pdf', id: 2 },
  { label: 'Inspection Instructions.docx', id: 3 }, { label: 'Inspection Results spreadsheet.xlsx', id: 4 }];

const OCRSelection: React.FC = () => {
  const classes = styles();
  const [checked, setChecked] = React.useState([0]);
  const [attachments] = React.useState(attachmentsList);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  return (
    <List>
      {attachments.map((value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem
            key={value.id}
            onClick={handleToggle(value.id)}
            className={classes.listItem}
          >
            <ListItemIcon>
              <Checkbox
                checked={checked.includes(value.id)}
                // onClick={handleItemClick}
                className={classes.listCheckbox}
                color="default"
                checkedIcon={
                  <span className={cx(classes.checkboxIcon, classes.checkboxIconChecked)}>
                    <FontAwesomeIcon
                      icon={handleToggle(value.id) ? solid('check') : solid('minus')}
                      className={classes.checkboxCheck}
                    />
                  </span>
                }
                icon={<span className={classes.checkboxIcon} />}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={value.label} />
          </ListItem>
        );
      })}
      <Box className={classes.submitButtonDiv}>
        <FBButton
        // onClick={runOCR}
          variant="outlined"
          color="primary"
          data-cy="cancelButton"
          label="ocr.submit.button"
          className={classes.submitButton}
        />
      </Box>
    </List>
  );
};

export default withThemeNext(OCRSelection);
