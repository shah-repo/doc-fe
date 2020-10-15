import { Box, Button } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { sortBy } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { DocumentType, documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import useDialog from "../../hooks/useDialog";
import Colors from "../../layout/theme/utils/colors";
import AddDocumentTypeFormContainer from "../add.document.type/container";
import DocumentTypeFormContainer from "../form/container";

const styles = makeStyles({
  root: {
    margin: "75px",
  },
  header: {
    height: "60px",
    fontSize: "16px",
    fontWeight: "bold",
  },
  row: {
    height: "50px",
    fontSize: "14px",
    fontWeight: "bold",
    backgroundColor: Colors.light_gray,
  },
});

function Row(props: { row: DocumentType }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = styles();

  return (
    <React.Fragment>
      <TableRow className={classes.row}>
        <TableCell >
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell   component="th" scope="row">
          {row.documentTypeName}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <DocumentTypeFormContainer documentType={row}/>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}


export const DocumentTypeManagementContainer: React.FunctionComponent = () => {
  const classes = styles();
  const documentTypes = useSelector(documentTypeSelectors.getDocumentTypeList);
  const dialog = useDialog();

  return (
    <Box className={classes.root}>
      <Box display="flex" justifyContent="flex-end">
        <Button onClick={dialog.open} variant="outlined">
          Add Document Type
        </Button>
      </Box>
      <Table >
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell className={classes.header}> Document types </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortBy(documentTypes, "documentTypeName").map((row) => <Row key={row.id} row={row} />)}
        </TableBody>
      </Table>
      <AddDocumentTypeFormContainer {...{ dialog }}/>
    </Box>

  );
};
