import { Chip, TextField } from "@material-ui/core";
import { RenderInputParams } from "@material-ui/lab/Autocomplete";
import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBAutocompleteProps, FBAutocompleteState } from ".";
import { FB } from "..";
import FBStore from "../stores/ui/FBStore";

export const withFBAutocomplete = <T extends FBAutocompleteProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    state,
    getOptionLabel,
    optionValueKey,
    optionLabelKey,
    prefixLabelRoot = "",
    optionPath = "",
    optionId = "",
    name = "",
    placeholder,
    renderEl,
    options,
    renderTags,
    disabled,
    defaultValue,
    ...props
  }: T) => {
    state = FB.useRef<FBAutocompleteState>(FBAutocompleteState);
    renderEl = FBStore.mode === "design" || !_.isUndefined(options);

    // Old version support
    // Will be removed after we update be indicators
    if (!_.isEmpty(optionId)) {
      const indicator = state?.getIndicator(optionId);
      if (!_.isUndefined(indicator)) {
        optionPath = _.get(indicator, "path");
        optionValueKey = optionValueKey || _.get(indicator, "optionValueKey", "");
        optionLabelKey = optionLabelKey || _.get(indicator, "optionLabelKey", "");
        prefixLabelRoot = _.get(indicator, "prefixLabelRoot", "");
        const { root } = indicator;
        state.setRoot(root || "");
      }
    }

    !optionValueKey && (optionValueKey = "value");
    !optionLabelKey && (optionLabelKey = "text");

    React.useEffect(() => {
      const value = _.get(FBStore.getValues(), name) || "";
      state?.setDefaultState(value);
      state?.setUrl(optionPath);
    }, []);

    getOptionLabel = (option) => {
      const optionLabel = prefixLabelRoot ? `${_.get(option, prefixLabelRoot)} - ` : "";
      return `${optionLabel}${_.get(option, optionLabelKey || "", "")}`;
    };

    renderTags = (value, getTagProps) =>
      value.map((option, index) => (
        <Chip
          key={`${_.kebabCase(option)}-${index}`}
          label={_.get(option, optionLabelKey || "", "")}
          {...getTagProps({ index })}
          {...{ disabled }}
        />
      ));

    const renderInput = (params: RenderInputParams) => (
      <TextField
        {...params}
        fullWidth
        variant="outlined"
        placeholder={placeholder}
      />
    );

    return useObserver(() =>
      Component({
        ...(props as T),
        getOptionLabel,
        renderEl: renderEl || state?.loaded,
        options: options || state?.data,
        loading: state?.loading,
        defaultValue: state?.defaultValue || defaultValue,
        name,
        renderInput,
        optionValueKey,
        optionLabelKey,
        disabled,
        renderTags,
      }),
    );
  };

  return (props: T) => Comp(props);
};
