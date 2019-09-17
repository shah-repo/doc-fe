import { Box } from "@material-ui/core";
import React from "react";
import { withFormik } from "../../../../../components/hoc/formik";
import Text from "../../../../../components/Text";
import { Subtract } from "../../../common/utils/types";
import { FBTextFieldInjectedProps, FBTextFieldProps } from "./types";

export function withTextFieldDefaults<T extends FBTextFieldProps>(
  Component: React.ComponentType<T>,
) {

  class HOC extends React.Component<Subtract<T, FBTextFieldInjectedProps>> {

    private labelRenderer = (
      <Box mb={0.5} fontSize="subtitle1.fontSize" fontWeight="fontWeightRegular">
        <Text message={this.props.label as string} />
      </Box>
    );

    public render() {
      const { field, label } = this.props;
      return (
        <Component
          {...this.props as T}
          variant="outlined"
          onChange={this.handleChange}
          defaultValue={field.value}
          labelRenderer={label && this.labelRenderer}
        />
      );
    }

    private handleChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
      const { form, field } = this.props;
      form.setFieldValue(field.name, event.target.value);
    }
  }

  return withFormik(HOC);
}
