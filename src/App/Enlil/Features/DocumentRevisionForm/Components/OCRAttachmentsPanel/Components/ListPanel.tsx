import { List, ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { translate } from '../../../../../../../common/intl';
import Config from '../../../../../../../config';
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
    setCheckedIndices(newChecked);

    // Notify parent component of the change
    onSelectionChange(newChecked);
  };

  const isSupportedFileType = (fileType: string): boolean => {
    console.log('Config.ocrSupportedFileTypes', Config.ocrSupportedFileTypes);
    return Config.ocrSupportedFileTypes.includes(fileType?.toLowerCase());
  };

  return (
    <List className={cx(classes.list, 'containing-box-scrollbar')}>
      {attachments?.map((attachment, index) => {
        const isFileTypeSupported = isSupportedFileType(attachment.type);
        return (
          <Tooltip
            key={`tooltip-${index}`}
            title={(isFileTypeSupported) ? '' : `${attachment.type} ${translate('ocr.filetype.not.support.message')}`}
            placement="right"
          >
            <ListItem
              key={index}
              button
              onClick={() => {
                if (isFileTypeSupported) {
                  handleCheckboxClick(index);
                }
                showDocPreview(attachment);
              }}
              className={classes.listItemBtn}
            >
              <ListItemIcon className={classes.listItemIcon} >
                <Checkbox
                  checked={checkedIndices.indexOf(index) !== -1}
                  disabled={!isFileTypeSupported}
                  tabIndex={-1}
                  disableRipple
                  data-cy={`attachment-checkbox-${index}`}
                />
              </ListItemIcon>
              <ListItemText>
                <Typography
                  className={classes.listItemText}
                >
                  {attachment.name}
                </Typography>
              </ListItemText>
            </ListItem>
          </Tooltip>
        );
      })}
    </List>
  );
};

export default ListPanel;
