import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBAutocompleteAsyncProps, FBAutocompleteAsyncState } from ".";
import { FB } from "..";

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
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    autocompleteAsyncState = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, optionId);
    const {
      valueKey: optionValueKey = "value",
      labelKey: optionLabelKey = "text",
    } = autocompleteAsyncState?.optionConfig || {};
    const formValue = formState?.getFieldValue(name);

    useObserver(() => {
      if (!optionId) {
        return;
      }
      const slicedOptions = autocompleteAsyncState?.sliceData;
      if (slicedOptions) {
        options = selectedOptions
          ? autocompleteAsyncState?.sliceValue(selectedOptions)
          : slicedOptions;
      }
      loading = autocompleteAsyncState?.loading;
    });

    if (options && formValue && optionValueType === "key") {
      const value = autocompleteAsyncState?.sliceValue(formValue);
      defaultValue = _.map(value, { optionValueKey });
    }

    refresh = () => autocompleteAsyncState?.load(true);

    getOptionLabel = (option) => {
      const { labelPrefixRoot } = autocompleteAsyncState?.optionConfig || {};
      const optionLabel = labelPrefixRoot ? `${_.get(option, labelPrefixRoot)} - ` : "";
      return `${optionLabel}${_.get(option, optionLabelKey, "")}`;
    };

    return Component({
      ...(props as T),
      options,
      loading,
      optionValueKey,
      optionLabelKey,
      optionValueType,
      getOptionLabel,
      selectedOptions,
      defaultValue,
      multiple,
      refresh,
      name,
    });
  };

  return (props: T) => Comp(props);
};
