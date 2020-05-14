import { Grid } from "@material-ui/core";
import { useFormikContext } from "formik";
import * as React from "react";
import OwnerChanger from "../../../components/common/owner.changer/container";
import { RequestType } from "../../../components/common/owner.changer/helpers/types";
import SubmitButton from "../../../components/forms/SubmitButton";
import HeaderMenu from "../../../document.revision/header/Menu";
import { FB } from "../../../form.builder";
import { FormHeaderContext } from "../DocumentRevisionForm.presenter";
import { withActionButton } from "./ActionButton.wrap";
import ApproveAndRelease from "./ApproveAndRelease";
import CancelButton from "./CancelButton";
import UpgradeToLatest from "./UpgradeToLatest";

const DocRevActions: React.FunctionComponent<any> = ({ ...props }) => {
  const  {
    documentRevision,
    values,
    docInfo,
    asyncState,
    canChangeOwnerShip,
  } = React.useContext(FormHeaderContext)!;

  const { workspaceState, formState } = FB.useStores();
  const formik = useFormikContext();
  const isDisabled: boolean = documentRevision?.id !== undefined;

  function setFBValue() {
    switch (workspaceState?.getMode()) {
      case "design":
        formik.setValues({
          ...values,
          formTemplate: {
            outputDocumentTypes: (values.outputDocumentTypes || [])
              .map((outputDoc) => ({ id: outputDoc.value }) ),
            schema: workspaceState?.getSchema(),
          },
        });
        break;
      case "form":
        formik.setValues({
          ...values,
          formDocument: {
            id: values.formDocument?.id,
          },
          formInput: formState?.getValues(),
        });
        break;
      default:
        formik.setValues({
          ...values,
          formTemplate: undefined,
        });
    }
  }
  const onFormClick = () => {
    setFBValue();
    formik.submitForm();
  };
  const renderChangeOwnership = canChangeOwnerShip && values.id && (
    <OwnerChanger requestId={values.id} requestType={RequestType.Document} />
  );

  return (
    <Grid
      container={true}
      alignItems="flex-end"
      justify="flex-end"
      direction="row"
    >
      <SubmitButton
        asyncState={asyncState}
        label={isDisabled ?
          `common.save.${values.document?.documentType?.documentTypeAcronym}` :
          "navigation.createDocument"
        }
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
        <CancelButton
          documentStatus={documentRevision?.status}
          version={documentRevision?.version}
          docRevId={documentRevision?.id}
          shouldDisplay={props.cancelButtonDisplay}
          setShouldDisplay={props.setCancelButtonDisplay}
        />
        {renderChangeOwnership}
        <UpgradeToLatest
          documentStatus={documentRevision?.formDocument?.status}
          formDocumentId={documentRevision?.formDocument?.document?.id}
          docRevId={documentRevision?.id}
          formDocumentStatus={documentRevision?.formDocument?.status}
          shouldDisplay={props.upgradeToLastestDisplay}
          setShouldDisplay={props.setUpgradeToLastestDisplay}
        />
      </HeaderMenu>
    </Grid>
  );
};

export default withActionButton(DocRevActions);
