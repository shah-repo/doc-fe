import { Grid } from "@material-ui/core";
import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { AsyncState } from "../../../state/types";
import DocRevActions from "../../documentRevision/forms/presenters/Actions";
import { DocumentRevisionFormValues } from "../../documentRevision/forms/types";
import DocumentListInfo from "./DocumentListInfo";
import Header from "./Header";

interface Props {
  canChangeOwnerShip: boolean;
  values: DocumentRevisionFormValues;

  documentRevision: DocumentRevision;
  asyncState: AsyncState;
  isDisabled: boolean;
  docInfo: any;

}

const FormHeaderPresenter: React.FunctionComponent<Props> = ({
  canChangeOwnerShip,
  values,
  documentRevision,
  asyncState,
  isDisabled,
  docInfo,
}) => (
  <Header>
    {documentRevision && <DocumentListInfo documentRevision={documentRevision} />}
    <Grid item={true} xs={isDisabled ? 6 : 12} justify="flex-end">
      <Grid container={true} alignItems="flex-end" justify="flex-end">
        <DocRevActions
          {...{
            documentRevision,
            values,
            docInfo,
            asyncState,
            canChangeOwnerShip,
          }}
        />
      </Grid>
    </Grid>
  </Header>
);

export default FormHeaderPresenter;
