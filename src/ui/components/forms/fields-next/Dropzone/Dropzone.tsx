import { Box, Typography } from '@material-ui/core';
import React, { ReactNode } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { ReactComponent as MultipleFilesIcon } from '../../../../../assets/images/multiple_files.svg';
import Text from '../../../Text';
import useStyles from './Dropzone.styles';

interface DropzoneProps {
  accept?: Accept
  className?: string
  children?: ReactNode
  multiple?: boolean
  onDrop: (acceptedFiles: File[]) => void
  maxSize?: number
}

const MAX_SIZE = 2147483648;

const Dropzone: React.FC<DropzoneProps> = ({
  children,
  className,
  accept,
  onDrop,
  multiple = true,
  maxSize = MAX_SIZE, // as default is 2GB
}) => {
  const classes = useStyles();
  const containerClassName = className ? `${classes.container} ${className}` : classes.container;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...(accept ? { accept } : {}),
    onDrop,
    multiple,
    maxSize, // as default is 2GB
  });

  return (
    <Box className={containerClassName}>
      <Box {...getRootProps({ className: classes.dropzone })}>
        <input {...getInputProps()} />
        <Box className={classes.textContainer}>
          <MultipleFilesIcon className={classes.icon} />
          {children || (<Typography variant="body2" className={classes.text}>
            {isDragActive
              ? <Text translation="dropzone.drag.text" />
              : <>
                <span><Text translation="dropzone.noDrag.text" /></span>
                <span className={classes.plus}>+</span>
                <span className={classes.browseText}>
                  <Text translation="dropzone.noDrag.subText" />
                </span>
              </>
            }
          </Typography>)}
        </Box>
      </Box>
    </Box>
  );
};

export default Dropzone;
