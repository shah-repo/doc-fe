import TextField from "@material-ui/core/TextField/TextField";
import { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { RenderInputParams } from "@material-ui/lab/Autocomplete/Autocomplete";
import _, { Dictionary } from "lodash";
import Model from "mobx-rest/lib/Model";
import React from "react";
import autocompleteOptions from "../../../../data/autocompleteOptions.json";
import FBAutocompleteCollection from "../../stores/domain/collections/FBAutocompleteCollection";
import FBStore from "../../stores/ui/FBStore";
import { FBAutocompleteProps } from "../../types/inputs/autocomplete";
import { FBTemplateSchema } from "../../types/store.js";
import { withFormik } from "../common/withFormik";

export const withAutocomplete = <T extends FBAutocompleteProps>(
  Component: React.FunctionComponent<T>,
) => {
  return withFormik<any, FBTemplateSchema | Dictionary<any>>(({
      options,
      optionId,
      getOptionLabel,
      optionLabel = "",
      error,
      helperText,
      filterOptions,
      form,
      field,
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

      const onChange = (event: React.ChangeEvent<{}>, value: any) => {
        if (!form && !field) {
          return;
        }
        value = _.isArray(value) ? _.map(value, "id") : _.get(value, "id");

        if (FBStore.mode !== "form") {
          return form!.setFieldValue(field!.name, value);
        }
        FBStore.setValues({
          ...FBStore.values,
          [field!.name as string]: value,
        });
      };

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
        onChange,
        error,
      });
    },
  );
};
