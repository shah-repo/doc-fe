import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import { isEmpty, kebabCase } from 'lodash';
import { useObserver } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { FB, FBInputProps, FBTextField, FBWorkspaceModeOptions } from '..';
import { translate } from '../../../common/intl';
import { allocationActions } from '../../../state/ducks/Allocation';
import { WorkOrderTypes, WO_PART_KEY_NAME, WO_TYPE_KEY } from '../../../state/ducks/documentRevisions/documentType/types';
import AlertDialog from '../../app/alert.dialog/AlertDialog';
import ErrorBlock from '../../components/forms/fields/ErrorBlock';
import { FBAutocompleteAsync, FBAutocompleteAsyncOption } from '../../form.builder';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useDialog from '../../hooks/useDialog';
import { Colors } from '../../layout/theme-next';
import { Translation } from '../../translations/types';
import { LatestPartRevisionInfo } from '../FBAllocation/interface';
import FBUnitMeasures from '../FBUnitMeasures/FBUnitMeasures';
import { PART_TO_BE_MADE } from './constants';
import { styles } from './styles';

const FBWorkOrderPartDetails: React.FC<FBInputProps> = ({
  name = '',
  label,
  type,
  ...props
}) => {
  const { formState, workspaceState } = FB.useStores();

  const isPreview = formState?.workspaceMode === FBWorkspaceModeOptions.PREVIEW;
  const cyName = kebabCase(name);
  const workOrderType = useObserver(() => (workspaceState?.formInputSync?.get(WO_TYPE_KEY)));
  const partsDefaultValue = useObserver(() => (workspaceState?.formInputSync?.get(PART_TO_BE_MADE)));
  const unitsDefaultValue = useObserver(() => (workspaceState?.formInputSync?.get(`${name}_unit`)));
  const quantityDefaultValue = useObserver(() => (workspaceState?.formInputSync?.get(`${name}_quantity`)));
  const partSelectionLabel = label ?? 'form.builder.wo.part.selector';
  const classes = styles();
  const fetchAvailablePartsAction = useActionCreator(allocationActions.fetchLatestPartRevision);
  const deleteAllocation = useActionCreator(allocationActions.deleteAllocation);
  const [latestRevisionInfo, setLatestRevisionInfo] = useState<LatestPartRevisionInfo>();
  const [prevSelectedPartId, setPrevSelectedPartId] = useState<string>();
  const dialog = useDialog();
  const openRevChangeDialog = () => { !props.disabled && dialog.open(); };
  const isLatestRevisionAvailable
    = !isEmpty(partsDefaultValue)
    && !isEmpty(latestRevisionInfo)
    && partsDefaultValue?.id !== latestRevisionInfo?.id;

  const fetchAvailablePartsAsync = useAsync({
    onSuccess: (data?: LatestPartRevisionInfo) => {
      data && setLatestRevisionInfo(data);
    },
  });

  const deleteAllocationAsync = useAsync({
    onSuccess: dialog.close,
    onError: dialog.close,
  });

  useEffect(() => {
    const partId = partsDefaultValue?.id;
    if (partId) {
      setPrevSelectedPartId(partId);
      fetchAvailablePartsAsync.start(
        fetchAvailablePartsAction,
        partId,
        fetchAvailablePartsAsync,
      );
    } else if (prevSelectedPartId && !partId) {
      deleteAllocationAsync.start(deleteAllocation,
        workspaceState?.document?.id,
        deleteAllocationAsync,
      );
    }
  }, [partsDefaultValue]);

  const onRevChange = async () => {
    if (latestRevisionInfo?.id) {
      await workspaceState?.saveDocRev({
        ...workspaceState?.formInput,
        [WO_PART_KEY_NAME]: { id: latestRevisionInfo?.id },
      });
      formState?.inputState.get(WO_PART_KEY_NAME)?.setRender();
      deleteAllocationAsync.start(deleteAllocation,
      workspaceState?.document?.id,
      deleteAllocationAsync,
      );
    }
  };

  return (
    <Grid container spacing={1}>
      {isLatestRevisionAvailable && (
        <Grid item xs="auto">
          <span className={classes.defaultIcon} onClick={openRevChangeDialog}>
            <Tooltip
              arrow
              title={translate('allocation.part.replace.revision', {
                revision: latestRevisionInfo?.displayRevision,
              })}
              placement="top-start"
            >
              <FontAwesomeIcon
                data-cy="new-revision-available"
                color={Colors.primaryLight}
                className={classes.defaultIcon}
                icon={solid('circle-exclamation')}
              />
            </Tooltip>
          </span>
        </Grid>
      )}
      <Grid
        item
        xs={isLatestRevisionAvailable ? 5 : 6}
      >
        <FBAutocompleteAsync
          {...props}
          name={PART_TO_BE_MADE}
          label={partSelectionLabel}
          placeholder="form.builder.select"
          optionId={FBAutocompleteAsyncOption.releasedParts}
          optionValueType="id"
          defaultValue={partsDefaultValue}
          type={type}
          disabled={props.disabled}
          withState={true}
          autosave={true}
        />
        <ErrorBlock
          label={partSelectionLabel as Translation}
          isErrored={
            !props.disabled
            && !partsDefaultValue
            && [WorkOrderTypes.MAKE_KIT, WorkOrderTypes.MAKE_PRODUCT].includes(
              workOrderType,
            )
          }
        />
      </Grid>
      <Grid item md={3} xs={6}>
        <FBTextField
          {...props}
          dataCy={`${cyName}-quantity`}
          label="form.builder.wo.part.quantity"
          name={`${name}_quantity`}
          type="number"
          defaultValue={quantityDefaultValue}
          inputProps={{ min: '1' }}
          gutter={false}
          showErrorMsg={false}
          placeholder="1"
        />
      </Grid>
      <Grid item md={3} xs={6}>
        {isPreview ? (
          <FBTextField
            {...props}
            dataCy={`${cyName}-unit`}
            label="form.builder.field.units"
            name={`${name}_unit`}
            gutter={false}
            placeholder="0"
          />
        ) : (
          <FBUnitMeasures
            {...props}
            label="form.builder.field.units"
            gutter={false}
            defaultValue={unitsDefaultValue}
            name={`${name}_unit`}
          />
        )}
      </Grid>
      <AlertDialog
        confirmAction={onRevChange}
        cancelAction={dialog.close}
        confirmLabel="common.yes.proceed"
        cancelLabel="common.cancel"
        message="allocation.part.replace.revision.error"
        {...{ dialog }}
      />
    </Grid>
  );
};

export default FBWorkOrderPartDetails;
