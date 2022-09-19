import { Box } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import { useSelector } from "react-redux";
import { FBButton, FBFieldBottomBarProps } from "..";
import { SM } from "../../../App";
import { companySelectors } from "../../../state/ducks/company";
import { documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { ApplicationState } from "../../../state/reducers";
import { withFBStarter } from "../FBStarter/FBStarter.wrap";
import useStyles from "./FBFieldBottomBar.styles";

const FBFieldBottomBar: React.FunctionComponent<FBFieldBottomBarProps> = ({
  visibility,
  onClick,
  index = 0,
}) => {
  const { _tabsState } = SM.useStores();
  const { _documentRevisionFormState } = SM.useStores() || {};
  const classes = useStyles();
  const documentType = useSelector((state: ApplicationState) =>
    documentTypeSelectors.getDocumentTypeById(state,
       _documentRevisionFormState?.documentRevision?.document?.documentType?.id || ""));
  const navigationDetails = useSelector((state: ApplicationState) =>
    companySelectors.getNavigationDetails(
      state,
      documentType?.pageDetails?.category || ""
    )
  );

  return (
    <Box visibility={visibility} className={classes.root}>
      <FBButton
        label={(_tabsState?.tabID === "specification" && navigationDetails.label === "Equipment")
          ? "form.builder.addEquiSpec" : "form.builder.add.field"}
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
