export const findDiff = (oldContent, newContent) => {
  var diff = oldContent.diff(newContent);
  for (var i = 0; i < diff.ops.length; i++) {
    var op = diff.ops[i];
    // if the change was an insertion
    if (op.hasOwnProperty('insert')) {
      // color it blue
      op.attributes = {
        background: "#C9DFFF",
        color: "black"
      };
    }
    // if the change was a deletion 
    if (op.hasOwnProperty('delete')) {
      // keep the text
      op.retain = op.delete;
      delete op.delete;
      // strikethrough
      op.attributes = {
        strike: true
      };
    }
  }

  var adjusted = oldContent.compose(diff);

  return adjusted;
}