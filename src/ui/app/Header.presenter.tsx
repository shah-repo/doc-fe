import { Box, Collapse, FormControlLabel, Grid, Switch } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import { Observer } from "mobx-react";
import React, { useState } from "react";
import SM from "../../App/Shifamed/Utils/SM/SM";
import EnlilLogo from "../../assets/images/enlil_logo.svg";
import { FormHeaderStatusClassMapping } from "../components/common/kendo/helpers";
import { FormHeaderContext } from "../documentRevision/forms/DocumentRevisionForm.container";
import Colors from "../layout/theme/utils/colors";
import AutosaveToggle from "./autosave/autosave";
import styles from "./Header.styles";

interface Props extends WithStyles<typeof styles> {
  toggleCustomLabels: () => void;
  customLabelsValue: boolean;
  canToggleCustomLabels: boolean;
}
interface FormScrolledContext{
  setIsScorlled: any;
  setSelectedType: any;
}

export let FormScrolledContext = React.createContext<FormScrolledContext| undefined>(undefined);

const Header: React.FunctionComponent<Props> = ({
  classes,
  toggleCustomLabels,
  customLabelsValue,
  canToggleCustomLabels,
}) => {
  const [isScorlled, setIsScorlled] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>("");
  FormScrolledContext = React.createContext<FormScrolledContext | undefined>({
    setIsScorlled,
    setSelectedType,
  });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const  context = React.useContext(FormHeaderContext);
  if (SM.isNewLayout) {
    return (
      <Observer>
        {() => (
          <>
            <Collapse in={!isScorlled}>
              <Box
                height={48}
                fontSize="1rem"
                style={{
                  fontSize: "1rem",
                  color: Colors.white,
                  background:
                    "linear-gradient(262.45deg, #01A6C7 0.28%, #4C69FF 16.91%, #011FBB 85.48%)",
                }}
                display="flex"
                alignContent="center"
                alignItems="center"
              >
                {!isScorlled && <Box
                  style={{
                    backgroundRepeat: "no-repeat",
                    backgroundImage: `url(${EnlilLogo})`,
                    left: "61%",
                    right: "20.42%",
                    position: "absolute",
                    paddingTop: "48px",
                  }}
                />}
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
                        label="Show customizable labels"
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
                fontSize="1rem"
                style={{
                  color: Colors.white,
                  fontFamily: "Sora",
                  fontStyle: "normal",
                  fontWeight: 700,
                  fontSize: "12px",
                  lineHeight: "15px",
                  display: "flex",
                  textTransform: "uppercase",
                }}
                className={classes[FormHeaderStatusClassMapping[selectedType]]}
                alignItems="center"
                justifyContent="center"
              >
                {selectedType?.toUpperCase() === "DRAFT" ? "DRAFT - EDIT MODE" : selectedType}
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
          {canToggleCustomLabels &&
        <FormControlLabel
          control={<Switch name="toggleCustomLabels" checked={customLabelsValue} onChange={toggleCustomLabels} />}
          label="Show customizable labels"
        />
          }
          <AutosaveToggle/>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(styles)(Header);
