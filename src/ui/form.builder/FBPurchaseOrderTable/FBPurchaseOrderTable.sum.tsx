import { Box, TableBody } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import React from "react";
import { FBMapWrapper, FBPurchaseOrderItem, FBPurchaseOrderTableSumProps } from "..";
import Text from "../../components/Text";


const FBPurchaseOrderTableSum: React.FunctionComponent<FBPurchaseOrderTableSumProps> = ({
  handleItem,
  classes,
  items = [],
}) => (
  <Box width="100%">
    <Table className={classes?.table}>
      <TableHead>
        <TableRow>
          <TableCell align="right"><Text message="form.builder.field.tax" /></TableCell>
          <TableCell align="right"><Text message="form.builder.sum" /></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <FBMapWrapper<FBPurchaseOrderItem[]> collection={items}>
          {(item: FBPurchaseOrderItem, index) => (
            <TableRow
              key={`fb-po-item-${item.id}-${index}`}
              onClick={() => handleItem && handleItem(item)}
            >
              <TableCell align="right">
                {item.tax && <CheckBoxIcon className="FBIcon-root" fontSize="small" />}
                {!item.tax && <CheckBoxOutlineBlankIcon className="FBIcon-root" fontSize="small" />}
              </TableCell>
              <TableCell align="right">${item.totalAmount}</TableCell>
            </TableRow>
          )}
        </FBMapWrapper>
      </TableBody>
    </Table>
  </Box>
);

export default FBPurchaseOrderTableSum;
