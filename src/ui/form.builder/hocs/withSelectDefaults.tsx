import { MenuItem } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { SelectOption } from "../../components/forms/fields/FilledSelect";
import Text from "../../components/Text";
import FBStore from "../stores/FBStore";
import { Subtract } from "../types/common";
import { FBSelectInjectedProps, FBSelectProps } from "../types/select";
import { withLabelRenderer } from "./withLabelRenderer";
import { withOnChange } from "./withOnChange";

export function withSelectDefaults<T extends FBSelectProps>(
  Component: React.ComponentType<T>,
) {

  class HOC extends React.Component<Subtract<T, FBSelectInjectedProps>> {

    public render() {
      return (
        <Component
          fullWidth={true}
          {...this.props as T}
          variant="outlined"
          items={this.Items()}
          showNote={this.showNote()}
        />
      );
    }

    private Items = () => this.options().map((option) => (
      <MenuItem key={option.value} value={option.value}>
        <Text message={option.text} tagName="em"  />
      </MenuItem>
    ))

    private options = (): SelectOption[] => {
      const { includeOther, includeEmpty } = this.props;
      const options = this.splitOptions();

      if (includeEmpty) {
        options.splice(0, 0, { value: "", text: "fields.select.none" });
      }

      if (includeOther) {
        options.push({ value: "gen_other", text: "form.builder.other" });
      }

      return options;
    }

    private splitOptions = (): SelectOption[] => {
      let options = this.props.options;
      if (!options) { return []; }

      if (typeof options === "string" ) {
        const optionsArray = _.split(options, "\n");
        options = optionsArray.map((label, i) => (
          {value: `gen_${i}`, text: label}) as SelectOption,
        );
      }
      return options as SelectOption[];
    }

    private showNote = (): boolean => {
      const { field, includeNote } = this.props;

      return (
        FBStore.mode === "form" &&
        field.value === "gen_other" &&
        (includeNote || false)!
      );
    }
  }

  return withOnChange(withLabelRenderer(HOC));
}
