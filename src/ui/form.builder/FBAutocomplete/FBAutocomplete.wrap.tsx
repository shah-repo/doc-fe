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
    ...props
  }: T) => {

    state = FB.useRef<FBAutocompleteState>(FBAutocompleteState);
    state.setRenderKey(optionRenderKey);
    const value = _.get(FBStore.getValues(), name);
    if (!multiple && !_.isUndefined(value)) {
      state.defaultValueId = value;
    }

    React.useEffect(() => {
      if (FBStore.mode !== "form") {
        return;
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
      const value = (
        _.get(params, "inputProps.value") ||
        _.get(state?.defaultValue, state?.renderKey || "") ||
        ""
      );

      return ({
        ...params,
        inputProps: {
          ...params.inputProps,
          value,
        },
      });
    }

    const renderTags = (value: any[], getTagProps: any) => {
      return state?.data.map((option: any, index: number) => {
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
    };

    return useObserver(() => {

      const renderInput = (params: RenderInputParams) => (
        <TextField
          {...prepareValue(params)}
          fullWidth
          variant="outlined"
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

      return Component({
        ...(props as T),
        getOptionLabel: (option) => _.get(option, state?.renderKey || "id") || "",
        options: state?.data,
        loading: state?.loading,
        defaultValue: state?.defaultValue,
        name,
        renderInput,
        multiple,
        renderTags,
      });
    });
  };

  return (props: T) => Comp(props);
};
