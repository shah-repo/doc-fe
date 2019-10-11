
export const modules = {
  toolbar: {
    container:
    [
        [{ header: "1"}, {header: "2"}, { font: [] }],
        [{size: []}],
        ["bold", "italic", "underline", "blockquote"],
        [{list: "ordered"}, {list: "bullet"}, {indent: "-1"}, {indent: "+1"}],
        ["link"],
        ["clean"],
        [{ color: [] }, { background: [] }],
    ],
    handlers: {
    },
  },
  clipboard: {
    matchVisual: false,
  },
};

export const formats = [
  "header", "font", "size",
  "bold", "italic", "underline", "strike", "blockquote",
  "list", "bullet", "indent",
  "link", "color", "background",
];