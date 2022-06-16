import { Box, Chip, Divider, Grid, List, ListItem, ListItemText } from "@material-ui/core";
import Accordion from "@material-ui/core/ExpansionPanel";
import AccordionDetails from "@material-ui/core/ExpansionPanelDetails";
import AccordionSummary from "@material-ui/core/ExpansionPanelSummary";
import { map } from "lodash";
import React from "react";
import SMText from "../../../App/Shifamed/Components/SMText/SMText";
import { ReactComponent as CollapseIcon } from "../../../assets/images/tabCollapse.svg";
import { ReactComponent as ExpandIcon } from "../../../assets/images/tabExpand.svg";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import Colors from "../../layout/theme/utils/colors";
import { MaterialEqProps } from "./FBMaterailEqInfo.types";
import { styles } from "./FBMaterialEqInfo.styles";

const FBMaterialEqInfoPresenter: React.FunctionComponent<MaterialEqProps> = ({ materialData }) => {
  const classes = styles();
  // For testing only
  const tempObj: any = {
    lotId: "#202234",
    partId: "PRT1",
    quantity: "25",
    unit: "ft",
  };
  if (materialData) {
    materialData.materials.forEach((obj) => obj.lots.push(tempObj));
  }
  // end of testing
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
  const genRateMaterialDetail = () => (map(materialData.materials, (o, topIndex: number) =>
    <>
      <ListItem  style={{ display: "block", paddingTop: 0  }}>
        <ListItemText
          className={classes.fontNormal14}>{o.docId} - {o.title} | {o.unit} : {o.quantity}</ListItemText>
        <ListItemText className={classes.fontNormal12} >
          {
            o.lots && o.lots.map((obj, index) => (
              <Chip key={index} className={classes.chipStyle}
                size="small"  label={constructLotDetail(obj)} />
            ))
          }
        </ListItemText>
        {++topIndex < materialData.materials.length && <Divider style={{ marginTop: 10 }} />}
      </ListItem>
    </>
  ));
  const genRateEquipmentDetail = () => (map(materialData.equipment, (o, topIndex: number) =>
    <>
      <ListItem  style={{ display: "block",  paddingTop: 0  }}>
        <ListItemText className={classes.fontNormal14} style={{ color: Colors.almost_black }}>
          {o.docId} {o.title}</ListItemText>
        <ListItemText className={classes.fontNormal12}>
          {o.nextCalibration && <Chip  className={classes.chipStyle}
            size="small"  label={`Next Callibration Due : `
          + getFormattedDateString(o.nextCalibration, MomentFormats.BriefDate)} />
          }
          {o.nextPm &&
          <Chip  className={classes.chipStyle}
            size="small"  label={`Preventive Maintenance Due : `
          + getFormattedDateString(o.nextPm, MomentFormats.BriefDate)} />
          }
        </ListItemText>
        {++topIndex < materialData.equipment.length && <Divider style={{ marginTop: 10 }} />}
      </ListItem>
    </>
  ));
  const constructLotDetail = (obj) => `Lot ${obj.lotId} | ${obj.partId || "N/A"} | ${obj.quantity} ${obj.unit}`;
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={9}>
          <Box mb={1}>
            <p style={{ color: Colors.navy, cursor: "pointer" }}  className={classes.fontNormal}
              onClick={updatePanelState(predictExpandCollapseText())} >
              <SMText label={ predictExpandCollapseText()} /></p>
          </Box>
          <Box mb={1} className={classes.expandCollapseText}>
            <Accordion className={classes.panelBorder} expanded={isMaterialPannel} >
              <AccordionSummary onClick={() => setIsMaterialPannel(!isMaterialPannel)}
                className={classes.panelSummary}
                style={{ color: isMaterialPannel ? Colors.navy : "inherit", cursor: "pointer" }} expandIcon={
                  isMaterialPannel ? <ExpandIcon
                    fontSize="small"
                    style={{
                      cursor: "pointer",
                      transform: "rotate(180deg)",
                    }}
                  /> :
                    <CollapseIcon
                      fontSize="small"
                      style={{
                        cursor: "pointer",
                      }}
                    />
                }>
                <Grid container spacing={3}>
                  <Grid item xs={6} style={{ paddingLeft: 28 }} >
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
                style={{ color: isEquipmentPannel ? Colors.navy : "inherit", cursor: "pointer" }}
                expandIcon={
                  isEquipmentPannel ? <ExpandIcon
                    fontSize="small"
                    style={{
                      cursor: "pointer",
                      transform: "rotate(180deg)",
                    }}
                  /> :
                    <CollapseIcon
                      fontSize="small"
                      style={{
                        cursor: "pointer",
                      }}
                    />
                }>
                <Grid container spacing={3}>
                  <Grid item xs={6} style={{ paddingLeft: 28 }} >
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
        <Grid item xs={3}>
          <Box style={{ paddingTop: 22 }}>
            <Box className={classes.fontText}><SMText label={"meq.jump.to"} /></Box>
            <Box style={{ background: isMaterialPannel ? Colors.light_cream_blue : "inherit", marginLeft: 8 }}>
              <p  className={classes.paraGraphMaterial}   onClick={() =>
              { setIsMaterialPannel(true); setIsEquipmentPannel(false); }} >
                <Box style={{ paddingLeft: 10, paddingTop: 7 }}>
                  <SMText label={"meq.material"} />
                </Box>
              </p>
            </Box>
            <Box mb={1} style={{ background: isEquipmentPannel ? Colors.light_cream_blue : "inherit", marginLeft: 8  }}>
              <p  className={classes.paraGraphEq}
                onClick={() => { setIsMaterialPannel(false); setIsEquipmentPannel(true); }} >
                <Box style={{ paddingLeft: 10, paddingTop: 7 }}>
                  <SMText label={"meq.equipment"} />
                </Box>
              </p>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default FBMaterialEqInfoPresenter;
