import { Button } from "@material-ui/core";
import { TableBody } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import React from "react";
import Text from "../../components/Text";
import { FormattedNumber } from "react-intl";
import { FBMapWrapper, FBPurchaseOrderItem, FBTableCell } from "..";
import { FBPurchaseOrderTableSumProps } from "./FBPurchaseOrderTable.types";


const FBPurchaseOrderTableSum: React.FunctionComponent<FBPurchaseOrderTableSumProps> = ({
  handleItem,
  handleLot,
  classes,
  items = [],
  calculation,
  mode,
}) => (
  <Table className={classes?.table}>
    <TableHead>
      <TableRow>
        {mode === "preview" && <FBTableCell />}
        {mode !== "preview" && <FBTableCell label="form.builder.field.tax" align="right"/>}
        {mode !== "preview" && <FBTableCell label="form.builder.sum" align="right"/>}
      </TableRow>
    </TableHead>
    <TableBody>
      <FBMapWrapper<FBPurchaseOrderItem[]> collection={items}>
        {(item: FBPurchaseOrderItem, index) => (
          <TableRow
            key={`fb-po-item-${item.id}-${index}`}
            onClick={() => handleItem && handleItem(item)}
          >
            {mode === "preview" &&
              <FBTableCell align="right">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => handleLot && handleLot(e, item)}>
                  <Text translation="form.builder.po.create.a.lot" />
                </Button>
              </FBTableCell>
            }
            {mode !== "preview" &&
              <FBTableCell align="right">
                {item.tax && <CheckBoxIcon className="FBIcon-root" fontSize="small" />}
                {!item.tax && <CheckBoxOutlineBlankIcon className="FBIcon-root" fontSize="small" />}
              </FBTableCell>
            }
            {mode !== "preview" &&
              <FBTableCell align="right" data-cy="poSum" >
                <FormattedNumber
                  value={Number(item.totalAmount)}
                  // eslint-disable-next-line react/style-prop-object
                  style="currency"
                  currency={calculation?.currency}
                />
              </FBTableCell>
            }
          </TableRow>
        )}
      </FBMapWrapper>
    </TableBody>
  </Table>
);

export default FBPurchaseOrderTableSum;
