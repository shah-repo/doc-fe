import React from "react";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { Translation } from "../../translations/types";
import BuildsPresenter from "./builds.presenter";

interface OwnProps {
  label: Translation;
  isDraft?: boolean;
}
export type Props = OwnProps & DataProps<DocumentRevision | DocumentRevision[]>;

export const BuildsContainer: React.FunctionComponent<Props> = ({
  dataProp,
  label,
  isDraft,
}) => (
  <BuildsPresenter {...{ label, dataProp, isDraft }}/>
);

export default BuildsContainer;
