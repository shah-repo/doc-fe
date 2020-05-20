import { TableBody } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import React from "react";
import { FBMapWrapper, FBPurchaseOrderItem, FBPurchaseOrderTableSumProps, FBTableCell } from "..";


const FBPurchaseOrderTableSum: React.FunctionComponent<FBPurchaseOrderTableSumProps> = ({
  handleItem,
  classes,
  items = [],
}) => (
  <Table className={classes?.table}>
    <TableHead>
      <TableRow>
        <FBTableCell label="form.builder.field.tax" align="right"  />
        <FBTableCell label="form.builder.sum" align="right"/>
      </TableRow>
    </TableHead>
    <TableBody>
      <FBMapWrapper<FBPurchaseOrderItem[]> collection={items}>
        {(item: FBPurchaseOrderItem, index) => (
          <TableRow
            key={`fb-po-item-${item.id}-${index}`}
            onClick={() => handleItem && handleItem(item)}
          >
            <FBTableCell align="right">
              {item.tax && <CheckBoxIcon className="FBIcon-root" fontSize="small" />}
              {!item.tax && <CheckBoxOutlineBlankIcon className="FBIcon-root" fontSize="small" />}
            </FBTableCell>
            <FBTableCell label={`$${item.totalAmount}`} align="right" />
          </TableRow>
        )}
      </FBMapWrapper>
    </TableBody>
  </Table>
);

export default FBPurchaseOrderTableSum;
