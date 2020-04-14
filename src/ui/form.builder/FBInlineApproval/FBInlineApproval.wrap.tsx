import _, { Dictionary } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBInlineApprovalProps, FBInlineApprovalState } from ".";
import { FB, FBDialogState } from "..";
import Text from "../../components/Text";
import FBButton from "../components/inputs/FBButton";
import FBDRStore from "../stores/ui/FBDRStore";
import FBEditorStore from "../stores/ui/FBEditorStore";
import FBStore from "../stores/ui/FBStore";
import { FBTemplateSchema } from "../types/store";

export const withFBInlineApproval = <T extends FBInlineApprovalProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    onClick,
    inlineApprovalState,
    toolsVisible,
    mode,
    approverGroups,
    approvers,
    approveIsBlocking,
    name = "",
    index,
    type,
    ...props
  }: T) => {

    inlineApprovalState = FB.useRef<FBInlineApprovalState>(FBInlineApprovalState);
    const { dialogState }: { dialogState: FBDialogState} = FB.useStores();

    const formValue = FBStore.getValue(name);
    // const schemaValue = FBStore.getValue(name);
    // approvers = approvers || schemaValue?.approvers;
    // approverGroups = approverGroups || schemaValue?.approverGroups;
    // _.isUndefined(approveIsBlocking) && (approveIsBlocking = schemaValue?.approveIsBlocking);

    function resetedSchema(): FBTemplateSchema[] {
      const schema = FBStore.getSchema();
      return schema.map((item) => (item.name === name ? {
        ..._.omit(item, ["approvers", "approverGroups", "approveIsBlocking"]),
      } : item));
    }

    function resetedValues(): Dictionary<any> {
      return _.omit(FBStore.values, [name, "approveIsBlocking"]);
    }

    function removeConfig() {
      FBStore.setSchema(resetedSchema());
      FBStore.setValues(resetedValues());
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
      if (mode === "defined" && formValue && approveIsBlocking) {
        return dialogState.config({
          open: true,
          maxWidth: "sm",
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
