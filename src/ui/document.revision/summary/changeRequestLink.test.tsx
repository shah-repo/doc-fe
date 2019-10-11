import { shallow } from "enzyme";
import React from "react";
import ChangeRequestLink, { Props } from "./changeRequestLink";
import { Link } from "react-router-dom";
import { getDocumentRevision } from "../../../state/ducks/documentRevisions/tests/factories";
import { getChangeRequest } from "../../../state/ducks/changeRequest/tests/factories";
import { changeRequestEditPath } from "../../change.request/utils/paths";
import { stripTags } from "../../../common/utils/helpers";
import { Tooltip } from "@material-ui/core";

describe("ChangeRequestLink tests", () => {

  const defaultProps: Props = {
    dataProp: {},
  };

  const getWrapper = (props: Partial<Props>= {}) => shallow(
    <ChangeRequestLink {...defaultProps} {...props}/>,
  );

  it("Dont show if dataProp is empty", () => {
    const wrapper = getWrapper();
    expect(wrapper.isEmptyRender()).toEqual(true);
  });

  it("Dont show if changeRequest is empty", () => {
    const defaultProps: Props = { dataProp: getDocumentRevision()};
    const wrapper = getWrapper({...defaultProps});
    expect(wrapper.isEmptyRender()).toEqual(true);
  });

  it("Link sets props correctly", () => {
    const defaultProps: Props = { dataProp: { ...getDocumentRevision(), changeRequest: getChangeRequest() }};
    const path = changeRequestEditPath(defaultProps.dataProp.changeRequest.id);

    const wrapper = getWrapper({...defaultProps});

    expect(wrapper.find(Link).prop("to")).toEqual(path);
  });

  it("Tooltip sets prop title correctly", () => {
    const defaultProps: Props = { dataProp: { ...getDocumentRevision(), changeRequest: getChangeRequest() }};
    const title = stripTags(defaultProps.dataProp.changeRequest.description);

    const wrapper = getWrapper({...defaultProps});

    expect(wrapper.find(Tooltip).prop("title")).toEqual(title);
  });

  it("Displays crId", () => {
    const defaultProps: Props = { dataProp: { ...getDocumentRevision(), changeRequest: getChangeRequest() }};
    const wrapper = getWrapper({...defaultProps});
    expect(wrapper.find("span").contains(defaultProps.dataProp.changeRequest.crId)).toEqual(true);
  });
});
