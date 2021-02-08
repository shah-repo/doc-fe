import { reaction } from "mobx";
import React, { useEffect } from "react";
import { FB, FBDialogState } from "..";
import FBPOApprovalMatrixState from "./FBPOApprovalMatrix.state";
import { FBPOApprovalMatrixFieldProps, POApprovalMatrix } from "./FBPOApprovalMatrix.types";
import FBPOApprovalMatrixForm from "./form/FBPOApprovalMatrixForm";
import FBPOApprovalMatrixFormActions from "./form/FBPOApprovalMatrixForm.actions";

export const withFBPOApprovalMatrix = <T extends FBPOApprovalMatrixFieldProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    handleAdd,
    poamState,
    dialogState,
    name = "",
    handleRevert,
    disabled,
    isInputOwner,
    ...props
  }: T) => {

    const { workspaceState, formState } = FB.useStores();
    const { document } = workspaceState || {};
    const { outputRevision } = document || {};
    const formValue = formState?.getFieldValue(name) as POApprovalMatrix;
    const { approvalLevels = [] } = formValue || {};
    const isOutput = workspaceState?.isOutput;
    isInputOwner = workspaceState?.getIsInputOwner(name);
    disabled = !isInputOwner || disabled;

    poamState = FB.useRef<FBPOApprovalMatrixState>(FBPOApprovalMatrixState, {
      formState,
      approvalLevels,
      outputRevision,
      isOutput,
    });
    dialogState = FB.useRef<FBDialogState>(FBDialogState);


    // const stages = [1, 2, 3];
    // const approvalLevel: POApprovalMatrixLevel[] = [];
    // let signatures;

    // async function fetchPOApprovalMatrix() {
    //   const data = await poamState?.fetch();

    //   data?.approvalLevels?.map((level: POApprovalMatrixLevel) => {
    //     if (level.signatures.length === 3) {
    //       approvalLevel.push(level);
    //     }
    //     const signatureStages = level.signatures.map((level) => level.signatureStage);
    //     const stageDiff = stages.filter((x) => !signatureStages.includes(x));
    //     signatures = [...level.signatures];
    //     stageDiff.map((stage) => {
    //       const emptySignature = {
    //         id: generateUuid(),
    //         signatureStage: stage,
    //         employees: [],
    //         groups: [],
    //       };
    //       signatures.push(emptySignature);
    //     });
    //     approvalLevel.push({ ...level, signatures: signatures.sort((a, b) => a.signatureStage - b.signatureStage) });
    //   });
    //   const uniqApprovalLevels = _.uniqBy(approvalLevel, "id");
    //   poamState?.setItems(uniqApprovalLevels);
    //   formState?.setFieldValue(name + ".approvalLevels", approvalLevels);
    // }

    // useEffect(() => {
    //   // if ((props.disabled || formState?.getFieldValue(name)) && !document?.outputRevision) {
    //   //   const formValue = formState?.getFieldValue(name) as POApprovalMatrix;
    //   //   const { approvalLevels } = formValue || {};
    //   //   poamState.setItems(approvalLevels);
    //   //   return;
    //   // }
    //   if (document?.outputRevision || _.isEmpty(approvalLevels)) {
    //     fetchPOApprovalMatrix();
    //   }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [props.disabled, document?.formInput]);

    useEffect(() => {
      poamState.name = name;
      poamState.initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name]);

    handleAdd = () => {
      dialogState?.config({
        open: true,
        title: "form.builder.add.item",
        content: <FBPOApprovalMatrixForm signatureStages={[1, 2, 3]} {...{ disabled }} />,
        actions: <FBPOApprovalMatrixFormActions />,
      });
    };

    handleRevert = () => poamState.fetch();

    React.useEffect(() => {
      reaction(
        () => poamState?.approvalLevels,
        () => formState?.setFieldAutosave(name)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Component({
      ...(props as T),
      handleAdd,
      handleRevert,
      poamState,
      dialogState,
      disabled,
      name,
    });
  };

  Comp.displayName = "withFBPOApprovalMatrix";
  return Comp;
};
