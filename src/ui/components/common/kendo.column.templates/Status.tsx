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
      background: Colors.light_cyan,
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "10px",
      lineHeight: "13px",
      textTransform: "uppercase",
      alignItems: "center",
      justifyContent: "center",
      color: Colors.lochmara,
    },
    APPROVED: {
      background: Colors.carla,
      color: Colors.fruit_salad,
    },
    RELEASED: {
      background: Colors.carla,
      color: Colors.fruit_salad,
    },
    DRAFT: {
      background: Colors.light_cyan,
      color: Colors.lochmara,
    },
    INREVIEW: {
      background: Colors.old_lace,
      color: Colors.tawny,
    },
    IMPLEMENTATION: {
      background: Colors.light_cyan,
      color: Colors.lochmara,
    },
    CURRENT: {
      background: Colors.light_cyan,
      color: Colors.lochmara,
    },
    LASTSIGNED: {
      background: Colors.light_cyan,
      color: Colors.lochmara,
    },
    WIP: {
      background: Colors.light_cyan,
      color: Colors.lochmara,
    },
    PENDINGCHANGE: {
      background: Colors.old_lace,
      color: Colors.tawny,
    },
    PENDINGAPPROVAL: {
      background: Colors.old_lace,
      color: Colors.tawny,
    },
    CLOSED: {
      background: Colors.lily_white,
      color: Colors.font_gray,
    },
    VOIDED: {
      background: Colors.lily_white,
      color: Colors.font_gray,
    },
    VOID: {
      background: Colors.lily_white,
      color: Colors.font_gray,
    },
    OBSOLETE: {
      background: Colors.lily_white,
      color: Colors.font_gray,
    },
    SUPERSEDED: {
      background: Colors.lily_white,
      color: Colors.font_gray,
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
