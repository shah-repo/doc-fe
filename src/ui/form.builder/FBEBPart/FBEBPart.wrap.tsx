import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBEBPartProps } from "..";
import { FBEBPartState } from "./FBEBPart.state";

export const withFBEBPart = <T extends FBEBPartProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    name,
    loading,
    disabled,
    ...props
  }) => {

    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    const { id: docRevId } = workspaceState || {};
    const ebPartState = FB.useRef(
      FBEBPartState,
      workspaceState?.document?.childrenParts,
    );

    // MARK: @methods
    const onAddClick = () => {
      window.open(`/document_revision/create_part/${docRevId}`);
    };

    // MARK: @reactions
    // on existing part autocomplete change
    React.useEffect(() => reaction(
      () => formState?.inputState.get("childrenParts")?.value,
      (childPartId: string) => {
        ebPartState.addExistingPartChild(docRevId, childPartId);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @observer
    useObserver(() => {
      loading = (
        ebPartState.loading ||
          ebPartState?.docRevApi.loading
      );
    });

    return Component({
      ...(props as T),
      loading,
      disabled,
      onAddClick,
    });
  };

  Comp.displayName = "withFBEBPart";
  return Comp;
};
