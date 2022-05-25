import { Avatar, Box, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@material-ui/core";
import Accordion from "@material-ui/core/ExpansionPanel";
import AccordionDetails from "@material-ui/core/ExpansionPanelDetails";
import AccordionSummary from "@material-ui/core/ExpansionPanelSummary";
import { CheckCircle, PlayCircleFilled, RemoveCircleOutline } from "@material-ui/icons";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { isEmpty, map } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBLHRStepProps, FBProvider, FBText } from "..";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { companySelectors } from "../../../state/ducks/company";
import { isDocumentRevisionInReview, isDocumentRevisionReleased } from "../../documentRevision/helpers/documentRevisionStatus";
import Colors from "../../layout/theme/utils/colors";
import FBLHRStepProcedureItem from "../FBLHRStepProcedureItem/FBLHRStepProcedureItem";
import { FBProcedureItemType } from "../FBProcedureItem/FBProcedureItem.types";
import { FBButtonStyles } from "../styles/FBButton.styles";
import { withFBLHRStep } from "./FBLHRStep.wrap";


const FBLHRStep: React.FunctionComponent<FBLHRStepProps> = ({
  filterOptions,
  startMpi,
  openLHRs,
  setDisplayToLHRs,
  name,
  isOutput,
  lhrStepState,
  loading,
  stepLHRs,
  isDraft,
  isPendingChange,
  disabled,
  ownerOfStartMPIAction,
  ownerOfCompleteMPIAction,
  materials,
  equipment,
  index,
  isDocumentLHRT,
  stepIndex,
  label,
  gutter,
  autosave,
  lhrBuildTypeExist,
  ...props
}) => {
  const allEmployees = useSelector(companySelectors.getAllEmployees) || [];
  const getUserDetails = (userId: string) => allEmployees.find((obj) => obj.id === userId);
  const operatorList = stepLHRs?.formInput?.["fb-approvals-approvals-built-in"].map((e) => getUserDetails(e)?.user);
  const classes = FBButtonStyles();
  const stepLabel = `LHR Step ${stepIndex} - Rev ${stepLHRs?.displayRevision}`;
  const stepButtonStyle = {
    marginTop: 0,
    height: 36,
    minWidth: 180,
    borderRadius: 100,
  };
  const getStatusColor = () => {
    const status = stepLHRs?.status;
    let statusColor = ""; // latest_yellow_varient
    if (isDocumentRevisionReleased(status)) {
      statusColor = Colors.green_blue;
    } else if (isDocumentRevisionInReview(status)) {
      statusColor = Colors.latest_yellow_varient;
    }
    return statusColor;
  };

  return (
    <FBProvider {...{ lhrStepState }}>
      <Accordion className={classes.panelBorder} >
        <AccordionSummary className={classes.panelSummary} expandIcon={
          <ExpandMoreIcon style={{ color: Colors.navy }}
          />}>
          <Box display="flex"
            alignItems="flex-start">
            <Box mr={2} ml={1}>
              <Typography variant="h6" style={{ color: Colors.navy }} className={classes.expansionPanelHedding}>
                <FBText locale={stepLabel} />
              </Typography>
            </Box>
            <Box display="flex"
              alignItems="flex-start" style={{ fontSize: 12 }} >
              <Box mr={1} display="flex" alignItems="center">
                <CheckCircle style={{
                  color:
                  getStatusColor(), fontSize: 14, marginTop: 4,
                }} className="fontSizeSmall" />
                {isDocumentRevisionInReview(stepLHRs?.status) && <RemoveCircleOutline style={{
                  color:
                  getStatusColor(), fontSize: 14, marginTop: 4,
                }} className="fontSizeSmall"></RemoveCircleOutline>}
              </Box>
              <Box style={{ fontWeight: 700 }} component={"span"} mr={2} mt={0.4} >{stepLHRs?.status}</Box>
              <Box component={"span"} mt={0.3}>
                {getFormattedDateString(stepLHRs?.createdAt, MomentFormats.DateTime)}
              </Box>
            </Box>

          </Box>
        </AccordionSummary>
        <AccordionDetails style={{ padding: "2.1rem", display: "block" }}>
          <Box
            display="flex"
            alignItems="flex-start"
          >
            <Box
              flexGrow={1}
              onClick={() => {
                if (isOutput && stepLHRs) {
                  openLHRs();
                }
              }}
              style={{ background: Colors.alabaster, borderRadius: 4 }}
            >
              <FBAutocompleteAsync
                boxProps={{ flexGrow: 1 }}
                type="lhrstep"
                optionId={FBAutocompleteAsyncOption.mpiDocuments}
                gutter={false}
                autosave
                rules="required"
                withState
                shouldReloadOnInit
                disabled={isOutput || !(isDraft || isPendingChange)}
                withoutPrefixRoot={Boolean(stepLHRs)}
                {...{ name, loading, filterOptions }}
                inputStyle={stepLHRs?.redline ? {
                  background: Colors.light_red,
                  border: `1px solid ${Colors.error_red}`,
                  paddingLeft: "5px",
                } : { background: Colors.alabaster, borderRadius: 4 }}
              />
            </Box>
            <FBButton
              disabled={!isOutput || loading || !lhrBuildTypeExist || disabled}
              label={stepLHRs ? "form.builder.view.step" : "form.builder.start.step"}
              onClick={stepLHRs ? () => openLHRs(stepLHRs) : startMpi}
              {...{ loading }}
              className={classes.button}
              style={stepLHRs ? {
                ...stepButtonStyle,
                background: "#EDF4FF",
                color: Colors.navy,
              } : {
                ...stepButtonStyle,
                background: Colors.navy,
                color: Colors.white,
              }}
            />
          </Box>
          {isDocumentLHRT && !isEmpty(materials) && <FBLHRStepProcedureItem
            value={materials}
            type={FBProcedureItemType.materials}
            lhrStepIndex={index}
            isPendingChange
          />}
          {isDocumentLHRT && !isEmpty(equipment) && <FBLHRStepProcedureItem
            value={equipment}
            type={FBProcedureItemType.equipment}
            lhrStepIndex={index}
            isPendingChange
          />}
          {stepLHRs && (
            <Box display="flex" alignItems="center" mt={1} mb={4}>
              <Box mr={1} display="flex" alignItems="center">
                {
                  isDocumentRevisionReleased(stepLHRs.status)
                    ? <CheckCircle />
                    : <PlayCircleFilled />
                }
              </Box>
              <FBText
                locale={
                  isDocumentRevisionReleased(stepLHRs.status)
                    ? "form.builder.step.completed"
                    : "form.builder.step.started"
                }
                values={{
                  date: isDocumentRevisionReleased(stepLHRs.status)
                    ? getFormattedDateString(stepLHRs?.releasedAt, MomentFormats.DateTime)
                    : getFormattedDateString(stepLHRs?.createdAt, MomentFormats.DateTime),
                }}
              />
            </Box>
          )}
          <Box mb={2}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Typography style={{ fontSize: 12, fontWeight: 600 }} component="div">
                  Start Qunatity
                </Typography>
                <Typography style={{ fontSize: 14, fontWeight: 400 }} component="div">
                  {stepLHRs?.formInput?.["lhrs-start-quantity"]}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography style={{ fontSize: 12, fontWeight: 600 }} component="div">
                  Accepted Qunatity
                </Typography>
                <Typography style={{ fontSize: 14, fontWeight: 400 }} component="div">
                  {stepLHRs?.formInput?.["lhrs-accepted-quantity"]}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography style={{ fontSize: 12, fontWeight: 600 }} component="div">
                  Rejected Qunatity
                </Typography>
                <Typography style={{ fontSize: 14, fontWeight: 400 }} component="div">
                  {stepLHRs?.formInput?.["lhrs-rejected-quantity"]}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Box style={{ fontSize: 12, fontWeight: 600 }}>Operators</Box>
            <List>
              {map(operatorList, (e) => <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt={e.name} src={e.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={e.name}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >
                        Approved .
                      </Typography>
                      {getFormattedDateString(stepLHRs?.createdAt, MomentFormats.DateTime)}
                    </React.Fragment>
                  }
                />
              </ListItem>)}
            </List>
          </Box>
        </AccordionDetails>
      </Accordion>
    </FBProvider>
  );
};


export default withFBLHRStep(FBLHRStep);
