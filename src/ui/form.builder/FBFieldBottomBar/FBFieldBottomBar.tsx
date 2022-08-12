import { Box } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import React, { useState } from "react";
import { FBButton, FBFieldBottomBarProps } from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBStarter } from "../FBStarter/FBStarter.wrap";

const FBFieldBottomBar: React.FunctionComponent<FBFieldBottomBarProps> = ({
  visibility,
  onClick,
  index = 0,
  mt,
}) => {
  const [isHover, setIsHover] = useState(false);
  return (<Box display={visibility === "visible" ? "flex" : "none"} mt={mt}
    onMouseEnter={() => setIsHover(true)}
    onMouseLeave={() => setIsHover(false)}>
    <Box
      border={0}
      borderTop={1}
      my="auto"
      width="100%"
      color={Colors.navy}
      style={{ borderStyle: isHover ? "solid" : "dashed" }}
    />
    <FBButton
      label="form.builder.add.field"
      dataCy="form.builder.add.field"
      size="medium"
      variant="contained"
      fullWidth={true}
      isHover={isHover}
      showNewButton ={true}
      startIcon={<AddIcon fontSize="small" />}
      onClick={() => onClick && onClick(index + 1)}
    />
    <Box
      border={0}
      borderTop={1}
      my="auto"
      width="100%"
      color={Colors.navy}
      style={{ borderStyle: isHover ? "solid" : "dashed" }}
    />
  </Box>);

};

export default withFBStarter(FBFieldBottomBar);
