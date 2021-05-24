import { Box, Button } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
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
import { Redirect } from "react-router-dom";
import Config from "../../../config";
import { GroupTag } from "../../../state/ducks/auth/types";
import { documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { DocumentType } from "../../../state/ducks/documentRevisions/documentType/types";
import Text from "../../components/Text";
import { HOME_URL } from "../../constants/urls";
import useDialog from "../../hooks/useDialog";
import useGetHasTag from "../../hooks/useGetHasTag";
import Colors from "../../layout/theme/utils/colors";
import AddDocumentTypeFormContainer from "../add.document.type/container";
import ExportDAMDetails from "../export.dam.details/exportDAMDetails";
import DocumentTypeFormContainer from "../form/container";

const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(9.5),
    },
    header: {
      height: theme.spacing(7.5),
      fontSize: theme.spacing(2),
      fontWeight: "bold",
    },
    row: {
      height: theme.spacing(6),
      fontSize: theme.spacing(2.5),
      fontWeight: "bold",
      backgroundColor: Colors.light_gray,
    },
    cell: {
      padding: theme.spacing(0),
    },
  },
  ));

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
        <TableCell component="th" scope="row">
          {row.documentTypeName}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className={classes.cell} colSpan={6}>
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
  const dialog = useDialog();
  const exportDAMDialog = useDialog();

  const documentTypes = useSelector(documentTypeSelectors.getDocumentTypeList);
  const canManageDocumentType = useGetHasTag(GroupTag.DOCUMENT_TYPE_MANAGEMENT);

  const disabled = Config.docTypeManagementEditDisabled;

  if (!canManageDocumentType) {
    return <Redirect to={HOME_URL} />;
  }

  return (
    <Box className={classes.root}>
      <Box display="flex" justifyContent="flex-end">
        <Button onClick={dialog.open} variant="outlined" {...{ disabled }}>
          <Text translation={"common.add.document.type"} />
        </Button>
        <Button onClick={exportDAMDialog.open} variant="outlined">
          <Text translation={"common.export.dam.details"} />
        </Button>
      </Box>
      <Table >
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell className={classes.header}>
              <Text translation={"common.document.types"} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortBy(documentTypes, "documentTypeName").map((row) => <Row key={row.id} row={row} />)}
        </TableBody>
      </Table>
      <AddDocumentTypeFormContainer {...{ dialog }}/>
      <ExportDAMDetails dialog={exportDAMDialog} />
    </Box>

  );
};
