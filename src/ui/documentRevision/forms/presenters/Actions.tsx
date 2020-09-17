/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useFormikContext } from "formik";
import { find, isEmpty, isUndefined } from "lodash";
import * as React from "react";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import HeaderMenu from "../../../components/common/header/Menu";
import OwnerChanger from "../../../components/common/owner.changer/container";
import { RequestType } from "../../../components/common/owner.changer/helpers/types";
import SubmitButton from "../../../components/forms/SubmitButton";
import { FB } from "../../../form.builder";
import { FormHeaderContext, isOwnerContext } from "../DocumentRevisionForm.presenter";
import { withActionButton } from "./ActionButton.wrap";
import { ApproveAndRelease } from "./ApproveAndRelease";
import CancelButton from "./CancelButton";
import { FinalizeAndRelease } from "./FinalizeAndRelease";
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

  const { workspaceState, formState, inlineApprovalState } = FB.useStores();

  const inlineApprovalFields = documentRevision?.formDocument?.formTemplate?.schema
    .filter((field) => (field.type === "inlineapproval" as string));

  const isInlineApproval = Boolean(inlineApprovalFields && inlineApprovalFields.length > 0);
  const isRecord = values.document?.documentType?.group === "RECORD";

  /** Function that checks if a form section is approved.
   * @param fieldName Unique name of the form field.
  */
  const isSectionApproved = (fieldName: string) => (
      documentRevision?.version > 1 &&
      isEmpty(inlineApprovalState?.getApprovals) &&
      Boolean(formState?.getFieldValue(fieldName))
  ) ? true
    : !isUndefined(find(inlineApprovalState?.getApprovals, { status: "APPROVED" }));

  /** Every form field that is inline approval should have
   * at least one approval in status approved in order to be considered as approved. */
  const isApproved = inlineApprovalFields?.every((field) => isSectionApproved(field.name!));

  const { revisionStage, subRevision, revisionChangeType } = documentRevision || {};
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
      {
        isRecord && (!isInlineApproval || revisionStage !== 1) && (
          <FinalizeAndRelease
            docRevId={values.id as string}
            status={values.status}
            {
              ...{
                revisionStage,
                subRevision,
                revisionChangeType,
              }
            }
          />
        )
      }
      {
        (!isRecord || (isInlineApproval && isApproved && revisionStage === 1)) && (
          <ApproveAndRelease
            id={values.id}
            status={values.status}
            isQms={docInfo.isQms}
            documentName={docInfo.name}
            docRevId={values.id as string}
            owner={documentRevision?.owner}
            {
              ...{
                documentTypeId,
                revisionStage,
                isRecord,
                isInlineApproval,
              }
            }
          />
        )
      }
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
