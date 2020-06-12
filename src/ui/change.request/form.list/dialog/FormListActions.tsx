import { Button, Grid } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import { DialogHandler } from "../../../hooks/useDialog";
import { styles } from "../FormList.styles";

interface Props {
  dialog: DialogHandler;
}
export const FormListActions: React.FunctionComponent<Props> = ({ dialog }) => {
  const classes = styles();

  return (

    <Grid container spacing={1}>
      <Grid item xs={4}>
        <Button
          variant="contained"
          className={classes.cancelButton}
          onClick={dialog.close}
          fullWidth
          id="FormList-cancelButton"
        >
          <Text translation="transition.action.cancel" />
        </Button>
      </Grid>
      <Grid item xs={8}>
        <Button
          type="submit"
          variant="contained"
          className={classes.submitButton}
          fullWidth
          id="FormList-continueButton"
        >
          <Text translation="common.continue" />
        </Button>
      </Grid>
    </Grid>

  ); };

export default FormListActions;
