import { Box, Button, Dialog, Grid } from "@material-ui/core";
import React from "react";
import { ReactComponent as ExportIcon } from "../../../assets/images/icon_export_data.svg";
import { HeaderTableType } from "../../../state/ducks/documentRevisions/types";
import Text from "../../components/Text";
import ExportListDialog from "../../document.revision/list/ExportListDialog/ExportListDialog";
import { DialogHandler } from "../../hooks/useDialog";
import { TemplateOption } from "../form/types";
import FormListContent from "./dialog/FormListContent";
import FormListHeader from "./dialog/FormListHeader";
import { styles } from "./FormList.styles";

interface Props {
  templateOptions: TemplateOption[];
  dialog: DialogHandler;
  handleCreateButton(): void;
  headers: HeaderTableType[];
  data: any[];
  exportDialog: DialogHandler;
}

export const FormListPresenter: React.FunctionComponent<Props> = ({
  templateOptions,
  dialog,
  exportDialog,
  handleCreateButton,
  headers,
  data,
}) => {
  const classes = styles();
  return (
    <>
      <Grid item={true} xs={6} style={{ textAlign: "right", marginBottom: "16px" }}>
        <Button
          variant="outlined"
          color="primary"
          className={classes.exportListbutton}
          style={{ marginRight: 5 }}
          id="ListPresenter-export-list"
          data-cy="document.revision.export.list"
          onClick={exportDialog.open}
        >
          <Box marginRight={1}>
            <ExportIcon className={classes.iconSvg} />
          </Box>
          <Text translation="document.revision.export.list" />
        </Button>
        <ExportListDialog
          {...{ headers, data  }}
          dialog={exportDialog}
        />
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
