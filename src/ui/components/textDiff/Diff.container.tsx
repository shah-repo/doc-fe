import { DeltaStatic } from "quill";
import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import DiffPresenter from "./Diff.presenter";
import { compareHandler } from "./utils/helpers";
import { DiffContainerProps } from "./utils/types";

type Props = DiffContainerProps;

const DiffContainer: React.FunctionComponent<Props> = ({
  oldText, newText,
}) => {
  const [delta, setDelta] = useState<DeltaStatic | null>(null);
  const refOld = useRef<ReactQuill>(null);
  const refNew = useRef<ReactQuill>(null);
  useEffect(() => {
    refNew.current && refNew.current.getEditor().pasteHTML(newText);

    if (!oldText || oldText === "undefined") {
      return;
    }

    const oldContents = refOld.current && refOld.current.getEditor().getContents();
    const newContents = refNew.current && refNew.current.getEditor().getContents();
    let difference;

    if (oldContents && newContents) {
      difference = compareHandler(oldContents, newContents);
      setDelta(difference || null);
    }
  }, [newText]);

  return (
    <DiffPresenter
      oldText={oldText}
      newText={newText}
      refOld={refOld}
      refNew={refNew}
      delta={delta}
    />
  );
};

DiffContainer.displayName = "TextDiffContainer";

export default DiffContainer;
