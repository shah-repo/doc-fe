import { Box, CircularProgress, TableCell } from "@material-ui/core";
import { isUndefined } from "lodash";
import React from "react";
import { FBTableCellProps } from ".";
import { FBConditionalWrapper, FBTooltip } from "..";
import Text from "../../components/Text";

const FBTableCell: React.FunctionComponent<FBTableCellProps> = ({
  label = "",
  tooltipTitle,
  children,
  loading,
  dataCy,
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
        condition={!isUndefined(tooltipTitle)}
        wrapper={(children) => (
          <FBTooltip title={tooltipTitle} placement="bottom">
            <Box component="span">
              {children}
            </Box>
          </FBTooltip>
        )}
      >
        <>
          {label && dataCy && <Text dataCy={dataCy} message={label} />}
          {label && !dataCy && <Text message={label} />}
          {children}
        </>
      </FBConditionalWrapper>
    )}
  </TableCell>
);

export default FBTableCell;
