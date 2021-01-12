import { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { filter, find, get, includes, isEmpty, isObject, isString, isUndefined, map } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { FBAutocompleteProps } from ".";
import { FB, FBOptionValueType } from "..";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { isTranslation } from "../../translations/types";

export const withFBAutocomplete = <T extends FBAutocompleteProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    onInputChange,
    getOptionDisabled,
    getOptionLabel,
    filterOptions,
    groupBy,
    optionLabelKey = "text",
    optionValueKey = "value",
    optionValueType = "key",
    labelPrefixRoot,
    groupByKey,
    disabledOptions,
    placeholder,
    multiple,
    name,
    defaultValue,
    options,
    optionId,
    freeSolo,
    ...props
  }: T) => {
    const { formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name) || defaultValue;
    const intl = useIntl();

    function getDefault() {
      function  sliceValue(value: any) {
        return multiple
          ? filter(options, (o) => (value || formValue).includes(o[optionValueKey]))
          : find(options, { [optionValueKey]: value || formValue });
      }

      const objectValue: Record<FBOptionValueType, () => any> = {
        object: () => formValue,
        key: () => sliceValue(formValue) || formValue,
        id: (value?: any) =>  {
          const slicedValue = multiple
            ? map(value || formValue, optionValueKey)
            : get(value || formValue, optionValueKey);
          return sliceValue(slicedValue);
        },
      };
      return objectValue[optionValueType]();
    }

    if (placeholder && isTranslation(placeholder)) {
      placeholder = intl.formatMessage({ id: placeholder });
    }

    (!optionId && options && formValue && !isEmpty(formValue)) && (defaultValue = getDefault());

    !getOptionLabel && (getOptionLabel = (option) => {
      if (freeSolo && isString(defaultValue) && isString(option)) {
        return option;
      }
      if (!isObject(option)) {
        option = defaultValue;
      }
      let optionText = get(option, optionLabelKey);
      if (isTranslation(optionText)) {
        optionText = intl.formatMessage({ id: optionText });
      }
      const optionLabel = labelPrefixRoot ? `${get(option, labelPrefixRoot)} - ` : "";
      return `${optionLabel}${optionText}`;
    });

    groupByKey && (groupBy = (option) => option[groupByKey]);

    disabledOptions && (getOptionDisabled = (option) =>
      includes(disabledOptions, option.id)
    );

    onInputChange = (ev: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // setField doesn't work here, the same problem prefilled with first option
      if (!freeSolo) { return; }
      const { target: { value = "" } = {} } = ev;
      formState?.setFieldValue(name, value);
    };

    const stringify = (option: OptionType) => (getOptionLabel && getOptionLabel(option)) || "";
    filterOptions = createFilterOptions({ ignoreAccents: false, stringify });

    if (isUndefined(defaultValue)) {
      defaultValue = "";
    }
    return Component({
      ...(props as T),
      onInputChange,
      getOptionDisabled,
      getOptionLabel,
      filterOptions,
      groupBy,
      options,
      defaultValue,
      optionValueKey,
      optionLabelKey,
      optionValueType,
      placeholder,
      multiple,
      optionId,
      freeSolo,
      value: defaultValue,
      name,
    });
  };

  return (props: T) => Comp(props);
};
