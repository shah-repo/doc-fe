import { Button, Dialog, Grid } from "@material-ui/core";
import React from "react";
import { DocumentTypeById } from "../../../state/ducks/documentRevisions/documentType/types";
import Text from "../../components/Text";
import useDialog from "../../hooks/useDialog";
import FormListContent from "./dialog/FormListContent";
import FormListHeader from "./dialog/FormListHeader";
import { styles } from "./FormList.styles";

interface Props {
  templateOptions: DocumentTypeById[];
}

export const FormListPresenter: React.FunctionComponent<Props> = ({
  templateOptions,
}) => {
  const classes = styles();
  const dialog = useDialog();
  return (
    <>
      <Grid item={true} xs={6} style={{ textAlign: "right", marginBottom: "16px" }}>
        <Button
          variant="contained"
          color="primary"
          id="ChangeRequest-create"
          data-cy="change.request.create"
          onClick={dialog.open}
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
