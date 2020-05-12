import { Box, Grid } from "@material-ui/core";
import * as React from "react";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import { AsyncState } from "../../../../state/types";
import OwnerChanger from "../../../components/common/owner.changer/container";
import { RequestType } from "../../../components/common/owner.changer/helpers/types";
import SubmitButton from "../../../components/forms/SubmitButton";
import { FB } from "../../../form.builder";
import { DocumentRevisionFormValues } from "../types";
import ApproveAndRelease from "./ApproveAndRelease";
import CancelButton from "./CancelButton";
import UpgradeToLatest from "./UpgradeToLatest";

interface Props {
  setValues: (values: DocumentRevisionFormValues) => any;
  documentRevision?: DocumentRevision;
  values: DocumentRevisionFormValues;
  docInfo: {
    name: string;
    isQms: boolean;
  };
  asyncState: AsyncState;
  canChangeOwnerShip: boolean;
}

const DocRevActions: React.FunctionComponent<Props> = ({
  documentRevision,
  values,
  docInfo,
  asyncState,
  canChangeOwnerShip,
  setValues,
}) => {
  const { workspaceState, formState } = FB.useStores();
  const isDisabled: boolean = documentRevision?.id !== undefined;
  const onFormClick = () => {
    switch (workspaceState?.getMode()) {
      case "design":
        setValues({
          ...values,
          formTemplate: {
            outputDocumentTypes: (values.outputDocumentTypes || [])
              .map((outputDoc) => ({ id: outputDoc.value }) ),
            schema: workspaceState?.getSchema(),
          },
        });
        break;
      case "form":
        setValues({
          ...values,
          formDocument: {
            id: values.formDocument?.id,
          },
          formInput: formState?.getValues(),
        });
        break;
      default:
        setValues({
          ...values,
          formTemplate: undefined,
        });
    }
  };
  const renderChangeOwnership = canChangeOwnerShip && values.id && (
    <OwnerChanger requestId={values.id} requestType={RequestType.Document} />
  );

  return (
    <Box mt={5}>
      <Grid
        container={true}
        alignItems="flex-end"
        justify="flex-end"
        direction="row"
      >
        <CancelButton
          documentStatus={documentRevision?.status}
          version={documentRevision?.version}
          docRevId={documentRevision?.id}
        />
        {renderChangeOwnership}
        <SubmitButton
          asyncState={asyncState}
          label={isDisabled ?
            `common.save.${values.document?.documentType?.documentTypeAcronym}` :
            "navigation.createDocument"
          }
          onClick={onFormClick}
          id="DocumentRevisionForm-submit"
        />
        <UpgradeToLatest
          documentStatus={documentRevision?.formDocument?.status}
          formDocumentId={documentRevision?.formDocument?.document?.id}
          docRevId={documentRevision?.id}
          formDocumentStatus={documentRevision?.formDocument?.status}
        />
        <ApproveAndRelease
          id={values.id}
          status={values.status}
          isQms={docInfo.isQms}
          documentName={docInfo.name}
          docRevId={values.id as string}
        />
      </Grid>
    </Box>
  );
};

export default DocRevActions;
