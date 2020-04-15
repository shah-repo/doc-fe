import { Box, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, withStyles } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import Text from "../../../components/Text";
import Colors from "../../../layout/theme/utils/colors";

interface Props {
  values?: any[];
  disabled?: boolean;
  editItem?: (index: number) => void;
  deleteItem?: (index: number) => void;
}

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: Colors.light_gray,
    color: theme.palette.common.black,
    textTransform: "uppercase",
  },
  body: {
    fontSize: 14,
  },
  root: {
    padding: "8px",
    maxWidth: "100%",
    borderLeft: "1px solid white",
  },
}))(TableCell);

const useStyles = makeStyles({
  root: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    minWidth: 700,
  },
  editable: {
    cursor: "pointer",
  },
});

const FBApprovalMatrixTable: React.FunctionComponent<Props> = ({
  values,
  editItem,
  deleteItem,
  disabled,
}) => {
  const classes = useStyles();
  // const handleEdit = (index) => () => !disabled && editItem(index);
  // const handleDelete = (index) => (e) => {
  //   e.stopPropagation();
  //   !disabled && deleteItem(index);
  // };
  // const [preCalc, setPreCalc] = useState<any[]>([]);
  // useEffect(() => {
  //   if (!values) {
  //     return;
  //   }

  //   const preCalcValues = values.map((value) => ({
  //     ...value,
  //     unitPrice: Number(value.unitPrice || 0).toFixed(2),
  //     amount: (Number(value.unitPrice || 0) * Number(value.order || 0)).toFixed(2),
  //   }));

  //   setPreCalc(preCalcValues);
  // }, [values]);

  const arrayOfGroups = ["QA", "R&D", "Clinical"];

  const renderForEveryApproval = _.times(4, () => arrayOfGroups.map((group, index) => <StyledTableCell align="center" key={index}>
    <Text message={group} />
  </StyledTableCell>));

  return (
    <Box className={classes.root}>
      <Table className={classes.table} aria-label="purchase order table">
        <TableHead>
          <TableRow>
            <StyledTableCell colSpan={4}>
            </StyledTableCell>
            <StyledTableCell align="center" colSpan={arrayOfGroups.length}>
              <Text message="Approvals Alpha" />
            </StyledTableCell>
            <StyledTableCell align="center" colSpan={arrayOfGroups.length}>
              <Text message="Approvals Numeric Alpha" />
            </StyledTableCell>
            <StyledTableCell align="center" colSpan={arrayOfGroups.length}>
              <Text message="Approvals Numeric" />
            </StyledTableCell>
            <StyledTableCell align="center" colSpan={arrayOfGroups.length}>
              <Text message="Approvals Administrative" />
            </StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell align="center">
              <Text message="form.builder.field.prefix" />
            </StyledTableCell>
            <StyledTableCell align="center">
              <Text message="form.builder.field.internal.type" />
            </StyledTableCell>
            <StyledTableCell align="center">
              <Text message="form.builder.field.document.type" />
            </StyledTableCell>
            <StyledTableCell align="center" style={{ borderRight: "1px solid white" }}>
              <Text message="form.builder.field.training.required" />
            </StyledTableCell>
            {renderForEveryApproval}
          </TableRow>
        </TableHead>
        <TableBody>
        </TableBody>
      </Table>
    </Box>
  );
};

export default FBApprovalMatrixTable;
