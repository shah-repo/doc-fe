import { Box, Grid, Typography } from '@material-ui/core';
import { concat, isUndefined, uniqBy } from 'lodash';
import { reaction } from 'mobx';
import moment from 'moment';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { EQStatus, FB, FBAutocompleteAsyncOption, FBFormState, FBMPIProcedureSelectProps, FBMPIProcedureSelectState, FBMPIProcedureSelectValue, FBProcedureFormActions, FBSelectedEQ } from '..';
import { getFormattedDateString, MomentFormats } from '../../../common/utils/date';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DOC_TYPE_GROUP } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, SmartReferenceType } from '../../../state/ducks/documentRevisions/types';
import { toastError } from '../../components/notifications';
import { isMoreDigitsAfterDecimal } from '../../dashboard.new/line.items/common/Utils';
import Colors from '../../layout/theme/utils/colors';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';

export const withFBMPIProcedureSelect = <T extends FBMPIProcedureSelectProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    isOptionDisabled,
    renderOptionWithDate,
    onChange,
    mpiProcedureSelectState,
    formState,
    initialValues,
    name = '',
    type,
    ...props
  }: T) => {
    // MARK: @config
    const { dialogState, workspaceState, mpiProcedureState } = FB.useStores();
    const dispatch = useDispatch();
    formState = FB.useRef<FBFormState>(FBFormState, {});
    mpiProcedureSelectState = FB.useRef(FBMPIProcedureSelectState, initialValues?.id);
    const { id, document } = workspaceState || {};
    const [selectedEQ, setEQ] = useState<FBSelectedEQ | undefined>();
    const isDocPIInstance = document?.document.documentType.group === DOC_TYPE_GROUP.PI_INSTANCE;
    const isLHRProductionBuild =  workspaceState?.isLHRProductionBuild || false;
    const smartRefLHR = document?.smartReferencesTo?.find((item) => item.type === SmartReferenceType.HiddenPiInstance);
    const enforceFlag = Boolean(smartRefLHR?.toDocRev?.document.typeSpecificConfig?.eqProdEnforceConfig.value);
    const intl = useIntl();

    React.useEffect(() => {
      dialogState?.setActions(
        <FBProcedureFormActions {...{ handleAdd, handleCancel }} />
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MARK: @reactions
    // MARK: @reactions
    React.useEffect(() => {
      reaction(
        () => mpiProcedureSelectState?.useOverrideApi.data,
        (data?: DocumentRevision) => {
          if (!data) { return; }
          const refs = isDocPIInstance ?
            data.smartReferencesTo :
            uniqBy(concat(data.smartReferencesTo, data.document.smartReferencesTo), 'id');
          const partsSelected = refs?.reduce((selected, ref) => {
            if (ref?.metadata?.fieldId === name
                && ref.active
                && (ref.type === SmartReferenceType.EquipmentReplacement || ref.type === SmartReferenceType.LotUsage)) {
              selected.push({
                ...ref.metadata,
                refId: ref.id,
                pmDueDate: ref.toDocRev?.precalc?.pm_due_date,
                calDueDate: ref.toDocRev?.precalc?.cali_due_date,
                overrideDocId: ref.toDocRev?.document.docId,
              });
            }
            return selected;
          }, [] as Partial<FBMPIProcedureSelectValue>[]);

          mpiProcedureState?.setPartsSelected(partsSelected);
          id && dispatch(documentRevisionsActions.loadAudit(id));
          id && dispatch(documentRevisionsActions.reload(id));
        }
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
      reaction(
        () => mpiProcedureState?.deleteLotApi.data,
        (data?: DocumentRevision) => {
          if (!data) { return; }
          id && dispatch(documentRevisionsActions.loadAudit(id));
          id && dispatch(documentRevisionsActions.reload(id));
        }
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isDateOverdue = (date) => {
      if (!date) { return; }
      const currentDate = getFormattedDateString(Date.now());
      return moment(currentDate).isAfter(date);
    };

    const isEqActive = (eqStatus) => {
      if (eqStatus !== EQStatus.Inactive && eqStatus !== EQStatus.Retired) { return true; }
      return false;
    };

    // MARK: @helpers
    isOptionDisabled = (option) => {
      const pmDate = FB.calculateDateByType(option, 'preventativeMaintenance' );
      const calDate = FB.calculateDateByType(option, 'calibration' );
      const isOverdue =  isDateOverdue(pmDate) || isDateOverdue(calDate);

      if (!enforceFlag && !isEqActive(option.eqStatus)) {
        return true;
      }

      if (enforceFlag && Boolean(isLHRProductionBuild)) {
        return !isEqActive(option.eqStatus) || isOverdue;
      }
      return !isEqActive(option.eqStatus);
    };

    // eslint-disable-next-line react/display-name
    renderOptionWithDate = (option: any) => {
      const pmDate = FB.calculateDateByType(option, 'preventativeMaintenance' );
      const calDate = FB.calculateDateByType(option, 'calibration' );

      return <Grid container>
        <Grid item xs={2}>
          <Typography noWrap>
            {option.document.docId}<span> &#9642;</span>
          </Typography>
        </Grid>
        <Grid item >
          <Typography noWrap>
            {`rev ${option.displayRevision} `}
          </Typography>
        </Grid>
        <Grid item xs={8} >
          <Typography noWrap>
            {`- ${option.name}`}
          </Typography>
        </Grid>
        <Grid
          item xs={12}
          style={{ textAlign: 'left', color: Colors.latest_red_varient, fontSize: '14px', paddingBottom: '4px' }}
        >
          {calDate && <span> Cal Due: {getFormattedDateString(calDate, MomentFormats.BriefDate)} </span>}
          {pmDate && calDate && <Box component="span" style={{ color: Colors.black }}>&#9642;</Box>}
          {pmDate && <span> PM Due: {getFormattedDateString(pmDate, MomentFormats.BriefDate)} </span>}
        </Grid>
      </Grid>;
    };

    onChange = async () => {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      const formValue = await formState?.getValues() as FBMPIProcedureSelectValue;
      const { usedOverride } = formValue;
      const id =  (usedOverride as DocumentRevision).id;

      const item: any = FBAutocompleteAsyncStore.getValue(FBAutocompleteAsyncOption.releasedEquipment, id);
      const pmDate = FB.calculateDateByType(item, 'preventativeMaintenance' );
      const calDate = FB.calculateDateByType(item, 'calibration' );
      setEQ({
        status: item?.eqStatus,
        pmDate,
        calDate,
      });
    };

    function handleAdd() {
      if (!id) { return; }
      const formValue = formState?.getValues() as FBMPIProcedureSelectValue;
      const { quantity, unit, usedOverride } = formValue;
      const isMaterial = type === 'materials';

      if (isMaterial && isUndefined(quantity)) { return; }
      if (isMaterial && !usedOverride) { return; }
      if (isMaterial && quantity && quantity <= 0) {
        toastError(intl.formatMessage({ id: 'document.revision.quantity.positive.error' }));
        return;
      }
      if (isMaterial && quantity && isMoreDigitsAfterDecimal(quantity, 10)) {
        toastError(intl.formatMessage({ id: 'document.revision.quantity.decimals.error' },
          { name: intl.formatMessage({ id: 'form.builder.quantity' } ) }));
        return;
      }
      const part = {
        fieldId: name,
        forPreselected: { id: initialValues?.id },
        quantity,
        unit: unit || initialValues?.unit,
        usedOverride: { id: (usedOverride as DocumentRevision).id },
        type: type.toUpperCase() as 'MATERIAL' | 'EQUIPMENT',
      };
      mpiProcedureSelectState?.useOverride(id, part);
      mpiProcedureState?.addPartsSelected({
        ...part,
        materialId: initialValues?.id,
        overrideDocId: (usedOverride as DocumentRevision)?.document?.docId,
      });

      handleCancel?.();
    }

    function handleCancel() {
      dialogState?.closeDialog();
    }

    // MARK: @methods

    return Component({
      ...(props as T),
      isOptionDisabled,
      renderOptionWithDate,
      onChange,
      mpiProcedureSelectState,
      formState,
      initialValues,
      name,
      type,
      selectedEQ,
    });
  };

  Comp.displayName = 'withFBMPIProcedureSelect';
  return Comp;
};
