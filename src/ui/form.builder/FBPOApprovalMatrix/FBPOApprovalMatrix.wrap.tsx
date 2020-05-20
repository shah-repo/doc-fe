import _ from "lodash";
import React, { useEffect } from "react";
import * as generateUuid from "uuid/v4";
import { FB, FBDialogState } from "..";
import FBPOApprovalMatrixState from "./FBPOApprovalMatrix.state";
import { FBPOApprovalMatrixFieldProps, POApprovalMatrixLevel } from "./FBPOApprovalMatrix.types";
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
    ...props
  }: T) => {

    const { workspaceState, formState } = FB.useStores();
    const { document } = workspaceState || {};
    poamState = FB.useRef<FBPOApprovalMatrixState>(FBPOApprovalMatrixState, formState);
    dialogState = FB.useRef<FBDialogState>(FBDialogState);

    const stages = [1, 2, 3];
    const approvalLevel: POApprovalMatrixLevel[] = [];
    let signatures;

    async function fetchPOApprovalMatrix() {
      const data = await poamState?.fetch();
      data?.approvalLevels?.map((level: POApprovalMatrixLevel) => {
        if (level.signatures.length === 3) {
          approvalLevel.push(level);
        }
        const signatureStages = level.signatures.map((level) => level.signatureStage);
        const stageDiff = stages.filter((x) => !signatureStages.includes(x));
        signatures = [...level.signatures];
        stageDiff.map((stage) => {
          const emptySignature = {
            id: generateUuid(),
            signatureStage: stage,
            employees: [],
            groups: [],
          };
          signatures.push(emptySignature);
        });
        approvalLevel.push({ ...level, signatures: signatures.sort((a, b) => a.signatureStage - b.signatureStage) });
      });
      const uniqApprovalLevels = _.uniqBy(approvalLevel, "id");
      poamState?.setItems(uniqApprovalLevels);
    }

    useEffect(() => {
      if ((props.disabled || formState?.getFieldValue(name)) && !document?.outputRevision) {
        return;
      }
      fetchPOApprovalMatrix();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.disabled, document?.formInput]);

    useEffect(() => {
      poamState.name = name;
      poamState.initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name]);

    handleAdd = () => {
      dialogState?.config({
        open: true,
        title: "form.builder.add.item",
        content: <FBPOApprovalMatrixForm signatureStages={[1, 2, 3]} />,
        actions: <FBPOApprovalMatrixFormActions />,
      });
    };

    return Component({
      ...(props as T),
      handleAdd,
      poamState,
      dialogState,
      name,
    });
  };

  return (props: T) => Comp(props);
};
