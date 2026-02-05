import { filter, isEmpty, isNull, unionBy } from 'lodash';
import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import React from 'react';
import { FB, FBApprovalPasswordForm, FBAutocompleteAsyncOption, FBAutocompleteAsyncState, FBDialogState, FBInlineApprovalBody, FBInlineApprovalTransition, FBWorkspaceModeOptions } from '..';
import { ApprovalStatus, DocumentStatus } from '../../../state/ducks/documents/types';
import { store } from '../../../state/store';
import { LHRBuild } from '../../administration/general.settings/panels/LHRBuild/types';
import useDialog from '../../hooks/useDialog';
import FBStore from '../FBStore/FBStore';
import { FBBuildTypeState } from './FBBuildType.state';
import { FBBuildTypeProps } from './FBBuildType.types';

export const withFBBuildType = <T extends FBBuildTypeProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    optionId,
    name,
    ...props
  }: T) => {
    const [selectedValue, setSelectedValue] = React.useState<undefined | LHRBuild>(undefined);
    const [defaultValue, setDefaultValue] = React.useState<undefined | LHRBuild>(undefined);
    const [prevValue, setPrevValue] = React.useState<undefined | LHRBuild>(undefined);
    const [options, setOptions] = React.useState<LHRBuild[]>([]);
    const [refresh, setRefresh] = React.useState(false);
    const lhrBuildDialog = useDialog();
    const approvalDialog = useDialog();
    const isDialogOpen = lhrBuildDialog.isOpen;
    const isApprovalDialogOpen = approvalDialog.isOpen;
    const { formState, workspaceState } = FB.useStores();
    const documentStatus = DocumentStatus.Draft;
    const buildsAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
      optionId: FBAutocompleteAsyncOption.buildType,
    });

    const {
      document,
      changeRequest,
    } = workspaceState || {};

    let docApprovals = document?.approvals || changeRequest?.approvals;
    if (!docApprovals?.length && FBStore.selectedApprover.length) {
      docApprovals = FBStore.selectedApprover;
    }
    const dialogState = FB.useRef(FBDialogState);

    const {
      owner: { user: { id: userId = '' } = {} } = {},
    } = document || changeRequest || {};

    const authUser = store.getState().auth.user;
    const isOwner = authUser.id === userId;

    const isBuildTypeChangeApprovalEnabled = workspaceState?.buildTypeChangeStatus();

    const currentApproverId = document?.approvals?.find(approval => approval.approver?.user.id === authUser.id)?.id;

    const buildTypeState = FB.useRef(
      FBBuildTypeState,
      { approvals: docApprovals, isOwner },
    );

    React.useEffect(() => {
      buildsAsync.load(true);
    }, [buildsAsync]);

    React.useEffect(() => {
      const dispose = FBBuildTypeState.getBuildOptions((options) => {
        const activeOptions = options.filter(item => item.isActive);
        setOptions(activeOptions);
        const selectedId = formState?.getFieldValue(name);
        const value = options.find((opt) => opt.id === selectedId);
        setPrevValue(value);
        setDefaultValue(value);
      });
      return dispose;
    }, [name, formState]);

    React.useEffect(() => reaction(
      () => buildTypeState?.transitionApi.data,
      (data) => {
        formState?.setFieldValue(`${name}`, formState?.getFieldValue(`new-${name}`));
        formState?.setFieldAutosave(`${name}`);
        setDefaultValue(selectedValue);
        workspaceState?.saveDocRev(formState?.getValues());
        concatApprovals(data);
        if (data?.status === DocumentStatus.Draft) {
          window.location.reload();
        }
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    function concatApprovals (approval?: FBInlineApprovalBody) {
      if (!approval) { return; }
      if (
        approval.status
        && [ApprovalStatus.Rejected, ApprovalStatus.Approved].includes(
          approval.status as ApprovalStatus,
        )
      ) {
        window.location.reload();
      } else {
        const stateApprovals = filter(
          buildTypeState?.approvals,
          (a) => a.approver?.id !== approval.approver?.id,
        );
        buildTypeState?.setApprovals(unionBy(stateApprovals, [approval], 'id'));
      }
    }

    const onChange = (event: React.ChangeEvent<{}>, inputValue: string) => {
      const selectedLhrBuild = options?.find(value => value.displayLabel === inputValue);

      if (!isEmpty(selectedLhrBuild) && !isNull(event)) {
        setSelectedValue(selectedLhrBuild);
        lhrBuildDialog.open();
      }
    };

    const requestApproval = (id: string) => {
      if (!id) { return; }
      buildTypeState?.applyTransition('pending', id);
    };

    const onDialogActionClick = (action: 'cancel' | 'confirm') => {
      if (action === 'confirm') {
        // Close first dialog and open approval dialog
        buildTypeState.getApprovals.filter(approval => approval.status === ApprovalStatus.Approved).forEach(approval => {
          requestApproval(approval.id);
        });
        lhrBuildDialog.close();
        approvalDialog.open();
      } else {
        setDefaultValue(prevValue);
        forceRerender();
        formState?.getInputState(name ?? '')?.setRender();
        setSelectedValue(undefined);
        lhrBuildDialog.close();
      }
    };

    const onApprovalDialogActionClick = (action: 'cancel' | 'confirm') => {
      if (action === 'confirm') {
        formState?.setFieldValue(`new-${name}`, selectedValue?.id);
        formState?.setFieldAutosave(`new-${name}`);
        setDefaultValue(selectedValue);
        workspaceState?.saveDocRev(formState?.getValues());
        formState?.getInputState(name ?? '')?.setRender();
        setSelectedValue(undefined);
        approvalDialog.close();
      } else {
        setDefaultValue(prevValue);
        forceRerender();
        formState?.getInputState(name ?? '')?.setRender();
        setSelectedValue(undefined);
        approvalDialog.close();
      }
    };

    const forceRerender = () => {
      setRefresh((x) => !x);
    };

    const approvalTransition = (transition: FBInlineApprovalTransition, approvalId?: string, password?: string) => {
      if (!approvalId) { return; }
      buildTypeState.applyTransition(transition, approvalId, { password });
    };

    let showApprovalButtons = false;

    useObserver(() => {
      showApprovalButtons = workspaceState?.buildTypeChangeStatus() ?? false;
    });

    const onApprovalAction = (action: 'accept' | 'reject') => {
      console.log('onApprovalAction action:', action);
      if (action === 'reject') {
        approvalTransition('reject', currentApproverId);
      } else if (action === 'accept') {
        onApproveClick(currentApproverId!);
      }
    };

    const onApproveClick = (approvalId: string) => {
      dialogState?.config({
        title: 'form.builder.password.prompt',
        open: true,
        content: <FBApprovalPasswordForm {...{ approvalId, approvalTransition }} />,
      });
    };

    const isDisabled = workspaceState?.mode !== FBWorkspaceModeOptions.FORM || isBuildTypeChangeApprovalEnabled;

    return Component({
      ...(props as T),
      selectedValue,
      defaultValue,
      prevValue,
      options,
      isDialogOpen,
      isApprovalDialogOpen,
      onChange,
      onDialogActionClick,
      onApprovalDialogActionClick,
      refresh,
      isDisabled,
      name,
      optionId,
      documentStatus,
      approvalTransition,
      showApprovalButtons,
      onApprovalAction,
      dialogState,
    });
  };

  Comp.displayName = 'withFBBuildType';
  return Comp;
};
