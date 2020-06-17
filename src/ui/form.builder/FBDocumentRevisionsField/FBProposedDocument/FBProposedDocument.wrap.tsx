import React, { useState } from "react";
import { useSelector } from "react-redux";
import { documentRevisionsSelectors } from "../../../../state/ducks/documentRevisions";
import { FBProposedDocumentProps } from "../FBDocumentRevisions.types";

export const withFBProposedDocument = <T extends FBProposedDocumentProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    id,
    ...props
  }: T) => {

    const docRevById = useSelector(documentRevisionsSelectors.byId);
    const proposedDocumentRevision = docRevById[id];
    const [isMouseInside, setMouseInside] = useState<boolean>(false);

    return Component({
      ...(props as T),
      proposedDocumentRevision,
      isMouseInside,
      setMouseInside,
    });
  };

  return (props: T) => Comp(props);
};
