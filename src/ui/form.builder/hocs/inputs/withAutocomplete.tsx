import TextField from "@material-ui/core/TextField/TextField";
import { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { RenderInputParams } from "@material-ui/lab/Autocomplete/Autocomplete";
import _ from "lodash";
import Model from "mobx-rest/lib/Model";
import React from "react";
import autocompleteOptions from "../../../../data/autocompleteOptions.json";
import FBAutocompleteCollection from "../../stores/domain/collections/FBAutocompleteCollection";
import { FBAutocompleteProps } from "../../types/inputs/autocomplete";
import { withInput } from "../common/withInput";

export const withAutocomplete = <T extends FBAutocompleteProps>(
  Component: React.FunctionComponent<T>,
) => {
  return withInput(
    ({
      options,
      optionId,
      getOptionLabel,
      optionLabel = "",
      error,
      helperText,
      filterOptions,
      ...props
    }: T) => {
      let indicators: { path: string, renderKey: string } | undefined;

      function setIndicators(): boolean {
        const optionIndicator = _.filter(autocompleteOptions, {
          id: optionId,
        })[0];
        indicators = optionIndicator || {};
        return Boolean(indicators);
      }

      if (_.isEmpty(options) && optionId && setIndicators()) {
        const autocompleteList = new FBAutocompleteCollection(indicators!.path);
        options = autocompleteList.models;
        optionLabel = indicators!.renderKey;
      }

      const renderInput = (params: RenderInputParams) => (
        <TextField
          {...params}
          variant="outlined"
          helperText={helperText}
          error={error}
          fullWidth
        />
      );

      !getOptionLabel && (getOptionLabel = (option: Model) => {
        return _.isEmpty(option) ? "" : option.get(optionLabel);
      });

      !filterOptions && (filterOptions =
        createFilterOptions({
          matchFrom: "any",
          stringify: (option: Model) => option.get(optionLabel),
        }));

      return Component({
        ...(props as T),
        options,
        optionLabel,
        getOptionLabel,
        renderInput,
        filterOptions,
      });
    },
  );
};
