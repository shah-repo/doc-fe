import { FBEditorProps } from "..";
import documentTypeSelectors from "../../../state/ducks/documentRevisions/documentType/selectors";
import { useSelector } from "react-redux";

export const withFBEditorLHRStep = <T extends FBEditorProps>(
  Component: React.FunctionComponent<T>,
) => {

  const Comp = ({
    children,
    includeDefaultValue,
    documentTypeOptions,
    inputProps,
    ...props
  }: T) => {

    const options = useSelector(
      documentTypeSelectors.getDocumentTypeFormOptions,
    );

    documentTypeOptions = options.map((e) =>
      ({ value: e.id, text: e.documentTypeName })
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
