import { Button, Grid } from "@material-ui/core";
import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { AsyncState } from "../../../state/types";
import OwnerChangerContainer from "../../components/common/owner.changer/container";
import { RequestType } from "../../components/common/owner.changer/helpers/types";
import SubmitButton from "../../components/forms/SubmitButton";
import Text from "../../components/Text";
import ApproveAndRelease from "../../documentRevision/forms/presenters/ApproveAndRelease";
import UpgradeToLatest from "../../documentRevision/forms/presenters/UpgradeToLatest";
import { DocumentRevisionFormValues } from "../../documentRevision/forms/types";
import DocumentListInfo from "./DocumentListInfo";
import Header from "./Header";
import HeaderMenu from "./Menu";

interface Props {
  canShowCancelButton: boolean;
  handleCancelDraft: () => void;
  canChangeOwnerShip: boolean;
  values: DocumentRevisionFormValues;
  isFormStatusDeprecated: boolean;
  isDocumentStatusDraftOrPending: boolean;
  isLastVersionObsolete: boolean;
  documentRevision: DocumentRevision;
  asyncState: AsyncState;
  isDisabled: boolean;
  onFormClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  docInfo: any;
  onUpgradeClick: () => void;
}

const FormHeaderPresenter: React.FunctionComponent<Props> = ({
  canShowCancelButton,
  handleCancelDraft,
  canChangeOwnerShip,
  values,
  isFormStatusDeprecated,
  isDocumentStatusDraftOrPending,
  isLastVersionObsolete,
  documentRevision,
  asyncState,
  isDisabled,
  onFormClick,
  docInfo,
  onUpgradeClick,
}) => {
  const UpgradeToLastestRenderer = isFormStatusDeprecated && isDocumentStatusDraftOrPending && !isLastVersionObsolete && <UpgradeToLatest onUpgradeClick={onUpgradeClick}/>;
  const CancelButtonRenderer = canShowCancelButton && (
    <Button color="secondary" variant="outlined" onClick={handleCancelDraft}>
      <Text translation="common.cancel.draft" />
    </Button>
  );
  const ChangeOwnershipRenderer = canChangeOwnerShip && values.id && (
    <OwnerChangerContainer requestId={values.id} requestType={RequestType.Document} />
  );

  return (
    <Header>
      {documentRevision && <DocumentListInfo documentRevision={documentRevision} />}
      <Grid item={true} xs={isDisabled ? 6 : 12} justify="flex-end">
        <Grid container={true} alignItems="flex-end" justify="flex-end">
          <SubmitButton
            asyncState={asyncState}
            label={isDisabled ? "common.save" : "navigation.createDocument"}
            onClick={onFormClick}
            id="DocumentRevisionForm-submit"
          />
          <ApproveAndRelease
            id={values.id}
            status={values.status}
            isQms={docInfo.isQms}
            documentName={docInfo.name}
            docRevId={values.id as string}
          />
          <HeaderMenu>
            {CancelButtonRenderer}
            {ChangeOwnershipRenderer}
            {UpgradeToLastestRenderer}
          </HeaderMenu>
        </Grid>
      </Grid>
    </Header>
  ); };

export default FormHeaderPresenter;
