import { shallow } from "enzyme";
import React from "react";
import {
    PreviewControlsContainer,
    PreviewControlsContainerProps,
} from "./PreviewControls.container";
import { getDocumentRevision } from "../../state/ducks/documentRevisions/tests/factories";
import getRouteComponentProps from "../tests/helpers/getRouteComponentProps";
import { DocumentRevisionStatus } from "../../state/ducks/documentRevisions";
import { Button } from "@material-ui/core";

describe("PreviewControls tests", () => {
    const documentRevision = {...getDocumentRevision(), status: DocumentRevisionStatus.Released};

    const defaultProps: PreviewControlsContainerProps = {
        canShowCreateVersionButton: true,
        disableCreateNewVersion: false,
        ...getRouteComponentProps(),
    } as PreviewControlsContainerProps;

    const getWrapper = (props: Partial<PreviewControlsContainerProps>= {}) => shallow(
        <PreviewControlsContainer documentRevision={documentRevision} {...defaultProps} {...props}/>,
    );

    it("Displays correctly when it's possible to create new version", () => {
        const wrapper = getWrapper();

        expect(wrapper.find(Button)).toHaveLength(1);
    });

    it("Displays correctly when it's not possible to create new version ", () => {
        const documentRevision = getDocumentRevision();
        const wrapper = getWrapper({documentRevision});

        expect(wrapper.find(Button)).toHaveLength(0);
    });
});
