import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, IconButton, Radio, RadioGroup, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { Translation } from "../../../translations/types";
import Text from "../../Text";
import { styles } from "./UnsavedChangesSessionDialog.styles";

interface Props {
  onCancel: (cb?: any) => void;
  onConfirm: () => void;
  onClose: (cb?: any) => void;
  setValue:  (value) => void;
  visible: boolean;
  value: string;
  content: Translation;
  title: Translation;
  optionsTitle?: Translation;
  confirmText: Translation;
  cancelText: Translation;
}

const UnsavedChangesSessionDialog: React.FunctionComponent<Props> = ({
  onCancel,
  onConfirm,
  onClose,
  setValue,
  visible,
  value,
  content,
  title,
  optionsTitle,
  confirmText,
  cancelText,
}) => {
  const classes = styles();

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Dialog
      open={visible}
      maxWidth="sm"
      fullWidth
      style={{ fontFamily: "Sora" }}
    >
      <DialogTitle disableTypography className={classes.dialogTitle}>
        <Typography className={classes.title}>
          <Text translation={title} />
        </Typography>
        <IconButton onClick={() => onClose()} size="small" className={classes.iconButton}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider/>
      <DialogContent className={classes.dialogContent}>
        <Typography className={classes.content}>
          <Text translation={content} />
        </Typography>
        {
          optionsTitle &&
          <Typography className={classes.optionsTitle}>
            <Text translation={optionsTitle} />
          </Typography>
        }
        {/** Radio group values have to be string to show properly */}
        <RadioGroup value={value} onChange={handleChange}>
          <FormControlLabel
            value={"true"}
            control={
              <Radio
                color="primary"
                disableRipple
              />
            }
            label={
              <Typography className={classes.radioOption}>
                <Text translation="common.true" />
              </Typography>
            }
          />
          <FormControlLabel
            value={"false"}
            control={
              <Radio
                color="primary"
                disableRipple
              />
            }
            label={
              <Typography className={classes.radioOption}>
                <Text translation="common.false" />
              </Typography>
            }
          />
        </RadioGroup>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          className={classes.submitButton}
          onClick={() => onConfirm()}
        >
          <Text translation={confirmText} />
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.cancelButton}
          onClick={() => onCancel()}
        >
          <Text translation={cancelText} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnsavedChangesSessionDialog;
