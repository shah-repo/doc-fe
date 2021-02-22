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
  showRemoveButton?: boolean;
}
type Props = OwnProps & DataProps<DocumentRevision[]>;

const BuildsContainer: React.FunctionComponent<Props> = ({
  dataProp,
  label,
  isDraft,
  docRevId,
  showRemoveButton,
}) => {
  const async = useAsync<any>({
    onError: (error) => {
      toastError(error as string);
    },
  });
  const removeAction = useActionCreator(documentRevisionsActions.removePreviousBuild);
  const handleRemoveBuild = () => {
    async.start(removeAction, docRevId, async);
  };
  return (
    <BuildsPresenter {...{ label, dataProp, isDraft, handleRemoveBuild, showRemoveButton }}/>
  );
};

export default BuildsContainer;
