import React from "react";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision, documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { toastError } from "../../components/notifications";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { Translation } from "../../translations/types";
import BuildsPresenter from "./builds.presenter";

interface OwnProps {
  label: Translation;
  isDraft?: boolean;
  docRevId?: string;
}
export type Props = OwnProps & DataProps<DocumentRevision[]>;

export const BuildsContainer: React.FunctionComponent<Props> = ({
  dataProp,
  label,
  isDraft,
  docRevId,
}) => {
  const async = useAsync<any>({
    onError: (error) => {
      toastError(error as string);
    },
  });
  const removeAction = useActionCreator(documentRevisionsActions.removePreviousBuild);
  const handleRemoveBuild = (id: string) => {
    async.start(removeAction, id, docRevId, async);
  };
  return (
    <BuildsPresenter {...{ label, dataProp, isDraft, handleRemoveBuild, docRevId }}/>
  );
};

export default BuildsContainer;
