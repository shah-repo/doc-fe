import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@material-ui/core';
import React, { ReactNode } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import Text from '../../../Text';
import useStyles from './Dropzone.styles';

interface DropzoneProps {
  accept?: Accept
  className?: string
  children?: ReactNode
  isMultiple?: boolean
  onDrop: (acceptedFiles: File[]) => void
  maxSize?: number
}

const MAX_SIZE = 2147483648;

const Dropzone: React.FC<DropzoneProps> = ({
  children,
  className,
  accept,
  onDrop,
  isMultiple = true,
  maxSize = MAX_SIZE, // as default is 2GB
}) => {
  const classes = useStyles();
  const containerClassName = className ? `${classes.container} ${className}` : classes.container;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...(accept ? { accept } : {}),
    onDrop,
    multiple: isMultiple,
    maxSize,
  });

  return (
    <Box className={containerClassName}>
      <Box {...getRootProps({ className: classes.dropzone })}>
        <input {...getInputProps()} />
        <Box className={classes.textContainer}>
          <FontAwesomeIcon
            className={classes.icon}
            icon={regular('files')}
          />
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
