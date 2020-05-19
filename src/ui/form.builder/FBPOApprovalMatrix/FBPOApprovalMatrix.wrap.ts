import _, { debounce } from "lodash";
import React, { useEffect } from "react";
import * as generateUuid from "uuid/v4";
import { FB } from "..";
import { documentTypeActions } from "../../../state/ducks/documentRevisions/documentType";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import FBStore from "../stores/ui/FBStore";
import FBPOApprovalMatrixState from "./FBPOApprovalMatrix.state";
import { FBPOApprovalMatrixFieldProps, POApprovalMatrix, POApprovalMatrixLevel } from "./FBPOApprovalMatrix.types";


export const withFBPOApprovalMatrix = <T extends FBPOApprovalMatrixFieldProps>(
  Component: React.FunctionComponent<T>
) => {
  const debounced = debounce((f) => {
    f();
  }, 300);
  const Comp = ({
    poamState,
    name = "",
    ...props
  }: T) => {

    poamState = FB.useRef<FBPOApprovalMatrixState>(FBPOApprovalMatrixState);
    const { document } = FBStore;
    const stages = [1, 2, 3];
    const approvalLevel: POApprovalMatrixLevel[] = [];
    let signatures;
    const async = useAsync({
      onSuccess: (response: POApprovalMatrix = { approvalLevels: [] }) => {
        response.approvalLevels.map((level: POApprovalMatrixLevel) => {
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
        const nesto = _.uniqBy(approvalLevel, "id");
        poamState?.setItems(nesto);
      },
    });

    const loadAction = useActionCreator(documentTypeActions.getPOApprovalMatrix);

    useEffect(() => {
      if ((props.disabled || FBStore.getValue(name)) && !document.outputRevision) {
        return;
      }
      async.start(loadAction, async);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.disabled, loadAction, document.formInput]);

    useEffect(() => {
      debounced(() => {
        poamState.name = name;
        poamState.initialize();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name]);

    return Component({
      ...(props as T),
      poamState,
      name,
    });
  };

  return (props: T) => Comp(props);
};
