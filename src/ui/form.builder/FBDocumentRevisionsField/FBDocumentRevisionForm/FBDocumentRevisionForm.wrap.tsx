import _ from "lodash";
import React from "react";
import { FB } from "../..";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import { FBDocumentRevisionFormProps } from "../FBDocumentRevisions.types";

export const withFBDocumentRevisionForm = <T extends FBDocumentRevisionFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    getOptionDisabled,
    ...props
  }: T) => {

    const { docRevState } = FB.useStores();

    getOptionDisabled = (option: DocumentRevision) => {
      const selectedParts = docRevState?.documentRevisions?.map((e) => e.proposedDocumentRevision.id);
      return _.includes(selectedParts, option.id);
    };

    return Component({
      ...(props as T),
      getOptionDisabled,
    });
  };

  return (props: T) => Comp(props);
};
