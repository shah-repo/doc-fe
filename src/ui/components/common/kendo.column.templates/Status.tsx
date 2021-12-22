import { Chip, Grid, makeStyles } from "@material-ui/core";
import { toUpper } from "lodash";
import React from "react";
import Colors from "../../../layout/theme/utils/colors";

export const Status = (props) => {
  const styles = makeStyles(() => ({
    chip: {
      display: "flex",
      flexDirection: "row",
      padding: "0px !important",
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
      background: Colors.latest_green_varient,
    },
    RELEASED: {
      background: Colors.latest_green_varient,
    },
    DRAFT: {
      background: Colors.font_gray,
    },
    INREVIEW: {
      background: Colors.latest_blue_varient,
    },
    IMPLEMENTATION: {
      background: Colors.latest_yellow_varient,
    },
    PENDINGCHANGE: {
      background: Colors.latest_yellow_varient,
    },
    CLOSED: {
      background: Colors.olivine,
    },
    VOIDED: {
      background: Colors.basket_ball_orange,
    },
    OBSOLETE: {
      background: Colors.latest_yellow_varient,
    },
    SUPERSEDED: {
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
      <Grid
        container
        direction="row"
        alignContent="flex-start"
        justify="flex-start"
      >
        <Chip
          size="small"
          className={`${classes.chip} ${
            classes[toUpper(status?.replaceAll(/[^a-z]/gi, ""))]
          }`}
          label={status}
        />
      </Grid>
    </td>
  );
};
