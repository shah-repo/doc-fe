import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { Checkbox } from '../../../../../../../ui/components/forms/fields-next';
import { FBAttachment } from '../../../../../../../ui/form.builder';
import styles from './ListPanel.styles';

interface ListPanelProps{
  attachments: FBAttachment[]
  showDocPreview: (file: FBAttachment) => void
  onSelectionChange: (checkedIndices: any) => void
}

const ListPanel: React.FC<ListPanelProps> = ({ attachments, showDocPreview, onSelectionChange }) => {
  const classes = styles();

  const [checkedIndices, setCheckedIndices] = React.useState<any>([]);

  const handleCheckboxClick = (index: number) => {
    const currentIndex = checkedIndices.indexOf(index);
    const newChecked = [...checkedIndices];

    // Add/remove the index from the list of checked indices
    if (currentIndex === -1) {
      newChecked.push(index); // Add if not checked
    } else {
      newChecked.splice(currentIndex, 1); // Remove if checked
    }

    // Update local state with the new checked indices
    console.log(newChecked);
    setCheckedIndices(newChecked);

    // Notify parent component of the change
    onSelectionChange(newChecked);
  };

  return (
    <List className={cx(classes.list, 'containing-box-scrollbar')}>
      {attachments && attachments.map((attachment, index) => {
        return (
          <ListItem
            key={index}
            button
            onClick={() => {
              handleCheckboxClick(index);
              showDocPreview(attachment);
            }}
            className={classes.listItemBtn}
          >
            <ListItemIcon className={classes.listItemIcon} >
              <Checkbox
                checked={checkedIndices.indexOf(index) !== -1}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText>
              {/* {index === 1 && <Chip label="Confidence Score 91%" color="secondary" className={classes.scoreChip} />} */}
              <Typography
                className={classes.listItemText}
              >
                {attachment.name}
              </Typography>
            </ListItemText>
          </ListItem>
        );
      })}
    </List>
  );
};

export default ListPanel;
