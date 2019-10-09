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
        [{ placeholder: ["[GuestName]", "[HotelName]"] }], // my custom dropdown
    ],
    handlers: {
        placeholder(value: string) {
          const that: any = this;
          if (value) {
            const cursorPosition = that.quill.getSelection().index;
            that.quill.insertText(cursorPosition, value);
            that.quill.setSelection(cursorPosition + value.length);
          }
        },
    },
  },
};

export const formats = [
  "header", "font", "size",
  "bold", "italic", "underline", "strike", "blockquote",
  "list", "bullet", "indent",
  "link", "color", "background",
];
