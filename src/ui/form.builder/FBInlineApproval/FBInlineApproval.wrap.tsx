import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBInlineApprovalProps, FBInlineApprovalState } from ".";
import { FB } from "..";
import Text from "../../components/Text";
import FBButton from "../components/inputs/FBButton";
import FBDRStore from "../stores/ui/FBDRStore";
import FBEditorStore from "../stores/ui/FBEditorStore";
import FBStore from "../stores/ui/FBStore";

export const withFBInlineApproval = <T extends FBInlineApprovalProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    onClick,
    inlineApprovalState,
    toolsVisible,
    mode,
    name = "",
    index,
    type,
    ...props
  }: T) => {

    inlineApprovalState = FB.useRef<FBInlineApprovalState>(FBInlineApprovalState);
    const { dialogState } = FB.useStores();
    const { approvers, approverGroups, approveIsBlocking } = FBStore.getValue(name) || {};

    function removeConfig() {
      const omitedValue = _.omit(FBStore.values, [name]);
      FBStore.setValues(omitedValue);
      // We need to reset entire form for after approval behaviour
      FBStore.resetSchema();
      dialogState?.closeDialog();
    }

    function resetActions(): React.ReactNode {
      return (
        <>
          <FBButton label="common.cancel" onClick={dialogState?.closeDialog} variant="text" />
          <FBButton label="common.submit" onClick={removeConfig}variant="text" />
        </>
      );
    }

    React.useEffect(() => {
      switch (true) {
        case FBDRStore.isOutput && (!_.isEmpty(approvers) || !_.isEmpty(approverGroups)):
          return inlineApprovalState?.setMode("defined");
        case FBDRStore.isOutput && !approvers && !approverGroups:
          return inlineApprovalState?.setMode("starter");
        default:
          inlineApprovalState?.setMode("placeholder");
      }
    }, [approvers, approverGroups, approveIsBlocking]);

    const onMouseOver = () => inlineApprovalState?.setToolsActive(true);
    const onMouseLeave = () => inlineApprovalState?.setToolsActive(false);
    const editApproval = () => FBStore.editSchemaItem(index);
    const removeApproval = () => {
      if (mode === "defined" && approveIsBlocking) {
        return dialogState?.config({
          open: true,
          content: <Text message="form.builder.approval.reset.msg" />,
          actions: resetActions(),
        });
      }
      removeConfig();
    };

    onClick = () => {
      FBEditorStore.editorTypeEdit({ type, index, name });
      FBEditorStore.open = true;
    };

    useObserver(() => {
      mode = inlineApprovalState?.mode;
      toolsVisible = inlineApprovalState?.toolsVisible;
    });

    return Component({
      ...(props as T),
      inlineApprovalState,
      onClick,
      onMouseOver,
      onMouseLeave,
      editApproval,
      removeApproval,
      toolsVisible,
      mode,
      approvers,
      approverGroups,
      approveIsBlocking,
      index,
      name,
      type,
    });
  };

  return (props: T) => Comp(props);
};
