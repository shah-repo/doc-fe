import { TextField } from "@material-ui/core";
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
    optionRenderKey = "id",
    optionPath = "",
    name = "",
    placeholder,
    renderEl = false,
    ...props
  }: T) => {

    state = FB.useRef<FBAutocompleteState>(FBAutocompleteState);

    React.useEffect(() => {
      if (FBStore.mode !== "form") {
        return;
      }
      const value = _.get(FBStore.getValues(), name);
      state?.setDefaultState(value);
      state?.setUrl(optionPath);
    }, []);

    getOptionLabel = (option) => _.get(option, optionRenderKey) || "";

    const renderInput = (params: RenderInputParams) => (
      <TextField
        {...params}
        fullWidth
        variant="outlined"
        placeholder={placeholder}
      />
    );

    return useObserver(() => Component({
      ...(props as T),
      getOptionLabel,
      renderEl: (!_.isEmpty(state?.data) && !_.isUndefined(state?.defaultValue)),
      options: state?.data,
      loading: state?.loading,
      defaultValue: state?.defaultValue,
      name,
      renderInput,
    }));
  };

  return (props: T) => Comp(props);
};
