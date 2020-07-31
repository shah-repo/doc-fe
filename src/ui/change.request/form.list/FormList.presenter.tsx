import { Button, Dialog, Grid } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";
import { DialogHandler } from "../../hooks/useDialog";
import { TemplateOption } from "../form/types";
import FormListContent from "./dialog/FormListContent";
import FormListHeader from "./dialog/FormListHeader";
import { styles } from "./FormList.styles";

interface Props {
  templateOptions: TemplateOption[];
  dialog: DialogHandler;
  handleCreateButton(): void;
}

export const FormListPresenter: React.FunctionComponent<Props> = ({
  templateOptions,
  dialog,
  handleCreateButton,
}) => {
  const classes = styles();
  return (
    <>
      <Grid item={true} xs={6} style={{ textAlign: "right", marginBottom: "16px" }}>
        <Button
          variant="contained"
          color="primary"
          id="ChangeRequest-create"
          data-cy={"change.request.create"}
          onClick={handleCreateButton}
          className={classes.createButton}
        >
          <Text translation="change.request.create" />
        </Button>
      </Grid>
      <Dialog
        open={dialog.isOpen}
        onClose={dialog.close}
        classes={{ paper: classes.dialogPaper }}
      >
        <FormListHeader {...{ dialog }} />
        <FormListContent {...{ dialog, templateOptions }} />
      </Dialog>
    </>
  );
};

export default FormListPresenter;
