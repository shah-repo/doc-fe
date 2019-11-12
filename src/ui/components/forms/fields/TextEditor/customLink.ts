import { Quill } from "react-quill";

const Link = Quill.import("formats/link");

const validateUrl = (value: string) =>
  /^(?:(?:(?:https?|ftp|file|mailto|tel):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);

Link.sanitize = (value: string) => {
  // supported protocols
  const protocols = /(https?|ftp|file|mailto|tel:\/\/[^\s]+)/g;

  if (protocols.test(value)) {
    return value;
  }

  // if no protocol provided put https
  return `https://${value}`;
};

// https://github.com/quilljs/quill/blob/develop/formats/link.js#L30
class CustomLink extends Link {
  public static create(value: string) {
    const node = super.create(value);
    const url = node.getAttribute("href");

    if (validateUrl(url)) {
      return node;
    }

    node.removeAttribute("href");
    node.removeAttribute("rel");
    node.removeAttribute("target");
    return node;
  }
}

Quill.register(CustomLink);
