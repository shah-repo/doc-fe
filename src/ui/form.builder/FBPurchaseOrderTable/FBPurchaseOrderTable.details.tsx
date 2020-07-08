import { Box, TableBody } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import _ from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { FBMapWrapper, FBPurchaseOrderDetailsHead, FBPurchaseOrderItem, FBPurchaseOrderTableDetailsProps, FBTableCell, FBTooltip } from "..";


const FBPurchaseOrderTableDetails: React.FunctionComponent<FBPurchaseOrderTableDetailsProps> = ({
  handleDelete,
  handleItem,
  classes,
  items = [],
  loading = false,
  mode,
  calculation,
}) => {
  const intl = useIntl();
  return (
    <Box width="100%" overflow="auto">
      <Table className={classes?.table}>
        <TableHead>
          <TableRow>
            <FBTableCell />
            <FBMapWrapper<string[]> collection={_.values(FBPurchaseOrderDetailsHead)}>
              {(head, index) => (
                <FBTableCell
                  label={head}
                  key={`fb-po-head-${head}-${index}`}
                  align={(index > 2) ? "right" : "left"}
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
                onClick={() => handleItem && handleItem(item)}
              >
                <FBTableCell align="right">
                  {mode === "form" && (
                    <FBTooltip title="form.builder.delete">
                      <DeleteIcon
                        className="FBIcon-root"
                        fontSize="small"
                        onClick={handleDelete && handleDelete(index)}
                      />
                    </FBTooltip>
                  )}
                </FBTableCell>
                <FBMapWrapper<string[]> collection={_.keys(FBPurchaseOrderDetailsHead)}>
                  {(key, index) => {
                    let label = item[key];
                    let tooltipTitle: string | undefined;
                    if (key === "description") {
                      key = "partNumberTitle";
                      label = _.truncate(item[key], { length: 35, omission: " ..." });
                      tooltipTitle = label;
                    }
                    if (key === "unitPrice") {
                      label = intl.formatNumber(item[key] || 0, { style: "currency", currency: calculation?.currency });
                    }
                    return (
                      <React.Fragment  key={`fb-po-item-${key}-${index}`}>
                        {index === 0 && <TableCell>{item.index + 1}</TableCell>}
                        {index > 0 && (
                          <FBTableCell
                            align={(index > 2) ? "right" : "left"}
                            loading={key === "received" ? loading : false}
                            {...{ label, tooltipTitle }}
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
