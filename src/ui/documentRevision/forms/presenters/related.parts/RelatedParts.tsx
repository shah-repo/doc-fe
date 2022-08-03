/* eslint-disable no-console */
import { Grid } from "@material-ui/core";
import { get } from "lodash";
import React, { ChangeEvent } from "react";
import { DocumentRevision } from "../../../../../state/ducks/documentRevisions/types";
import { relatedPartsActions } from "../../../../../state/ducks/relatedParts";
import { RELATED_STATUS } from "../../../../../state/ducks/relatedParts/types";
import { FBButton } from "../../../../form.builder";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";

interface Props {
  documentRevision: DocumentRevision;
  parentPartStatus: RELATED_STATUS | undefined;
}

const RelatedParts: React.FunctionComponent<Props> = ({
  documentRevision,
  parentPartStatus,
}) => {

  const [relatedPartDetails, setRelatedPartDetails] = React.useState({
    docId: "",
    name: "",
  });

  // useEffect(() => {
  //   setRelatedPartDetails({
  //     docId: documentRevision?.document?.docId,
  //     name: documentRevision?.name,
  //   });
  // }, [documentRevision]);

  const createRelatedPartAction = useActionCreator(relatedPartsActions.createRelatedPart);
  const async = useAsync<DocumentRevision>({
    onSuccess: (createdDocumentRevision?) => {
      if (createdDocumentRevision) {
        console.log(createdDocumentRevision);
      }
    },
  });

  const createNewDocument = () => {
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

    if (parentPartStatus === RELATED_STATUS.PARENT_TOGETHER) {
      docDto = {
        ...docDto,
        name: `${documentRevision.name}-${relatedPartDetails.name}`,
        suffixName: relatedPartDetails.name,
        document: { ...docDto.document, docId: `${documentRevision.document.docId}-${relatedPartDetails.docId}` },
      };
    }

    console.log(documentRevision, docDto);
    async.start(createRelatedPartAction, documentRevision.document.id, docDto, async);
  };


  return (
    <div style={{ marginLeft: "24px" }}>
      {parentPartStatus === RELATED_STATUS.PARENT_SEPARATE && (
        <Grid item xs={12}>
          <button onClick = {createNewDocument}>Add Related Part Separate</button>
        </Grid>
      )}
      {parentPartStatus === RELATED_STATUS.PARENT_TOGETHER && (
        <Grid container spacing={2} md={12} sm={12}>
          <Grid item xs={5}>
            <label>{documentRevision?.document?.docId} - </label>
            <input type = "text"
              value = {relatedPartDetails.docId}
              onChange = {(e: ChangeEvent<HTMLInputElement>) =>
                setRelatedPartDetails({ ...relatedPartDetails, docId: e.target.value })} />
          </Grid>
          <Grid item xs={7}>
            <label>{documentRevision?.name} - </label>
            <input type = "text"
              value = {relatedPartDetails.name}
              onChange = {(e: ChangeEvent<HTMLInputElement>) =>
                setRelatedPartDetails({ ...relatedPartDetails, name: e.target.value })} />
          </Grid>
          <FBButton label="Add Related Part Together" onClick = {createNewDocument}></FBButton>
        </Grid>
      )}
    </div>

  );
};

export default RelatedParts;
