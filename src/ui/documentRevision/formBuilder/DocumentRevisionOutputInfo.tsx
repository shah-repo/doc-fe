import { Box } from "@material-ui/core";
import React from "react";
import Date from "../../components/Date";
import documentRevisionStore from "../../form.builder/stores/custom/FBDocumentRevisionStore";

const DocumentRevisionOutputInfo: React.FunctionComponent<{}> = () => {

    const { outputInfo } = documentRevisionStore || {};
    const { docId, version, releasedDate } = outputInfo || {};

    return (
        <Box
            fontSize="subtitle1.fontSize"
            color="primary.main"
            py={1}
            mb={3}
        >
            Form Info:
            <Box fontSize="subtitle2.fontSize" color="text.primary">
            <Box>{docId}</Box>
            <Box>Version: {version}</Box>
            <Box>Released: {releasedDate &&  <Date value={releasedDate} />}</Box>
            </Box>
        </Box>
    );
};

export default DocumentRevisionOutputInfo;
