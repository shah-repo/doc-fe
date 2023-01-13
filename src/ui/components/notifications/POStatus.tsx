import {
  Link,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Slide, toast } from "react-toastify";
import { ReactComponent as CloseIcon } from "../../../assets/images/po_status_close.svg";
import { ReactComponent as InfoIcon } from "../../../assets/images/po_status_info.svg";
import POStatusToastrStyles from "./POStatus.styles";
import "./styles.css";

export declare type ToastType = "info" | "success" | "error";

interface Props {
  message: string;
  type: ToastType;
}

const POToast: React.FC<Props> = (props) => {
  const classes = POStatusToastrStyles();

  return (
    <ListItem
      alignItems="flex-start"
      disableGutters
      className={classes.listItem}
    >
      <ListItemAvatar className={classes.infoIcon}>
        <InfoIcon />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography data-cy="po-status-info" className={classes.primaryText}>
            Info
          </Typography>
        }
        secondary={
          <Typography
            data-cy="secondary-text"
            component="span"
            variant="body2"
            color="textPrimary"
            className={classes.secondaryText}
          >
            <Link
              component="span"
              variant="button"
              id="po-status-link-text"
              className={classes.secondaryLinkText}
            >
              <span style={{ display: "inline-block" }}>
                PO-00728
                <div className={classes.blackDot} /> Rev 1
              </span>
            </Link>{" "}
            has been reopened
          </Typography>
        }
        className={classes.listItemText}
      />
    </ListItem>
  );
};

export const openPOToast = (myProps, options = {}) =>
  toast(<POToast {...myProps} />, {
    ...{
      toastId: "poStatusToast",
      bodyClassName: "poStatusToastrBody",
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      transition: Slide,
      timeout: 0,
      extendedTimeout: 0,
      theme: "Light",
      closeButton: <div id="poStatusCloseButton">{<CloseIcon />} </div>,
    },
    ...options,
  });
