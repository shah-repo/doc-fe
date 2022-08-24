import { Avatar, Box, Collapse, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { ReactComponent as EmailSuccessIcon } from "../../../../../../../src/assets/images/email_success.svg";
import { ReactComponent as ListCollapseIcon } from "../../../../../../../src/assets/images/list_collapse.svg";
import { ReactComponent as ListExpandIcon } from "../../../../../../../src/assets/images/list_expand.svg";
import { ReactComponent as NoTrainingIcon } from "../../../../../../../src/assets/images/no_training_icon.svg";
import { getFormattedDateString, MomentFormats } from "../../../../../../common/utils/date";
import Loader from "../../../../../../ui/components/common/kendo/Loader";
import { getInitalsFromName } from "../../../../../../ui/components/icons/avatar/helpers";
import Text from "../../../../../../ui/components/Text";
import { styles } from "./FBTrainingInfo.styles";
import { FBTrainingInfoProps, TrainingItem, TrainingStates, TrainingStatusHeaders } from "./FBTrainingInfo.types";

const FBTrainingInfoPresenter: React.FunctionComponent<FBTrainingInfoProps> = ({
  trainingData,
  isLoading,
}) => {
  const classes = styles();
  const [open, setOpen] = React.useState({ [TrainingStates.COMPLETED]: true, [TrainingStates.PENDING]: true });
  const handleClick = (selectedListItem: string) => {
    const updatedOpen = { [selectedListItem]: !open[selectedListItem] };
    setOpen({ ...open, ...updatedOpen });
  };
  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && trainingData && Object.keys(trainingData).length === 0 && (
        <Box className={classes.noDataDiv}>
          <NoTrainingIcon />
          <Box display="flex" justifyContent="center">
            <Typography className={classes.noTrainingMessage}>
              <Text translation="common.training.not.found" />
            </Typography>
          </Box>
        </Box>
      )}
      {trainingData &&
        Object.keys(trainingData).map((state: string, index: number) => (
          <List
            aria-labelledby="nested-list-subheader"
            key={index}
            className={classes.list}
          >
            <ListItem className={classes.stateListItem} onClick={() => { handleClick(state); }} >
              {open[state] ? (
                <ListExpandIcon />
              ) : (
                <ListCollapseIcon />
              )}
              <ListItemText>
                <Box display="flex" p={1}>
                  <Box
                    component="span"
                    flexGrow={1}
                    className={classNames(classes.itemHeader, {
                      [classes.expandedItemHeader]: open[state],
                      [classes.collapsedItemHeader]: !open[state],
                    })}
                  >
                    <Text message={TrainingStatusHeaders[state]} />
                  </Box>
                  <Box
                    component="span"
                    justifyContent="flex-end"
                    className={classes.itemCount}
                  >
                    <Text translation="common.items.count" values={{
                      count: trainingData[state]?.data.length,
                    }} />
                  </Box>
                </Box>
              </ListItemText>
            </ListItem>
            <Collapse in={open[state]} timeout="auto" unmountOnExit>
              <List disablePadding>
                {trainingData[state]?.data?.map(
                  (item: TrainingItem, ind: number) => (
                    <>
                      <ListItem key={ind} className={classes.listItem}>
                        <ListItemAvatar>
                          {item.avatar ? (
                            <Avatar
                              className={classes.avatar}
                              src={item.avatar}
                              alt={item.name}
                            />
                          ) : (
                            <Avatar className={classes.avatar} style={{ backgroundColor: item.initialColor }}>
                              {getInitalsFromName(item.name)}
                            </Avatar>
                          )}
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="h6"
                              component="h6"
                              id="simple-modal-title"
                              className={classes.nameText}
                            >
                              <Text message={item.name} />
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="h6"
                              component="h6"
                              id="simple-modal-title"
                              className={classes.emailText}
                            >
                              <Text message={item.email} />
                            </Typography>
                          }
                        />
                        <ListItemText
                          primary={
                            <Box>
                              {state === TrainingStates.PENDING ? (
                                <Box display="flex" flexDirection="row-reverse">
                                  <Typography
                                    variant="h6"
                                    component="h6"
                                    id="simple-modal-title"
                                    data-cy="training-status"
                                    className={classes.stateText}
                                  >
                                    <Text message={item.state} />
                                  </Typography>
                                </Box>
                              ) : (
                                <Grid
                                  container
                                  direction="row"
                                  justify="flex-end"
                                  alignItems="center"
                                >
                                  <Typography
                                    variant="h6"
                                    component="h6"
                                    id="simple-modal-title"
                                    data-cy="training-status"
                                    className={classes.stateText}
                                  >
                                    <EmailSuccessIcon
                                      className={classes.successIcon}
                                    />
                                    <Text message={item.state} />
                                  </Typography>
                                </Grid>
                              )}
                            </Box>
                          }
                          secondary={
                            <Typography
                              align="right"
                              variant="h6"
                              className={classes.dateText}
                            >
                              {state === TrainingStates.PENDING
                                ? <Text translation="common.due.by.date" values={{
                                  date: getFormattedDateString(
                                    item.dueOn,
                                    MomentFormats.BriefDate
                                  ),
                                }} />
                                : <Text message={getFormattedDateString(
                                  item.completedAt,
                                  MomentFormats.DateTime
                                )} />}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {ind < trainingData[state]?.data.length - 1 && (
                        <Divider className={classes.divider} />
                      )}
                    </>
                  )
                )}
              </List>
            </Collapse>
          </List>
        ))}
    </>
  );
};

export default FBTrainingInfoPresenter;
