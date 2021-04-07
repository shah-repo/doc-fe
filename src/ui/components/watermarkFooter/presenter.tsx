import { Box, Button, Grid } from "@material-ui/core";
import React from "react";
import { ReactComponent as SuccessIcon } from "../../../assets/images/icon_success.svg";
import { ReactComponent as WarningIcon } from "../../../assets/images/icon_warning.svg";
import Colors from "../../layout/theme/utils/colors";
import Text from "../Text";
import { WatermarkResponse } from "./types";

interface Props {
  result: WatermarkResponse;
  close: () => void;
  download: () => void;
}

const WatermarkFooterPresenter: React.FunctionComponent<Props> = ({
  result,
  close,
  download,
}) => {
  const renderDownload = result.success && (
    <Button
      color="primary"
      variant="contained"
      onClick={download}
    >
      <Text translation="common.download" />
    </Button>
  );
  const renderDismiss = !result.success && (
    <Button
      color="primary"
      variant="outlined"
      onClick={close}
    >
      <Text translation="common.dismiss" />
    </Button>
  );
  const renderIcon = result.success ?
    <SuccessIcon /> :
    <WarningIcon />;

  return (
    <Grid
      container={true}
      direction="row"
      style={{
        position: "fixed",
        bottom: 0,
        zIndex: 9999,
        width: "100%",
        backgroundColor: "white",
        padding: "10px 100px",
        display: "flex",
        justifyContent: "space-between",
        boxShadow: `0px 0px 20px 1px ${Colors.gray}`,
      }}
    >
      <Box component="span" marginTop="5px" >
        <Box component="span" marginRight="20px" style={{ verticalAlign: "middle" }}>
          {renderIcon}
        </Box>
        <Box component="span">
          <Text {...result.message} />
        </Box>
      </Box>
      <Box component="span">
        {renderDownload}
        {renderDismiss}
      </Box>
    </Grid>
  );
};

export default WatermarkFooterPresenter;
