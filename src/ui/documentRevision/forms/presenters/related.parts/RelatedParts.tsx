/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid, Link, Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";

import cx from "classnames";
import React, { ChangeEvent, useEffect, useState } from "react";
import { DocumentRevision, DocumentRevisionStatus } from "../../../../../state/ducks/documentRevisions/types";
import { relatedPartsActions } from "../../../../../state/ducks/relatedParts";
import { RelatedPartsListItem, RELATED_STATUS } from "../../../../../state/ducks/relatedParts/types";
import { FBButton } from "../../../../form.builder";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";

import { toastSuccess } from "../../../../../ui/components/notifications/index";

import AddCircleIcon from "@material-ui/icons/AddCircle";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import InfoIcon from "@material-ui/icons/Info";
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye";

import { get } from "lodash";
import { styles } from "./RelatedPart.styles";

interface Props {
  documentRevision: DocumentRevision;
  parentPartStatus: RELATED_STATUS | undefined;
}


const ParentPartSelector: React.FunctionComponent<{
  status: RELATED_STATUS | undefined;
  parentStatusChanged: (value: string) => void;
}> = ({
  status,
  parentStatusChanged,
}) => {
  const [disable, setDisable] = useState({
    disable1: false,
    disable2: false,
    disable3: false,
  });

  const classes = styles();

  useEffect(() => {
    disableOptions(status as string);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const disableOptions = (value: string) => {
    switch (value) {
      case RELATED_STATUS.PARENT_NO:
        setDisable({ disable1: false, disable2: true, disable3: true });
        break;
      case RELATED_STATUS.PARENT_TOGETHER:
        setDisable({ disable1: true, disable2: false, disable3: true });
        break;
      case RELATED_STATUS.PARENT_SEPARATE:
        setDisable({ disable1: true, disable2: true, disable3: false });
        break;
      default:
        break;
    }
  };

  const parentStatusHandler = (
    value: string
  ) => {
    disableOptions(value);
    parentStatusChanged(value);
  };

  return (
    <div>
      <div className={classes.title}>
        <Typography
          className={classes.titleHeading}
          variant="h6"
          id="tableTitle"
        >
          Is this a parent part?
        </Typography>
        <Tooltip title="Parent part info" placement="right"
          classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }}
          arrow>
          <InfoIcon color="primary" />
        </Tooltip>
      </div>
      <FormControl className={classes.formControlPad}>
        <RadioGroup row value={status} onChange={(e) => parentStatusHandler(e.target.value)}>
          <FormControlLabel
            value={RELATED_STATUS.PARENT_NO}
            control={<Radio color="primary" disableRipple={true} />}
            label="No"
            disabled={disable.disable1}
          />
          <FormControlLabel
            value={RELATED_STATUS.PARENT_TOGETHER}
            control={<Radio color="primary" disableRipple={true} />}
            label="Yes, Child Released Together"
            disabled={disable.disable2}
          />
          <FormControlLabel
            value={RELATED_STATUS.PARENT_SEPARATE}
            control={<Radio color="primary" disableRipple={true} />}
            label="Yes, Child Released Separately"
            disabled={disable.disable3}
          />
        </RadioGroup>
      </FormControl>
    </div>
  );

};


const RelatedPartGrid: React.FunctionComponent<{
  documentRevision: DocumentRevision;
  createNewDocument: (details? : {docId: string; name: string}) => void;
}> = ({
  documentRevision,
  createNewDocument,
}) => {
  const classes = styles();

  const [visible, setVisible] = useState([{ show: "" }]);
  const [showButton, setShowButton] = useState(true);
  const [relatedPartsList, setRelatedPartsList] = useState<RelatedPartsListItem[]>([]);

  const fetchAllRelatedPartsAction = useActionCreator(relatedPartsActions.fetchAllRelatedParts);
  const fetchRelatedPartsAsync = useAsync({
    onSuccess: (relatedPartsList) => {
      console.log(relatedPartsList);
      setRelatedPartsList(relatedPartsList as RelatedPartsListItem[]);
    },
  });

  const addRelatedPartHandler = () => {
    setVisible([...visible, { show: "" }]);
    setShowButton(false);
  };

  useEffect(() => {
    fetchRelatedPartsAsync.start(fetchAllRelatedPartsAction, documentRevision.document.id, fetchRelatedPartsAsync);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const voidRelatedPart = (listItem) => {
    console.log(listItem);
  };

  return (
    <div className={classes.formControlPad}>
      <div>
        <Grid style={{ justifyContent: "space-between", alignItems: "center" }} container>
          <Grid item>
            <Typography variant="h6" id="tableTitle" component="div">
                Related Parts
            </Typography>
          </Grid>

          { showButton &&
              <Grid item>
                <Typography>
                  <Button
                    className={classes.btnMargin}
                    color="primary"
                    startIcon={<AddCircleIcon color="primary" />}
                    onClick={addRelatedPartHandler}
                  >
                    Add Related part
                  </Button>
                </Typography>
              </Grid>
          }
        </Grid>
        <Divider className={classes.dividerStyle} />
      </div>
      <div>
        <RelatedPartList list={relatedPartsList} voidRelatedPart = {voidRelatedPart}></RelatedPartList>
        {visible.map((singleShow, index) => index > 0 && singleShow &&
            <RelatedPartEditRow documentRevision={documentRevision}
              createNewDocument={createNewDocument} key={index} />)}
        {
          showButton && <Button
            className={classes.fullLengthButton}
            variant="outlined"
            startIcon={<AddOutlinedIcon />}
            onClick={addRelatedPartHandler}
          >
              ADD RELATED PART
          </Button>
        }
      </div>
    </div>
  );
};


const RelatedPartList: React.FunctionComponent<{
  list: RelatedPartsListItem[];
  voidRelatedPart: (listItem: RelatedPartsListItem) => void;
}> = ({
  list,
  voidRelatedPart,
}) => {
  const classes = styles();
  return (
    <div className={classes.fullWidth}>
      <Table stickyHeader aria-label="related parts table">
        <TableHead className={classes.tableHeadHeight}>
          <TableRow>
            <TableCell className={cx(classes.tabelCell, classes.tableCellOne)} align="left">DOC ID</TableCell>
            <TableCell className={classes.tabelCell} align="left">
              <span className={classes.verticalDivider}>TITLE</span>
            </TableCell>
            <TableCell className={cx(classes.tabelCell, classes.tableCellThree)} align="center">
              <span className={classes.verticalDivider}>OBSOLETE</span>
            </TableCell>
            <TableCell className={cx(classes.tabelCell, classes.tableCellFour)} align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((listItem: RelatedPartsListItem) => (
            <RelatedPartViewRow listItem={listItem} voidRelatedPart={voidRelatedPart}
              key={listItem.documentRevisionId}/>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};


const RelatedPartViewRow: React.FunctionComponent<{
  listItem: RelatedPartsListItem;
  voidRelatedPart: (listItem: RelatedPartsListItem) => void;
}> = ({
  listItem,
  voidRelatedPart,
}) => {
  const isVoided = listItem.status === DocumentRevisionStatus.Obsolete
  || listItem.status === DocumentRevisionStatus.Voided;
  return (
    <TableRow hover key={listItem.documentRevisionId}>
      <TableCell align="left">
        {listItem.rootDocId}
      </TableCell>
      <TableCell align="left">
        {listItem.name}
      </TableCell>
      <TableCell align="center">
        <Checkbox
          checked={isVoided}
          disabled={isVoided}
          onChange={(e) => voidRelatedPart(listItem)}
        />
      </TableCell>
      <TableCell align="center">
        <RemoveRedEyeIcon color="primary"></RemoveRedEyeIcon>
      </TableCell>
    </TableRow>
  );
};

const RelatedPartEditRow: React.FunctionComponent<{
  documentRevision: DocumentRevision;
  createNewDocument: (details? : {docId: string; name: string}) => void;
}> = ({
  documentRevision,
  createNewDocument,
}) => {
  const [relatedPartDetails, setRelatedPartDetails] = React.useState({
    docId: "",
    name: "",
  });
  // const [inputValue, setInputValue] = useState<any[]>([]);

  // const readingValueHandler = (event: React.FocusEvent<HTMLInputElement>) => {
  //   setInputValue((prevInputValue) => [...prevInputValue, event.target.name]);
  // };

  const classes = styles();

  return (
    <>
      <div className={classes.editRowParentDiv}>
        <div className={classes.editRowChildDivOne}>
          <label >{documentRevision?.document?.docId} - </label>
          <TextField
            className={classes.textField}
            variant="outlined"
            onChange = {(e: ChangeEvent<HTMLInputElement>) =>
              setRelatedPartDetails({ ...relatedPartDetails, docId: e.target.value })}
            value={relatedPartDetails.docId}
          />
        </div>
        <div
          className={classes.editRowChildDivTwo}>
          <label>{documentRevision?.name} - </label>
          <TextField
            className={classes.textField}
            variant="outlined"
            value = {relatedPartDetails.name}
            onChange = {(e: ChangeEvent<HTMLInputElement>) =>
              setRelatedPartDetails({ ...relatedPartDetails, name: e.target.value })}/>
        </div>
      </div>
      <div className={classes.actionButtonParentDiv}>
        <div className={classes.actionButtonChildDiv}>
          <Button className={classes.actionButton}>
            <ClearIcon className={classes.iconButton}/>
          </Button>
          <Button className={classes.actionButton}
            onClick = {(e) => createNewDocument(relatedPartDetails)}>
            <DoneIcon className={classes.iconButton} />
          </Button>
        </div>
      </div>
    </>
  );
};


const RelatedParts: React.FunctionComponent<Props> = ({
  documentRevision,
  parentPartStatus,
}) => {

  const classes = styles();
  const [parentStatus, setParentStatus] = useState(parentPartStatus);

  const createRelatedPartAction = useActionCreator(relatedPartsActions.createRelatedPart);
  const createPartAsync = useAsync({
    onSuccess: (createdDocumentRevision?) => {
      if (createdDocumentRevision) {
        console.log(createdDocumentRevision);
        if (parentStatus === RELATED_STATUS.PARENT_SEPARATE) {
          showSuccessToast(createdDocumentRevision as DocumentRevision, viewRelatedPart);
        } else if (parentStatus === RELATED_STATUS.PARENT_TOGETHER) {
          // Change the view row to edit row.

        }
      }
    },
  });

  const showSuccessToast = (
    docRevision: DocumentRevision,
    viewRelatedPart: (docRevision) => void) => {

    toastSuccess(<SuccessMsg docId={docRevision.document.docId}
      viewRelatedPart={viewRelatedPart} documentRevisionId={docRevision.id}/>, {
      closeButton: false,
    });
  };

  const createParentPartChoiceAction = useActionCreator(relatedPartsActions.parentPartChoiceAction);
  const parentChoiceAsync = useAsync<any>({
    onSuccess: (data) => {
      if (data) {
        setParentStatus(data);
      }
    },
  });

  const createNewDocument = (relatedPartDetails?) => {
    let docDto = {
      formDocument: {
        id: get(documentRevision, "formDocumentId"),
      },
      description: "",
      name: "",
      suffixName: "",
      attachments: [],
      referenceTo: [],
      revisionChangeType: get(documentRevision, "revisionChangeType"),
      document: {
        docId: "",
        securityList: {
          securityEmployees: (get(documentRevision, "document.securityEmployees") || [])
            .map((employee) => ({ id: employee.value })),
          securityGroups: (get(documentRevision, "document.securityGroups") || [])
            .map((group) => ({ id: group.id })),
          operators: get(documentRevision, "document.operators"),
        },
        documentType: {
          id: get(documentRevision, "document.documentType.id"),
        },
      },
    };

    if (parentStatus === RELATED_STATUS.PARENT_TOGETHER) {
      docDto = {
        ...docDto,
        name: `${documentRevision.name}-${relatedPartDetails?.name}`,
        suffixName: relatedPartDetails?.name,
        document: { ...docDto.document, docId: `${documentRevision.document.docId}-${relatedPartDetails?.docId}` },
      };
    }

    // console.log(documentRevision, docDto);
    createPartAsync.start(createRelatedPartAction, documentRevision.document.id, docDto, createPartAsync);
  };


  const parentStatusChanged = (value) => {
    // setParentStatus(value);

    // Make an API call to persist the parent row.
    if (value) {
      parentChoiceAsync.start(createParentPartChoiceAction, {
        documentId: documentRevision.documentId,
        rootDocId: documentRevision.document?.docId,
        relatedStatus: value,
      }, parentChoiceAsync);
    }
  };


  const viewRelatedPart = (docRevisionId: string) => {
    console.log(docRevisionId);
  };


  return (
    <>
      {documentRevision.relatedStatus !== RELATED_STATUS.RELATED_SEPARATE &&
      documentRevision.relatedStatus !== RELATED_STATUS.RELATED_TOGETHER &&
      <div className={classes.mainDiv}>
        <ParentPartSelector status={parentStatus}  parentStatusChanged={parentStatusChanged} />
        {parentStatus === RELATED_STATUS.PARENT_SEPARATE && (
          <Grid item xs={12}>
            <FBButton label="Add Related Part" onClick = {createNewDocument}></FBButton>
          </Grid>
        )}
        {parentStatus === RELATED_STATUS.PARENT_TOGETHER && (
          <RelatedPartGrid documentRevision={documentRevision} createNewDocument={createNewDocument} />
        )}
      </div>}
    </>
  );
};


const SuccessMsg: React.FunctionComponent<{
  docId: string;
  documentRevisionId: string;
  viewRelatedPart: (documentRevisionId: string) => void;
}> = ({
  docId,
  documentRevisionId,
  viewRelatedPart,
}) => {
  const classes = styles();
  return (
    <>
      <Typography variant="body1">
          Related Part created successfully
      </Typography>
      <div className={classes.successMessage}>
        <Typography variant="subtitle1">
            Part <b>{docId}</b> has been created
        </Typography>
        <Link onClick={(event) => viewRelatedPart(documentRevisionId)} tabIndex={0} style={{ fontWeight: "normal" }}
          variant="subtitle1" color="textSecondary">
              View
        </Link>
      </div>
    </>
  );
};

export default RelatedParts;
