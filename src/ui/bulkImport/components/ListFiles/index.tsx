import { Box, IconButton, List, ListItem, ListItemText } from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import React from 'react';
import { attachmentColorByType } from '../../../components/common/attachment.icon/attachmentColorByType';
import { renderDefaultAttachment } from '../../../components/common/attachment.icon/attachmentIcons';
import { FileWithPreview } from '../../../components/forms/fields-next/Dropzone/Dropzone.field';
import useStyles from './styles';

interface ListFilesProps {
  files: FileWithPreview[]
  handleRemoveFile: (index: number) => void
}

const ListFiles: React.FC<ListFilesProps> = ({ files, handleRemoveFile }) => {
  const classes = useStyles();

  return (
    <List className={classes.listContainer}>
      {files.map((file, index) => (
        <ListItem key={index} className={classes.listItem}>
          <Box className={classes.fileInfo}>
            {renderDefaultAttachment(attachmentColorByType.XLS, 'XLS')}
            <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB Microsoft Excel File`} />
          </Box>
          <IconButton onClick={() => handleRemoveFile(index)} className={classes.removeIcon}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
};

export default ListFiles;
