import { BoxProps } from "@material-ui/core";
import { FormikProps } from "formik";
import { cloneDeep, map } from "lodash";
import { Observer } from "mobx-react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { SM, SMBox, SMForm, SMProviderProps, SMTabs, SMTabsHOCProps, SMTemplate } from "../../../App";
import { withSMTabs } from "../../../App/Shifamed/Components/SMTabs/SMTabs.hoc";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { TabInfo, TabTypeOptions } from "../../../state/ducks/documentRevisions/documentType/types";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
import { FBSchemaProps, FBWorkspace, FBWorkspaceModeOptions } from "../../form.builder";
import { FBWorkspaceMode } from "../../form.builder/types/workspace";
import Colors from "../../layout/theme/utils/colors";
import ItemsAndDetailsWrapper from "../items.and.details/ItemsAndDetails.wrap";
import FormHeader from "./assessmentForm/FormHeader";
import ChangeRequestSidebar from "./ChangeRequest.sidebar";
import ChangeRequestFormHeader from "./ChangeRequestFormHeader";
import { ChangeRequestFormValues } from "./types";

type ChangeRequestFormProps =
& Pick<SMProviderProps, "_formState" | "_documentRevisionFormState">
& SMTabsHOCProps
& Pick<BoxProps, "onScroll">
& {
  formValues: FormikProps<ChangeRequestFormValues>;
  asyncState: AsyncState;
  changeRequest?: ChangeRequest;
  doNotPrompt?: boolean;
  changeOpenStatus: (status: boolean) => void;
  schema?: FBSchemaProps[];
  mode: FBWorkspaceMode;
  withoutBottomBar: boolean;
  autosave: boolean;
  formInput?: Record<string, any>;
  hideSideBar: boolean;
  currentDocRevId?: string;
  inDialog: boolean;
};

const ChangeRequestForm: React.FunctionComponent<ChangeRequestFormProps> = ({
  formValues,
  asyncState,
  changeRequest,
  doNotPrompt,
  changeOpenStatus,
  schema,
  mode,
  withoutBottomBar,
  autosave,
  _formState,
  formInput,
  _documentRevisionFormState,
  hideSideBar = false,
  currentDocRevId,
  inDialog = false,
}) => {
  const { _tabsState } = SM.useStores();

  _formState?.setMode(mode);
  _formState?.setAutosave(autosave);

  const [isDrawerOpen, setOpen] = React.useState(true);

  const changeSidebarOpenStatus = (status) => {
    setOpen(status);
    changeOpenStatus(status);
  };

  const docTypeGroup = changeRequest?.documentType.group ?? "OTHER";
  const tabConfig = useSelector((state: ApplicationState) =>
    documentTypeSelectors.getTabConfiguration(state, docTypeGroup));


  if (tabConfig.findIndex((tab: TabInfo) => tab.labelId === "tabId.items") === -1) {
    tabConfig.splice(1, 0, {
      labelId: "tabId.items",
      tabId: TabTypeOptions.ITEMS.toLowerCase(),
      type: TabTypeOptions.ITEMS,
    });
  }

  useEffect(() => {
    if (inDialog) {
      _tabsState?.setActiveTabId(TabTypeOptions.ITEMS.toLowerCase());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SMForm
      templateBoxProps={{ stretchY: "100%", width: "100%" }}
      contentBoxProps={{ bgcolor: Colors.alabaster }}
      values={formValues.values}
      header= {
        <FormHeader {...{ changeRequest, asyncState }}/>
      }
    >
      <SMTemplate
        boxProps={{ className: "hide-scroll" }}
        templateBoxProps={{ stretchY: "100%" }}
        contentBoxProps={{ stretchY: "100%" }}
        rightSidebarBoxProps={{ zIndex: 2, marginBottom: 1 }}
        {...changeRequest && changeRequest.crId && !hideSideBar && {
          rightSidebar: (
            <Observer>
              {() => <ChangeRequestSidebar changeRequest={changeRequest} isDrawerOpen={isDrawerOpen}
                setOpen={changeSidebarOpenStatus} fromEdit={true} />}
            </Observer>
          ),
        }}
      >
        <Observer>
          {() => (
            <SMTemplate
              templateBoxProps={{ stretchY: "100%" }}
              contentBoxProps={{
                overflow: _documentRevisionFormState?.expanded ? "unset" : "auto",
              }}
              header={<ChangeRequestFormHeader
                title={changeRequest?.title}
                description = {changeRequest?.description}
                documentTypeId={changeRequest?.formDocument?.document?.documentType?.id}
              />}
            >
              <Observer>
                {() => (
                  <SMTabs
                    tabs={tabConfig}
                    boxProps={{ px: 3.75, stretchY: "100%", display: "flex", flexDirection: "column" }}
                    panelProps={{ flex: 1 }}
                  >
                    {map(tabConfig, (tabInfo: TabInfo, index: number) => {
                      const tabType = tabInfo.type;
                      const showTabContent = _tabsState?.isTabActive(tabInfo.tabId);

                      return (
                        <SMBox key={index} pt={.25}>
                          {tabType === TabTypeOptions.MIXED && showTabContent && changeRequest &&
                              <FBWorkspace
                                isPortal={false}
                                initialValues={formInput}
                                changeRequest={cloneDeep(changeRequest)}
                                autosave={autosave}
                                withoutBottomBar={withoutBottomBar}
                                schema={schema}
                                mode={mode}
                              />
                          }
                          {tabType === TabTypeOptions.ITEMS &&
                            _tabsState?.isTabActive(TabTypeOptions.ITEMS) &&
                            changeRequest && (
                            <ItemsAndDetailsWrapper
                              currentDocRevId={currentDocRevId}
                              changeRequest={cloneDeep(changeRequest)}
                              initialValues={formInput ?? {}}
                              autosave={autosave}
                              mode={mode}
                              asyncState={asyncState}
                            />
                          )}
                          {tabType === TabTypeOptions.DYNAMIC && showTabContent &&
                            _formState?.mode !== FBWorkspaceModeOptions.NONE &&
                            <FBWorkspace
                              isPortal={false}
                              initialValues={formInput}
                              changeRequest={cloneDeep(changeRequest)}
                              autosave={autosave}
                              withoutBottomBar={withoutBottomBar}
                              schema={schema}
                              mode={mode}
                            />
                          }
                        </SMBox>
                      );
                    })}
                  </SMTabs>
                )}
              </Observer>
            </SMTemplate>
          )}
        </Observer>
      </SMTemplate>
    </SMForm>
  );
};


export default withSMTabs(ChangeRequestForm);
