import { MenuItem, Select } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { FBInput, FBSelectProps } from '..';
import Text from '../../components/Text';
import { FBFontStyle } from '../styles/FBFont.styles';
import styles from './FBSelect.styles';
import { withFBSelect } from './FBSelect.wrap';

const FBSelect: React.FunctionComponent<FBSelectProps> = ({
  defaultValue,
  menuItems,
  SelectDisplayProps,
  variant = 'outlined',
  placeholder,
  style,
  isPlaceholderShown,
  ...props
}) => {
  const classes = styles();

  return (
    <FBInput {...props} {...{ placeholder }} type="select" labelProps={FBFontStyle.labelProps}>
      <Select
        className={cx(classes.select, { [classes.placeholderValue]: isPlaceholderShown })}
        {...{ defaultValue, style, variant, SelectDisplayProps }}
        displayEmpty
      >
        {!!placeholder?.trim() && (
          <MenuItem value={undefined} className={classes.placeholderItem}>
            <Text message={placeholder} />
          </MenuItem>
        )}
        {menuItems}
      </Select>
    </FBInput>
  );
};

export default withFBSelect(FBSelect);
