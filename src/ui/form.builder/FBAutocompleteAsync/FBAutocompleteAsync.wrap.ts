import { ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import { get, isArray, isEmpty, isObject, isString, map } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { FB, FBAutocompleteAsyncProps, FBAutocompleteAsyncState, FBOptionValueType } from "..";
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
    omitFormValue,
    forceNewRender,
    urlValues,
    freeSolo,
    optionId,
    options,
    loading,
    multiple,
    name,
    withoutPrefixRoot,
    withoutLabelKey,
    value,
    ...props
  }: T) => {
    const { formState } = FB.useStores();
    autocompleteAsyncState = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
      optionId,
      urlValues,
    });
    const {
      valueKey: optionValueKey = "value",
      labelKey: optionLabelKey = "text",
    } = autocompleteAsyncState?.optionConfig || {
      valueKey: props.optionValueKey,
      labelKey: props.optionLabelKey,
    };

    // TODO: handle autocomplete default value from input wrap
    // and discard value prop
    const formValue = formState?.getFieldValue(name, defaultValue, omitFormValue) || value;

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
      forceNewRender = formState?.getInputState(name || "")?.forceRender;
      if (!optionId) {
        return;
      }
      const slicedOptions = autocompleteAsyncState?.sliceData;
      loading = (
        loading ||
        FBAutocompleteAsyncStore.loading.get(optionId) ||
        autocompleteAsyncState?.autocompleteValueApi.loading
      );
      if (slicedOptions) {
        options = selectedOptions
          ? autocompleteAsyncState?.sliceValue(selectedOptions)
          : slicedOptions;
      }
      // forceNewRender = formState?.getInputState(name || "")?.forceRender;
    });

    // set missing selected autocomplete value
    React.useEffect(() => reaction(
      () => autocompleteAsyncState?.autocompleteValueApi.data,
      (data) => {
        const { id } = data || {};
        FBAutocompleteAsyncStore.add(optionId as string, id, data);
        formState?.getInputState(name || "")?.setRender();
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // Add some static additional data to dynamic store list
    useEffect(() => autocompleteAsyncState?.setAdditionalData(additionalData),
      [additionalData, autocompleteAsyncState]);

    useEffect(() => {
      if (shouldReloadOnInit) {
        autocompleteAsyncState?.load(true);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (optionId) {
      (options && formValue && !isEmpty(formValue)) && (defaultValue = getDefault());
      refresh = () => autocompleteAsyncState?.load(true);
    }

    !getOptionLabel && (getOptionLabel = (option) => {
      if (freeSolo && !isObject(option)) {
        return option;
      }
      if (!freeSolo && !isObject(option)) {
        option = defaultValue;
      }
      if (!get(option, optionValueKey) && !autocompleteAsyncState?.autocompleteValueApi.loading) {
        if (isArray(option)) {
          const undefinedOptions = option.filter((e) => isString(e));
          undefinedOptions.map((opt) => {
            if (!opt || !isString(opt) || opt === "Void") {
              // eslint-disable-next-line array-callback-return
              return;
            }
            return autocompleteAsyncState?.fetchAutocompleteOption(opt, optionId);
          }
          );
          return "";
        }
        if (!option || !isString(option) || option === "Void") {
          return;
        }
        autocompleteAsyncState?.fetchAutocompleteOption(option, optionId);
        return "";
      }
      if (!get(option, optionValueKey)) {
        return "";
      }
      const { labelPrefixRoot, includeRevision } = autocompleteAsyncState?.optionConfig || {};
      let optionLabel = labelPrefixRoot ? `${get(option, labelPrefixRoot)} - ` : "";
      if (withoutPrefixRoot) {
        optionLabel = "";
      }
      if (includeRevision) {
        const revision = get(option, includeRevision);
        optionLabel = labelPrefixRoot ?
          `${get(option, labelPrefixRoot)} - rev ${revision} - ` : "";
        if (withoutLabelKey && labelPrefixRoot) {
          return `${get(option, labelPrefixRoot)} - rev ${revision}`;
        }
      }
      const description = htmlToPlainText(get(option, optionLabelKey, ""));
      return `${optionLabel}${description}`;
    });

    function htmlToPlainText(value?: string): string {
      if (!value) { return ""; }
      const contentBlock = htmlToDraft(value);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      return contentState.getPlainText();
    }

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
      omitFormValue,
      forceNewRender,
      freeSolo,
      multiple,
      urlValues,
      name,
      value,
    });
  };

  return (props: T) => Comp(props);
};
