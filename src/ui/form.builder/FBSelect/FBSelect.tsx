import { MenuItem, Select } from '@material-ui/core';
import cx from 'classnames';
import { isArray } from 'lodash';
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
  MenuProps,
  ...props
}) => {
  const classes = styles();

  return (
    <FBInput {...props} {...{ placeholder }} type="select" labelProps={FBFontStyle.labelProps}>
      <Select
        className={classes.select}
        MenuProps={{
          ...MenuProps,
          className: cx(MenuProps?.className, classes.menu),
        }}
        {...{ defaultValue, style, variant, SelectDisplayProps }}
        displayEmpty
        renderValue={(selected: unknown) => {
          if (!selected || (selected as string[])?.length === 0) {
            return <span>{placeholder}</span>;
          }

          if (isArray(selected)) {
            return (selected as string[])?.join(', ');
          }
          return selected as string;
        }}
      >
        <MenuItem value={undefined} className={classes.placeholderItem}>
          {placeholder?.trim() && <Text message={placeholder} />}
        </MenuItem>
        {menuItems}
      </Select>
    </FBInput>
  );
};

export default withFBSelect(FBSelect);
