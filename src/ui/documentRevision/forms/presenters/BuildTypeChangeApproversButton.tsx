import { Box, Typography } from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import React from 'react';
import { StyledButton } from '../../../../App/Shifamed/Components/forms/presenters/StyledListButton';
import { StyledMenuListIcon } from '../../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon';
import { StyledMenuListItem } from '../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import { StyledMenuListItemText } from '../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import SM from '../../../../App/Shifamed/Utils/SM/SM';
import { translate } from '../../../../common/intl';
import { DocumentStatus } from '../../../../state/ducks/documents/types';
import { LHRBuild } from '../../../administration/general.settings/panels/LHRBuild/types';
import Dialog from '../../../components/dialogs';
import { toastError } from '../../../components/notifications';
import Text from '../../../components/Text';
import { FB } from '../../../form.builder';
import { FBBuildTypeState } from '../../../form.builder/FBBuildType/FBBuildType.state';
import useStyles from '../../../form.builder/FBBuildType/FBBuildType.styles';
import { LHR_BUILD_TYPE, NEW_LHR_BUILD_TYPE } from '../../../form.builder/FBBuildType/utills';
import FBBuildTypeChangeApproval from '../../../form.builder/FBBuildTypeChangeApproval/FBBuildTypeChangeApproval';
import { ApprovalValidationError } from '../../../form.builder/FBBuildTypeChangeApproval/FBBuildTypeChangeApproval.types';
import useDialog from '../../../hooks/useDialog';

interface Props {
  renderAsButton?: boolean
}

const BuildTypeChangeApproversButton: React.FunctionComponent<Props> = ({ renderAsButton }) => {
  const isNewLayout = SM.isNewLayout;
  const dialog = useDialog();
  const classes = useStyles();
  const { workspaceState } = FB.useStores();
  const [buildTypeOptions, setBuildTypeOptions] = React.useState<LHRBuild[]>([]);
  const submitRef = React.useRef<(() => void) | null>(null);
  const validateRef = React.useRef<(() => ApprovalValidationError | null) | null>(null);

  React.useEffect(() => {
    const dispose = FBBuildTypeState.getBuildOptions((options) => {
      setBuildTypeOptions(options);
    });
    return dispose;
  }, []);

  const currentBuildTypeId = workspaceState?.getFieldByName(LHR_BUILD_TYPE) as string | undefined;
  const newBuildTypeId = workspaceState?.getFieldByName(NEW_LHR_BUILD_TYPE) as string | undefined;
  const currentBuildType = buildTypeOptions.find(opt => opt.id === currentBuildTypeId);
  const newBuildType = buildTypeOptions.find(opt => opt.id === newBuildTypeId);

  // Pass minimal objects so the wrap can extract IDs for fetchRequiredApprovals
  const prevValueProp = currentBuildTypeId ? { id: currentBuildTypeId } as unknown as LHRBuild : undefined;
  const selectedValueProp = newBuildTypeId ? { id: newBuildTypeId } as unknown as LHRBuild : undefined;

  const handleConfirm = () => {
    const validationError = validateRef.current?.();
    if (validationError) {
      if (validationError.type === 'no_approvers') {
        toastError(translate('form.builder.approvals.not.present'));
      } else {
        toastError(translate('form.builder.approvals.group.required', { groupNames: validationError.groupNames.join(', ') }));
      }
      return;
    }
    submitRef.current?.();
    dialog.close();
  };

  return (
    <>
      {isNewLayout && (
        renderAsButton ? (
          <StyledButton color="primary" onClick={dialog.open} data-cy="approvers-button">
            <Text translation="common.approvers" />
          </StyledButton>
        ) : (
          <StyledMenuListItem button alignItems="flex-start" onClick={dialog.open}>
            <StyledMenuListIcon>
              <PeopleAltIcon />
            </StyledMenuListIcon>
            <StyledMenuListItemText
              data-cy="approvers-button"
              primary={<Text translation="common.approvers" />}
            />
          </StyledMenuListItem>
        )
      )}
      <Dialog
        title="common.approvers"
        open={dialog.isOpen}
        maxWidth="md"
        fullWidth
        onClose={dialog.close}
        onCancel={dialog.close}
        cancelLabel="common.cancel"
        onConfirm={handleConfirm}
        confirmLabel="common.update"
      >
        <Box className={classes.buildTypeSwitchHeader}>
          <Typography variant="h6" className={classes.buildTypeSwitchTitle}>
            Build Type Switch
          </Typography>
          <Box className={classes.buildTypeSwitchValues}>
            <Typography variant="body1">{currentBuildType?.displayLabel}</Typography>
            <Box className={classes.buildTypeArrow}>
              <ArrowRightAltIcon />
            </Box>
            <Typography variant="body1">{newBuildType?.displayLabel}</Typography>
          </Box>
        </Box>
        <FBBuildTypeChangeApproval
          name="buildTypeApprovals"
          label="form.builder.approvers"
          documentStatus={DocumentStatus.Draft}
          prevValue={prevValueProp}
          selectedValue={selectedValueProp}
          submitRef={submitRef}
          validateRef={validateRef}
        />
      </Dialog>
    </>
  );
};

export default BuildTypeChangeApproversButton;
