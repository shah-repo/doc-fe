import { makeStyles } from "@material-ui/core";
import { GridCellProps } from "@progress/kendo-react-grid";
import React from "react";
import { Link } from "react-router-dom";
import Colors from "../../../layout/theme/utils/colors";

export const Status = (props: GridCellProps) => {
  const styles = makeStyles(() => ({
    statusApproved: {
      display: "flex",
      flexDirection: "row",
      padding: "0px !important",
      width: "83px",
      background: Colors.latest_green_varient,
      borderRadius: "10px",
      // margin: "auto",
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "12px",
      lineHeight: "22px",
      alignItems: "center",
      justifyContent: "center",
      color: Colors.white,
    },
    statusDraft: {
      display: "flex",
      flexDirection: "row",
      padding: "0px !important",
      width: "59px",
      background: Colors.font_gray,
      borderRadius: "10px",
      // margin: "auto",
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "12px",
      lineHeight: "22px",
      alignItems: "center",
      justifyContent: "center",
      color: Colors.white,
    },
    statusReview: {
      display: "flex",
      flexDirection: "row",
      padding: "0px !important",
      width: "85px",
      background: Colors.latest_blue_varient,
      borderRadius: "10px",
      // margin: "auto",
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "12px",
      lineHeight: "22px",
      alignItems: "center",
      justifyContent: "center",
      color: Colors.white,
    },
    statusImplementation: {
      display: "flex",
      flexDirection: "row",
      padding: "0px !important",
      width: "128px",
      background: Colors.latest_yellow_varient,
      borderRadius: "10px",
      // margin: "auto",
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "12px",
      lineHeight: "22px",
      alignItems: "center",
      justifyContent: "center",
      color: Colors.white,
    },
    statusClosed: {
      display: "flex",
      flexDirection: "row",
      padding: "0px !important",
      width: "70px",
      background: Colors.olivine,
      borderRadius: "10px",
      // margin: "auto",
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "12px",
      lineHeight: "22px",
      alignItems: "center",
      justifyContent: "center",
      color: Colors.white,
    },
    statusVoided: {
      display: "flex",
      flexDirection: "row",
      padding: "0px !important",
      width: "70px",
      background: Colors.basket_ball_orange,
      borderRadius: "10px",
      // margin: "auto",
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "12px",
      lineHeight: "22px",
      alignItems: "center",
      justifyContent: "center",
      color: Colors.white,
    },
  }));
  const classes = styles();
  const status = props.dataItem.state;
  if (status === "DRAFT") {
    return (
      <td
        colSpan={props.colSpan}
        role="gridcell"
        aria-colindex={props.ariaColumnIndex}
        aria-selected="false"
        data-grid-col-index={props.columnIndex}
      >
        <Link to="">
          <span className={classes.statusDraft}>{status}</span>
        </Link>
      </td>
    );
  }
  if (status === "IN_REVIEW") {
    return (
      <td
        colSpan={props.colSpan}
        role="gridcell"
        aria-colindex={props.ariaColumnIndex}
        aria-selected="false"
        data-grid-col-index={props.columnIndex}
      >
        <span className={classes.statusReview}>{status}</span>
      </td>
    );
  }
  if (status === "IMPLEMENTATION") {
    return (
      <td
        colSpan={props.colSpan}
        role="gridcell"
        aria-colindex={props.ariaColumnIndex}
        aria-selected="false"
        data-grid-col-index={props.columnIndex}
      >
        <span className={classes.statusImplementation}>{status}</span>
      </td>
    );
  }
  if (status === "APPROVED") {
    return (
      <td
        colSpan={props.colSpan}
        role="gridcell"
        aria-colindex={props.ariaColumnIndex}
        aria-selected="false"
        data-grid-col-index={props.columnIndex}
      >
        <span className={classes.statusApproved}>{status}</span>
      </td>
    );
  }
  if (status === "CLOSED") {
    return (
      <td
        colSpan={props.colSpan}
        role="gridcell"
        aria-colindex={props.ariaColumnIndex}
        aria-selected="false"
        data-grid-col-index={props.columnIndex}
      >
        <span className={classes.statusClosed}>{status}</span>
      </td>
    );
  }
  if (status === "VOIDED") {
    return (
      <td
        colSpan={props.colSpan}
        role="gridcell"
        aria-colindex={props.ariaColumnIndex}
        aria-selected="false"
        data-grid-col-index={props.columnIndex}
      >
        <span className={classes.statusVoided}>{status}</span>
      </td>
    );
  }
  return null;
};
