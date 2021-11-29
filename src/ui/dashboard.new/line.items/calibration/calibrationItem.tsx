/* eslint-disable react-hooks/rules-of-hooks */
import {
  Box,
  Grid,
  Link,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import { ReactComponent as EQIcon } from "../../../../assets/images/EQ.svg";
import { ReactComponent as PinIcon } from "../../../../assets/images/pin.svg";
import { ReactComponent as PinSolidIcon } from "../../../../assets/images/pin_solid.svg";
import { ActionTypes } from "../../../../state/ducks/dashboard.new/my.feeds/types";
import Text from "../../../components/Text";
import { documentVersionPath } from "../../../document.revision/utils/paths";
import { StyledListItem } from "../common/StyledListItem";
import { StyleTooltip } from "../common/StyleTooltip";
import { styles } from "./calibrationItem.styles";

interface Props {
  id: string;
  docId: string;
  docDocumentId: string;
  type: ActionTypes;
  docRevName: string;
  docRevId: string;
  docRevOwnerId: string;
  equipmentInterval: number;
  timestamp?: string;
  hoverItemId: string;
  onMouseHoverItem: (id: string) => void;
  pinned: boolean;
  pinLineItem: (id: string) => void;
  unPinLineItem: (id: string) => void;
}
const taskApprovalPresenter: React.FunctionComponent<Props> = ({
  id,
  docDocumentId,
  docId,
  type,
  docRevId,
  docRevName,
  timestamp,
  hoverItemId,
  equipmentInterval,
  onMouseHoverItem,
  pinned,
  pinLineItem,
  unPinLineItem,
}) => {
  const classes = styles();
  const [pinHover, setPinHover] = React.useState(false);
  const hoverItem = hoverItemId === id;
  const handlePinClick = () => {
    pinLineItem(id);
  };
  const handleUnPinClick = () => {
    unPinLineItem(id);
  };
  const onMouseLeaveActionIcons = () => {
    setPinHover(false);
  };
  const onMouseHoverListItem = () => {
    onMouseHoverItem(id);
  };
  const onMouseHoverPinIcon = () => {
    setPinHover(true);
  };
  return (
    <>
      <StyledListItem button onMouseEnter={onMouseHoverListItem}>
        <ListItemIcon>
          <EQIcon />
        </ListItemIcon>
        <ListItemText
          primary={
            <>
              <Grid
                container={true}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
                <Grid item={true}>
                  <Link
                    href={
                      docId
                        ? documentVersionPath(docRevId || "", docDocumentId)
                        : "#"
                    }
                    color="inherit"
                    className={classes.link}
                  >
                    <Typography
                      component="span"
                      variant="body2"
                      className={`${classes.typographyBold} ${classes.margin5}`}
                      color="textPrimary"
                      noWrap
                    >
                      {docId}
                    </Typography>
                  </Link>
                </Grid>
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <Link
                    href={
                      docRevName
                        ? documentVersionPath(docRevId || "", docDocumentId)
                        : "#"
                    }
                    color="inherit"
                    className={classes.link}
                  >
                    <Typography
                      component="span"
                      variant="caption"
                      className={`${classes.typographyBold} ${classes.margin5}`}
                      color="textSecondary"
                      noWrap
                    >
                      {docRevName}
                    </Typography>
                  </Link>
                </Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={`${classes.typography} ${classes.margin5}`}
                    color="textPrimary"
                    noWrap
                  >
                    <Text
                      translation={
                        type === ActionTypes.EQ_CALIBRATION_OWNER_OR_COORDINATOR
                          ? "dashboard.calibration.due"
                          : "dashboard.preventive.maintenance.due"
                      }
                      values={{
                        noOfDays: equipmentInterval,
                      }}
                    />
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container={true}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
                <Grid item={true} className={classes.grayDot}></Grid>
                <Grid item={true} md={12} sm={12}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.timestampContainer}
                    color="textSecondary"
                    noWrap
                  >
                    {timestamp}
                  </Typography>
                </Grid>
              </Grid>
            </>
          }
        />
        {hoverItem && !pinned && (
          <Box
            component="div"
            className={classes.actionIcons}
            onMouseLeave={onMouseLeaveActionIcons}
          >
            <span className={classes.actionIcon}>
              {!pinHover && !pinned && <PinIcon onMouseEnter={onMouseHoverPinIcon} />}
              {pinHover && !pinned && (
                <StyleTooltip title={<Typography><Text translation="common.pin" /></Typography>} placement="top" arrow>
                  <PinSolidIcon
                    onClick={handlePinClick}
                    onMouseLeave={onMouseLeaveActionIcons}
                  />
                </StyleTooltip>
              )}
            </span>
          </Box>
        )}
        {pinned && (
          <StyleTooltip title={<Typography><Text translation="common.unpin" /></Typography>} placement="top" arrow >
            <PinSolidIcon
              onClick={handleUnPinClick}
            />
          </StyleTooltip>
        )}
      </StyledListItem>
    </>
  );
};

export default taskApprovalPresenter;
