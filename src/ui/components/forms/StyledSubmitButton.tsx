import { Button, withStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { FormikErrors } from "formik";
import { isEmpty } from "lodash";
import * as React from "react";
import { AsyncState, AsyncStatus } from "../../../state/types";
import Colors from "../../layout/theme/utils/colors";
import Text from "../Text";

const styles = () => ({
  root: {
    "height": "36px",
    "borderRadius": "100px",
    "background": Colors.navy,
    "color": Colors.white,
    "border": `1px solid ${Colors.navy}`,
    "boxShadow": "none",
    "&:hover": {
      background: Colors.navy,
    },
    "&.Mui-disabled": {
      border: "none",
      backgroundColor: Colors.gains_boro,
      color: Colors.spanish_gray,
    },
  },
});

export interface SubmitButtonProps extends ButtonProps {
  asyncState: AsyncState;
  label: string;
  errors?: FormikErrors<any>;
  dataCy?: string;
  showNewButton?: boolean;
}
const SubmitButton: React.FunctionComponent<SubmitButtonProps> = ({
  asyncState,
  label,
  dataCy,
  errors,
  ...buttonProps
}) => {
  const hasErrors = !isEmpty(errors);
  const isActive = asyncState.status === AsyncStatus.Active;
  return (
    <Button
      type="submit"
      variant="contained"
      color="secondary"
      data-cy={dataCy}
      disabled={hasErrors || isActive}
      {...buttonProps}
    >
      <Text message={label} />
    </Button>
  );
};

export const StyledSubmitButton = withStyles(styles)(SubmitButton);
