import { Box, Chip, Divider, Grid, List, ListItem, ListItemText } from "@material-ui/core";
import Accordion from "@material-ui/core/ExpansionPanel";
import AccordionDetails from "@material-ui/core/ExpansionPanelDetails";
import AccordionSummary from "@material-ui/core/ExpansionPanelSummary";
import { map } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import SMText from "../../../App/Shifamed/Components/SMText/SMText";
import { ReactComponent as CollapseIcon } from "../../../assets/images/tabCollapse.svg";
import { ReactComponent as ExpandIcon } from "../../../assets/images/tabExpand.svg";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import Colors from "../../layout/theme/utils/colors";
import { MaterialEqProps } from "./FBMaterailEqInfo.types";
import { styles } from "./FBMaterialEqInfo.styles";

const FBMaterialEqInfoPresenter: React.FunctionComponent<MaterialEqProps> = ({ materialData }) => {
  const classes = styles();
  const unit = " Items";
  const intl = useIntl();
  const nextCalText = intl.formatMessage({ id: "meq.chip.nextCalDate" }) + "";
  const PreventMaintainanceText = intl.formatMessage({ id: "meq.chip.prevMaintance" });
  const [isMaterialPannel, setIsMaterialPannel] = React.useState(false);
  const [isEquipmentPannel, setIsEquipmentPannel] = React.useState(false);
  const updatePanelState = (text) => (event: React.MouseEvent) => {
    const result = text === "common.collapse.all" ? false : true;
    setIsMaterialPannel(result);
    setIsEquipmentPannel(result);
    event.preventDefault();
  };
  const  predictExpandCollapseText = () => {
    let text = "common.expand.all";
    if (isMaterialPannel && isEquipmentPannel) {
      text = "common.collapse.all";
    }
    return text;
  };
  const genRateMaterialDetail = () => (map(materialData.materials, (o, topIndex: number) =>
    <>
      <ListItem  className={classes.meqListItem} key={o.docId}>
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
        {++topIndex < materialData.materials.length && <Divider className={classes.dividerMargin} />}
      </ListItem>
    </>
  ));
  const genRateEquipmentDetail = () => (map(materialData.equipment, (o, topIndex: number) =>
    <>
      <ListItem  className={classes.meqListItem} key={o.docId}>
        <ListItemText className={classes.fontNormal14}>
          {o.docId} {o.title}</ListItemText>
        <ListItemText className={classes.fontNormal12}>
          {
            o.nextCalibration &&
          <Chip  className={classes.chipStyle}
            size="small"  label={o.nextCalibration ? nextCalText +
           getFormattedDateString(o.nextCalibration, MomentFormats.BriefDate) : ""} />
          }
          {o.nextPm &&
          <Chip  className={classes.chipStyle}
            size="small"  label={o.nextPm ? PreventMaintainanceText
          + getFormattedDateString(o.nextPm, MomentFormats.BriefDate) : ""} />
          }
        </ListItemText>
        {++topIndex < materialData.equipment.length && <Divider className={classes.dividerMargin} />}
      </ListItem>
    </>
  ));
  const constructLotDetail = (obj) => `Lot ${obj.lotId || ""} | ${obj.partId || "N/A"}
   | ${obj.quantity || ""} ${obj.unit || ""}`;
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={9}>
          <Box mb={1}>
            <p className={classes.meqAccordianHeading}
              onClick={updatePanelState(predictExpandCollapseText())} >
              <SMText label={ predictExpandCollapseText()} /></p>
          </Box>
          <Box mb={1} >
            <Accordion className={classes.panelBorder} expanded={isMaterialPannel} >
              <AccordionSummary onClick={() => setIsMaterialPannel(!isMaterialPannel)}
                className={`${classes.panelSummary} ${classes.tabCursor}`}
                style={{ color: isMaterialPannel ? Colors.navy : "inherit" }} expandIcon={
                  isMaterialPannel ? <ExpandIcon
                    fontSize="small"
                    className= {classes.expandIconStyle}
                  /> :
                    <CollapseIcon
                      fontSize="small"
                      className= {classes.tabCursor}
                    />
                }>
                <Grid container spacing={3}>
                  <Grid item xs={6} className={classes.gridHeadingPadding} >
                    <SMText label={"form.builder.materials|s"} />
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
                className={`${classes.panelSummary} ${classes.tabCursor}`}
                style={{ color: isEquipmentPannel ? Colors.navy : "inherit" }}
                expandIcon={
                  isEquipmentPannel ? <ExpandIcon
                    fontSize="small"
                    className= {classes.expandIconStyle}
                  /> :
                    <CollapseIcon
                      fontSize="small"
                      className= {classes.tabCursor}
                    />
                }>
                <Grid container spacing={3}>
                  <Grid item xs={6} className={classes.gridHeadingPadding} >
                    <SMText label={"form.builder.equipment"} />
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
          <Box className={classes.jumpToBolckpadding}>
            <Box className={classes.fontText}><SMText label={"common.jump.to"} /></Box>
            <Box className={classes.jumpToTextMargin}
              style={{ background: isMaterialPannel ? Colors.light_cream_blue : "inherit" }}>
              <p  className={classes.paraGraphMaterial}   onClick={() =>
              { setIsMaterialPannel(true); setIsEquipmentPannel(false); }} >
                <Box className={classes.jumpToTextPadding}>
                  <SMText label={"form.builder.materials|s"} />
                </Box>
              </p>
            </Box>
            <Box mb={1} className={classes.jumpToTextMargin}
              style={{ background: isEquipmentPannel ? Colors.light_cream_blue : "inherit" }}>
              <p  className={classes.paraGraphEq}
                onClick={() => { setIsMaterialPannel(false); setIsEquipmentPannel(true); }} >
                <Box className={classes.jumpToTextPadding}>
                  <SMText label={"form.builder.equipment"} />
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
