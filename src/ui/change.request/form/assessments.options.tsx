import { EditorState, Modifier } from "draft-js";
import React, { useEffect, useState } from "react";
import Text from "../../components/Text";

// WORKAROUND: couldn't find the interface for the props that are injected here
// https://github.com/jpuri/react-draft-wysiwyg/blob/master/src/Editor/index.js#L470
interface Props {
  onChange?: (editorState: EditorState) => void;
  editorState?: EditorState;
}

const AssessmentsOptions: React.FunctionComponent<Props> = ({
  editorState,
  onChange,
}) => {
  // console.log(modalHandler);
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    setShowDropdown(false);
  }, []);
  const openPlaceholderDropdown = () => setShowDropdown(!showDropdown);

  const addPlaceholder = (placeholder: string) => {
    const contentState = Modifier.replaceText(
    editorState!.getCurrentContent(),
    editorState!.getSelection(),
    placeholder,
    editorState!.getCurrentInlineStyle(),
    );
    onChange!(EditorState.push(editorState!, contentState, "insert-characters"));
  };

  const placeholderOptions = [
    {key: "firstName", value: "{{firstName}}", text: "First Name"},
    {key: "lastName", value: "{{lastName}}", text: "Last name"},
    {key: "company", value: "{{company}}", text: "Company"},
    {key: "address", value: "{{address}}", text: "Address"},
    {key: "zip", value: "{{zip}}", text: "Zip"},
    {key: "city", value: "{{city}}", text: "City"},
  ];

  const listItem = placeholderOptions.map((item) => (
    <li
      onClick={() => addPlaceholder(item.value)}
      key={item.key}
      className="rdw-dropdownoption-default placeholder-li"
    >
      {item.text}
    </li>
  ));

  return (
      <div onClick={openPlaceholderDropdown} className="rdw-block-wrapper" aria-label="rdw-block-control">
        <div className="rdw-dropdown-wrapper rdw-block-dropdown rte-select-reasoning" aria-label="rdw-dropdown">
          <div className="rdw-dropdown-selectedtext" title="Placeholders">
            <Text translation="change.request.select.reasoning" />
            <div className={`rdw-dropdown-caretto${showDropdown ? "close" : "open"}`}/>
          </div>
          {
            showDropdown &&
            <ul className={`rdw-dropdown-optionwrapper ${showDropdown ? "" : "placeholder-ul"}`}>
              {listItem}
            </ul>
          }
        </div>
      </div>
    );
};

export default AssessmentsOptions;
