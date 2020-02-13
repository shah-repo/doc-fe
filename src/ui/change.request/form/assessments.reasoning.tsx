import { Box } from "@material-ui/core";
import { ContentState, EditorState } from "draft-js";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import Text from "../../components/Text";
import useComponentVisible from "../../hooks/useComponentVisible";
import { ReasoningOption } from "../utils/types";

// WORKAROUND: couldn't find the interface for the props that are injected here
// https://github.com/jpuri/react-draft-wysiwyg/blob/master/src/Editor/index.js#L470
interface Props {
  onChange?: (editorState: EditorState) => void;
  editorState?: EditorState;
  reasoningOptions: ReasoningOption[];
}

const AssessmentsReasoning: React.FunctionComponent<Props> = ({
  editorState,
  onChange,
  reasoningOptions = [],
}) => {
  const intl = useIntl();
  useEffect(() => {
    setIsComponentVisible(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const openPlaceholderDropdown = () => setIsComponentVisible(!isComponentVisible);

  const {
    ref,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible(false);

  const addPlaceholder = (placeholder: string) => {
    onChange!(
      EditorState.push(
        editorState!,
        ContentState.createFromText(intl.formatMessage({ id: placeholder })),
        "insert-characters",
      ),
    );
  };

  const listItem = reasoningOptions.map((item) => (
    <Box
      component="li"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      overflow="hidden"
      onClick={() => addPlaceholder(item.value)}
      key={item.key}
      className="rdw-dropdownoption-default placeholder-li"
    >
      <Text message={item.text} />
    </Box>
  ));

  return (
      <div ref={ref} onClick={openPlaceholderDropdown} className="rdw-block-wrapper" aria-label="rdw-block-control">
        <div className="rdw-dropdown-wrapper rdw-block-dropdown rte-select-reasoning" aria-label="rdw-dropdown">
          <div className="rdw-dropdown-selectedtext" title="Placeholders">
            <Text translation="change.request.select.reasoning" />
            <div className={`rdw-dropdown-caretto${isComponentVisible ? "close" : "open"}`}/>
          </div>
          {
            isComponentVisible &&
            <Box
              className="rdw-dropdown-optionwrapper"
              component="ul"
              overflow="auto"
              minWidth="400px"
            >
              {listItem}
            </Box>
          }
        </div>
      </div>
    );
};

export default AssessmentsReasoning;
