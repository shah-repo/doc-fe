import { Button } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import * as React from "react";
import { AsyncState, AsyncStatus } from "../../../state/types";
import Text from "../../components/Text";
import { Translation } from "../../translations/types";

export interface SubmitButtonProps extends ButtonProps {
  asyncState: AsyncState;
  label: Translation;
}

const SubmitButton: React.FunctionComponent<SubmitButtonProps> = ({ asyncState, label, ...buttonProps }) => (
  <Button
    type="submit"
    variant="contained"
    color="primary"
    disabled={asyncState.status === AsyncStatus.Active}
    {...buttonProps}
  >
    <Text translation={label} />
  </Button>
);

export default SubmitButton;
