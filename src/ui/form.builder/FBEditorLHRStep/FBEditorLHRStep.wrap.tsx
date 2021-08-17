import { useSelector } from "react-redux";
import { FBEditorLHRStepProps } from "..";
import documentTypeSelectors from "../../../state/ducks/documentRevisions/documentType/selectors";

export const withFBEditorLHRStep = <T extends FBEditorLHRStepProps>(
  Component: React.FunctionComponent<T>,
) => {

  const Comp = ({
    children,
    includeDefaultValue,
    documentTypeOptions,
    inputProps,
    ...props
  }: T) => {

    documentTypeOptions = useSelector(
      documentTypeSelectors.getDocumentTypeFormOptions,
    );

    return Component({
      ...(props as T),
      children,
      includeDefaultValue,
      inputProps,
      documentTypeOptions,
    });
  };
  return (props: T) => Comp(props);
};
