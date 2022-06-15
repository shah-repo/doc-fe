import { Box, Button, Chip, Divider, Grid, List, ListItem, ListItemText } from "@material-ui/core";
import Accordion from "@material-ui/core/ExpansionPanel";
import AccordionDetails from "@material-ui/core/ExpansionPanelDetails";
import AccordionSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { map } from "lodash";
import React from "react";
import SMText from "../../../App/Shifamed/Components/SMText/SMText";
import Colors from "../../layout/theme/utils/colors";
import { styles } from "./FBMaterialEqInfo.styles";

const FBMaterialEqInfoPresenter: React.FunctionComponent<any> = ({ materialData }) => {
  const classes = styles();
  // const materialArray = [1, 2, 3, 4];
  const unit = " Items";
  const [isMaterialPannel, setIsMaterialPannel] = React.useState(false);
  const [isEquipmentPannel, setIsEquipmentPannel] = React.useState(false);
  const updatePanelState = (text) => (event: React.MouseEvent) => {
    const result = text === "meq.collapse.all" ? false : true;
    setIsMaterialPannel(result);
    setIsEquipmentPannel(result);
    event.preventDefault();
  };

  const  predictExpandCollapseText = () => {
    let text = "meq.expand.all";
    if (isMaterialPannel && isEquipmentPannel) {
      text = "meq.collapse.all";
    } else if (!isMaterialPannel || !isEquipmentPannel) {
      text = "meq.expand.all";
    } else if (isMaterialPannel) {
      text = "meq.expand.all";
    } else if (isEquipmentPannel) {
      text = "meq.expand.all";
    }
    return text;
  };
  const genRateMaterialDetail = () => (map(materialData.materials, (o) =>
    <>
      <ListItem  style={{ display: "block" }}>
        <ListItemText>{o.docId} - {o.title} | {o.unit} : {o.quantity}</ListItemText>
        <ListItemText><Chip size="small"  label="Lot #21072033 |N/A|25 ft" /></ListItemText>
      </ListItem>
      <Divider />
    </>
  ));
  const genRateEquipmentDetail = () => (map(materialData.equipment, (o) =>
    <>
      <ListItem  style={{ display: "block" }}>
        <ListItemText className={classes.fontNormal14}>
          {o.docId} - {o.title} | {o.unit} : {o.quantity}</ListItemText>
        <ListItemText className={classes.fontNormal12}>
          <Chip style={{ borderRadius: 4, backgroundColor: Colors.whitest_grey }}
            size="small"  label="Lot #21072033 |N/A|25 ft" />
        </ListItemText>
      </ListItem>
      <Divider />
    </>
  ));
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={10}>
          <Box mb={1}>
            <Button style={{ color: Colors.navy }}  className={classes.fontNormal}
              onClick={updatePanelState(predictExpandCollapseText())} >
              <SMText label={ predictExpandCollapseText()} /></Button>
          </Box>
          <Box mb={1} className={classes.expandCollapseText}>
            <Accordion className={classes.panelBorder} expanded={isMaterialPannel} >
              <AccordionSummary onClick={() => setIsMaterialPannel(!isMaterialPannel)}
                className={classes.panelSummary}
                style={{ color: isMaterialPannel ? Colors.navy : "inherit" }} expandIcon={
                  <ExpandMoreIcon
                    style={{
                      transform: isMaterialPannel ? "rotate(180deg)" : "rotate(-90deg)",
                      color: isMaterialPannel ? Colors.navy : "inherit",
                    }}
                  />}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <SMText label={"meq.material"} />
                  </Grid>
                  <Grid item xs={6} >
                    <Box className={classes.qunatityText}>
                      <SMText   label={materialData.materials.length ? materialData.materials.length + unit : ""} />
                    </Box>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails  className= {classes.expanSionPannelPadding}>
                <List>
                  {genRateMaterialDetail()}
                </List>
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box>
            <Accordion className={classes.panelBorder} expanded={isEquipmentPannel}>
              <AccordionSummary onClick={() => setIsEquipmentPannel(!isEquipmentPannel)}
                className={classes.panelSummary}
                style={{ color: isEquipmentPannel ? Colors.navy : "inherit" }}
                expandIcon={
                  <ExpandMoreIcon  style={{
                    transform: isEquipmentPannel ? "rotate(180deg)" : "rotate(-90deg)",
                    color: isEquipmentPannel ? Colors.navy : "inherit",
                  }}
                  />}>

                <Grid container spacing={3}>
                  <Grid item xs={6} >
                    <SMText label={"meq.equipment"} />
                  </Grid>
                  <Grid item xs={6} >
                    <Box className={classes.qunatityText}>
                      <SMText  label={materialData.equipment.length ? materialData.equipment.length + unit : ""} />
                    </Box>
                  </Grid>
                </Grid>

              </AccordionSummary>
              <AccordionDetails  className={classes.expanSionPannelPadding}>
                <List>
                  {genRateEquipmentDetail()}
                </List>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box>
            <Box className={classes.fontText}><SMText label={"meq.jump.to"} /></Box>
            <Box style={{ height: 31, background: isMaterialPannel ? Colors.light_cream_blue : "inherit" }}>
              <Button  style={{
                height: 20, color: Colors.navy,
                fontSize: 12, fontWeight: 400,
              }}   onClick={() =>
              { setIsMaterialPannel(true); setIsEquipmentPannel(false); }} >
                <Box style={{ marginBottom: 8, marginTop: 8 }}>
                  <SMText label={"meq.material"} />
                </Box>
              </Button>
            </Box>
            <Box mb={1} style={{ height: 31, background: isEquipmentPannel ? Colors.light_cream_blue : "inherit" }}>
              <Button  style={{ height: 25, color: Colors.navy, fontSize: 12, fontWeight: 400 }}
                onClick={() => { setIsMaterialPannel(false); setIsEquipmentPannel(true); }} >
                <Box style={{ marginBottom: 8, marginTop: 8 }}>
                  <SMText label={"meq.equipment"} />
                </Box>
              </Button>
            </Box>
          </Box>

        </Grid>
      </Grid>

    </>
  );
};

export default FBMaterialEqInfoPresenter;
