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
      borderRadius: "3px",
      border: `1px solid ${Colors.steel_blue}`,
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
      border: `1px solid ${Colors.fruit_salad_border}`,
    },
    RELEASED: {
      background: Colors.carla,
      color: Colors.fruit_salad,
      border: `1px solid ${Colors.fruit_salad_border}`,
    },
    INREVIEW: {
      background: Colors.old_lace,
      color: Colors.tawny,
      border: `1px solid ${Colors.ochre}`,
    },
    CURRENT: {
      background: Colors.light_cyan,
      color: Colors.lochmara,
    },
    PENDINGCHANGE: {
      background: Colors.old_lace,
      color: Colors.tawny,
      border: `1px solid ${Colors.ochre}`,
    },
    PENDINGAPPROVAL: {
      background: Colors.old_lace,
      color: Colors.tawny,
      border: `1px solid ${Colors.ochre}`,
    },
    CLOSED: {
      background: Colors.lily_white,
      color: Colors.font_gray,
      border: `1px solid ${Colors.font_gray}`,
    },
    VOIDED: {
      background: Colors.lily_white,
      color: Colors.font_gray,
      border: `1px solid ${Colors.font_gray}`,
    },
    VOID: {
      background: Colors.lily_white,
      color: Colors.font_gray,
      border: `1px solid ${Colors.font_gray}`,
    },
    OBSOLETE: {
      background: Colors.lily_white,
      color: Colors.font_gray,
      border: `1px solid ${Colors.font_gray}`,
    },
    SUPERSEDED: {
      background: Colors.lily_white,
      color: Colors.font_gray,
      border: `1px solid ${Colors.font_gray}`,
    },
  }));
  const classes = styles();
  const status = props.dataItem[props.field];

  return (
    <td
      colSpan={props.colSpan}
      style={props.style}
      role="gridcell"
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
