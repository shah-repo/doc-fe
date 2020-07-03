import { shallow } from "enzyme";
import React from "react";
import { Link } from "react-router-dom";
import { getDocument, getDocumentRevision } from "../../../../state/ducks/documentRevisions/tests/factories";
import ReferencePresenter from "../../../document.revision/summary/reference.presenter";
import { documentVersionPath } from "../../../document.revision/utils/paths";
import { Props, References } from "./References";

describe("Document revision form - References", () => {
  const getWrapper = (props: Partial<Props> = {}) => shallow(
    <References {...props}/>,
  );

  it("should return all references", () => {
    const document = { ...getDocument(), referencedBy: [getDocumentRevision()] };
    const wrapper = getWrapper({ document }).find(ReferencePresenter).dive();
    const reference = document.referencedBy[0];

    expect(wrapper.find(Link)).toHaveLength(1);
    expect(wrapper.find(Link).prop("to")).toEqual(documentVersionPath(reference.id, reference.document.id));
  });
});
