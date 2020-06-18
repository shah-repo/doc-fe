import React from "react";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { AsyncState } from "../../../state/types";
import { ChangeRequestFormValues } from "./types";

interface OwnProps {
  initialValues: ChangeRequestFormValues;
  asyncState: AsyncState;
  changeRequest?: ChangeRequest;
  doNotPrompt?: boolean;
  onSubmit: (values: ChangeRequestFormValues) => void;
  FBContainer?: React.MutableRefObject<HTMLDivElement | null>;
}

type ChangeRequestFormPresenterProps = OwnProps;

export const ChangeRequestFormPresenter: React.FunctionComponent<
ChangeRequestFormPresenterProps
> = ({
  initialValues,
  onSubmit,
  asyncState,
  changeRequest,
  doNotPrompt,
  FBContainer,
}) => null;

export default ChangeRequestFormPresenter;
