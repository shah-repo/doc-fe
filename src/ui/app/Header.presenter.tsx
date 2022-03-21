import { Box, Collapse, FormControlLabel, Grid, Switch } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import { Observer } from "mobx-react";
import React, { useState } from "react";
import SM from "../../App/Shifamed/Utils/SM/SM";
import { DocumentRevisionStatus } from "../../state/ducks/documentRevisions/types";
import { FormHeaderStatusClassMapping } from "../components/common/header/Header";
import { headerBackgroundStyles } from "../components/common/header/Header.background.styles";
import Text from "../components/Text";
import AutosaveToggle from "./autosave/autosave";
import styles from "./Header.styles";

interface Props extends WithStyles<typeof styles> {
  toggleCustomLabels: () => void;
  customLabelsValue: boolean;
  canToggleCustomLabels: boolean;
}
interface FormScrolledContext{
  setIsScorlled: (action: boolean) => void;
  setSelectedDocRevDisplayStatus: (status: DocumentRevisionStatus) => void;
}

export let FormScrolledContext = React.createContext<FormScrolledContext | undefined>(undefined);

const Header: React.FunctionComponent<Props> = ({
  classes,
  toggleCustomLabels,
  customLabelsValue,
  canToggleCustomLabels,
}) => {
  const headerBackgroundClasses = headerBackgroundStyles();
  const [isScorlled, setIsScorlled] = useState<boolean>(false);
  const [selectedDocRevDisplayStatus, setSelectedDocRevDisplayStatus] =
    useState<string>("");
  FormScrolledContext = React.createContext<FormScrolledContext | undefined>({
    setIsScorlled,
    setSelectedDocRevDisplayStatus,
  });

  if (SM.isNewLayout) {
    return (
      <Observer>
        {() => (
          <>
            <Collapse in={!isScorlled}>
              <Box
                height={48}
                className={classes.newAppBar}
                display="flex"
                alignContent="center"
                alignItems="center"
              >
                {!isScorlled && <Box className={classes.newLogo} />}
                <Grid container={true} alignItems="flex-end" justify="flex-end">
                  <Grid item>
                    {canToggleCustomLabels && (
                      <FormControlLabel
                        control={
                          <Switch
                            name="toggleCustomLabels"
                            checked={customLabelsValue}
                            onChange={toggleCustomLabels}
                          />
                        }
                        label={
                          <Text translation="form.builder.header.control.label" />
                        }
                      />
                    )}
                  </Grid>
                  <Grid item>
                    <AutosaveToggle />
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
            <Collapse in={isScorlled}>
              <Box
                height={40}
                className={`${
                  headerBackgroundClasses[
                    FormHeaderStatusClassMapping[selectedDocRevDisplayStatus]
                  ]
                } ${classes.topScrollBarBox}`}
                alignItems="center"
                justifyContent="center"
              >
                {selectedDocRevDisplayStatus}
              </Box>
            </Collapse>
          </>
        )}
      </Observer>
    );
  }
  return (
    <AppBar position="fixed" color="primary" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.logo}></div>
        <Grid
          container={true}
          alignItems="flex-end"
          justify="flex-end"
        >
          {canToggleCustomLabels && (
            <FormControlLabel
              control={<Switch name="toggleCustomLabels" checked={customLabelsValue} onChange={toggleCustomLabels} />}
              label={<Text translation="form.builder.header.control.label" />}
            />
          )}
          <AutosaveToggle />
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(styles)(Header);
