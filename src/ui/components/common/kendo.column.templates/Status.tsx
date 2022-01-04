import { Chip, Grid, makeStyles } from "@material-ui/core";
import React from "react";
import Colors from "../../../layout/theme/utils/colors";
import { statusClassMapping } from "../kendo/helpers";
import { GridCellProperties } from "../kendo/types";

export const Status = (props: GridCellProperties) => {
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
    GREEN_STATUS: {
      background: Colors.carla,
      color: Colors.fruit_salad,
      border: `1px solid ${Colors.fruit_salad_border}`,
    },
    PENDING_STATUS: {
      background: Colors.old_lace,
      color: Colors.tawny,
      border: `1px solid ${Colors.ochre}`,
    },
    GRAY_STATUS: {
      background: Colors.lily_white,
      color: Colors.font_gray,
      border: `1px solid ${Colors.font_gray}`,
    },
  }));
  const classes = styles();
  const status = props.dataItem[props.field || ""];
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
          className={`${classes.chip} ${classes[statusClassMapping[status]]}`}
          label={status}
        />
      </Grid>
    </td>
  );
};
