import { Button, TableBody } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import React from "react";
import { FormattedNumber } from "react-intl";
import { FBMapWrapper, FBPurchaseOrderItem, FBTableCell } from "..";
import Text from "../../components/Text";
import { FBButtonStyles } from "../styles/FBButton.styles";
import { FBTableCellStyles } from "../styles/FBTableCell.styles";
import { FBPurchaseOrderTableSumProps } from "./FBPurchaseOrderTable.types";


const FBPurchaseOrderTableSum: React.FunctionComponent<FBPurchaseOrderTableSumProps> = ({
  handleItem,
  handleLot,
  classes,
  items = [],
  calculation,
  mode,
}) => {
  const cellStyle = FBTableCellStyles();
  const buttonStyles = FBButtonStyles();
  return (
    <Table className={classes?.table}>
      <TableHead>
        <TableRow>
          {mode === "preview" && <FBTableCell />}
          {mode !== "preview" && <FBTableCell label="form.builder.field.tax" align="right"
            className={`${cellStyle.cellFont} ${cellStyle.cellFontWeightLow}`}
          />}
          {mode !== "preview" && <FBTableCell label="form.builder.sum" align="right"
            className={`${cellStyle.cellFont} ${cellStyle.cellFontWeightLow}`}
          />}
        </TableRow>
      </TableHead>
      <TableBody>
        <FBMapWrapper<FBPurchaseOrderItem[]> collection={items}>
          {(item: FBPurchaseOrderItem, index) => (
            <TableRow
              key={`fb-po-item-${item.id}-${index}`}
              onClick={() => handleItem && handleItem(item)}
            >
              {mode === "preview" && !(item?.type === "service") &&
                <FBTableCell align="right">
                  <Button
                    variant="contained"
                    className={buttonStyles.button}
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
};

export default FBPurchaseOrderTableSum;
