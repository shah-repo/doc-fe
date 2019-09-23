import { MenuItem } from "@material-ui/core";
import React from "react";
import { withFormik } from "../../../../../components/hoc/formik";
import Text from "../../../../../components/Text";
import { withLabelRenderer } from "../../../common/hoc/withLabelRenderer";
import { Subtract } from "../../../common/utils/types";
import { FBSelectInjectedProps, FBSelectProps } from "./types";

export function withSelectDefaults<T extends FBSelectProps>(
  Component: React.ComponentType<T>,
) {

  class HOC extends React.Component<Subtract<T, FBSelectInjectedProps>> {

    private EmptyItem = this.props.includeEmpty && (
      <MenuItem value="">
        <Text translation="fields.select.none" tagName="em" />
      </MenuItem>
    );

    private Items = this.props.options.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        <Text message={option.text} />
      </MenuItem>
    ));

    public render() {
      const { field, label } = this.props;
      return (
        <Component
          fullWidth={true}
          {...this.props as T}
          variant="outlined"
          onChange={this.handleChange()}
          value={field.value}
          emptyItem={this.EmptyItem}
          items={this.Items}
        />
      );
    }

    private handleChange = () => (
      event: React.ChangeEvent<{ name?: string; value: unknown }>,
    ) => {
      const { form, field } = this.props;
      form.setFieldValue(field.name, event.target.value);
    }
  }

  return withFormik(withLabelRenderer(HOC));
}
