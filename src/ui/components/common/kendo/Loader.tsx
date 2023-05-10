import { Box, CircularProgress } from '@material-ui/core';
import cx from 'classnames';
import React, { MutableRefObject } from 'react';
import ReactDOM from 'react-dom';
import useStyles from './Loader.styles';

interface LoaderBoxProps {
  size?: number
  className?: string
}

const LoaderBox: React.FC<LoaderBoxProps> = ({
  size = 20,
  className,
}) => {
  const classes = useStyles();

  return (
    <Box
      className={cx(classes.root, className)}
      data-cy="grid-loader"
    >
      <CircularProgress size={size} />
    </Box>
  );
};

interface LoaderProps extends LoaderBoxProps {
  gridRef?: MutableRefObject<HTMLElement>
}

const Loader: React.FC<LoaderProps> = ({ gridRef, className, size }) => {
  const gridPortal = (gridRef?.current ?? document).querySelector('.k-grid-container');
  const loaderNode = <LoaderBox className={className} size={size} />;
  return gridPortal ? ReactDOM.createPortal(loaderNode, gridPortal) : loaderNode;
};

export default Loader;
