// eslint-disable-next-line: no-implicit-dependencies
import { DeltaStatic } from "quill";

export const findDiff = (oldContent: DeltaStatic, newContent: DeltaStatic): DeltaStatic => {
  const diff = oldContent.diff(newContent);
  const ops = diff.ops || [];
  for (const op of ops) {
    // if the change was an insertion
    if (Object.prototype.hasOwnProperty.call(op, "insert")) {
      // color it blue
      op.attributes = {
        background: "#C9DFFF",
        color: "black",
      };
    }
    // if the change was a deletion
    if (Object.prototype.hasOwnProperty.call(op, "delete")) {
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
