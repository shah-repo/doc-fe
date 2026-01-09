import { Button } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { generatePath, useHistory } from 'react-router-dom';
import { StyledButton } from '../../../../App/Shifamed/Components/forms/presenters/StyledListButton';
import { StyledMenuListItem } from '../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import { StyledMenuListItemText } from '../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import SM from '../../../../App/Shifamed/Utils/SM/SM';
import { translate } from '../../../../common/intl';
import { Approval, ApprovalStatus } from '../../../../state/ducks/common/types';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import { DocumentType } from '../../../../state/ducks/documentRevisions/documentType/types';
import {
  DocumentRevision,
  DocumentRevisionStatus,
  ErrorCodes,
  RevisionChangeType,
} from '../../../../state/ducks/documentRevisions/types';
import { taskActions } from '../../../../state/ducks/tasks';
import SupplierStatusDialog from '../../../app/alert.dialog/SupplierStatusDialog';
import VoidAlertDialog from '../../../app/alert.dialog/VoidAlertDialog';
import { toastError } from '../../../components/notifications';
import Text from '../../../components/Text';
import { DOCUMENT_REVISION_VERSION_URL } from '../../../constants/urls';
import { LHRS_ACCEPTED_QUANTITY } from '../../../form.builder/FBLHRStep/utils';
import { areRequiredEquipmentsSelected, isMpiOutputInsufficientQty } from '../../../form.builder/FBMaterialsTable/MaterialTable/components/utils';
import FBStore from '../../../form.builder/FBStore/FBStore';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';
import {
  checkIsDocumentEquipment,
  checkIsDocumentLHR,
  checkIsDocumentMPIOutput,
} from '../../helpers/checkDocumentGroup';

interface Props {
  documentRevision: DocumentRevision
  docRevId: string
  status?: DocumentRevisionStatus
  revisionChangeType: string
  currentDocumentType?: DocumentType
  renderAsButton?: boolean
  hasBuildType?: boolean
  isAssignBtnShown?: boolean
}

export interface ApprovalItem {
  docId: string
  displayRevision: string
  phase: string
}

export interface ApprovalFailureResponse {
  msgs: string[]
  isWarning: boolean
  isError: boolean
  itemsAsOfferingNotApproved: Array<{ docId: string, displayRevision: string }>
  isSupplierUndefined?: boolean
  errorItems: ApprovalItem[]
  warningItems: ApprovalItem[]
  isPartNotReleased?: boolean
}

export const SubmitForApproval: React.FC<Props> = ({
  documentRevision,
  docRevId,
  status,
  revisionChangeType,
  currentDocumentType,
  renderAsButton,
  hasBuildType,
  isAssignBtnShown,
}) => {
  const isNewLayout = SM.isNewLayout;
  const dispatch = useDispatch();
  const history = useHistory();
  const dialog = useDialog();
  const supplierStatusDialog = useDialog();
  const applyTransition = useActionCreator(
    documentRevisionsActions.applyTransition,
  );
  const closeWorkOrder = useActionCreator(taskActions.closeWO);
  const isEquipment = checkIsDocumentEquipment(
    currentDocumentType?.groupOptions,
  );
  const isObsolete = isEquipment
    ? false
    : revisionChangeType === RevisionChangeType.Obsolete;
  const isTypeMpiOutput = checkIsDocumentMPIOutput(
    currentDocumentType?.groupOptions,
  );
  const isLhrDoc = checkIsDocumentLHR(currentDocumentType?.groupOptions);
  let label = isTypeMpiOutput
    ? 'record.complete.step.mpi.step'
    : 'record.submit.for.approval';
  const hasPendingApprovals = documentRevision?.approvals?.some(
    (approval: Approval) =>
      [ApprovalStatus.Draft, ApprovalStatus.Pending].includes(approval.status),
  );

  const isApproverAdded = !documentRevision?.approvals?.some(
    (approval: Approval) => approval.status !== ApprovalStatus.Abandoned,
  );

  const [hasInsufficientQty, setHasInsufficientQty] = useState(false);
  const [insufficientMaterials, setInsufficientMaterials] = useState<string[]>([]);
  const [areAllEquipmentsSelected, setAreAllEquipmentsSelected]
    = useState(true);
  const [unselectedEquipment, setUnselectedEquipment] = useState<string[]>([]);

  const {
    equipmentsFromSchema,
    neededMaterials,
    equipmentsFromMetadata,
    materialsFromMetadata,
  } = useMemo(() => {
    const schema = documentRevision?.schema ?? documentRevision?.formDocument?.formTemplate?.schema ?? [];

    const smartRefs = documentRevision?.smartReferencesTo ?? [];

    const mpiProcedureSchema = schema.filter(
      (item) => item.type === 'mpiprocedure',
    );

    return {
      equipmentsFromSchema: mpiProcedureSchema.map(
        (item) => item.editorConfig?.equipment ?? [],
      ),

      neededMaterials: mpiProcedureSchema.map(
        (item) => item.editorConfig?.materials ?? [],
      ),

      equipmentsFromMetadata: smartRefs
        .filter((ref) => ref.metadata?.equipmentId && ref?.active)
        .map((ref) => ref.metadata),
      materialsFromMetadata: smartRefs
        .filter((ref) => ref.metadata?.materialId != null && ref?.active)
        .map((ref) => ({
          materialId: ref.metadata.materialId,
          quantity: ref.metadata.quantity,
        })),
    };
  }, [
    documentRevision?.formDocument?.formTemplate?.schema,
    documentRevision?.smartReferencesTo,
  ]);

  useEffect(() => {
    if (!isTypeMpiOutput) {
      setAreAllEquipmentsSelected(true);
      setUnselectedEquipment([]);
      setHasInsufficientQty(false);
      setInsufficientMaterials([]);
      return;
    }

    const lhrsStartQuantity
      = documentRevision?.formInput?.[LHRS_ACCEPTED_QUANTITY];

    const equipmentSelectionResult = areRequiredEquipmentsSelected(
      equipmentsFromSchema,
      equipmentsFromMetadata,
    );

    setAreAllEquipmentsSelected(equipmentSelectionResult.isSelected);
    setUnselectedEquipment(equipmentSelectionResult.unselectedEquipment);

    const materialQtyResult = isMpiOutputInsufficientQty(
      neededMaterials,
      materialsFromMetadata,
      lhrsStartQuantity,
    );

    setHasInsufficientQty(materialQtyResult.hasInsufficientQty);
    setInsufficientMaterials(materialQtyResult.insufficientMaterials);
  }, [
    isTypeMpiOutput,
    equipmentsFromSchema,
    equipmentsFromMetadata,
    neededMaterials,
    materialsFromMetadata,
    documentRevision?.formInput,
    documentRevision?.document?.smartReferencesTo,
  ]);

  const isDisabledApproval
    = isTypeMpiOutput
    && (isApproverAdded
      || hasPendingApprovals);

  const [errorResponse, setErrorResponse] = useState<ApprovalFailureResponse>();

  if (isAssignBtnShown) {
    label = 'record.assign';
  }

  const releaseAsync = useAsync({
    onError: (error) => {
      try {
        const parsedError = JSON.parse(error as string);
        if (
          parsedError.status === ErrorCodes.PRECONDITION_FAILED
          && parsedError.response
        ) {
          setErrorResponse(parsedError.response as ApprovalFailureResponse);
          supplierStatusDialog.open();
        } else {
          toastError(error as string);
          dialog.close();
        }
      } catch (err) {
        toastError(error as string);
        dialog.close();
      }
    },
  });
  const updateDocAsync = useAsync({
    onSuccess: () => {
      if (FBStore?.isHistoryTabSelected) {
        dispatch(documentRevisionsActions.loadAudit(docRevId));
      }
      releaseRecord();
    },
  });
  const closeWOAsync = useAsync({
    onSuccess: () => {
      dispatch(documentRevisionsActions.load(docRevId));
      const documentVersionUrl = generatePath(DOCUMENT_REVISION_VERSION_URL, {
        documentId:
          documentRevision.smartReferencesTo?.[0]?.toDocRev?.documentId ?? '',
        documentRevisionId:
          documentRevision.smartReferencesTo?.[0]?.toDocRevId ?? '',
      });
      history.push(documentVersionUrl, { toTabId: 'details' });
    },
  });

  const releaseRecord = (event?, ignoreWarning?: boolean) => {
    if (hasInsufficientQty) {
      console.log('Insufficient Materials:', insufficientMaterials, insufficientMaterials.length);
      const lotsDocIds = insufficientMaterials.reduce<string[]>((acc, materialId) => {
        const lotDocIds = documentRevision?.usedDocumentsInLHRS?.[materialId]?.docId;
        const docIdArray = Array.isArray(lotDocIds) ? lotDocIds : (typeof lotDocIds === 'string' ? [lotDocIds] : []);
        return [...acc, ...docIdArray];
      }, []);
      toastError(translate('form.builder.lhrs.insufficient.quantity.error.message', { lots: lotsDocIds.join(', ') }));
      return;
    }

    if (!areAllEquipmentsSelected) {
      const usedDocInLHRS = documentRevision?.usedDocumentsInLHRS;
      const equipmentId = unselectedEquipment[0];
      const equipmentRef = usedDocInLHRS?.[equipmentId];
      toastError(translate('form.builder.lhrs.equipment.selection.error.message', { equipmentId: equipmentRef?.docId }));
      return;
    }

    if (!hasBuildType && isLhrDoc) {
      toastError(translate('form.builder.lhr.build.type.error.message'));
      return;
    }
    if (isTypeMpiOutput) {
      releaseAsync.start(closeWorkOrder, docRevId, closeWOAsync);
    } else {
      releaseAsync.start(
        applyTransition,
        docRevId,
        ignoreWarning ?? false,
        'in_review',
        releaseAsync,
      );
    }
  };

  if (!docRevId || status !== DocumentRevisionStatus.Draft) {
    return null;
  }

  return (
    <>
      {isNewLayout ? (
        renderAsButton ? (
          <StyledButton
            color="primary"
            disabled={isDisabledApproval}
            onClick={isObsolete ? dialog.open : releaseRecord}
            id="ApproveAndRelease-button"
            data-cy="ApproveAndRelease-button"
          >
            <Text message={isObsolete ? 'common.void' : label} />
          </StyledButton>
        ) : (
          <StyledMenuListItem button alignItems="flex-start">
            <StyledMenuListItemText
              onClick={isObsolete ? dialog.open : releaseRecord}
              id="ApproveAndRelease-button"
              data-cy="ApproveAndRelease-button"
              primary={<Text message={isObsolete ? 'common.void' : label} />}
            />
          </StyledMenuListItem>
        )
      ) : (
        <Button
          color="secondary"
          variant="outlined"
          onClick={isObsolete ? dialog.open : releaseRecord}
          id="ApproveAndRelease-button"
          data-cy="ApproveAndRelease-button"
        >
          <Text message={isObsolete ? 'common.void' : label} />
        </Button>
      )}
      {documentRevision && (
        <VoidAlertDialog
          dialog={dialog}
          documentRevision={documentRevision}
          async={updateDocAsync}
          voidAction={documentRevisionsActions.save}
        />
      )}
      {errorResponse && (
        <SupplierStatusDialog
          dialog={supplierStatusDialog}
          data={errorResponse}
          confirmAction={(e) => releaseRecord(e, true)}
        />
      )}
    </>
  );
};
