import { TextField } from "@material-ui/core";
import { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { RenderInputParams } from "@material-ui/lab/Autocomplete/Autocomplete";
import _, { Dictionary } from "lodash";
import { useObserver } from "mobx-react";
import Model from "mobx-rest/lib/Model";
import React from "react";
import autocompleteOptions from "../../../../data/autocompleteOptions.json";
import FBAutocompleteCollection from "../../stores/domain/collections/FBAutocompleteCollection";
import FBDynamicValidatorStore from "../../stores/ui/FBDynamicValidatorStore";
import FBStore from "../../stores/ui/FBStore";
import { FBAutocompleteProps } from "../../types/inputs/autocomplete";
import { FBTemplateSchema } from "../../types/store.js";
import { withFormik } from "../common/withFormik";

export const withAutocomplete = <T extends FBAutocompleteProps>(
  Component: React.FunctionComponent<T>,
) => {
  return withFormik<any, FBTemplateSchema | Dictionary<any>>(
    ({
      options,
      optionId,
      getOptionLabel,
      optionLabelKey = "",
      error,
      name = "",
      helperText,
      filterOptions,
      form,
      field,
      afterChange,
      validationMode,
      hidden = false,
      disabled,
      ...props
    }: T) => {
      let indicators: { path: string; renderKey: string } | undefined;

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
        optionLabelKey = indicators!.renderKey;
      }

      const renderInput = (params: RenderInputParams) => (
        <TextField
          {...params}
          variant="outlined"
          error={error}
          fullWidth
        />
      );

      const onChange = (event: React.ChangeEvent<{}>, value: any) => {
        if (!form && !field) {
          return;
        }
        value = _.isArray(value) ? _.map(value, "id") : _.get(value, "id");
        form!.setFieldValue(field!.name, value);
        afterChange && afterChange(field!.name, value, form!.values || {});
        if (FBStore.mode !== "form") {
          return;
        }
        FBStore.setValues({
          ...FBStore.values,
          [field!.name as string]: value,
        });

        FBDynamicValidatorStore.validate();
      };

      !getOptionLabel &&
        (getOptionLabel = (option: Model) => {
          return _.isEmpty(option) ? "" : option.get(optionLabelKey);
        });

      !filterOptions &&
        (filterOptions = createFilterOptions({
          matchFrom: "any",
          stringify: (option: Model) => option.get(optionLabelKey),
        }));

      if (FBStore.mode === "form") {
        const isFieldHidden = _.isEmpty(helperText) && _.isEmpty(field?.value);
        hidden =
          _.includes(validationMode, "ValidationHidden") && isFieldHidden;
        disabled =
          _.includes(validationMode, "ValidationDisabled") && isFieldHidden;
      }

      return useObserver(() =>
        Component({
          ...(props as T),
          options,
          optionLabelKey,
          getOptionLabel,
          renderInput,
          filterOptions,
          onChange,
          error,
          hidden,
          disabled,
          helperText: FBDynamicValidatorStore.helperText[name],
        }),
      );
    },
  );
};
