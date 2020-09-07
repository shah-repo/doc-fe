import { Box, Button, Dialog, DialogContent, DialogContentText, TextField, Typography } from "@material-ui/core";
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
  fileName: string;
  saveFileName: (value: string) => void;
}

const ExportListDialog: React.FunctionComponent<Props> = ({
  dialog,
  headers,
  data,
  fileName = "DocumentList",
  saveFileName,
}) => {
  const classes = styles();
  const csvRef: any = useRef(null);
  const handleFileName = (ev: React.ChangeEvent<any>) => {
    const { value } = ev.target;
    saveFileName(value);
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
                  <ExportIcon style={{ marginLeft: 6, marginTop: 7 }} />
                </span>
                <Typography variant="h6" className={classes.title}>
                  <Text translation="document.revision.export.list" />
                </Typography>
              </Box>
              <DialogContentText>
                <Box className={classes.dialogContent}>
                  <Typography variant="subtitle1" className={classes.subtitle}>
                    <Text translation="document.revision.enter.file.name" />
                  </Typography>
                  <TextField
                    error={fileName === ""}
                    variant="outlined"
                    id="ExportListDialog-fileName"
                    style={{ width: 400 }}
                    onChange={handleFileName}
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
            <div
              style = {{
                flexGrow: 1,
              }}
            >
              <CSVLink
                data={data}
                headers={headers}
                filename={fileName + ".csv"}
                style={{ textDecoration: "none", display: "flex" }}
                asyncOnClick={true}
                onClick={(event, done) => {
                  dialog.close();
                }}
                ref={csvRef}
              >
                <Button
                  type="submit"
                  variant="contained"
                  className={classes.submitButton}
                  id="ExportListDialog-downloadButton"
                  data-cy="ExportListDialog-downloadButton"
                  onClick={() => csvRef.current.handleClick()}
                >
                  <Text translation="common.download" />
                </Button>
              </CSVLink>
            </div>
          </Box>
        </Dialog>
      }
    </>
  );
};

export default ExportListDialog;
