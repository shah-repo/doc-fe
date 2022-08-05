/* eslint-disable no-console */
import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { get } from "lodash";
import React, { ChangeEvent, useEffect, useState } from "react";
import { DocumentRevision } from "../../../../../state/ducks/documentRevisions/types";
import { relatedPartsActions } from "../../../../../state/ducks/relatedParts";
import { RELATED_STATUS } from "../../../../../state/ducks/relatedParts/types";
import { FBButton } from "../../../../form.builder";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";

import AddCircleIcon from "@material-ui/icons/AddCircle";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
// import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import InfoIcon from "@material-ui/icons/Info";

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
      <FormControl>
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
            Is this a parent part?
          <Tooltip title="Parent part info" arrow>
            <InfoIcon color="primary" />
          </Tooltip>
        </Typography>

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
            label="Yes, Child Released Seperately"
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

  const AddRelatedPartHandler = () => {
    setVisible([...visible, { show: "" }]);
  };

  return (
    <>
      <Grid style={{ justifyContent: "space-between" }} container>
        <Grid item>
          <Typography variant="h6" id="tableTitle" component="div">
            Related Parts
          </Typography>
        </Grid>

        <Grid item>
          <Typography>
            <Button
              color="primary"
              startIcon={<AddCircleIcon color="primary" />}
              onClick={AddRelatedPartHandler}
            >
              Add Related part
            </Button>
          </Typography>
        </Grid>
      </Grid>
      <div>
        <div className={classes.mainDiv}>
          <div style={{ paddingLeft: "10%" }}>DOC ID</div>
          <div>TITLE</div>
          <div style={{ paddingRight: "10%" }}>OBSELETE</div>
        </div>
        {visible.map((singleShow, index) => index > 0 && singleShow &&
          <RelatedPartEditRow documentRevision={documentRevision} createNewDocument={createNewDocument} key={index} />)}
        {
          <Button
            className={classes.fulllengthButton}
            variant="outlined"
            color="primary"
            startIcon={<AddOutlinedIcon />}
            onClick={AddRelatedPartHandler}
          >
            ADD RELATED PART
          </Button>
        }
      </div>
      <Divider />
    </>
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
    <div className={classes.mainDiv1}>
      <div className={classes.itemSpace}>
        <label>{documentRevision?.document?.docId} - </label>
        <TextField
          variant="outlined"
          onChange = {(e: ChangeEvent<HTMLInputElement>) =>
            setRelatedPartDetails({ ...relatedPartDetails, docId: e.target.value })}
          // onBlur={(e: any) => validateInputHandler}
          value={relatedPartDetails.docId}
        />
      </div>
      <div>
        <label>{documentRevision?.name} - </label>
        <TextField
          variant="outlined"
          value = {relatedPartDetails.name}
          onChange = {(e: ChangeEvent<HTMLInputElement>) =>
            setRelatedPartDetails({ ...relatedPartDetails, name: e.target.value })}/>
      </div>
      <div>
        <span>
          <FBButton label="Add Related Part Together" onClick = {(e) => createNewDocument(relatedPartDetails)}
            color="primary" variant="outlined" startIcon={<DoneIcon />}></FBButton>
        </span>
      </div>
    </div>
  );
};


const RelatedParts: React.FunctionComponent<Props> = ({
  documentRevision,
  parentPartStatus,
}) => {

  const [parentStatus, setParentStatus] = useState(parentPartStatus);

  const createRelatedPartAction = useActionCreator(relatedPartsActions.createRelatedPart);
  const async = useAsync<DocumentRevision>({
    onSuccess: (createdDocumentRevision?) => {
      if (createdDocumentRevision) {
        console.log(createdDocumentRevision);
      }
    },
  });

  const createParentPartChoiceAction = useActionCreator(relatedPartsActions.parentPartChoiceAction);
  const async1 = useAsync<any>({
    onSuccess: (data) => {
      if (data) {
        console.log(data);
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

    console.log(documentRevision, docDto);
    async.start(createRelatedPartAction, documentRevision.document.id, docDto, async);
  };


  const parentStatusChanged = (value) => {
    setParentStatus(value);

    // Make an API call to persist the parent row.
    if (value) {
      async1.start(createParentPartChoiceAction, {
        documentId: documentRevision.documentId,
        rootDocId: documentRevision.document?.docId,
        relatedStatus: value,
      }, async1);
    }
  };


  return (
    <>
      {documentRevision.relatedStatus !== RELATED_STATUS.RELATED_SEPARATE &&
      documentRevision.relatedStatus !== RELATED_STATUS.RELATED_TOGETHER &&
      <div style={{ marginLeft: "12px" }}>
        <ParentPartSelector status={parentStatus}  parentStatusChanged={parentStatusChanged} />
        {parentStatus === RELATED_STATUS.PARENT_SEPARATE && (
          <Grid item xs={12}>
            <FBButton label="Add Related Part Separate" onClick = {createNewDocument}></FBButton>
          </Grid>
        )}
        {parentStatus === RELATED_STATUS.PARENT_TOGETHER && (
          <RelatedPartGrid documentRevision={documentRevision} createNewDocument={createNewDocument} />
        )}
      </div>}
    </>
  );
};

export default RelatedParts;
