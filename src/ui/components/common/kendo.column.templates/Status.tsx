import { makeStyles } from "@material-ui/core";
import { toUpper } from "lodash";
import React from "react";
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
    APPROVED: {
      width: "83px",
      background: Colors.latest_green_varient,
    },
    RELEASED: {
      width: "83px",
      background: Colors.latest_green_varient,
    },
    DRAFT: {
      width: "59px",
      background: Colors.font_gray,
    },
    INREVIEW: {
      width: "85px",
      background: Colors.latest_blue_varient,
    },
    IMPLEMENTATION: {
      width: "128px",
      background: Colors.latest_yellow_varient,
    },
    PENDINGCHANGE: {
      width: "128px",
      background: Colors.latest_yellow_varient,
    },
    CLOSED: {
      width: "70px",
      background: Colors.olivine,
    },
    VOIDED: {
      width: "70px",
      background: Colors.basket_ball_orange,
    },
    OBSOLETE: {
      width: "83px",
      background: Colors.latest_yellow_varient,
    },
    SUPERSEDED: {
      width: "100px",
      background: Colors.basket_ball_orange,
    },
  }));
  const classes = styles();
  const status = props.dataItem[props.field];

  return (
    <td
      colSpan={props.colSpan}
      style={props.style}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      className={props.className}
      data-grid-col-index={props.columnIndex}
    >
      <span
        className={`${classes.chip} ${classes[toUpper(status?.replaceAll(/[^a-z]/gi, ""))]}`}
      >
        {status}
      </span>
    </td>
  );
};
