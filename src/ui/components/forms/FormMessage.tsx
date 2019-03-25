import { FormHelperText } from "@material-ui/core";
import { FormHelperTextProps } from "@material-ui/core/FormHelperText";
import * as React from "react";
import { AsyncState, AsyncStatus } from "../../../state/types";
import Text from "../../components/Text";

export interface FormMessageProps extends FormHelperTextProps {
  asyncState: AsyncState;
}

const FormMessage: React.FunctionComponent<FormMessageProps> = ({ asyncState, ...formHelperTextProps }) => {
  if (!asyncState.message) {
    return null;
  }

  return (
    <FormHelperText
      error={asyncState.status === AsyncStatus.Error}
      {...formHelperTextProps}
    >
      <Text message={asyncState.message} />
    </FormHelperText>
  );
};

export default FormMessage;
