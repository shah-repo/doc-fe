import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import React from 'react';
import { Button, ButtonGroup } from '..';
import { withThemeNext } from '../../../../layout/theme-next';
import { renderNode } from '../utils';
import useStyles from './SplitButton.styles';
import { SplitButtonProps } from './SplitButton.types';

const SplitButton: React.FC<SplitButtonProps> = ({
  children,
  buttonText,
  buttonProps,
  toggleProps,
  toggleIcon,
  onClick,
  onToggle,
  ...props
}, ref) => {
  const classes = useStyles();

  return (
    <>
      <ButtonGroup {...props} ref={ref}>
        <Button
          {...buttonProps}
          onClick={onClick}
          className={cx(buttonProps?.className, classes.button)}
        >
          {renderNode(buttonText)}
        </Button>
        <Button
          {...toggleProps}
          className={classes.toggle}
          onClick={onToggle}
        >
          { toggleIcon ?? <FontAwesomeIcon icon={solid('chevron-down')} /> }
        </Button>
      </ButtonGroup>
      {children}
    </>
  );
};

export default withThemeNext(React.forwardRef(SplitButton));
