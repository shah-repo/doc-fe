import { Grid } from "@material-ui/core";
import { concat, uniqBy } from "lodash";
import { reaction } from "mobx";
import React from "react";
import { useDispatch } from "react-redux";
import { FB, FBFormState, FBMPIProcedureSelectProps, FBMPIProcedureSelectState, FBMPIProcedureSelectValue, FBProcedureFormActions } from "..";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { DOC_TYPE_GROUP } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision, SmartReferenceType } from "../../../state/ducks/documentRevisions/types";
import Colors from "../../layout/theme/utils/colors";

export const withFBMPIProcedureSelect = <T extends FBMPIProcedureSelectProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    isOptionDisabled,
    renderOptionWithDate,
    mpiProcedureSelectState,
    formState,
    initialValues,
    name = "",
    type,
    ...props
  }: T) => {
    // MARK: @config
    const { dialogState, workspaceState, mpiProcedureState } = FB.useStores();
    const dispatch = useDispatch();
    formState = FB.useRef<FBFormState>(FBFormState, {});
    mpiProcedureSelectState = FB.useRef(FBMPIProcedureSelectState, initialValues?.id);
    const { id, document } = workspaceState || {};
    const isDocPIInstance = document?.document.documentType.group === DOC_TYPE_GROUP.PI_INSTANCE;
    const isLHRProductionBuild =  workspaceState?.isLHRProductionBuild || false;

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
            uniqBy(concat(data.smartReferencesTo, data.document.smartReferencesTo), "id");
          const partsSelected = refs?.reduce((selected, ref) => {
            if (ref?.metadata?.fieldId === name
                && ref.active
                && (ref.type === SmartReferenceType.EquipmentReplacement || ref.type === SmartReferenceType.LotUsage)) {
              selected.push({
                ...ref.metadata,
                refId: ref.id,
                pmDueDate: ref.toDocRev?.precalc.pm_due_date,
                calDueDate: ref.toDocRev?.precalc.cali_due_date,
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

    // MARK: @helpers
    isOptionDisabled = (option) => {
      const pmDate = FB.calculateDateByType(option, "preventativeMaintenance" );
      const calDate = FB.calculateDateByType(option, "calibration" );

      return Boolean(isLHRProductionBuild &&
      option.document.documentType.equipmentEnforceProd &&
      (pmDate || calDate));
    };

    // eslint-disable-next-line react/display-name
    renderOptionWithDate = (option: any) => {
      const pmDate = FB.calculateDateByType(option, "preventativeMaintenance" );
      const calDate = FB.calculateDateByType(option, "calibration" );

      return <Grid container>
        <Grid item xs={3} >
          {option.document.docId}
        </Grid>
        <Grid item xs={9} style={{ textAlign: "right", color: Colors.latest_red_varient, fontSize: "14px" }}>
          {pmDate && <span>PM Due: {getFormattedDateString(pmDate, MomentFormats.BriefDate)} </span>}
          {calDate && <span>Cal Due: {getFormattedDateString(calDate, MomentFormats.BriefDate)}</span>}
        </Grid>
      </Grid>;
    };

    function handleAdd() {
      if (!id) { return; }
      const formValue = formState?.getValues() as FBMPIProcedureSelectValue;
      const { quantity, unit, usedOverride } = formValue;
      const part = {
        fieldId: name,
        forPreselected: { id: initialValues?.id },
        quantity,
        unit: unit || initialValues?.unit,
        usedOverride: { id: (usedOverride as DocumentRevision).id },
        type: type.toUpperCase() as "MATERIAL" | "EQUIPMENT",
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
      mpiProcedureSelectState,
      formState,
      initialValues,
      name,
      type,
    });
  };

  Comp.displayName = "withFBMPIProcedureSelect";
  return Comp;
};
