import { Box, IconButton, List, ListItem, ListItemText } from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import React from 'react';
import { translate } from '../../../../common/intl';
import { attachmentColorByType } from '../../../components/common/attachment.icon/attachmentColorByType';
import { renderDefaultAttachment } from '../../../components/common/attachment.icon/attachmentIcons';
import { FileWithPreview } from '../../../components/forms/fields-next/Dropzone/Dropzone.types';
import useStyles from './styles';

interface ListFilesProps {
  files: FileWithPreview[]
  handleRemoveFile: (index: number) => void
}

const BYTES_IN_KILOBYTE = 1024;

const fileTypeMap: { [key: string]: keyof typeof attachmentColorByType } = {
  XLSX: 'XLS',
  DOC: 'DOCX',
  JPEG: 'JPG',
};

const ListFiles: React.FC<ListFilesProps> = ({ files, handleRemoveFile }) => {
  const classes = useStyles();

  return (
    <List className={classes.listContainer}>
      {files.map((file, index) => {
        let fileType = file.name.split('.').pop()?.toUpperCase(); // Extract file extension and convert to uppercase
        fileType = fileTypeMap[fileType || ''] || fileType;
        const color = attachmentColorByType[fileType as keyof typeof attachmentColorByType] || attachmentColorByType.XLS; // Fallback color if type is not recognized

        return (
          <ListItem key={index} className={classes.listItem}>
            <Box className={classes.fileInfo}>
              {renderDefaultAttachment(color, fileType || 'XLS')}
              <ListItemText primary={file.name} secondary={`${(file.size / BYTES_IN_KILOBYTE).toFixed(2)} ${translate('bulkImport.upload.infoExcelKB')}`} />
            </Box>
            <IconButton onClick={() => handleRemoveFile(index)} className={classes.removeIcon}>
              <RemoveCircleOutlineIcon />
            </IconButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default ListFiles;
