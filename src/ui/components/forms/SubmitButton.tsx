import { Button } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { FormikErrors } from "formik";
import _ from "lodash";
import * as React from "react";
import { AsyncState, AsyncStatus } from "../../../state/types";
import Text from "../../components/Text";

export interface SubmitButtonProps extends ButtonProps {
  asyncState: AsyncState;
  label: string;
  errors?: FormikErrors<any>;
}

const SubmitButton: React.FunctionComponent<SubmitButtonProps> = ({
  asyncState,
  label,
  errors,
  ...buttonProps
}) => {
  const hasErrors = !_.isEmpty(errors);
  const isActive = asyncState.status === AsyncStatus.Active;
  return (
    <Button
      type="submit"
      variant="contained"
      color="secondary"
      disabled={hasErrors || isActive}
      {...buttonProps}
    >
      <Text message={label} />
    </Button>
  );
};

export default SubmitButton;
