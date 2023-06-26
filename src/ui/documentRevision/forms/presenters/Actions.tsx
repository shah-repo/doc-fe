/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useFormikContext } from "formik";
import { get, isArray, isEmpty, isEqual, isUndefined, keys, omit } from "lodash";
import { Observer } from "mobx-react";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { SM } from "../../../../App";
import { getFormattedDateString, MomentFormats } from "../../../../common/utils/date";
import { getHasPermission } from "../../../../common/utils/selectors";
import { getPOIndexDbInstance } from "../../../../indexDb";
import { GroupTag, Permission } from "../../../../state/ducks/auth/types";
import { companyActions, companySelectors } from "../../../../state/ducks/company";
import { documentRevisionsActions } from "../../../../state/ducks/documentRevisions";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import { DOC_TYPE_GROUP_OPTION } from "../../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision, DocumentRevisionStatus, RevisionChangeType } from "../../../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../../../state/reducers";
import HeaderPOStatus from "../../../components/common/header/HeaderPOStatus";
import HeaderMenu from "../../../components/common/header/Menu";
import { default as OwnerChangerContainer } from "../../../components/common/owner.changer/container";
import { RequestType } from "../../../components/common/owner.changer/helpers/types";
import ClonePOButton from "../../../components/forms/ClonePOButton";
import CloneEBButton from "../../../components/forms/CopyEBButton";
import StyledSubmitButton from "../../../components/forms/StyledSubmitButton";
import { DOCUMENT_REVISION_CREATE_URL } from "../../../constants/urls";
import { documentVersionPath } from "../../../document.revision/utils/paths";
import { FB } from "../../../form.builder";
import { FBFormStateContext } from "../../../form.builder/FBForm/FBForm.wrap";
import { COMMON_INITIAL_VALUES, INDIVIDUAL_INITIAL_VALUES } from "../../../form.builder/FBInput/FBInput.wrap";
import { useApproveAndRelease, useUndoPOChanges } from "../../../hooks/docCustomization/useCustomization";
import useActionCreator from "../../../hooks/useActionCreator";
import useGetHasTag from "../../../hooks/useGetHasTag";
import useShouldUpgradeToLatest from "../../../hooks/useShouldUpgradeToLatest";
import { isOperator } from "../../DocumentRevisionDisplay.container";
import { checkCanBeCopied, checkCanTypeCreateInspection, checkIsDocumentDirectApproved, checkIsDocumentEB, checkIsDocumentExportable, checkIsDocumentLHR, checkIsDocumentMPIOutput, checkIsDocumentPO, checkIsDocumentRecord, hasOperatorRelease, hasRedline, hasSerializedCSV } from "../../helpers/checkDocumentGroup";
import { isDocumentRevisionHasOutput, isDocumentRevisionInDraft, isDocumentRevisionInReview, isDocumentRevisionReleased } from "../../helpers/documentRevisionStatus";
import { getShouldShowUpgradeForRecord, isFormWithInlineApproval, isInlineFormApproved } from "../../helpers/records";
import { isDocumentNumericRelease } from "../../helpers/revisionStage";
import InspectionControlsContainer from "../../InspectionControls/InspectionControls.container";
import { PreviewControlButtons } from "../../PreviewControls.container.types";
import { FormHeaderContext, isOwnerContext } from "../DocumentRevisionForm.container";
import { withActionButton } from "./ActionButton.wrap";
import ApproveAndRelease from "./approve.and.release/ApproveAndRelease";
import CancelButton from "./CancelButton";
import ExportToCSVButton from "./export.to.csv/ExportToCSV.button";
import ExportToEmail from "./export.to.email/ExportToEmail";
import GenerateHtmlPreview from "./GenerateHtmlPreview";
import RedlineButton from "./redline/Redline.button";
import { SubmitForApproval } from "./SubmitForApproval";
import UpgradeToLatestContainer from "./upgrade.to.latest/UpgradeToLatest.container";
import VoidButton from "./VoidButton";

const DocRevActions: React.FunctionComponent<any> = ({ ...props }) => {
  const isNewLayout = SM.isNewLayout;
  const formik = useFormikContext();
  const dispatch = useDispatch();
  // isCreateDocumentDisabled is flag for temporary disabling
  // of create button until correct doc id is generated
  const { isCreateDocumentDisabled } = props;
  const { _formState, _documentRevisionFormState } = SM.useStores();
  const { workspaceState } = FB.useStores();

  const {
    documentRevision,
    values,
    asyncState,
    canChangeOwnerShip,
    mode,
    type,
  } = React.useContext(FormHeaderContext)!;
  const history = useHistory();
  const isCreateUrl = SM.pathname.includes(DOCUMENT_REVISION_CREATE_URL);
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
    _formState?.validate((_valid) => {
      const validSchema = schema?.filter((schemaItem) => {
        if (schemaItem.validationMode === "visibility" || schemaItem.validationMode === "disabled") {
          return !isUndefined(_formState.errors.get(schemaItem.name ?? ""));
        }
        return true;
      });
      setInlineApproval(isFormWithInlineApproval(validSchema));
      setIsApproved(isInlineFormApproved( documentRevision, _formState, validSchema));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_formState, schema, _formState?.Validator, _formState?.getValues()]);

  const setDocumentRevision = useActionCreator(documentRevisionsActions.documentRevisionSet);
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
  const isPO = checkIsDocumentPO(documentRevision?.document?.documentType?.groupOptions);
  const isEB = checkIsDocumentEB(documentRevision?.document?.documentType?.groupOptions);
  const isStatusInDraft = isDocumentRevisionInDraft(documentRevision?.status);
  const isStatusInReview = isDocumentRevisionInReview(documentRevision?.status);
  const docTypeHasOperatorRelease = hasOperatorRelease(currentDocumentType?.groupOptions);
  const docTypeHasRedline = hasRedline(values.document?.documentType?.groupOptions);
  const isLHRProductionBuild =  _formState?.isLHRProductionBuild || workspaceState?.isLHRProductionBuild  || false;
  const isUserAdminEnforce = useGetHasTag(GroupTag.PO_ADMIN);
  const isPOEditState = isUserAdminEnforce && SM.isNewVersion && isPO && isDocumentRevisionHasOutput(documentRevision);
  const shouldShowUpgrade =
   ((!isRecord && shouldShowUpgradeForDocs) || (shouldShowUpgradeBannerForRecord && shouldShowUpgradeForDocs))
    && !isLHR && !isMPIOutput;
  const showVoidButton = isStatusInDraft && documentRevision?.version === 1;
  const showVoidButtonOnInlineRecords = isStatusInDraft && isDocumentNumericRelease(documentRevision?.revisionStage);
  const showToOwnerOrOperator = isUserDocumentOwner || (isCurrentUserOperator && docTypeHasOperatorRelease);

  function isOutputSchema(): boolean {
    const { schema: documentSchema = [] } = documentRevision?.formDocument?.formTemplate || {};
    const workspaceSchema = _documentRevisionFormState?.schema;
    const { groupOptions } = documentRevision?.document?.documentType || {};
    const { EDITABLE_SCHEMA, REDLINE } = DOC_TYPE_GROUP_OPTION;

    return (
      (Boolean(groupOptions?.includes(EDITABLE_SCHEMA) || groupOptions?.includes(REDLINE)))
      && !isEqual(JSON.stringify(workspaceSchema), JSON.stringify(documentSchema))
    );
  }

  function setFBValue() {
    const workspaceSchema = _documentRevisionFormState?.schema;
    const schema = workspaceSchema?.map((schemaItem) => omit(schemaItem, ["autoFocus", "autoScrollTo"]));
    const values = get(formik, "values") as DocumentRevision;
    const updatedMode = mode === "none" ? _formState?.mode : mode;
    switch (updatedMode) {
      case "design":
        formik.setFieldValue("formTemplate", {
          outputDocumentTypes: (values?.outputDocumentTypes ?
            isArray(values?.outputDocumentTypes) ? values?.outputDocumentTypes : [values?.outputDocumentTypes]
            : [])
            .map((outputDoc) => ({ id: outputDoc.value })),
          schema,
        });
        formik.setFieldValue("formInput", documentRevision?.formInput);
        break;
      case "form":
      case "formDesign":
        formik.setFieldValue("formDocument", {
          id: values?.formDocument?.id,
        });
        if (values.revisionChangeType === RevisionChangeType.Obsolete && isRecord) {
          const newInput = {};
          keys(values?.formInput).map((key) => {
            newInput[key] = values?.formInput && typeof values?.formInput[key] === "string" && key !== "equipment_id"
              ? "Void"
              : key === "equipment_id" ?  null : values?.formInput?.[key];
            return key;
          });
          // TEMPORARY FIX FOR BE VALIDATION
          formik.setFieldValue("formInput",
            omit(newInput,
              [...Object.keys({ ...COMMON_INITIAL_VALUES, ...INDIVIDUAL_INITIAL_VALUES }),
                "partType", "childForRevise"]));
        } else {
          const formStateContext = FBFormStateContext as any;
          // TEMPORARY FIX FOR BE VALIDATION
          formik.setFieldValue("formInput",
            omit(formStateContext?._currentValue,
              [...Object.keys({ ...COMMON_INITIAL_VALUES, ...INDIVIDUAL_INITIAL_VALUES }),
                "partType", "childForRevise"]));
        }
        if (isOutputSchema()) {
          formik.setFieldValue("schema", isEmpty(schema) ? values.schema : schema);
        }
        break;
      default:
        formik.setFieldValue("formTemplate", undefined);
        formik.setFieldValue("formDocument", undefined);
    }
  }
  const {
    label: undoChangesLabel,
  } = useUndoPOChanges(documentRevision?.document?.documentType?.id);

  const onUndoChangesClick = async () => {
    let prevPODoc;
    try {
      prevPODoc = await getPOIndexDbInstance().toArray();
    } catch (e) {}

    if (!prevPODoc.length) {
      history.push(documentVersionPath(documentRevision?.id, documentRevision?.document.id));
      return;
    }
    const data = await workspaceState?.undoPO(
      prevPODoc[0] as DocumentRevision);

    history.push(documentVersionPath(documentRevision?.id, documentRevision?.document.id));
    getPOIndexDbInstance().clear();
    setDocumentRevision(data);
  };
  const onFormClick = () => {
    if (redlineActive) {
      formik.setFieldValue("redline", true);
      _formState?.setMode("form");
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
    if (isPOEditState) {
      history.push(documentVersionPath(documentRevision.id, documentRevision.document.id));
      dispatch(documentRevisionsActions.load(documentRevision.id));
      getPOIndexDbInstance().clear();
    }
  };

  React.useEffect(() => {
    // Autosave when record is updated
    if (isNewVersion && (isRecord || (isPO && !isUserAdminEnforce)))  {
      onFormClick();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accessableButtons: string[] = [];
  const { status = "", version = 0 } = documentRevision || [];
  const canShowCancelButton = isDocumentRevisionInDraft(status) && version > 1;
  const { isVisible } = useApproveAndRelease(documentTypeId);
  const canApprove = useSelector(getHasPermission(Permission.CR_OWNER_AS_APPROVER));
  const hasBuildType = Boolean(documentRevision?.formInput?.["lhr-build-type"]);
  const isRenderHTMLDefined = documentRevision?.formDocument?.renderHTMLDefined;

  if (
    !isRecord ||
    (isInlineApproval && isApproved && isDocumentNumericRelease(revisionStage))
  ) {
    if (
      isVisible && values.id && values.status === DocumentRevisionStatus.Draft && canApprove &&
      !(isPO && isDocumentRevisionHasOutput(documentRevision))) {
      accessableButtons.push(PreviewControlButtons.ApproveAndReleaseButton);
    }
  }
  if (
    isDirectlyApproved &&
    (!isInlineApproval || revisionStage !== 1) &&
    showToOwnerOrOperator
  ) {
    accessableButtons.push(PreviewControlButtons.SubmitApprovalButton);
  }
  if ((isStatusReleased || isStatusInDraft) && canCopy && isEB) {
    accessableButtons.push(PreviewControlButtons.NewCloneEB);
  }
  if ((isStatusReleased || isStatusInDraft || isStatusInReview) && canCopy && isPO && !isPOEditState) {
    accessableButtons.push(PreviewControlButtons.NewClonePO);
  }
  if ((isStatusInDraft || isStatusInReview) && isPO && isRenderHTMLDefined) {
    accessableButtons.push(PreviewControlButtons.GeneratePDF);
  }
  if ((isStatusReleased || isStatusInDraft) && serializedCSV) {
    accessableButtons.push(PreviewControlButtons.ExportCsvButton);
  }
  if (!(!isUserDocumentOwner || !docTypeHasRedline || isLHRProductionBuild)) {
    accessableButtons.push(PreviewControlButtons.RedlineButton);
  }
  if (
    !(isRecord && isInlineApproval && showVoidButtonOnInlineRecords) &&
    canShowCancelButton
  ) {
    accessableButtons.push(PreviewControlButtons.CancelButton);
  }
  if (shouldShowUpgrade) {
    accessableButtons.push(PreviewControlButtons.UpgradeContainerButton);
  }
  const docRevGroupOptions =
    documentRevision?.document?.documentType?.groupOptions;
  const canCreateInspection = checkCanTypeCreateInspection(docRevGroupOptions);
  const isDocumentDraft = isDocumentRevisionInDraft(documentRevision?.status);
  if (isDocumentDraft || canCreateInspection) {
    accessableButtons.push(PreviewControlButtons.InspectionControl);
  }
  if (canChangeOwnerShip && values.id) {
    accessableButtons.push(PreviewControlButtons.ChangeOwner);
  }
  if (
    !(isRecord && isInlineApproval) &&
    isUserDocumentOwner &&
    showVoidButton
  ) {
    accessableButtons.push(PreviewControlButtons.VoidButton);
  }
  if (
    isRecord &&
    isInlineApproval &&
    isUserDocumentOwner &&
    showVoidButtonOnInlineRecords
  ) {
    accessableButtons.push(PreviewControlButtons.VoidButton);
  }
  if (isExportable) {
    accessableButtons.push(PreviewControlButtons.ExportButton);
  }
  const initialButtons =
    accessableButtons.length >= 1
      ? accessableButtons.slice(0, 1)
      : accessableButtons;
  const restButtons =
    accessableButtons.length >= 1 ? accessableButtons.slice(1) : [];

  const renderActionItems = (buttons: string[], renderAsButton: boolean) => (
    <>
      {buttons.includes(PreviewControlButtons.CancelButton) && (
        <CancelButton
          {...{ documentRevision }}
          setShouldDisplay={props.setCancelButtonDisplay}
          renderAsButton={renderAsButton}
        />
      )}
      {buttons.includes(PreviewControlButtons.UpgradeContainerButton) && (
        <UpgradeToLatestContainer
          formDocumentId={documentRevision?.formDocument?.document?.id}
          docRevId={documentRevision?.id}
          setShouldDisplay={props.setUpgradeToLastestDisplay}
          type="button"
          {...{
            shouldShowUpgrade,
          }}
          renderAsButton={renderAsButton}
        />
      )}
      {buttons.includes(PreviewControlButtons.ApproveAndReleaseButton) && (
        <Observer>
          {() => (
            <ApproveAndRelease
              id={values.id}
              status={values.status}
              needsSignature={
                 _documentRevisionFormState?.docInfo.needsSignature || false
              }
              isQms={_documentRevisionFormState?.docInfo.isQms || false}
              documentName={_documentRevisionFormState?.docInfo.name || ""}
              docRevId={values.id as string}
              owner={documentRevision?.owner}
              renderAsButton={renderAsButton}
              {...{
                isRecord,
                documentTypeId,
                revisionStage,
                isInlineApproval,
              }}
            />
          )}
        </Observer>
      )}
      {buttons.includes(PreviewControlButtons.SubmitApprovalButton) && (
        <SubmitForApproval
          docRevId={values.id as string}
          status={values.status}
          docRevOwner={owner?.user.name}
          updatedAt={getFormattedDateString(updatedAt, MomentFormats.DateTime)}
          renderAsButton={renderAsButton}
          hasBuildType={hasBuildType}
          {...{
            revisionChangeType,
            currentDocumentType,
          }}
        />
      )}
      {buttons.includes(PreviewControlButtons.InspectionControl) && (
        <InspectionControlsContainer {...{ documentRevision, renderAsButton }} />
      )}
      {buttons.includes(PreviewControlButtons.GeneratePDF) && (
        <GenerateHtmlPreview
          id={documentRevision.id}
          renderHTMLDefined={isRenderHTMLDefined}
          showDownloadButton={false}
        />
      )}
      {buttons.includes(PreviewControlButtons.RedlineButton) && (
        <RedlineButton
          {...{ isUserDocumentOwner, docTypeHasRedline, isLHRProductionBuild, renderAsButton }}
        />
      )}
      {buttons.includes(PreviewControlButtons.NewCloneEB) && (
        <CloneEBButton {...{ documentRevision, renderAsButton }} />
      )}
      {buttons.includes(PreviewControlButtons.NewClonePO) && (
        <ClonePOButton {...{ documentRevision, renderAsButton }} />
      )}
      {buttons.includes(PreviewControlButtons.ExportCsvButton) && (
        <ExportToCSVButton {...{ documentRevision, renderAsButton }} />
      )}
      {buttons.includes(PreviewControlButtons.ChangeOwner) && values.id && (
        <OwnerChangerContainer
          requestId={values.id}
          requestType={RequestType.Document}
          renderAsButton={renderAsButton}
        />
      )}
      {buttons.includes(PreviewControlButtons.VoidButton) && (
        <VoidButton {...{ documentRevision, renderAsButton }} />
      )}
      {buttons.includes(PreviewControlButtons.ExportButton) && (
        <ExportToEmail
          revisionId={documentRevision.id}
          canAccess={documentRevision.document.canAccess}
          renderAsButton={renderAsButton}
        />
      )}
    </>);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {isPO && documentRevision.poStatus && (
        <HeaderPOStatus poStatus={documentRevision.poStatus} />
      )}
      {isPO && isUserAdminEnforce && undoChangesLabel && isStatusReleased && (
        <StyledSubmitButton
          showNewButton={true}
          asyncState={asyncState}
          label={undoChangesLabel ?? ""}
          onClick={onUndoChangesClick}
          data-cy={"undo-changes"}
        />
      )}
      <Observer>
        {() => (
          <>
            {
              <StyledSubmitButton
                showNewButton={isNewLayout && !isCreateUrl}
                asyncState={asyncState}
                label={isDisabled ? "common.save" : "navigation.createDocument"}
                onClick={onFormClick}
                id="DocumentRevisionForm-submit"
                data-cy={"DocumentRevisionForm-submit"}
                disabled={
                  isCreateDocumentDisabled ||
                  _documentRevisionFormState?.disabledAction
                }
              />
            }
          </>
        )}
      </Observer>
      {!redlineActive && (
        <>
          {renderActionItems(initialButtons, true)}
          {restButtons.length > 0 && (
            <HeaderMenu>{renderActionItems(restButtons, false)}</HeaderMenu>
          )}
        </>
      )}
    </div>
  );
};

export default withActionButton(DocRevActions);
