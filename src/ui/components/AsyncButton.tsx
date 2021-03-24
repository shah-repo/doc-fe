import { Button } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { FormikErrors } from "formik";
import * as React from "react";
import { AsyncState, AsyncStatus } from "../../state/types";
import Text from "../components/Text";
import { Translation } from "../translations/types";

interface SubmitButtonProps extends ButtonProps {
  asyncState: AsyncState;
  label: Translation;
  errors?: FormikErrors<any>;
}

const AsyncButton: React.FunctionComponent<SubmitButtonProps> = ({
  asyncState,
  label,
  ...buttonProps
}) => {
  const isActive = asyncState.status === AsyncStatus.Active;
  return (
    <Button
      type="button"
      variant="contained"
      color="secondary"
      disabled={isActive}
      {...buttonProps}
    >
      <Text translation={label} />
    </Button>
  );
};

export default AsyncButton;
