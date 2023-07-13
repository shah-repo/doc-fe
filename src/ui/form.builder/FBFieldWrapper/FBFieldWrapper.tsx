import { Box } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { FBFieldBottomBar, FBFieldMarkDown, FBFieldTopBar, FBFieldWrapperProps } from '..';
import useHover from '../../hooks/useHover';
import useStyles from './FBFieldWrapper.styles';
import { withFBFieldWrapper } from './FBFieldWrapper.wrap';

const FBFieldWrapper: React.FC<FBFieldWrapperProps> = ({
  inputProps = {},
  isDragging,
  canUseTools,
  canAddField,
  isMarkDownVisible,
  toggleItemMarkdown,
  mt,
  mb,
  ...props
}) => {
  const classes = useStyles();
  const [ref, isHovered] = useHover<HTMLDivElement>();
  const { index = 0, name = '' } = inputProps;

  return (
    <Box
      {...{ ref: canUseTools ? ref : null }}
      className={cx(`fb-field-wrapper-${name}`, classes.root)}
      mt={mt}
      mb={mb}
    >
      {canUseTools && (
        <Box
          className={classes.tools}
          hidden={!isHovered && !isDragging}
        >
          <FBFieldTopBar
            inputProps={inputProps}
            toggleItemMarkdown={toggleItemMarkdown}
          />
          {canAddField && !isDragging && (
            <FBFieldBottomBar index={index} />
          )}
        </Box>
      )}
      <Box className={classes.field}>
        {props.children}
      </Box>
      {isMarkDownVisible && (
        <FBFieldMarkDown inputProps={inputProps} />
      )}
    </Box>
  );
};

export default withFBFieldWrapper(FBFieldWrapper);
