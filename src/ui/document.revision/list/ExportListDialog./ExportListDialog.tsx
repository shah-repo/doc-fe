import { Box, Button, Dialog, DialogContent, DialogContentText, TextField, Typography } from "@material-ui/core";
import _ from "lodash";
import React, { useRef } from "react";
import { CSVLink } from "react-csv";
import { ReactComponent as ExportIcon } from "../../../../assets/images/icon_export_data.svg";
import { DataTable, HeaderTableType } from "../../../../state/ducks/documentRevisions/types";
import Text from "../../../components/Text";
import { DialogHandler } from "../../../hooks/useDialog";
import { styles } from "./ExportListDialog.styles";

interface Props {
  dialog: DialogHandler;
  headers: HeaderTableType[];
  data: DataTable[];
  name: string;
  saveName: (value: string) => void;
}

const ExportListDialog: React.FunctionComponent<Props> = ({
  dialog,
  headers,
  data,
  name,
  saveName,
}) => {
  const classes = styles();
  const cvsRef: any = useRef(null);
  const handleName = (ev: React.ChangeEvent) => {
    const value = _.get(ev.target, "value");
    saveName(value);
  };
  return (
    <>
      {
        dialog.isOpen &&
        <Dialog
          open={dialog.isOpen}
          onClose={dialog.close}
          maxWidth="sm"
          PaperProps={{ id: "exportListDialog" }}
        >
          <DialogContent>
            <Box textAlign="center" marginBottom="20px" whiteSpace="pre-line">
              <Box textAlign="center">
                <span className={classes.iconContainer}>
                  <ExportIcon style={{ marginLeft: 6, marginTop: 7 }}/>
                </span>
                <Typography variant="h6" style={{ marginTop: 20, marginBottom: 5 }}>
                  <Text translation="document.revision.export.list" />
                </Typography>
              </Box>
              <DialogContentText>
                <Box className={classes.dialogContent}>
                  <Typography variant="subtitle1" style={{ marginTop: 20, marginBottom: 5, textAlign: "start" }}>
                    <Text translation="document.revision.enter.file.name" />
                  </Typography>
                  <TextField
                    error={name === ""}
                    variant="outlined"
                    id="ExportListDialog-fileName"
                    style={{ width: 400 }}
                    onChange={handleName}
                  />
                </Box>
              </DialogContentText>
            </Box>
          </DialogContent>
          <Box className={classes.dialogAction} >
            <Button
              variant="contained"
              className={classes.cancelButton}
              onClick={dialog.close}
              id="ExportListDialog-cancelButton"
            >
              <Text translation="common.cancel" />
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={classes.submitButton}
              id="ExportListDialog-downloadButton"
              data-cy="ExportListDialog-downloadButton"
              onClick={dialog.close}
              disabled={name === ""}
            >
              <CSVLink
                data={data}
                headers={headers}
                filename={name + ".csv"}
                style={{ textDecoration: "none" }}
                target="_blank"
                ref={cvsRef}
              >
                <Text translation="common.download" />
              </CSVLink>
            </Button>
          </Box>
        </Dialog>
      }
    </>
  );
};

export default ExportListDialog;
