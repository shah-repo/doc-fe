import { Box, TableBody } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import _ from "lodash";
import React from "react";
import { FBMapWrapper, FBPurchaseOrderDetailsHead, FBPurchaseOrderItem, FBPurchaseOrderTableDetailsProps, FBTooltip } from "..";
import Text from "../../components/Text";


const FBPurchaseOrderTableDetails: React.FunctionComponent<FBPurchaseOrderTableDetailsProps> = ({
  handleDelete,
  handleItem,
  classes,
  items = [],
}) => (
  <Box width="100%" overflow="auto">
    <Table className={classes?.table}>
      <TableHead>
        <TableRow>
          <TableCell />
          <FBMapWrapper<string[]> collection={_.values(FBPurchaseOrderDetailsHead)}>
            {(head, index) => (
              <TableCell
                key={`fb-po-head-${head}-${index}`}
                align={(index > 1) ? "right" : "left"}
              >
                <Text message={head} />
              </TableCell>
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
              <TableCell align="right">
                <FBTooltip title="form.builder.delete">
                  <DeleteIcon
                    className="FBIcon-root"
                    fontSize="small"
                    onClick={handleDelete && handleDelete(index)}
                  />
                </FBTooltip>
              </TableCell>
              <FBMapWrapper<string[]> collection={_.keys(FBPurchaseOrderDetailsHead)}>
                {(key, index) => (
                  <>
                    {index === 0 && <TableCell>{index + 1}</TableCell>}
                    {index > 0 && (
                      <TableCell
                        key={`fb-po-item-${key}-${index}`}
                        align={(index > 1) ? "right" : "left"}
                      >
                        {key === "description" && (
                          <FBTooltip title={item[key]} placement="bottom">
                            <Box>
                              {_.truncate(item[key], { length: 35, omission: " ..." })}
                            </Box>
                          </FBTooltip>
                        )}
                        {key !== "description" && `${key === "unitPrice" ? "$" : ""}${item[key]}`}
                      </TableCell>
                    )}
                  </>
                )}
              </FBMapWrapper>
            </TableRow>
          )}
        </FBMapWrapper>
      </TableBody>
    </Table>
  </Box>
);

export default FBPurchaseOrderTableDetails;
