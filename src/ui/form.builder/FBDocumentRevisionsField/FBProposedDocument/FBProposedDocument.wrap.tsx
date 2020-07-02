import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { documentRevisionsActions, documentRevisionsSelectors } from "../../../../state/ducks/documentRevisions";
import { FBProposedDocumentProps } from "../FBDocumentRevisions.types";

export const withFBProposedDocument = <T extends FBProposedDocumentProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    id,
    ...props
  }: T) => {

    const dispatch = useDispatch();
    const docRevById = useSelector(documentRevisionsSelectors.byId);
    const proposedDocumentRevision = docRevById[id];
    const [isMouseInside, setMouseInside] = useState<boolean>(false);

    useEffect(() => {
      dispatch(documentRevisionsActions.loadList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Component({
      ...(props as T),
      proposedDocumentRevision,
      isMouseInside,
      setMouseInside,
    });
  };

  return (props: T) => Comp(props);
};
