
export const modules = {
  toolbar: {
    container:
    [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link"],
      ["clean"],
      [{ color: [] }, { background: [] }],
    ],
    handlers: {
      link(value: string) {
        // this will be removed once we get rid of ReactQuill
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that: any = this;

        const tooltip = that.quill.theme.tooltip;
        const input = tooltip.root.querySelector("input[data-link]");
        input.dataset.link = "www.enlil.io";
        input.placeholder = "www.enlil.io";
        input.dataset.lpignore = true;

        // https://github.com/quilljs/quill/blob/develop/themes/snow.js#L113
        if (value) {
          const range = that.quill.getSelection();
          if (range == null || range.length === 0) { return; }
          let preview = that.quill.getText(range);
          if (
            /^\S+@\S+\.\S+$/.test(preview) &&
            preview.indexOf("mailto:") !== 0
          ) {
            preview = `mailto:${preview}`;
          }
          const { tooltip } = that.quill.theme;
          tooltip.edit("link", preview);
        } else {
          that.quill.format("link", false);
        }
      },
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
