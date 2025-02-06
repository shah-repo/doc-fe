import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { translate } from '../../../../../../../common/intl';
import Config from '../../../../../../../config';
import { Checkbox } from '../../../../../../../ui/components/forms/fields-next';
import { FBAttachment } from '../../../../../../../ui/form.builder';
import useStyles from './styles';

interface ListPanelProps {
  attachments: FBAttachment[]
  showDocPreview: (file: FBAttachment) => void
  onSelectionChange: (checkedIndices: number[]) => void
  selectedIndices: number[]
}

const ListPanel: React.FC<ListPanelProps> = ({
  attachments,
  showDocPreview,
  onSelectionChange,
  selectedIndices,
}) => {
  const classes = useStyles();
  const [checkedIndices, setCheckedIndices] = React.useState<number[]>(selectedIndices);

  const handleCheckboxClick = (index: number) => {
    const currentIndex = checkedIndices.indexOf(index);
    const newChecked = [...checkedIndices];

    if (currentIndex === -1) {
      newChecked.push(index);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedIndices(newChecked);
    onSelectionChange(newChecked);
  };

  const isSupportedFileType = (fileType: string): boolean => {
    return Config.ocrSupportedFileTypes.includes(fileType?.toLowerCase());
  };

  const handleItemClick = (
    isFileTypeSupported: boolean,
    index: number,
    attachment: FBAttachment,
  ) => {
    if (isFileTypeSupported) {
      handleCheckboxClick(index);
    }
    showDocPreview(attachment);
  };

  return (
    <List className={cx(classes.list, 'containing-box-scrollbar')}>
      {attachments?.map((attachment: FBAttachment, index: number) => {
        const isFileTypeSupported = isSupportedFileType(attachment.type);
        return (
          <Tooltip
            key={`tooltip-${index}`}
            title={
              isFileTypeSupported
                ? ''
                : `${attachment.type} ${translate(
                    'ocr.filetype.not.support.message',
                  )}`
            }
            placement="right"
          >
            <ListItem
              key={index}
              button
              onClick={() => handleItemClick(isFileTypeSupported, index, attachment)}
              className={classes.listItemBtn}
            >
              <ListItemIcon className={classes.listItemIcon}>
                <Checkbox
                  checked={checkedIndices.includes(index)}
                  disabled={!isFileTypeSupported}
                  tabIndex={-1}
                  disableRipple
                  data-cy={`attachment-checkbox-${index}`}
                />
              </ListItemIcon>
              <ListItemText>
                <Typography className={classes.listItemText}>
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
