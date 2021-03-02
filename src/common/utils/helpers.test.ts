import { DocumentRevision } from "../../state/ducks/documentRevisions/types";
import {
  getInnerHTMLProp,
  sanitizeHtml,
  stripTags,
  stripTagsFromObject,
} from "./helpers";

describe("common/utils/helpers", () => {
  it("should sanitize the html string", () => {
    const unsanitized = "<img src=x onerror=alert('img') />";
    const sanitized = sanitizeHtml(unsanitized);
    const expected = "<img src=\"x\">";

    expect(sanitized).toBe(expected);
  });

  it("should sanitize the html string and return inner HTML props", () => {
    const unsanitized = "<p>abc<iframe//src=jAva&Tab;script:alert(3)>def";
    const innerHTMLProp = getInnerHTMLProp(unsanitized);
    const expected = { __html: "<p>abc</p>" };

    expect(innerHTMLProp).toMatchObject(expected);
  });

  it("should strip tags", () => {
    const unstripped = `<a href="https://example.com">lorem ipsum dolor sit amet</a>`;
    const stripped = stripTags(unstripped);
    const expected = "\nlorem ipsum dolor sit amet\n";

    expect(stripped).toBe(expected);
  });

  it("should strip tags from document", () => {
    const docRev = {
      description: "<p color='red'>Lorem ipsum</p>",
    } as DocumentRevision;
    const strippedDocRev = stripTagsFromObject(docRev);
    const expected = {
      description: "\nLorem ipsum\n",
    };

    expect(strippedDocRev).toMatchObject(expected);
  });
});
