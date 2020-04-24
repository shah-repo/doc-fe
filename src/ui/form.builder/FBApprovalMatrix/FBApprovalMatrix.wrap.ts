import { debounce } from "lodash";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { FB } from "..";
import { documentTypeActions } from "../../../state/ducks/documentRevisions/documentType";
import { DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import FBStore from "../stores/ui/FBStore";
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
    const { document } = FBStore;
    const isDocumentReleased = document.status === DocumentRevisionStatus.Released;
    const async = useAsync({
      onSuccess: (response) => {
        amState?.setApprovalMatrix(response as ApprovalMatrix);
      },
    });

    const loadAction = useActionCreator(documentTypeActions.getApprovalMatrix);
    useEffect(() => {
      if (props.disabled || isDocumentReleased || FBStore.getValue(name)) {
        return;
      }
      async.start(loadAction, async);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.disabled, isDocumentReleased, loadAction, document.formInput]);

    useEffect(() => {
      debounced(() => {
        amState.name = name;
        amState.initialize();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name]);

    useObserver(() => amState.am);

    return Component({
      ...(props as T),
      amState,
      name,
    });
  };

  return (props: T) => Comp(props);
};
