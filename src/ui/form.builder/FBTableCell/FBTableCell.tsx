import { Box, CircularProgress, TableCell } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { FBTableCellProps } from ".";
import { FBConditionalWrapper, FBTooltip } from "..";
import Text from "../../components/Text";
import { Translation } from "../../translations/types";

const FBTableCell: React.FunctionComponent<FBTableCellProps> = ({
  label = "",
  tooltipTitle,
  children,
  loading,
  ...props
}) => (
  <TableCell {...props} >
    {loading && (
      <Box component="span" ml={0.5}>
        <CircularProgress size={14} />
      </Box>
    )}
    {!loading && (
      <FBConditionalWrapper
        condition={!_.isUndefined(tooltipTitle)}
        wrapper={(children) => (
          <FBTooltip title={tooltipTitle} placement="bottom">
            <Box component="span">
              {children}
            </Box>
          </FBTooltip>
        )}
      >
        <>
          {label && <Text message={label} translation={label as Translation}/>}
          {children}
        </>
      </FBConditionalWrapper>
    )}
  </TableCell>
);

export default FBTableCell;
