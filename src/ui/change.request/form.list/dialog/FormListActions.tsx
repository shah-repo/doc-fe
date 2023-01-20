import { Button, Grid } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import { DialogHandler } from "../../../hooks/useDialog";
import { styles } from "../FormList.styles";

interface Props {
  dialog: DialogHandler;
  confirm: () => void;
}
const FormListActions: React.FunctionComponent<Props> = ({ dialog, confirm }) => {
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
          data-cy="create.approval.request.continue"
          onClick={confirm}
        >
          <Text translation="common.continue" />
        </Button>
      </Grid>
    </Grid>

  );
};

export default FormListActions;
