import { get, isEmpty, isObject, map } from "lodash";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { FBAutocompleteAsyncProps, FBAutocompleteAsyncState } from ".";
import { FB, FBOptionValueType } from "..";
import FBAutocompleteAsyncStore from "./FBAutocompleteAsync.store";

export const withFBAutocompleteAsync = <T extends FBAutocompleteAsyncProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    getOptionLabel,
    refresh,
    autocompleteAsyncState,
    optionValueType = "key",
    shouldReloadOnInit = false,
    labelPrefixRoot,
    selectedOptions,
    includeRevision,
    defaultValue,
    additionalData,
    freeSolo,
    optionId,
    options,
    loading,
    multiple,
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
        key: () => autocompleteAsyncState?.sliceValue(formValue) || formValue,
        id: () =>  {
          const slicedValue = multiple
            ? map(formValue, optionValueKey)
            : get(formValue, optionValueKey);
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

    // Add some static additional data to dynamic store list
    useEffect(() => autocompleteAsyncState?.setAdditionalData(additionalData),
      [additionalData, autocompleteAsyncState]);

    useEffect(() => {
      if (shouldReloadOnInit) {
        autocompleteAsyncState?.load(true);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    (optionId && options && formValue && !isEmpty(formValue)) && (defaultValue = getDefault());

    refresh = () => autocompleteAsyncState?.load(true);

    !getOptionLabel && (getOptionLabel = (option) => {
      if (freeSolo && !isObject(option)) {
        return option;
      }
      const { labelPrefixRoot, includeRevision } = autocompleteAsyncState?.optionConfig || {};
      let optionLabel = labelPrefixRoot ? `${get(option, labelPrefixRoot)} - ` : "";
      if (includeRevision) {
        const revision = get(option, includeRevision);
        optionLabel = labelPrefixRoot ?
          `${get(option, labelPrefixRoot)} - rev ${revision} - ` : "";
      }
      return `${optionLabel}${get(option, optionLabelKey, "")}`;
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
      labelPrefixRoot,
      optionValueType,
      selectedOptions,
      defaultValue,
      freeSolo,
      multiple,
      name,
      value,
    });
  };

  return (props: T) => Comp(props);
};
