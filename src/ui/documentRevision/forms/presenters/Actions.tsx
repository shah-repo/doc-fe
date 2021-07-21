/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useFormikContext } from "formik";
import { isEqual, isUndefined, keys, omit } from "lodash";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFormattedDateString, MomentFormats } from "../../../../common/utils/date";
import { companyActions, companySelectors } from "../../../../state/ducks/company";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import { DOC_TYPE_GROUP_OPTION } from "../../../../state/ducks/documentRevisions/documentType/types";
import { RevisionChangeType } from "../../../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../../../state/reducers";
import HeaderMenu from "../../../components/common/header/Menu";
import OwnerChanger from "../../../components/common/owner.changer/container";
import { RequestType } from "../../../components/common/owner.changer/helpers/types";
import CopyEBButton from "../../../components/forms/CopyEBButton";
import SubmitButton from "../../../components/forms/SubmitButton";
import { FB } from "../../../form.builder";
import { INITIAL_VALUES } from "../../../form.builder/FBInput/FBInput.wrap";
import useShouldUpgradeToLatest from "../../../hooks/useShouldUpgradeToLatest";
import { isOperator } from "../../DocumentRevisionDisplay.container";
import { checkCanBeCopied, checkIsDocumentDirectApproved, checkIsDocumentExportable, checkIsDocumentLHR, checkIsDocumentMPIOutput, checkIsDocumentRecord, hasOperatorRelease, hasRedline, hasSerializedCSV } from "../../helpers/checkDocumentGroup";
import { isDocumentRevisionInDraft, isDocumentRevisionReleased } from "../../helpers/documentRevisionStatus";
import { getShouldShowUpgradeForRecord, isFormWithInlineApproval, isInlineFormApproved } from "../../helpers/records";
import { isDocumentNumericRelease } from "../../helpers/revisionStage";
import InspectionControlsContainer from "../../InspectionControls/InspectionControls.container";
import { FormHeaderContext, isOwnerContext } from "../DocumentRevisionForm.presenter";
import { withActionButton } from "./ActionButton.wrap";
import ApproveAndRelease from "./approve.and.release/ApproveAndRelease";
import CancelButton from "./CancelButton";
import ExportToCSVButton from "./export.to.csv/ExportToCSV.button";
import ExportToEmail from "./export.to.email/ExportToEmail";
import RedlineButton from "./redline/Redline.button";
import { SubmitForApproval } from "./SubmitForApproval";
import UpgradeToLatestContainer from "./upgrade.to.latest/UpgradeToLatest.container";
import VoidButton from "./VoidButton";

const DocRevActions: React.FunctionComponent<any> = ({ ...props }) => {
  const formik = useFormikContext();
  const dispatch = useDispatch();
  // isCreateDocumentDisabled is flag for temporary disabling
  // of create button until correct doc id is generated
  const { isCreateDocumentDisabled } = props;
  const { workspaceState, formState } = FB.useStores();
  const {
    documentRevision,
    values,
    docInfo,
    asyncState,
    canChangeOwnerShip,
    type,
  } = React.useContext(FormHeaderContext)!;
  const redlineActive = useSelector(companySelectors.getRedlineActive);
  const { revisionStage, revisionChangeType, owner, updatedAt } = documentRevision || {};
  const documentTypeId = documentRevision?.document?.documentType?.id || "";
  const schema = documentRevision?.formDocument?.formTemplate?.schema;
  const isDisabled: boolean = documentRevision?.id !== undefined;
  const isNewVersion = type === "newVersion";
  const isUserDocumentOwner = React.useContext(isOwnerContext);
  const isCurrentUserOperator = React.useContext(isOperator);
  const currentDocumentType = useSelector((state: ApplicationState) =>
    documentTypeSelectors.getDocumentTypeById(state, documentTypeId || ""));

  // MARK: @helpers
  const shouldShowUpgradeForDocs = useShouldUpgradeToLatest(
    documentRevision?.status,
    documentRevision?.formDocument?.status,
    documentRevision?.formDocument?.document?.id
  );

  const [isInlineApproval, setInlineApproval] = React.useState(false);
  const [isApproved, setIsApproved] = React.useState(false);

  React.useEffect(() => {
    formState?.validate((_valid) => {
      const validSchema = schema?.filter((schemaItem) => {
        if (schemaItem.validationMode === "visibility" || schemaItem.validationMode === "disabled") {
          return !isUndefined(formState.errors.get(schemaItem.name ?? ""));
        }
        return true;
      });
      setInlineApproval(isFormWithInlineApproval(validSchema));
      setIsApproved(isInlineFormApproved( documentRevision, formState, validSchema));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shouldShowUpgradeBannerForRecord = getShouldShowUpgradeForRecord(documentRevision);
  const isRecord = checkIsDocumentRecord(values.document?.documentType?.groupOptions);
  const isDirectlyApproved = checkIsDocumentDirectApproved(values.document?.documentType?.groupOptions);
  const isMPIOutput = checkIsDocumentMPIOutput(values.document?.documentType?.groupOptions);
  const isLHR = checkIsDocumentLHR(values.document?.documentType?.groupOptions);
  const isExportable = !documentRevision?.renderHTML &&
    checkIsDocumentExportable(documentRevision?.document?.documentType?.groupOptions);
  const serializedCSV = hasSerializedCSV(values.document?.documentType?.groupOptions);
  const isStatusReleased = isDocumentRevisionReleased(documentRevision?.status);
  const canCopy = checkCanBeCopied(documentRevision?.document?.documentType?.groupOptions);
  const isStatusInDraft = isDocumentRevisionInDraft(documentRevision?.status);
  const docTypeHasOperatorRelease = hasOperatorRelease(currentDocumentType?.groupOptions);
  const docTypeHasRedline = hasRedline(values.document?.documentType?.groupOptions);

  const shouldShowUpgrade =
   ((!isRecord && shouldShowUpgradeForDocs) || (shouldShowUpgradeBannerForRecord && shouldShowUpgradeForDocs))
    && !isLHR && !isMPIOutput;
  const showVoidButton = isStatusInDraft && documentRevision?.version === 1;
  const showVoidButtonOnInlineRecords = isStatusInDraft && isDocumentNumericRelease(documentRevision?.revisionStage);
  const showToOwnerOrOperator = isUserDocumentOwner || (isCurrentUserOperator && docTypeHasOperatorRelease);

  function isOutputSchema(): boolean {
    const { schema: documentSchema = [] } = documentRevision?.formDocument?.formTemplate || {};
    const { groupOptions } = documentRevision?.document?.documentType || {};
    return (
      (Boolean(groupOptions?.includes(DOC_TYPE_GROUP_OPTION.EDITABLE_SCHEMA))) &&
      !isEqual(JSON.stringify(workspaceState?.schema), JSON.stringify(documentSchema))
    );
  }

  function setFBValue() {
    const schema = workspaceState?.schema?.map((schemaItem) => omit(schemaItem, ["autoFocus", "autoScrollTo"]));
    switch (workspaceState?.getMode()) {
      case "design":
        formik.setFieldValue("formTemplate", {
          outputDocumentTypes: (values.outputDocumentTypes || [])
            .map((outputDoc) => ({ id: outputDoc.value })),
          schema,
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
            newInput[key] = values?.formInput && typeof values?.formInput[key] === "string" && key !== "equipment_id"
              ? "Void"
              : key === "equipment_id" ?  null : values?.formInput?.[key];
            return key;
          });
          // TEMPORARY FIX FOR BE VALIDATION
          formik.setFieldValue("formInput",
            omit(newInput, [...Object.keys(INITIAL_VALUES), "partType", "childForRevise"]));
        } else {
          // TEMPORARY FIX FOR BE VALIDATION
          formik.setFieldValue("formInput",
            omit(formState?.getValues(), [...Object.keys(INITIAL_VALUES), "partType", "childForRevise"]));
        }
        if (isOutputSchema()) {
          formik.setFieldValue("schema", schema);
        }
        break;
      default:
        formik.setFieldValue("formTemplate", undefined);
    }
  }
  const onFormClick = () => {
    if (redlineActive) {
      formik.setFieldValue("redline", true);
      workspaceState?.setMode("form");
      dispatch(companyActions.autosaveConfig());
    }
    setFBValue();
    if (values.revisionChangeType === RevisionChangeType.Obsolete && isRecord) {
      formik.setFieldValue("attachments", []);
      formik.setFieldValue("name", "Void");
      formik.setFieldValue("description", "Void");
      formik.setFieldValue("referenceTo", null);
      formik.setFieldValue("parentEquipment", null);
    }
    formik.submitForm();
  };

  React.useEffect(() => {
    // Autosave when record is updated
    if (isNewVersion && isRecord) {
      onFormClick();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const renderChangeOwnership = canChangeOwnerShip && values.id && (
    <OwnerChanger requestId={values.id} requestType={RequestType.Document} />
  );

  return (
    <div>
      <SubmitButton
        asyncState={asyncState}
        label={isDisabled ?
          "common.save" :
          "navigation.createDocument"
        }
        onClick={onFormClick}
        id="DocumentRevisionForm-submit"
        data-cy={"DocumentRevisionForm-submit"}
        disabled={isCreateDocumentDisabled}
      />
      {
        !redlineActive &&
      <span>
        {(isStatusReleased || isStatusInDraft) && serializedCSV &&
          <ExportToCSVButton
            {...{ documentRevision }}
          />}
        {(isStatusReleased || isStatusInDraft) && canCopy &&
        <CopyEBButton
          {...{ documentRevision }}
        />}
        <InspectionControlsContainer {...{ documentRevision }} />
        <RedlineButton {...{ isUserDocumentOwner, docTypeHasRedline }}/>
        {
          isDirectlyApproved && (!isInlineApproval || revisionStage !== 1) && showToOwnerOrOperator && (
            <SubmitForApproval
              docRevId={values.id as string}
              status={values.status}
              docRevOwner={owner?.user.name}
              updatedAt={getFormattedDateString(updatedAt, MomentFormats.DateTime)}
              {
                ...{
                  revisionChangeType,
                  currentDocumentType,
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
              needsSignature={docInfo.needsSignature}
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
        {isExportable && <ExportToEmail revisionId={documentRevision.id}/>}
        <HeaderMenu>
          {!(isRecord && isInlineApproval && showVoidButtonOnInlineRecords) &&
        <CancelButton
          {...{ documentRevision }}
          setShouldDisplay={props.setCancelButtonDisplay}
        />}
          {renderChangeOwnership}
          <UpgradeToLatestContainer
            formDocumentId={documentRevision?.formDocument?.document?.id}
            docRevId={documentRevision?.id}
            setShouldDisplay={props.setUpgradeToLastestDisplay}
            type="button"
            {...{
              shouldShowUpgrade,
            }}
          />
          {!(isRecord && isInlineApproval) &&
          isUserDocumentOwner && showVoidButton && <VoidButton {...{ documentRevision }}/>}
          {isRecord && isInlineApproval &&
          isUserDocumentOwner && showVoidButtonOnInlineRecords && <VoidButton {...{ documentRevision }}/>}
        </HeaderMenu>
      </span>
      }
    </div>
  );
};

export default withActionButton(DocRevActions);
