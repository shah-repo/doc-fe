import {
  Chip,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  withStyles
} from "@material-ui/core";
import Link from "@material-ui/core/Link";
import React from "react";
import { ReactComponent as OverdueIcon } from "../../../../../assets/images/overdue_status.svg";
import { ReactComponent as OverdueWhiteIcon } from "../../../../../assets/images/overdue_status_white.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import { ReactComponent as TrainingIcon } from "../../../../../assets/images/training.svg";
import { ReactComponent as WarningIcon } from "../../../../../assets/images/warning_status.svg";
import { ReactComponent as WarningWhiteIcon } from "../../../../../assets/images/warning_status_white.svg";
import { documentVersionPath } from "../../../../document.revision/utils/paths";
import Colors from "../../../../layout/theme/utils/colors";
import { styles } from "./newTraining.styles";

interface Props {
  id: string;
  type: string;
  title: string;
  documentId: string;
  status: string;
  timestamp: string;
  verbose: string;
  dueDate: string;
  approvers: string[];
  hoverItemId: string;
  onMouseHoverItem: (arId: string | undefined) => void;
}

const PendingTrainingPresenter: React.FunctionComponent<Props> = ({
  id,
  title,
  status,
  timestamp,
  dueDate,
  approvers,
  onMouseHoverItem,
  hoverItemId,
}) => {
  const classes = styles();
  const StyledListItem = withStyles({
    root: {
      "&:hover": {
        backgroundColor: Colors.sky_blue,
      },
    },
  })(ListItem);
  const NormalStyleChip = withStyles({
    root: {
      backgroundColor: Colors.white,
      borderRadius: "3px",
    },
    colorPrimary: {
      color:
        status === "OVERDUE"
          ? Colors.latest_red_varient
          : Colors.latest_yellow_varient,
    },
  })(Chip);
  const HoverStyleChip = withStyles({
    root: {
      backgroundColor:
        status === "OVERDUE"
          ? Colors.latest_red_varient
          : Colors.latest_yellow_varient,
      borderRadius: "3px",
    },
    colorPrimary: {
      color: Colors.white,
    },
  })(Chip);
  const [pinned, setPinned] = React.useState(false);
  const hoverItem = hoverItemId === id;
  const handlePinClick = () => {
    setPinned(!pinned);
  };
  const onMouseHoverItemListItem = () => {
    onMouseHoverItem(id);
  };
  const existingId = "66bbda6c-65a3-47aa-b3f5-c9566d201d96";
  const documentRevId = "466b89d4-7067-4c80-a8c9-4e3f47f2a2f6";


  return (
    <StyledListItem
      button
      onMouseEnter={onMouseHoverItemListItem}
    >
      <ListItemIcon className={classes.listItemIcon}>
        <TrainingIcon />
      </ListItemIcon>
      <ListItemText
        primary={
          <>
            <Grid container={true}>
              <Grid item={true} md={12} sm={12}>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typography}
                  color="textPrimary"
                >
                  Your Training {status === "OVERDUE" ? "" : "on"}&nbsp;
                </Typography>
                <Link
                  href={documentVersionPath(documentRevId, existingId)}
                  color="inherit"
                  className= {classes.link}
                >
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.typography}
                    color="textPrimary"
                  >
                    {id}&nbsp;
                  </Typography>
                </Link>
                <Link
                  href={documentVersionPath(documentRevId, existingId)}
                  color="inherit"
                  className= {classes.link}
                >
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.typographyBold}
                    color="textSecondary"
                  >
                    {title}&nbsp;
                  </Typography>
                </Link>
                <Typography
                  component="span"
                  variant="caption"
                  className={classes.typographyStatus}
                  color="textSecondary"
                >
                  {!hoverItem && (
                    <NormalStyleChip
                      size="small"
                      color="primary"
                      icon={
                        status === "OVERDUE" ? <OverdueIcon /> : <WarningIcon />
                      }
                      label={status}
                    />
                  )}
                  {hoverItem && (
                    <HoverStyleChip
                      color="primary"
                      size="small"
                      icon={
                        status === "OVERDUE" ? (
                          <OverdueWhiteIcon />
                        ) : (
                          <WarningWhiteIcon />
                        )
                      }
                      label={status}
                    />
                  )}
                </Typography>
                <Typography
                  component="span"
                  variant="caption"
                  className={
                    status === "OVERDUE"
                      ? classes.typographyOverdue
                      : classes.typographyDueInfewDays
                  }
                  color="textSecondary"
                >
                  &nbsp;. {dueDate}
                </Typography>
              </Grid>
            </Grid>
            <Grid container={true}>
              <Grid item={true} md={12} sm={12}>
                <Link
                  href="#"
                  color="inherit"
                  className= {classes.link}
                >
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.typographyBold}
                    color="textSecondary"
                  >
                    {approvers.join(",")}
                  </Typography>
                </Link>
                <Typography
                  component="span"
                  variant="caption"
                  className={classes.timestampContainer}
                  color="textSecondary"
                >
                  . {timestamp}
                </Typography>
              </Grid>
            </Grid>
          </>
        }
      />
      {hoverItem && (
        <div className={classes.actionIcons}>
          <PinIcon onClick={handlePinClick} />
        </div>
      )}
    </StyledListItem>
  );
};

export default PendingTrainingPresenter;
