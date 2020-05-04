import { Box, TableBody } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import _ from "lodash";
import React from "react";
import { FBMapWrapper, FBPurchaseOrderDetailsHead, FBPurchaseOrderItem, FBPurchaseOrderTableProps, FBTextField, FBTooltip } from "..";
import Text from "../../components/Text";
import { withFBPurchaseOrderTable } from "./FBPurchaseOrderTable.wrap";


const FBPurchaseOrderTable: React.FunctionComponent<FBPurchaseOrderTableProps> = ({
  handleShippingCost,
  handleItem,
  classes,
  calculation,
  disabled,
  items = [],
  name,
}) => (
  <Table className={classes?.table}>
    <TableHead>
      <TableRow>
        <TableCell colSpan={3}>
          <Text message="form.builder.details" />
        </TableCell>
        <TableCell colSpan={2} align="right">
          <Text message="form.builder.field.ext.amount" />
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell colSpan={4}>
          <Box width="100%" overflow="auto">
            <Table className={classes?.tableDetails}>
              <TableHead>
                <TableRow>
                  <FBMapWrapper<string[]> collection={_.values(FBPurchaseOrderDetailsHead)}>
                    {(head, index) => (
                      <TableCell align={(index > 1) ? "right" : "left"} key={`fb-po-head-${head}-${index}`}>
                        <Text message={head} />
                      </TableCell>
                    )}
                  </FBMapWrapper>
                </TableRow>
              </TableHead>
              <TableBody>
                <FBMapWrapper<FBPurchaseOrderItem[]> collection={items}>
                  {(item, index) => (
                    <TableRow
                      key={`fb-po-item-${item.id}-${index}`}
                      onClick={() => handleItem && handleItem(item)}
                    >
                      <FBMapWrapper<string[]> collection={_.keys(FBPurchaseOrderDetailsHead)}>
                        {(key, index) => (
                          <TableCell align={(index > 1) ? "right" : "left"} key={`fb-po-item-${key}-${index}`}>
                            {key === "description" && (
                              <FBTooltip title={item[key]} placement="bottom">
                                <Box>{_.truncate(item[key], { length: 35, omission: " ..." })}</Box>
                              </FBTooltip>
                            )}
                            {key !== "description" && `${key === "unitPrice" ? "$" : ""}${item[key]}`}
                          </TableCell>
                        )}
                      </FBMapWrapper>
                    </TableRow>
                  )}
                </FBMapWrapper>
              </TableBody>
            </Table>
          </Box>
        </TableCell>
        <TableCell>
          <Box width="100%">
            <Table className={classes?.tableDetails}>
              <TableHead>
                <TableRow>
                  <TableCell><Text message="form.builder.field.tax" /></TableCell>
                  <TableCell align="right">
                    <Text message="form.builder.sum" />
                  </TableCell>
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
                        {item.tax && <CheckBoxIcon className="FBCheck-root" fontSize="small" />}
                        {!item.tax && <CheckBoxOutlineBlankIcon className="FBCheck-root" fontSize="small" />}
                      </TableCell>
                      <TableCell align="right">
                        ${item.totalAmount}
                      </TableCell>
                    </TableRow>
                  )}
                </FBMapWrapper>
              </TableBody>
            </Table>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell rowSpan={4} />
        <TableCell rowSpan={4} />
        <TableCell className="FBTotal-root" colSpan={2}>
          <Text message="form.builder.sub.total" />
        </TableCell>
        <TableCell className="FBTotal-root" align="right">
          ${calculation?.subTotal}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="FBTotal-root" colSpan={2}><Text message="form.builder.tax" /></TableCell>
        <TableCell className="FBTotal-root" align="right">${calculation?.tax}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="FBTotal-root" colSpan={2}><Text message="form.builder.shipping.cost" /></TableCell>
        <TableCell className="FBTotal-root" align="right">
          <FBTextField
            name={`${name}.shippingCost`}
            gutter={false}
            variant="standard"
            type="number"
            size="small"
            inputProps={{
              style: { textAlign: "right", padding: "5px" },
              step: ".01",
            }}
            onChange={handleShippingCost}
            {...{ disabled }}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="FBTotal-root" colSpan={2}><Text message="form.builder.total" /></TableCell>
        <TableCell className="FBTotal-root" align="right">${calculation?.totalAmount}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

export default withFBPurchaseOrderTable(FBPurchaseOrderTable);
