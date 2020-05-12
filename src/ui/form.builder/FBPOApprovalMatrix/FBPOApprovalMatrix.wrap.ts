import { debounce } from "lodash";
import React, { useEffect } from "react";
import { FB } from "..";
import { documentTypeActions } from "../../../state/ducks/documentRevisions/documentType";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import FBStore from "../stores/ui/FBStore";
import FBPOApprovalMatrixState from "./FBPOApprovalMatrix.state";
import { FBPOApprovalMatrixFieldProps, POApprovalMatrix } from "./FBPOApprovalMatrix.types";

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
    const async = useAsync({
      onSuccess: (response: POApprovalMatrix = { approvalLevels: [] }) => {
        poamState?.setItems(response.approvalLevels);
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
