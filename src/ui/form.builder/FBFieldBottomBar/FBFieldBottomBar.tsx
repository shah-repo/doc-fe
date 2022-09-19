import { Box } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import { FBButton, FBFieldBottomBarProps } from "..";
import { SM } from "../../../App";
import { checkIsDocumentEquipment } from "../../documentRevision/helpers/checkDocumentGroup";
import { withFBStarter } from "../FBStarter/FBStarter.wrap";
import useStyles from "./FBFieldBottomBar.styles";

const FBFieldBottomBar: React.FunctionComponent<FBFieldBottomBarProps> = ({
  visibility,
  onClick,
  index = 0,
}) => {
  const { _tabsState } = SM.useStores();
  const { _documentRevisionFormState } = SM.useStores();
  const classes = useStyles();

  const isEQ = checkIsDocumentEquipment(
    _documentRevisionFormState?.documentRevision?.document?.documentType?.groupOptions
  );

  return (
    <Box visibility={visibility} className={classes.root}>
      <FBButton
        label={(_tabsState?.tabID === "specification" && isEQ) ? "form.builder.addEquiSpec" : "form.builder.add.field"}
        dataCy="form.builder.add.field"
        size="medium"
        variant="contained"
        className={classes.button}
        startIcon={<AddIcon fontSize="small" />}
        onClick={() => onClick && onClick(index + 1)}
      />
    </Box>
  );
};

export default withFBStarter(FBFieldBottomBar);
