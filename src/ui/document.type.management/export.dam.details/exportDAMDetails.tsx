import { Box, Button, Dialog, DialogContent, DialogContentText, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { ReactComponent as ExportIcon } from "../../../assets/images/icon_export_data.svg";
import { documentTypeActions } from "../../../state/ducks/documentRevisions/documentType";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { DialogHandler } from "../../hooks/useDialog";
import { styles } from "./exportDAMDetails.styles";

interface Props {
  dialog: DialogHandler;
}

const ExportDAMDetails: React.FunctionComponent<Props> = ({
  dialog,
}) => {
  const classes = styles();
  const [fileName, saveFileName] = useState("template");

  const loadAction = useActionCreator(documentTypeActions.getApprovalMatrixNco);
  const async = useAsync({
    onSuccess: (response) => {
      const jsonData = JSON.stringify(response);
      const dataStr = `data:text/json;charset=utf-8, ${encodeURIComponent(jsonData)}`;
      const anchor = document.createElement("a");
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.download = `${fileName}.json`;
      anchor.href = dataStr;
      anchor.click();
      dialog.close();
    },
  });

  useEffect(() => {
    if (dialog.isOpen) {
      saveFileName("");
    }
  }, [dialog.isOpen]);

  const handleFileName = (ev: React.ChangeEvent<any>) => {
    const { value } = ev.target;
    saveFileName(value);
  };

  const download = () => {
    async.start(loadAction, async);
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
                  <Text translation="common.export" />
                </Typography>
              </Box>
              <DialogContentText>
                <Box className={classes.dialogContent}>
                  <Typography variant="subtitle1" className={classes.subtitle}>
                    <Text translation="document.revision.enter.file.name" />
                  </Typography>
                  <TextField
                    variant="outlined"
                    id="ExportDAMDetails-fileName"
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
              id="ExportDAMDetails-cancelButton"
            >
              <Text translation="common.cancel" />
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={classes.submitButton}
              id="ExportDAMDetails-downloadButton"
              data-cy="ExportDAMDetails-downloadButton"
              onClick={() => download()}
            >
              <Text translation="common.download" />
            </Button>
          </Box>
        </Dialog>
      }
    </>
  );
};

export default ExportDAMDetails;
