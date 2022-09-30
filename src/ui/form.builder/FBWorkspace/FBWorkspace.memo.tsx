import { Box, Button } from "@material-ui/core";
import { get, isEqual, kebabCase, size } from "lodash";
import React from "react";
import { Observer } from "mobx-react";
import {
  FB,
  FBSchema,
  FBStarter,
  FBWorkspaceBottomBar,
  FBWorkspaceProps,
  FBWorkspaceSocket,
} from "..";
import { ReactComponent as AddIcon } from "../../../assets/images/formBuilder/add_icon.svg";
import {
  DocumentGroupType,
  DOC_TYPE_GROUP,
} from "../../../state/ducks/documentRevisions/documentType/types";
import Text from "../../components/Text";
import { DocTypeGroups } from "../../dashboard.new/line.items/common/types";
import Colors from "../../layout/theme/utils/colors";

const FBWorkspaceMemo: React.FunctionComponent<FBWorkspaceProps> = ({
  isStarter,
  schema,
  mode = "none",
  includeTransport = true,
  workspaceState,
  withoutBottomBar = false,
  _tabsState,
}) => {
  const addLHRStep = () => {
    const index = size(workspaceState?.getSchema());
    workspaceState?.setSchemaItemAt(
      {
        name: `${kebabCase("lhr-step")}-${FB.uniqid}`,
        type: "lhrstep",
        label: "LHR Step",
        index,
        tabId: _tabsState?.activeTabId,
        applicableOn: ["ON_STATE_TO_IN_REVIEW"],
        validationMode: "default",
        applicableValidationSchema: true,
      },
      index
    );
  };
  const docTypeGroup = get(
    workspaceState?.document?.document?.documentType,
    "group",
    "OTHER"
  );
  const outputTypeGroup = get(
    workspaceState?.document?.formTemplate?.outputDocumentTypes[0],
    "group"
  );
  const group: DocumentGroupType = docTypeGroup === DocTypeGroups.FORM ? outputTypeGroup : docTypeGroup;

  return (
    <Observer>
      {() => (
        <Box>
          <FBWorkspaceSocket />
          {size(schema) > 0 && (
            <FBSchema
              {...{ schema }}
              schemaState={workspaceState}
              workspaceMode={mode}
            />
          )}
          {_tabsState?.isTabActive("details") &&
            workspaceState?.mode === "design" &&
            [DOC_TYPE_GROUP.LHRT].includes(group as DOC_TYPE_GROUP) && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => {
                  addLHRStep();
                }}
                data-cy="form.builder.add.step"
                style={{
                  background: Colors.navy,
                  color: Colors.white,
                  border: `1px solid ${Colors.navy}`,
                  borderRadius: "100px",
                }}
              >
                <Text translation="form.builder.add.step" />
              </Button>
            )}
          {isStarter && _tabsState?.isTabActive("calpmhistory") && <FBStarter index={size(schema)} />}
          {!withoutBottomBar && <FBWorkspaceBottomBar {...{ includeTransport }} />}
        </Box>
      )}
    </Observer>
  );
};
export default React.memo(
  FBWorkspaceMemo,
  (prev: FBWorkspaceProps, next: FBWorkspaceProps) =>
    prev.mode === next.mode && isEqual(prev.schema, next.schema)
);
