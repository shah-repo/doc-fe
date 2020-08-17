import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBAutocompleteAsyncProps, FBAutocompleteAsyncState } from ".";
import { FB, FBOptionValueType } from "..";
import FBAutocompleteAsyncStore from "./FBAutocompleteAsync.store";

export const withFBAutocompleteAsync = <T extends FBAutocompleteAsyncProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    autocompleteAsyncState,
    optionValueType = "key",
    selectedOptions,
    getOptionLabel,
    defaultValue,
    optionId,
    options,
    loading,
    multiple,
    refresh,
    name,
    value,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    autocompleteAsyncState = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, optionId);
    const {
      valueKey: optionValueKey = "value",
      labelKey: optionLabelKey = "text",
    } = autocompleteAsyncState?.optionConfig || {};
    // TODO: handle autocomplete default value from input wrap
    // and discard value prop
    const formValue = formState?.getFieldValue(name, defaultValue) || value;

    function getDefault() {
      const objectValue: Record<FBOptionValueType, () => any> = {
        object: () => formValue,
        key: () => autocompleteAsyncState?.sliceValue(formValue),
        id: () =>  {
          const slicedValue = multiple
            ? _.map(formValue, optionValueKey)
            : _.get(formValue, optionValueKey);
          return  autocompleteAsyncState?.sliceValue(slicedValue);
        },
      };
      return objectValue[optionValueType]();
    }

    useObserver(() => {
      if (!optionId) {
        return;
      }
      const slicedOptions = autocompleteAsyncState?.sliceData;
      loading = loading || FBAutocompleteAsyncStore.loading.get(optionId);
      if (slicedOptions) {
        options = selectedOptions
          ? autocompleteAsyncState?.sliceValue(selectedOptions)
          : slicedOptions;
      }
    });

    (optionId && options && formValue && !_.isEmpty(formValue)) && (defaultValue = getDefault());

    refresh = () => autocompleteAsyncState?.load(true);

    !getOptionLabel && (getOptionLabel = (option) => {
      const { labelPrefixRoot } = autocompleteAsyncState?.optionConfig || {};
      const optionLabel = labelPrefixRoot ? `${_.get(option, labelPrefixRoot)} - ` : "";
      return `${optionLabel}${_.get(option, optionLabelKey, "")}`;
    });

    return Component({
      ...(props as T),
      getOptionLabel,
      refresh,
      options,
      loading,
      optionId,
      optionValueKey,
      optionLabelKey,
      optionValueType,
      selectedOptions,
      defaultValue,
      multiple,
      name,
      value,
    });
  };

  return (props: T) => Comp(props);
};
