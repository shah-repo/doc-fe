import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  List,
  Typography,
} from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandMore";
import classNames from "classnames";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Nullable, TypographySize } from "../../state/ducks/common";
import { DocumentRevision, documentRevisionsActions, documentRevisionsSelectors } from "../../state/ducks/documentRevisions";
import SummaryInfo from "../common/summary/SummaryInfo";
import AsyncGate from "../components/AsyncGate";
import Date from "../components/Date";
import Text from "../components/Text";
import { documentVersionPath } from "../document.revision/utils/paths";
import { styles } from "./DocumentRevisionList.container.styles";
import { generateVersionNumber } from "./helpers";

interface OwnProps {
  documentRevisions: DocumentRevision[];
  documentId: string;
  docId: string;
  selectedDocumentRevision: Nullable<string>;
  documentRevisionId: Nullable<string>;
}

export type DocumentRevisionListContainerProps = OwnProps;

// used by the document revision manager container
export const DocumentRevisionListContainer: React.FunctionComponent<
DocumentRevisionListContainerProps
> = ({
  documentRevisions,
  documentId,
  docId,
  selectedDocumentRevision,
  documentRevisionId,
}) => {
  const classes = styles();
  const [expanded, setExpanded] = React.useState<boolean>(true);
  const handleChange = () => () => setExpanded(!expanded);
  const dispatch = useDispatch();
  const loadDocumentAsyncState = useSelector(documentRevisionsSelectors.getLoadDocumentAsyncState);
  const loadDocumentAction = useCallback(() => {
      dispatch(documentRevisionsActions.loadDocument(documentId));
  }, [dispatch, documentId]);

  useEffect(() => {
    loadDocumentAction();
  }, [loadDocumentAction, documentId]);

  return (
    <AsyncGate
      asyncState={loadDocumentAsyncState}
      asyncAction={loadDocumentAction}
      startActionOnMount={false}
    >
      <div className={classes.container}>
        <ExpansionPanel expanded={expanded} onChange={handleChange()}>
          <ExpansionPanelSummary expandIcon={<ExpandLessIcon />}>
            <Typography variant={TypographySize.md}>
              <Text translation="document.revision.docVersion" />
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.details}>
            <List>
              {documentRevisions.map((documentRevision) => {
                const link = documentVersionPath(
                  documentRevision.id,
                  documentId,
                );
                const isSelected =
                  selectedDocumentRevision === documentRevision.id;
                return (
                  <div
                    key={documentRevision.id}
                    className={classNames(classes.linkContainer, {
                      [classes.selected]: isSelected,
                    })}
                  >
                    <NavLink
                      to={link}
                      className={classes.linkTitle}
                      activeClassName={classes.activeLinkTitle}
                    >
                      <div>
                        <Text translation="common.version" />
                        &nbsp;
                        {generateVersionNumber(
                          documentRevision.revision,
                          documentRevision.revisionStage,
                          documentRevision.revisionChangeType,
                        )}
                        &nbsp; - {documentRevision.status}
                      </div>
                    </NavLink>
                    <NavLink
                      to={link}
                      key={documentRevision.id}
                      className={classes.linkBody}
                    >
                      <SummaryInfo label="common.docId" value={docId} />
                      <SummaryInfo
                        label="common.title"
                        value={documentRevision.name}
                      />
                      <SummaryInfo
                        label="common.owner"
                        value={documentRevision.owner.user.name}
                      />
                      <SummaryInfo
                        label="common.released"
                        value={
                          <Date
                            value={
                              documentRevision.obsoletedAt ||
                              documentRevision.releasedAt
                            }
                          />
                        }
                      />
                    </NavLink>
                  </div>
                );
              })}
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    </AsyncGate>
  );
};

export default DocumentRevisionListContainer;
