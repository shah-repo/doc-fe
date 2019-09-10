import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { sanitizeHtml } from "../../../common/utils/helpers";
import { compareHandler } from "./helpers.js";

interface OwnProps {
  oldText: string;
  newText: string;
}

type Props = OwnProps;

const Diff: React.FunctionComponent<Props> = ({
  oldText, newText,
}) => {
  const [newDelta, setNewDelta] = useState(null);
  const refOld = useRef<ReactQuill>(null);
  const refNew = useRef<ReactQuill>(null);
  useEffect(() => {
    const oldContents = refOld.current && refOld.current.getEditor().getContents();
    const newContents = refNew.current && refNew.current.getEditor().getContents();
    const difference = compareHandler(oldContents, newContents);

    setNewDelta(difference);
  }, []);

  return (
    <div>
      <ReactQuill
        ref={refOld}
        readOnly={true}
        value={oldText}
        modules={{ toolbar: false }}
      />
      <ReactQuill
        ref={refNew}
        readOnly={true}
        value={newDelta || newText}
        modules={{ toolbar: false }}
      />
    </div>
  );
}

Diff.displayName = "TextDiff";

export default Diff;
