import { debounce } from "lodash";
import React, { useEffect } from "react";
import { FB } from "..";
import { documentTypeActions } from "../../../state/ducks/documentRevisions/documentType";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import FBApprovalMatrixState from "./FBApprovalMatrix.state";
import { ApprovalMatrix, FBApprovalMatrixFieldProps } from "./FBApprovalMatrix.types";

export const withFBApprovalMatrix = <T extends FBApprovalMatrixFieldProps>(
  Component: React.FunctionComponent<T>
) => {

  const debounced = debounce((f) => {
    f();
  }, 300);
  const Comp = ({
    amState,
    name = "",
    ...props
  }: T) => {

    amState = FB.useRef<FBApprovalMatrixState>(FBApprovalMatrixState);
    const async = useAsync({
      onSuccess: (response) => {
        amState.setApprovalMatrix(response as ApprovalMatrix);
      },
    });
    const loadAction = useActionCreator(documentTypeActions.getApprovalMatrix);

    useEffect(() => {
      debounced(() => {
        amState.name = name;
        amState.initialize();
      });
      async.start(loadAction, async);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name]);

    return Component({
      ...(props as T),
      amState,
      name,
    });
  };

  return (props: T) => Comp(props);
};
