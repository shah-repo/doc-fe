import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, IconButton, Radio, RadioGroup, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import Colors from "../../layout/theme/utils/colors";
import Text from "../Text";

interface Props {
  visible: boolean;
  onCancel: (cb?: any) => void;
  onConfirm:  () => void;
  value: string;
  setValue:  (value) => void;
}

const UnsavedChangesDialog: React.FunctionComponent<Props> = ({
  visible,
  onCancel,
  onConfirm,
  value,
  setValue,
}) => {

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
      <DialogTitle disableTypography style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography style={{ color: Colors.almost_black, fontSize: 14, fontWeight: 600, fontFamily: "Sora" }}>
          <Text translation="document.revision.unsaved.changes.title" />
        </Typography>
        <IconButton onClick={() => onCancel()} size="small" style={{ borderRadius: 6 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider/>
      <DialogContent style={{ paddingLeft: 50, paddingBottom: 40 }}>
        <Typography
          style={{ color: Colors.almost_black, fontSize: 12, fontWeight: 400, fontFamily: "Sora", marginTop: 20 }}
        >
          <Text translation="document.revision.unsaved.changes.alert" />
        </Typography>
        {/** Radio group values have to be string to show properly */}
        <RadioGroup value={value} onChange={handleChange} style={{ marginTop: 30 }}>
          <FormControlLabel
            value={"true"}
            control={
              <Radio
                color="primary"
                disableRipple
              />
            }
            label={
              <Typography style={{ color: Colors.almost_black, fontSize: 14, fontFamily: "Sora" }}>
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
              <Typography style={{ color: Colors.almost_black, fontSize: 14, fontFamily: "Sora" }}>
                <Text translation="common.false" />
              </Typography>
            }
          />
        </RadioGroup>
      </DialogContent>
      <DialogActions
        style={{ backgroundColor: Colors.white_smoke, paddingRight: 20 }}
      >
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          style={{ borderRadius: 200, fontSize: 12 }}
          onClick={() => onConfirm()}
        >
          <Text translation={"common.leave"} />
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ borderRadius: 200, color: Colors.white, fontSize: 12 }}
          onClick={() => onCancel()}
        >
          <Text translation={"common.go.back"} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnsavedChangesDialog;
