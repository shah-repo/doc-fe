import { Box } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import React, { useState } from "react";
import { FBButton, FBStarterProps } from "..";
import Colors from "../../layout/theme/utils/colors";
import { styles } from "./FBStarter.styles";
import { withFBStarter } from "./FBStarter.wrap";

const FBStarter: React.FunctionComponent<FBStarterProps> = ({
  onClick,
  isNewLayout,
}) => {
  const classes = styles();
  const [isHover, setIsHover] = useState(false);
  if (isNewLayout) {
    return (
      <Box
        display="flex"
        className={"fbStarterAddField"}
        marginBottom={1}
        marginTop={6}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <Box
          border={0}
          borderTop={1}
          my="auto"
          width="100%"
          color={Colors.navy}
          style={{ borderStyle: isHover ? "solid" : "dashed" }}
        />
        <FBButton
          className={classes.button}
          label="form.builder.add.field"
          dataCy="form.builder.add.field"
          size="medium"
          variant="contained"
          fullWidth={true}
          isHover={isHover}
          showNewButton={isNewLayout}
          startIcon={<AddIcon fontSize="small" />}
          onClick={() => onClick && onClick(0)}
        />
        <Box
          border={0}
          borderTop={1}
          my="auto"
          width="100%"
          color={Colors.navy}
          style={{ borderStyle: isHover ? "solid" : "dashed" }}
        />
      </Box>
    );
  }
  return (
    <Box
      display="flex"
      my={1}
      border={1}
      style={{ borderStyle: "dashed" }}
    >
      <FBButton
        label="form.builder.add.field"
        dataCy="form.builder.add.field"
        color="primary"
        size="medium"
        variant="text"
        className={classes.button}
        fullWidth={true}
        onClick={() => onClick && onClick(0)}
      />
    </Box>
  );
};

export default withFBStarter(FBStarter);
