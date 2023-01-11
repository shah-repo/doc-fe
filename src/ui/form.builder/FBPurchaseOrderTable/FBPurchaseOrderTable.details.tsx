import { Box, TableBody, Typography } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import { keys, truncate, values } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { FBMapWrapper, FBPurchaseOrderItem, FBPurchaseOrderModeOptions, FBTableCell, FBTooltip } from "..";
import { ReactComponent as InfoIcon } from "../../../../src/assets/images/information_icon.svg";
import Text from "../../components/Text";
import { FBTableCellStyles } from "../styles/FBTableCell.styles";
import { FBPurchaseOrderDetailsProduct, FBPurchaseOrderTableDetailsProps } from "./FBPurchaseOrderTable.types";
import { FBPurchaseOrderCollection } from "./helpers";


const FBPurchaseOrderTableDetails: React.FunctionComponent<FBPurchaseOrderTableDetailsProps> = ({
  handleDelete,
  handleItem,
  classes,
  items = [],
  loading = false,
  mode,
  calculation,
  isReceivable,
}) => {
  const intl = useIntl();
  const cellStyle = FBTableCellStyles();
  return (

    <Box width="100%" overflow="auto" className={"containing-box-scrollbar"}>
      <Table className={classes?.table}>
        <TableHead>
          {isReceivable && <TableRow>
            {mode === FBPurchaseOrderModeOptions.FORM && (<FBTableCell />)}
            <FBTableCell colSpan={10}>
              <Box display="flex">
                <InfoIcon />
                <Typography className={cellStyle.headerCellText}>
                  <Text translation="receiving.table.header.text" />
                </Typography>
              </Box>
            </FBTableCell>
          </TableRow>}
          <TableRow>
            {mode === FBPurchaseOrderModeOptions.FORM && (<FBTableCell />)}
            <FBMapWrapper<string[]> collection={values(FBPurchaseOrderDetailsProduct)}>
              {(head, index) => (
                <FBTableCell
                  label={head}
                  key={`fb-po-head-${head}-${index}`}
                  className={`${cellStyle.cellFont} ${cellStyle.cellFontWeightLow}`}
                />
              )}
            </FBMapWrapper>
          </TableRow>
        </TableHead>
        <TableBody>
          <FBMapWrapper<FBPurchaseOrderItem[]> collection={items}>
            {(item: FBPurchaseOrderItem, index) => (
              <TableRow
                key={`fb-po-item-${item.id}-${index}`}
                onClick={() => handleItem?.(item)}
                data-cy="poItems"
                className={cellStyle.cell}
              >
                {mode === FBPurchaseOrderModeOptions.FORM && (
                  <FBTableCell>
                    <FBTooltip title="form.builder.delete">
                      <DeleteIcon
                        className="FBIcon-root"
                        fontSize="small"
                        onClick={handleDelete?.(index)}
                      />
                    </FBTooltip>
                  </FBTableCell>
                )}
                <FBMapWrapper<string[]> collection={keys(FBPurchaseOrderCollection[item.type])}>
                  {(key, index) => {
                    let label = item[key];
                    let tooltipTitle: string | undefined;
                    const dataCy = key;
                    if ((!label && key === "partNumberDocId") ||
                      (!label && key === "serviceId") ||
                      (!label && key === "supplierPartNumber")) {
                      label = "N/A";
                    }

                    if (key === "description" && item.type === "product") {
                      key = "partNumberTitle";
                      label = truncate(item[key], { length: 35, omission: " ..." });
                      tooltipTitle = label;
                    }
                    if (key === "unitPrice") {
                      label = intl.formatNumber(item[key] || 0, { style: "currency", currency: calculation?.currency });
                    }
                    return (
                      <React.Fragment  key={`fb-po-item-${key}-${index}`}>
                        {index === 0 &&
                         <TableCell
                           className={`${cellStyle.cellFont} ${cellStyle.cellPadding}`}
                           data-cy = "poItemIndex"
                         >
                           {item.index + 1}
                         </TableCell>}
                        {index > 0 && (
                          <FBTableCell
                            data-cy = {dataCy}
                            loading={key === "received" ? loading : false}
                            {...{ label, tooltipTitle }}
                            className={`${cellStyle.cellFontWeightHigh} ${cellStyle.cellFontWeightLow}
                             ${cellStyle.cellFont} ${cellStyle.cellPadding}
                             ${label < 1 ? cellStyle.cellWithZeroVal : ""}`}
                          />
                        )}
                      </React.Fragment>
                    );
                  }}
                </FBMapWrapper>
              </TableRow>
            )}
          </FBMapWrapper>
        </TableBody>
      </Table>
    </Box>
  );
};

export default FBPurchaseOrderTableDetails;
