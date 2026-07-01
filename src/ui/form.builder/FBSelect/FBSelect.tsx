import { MenuItem, Select } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { FBInput, FBSelectProps } from '..';
import { intl } from '../../../common/intl';
import Text from '../../components/Text';
import { isTranslation } from '../../translations/types';
import { FBFontStyle } from '../styles/FBFont.styles';
import styles from './FBSelect.styles';
import { withFBSelect } from './FBSelect.wrap';

const FBSelect: React.FunctionComponent<FBSelectProps> = ({
  defaultValue,
  menuItems,
  SelectDisplayProps,
  variant = 'outlined',
  placeholder,
  optionLabelKey,
  style,
  MenuProps,
  ...props
}) => {
  const classes = styles();

  const getLabel = (value, options): string => {
    if (!options) return String(value);
    const isArrayOptions = Array.isArray(options);

    // Case 1: options as object map { value: label }
    if (!isArrayOptions && typeof options === 'object') {
      return options[value] ?? String(value);
    }

    // Case 2: options as array
    if (isArrayOptions) {
    // array of strings → ['A', 'B']
      if (options.every(opt => typeof opt === 'string')) {
        return value;
      }

      // array of objects → [{ value, label }]
      const found = options.find(opt => opt.value === value);

      if (!found) return String(value);

      const label = optionLabelKey ? found[optionLabelKey] : found.text ?? found.value;

      if (isTranslation(label)) {
        return intl.formatMessage({ id: label });
      }

      return label ?? String(value);
    }

    return String(value);
  };

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
          const { options } = props;

          // Multi select
          if (Array.isArray(selected)) {
            return selected.map((val) => getLabel(val, options)).join(', ');
          }

          // Single select
          return getLabel(selected, options);
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
