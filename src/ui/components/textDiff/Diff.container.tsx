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
    if (!oldText || !newText) {
      return;
    }
    if (oldText === "undefined") {
      const contents = refOld.current!.getEditor().clipboard.convert(oldText);
      refNew.current!.getEditor().setContents(contents);
      return;
    }

    const oldContents = refOld.current!.getEditor().clipboard.convert(oldText);
    const newContents = refNew.current!.getEditor().clipboard.convert(newText);

    if (oldContents && newContents) {
      const difference = compareHandler(oldContents, newContents);
      setDelta(difference || null);
      refOld.current!.getEditor().setContents(oldContents);
      refNew.current!.getEditor().setContents(difference as DeltaStatic);
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
