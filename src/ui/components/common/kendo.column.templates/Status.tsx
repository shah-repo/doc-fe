import { makeStyles } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import Colors from "../../../layout/theme/utils/colors";

export const Status = (props) => {
  const styles = makeStyles(() => ({
    chip: {
      display: "flex",
      flexDirection: "row",
      padding: "0px !important",
      // width: "121px",
      // height: "22px",
      borderRadius: "10px",
      background: "grey",
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "12px",
      lineHeight: "22px",
      alignItems: "center",
      justifyContent: "center",
      color: Colors.white,
    },
    statusApproved: {
      // display: "flex",
      // flexDirection: "row",
      // padding: "0px !important",
      width: "83px",
      background: Colors.latest_green_varient,
      // borderRadius: "10px",
      // margin: "auto",
      // fontFamily: "Sora",
      // fontStyle: "normal",
      // fontWeight: "normal",
      // fontSize: "12px",
      // lineHeight: "22px",
      // alignItems: "center",
      // justifyContent: "center",
      // color: Colors.white,
    },
    statusDraft: {
      // display: "flex",
      // flexDirection: "row",
      // padding: "0px !important",
      width: "59px",
      background: Colors.font_gray,
      // borderRadius: "10px",
      // margin: "auto",
      // fontFamily: "Sora",
      // fontStyle: "normal",
      // fontWeight: "normal",
      // fontSize: "12px",
      // lineHeight: "22px",
      // alignItems: "center",
      // justifyContent: "center",
      // color: Colors.white,
    },
    statusReview: {
      // display: "flex",
      // flexDirection: "row",
      // padding: "0px !important",
      width: "85px",
      background: Colors.latest_blue_varient,
      // borderRadius: "10px",
      // margin: "auto",
      // fontFamily: "Sora",
      // fontStyle: "normal",
      // fontWeight: "normal",
      // fontSize: "12px",
      // lineHeight: "22px",
      // alignItems: "center",
      // justifyContent: "center",
      // color: Colors.white,
    },
    statusImplementation: {
      // display: "flex",
      // flexDirection: "row",
      // padding: "0px !important",
      width: "128px",
      background: Colors.latest_yellow_varient,
      // borderRadius: "10px",
      // margin: "auto",
      // fontFamily: "Sora",
      // fontStyle: "normal",
      // fontWeight: "normal",
      // fontSize: "12px",
      // lineHeight: "22px",
      // alignItems: "center",
      // justifyContent: "center",
      // color: Colors.white,
    },
    statusClosed: {
      // display: "flex",
      // flexDirection: "row",
      // padding: "0px !important",
      width: "70px",
      background: Colors.olivine,
      // borderRadius: "10px",
      // margin: "auto",
      // fontFamily: "Sora",
      // fontStyle: "normal",
      // fontWeight: "normal",
      // fontSize: "12px",
      // lineHeight: "22px",
      // alignItems: "center",
      // justifyContent: "center",
      // color: Colors.white,
    },
    statusVoided: {
      // display: "flex",
      // flexDirection: "row",
      // padding: "0px !important",
      width: "70px",
      background: Colors.basket_ball_orange,
      // borderRadius: "10px",
      // margin: "auto",
      // fontFamily: "Sora",
      // fontStyle: "normal",
      // fontWeight: "normal",
      // fontSize: "12px",
      // lineHeight: "22px",
      // alignItems: "center",
      // justifyContent: "center",
      // color: Colors.white,
    },
  }));
  const classes = styles();
  const status = props.dataItem[props.field];
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
          <span className={`${classes.chip} ${classes.statusDraft}`}>{status}</span>
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
        <span className={`${classes.chip} ${classes.statusReview}`}>{status}</span>
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
        <span className={`${classes.chip} ${classes.statusImplementation}`}>{status}</span>
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
        <span className={`${classes.chip} ${classes.statusApproved}`}>{status}</span>
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
        <span className={`${classes.chip} ${classes.statusClosed}`}>{status}</span>
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
        <span className={`${classes.chip} ${classes.statusVoided}`}>{status}</span>
      </td>
    );
  }
  return (
    <td
      colSpan={props.colSpan}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      data-grid-col-index={props.columnIndex}
    >
      <span className={`${classes.chip} ${classes.statusVoided}`}>{status}</span>
    </td>
  );
};
