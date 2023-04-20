import { Chip, Grid } from "@material-ui/core";
import { get } from "lodash";
import * as React from "react";
import Tooltip from "../../../../components/common/kendo/Tooltip";
import { CustomGridCellProps } from "../../../../components/common/kendo/types";
import { styles } from "./SignatureCellTemplate.styles";

export const SignatureCellTemplate = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
}: CustomGridCellProps) => {
  const classes = styles();
  const values = JSON.parse( get(dataItem, field || "") || "[]");
  const cellClickEvent = () => {
    if (!cellRowClick) { return; }
    cellRowClick({ dataItem });
  };

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
      onClick={cellClickEvent}
    >
      <Grid
        container
        direction="row"
        alignContent="flex-start"
        justify="flex-start"
        className={classes.container}
      >
        {values?.map((value) => (<CustomChip {...{ value, classes }} />))}
      </Grid>
    </td>
  );
};

const CustomChip = ({ value, classes }) => {
  const [dimensions, setDimensions] = React.useState({ scrollWidth: 0, clientWidth: 0 });
  const chipRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (chipRef?.current?.firstChild) {
      const { scrollWidth, clientWidth } = chipRef?.current?.firstChild as HTMLSpanElement;
      setDimensions({ scrollWidth, clientWidth });
    }
  }, [chipRef]);

  return (<Tooltip
    className={classes.chipContainer}
    data={value}
    showTooltip={dimensions.scrollWidth > dimensions.clientWidth}
    childrenElement={
      <Chip
        size="small"
        className={classes.chip}
        label={value}
        ref={chipRef}
      />
    }
  />);
};
