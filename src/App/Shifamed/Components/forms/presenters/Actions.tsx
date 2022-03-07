/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useFormikContext } from "formik";
import { get, isEqual, isUndefined, keys, omit } from "lodash";
import { Observer } from "mobx-react";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SM } from "../../../..";
import { getFormattedDateString, MomentFormats } from "../../../../../common/utils/date";
import { companyActions, companySelectors } from "../../../../../state/ducks/company";
import { documentTypeSelectors } from "../../../../../state/ducks/documentRevisions/documentType";
import { DOC_TYPE_GROUP_OPTION } from "../../../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision, RevisionChangeType } from "../../../../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../../../../state/reducers";
import HeaderMenu from "../../../../../ui/components/common/header/Menu";
import OwnerChanger from "../../../../../ui/components/common/owner.changer/container";
import { RequestType } from "../../../../../ui/components/common/owner.changer/helpers/types";
import CopyEBButton from "../../../../../ui/components/forms/CopyEBButton";
import SubmitButton from "../../../../../ui/components/forms/SubmitButton";
import { isOperator } from "../../../../../ui/documentRevision/DocumentRevisionDisplay.container";
import { FormHeaderContext, isOwnerContext } from "../../../../../ui/documentRevision/forms/DocumentRevisionForm.container";
import ApproveAndRelease from "../../../../../ui/documentRevision/forms/presenters/approve.and.release/ApproveAndRelease";
import CancelButton from "../../../../../ui/documentRevision/forms/presenters/CancelButton";
import ExportToCSVButton from "../../../../../ui/documentRevision/forms/presenters/export.to.csv/ExportToCSV.button";
import ExportToEmail from "../../../../../ui/documentRevision/forms/presenters/export.to.email/ExportToEmail";
import RedlineButton from "../../../../../ui/documentRevision/forms/presenters/redline/Redline.button";
import { SubmitForApproval } from "../../../../../ui/documentRevision/forms/presenters/SubmitForApproval";
import UpgradeToLatestContainer from "../../../../../ui/documentRevision/forms/presenters/upgrade.to.latest/UpgradeToLatest.container";
import VoidButton from "../../../../../ui/documentRevision/forms/presenters/VoidButton";
import { checkCanBeCopied, checkIsDocumentDirectApproved, checkIsDocumentExportable, checkIsDocumentLHR, checkIsDocumentMPIOutput, checkIsDocumentRecord, hasOperatorRelease, hasRedline, hasSerializedCSV } from "../../../../../ui/documentRevision/helpers/checkDocumentGroup";
import { isDocumentRevisionInDraft, isDocumentRevisionReleased } from "../../../../../ui/documentRevision/helpers/documentRevisionStatus";
import { getShouldShowUpgradeForRecord, isFormWithInlineApproval, isInlineFormApproved } from "../../../../../ui/documentRevision/helpers/records";
import { isDocumentNumericRelease } from "../../../../../ui/documentRevision/helpers/revisionStage";
import { InspectionControlsContainer } from "../../../../../ui/documentRevision/InspectionControls/InspectionControls.container";
import { COMMON_INITIAL_VALUES, INDIVIDUAL_INITIAL_VALUES } from "../../../../../ui/form.builder/FBInput/FBInput.wrap";
import useShouldUpgradeToLatest from "../../../../../ui/hooks/useShouldUpgradeToLatest";
import { withNewActionButton } from "./ActionButton.wrap";
import FormSubmitButton from "./SubmitButton";


const NewDocRevActions: React.FunctionComponent<any> = ({ ...props }) => {
  const formik = useFormikContext();
  const dispatch = useDispatch();
  // isCreateDocumentDisabled is flag for temporary disabling
  // of create button until correct doc id is generated
  const { isCreateDocumentDisabled } = props;
  const { _formState, _documentRevisionFormState } = SM.useStores();

  const {
    documentRevision,
    values,
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
  const isLHRProductionBuild =  _formState?.isLHRProductionBuild || false;

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
    return (
      (Boolean(groupOptions?.includes(DOC_TYPE_GROUP_OPTION.EDITABLE_SCHEMA))) &&
      !isEqual(JSON.stringify(workspaceSchema), JSON.stringify(documentSchema))
    );
  }

  function setFBValue() {
    const workspaceSchema = _documentRevisionFormState?.schema;
    const schema = workspaceSchema?.map((schemaItem) => omit(schemaItem, ["autoFocus", "autoScrollTo"]));
    const values = get(formik, "values") as DocumentRevision;
    switch (_formState?.mode) {
      case "design":
        formik.setFieldValue("formTemplate", {
          outputDocumentTypes: (values?.outputDocumentTypes || [])
            .map((outputDoc) => ({ id: outputDoc.value })),
          schema,
        });
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
          // TEMPORARY FIX FOR BE VALIDATION
          formik.setFieldValue("formInput",
            omit(_formState?.getValues(),
              [...Object.keys({ ...COMMON_INITIAL_VALUES, ...INDIVIDUAL_INITIAL_VALUES }),
                "partType", "childForRevise"]));
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
    <>
      <Observer>
        {() => (
          <>
            {SM.isNewLayout ? <FormSubmitButton
              asyncState={asyncState}
              label={isDisabled ?
                "common.save" :
                "navigation.createDocument"
              }
              onClick={onFormClick}
              id="DocumentRevisionForm-submit"
              data-cy={"DocumentRevisionForm-submit"}
              disabled={isCreateDocumentDisabled || _documentRevisionFormState?.disabledAction}
            /> : <SubmitButton
              asyncState={asyncState}
              label={isDisabled ?
                "common.save" :
                "navigation.createDocument"
              }
              onClick={onFormClick}
              id="DocumentRevisionForm-submit"
              data-cy={"DocumentRevisionForm-submit"}
              disabled={isCreateDocumentDisabled || _documentRevisionFormState?.disabledAction}
            />}
          </>
        )}
      </Observer>
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
        <RedlineButton {...{ isUserDocumentOwner, docTypeHasRedline, isLHRProductionBuild }}/>
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
            <Observer>
              {() => (
                <ApproveAndRelease
                  id={values.id}
                  status={values.status}
                  needsSignature={_documentRevisionFormState?.docInfo.needsSignature || false}
                  isQms={_documentRevisionFormState?.docInfo.isQms || false}
                  documentName={_documentRevisionFormState?.docInfo.name || ""}
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
              )}
            </Observer>
          )
        }
        {isExportable && <ExportToEmail
          revisionId={documentRevision.id}
          canAccess={documentRevision.document.canAccess}
        />}
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
    </>
  );
};

export default withNewActionButton(NewDocRevActions);
