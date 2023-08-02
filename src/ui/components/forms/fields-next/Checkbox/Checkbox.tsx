import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckboxProps, Checkbox as MuiCheckbox } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { withThemeNext } from '../../../../layout/theme-next';
import useStyles from './Checkbox.styles';

const Checkbox: React.FC<CheckboxProps> = React.forwardRef((props, ref) => {
  const classes = useStyles();

  return (
    <MuiCheckbox
      {...props}
      checkedIcon={(
        <span className={cx(classes.icon, classes.checkedIcon)}>
          <FontAwesomeIcon icon={solid('check')} />
        </span>
      )}
      icon={<span className={classes.icon} />}
      ref={ref}
    />
  );
});

export default withThemeNext(Checkbox);
