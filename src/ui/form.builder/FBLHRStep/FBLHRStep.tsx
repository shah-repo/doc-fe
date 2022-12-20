import { Box, Grid, Typography } from "@material-ui/core";
import Accordion from "@material-ui/core/ExpansionPanel";
import AccordionDetails from "@material-ui/core/ExpansionPanelDetails";
import AccordionSummary from "@material-ui/core/ExpansionPanelSummary";
import { CheckCircle, RemoveCircle } from "@material-ui/icons";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import { isEmpty } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { FB, FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBLHRStepProps, FBProvider, FBText } from "..";
import { ReactComponent as CollapseMoreIcon } from "../../../assets/images/CollapseMoreIcon.svg";
import { ReactComponent as ExpandMoreIcon } from "../../../assets/images/ExpandMoreIcon.svg";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { User } from "../../../state/ducks/common/types";
import { companySelectors } from "../../../state/ducks/company";
import Text from "../../components/Text";
import { isDocumentRevisionInDraft, isDocumentRevisionInReview, isDocumentRevisionReleased } from "../../documentRevision/helpers/documentRevisionStatus";
import Colors from "../../layout/theme/utils/colors";
import FBLHRStepProcedureItem from "../FBLHRStepProcedureItem/FBLHRStepProcedureItem";
import { FBProcedureItemType } from "../FBProcedureItem/FBProcedureItem.types";
import OperatorsList from "./components/OperatorsList";
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
  const { workspaceState } = FB.useStores();
  const classes = FBLHRStepStyles();
  const documentOperators = workspaceState?.document?.document?.operators
    ?.map(({ user }) => ({ stepId: user?.id, user }));

  const allEmployees = useSelector(companySelectors.getAllEmployees) || [];
  const getUserDetails = (userId: string) => allEmployees.find((obj) => obj.id === userId);

  const stepApproverList = stepLHRs?.formInput?.["fb-approvals-approvals-built-in"]?.map((id) => ({
    stepId: id,
    user: getUserDetails(id)?.user,
  }));

  const stepOperatorList = stepLHRs?.document?.["operators"]?.map((operator) => ({
    stepId: operator.id,
    user: getUserDetails(operator.id)?.user,
  }));


  let operators: {stepId: string; user: User}[] = [];
  if (stepLHRs) {
    const status = stepLHRs.status;
    if (isDocumentRevisionReleased(status) || isDocumentRevisionInReview(status)) {
      operators = stepApproverList ?? documentOperators;
    } else if (isDocumentRevisionInDraft(status)) {
      operators = stepOperatorList ?? stepApproverList ?? documentOperators;
    }
  }

  operators = operators?.map((user) => ({ stepId: user?.stepId, user: user?.user }));

  const stepLabel = stepLHRs ? `LHR Step ${stepIndex} - Rev ${stepLHRs?.displayRevision || ""}`
    : `LHR Step ${stepIndex}`;
  const [expand, setExpand] = React.useState(false);

  const getStatusColor = () => {
    const status = stepLHRs?.status;
    let statusColor = "";
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

  const renderRemoveCircle = () => (
    <RemoveCircle
      style={{
        color: getStatusColor(),
        fontSize: 17,
      }}
      className="fontSizeSmall"
    ></RemoveCircle>
  );
  const isDisabled = !isOutput || loading || !lhrBuildTypeExist;

  return (
    <FBProvider {...{ lhrStepState }}>
      {!isDocumentLHRT && ( <Accordion className={classes.panelBorder} expanded={expand}>

        <AccordionSummary
          onClick={() => setExpand(!expand)}
          className={classes.panelSummary}
          expandIcon={expand ? <ExpandMoreIcon /> : <CollapseMoreIcon />}
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box mr={2} ml={1}>
              <Typography variant="h6" style={{ color: expand ? Colors.navy : Colors.almost_black }}>
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
                    }}
                    className="fontSizeSmall"
                  />
                )}
                {stepLHRs && !isDocumentRevisionReleased(stepLHRs?.status) && renderRemoveCircle()}
                {!stepLHRs && renderRemoveCircle()}
              </Box>
              <Box
                fontWeight={700}
                fontSize={12}
                color={Colors.almost_black}
                component={"span"}
                mr={0.75}
              >
                {!isDocumentLHRT && (<FBText locale={getLHRStatus()} values={{}}></FBText>)}
              </Box>
              {stepLHRs &&
                (isDocumentRevisionReleased(stepLHRs?.status) || isDocumentRevisionInDraft(stepLHRs?.status)) &&
                (<Box component={"span"} data-cy={`lhr-step-timestamp-${stepIndex}`}>
                  <Box component="span" marginRight={0.75}>&bull;</Box>
                  {isDocumentRevisionReleased(stepLHRs.status)
                    ? getFormattedDateString(
                      stepLHRs?.releasedAt,
                      MomentFormats.DateTime
                    )
                    : getFormattedDateString(
                      stepLHRs?.createdAt,
                      MomentFormats.DateTime
                    )}
                </Box>)}
            </Box>
          </Box>
          <Box flexGrow={1}></Box>
          {stepLHRs?.redline && (
            <Box pr={2}>
              <BorderColorIcon className={classes.borderColorIcon}></BorderColorIcon>
            </Box>
          )}
        </AccordionSummary>

        <AccordionDetails className={classes.panelDetails}>
          <Box display="flex" alignItems="flex-start">
            <Box
              flexGrow={1}
              onClick={() => isOutput && stepLHRs && openLHRs()}
              bgcolor={Colors.alabaster}
              borderRadius={4}
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
                inputPropStyle={{
                  background: Colors.background_white,
                  padding: "0px 0px 0px 6px",
                  minHeight: 36,
                }}
                {...{ name, loading, filterOptions }}
                inputStyle={
                  stepLHRs?.redline
                    ? {
                      background: Colors.seashell,
                      border: `1px solid ${Colors.error_red}`,
                      paddingLeft: "5px",
                    }
                    : { background: Colors.background_white, borderRadius: 4 }
                }
              />
            </Box>
            <FBButton
              disabled={isDisabled}
              label={
                stepLHRs ? "form.builder.view.step" : "form.builder.start.step"
              }
              onClick={stepLHRs ? () => openLHRs(stepLHRs) : startMpi}
              {...{ loading }}
              className={classes.button}
              style={
                isDisabled ? {
                  background: Colors.whitest_grey,
                }
                  : stepLHRs
                    ? {
                      background: Colors.light_blue,
                      color: Colors.navy,
                    }
                    : {
                      background: Colors.navy,
                      color: Colors.white,
                    }
              }
            />
          </Box>

          {!isDocumentLHRT && !isEmpty(materials) && !lhrStepState && (
            <FBLHRStepProcedureItem
              value={materials}
              type={FBProcedureItemType.materials}
              lhrStepIndex={index}
              isPendingChange
            />
          )}
          {!isDocumentLHRT && !isEmpty(equipment) && !lhrStepState && (
            <FBLHRStepProcedureItem
              value={equipment}
              type={FBProcedureItemType.equipment}
              lhrStepIndex={index}
              isPendingChange
            />
          )}
          {!isDocumentLHRT && (
            <Box mb={3.75} mt={3.75}>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <Typography className={classes.fontTitle} data-cy={`start-quantity-${stepIndex}`}>
                    <Text translation="form.builder.start.quantity" />
                  </Typography>
                  <Typography className={classes.subTitle} data-cy={`start-quantity-value-${stepIndex}`}>
                    {stepLHRs?.formInput?.["lhrs-start-quantity"]}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.fontTitle}  data-cy={`accepted-quantity-${stepIndex}`}>
                    <Text translation="form.builder.accepted.quantity" />
                  </Typography>
                  <Typography className={classes.subTitle} data-cy={`accepted-quantity-value-${stepIndex}`}>
                    {stepLHRs?.formInput?.["lhrs-accepted-quantity"]}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.fontTitle} data-cy={`rejected-quantity-${stepIndex}`}>
                    <Text translation="form.builder.rejected.quantity" />
                  </Typography>
                  <Typography className={classes.subTitle} data-cy={`rejected-quantity-value-${stepIndex}`}>
                    {stepLHRs?.formInput?.["lhrs-rejected-quantity"]}
                  </Typography>
                </Grid>
              </Grid>
            </Box>)}
          <Box>
            {!isDocumentLHRT && (
              <Box className={classes.fontTitle} data-cy={`operators-${stepIndex}`}>
                <Text translation="common.operators" />
              </Box>
            )}
            <OperatorsList {...{ operators, stepLHRs, lhrStepState, stepIndex }} />
          </Box>
        </AccordionDetails>
      </Accordion>)}
      {isDocumentLHRT && (
        <>
          <Box display="flex" alignItems="center"  justifyContent={isDocumentLHRT ? "" : "center"}
            style={{ borderBottom: `2px solid ${Colors.chinese_silver}` }}>
            <Box mr={2} ml={1} >
              <Typography variant="h6" style={{
                color: Colors.almost_black,
              }}>
                <FBText locale={stepLabel}  />
              </Typography>
            </Box>
            <Box display="flex" alignItems="flex-start" fontSize={12}>

              {!isDocumentLHRT && (  <Box mr={1} display="flex" alignItems="center">
                {stepLHRs && isDocumentRevisionReleased(stepLHRs?.status) && (
                  <CheckCircle
                    style={{
                      color: getStatusColor(),
                      fontSize: 17,
                    }}
                    className="fontSizeSmall"
                  />
                )}
                {stepLHRs && !isDocumentRevisionReleased(stepLHRs?.status) && renderRemoveCircle()}
                {!stepLHRs && renderRemoveCircle()}
              </Box>)}
              <Box
                fontWeight={700}
                fontSize={12}
                color={Colors.almost_black}
                component={"span"}
                mr={0.75}
              >
                {!isDocumentLHRT && (<FBText locale={getLHRStatus()} values={{}}></FBText>)}
              </Box>
            </Box>
          </Box>
          <Box flexGrow={1}></Box>
          {stepLHRs?.redline && (
            <Box pr={2}>
              <BorderColorIcon className={classes.borderColorIcon}></BorderColorIcon>
            </Box>
          )}
          <AccordionDetails className={classes.panelhrtDetails}>
            <Box display="flex" alignItems="flex-start">
              <Box
                flexGrow={1}
                onClick={() => isOutput && stepLHRs && openLHRs()}
                bgcolor={Colors.alabaster}
                borderRadius={4}
              >
                <FBAutocompleteAsync
                  boxProps={{ flexGrow: 1 }}
                  label="form.builder.select.document"
                  validationAttribute ="form.builder.lhrstep"
                  type="lhrstep"
                  optionId={FBAutocompleteAsyncOption.mpiDocuments}
                  gutter={false}
                  autosave
                  rules="required"
                  withState
                  shouldReloadOnInit
                  disabled={isOutput || !(isDraft || isPendingChange)}
                  withoutPrefixRoot={Boolean(stepLHRs)}
                  inputPropStyle={{
                    background: Colors.background_white,
                    padding: "0px 0px 0px 6px",
                    minHeight: 36,
                  }}
                  {...{ name, loading, filterOptions }}
                  inputStyle={
                  stepLHRs?.redline
                    ? {
                      background: Colors.seashell,
                      border: `1px solid ${Colors.error_red}`,
                      paddingLeft: "5px",
                    }
                    : { background: Colors.background_white, borderRadius: 4 }
                  }
                />
              </Box>
              {!isDocumentLHRT && ( <FBButton
                disabled={isDisabled}
                label={
                  stepLHRs ? "form.builder.view.step" : "form.builder.start.step"
                }
                onClick={stepLHRs ? () => openLHRs(stepLHRs) : startMpi}
                {...{ loading }}
                className={classes.button}
                style={
                  isDisabled ? {
                    background: Colors.whitest_grey,
                  }
                    : stepLHRs
                      ? {
                        background: Colors.light_blue,
                        color: Colors.navy,
                      }
                      : {
                        background: Colors.navy,
                        color: Colors.white,
                      }
                }
              /> )}
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
            <Box>
              <OperatorsList {...{ operators, stepLHRs, lhrStepState, stepIndex }} />
            </Box>
          </AccordionDetails>
        </>
      )}
    </FBProvider>
  );
};


export default withFBLHRStep(FBLHRStep);
