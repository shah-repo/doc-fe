import { DeltaStatic } from "quill";

export const findDiff = (oldContent: DeltaStatic, newContent: DeltaStatic): DeltaStatic => {
  const diff = oldContent.diff(newContent);
  for (const op of diff.ops!) {
    // if the change was an insertion
    if (op.hasOwnProperty("insert")) {
      // color it blue
      op.attributes = {
        background: "#C9DFFF",
        color: "black",
      };
    }
    // if the change was a deletion
    if (op.hasOwnProperty("delete")) {
      // keep the text
      op.retain = op.delete;
      delete op.delete;
      // strikethrough
      op.attributes = {
        strike: true,
      };
    }
  }

  const adjusted = oldContent.compose(diff);

  return adjusted;
};
