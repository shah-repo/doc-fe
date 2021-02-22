import { Box, Button, Dialog, DialogContent, DialogContentText, TextField, Typography } from "@material-ui/core";
import { ExportToCsv } from "export-to-csv";
import React, { useEffect, useState } from "react";
import { ReactComponent as ExportIcon } from "../../../../assets/images/icon_export_data.svg";
import { HeaderTableType } from "../../../../state/ducks/documentRevisions";
import Text from "../../../components/Text";
import { DialogHandler } from "../../../hooks/useDialog";
import { styles } from "./ExportListDialog.styles";

interface Props {
  dialog: DialogHandler;
  headers?: HeaderTableType[];
  data: any[];
  useKeysAsHeaders?: boolean;
  customFileName: string;
}

const ExportListDialog: React.FunctionComponent<Props> = ({
  dialog,
  headers,
  data,
  useKeysAsHeaders = false,
  customFileName,
}) => {
  const classes = styles();
  const [fileName, saveFileName] = useState("");

  const options = {
    fieldSeparator: ",",
    quoteStrings: "\"",
    decimalSeparator: ".",
    showLabels: true,
    headers: headers?.map((e) => e.label ),
    filename: fileName === "" ? customFileName : fileName,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders,
  };

  const csvExporter = new ExportToCsv(options);

  useEffect(() => {
    if (dialog.isOpen) {
      saveFileName("");
    }
  }, [dialog.isOpen]);

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
            <Button
              type="submit"
              variant="contained"
              className={classes.submitButton}
              id="ExportListDialog-downloadButton"
              data-cy="ExportListDialog-downloadButton"
              onClick={() => {
                csvExporter.generateCsv(data);
                dialog.close();
              }}
            >
              <Text translation="common.download" />
            </Button>
          </Box>
        </Dialog>
      }
    </>
  );
};

export default ExportListDialog;
