import { Box, TableBody } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import _ from "lodash";
import React from "react";
import { FBMapWrapper, FBPurchaseOrderDetailsHead, FBPurchaseOrderItem, FBPurchaseOrderTableProps, FBTextField } from "..";
import Text from "../../components/Text";
import { withFBPurchaseOrderTable } from "./FBPurchaseOrderTable.wrap";


const FBPurchaseOrderTable: React.FunctionComponent<FBPurchaseOrderTableProps> = ({
  handleShippingCost,
  classes,
  calculation,
  items = [],
}) => (
  <Table className={classes?.table}>
    <TableHead>
      <TableRow>
        <TableCell colSpan={4}>
          <Text message="form.builder.details" />
        </TableCell>
        <TableCell align="right">
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
                    <TableRow key={`fb-po-item-${item.id}-${index}`}>
                      <FBMapWrapper<string[]> collection={_.keys(FBPurchaseOrderDetailsHead)}>
                        {(key, index) => (
                          <TableCell align={(index > 1) ? "right" : "left"} key={`fb-po-item-${key}-${index}`}>
                            {item[key]}
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
                  <TableCell align="right">
                    <Text message="form.builder.sum" />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <FBMapWrapper<FBPurchaseOrderItem[]> collection={items}>
                  {(item: FBPurchaseOrderItem, index) => (
                    <TableRow key={`fb-po-item-${item.id}-${index}`}>
                      <TableCell align="right">
                        {item.totalAmount}
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
          {calculation?.subTotal}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="FBTotal-root" colSpan={2}><Text message="form.builder.tax" /></TableCell>
        <TableCell className="FBTotal-root" align="right">{calculation?.tax}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="FBTotal-root" colSpan={2}><Text message="form.builder.shipping.cost" /></TableCell>
        <TableCell className="FBTotal-root" align="right">
          <FBTextField
            gutter={false}
            variant="standard"
            type="number"
            size="small"
            inputProps={{
              style: { textAlign: "right", fontSize: 16, padding: "5px" },
              step: ".01",
            }}
            onChange={handleShippingCost}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="FBTotal-root" colSpan={2}><Text message="form.builder.total" /></TableCell>
        <TableCell className="FBTotal-root" align="right">{calculation?.totalAmount}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

export default withFBPurchaseOrderTable(FBPurchaseOrderTable);
