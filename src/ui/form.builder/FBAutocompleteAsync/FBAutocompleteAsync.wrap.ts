import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBAutocompleteAsyncProps, FBAutocompleteAsyncState } from ".";
import { FB } from "..";
import FBAutocompleteAsyncStore from "./FBAutocompleteAsync.store";

export const withFBAutocompleteAsync = <T extends FBAutocompleteAsyncProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    autocompleteAsyncState,
    getOptionLabel,
    optionId,
    options,
    loading,
    ...props
  }: T) => {

    autocompleteAsyncState = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState);
    autocompleteAsyncState?.setOptionId(optionId);
    const {
      valueKey: optionValueKey = "id",
      labelKey: optionLabelKey = "name",
    } = autocompleteAsyncState?.optionConfig || {};

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
      options = FBAutocompleteAsyncStore.getData(optionId);
      loading = !options && autocompleteAsyncState?.loading;
    });

    getOptionLabel = (option) => {
      const { labelPrefixRoot } = autocompleteAsyncState?.optionConfig || {};
      const optionLabel = labelPrefixRoot ? `${_.get(option, labelPrefixRoot)} - ` : "";
      return `${optionLabel}${_.get(option, optionLabelKey, "")}`;
    };

    return Component({
      ...(props as T),
      options,
      loading: autocompleteAsyncState?.loading,
      optionValueKey,
      optionLabelKey,
      getOptionLabel,
    });
  };

  return (props: T) => Comp(props);
};
