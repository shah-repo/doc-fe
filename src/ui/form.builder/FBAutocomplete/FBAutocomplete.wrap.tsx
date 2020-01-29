import { Chip, CircularProgress, TextField } from "@material-ui/core";
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
    optionId,
    getOptionLabel,
    optionRenderKey,
    optionPath = "",
    name = "",
    multiple,
    placeholder,
    ...props
  }: T) => {
    state = FB.useRef<FBAutocompleteState>(FBAutocompleteState);
    state.setRenderKey(optionRenderKey);

    React.useEffect(() => {
      if (FBStore.mode !== "form") {
        return;
      }

      const value = _.get(FBStore.getValues(), name);
      if (!multiple && !_.isUndefined(value)) {
        state && (state.defaultValueId = value);
      }

      // Old version support
      if (_.isEmpty(state?.renderKey)) {
        const indicator = state?.getIndicator(optionId);
        if (_.isUndefined(indicator)) {
          return;
        }
        const { renderKey, path } = indicator;
        optionPath = path;
        state?.setRenderKey(renderKey);
      }

      state?.setUrl(optionPath);
    }, []);

    // Default value is not working with async autocomplete
    // This is a workaround
    function prepareValue(params: RenderInputParams): RenderInputParams {
      const defaultValue = state?.isDirty
        ? ""
        : _.get(state?.defaultValue, state?.renderKey || "");
      const value = _.get(params, "inputProps.value") || defaultValue;

      return {
        ...params,
        inputProps: {
          ...params.inputProps,
          value,
        },
      };
    }

    const onOpen = () => state?.setDirty();

    return useObserver(() => {
      const renderInput = (params: RenderInputParams) => (
        <TextField
          {...prepareValue(params)}
          fullWidth
          variant="outlined"
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {state?.loading && <CircularProgress size={20} />}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      );

      const renderTags = (value: any[], getTagProps: any) =>
        state?.data.map((option: any, index: number) => {
          let optionIDS = _.without(_.map(value, "id"), undefined);
          _.isEmpty(optionIDS) && (optionIDS = value);
          if (!_.includes(optionIDS, _.get(option, "id"))) {
            return;
          }
          return (
            <Chip
              key={`autocomplete-chip-${_.get(option, "id")}`}
              label={_.get(option, state?.renderKey || "id")}
              {...getTagProps({ index })}
            />
          );
        });

      return Component({
        ...(props as T),
        getOptionLabel: (option) => _.get(option, state?.renderKey || "id") || "",
        options: state?.data,
        loading: state?.loading,
        name,
        renderInput,
        multiple,
        renderTags,
        onOpen,
      });
    });
  };

  return (props: T) => Comp(props);
};
