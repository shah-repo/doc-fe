import { useFormikContext } from "formik";
import * as React from "react";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import HeaderMenu from "../../../components/common/header/Menu";
import OwnerChanger from "../../../components/common/owner.changer/container";
import { RequestType } from "../../../components/common/owner.changer/helpers/types";
import SubmitButton from "../../../components/forms/SubmitButton";
import { FB } from "../../../form.builder";
import { FormHeaderContext, isOwnerContext } from "../DocumentRevisionForm.presenter";
import { withActionButton } from "./ActionButton.wrap";
import ApproveAndRelease from "./ApproveAndRelease";
import CancelButton from "./CancelButton";
import UpgradeToLatestContainer from "./upgrade.to.latest/UpgradeToLatest.container";
import VoidButton from "./VoidButton";

const DocRevActions: React.FunctionComponent<any> = ({ ...props }) => {
  const {
    documentRevision,
    values,
    docInfo,
    asyncState,
    canChangeOwnerShip,
  } = React.useContext(FormHeaderContext)!;

  const { workspaceState, formState } = FB.useStores();
  const formik = useFormikContext();
  const isDisabled: boolean = documentRevision?.id !== undefined;
  const documentTypeId = documentRevision?.document?.documentType?.id;
  const isUserDocumentOwner = React.useContext(isOwnerContext);
  const showVoidButton = documentRevision?.status === DocumentRevisionStatus.Draft && documentRevision?.version === 1;
  function setFBValue() {
    switch (workspaceState?.getMode()) {
      case "design":
        formik.setFieldValue("formTemplate", {
          outputDocumentTypes: (values.outputDocumentTypes || [])
            .map((outputDoc) => ({ id: outputDoc.value })),
          schema: workspaceState?.getSchema(),
        });
        break;
      case "form":
        formik.setFieldValue("formDocument", {
          id: values.formDocument?.id,
        });
        formik.setFieldValue("formInput", formState?.getValues());
        break;
      default:
        formik.setFieldValue("formTemplate", undefined);
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
    <div>
      <SubmitButton
        asyncState={asyncState}
        label={isDisabled ?
          `common.save.${values.document?.documentType?.documentTypeAcronym}` :
          "navigation.createDocument"
        }
        onClick={onFormClick}
        id="DocumentRevisionForm-submit"
        data-cy={"DocumentRevisionForm-submit"}
      />
      <ApproveAndRelease
        id={values.id}
        status={values.status}
        isQms={docInfo.isQms}
        documentName={docInfo.name}
        docRevId={values.id as string}
        owner={documentRevision?.owner}
        documentTypeId={documentTypeId}
      />
      <HeaderMenu>
        <CancelButton
          documentStatus={documentRevision?.status}
          version={documentRevision?.version}
          docRevId={documentRevision?.id}
          setShouldDisplay={props.setCancelButtonDisplay}
        />
        {renderChangeOwnership}
        <UpgradeToLatestContainer
          documentStatus={documentRevision?.status}
          formDocumentId={documentRevision?.formDocument?.document?.id}
          docRevId={documentRevision?.id}
          formDocumentStatus={documentRevision?.formDocument?.status}
          setShouldDisplay={props.setUpgradeToLastestDisplay}
          type="button"
        />
        {isUserDocumentOwner && showVoidButton && <VoidButton {...{ documentRevision }}/>}
      </HeaderMenu>
    </div>
  );
};

export default withActionButton(DocRevActions);
