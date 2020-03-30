import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBInlineApprovalProps, FBInlineApprovalState } from ".";
import { FB } from "..";
import FBDRStore from "../stores/ui/FBDRStore";
import FBEditorStore from "../stores/ui/FBEditorStore";
import FBStore from "../stores/ui/FBStore";

export const withFBInlineApproval = <T extends FBInlineApprovalProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    onClick,
    inlineApprovalState,
    mode,
    approverGroups,
    approvers,
    approveIsBlocking,
    name = "",
    index,
    ...props
  }: T) => {

    inlineApprovalState = FB.useRef<FBInlineApprovalState>(FBInlineApprovalState);

    const formValue = FBStore.getValue(name);
    approvers = approvers || formValue?.approvers;
    approverGroups = approverGroups || formValue?.approverGroups;
    _.isUndefined(approveIsBlocking) && (approveIsBlocking = formValue?.approveIsBlocking);

    React.useEffect(() => {
      switch (true) {
        case FBDRStore.isOutput && !_.isEmpty(approvers):
          inlineApprovalState?.setMode("defined");
          break;
        case FBDRStore.isOutput && !approvers:
          inlineApprovalState?.setMode("starter");
          break;
        default:
          inlineApprovalState?.setMode("placeholder");
      }
    }, [approvers, approverGroups, approveIsBlocking]);


    onClick = () => {
      FBEditorStore.editorTypeEdit({ type: "outputapproval", index, name });
      FBEditorStore.open = true;
    };

    useObserver(() => {
      mode = inlineApprovalState?.mode;
    });

    return Component({
      ...(props as T),
      inlineApprovalState,
      onClick,
      mode,
      approvers,
      approverGroups,
      approveIsBlocking,
      index,
      name,
    });
  };

  return (props: T) => Comp(props);
};
