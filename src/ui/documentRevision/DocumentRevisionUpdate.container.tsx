import { debounce, get, has, isEmpty, map, pick, set } from "lodash";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DocumentRevisionSummary, SM } from "../../App";
import { authSelectors } from "../../state/ducks/auth";
import { GroupTag } from "../../state/ducks/auth/types";
import { companyActions, companySelectors } from "../../state/ducks/company";
import { documentRevisionsActions } from "../../state/ducks/documentRevisions";
import { DocumentRevision, DocumentRevisionEditRequestBody, DocumentRevisionStatus } from "../../state/ducks/documentRevisions/types";
import { FormContext } from "../components/forms/FormContext";
import { compareValuesToSubmit } from "../components/forms/helpers";
import { FBDAMFields } from "../form.builder";
import { FBEndpoint } from "../form.builder/defaults/FBEndpoint";
import { FBFormStateContext } from "../form.builder/FBForm/FBForm.wrap";
import FBDataStore from "../form.builder/FBStore/FBDataStore";
import FBStore from "../form.builder/FBStore/FBStore";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useGetHasTag from "../hooks/useGetHasTag";
import { isOperator } from "./DocumentRevisionDisplay.container";
import DocumentRevisionForm from "./forms/DocumentRevisionForm.container";
import { toDocumentRevisionEditRequestBody, toDocumentRevisionFormValues } from "./forms/transform";
import { DocumentRevisionFormValues } from "./forms/types";
import { checkIsDocumentDAM, checkIsDocumentPO, checkIsDocumentReceivable } from "./helpers/checkDocumentGroup";
import { canEditDocumentRevision } from "./helpers/documentRevisionPermissions";
import { isDocumentRevisionHasOutput } from "./helpers/documentRevisionStatus";

interface Props {
  documentId?: string;
  documentRevision: DocumentRevision;
  onDirtyFlagChange?: (dirty: boolean) => void;
  canChangeOwnerShip?: boolean;
  isNewVersion?: boolean;
}
// TO-DO Move To Context Folder
export let documentRevisionStatusContextFromCR = React.createContext<DocumentRevisionStatus | undefined>(undefined);

const DocumentRevisionUpdateContainer: React.FunctionComponent<Props> = ({
  documentRevision,
  onDirtyFlagChange,
  documentId,
  canChangeOwnerShip,
  isNewVersion,
}) => {
  const dispatch = useDispatch();
  const redlineActive = useSelector(companySelectors.getRedlineActive);
  const currentUserEmail = useSelector(authSelectors.currentUserEmail);
  const initialValues = useMemo(() => toDocumentRevisionFormValues(documentRevision), [documentRevision]);
  const isCurrentUserOperator = React.useContext(isOperator);
  const { docId } = documentRevision.document;
  const formGroupOptions = documentRevision?.document.documentType.groupOptions;
  const isDAM = checkIsDocumentDAM(formGroupOptions);
  const isReceivable = checkIsDocumentReceivable(formGroupOptions);
  useDocumentTitle(docId);
  const status = documentRevision ? documentRevision.status : undefined;
  documentRevisionStatusContextFromCR = React.createContext(status);
  const saveAction = useActionCreator(documentRevisionsActions.save);
  const isPO = checkIsDocumentPO(documentRevision?.document.documentType.groupOptions);
  const isPOEditState = useGetHasTag(GroupTag.DASHBOARD_ADMIN) && isPO && SM.isNewVersion
        && isDocumentRevisionHasOutput(documentRevision);
  // Disabled because of ENC-7826
  // const saveWithNoResponseAction = useActionCreator(documentRevisionsActions.saveWithNoResponse);

  const [doNotPrompt, setDoNotPrompt] = React.useState(false);
  const async = useAsync<DocumentRevision>({
    onSuccess: () => {
      if (redlineActive) {
        dispatch(companyActions.redlineConfig(false));
      }
      setDoNotPrompt(true);
    },
  });

  useEffect(() => {
    FBDataStore.setRefreshData(documentRevision);
  }, [documentRevision]);

  useEffect(() => () => {
    FBStore.damData = { approvalMatrix: [], approvalRoles: [] };
    documentRevisionStatusContextFromCR = React.createContext<undefined | DocumentRevisionStatus>(undefined);
  }, []);

  if (!(canEditDocumentRevision(documentRevision, currentUserEmail, isCurrentUserOperator)) && !isPOEditState) {
    return (
      <DocumentRevisionSummary {...{ documentRevision, canChangeOwnerShip }}/>
    );
  }

  const handleSave = (data: DocumentRevisionEditRequestBody, helpers) => {
    async.reset();

    const promise = async.start(
      saveAction,
      documentRevision.id,
      data,
      async,
      helpers,
    );
    // workaround when editing document through CR view. The form is marked dirty when editing FB fields
    promise?.then(() => {
      if (FBStore?.isHistoryTabSelected) {
        dispatch(documentRevisionsActions.loadAudit(documentRevision.id ));
        FBStore.audit.set({
          url: FBEndpoint.DocumentRevisionAudit,
          urlValues: { documentId: documentRevision.id },
          method: "get",
        });
      }

      FBDataStore?.setRefreshData({
        ...FBDataStore?.refreshData,
        ...data,
        formInput: data.formInput ?? FBDataStore?.refreshData?.formInput,
      });
    });
  };

  const onSubmit = (values: DocumentRevisionFormValues, helpers, cleanInitialValues) => {
    // Hack to take updated formInput
    const formStateContext = FBFormStateContext as any;
    if (!isEmpty(formStateContext?._currentValue) && values.formInput) {
      set(values, "formInput", formStateContext?._currentValue);
    }
    const dataToSubmit = compareValuesToSubmit(cleanInitialValues, values, toDocumentRevisionEditRequestBody);
    const formInput = get(dataToSubmit, "formInput");

    if (isDAM && !isEmpty(FBStore.damData?.approvalMatrix) && isEmpty(dataToSubmit)) {
      set(dataToSubmit, "formInput", {
        ...formInput, ...{
          [FBDAMFields.DAM]: FBStore.damData?.["approvalMatrix"],
          [FBDAMFields.DAR]: FBStore.damData?.["approvalRoles"],
        },
      });
    }
    if (has(formInput, FBDAMFields.DAR) && has(formInput, FBDAMFields.DAM)) {
      const approvalRoles = get(formInput, FBDAMFields.DAR);
      const rawApprovalMatrix = get(formInput, FBDAMFields.DAM);
      const approvalMatrix = map(rawApprovalMatrix.approvalMatrix ?? rawApprovalMatrix, (am) => {
        map(new Array(approvalRoles.length), (_, i) => {
          if (isEmpty(am.approvalRoles.stage1)) {
            am.approvalRoles.stage1 = [am.approvalRoles.stage1?.[i] || false];
          } else {
            am.approvalRoles.stage1[i] = am.approvalRoles.stage1?.[i] || false;
          }
          if (isEmpty(am.approvalRoles.stage2)) {
            am.approvalRoles.stage2 = [am.approvalRoles.stage2?.[i] || false];
          } else {
            am.approvalRoles.stage2[i] = am.approvalRoles.stage2?.[i] || false;
          }
          if (isEmpty(am.approvalRoles.stage3)) {
            am.approvalRoles.stage3 = [am.approvalRoles.stage3?.[i] || false];
          } else {
            am.approvalRoles.stage3[i] = am.approvalRoles.stage3?.[i] || false;
          }
          if (isEmpty(am.approvalRoles.admStage)) {
            am.approvalRoles.admStage = [am.approvalRoles.admStage?.[i] || false];
          } else {
            am.approvalRoles.admStage[i] = am.approvalRoles.admStage?.[i] || false;
          }
        });
        return am;
      });
      set(dataToSubmit, "formInput", {
        ...formInput,
        [FBDAMFields.DAR]: approvalRoles, [FBDAMFields.DAM]: approvalMatrix,
      });
    }
    const redlineDataToSubmit = pick(values, "schema", "formInput", "redline");

    // Receivable: Missing form input data on First time when initial values form input is null and autosave is disabled
    if (isReceivable && isEmpty(dataToSubmit) && isEmpty(values.formInput)) {
      const hasReceivableKeyExists = Object.keys(
        formStateContext?._currentValue
      )?.some((key) => key.includes("receivable"));
      if (hasReceivableKeyExists) {
        set(dataToSubmit, "formInput", formStateContext?._currentValue);
      }
    }

    if (redlineActive) {
      if (
        isEmpty(dataToSubmit) ||
        (Object.keys(dataToSubmit).includes("formInput") &&
          Object.keys(dataToSubmit).length === 1)
      ) {
        dispatch(companyActions.redlineConfig(false));
        redlineDataToSubmit.redline = false;
      }
      return handleSave( redlineDataToSubmit as DocumentRevisionEditRequestBody, helpers);
    }

    if (isEmpty(dataToSubmit)) {
      helpers.setSubmitting(false);
      return;
    }

    // Disabled because of ENC-7826
    /* if (shouldHaveNoResponse(dataToSubmit, documentRevision)) {
      async.reset();
      async.start(
        saveWithNoResponseAction,
        documentRevision.id,
        dataToSubmit as DocumentRevisionEditRequestBody,
        async,
      );
      helpers.resetForm();
      return;
    } */

    handleSave(dataToSubmit as DocumentRevisionEditRequestBody, helpers);
  };

  const debouncedSubmit = debounce(onSubmit, 1000);

  return (
    <FormContext.Provider value={{ submitOnChange: true }}>
      <DocumentRevisionForm
        doNotPrompt={doNotPrompt}
        asyncState={async.asyncState}
        onSubmit={debouncedSubmit}
        initialValues={initialValues}
        onDirtyFlagChange={onDirtyFlagChange}
        documentRevision={documentRevision}
        canChangeOwnerShip={canChangeOwnerShip}
        showRevisionTypeChange
        isNewVersion={isNewVersion}
      />
    </FormContext.Provider>
  );
};

export default DocumentRevisionUpdateContainer;
