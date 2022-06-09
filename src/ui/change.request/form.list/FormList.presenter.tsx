import { Box, Button, Dialog, Grid } from "@material-ui/core";
import React from "react";
import { ReactComponent as ExportIcon } from "../../../assets/images/export_data.svg";
import { HeaderTableType } from "../../../state/ducks/documentRevisions/types";
import GridTitle from "../../components/KendoGrid/GridTitle/presenter";
import KendoGridStyles from "../../components/KendoGrid/KendoGrid.styles";
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

const FormListPresenter: React.FunctionComponent<Props> = ({
  templateOptions,
  dialog,
  exportDialog,
  handleCreateButton,
  headers,
  data,
}) => {
  const classes = styles();
  const gridClasses = KendoGridStyles();
  return (
    <>
      <Grid item xs={12} className={gridClasses.headerGridItem}>
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <GridTitle translation="page.table.title.changeRequest" />
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              className={classes.exportListbutton}
              id="ListPresenter-export-list"
              data-cy="document.revision.export.list"
              onClick={exportDialog.open}
            >
              <Box display="flex">
                <ExportIcon className={classes.iconSvg} height={14} width={14} />
              </Box>
              <Text translation="document.revision.export.list" />
            </Button>
            <ExportListDialog
              {...{ headers, data }}
              dialog={exportDialog}
              customFileName="DocumentList"
            />
            <Button
              id="ChangeRequest-create"
              data-cy={"change.request.create"}
              onClick={handleCreateButton}
              className={classes.createButton}
            >
              <Text translation="change.request.create" />
            </Button>
          </Grid>
        </Grid>
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
