import {
  Avatar,
  Box,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import Accordion from "@material-ui/core/ExpansionPanel";
import AccordionDetails from "@material-ui/core/ExpansionPanelDetails";
import AccordionSummary from "@material-ui/core/ExpansionPanelSummary";
import {
  CheckCircle,
  PlayCircleFilled,
  RemoveCircle,
} from "@material-ui/icons";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import { isEmpty, map } from "lodash";
import { reaction } from "mobx";
import { Observer } from "mobx-react";
import React from "react";
import { useSelector } from "react-redux";
import {
  FB,
  FBAutocompleteAsync,
  FBAutocompleteAsyncOption,
  FBButton,
  FBLHRStepProps,
  FBProvider,
  FBText,
} from "..";
import { ReactComponent as CollapseMoreIcon } from "../../../assets/images/CollapseMoreIcon.svg";
import { ReactComponent as ExpandMoreIcon } from "../../../assets/images/ExpandMoreIcon.svg";
import {
  getFormattedDateString,
  MomentFormats,
} from "../../../common/utils/date";
import { companySelectors } from "../../../state/ducks/company";
import { getInitalsFromName } from "../../components/icons/avatar/helpers";
import Text from "../../components/Text";
import { isDocumentRevisionReleased } from "../../documentRevision/helpers/documentRevisionStatus";
import Colors from "../../layout/theme/utils/colors";
import FBLHRStepProcedureItem from "../FBLHRStepProcedureItem/FBLHRStepProcedureItem";
import { FBProcedureItemType } from "../FBProcedureItem/FBProcedureItem.types";
import { FBLHRStepStyles } from "./FBLHRStep.styles";
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
  const { formState } = FB.useStores();
  const allEmployees = useSelector(companySelectors.getAllEmployees) || [];
  const getUserDetails = (userId: string) =>
    allEmployees.find((obj) => obj.id === userId);
  const getStatusInfo = (opert, operatorId: string) => {
    const approvers = stepLHRs?.id && opert ? opert[stepLHRs?.id] : [];
    return approvers?.filter(
      (o) => o.approverId === operatorId && o.status !== "ABANDONED"
    )[0];
  };
  const operatorList = stepLHRs?.formInput?.[
    "fb-approvals-approvals-built-in"
  ]?.map((e) => ({
    stepId: e,
    user: getUserDetails(e)?.user,
  }));
  const classes = FBLHRStepStyles();
  const stepLabel = `LHR Step ${stepIndex} - Rev ${stepLHRs?.displayRevision || ""
  }`;
  const [expand, setExpand] = React.useState(false);
  const getAvtarStyle = (initialColor) => ({
    width: "35px",
    height: "35px",
    fontWeight: 600,
    color: Colors.white,
    borderRadius: "50%",
    fontSize: "12px",
    background: `${initialColor}`,
  });

  React.useEffect(
    () =>
      reaction(
        () => formState?.approvalMap,
        (value) => {
          if (value) {
            lhrStepState?.setApproval(value);
          }
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
      ),
    []
  );

  const stepButtonStyle = {
    marginTop: 0,
    height: 36,
    minWidth: 180,
    borderRadius: 100,
  };
  const getStatusColor = () => {
    const status = stepLHRs?.status;
    let statusColor = ""; /* latest_yellow_varient */
    if (stepLHRs && isDocumentRevisionReleased(status)) {
      statusColor = Colors.green_blue;
    } else if (stepLHRs && !isDocumentRevisionReleased(status)) {
      statusColor = Colors.latest_yellow_varient;
    } else if (!stepLHRs) {
      statusColor = Colors.medium_light_shade_gray;
    }
    return statusColor;
  };

  const getLHRStatus = () => {
    const status = stepLHRs?.status;
    let lhrstatus = "";
    if (stepLHRs && isDocumentRevisionReleased(status)) {
      lhrstatus = "form.builder.step.complete";
    } else if (stepLHRs && !isDocumentRevisionReleased(status)) {
      lhrstatus = "form.builder.step.inprogress";
    } else if (!stepLHRs) {
      lhrstatus = "form.builder.step.noStarted";
    }
    return lhrstatus || status;
  };

  return (
    <FBProvider {...{ lhrStepState }}>
      {expand}
      <Accordion className={classes.panelBorder} expanded={expand}>
        <AccordionSummary
          onClick={() => setExpand(!expand)}
          className={classes.panelSummary}
          expandIcon={expand ? <ExpandMoreIcon /> : <CollapseMoreIcon />}
        >
          <Box display="flex" alignItems="flex-start">
            <Box mr={2} ml={1}>
              <Typography
                variant="h6"
                style={{ color: expand ? Colors.navy : Colors.almost_black }}
              >
                <FBText locale={stepLabel} />
              </Typography>
            </Box>
            <Box display="flex" alignItems="flex-start" fontSize={12}>
              <Box mr={1} display="flex" alignItems="center">
                {stepLHRs && isDocumentRevisionReleased(stepLHRs?.status) && (
                  <CheckCircle
                    style={{
                      color: getStatusColor(),
                      fontSize: 17,
                      marginTop: 4,
                    }}
                    className="fontSizeSmall"
                  />
                )}
                {stepLHRs && !isDocumentRevisionReleased(stepLHRs?.status) && (
                  <RemoveCircle
                    style={{
                      color: getStatusColor(),
                      fontSize: 17,
                      marginTop: 4,
                    }}
                    className="fontSizeSmall"
                  ></RemoveCircle>
                )}
                {!stepLHRs && (
                  <RemoveCircle
                    style={{
                      color: getStatusColor(),
                      fontSize: 17,
                      marginTop: 4,
                    }}
                    className="fontSizeSmall"
                  ></RemoveCircle>
                )}
              </Box>
              <Box
                fontWeight={700}
                fontSize={12}
                color={Colors.almost_black}
                component={"span"}
                mr={2}
                mt={0.4}
              >
                <FBText locale={getLHRStatus()} values={{}}></FBText>
              </Box>
              {stepLHRs && isDocumentRevisionReleased(stepLHRs?.status) && (
                <Box component={"span"} mt={0.3}>
                  <span style={{ marginRight: 4 }}>&bull;</span>
                  {isDocumentRevisionReleased(stepLHRs.status)
                    ? getFormattedDateString(
                      stepLHRs?.releasedAt,
                      MomentFormats.DateTime
                    )
                    : getFormattedDateString(
                      stepLHRs?.createdAt,
                      MomentFormats.DateTime
                    )}
                </Box>
              )}
            </Box>
          </Box>
          {stepLHRs?.redline && (
            <Box position="relative" left="64%">
              <BorderColorIcon style={{ color: Colors.red }}></BorderColorIcon>
            </Box>
          )}
        </AccordionSummary>
        <AccordionDetails style={{ padding: "2.1rem", display: "block" }}>
          <Box display="flex" alignItems="flex-start">
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
                inputStyle={
                  stepLHRs?.redline
                    ? {
                      background: Colors.light_red,
                      border: `1px solid ${Colors.error_red}`,
                      paddingLeft: "5px",
                    }
                    : { background: Colors.alabaster, borderRadius: 4 }
                }
              />
            </Box>
            <FBButton
              disabled={!isOutput || loading || !lhrBuildTypeExist || disabled}
              label={
                stepLHRs ? "form.builder.view.step" : "form.builder.start.step"
              }
              onClick={stepLHRs ? () => openLHRs(stepLHRs) : startMpi}
              {...{ loading }}
              className={classes.button}
              style={
                stepLHRs
                  ? {
                    ...stepButtonStyle,
                    background: Colors.step_blue,
                    color: Colors.navy,
                  }
                  : {
                    ...stepButtonStyle,
                    background: Colors.navy,
                    color: Colors.white,
                  }
              }
            />
          </Box>
          {isDocumentLHRT && !isEmpty(materials) && (
            <FBLHRStepProcedureItem
              value={materials}
              type={FBProcedureItemType.materials}
              lhrStepIndex={index}
              isPendingChange
            />
          )}
          {isDocumentLHRT && !isEmpty(equipment) && (
            <FBLHRStepProcedureItem
              value={equipment}
              type={FBProcedureItemType.equipment}
              lhrStepIndex={index}
              isPendingChange
            />
          )}
          {stepLHRs && (
            <Box display="flex" alignItems="center" mt={1} mb={4}>
              <Box mr={1} display="flex" alignItems="center">
                {isDocumentRevisionReleased(stepLHRs.status) ? (
                  <CheckCircle />
                ) : (
                  <PlayCircleFilled />
                )}
              </Box>
              <FBText
                locale={
                  isDocumentRevisionReleased(stepLHRs.status)
                    ? "form.builder.step.completed"
                    : "form.builder.step.started"
                }
                values={{
                  date: isDocumentRevisionReleased(stepLHRs.status)
                    ? getFormattedDateString(
                      stepLHRs?.releasedAt,
                      MomentFormats.DateTime
                    )
                    : getFormattedDateString(
                      stepLHRs?.createdAt,
                      MomentFormats.DateTime
                    ),
                }}
              />
            </Box>
          )}
          <Box mb={2}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Typography className={classes.fontTitle}>
                  <Text translation="form.builder.start.quantity" />
                </Typography>
                <Typography className={classes.subTitle}>
                  {stepLHRs?.formInput?.["lhrs-start-quantity"]}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography className={classes.fontTitle}>
                  <Text translation="form.builder.accepted.quantity" />
                </Typography>
                <Typography className={classes.subTitle}>
                  {stepLHRs?.formInput?.["lhrs-accepted-quantity"]}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography className={classes.fontTitle}>
                  <Text translation="form.builder.rejected.quantity" />
                </Typography>
                <Typography className={classes.subTitle}>
                  {stepLHRs?.formInput?.["lhrs-rejected-quantity"]}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Box className={classes.fontTitle}>
              <Text translation="common.operators" />
            </Box>
            <List>
              {map(operatorList, (e) => (
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    {e.user.avatar ? (
                      <Avatar alt={e.user?.name} src={e.user?.avatar} />
                    ) : (
                      <Avatar style={getAvtarStyle(e.user.initialColor)}>
                        {getInitalsFromName(e.user?.name)}
                      </Avatar>
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    style={{ marginLeft: 20 }}
                    primary={
                      <div className={classes.operatorTitle}>
                        {e.user?.name}
                      </div>
                    }
                    secondary={
                      <React.Fragment>
                        <Observer>
                          {() => (
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.operatorStatus}
                            >
                              {
                                getStatusInfo(lhrStepState?.approvals, e.stepId)
                                  ?.status
                              }
                            </Typography>
                          )}
                        </Observer>
                        {getStatusInfo(lhrStepState?.approvals, e.stepId)
                          ?.reviewedAt && (
                            <span style={{ marginRight: 4 }}>&bull;</span>
                          )}
                        {getStatusInfo(lhrStepState?.approvals, e.stepId)
                          ?.reviewedAt &&
                          getFormattedDateString(
                            getStatusInfo(lhrStepState?.approvals, e.stepId)
                              ?.reviewedAt,
                            MomentFormats.DateTime
                          )}
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </AccordionDetails>
      </Accordion>
    </FBProvider>
  );
};

export default withFBLHRStep(FBLHRStep);
