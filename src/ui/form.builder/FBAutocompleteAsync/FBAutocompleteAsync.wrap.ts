import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBAutocompleteAsyncProps, FBAutocompleteAsyncState } from ".";
import { FB } from "..";
import FBStore from "../stores/ui/FBStore";

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
    name,
    ...props
  }: T) => {

    autocompleteAsyncState = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState);
    autocompleteAsyncState?.setOptionId(optionId);
    const {
      valueKey: optionValueKey = "id",
      labelKey: optionLabelKey = "name",
    } = autocompleteAsyncState?.optionConfig || {};
    const formValue = FBStore.getValue(name) || defaultValue;

    React.useEffect(() => {
      if (!optionId) {
        return;
      }
      autocompleteAsyncState?.load();
    }, [optionId]);

    useObserver(() => {
      if (!optionId) {
        return;
      }
      const slicedOptions = autocompleteAsyncState?.sliceData;
      if (selectedOptions) {
        options = autocompleteAsyncState?.sliceValue(slicedOptions);
      } else {
        options = slicedOptions;
      }
      // options = autocompleteAsyncState?.sliceData;
      loading = !options && autocompleteAsyncState?.loading;
    });

    if (options && formValue && optionValueType === "key") {
      optionValueType = "object";
      defaultValue = autocompleteAsyncState?.sliceValue(formValue);
    }

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
      defaultValue,
      multiple,
      name,
    });
  };

  return (props: T) => Comp(props);
};
