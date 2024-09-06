import { Chip, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { Checkbox } from '../../../../../../../ui/components/forms/fields-next';
import { FBAttachment } from '../../../../../../../ui/form.builder';
import styles from './ListPanel.styles';

interface ListPanelProps{
  attachments: FBAttachment[]
  showDocPreview: (file: FBAttachment) => void
}

const ListPanel: React.FC<ListPanelProps> = ({ attachments, showDocPreview }) => {
  const classes = styles();

  return (
    <List className={cx(classes.list, 'containing-box-scrollbar')}>
      {attachments.map((attachment, index) => {
        return (
          <ListItem
            button
            onClick={() => {
              showDocPreview(attachment);
            }}
            className={classes.listItemBtn}
          >
            <ListItemIcon className={classes.listItemIcon} >
              <Checkbox
                checked={(index === 1)}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText>
              {index === 1 && <Chip label="Confidence Score 91%" color="secondary" className={classes.scoreChip} />}
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
