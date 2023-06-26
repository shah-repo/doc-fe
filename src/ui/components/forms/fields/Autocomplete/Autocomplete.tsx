import { Typography } from '@material-ui/core';
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from 'formik';
import * as React from 'react';
import Select, { components, createFilter, StylesConfig, Theme } from 'react-select';
import { SelectComponentsProps } from 'react-select/base';
import { ValueType } from 'react-select/src/types';
import { ReactComponent as DeleteIcon } from '../../../../../assets/images/circle-remove.svg';
import { TypographyProps } from '../../../../../state/ducks/common/types';
import Text from '../../../../components/Text';
import { styles as FBAutoCompleteStyles } from '../../../../form.builder/styles/FBAutocomplete.styles';
import { Colors } from '../../../../layout/theme-next';
import { useFormContext } from '../../FormContext';
import Field, { FieldOwnProps } from '../Field';
import { InputField } from '../Input.styles';
import { OptionType } from './types';

interface AutocompleteOwnProps extends FieldOwnProps {
  autocompleteProps: Omit<SelectComponentsProps, 'onChange'>
  options: OptionType[]
  onClick?: (value: any) => void
  onChange?: (value: ValueType<OptionType>) => void
  isDisabled?: boolean
  portal?: boolean
}

export const selectStyles: StylesConfig = {
  multiValue: (base) => ({
    ...base,
    background: Colors.primaryBg,
  }),
  multiValueRemove: (base) => ({
    ...base,
    '&:hover': {
      background: 'transparent',
      cursor: 'pointer',
    },
  }),
  control: (base, state) => ({
    ...base,
    'minHeight': '40px',
    'boxShadow': 'none',
    '&:hover': {
      background: !state.isFocused ? Colors.primaryHighlight : Colors.white,
    },
  }),
  placeholder: (base) => ({
    ...base,
    letterSpacing: 'normal',
    color: Colors.textDisabled,
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 2,
  }),
};

export const selectTheme = (theme: Theme): Theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: Colors.primaryLight,
    primary25: Colors.primaryHighlight,
    primary50: Colors.primaryHighlight,
  },
});

export const MultiValueRemove = (props) => (
  <components.MultiValueRemove {...props}>
    <DeleteIcon style={{ width: 12, height: 12 }} />
  </components.MultiValueRemove>
);

type AutocompletePropsWithFormik = AutocompleteOwnProps &
FormikFieldProps &
Partial<TypographyProps>;

const Autocomplete: React.FunctionComponent<AutocompletePropsWithFormik> = ({
  onClick,
  autocompleteProps,
  options,
  isDisabled = false,
  portal,
  ...fieldProps
}) => {
  const { submitForm } = useFormContext();
  const onChange = (value: ValueType<OptionType>) => {
    fieldProps.onChange?.(value);
    const {
      form: { setFieldValue, setFieldTouched, touched },
      field: { name },
    } = fieldProps;

    if (!touched[name]) {
      setFieldTouched(name, true);
    }

    setFieldValue(name, value);

    if (onClick) {
      onClick(value);
    }
  };

  const stringify = (option: OptionType) => option.label;
  const filterOption = createFilter({ ignoreAccents: false, stringify });

  return (
    <Field {...fieldProps} label={undefined}>
      <Typography variant="h5" style={FBAutoCompleteStyles.labelProps}>
        <Text message={fieldProps.label} />
      </Typography>
      <Select
        {...fieldProps.field}
        {...autocompleteProps}
        menuPlacement={portal ? 'top' : 'auto'}
        menuPortalTarget={portal ? document.querySelector('body') : null}
        options={options}
        onChange={onChange}
        styles={selectStyles}
        theme={selectTheme}
        filterOption={filterOption}
        data-cy={`select_${fieldProps.field.name}`}
        input={<InputField name={fieldProps.field.name} />}
        isDisabled={isDisabled}
        components={{ MultiValueRemove }}
        onBlur={() => {
          submitForm();
        }}
      />
    </Field>
  );
};

type AutocompleteFieldProps = AutocompleteOwnProps &
FieldConfig &
Partial<TypographyProps>;

const AutocompleteField: React.FunctionComponent<
  AutocompleteFieldProps
> = (props) => <FormikField component={Autocomplete} {...props} />;

export default AutocompleteField;
