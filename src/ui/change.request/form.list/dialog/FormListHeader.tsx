import { Box, DialogTitle, Grid, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { ReactComponent as WindowParagraph } from "../../../../assets/images/window_paragraph.svg";
import Text from "../../../components/Text";
import { DialogHandler } from "../../../hooks/useDialog";
import Colors from "../../../layout/theme/utils/colors";

interface Props {
  dialog: DialogHandler;
}

export const FormListHeader: React.FunctionComponent<Props> = ({ dialog }) => (
  <DialogTitle style={{ boxShadow: `0px 1px ${Colors.medium_gray}` }}>
    <Grid container>
      <Grid item xs={2} style={{ alignSelf: "center" }}>
        <Box
          bgcolor={Colors.light_blue}
          borderRadius={4}
          width={38}
          height={38}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <WindowParagraph/>
        </Box>
      </Grid>
      <Grid item xs={9}>
        <Typography variant="subtitle1" style={{ fontWeight: "bold", color: Colors.dark_gray }}>
          <Text translation="common.choose.template" />
        </Typography>
        <Typography variant="subtitle2" style={{ color: Colors.gray }}>
          <Text translation="change.request.select.template"/>
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <IconButton
          color="default"
          onClick={dialog.close}
          aria-label="Close"
          id="FormList-closeDialog"
        >
          <CloseIcon style={{ color: Colors.gray }} />
        </IconButton>
      </Grid>
    </Grid>
  </DialogTitle>
);

export default FormListHeader;
