/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useFormikContext } from "formik";
import { differenceBy, keys, omit } from "lodash";
import * as React from "react";
import { getFormattedDateString, MomentFormats } from "../../../../common/utils/date";
import { RevisionChangeType } from "../../../../state/ducks/documentRevisions";
import { DOC_TYPE_GROUP_OPTION } from "../../../../state/ducks/documentRevisions/documentType/types";
import HeaderMenu from "../../../components/common/header/Menu";
import OwnerChanger from "../../../components/common/owner.changer/container";
import { RequestType } from "../../../components/common/owner.changer/helpers/types";
import CopyEBButton from "../../../components/forms/CopyEBButton";
import SubmitButton from "../../../components/forms/SubmitButton";
import { FB } from "../../../form.builder";
import { checkCanBeCopied, checkIsDocumentRecord, hasSerializedCSV } from "../../helpers/checkDocumentGroup";
import { isDocumentRevisionInDraft, isDocumentRevisionReleased } from "../../helpers/documentRevisionStatus";
import { isFormWithInlineApproval, isInlineFormApproved } from "../../helpers/records";
import { isDocumentNumericRelease } from "../../helpers/revisionStage";
import InspectionControlsContainer from "../../InspectionControls/InspectionControls.container";
import { FormHeaderContext, isOwnerContext } from "../DocumentRevisionForm.presenter";
import { withActionButton } from "./ActionButton.wrap";
import ApproveAndRelease from "./approve.and.release/ApproveAndRelease";
import CancelButton from "./CancelButton";
import ExportToCSVButton from "./export.to.csv/ExportToCSV.button";
import { SubmitForApproval } from "./SubmitForApproval";
import UpgradeToLatestContainer from "./upgrade.to.latest/UpgradeToLatest.container";
import VoidButton from "./VoidButton";

const DocRevActions: React.FunctionComponent<any> = ({ ...props }) => {
  // isCreateDocumentDisabled is flag for temporary disabling
  // of create button until correct doc id is generated
  const { isCreateDocumentDisabled } = props;
  const {
    documentRevision,
    values,
    docInfo,
    asyncState,
    canChangeOwnerShip,
  } = React.useContext(FormHeaderContext)!;

  const { workspaceState, formState } = FB.useStores();

  const isInlineApproval = isFormWithInlineApproval(documentRevision?.formDocument?.formTemplate?.schema);
  const isRecord = checkIsDocumentRecord(values.document?.documentType?.groupOptions);
  const serializedCSV = hasSerializedCSV(values.document?.documentType?.groupOptions);
  const isApproved = isInlineFormApproved(
    documentRevision,
    formState,
    documentRevision?.formDocument?.formTemplate?.schema
  );

  const { revisionStage, revisionChangeType, owner, updatedAt } = documentRevision || {};
  const formik = useFormikContext();
  const isDisabled: boolean = documentRevision?.id !== undefined;
  const documentTypeId = documentRevision?.document?.documentType?.id;
  const isUserDocumentOwner = React.useContext(isOwnerContext);
  const isStatusInDraft = isDocumentRevisionInDraft(documentRevision?.status);
  const showVoidButton = isStatusInDraft && documentRevision?.version === 1;
  const showVoidButtonOnInlineRecords = isStatusInDraft &&
     isDocumentNumericRelease(documentRevision?.revisionStage);
  const isStatusReleased = isDocumentRevisionReleased(documentRevision?.status);
  const canCopy = checkCanBeCopied(documentRevision?.document?.documentType?.groupOptions);

  function isOutputSchema(): boolean {
    const { schema: documentSchema = [] } = documentRevision?.formDocument?.formTemplate || {};
    const { groupOptions } = documentRevision?.document?.documentType || {};
    return (
      (Boolean(groupOptions?.includes(DOC_TYPE_GROUP_OPTION.EDITABLE_SCHEMA))) &&
      Boolean(differenceBy(workspaceState?.schema || [],  documentSchema, "name").length)
    );
  }

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
      case "formDesign":
        formik.setFieldValue("formDocument", {
          id: values.formDocument?.id,
        });
        if (values.revisionChangeType === RevisionChangeType.Obsolete && isRecord) {
          const newInput = {};
          keys(values.formInput).map((key) => {
            newInput[key] = values?.formInput && typeof values?.formInput[key] === "string"
              ? "Void"
              : null;
            return key;
          });
          // TEMPORARY FIX FOR BE VALIDATION
          formik.setFieldValue("formInput", omit(newInput, ["partType", "childForRevise"]));
        } else {
          // TEMPORARY FIX FOR BE VALIDATION
          formik.setFieldValue("formInput", omit(formState?.getValues(), ["partType", "childForRevise"]));
        }
        if (isOutputSchema()) {
          formik.setFieldValue("schema", workspaceState.schema);
        }
        break;
      default:
        formik.setFieldValue("formTemplate", undefined);
    }
  }
  const onFormClick = () => {
    setFBValue();
    if (values.revisionChangeType === RevisionChangeType.Obsolete && isRecord) {
      formik.setFieldValue("attachments", []);
      formik.setFieldValue("name", "Void");
      formik.setFieldValue("description", "Void");
      formik.setFieldValue("referenceTo", null);
    }
    formik.submitForm();
  };
  const renderChangeOwnership = canChangeOwnerShip && values.id && (
    <OwnerChanger requestId={values.id} requestType={RequestType.Document} />
  );

  return (
    <div>
      {(isStatusReleased || isStatusInDraft) && serializedCSV &&
      <ExportToCSVButton
        {...{ documentRevision }}
      />}
      {(isStatusReleased || isStatusInDraft) && canCopy &&
        <CopyEBButton
          {...{ documentRevision }}
        />}
      <SubmitButton
        asyncState={asyncState}
        label={isDisabled ?
          `common.save.${values.document?.documentType?.documentTypeAcronym}` :
          "navigation.createDocument"
        }
        onClick={onFormClick}
        id="DocumentRevisionForm-submit"
        data-cy={"DocumentRevisionForm-submit"}
        disabled={isCreateDocumentDisabled}
      />
      <InspectionControlsContainer {...{ documentRevision }} />
      {
        isRecord && (!isInlineApproval || revisionStage !== 1) && (
          <SubmitForApproval
            docRevId={values.id as string}
            status={values.status}
            docRevOwner={owner?.user.name}
            updatedAt={getFormattedDateString(updatedAt, MomentFormats.DateTime)}
            {
              ...{
                revisionChangeType,
              }
            }
          />
        )
      }
      {
        (!isRecord || (isInlineApproval && isApproved && isDocumentNumericRelease(revisionStage))) && (
          <ApproveAndRelease
            id={values.id}
            status={values.status}
            isQms={docInfo.isQms}
            documentName={docInfo.name}
            docRevId={values.id as string}
            owner={documentRevision?.owner}
            {
              ...{
                isRecord,
                documentTypeId,
                revisionStage,
                isInlineApproval,
              }
            }
          />
        )
      }
      <HeaderMenu>
        {!(isRecord && isInlineApproval && showVoidButtonOnInlineRecords) &&
        <CancelButton
          {...{ documentRevision }}
          setShouldDisplay={props.setCancelButtonDisplay}
        />}
        {renderChangeOwnership}
        <UpgradeToLatestContainer
          documentStatus={documentRevision?.status}
          formDocumentId={documentRevision?.formDocument?.document?.id}
          docRevId={documentRevision?.id}
          formDocumentStatus={documentRevision?.formDocument?.status}
          setShouldDisplay={props.setUpgradeToLastestDisplay}
          type="button"
        />
        {!(isRecord && isInlineApproval) &&
          isUserDocumentOwner && showVoidButton && <VoidButton {...{ documentRevision }}/>}
        {isRecord && isInlineApproval &&
          isUserDocumentOwner && showVoidButtonOnInlineRecords && <VoidButton {...{ documentRevision }}/>}
      </HeaderMenu>
    </div>
  );
};

export default withActionButton(DocRevActions);
