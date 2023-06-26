import { Box, BoxProps, ClickAwayListener } from '@material-ui/core';
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from 'formik';
import * as React from 'react';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { createFilter } from 'react-select';
import { SelectComponentsProps } from 'react-select/base';
import AsyncCreatableSelect, { Props as AsyncCreatableSelectProps } from 'react-select/async-creatable';
import { ActionMeta, ValueType } from 'react-select/src/types';
import { SM } from '../../../../../App';
import { TypographyProps } from '../../../../../state/ducks/common/types';
import Colors from '../../../../layout/theme/utils/colors';
import { useFormContext } from '../../FormContext';
import Field, { FieldOwnProps } from '../Field';
import { selectStyles, selectTheme } from './Autocomplete';
import { OptionType } from './types';

interface AutocompleteOwnProps extends FieldOwnProps {
  creatableProps: SelectComponentsProps & AsyncCreatableSelectProps<any>
  options?: OptionType[]
  isDisabled?: boolean
  placeholder?: string
  labelProps?: BoxProps
}

type CreatablePropsWithFormik = AutocompleteOwnProps &
FormikFieldProps &
Partial<TypographyProps>;

const Creatable: React.FunctionComponent<CreatablePropsWithFormik> = ({
  creatableProps,
  options,
  isDisabled = false,
  placeholder,
  labelProps,
  ...fieldProps
}) => {
  const formikValue = fieldProps.field.value;
  const { _documentRevisionFormState } = SM.useStores();
  const value = React.useMemo(() => ({ value: formikValue, label: formikValue }), [formikValue]);
  React.useEffect(() => {
    setInputValue(formikValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [inputValue, setInputValue] = useState(formikValue);
  const [hover, setHover] = useState(false);
  const [showOnlyText, setShowOnlyText] = useState(true);
  const { submitForm } = useFormContext();
  const {
    form: { setFieldValue, setFieldTouched, touched },
    field: { name },
  } = fieldProps;
  const onChange = (value: ValueType<OptionType>, action: ActionMeta) => {
    if (action.action === 'clear') {
      setInputValue('');
    }
    else {
      setInputValue((value as any)?.value);
    }
    setFieldValue(name, (value as any)?.value);
  };
  const onInputChange = (value) => {
    if (!touched[name]) {
      setFieldTouched(name, true);
    }
    if (value) {
      setInputValue(value);
      _documentRevisionFormState?.setDirty(true);
    }
    if (!value && inputValue?.length === 1) {
      setInputValue(value);
    }
    setFieldValue(name, value);
  };

  const onBlur = async () => {
    if (formikValue !== inputValue) {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await setFieldValue(name, inputValue);
    }
    setShowOnlyText(true);
    if (formikValue === inputValue) { return; }
    submitForm();
  };

  const stringify = (option: OptionType) => option.label;
  const filterOption = createFilter({ ignoreAccents: false, stringify });

  const onAway = () => {
    setHover(false);
    setShowOnlyText(true);
    onBlur();
  };

  const intl = useIntl();
  const titlePlaceholder = intl.formatMessage({ id: 'form.builder.enter.title' });

  return (
    <Field {...fieldProps} label={undefined} labelProps={labelProps}>
      <ClickAwayListener onClickAway={onAway}>
        <div id="doc-header-title">
          {showOnlyText
        && <Box
          alignItems="center"
          display="flex"
          justifyContent="flex-start"
          letterSpacing="normal"
          fontWeight={600}
          fontSize={19}
          minHeight={32}
          color={inputValue ? Colors.almost_black : Colors.lightest_grey2}
          padding="5.5px 4px"
          bgcolor={hover && Colors.whitest_grey}
          borderRadius={4}
          onMouseEnter={() => { setHover(true); }}
          onMouseLeave={() => { setHover(false); }}
          onClick={() => { setShowOnlyText(false); }}
        >{inputValue || titlePlaceholder}
        </Box>}
          {!showOnlyText && <AsyncCreatableSelect
            inputValue={inputValue}
            value={value}
            styles={{
              ...selectStyles,
              input: (base) => ({
                ...base,
                input: {
                  opacity: '1 !important',
                  fontWeight: 600,
                  fontFamily: 'Sora',
                  color: Colors.almost_black,
                  fontSize: 19,
                  letterSpacing: 'normal',
                },
              }),
              control: (base) => ({
                ...base,
                fontSize: '19px',
                fontWeight: 600,
                lineHeight: '24px',
                minHeight: '32px',
                boxShadow: 'none',
                maxWidth: document.getElementById('doc-header-title')?.offsetWidth,
              }),
              menu: (provided) => ({
                ...provided,
                zIndex: 5,
              }),
            }}
            theme={selectTheme}
            autoFocus={true}
            isClearable={Boolean(formikValue)}
            components={{ DropdownIndicator: null }}
            placeholder={!inputValue
              ? <div style={{ color: Colors.lightest_grey2 }}>{titlePlaceholder}</div> : null}
            openMenuOnClick={false}
            openMenuOnFocus={false}
            createOptionPosition="first"
            isValidNewOption={() => true}
            blurInputOnSelect={false}
            controlShouldRenderValue={false}
            {...{ isDisabled, filterOption, onChange, onInputChange, onBlur }}
            {...creatableProps}
            options={options}
          />}
        </div>
      </ClickAwayListener>
    </Field>
  );
};

type AutocompleteFieldProps = AutocompleteOwnProps &
FieldConfig &
Partial<TypographyProps>;

const CreatableField: React.FunctionComponent<
  AutocompleteFieldProps
> = (props) => <FormikField component={Creatable} {...props} />;

export default CreatableField;
