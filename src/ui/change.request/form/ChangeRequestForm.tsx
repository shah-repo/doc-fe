/* eslint-disable no-console */
import { BoxProps } from "@material-ui/core";
import { FormikProps } from "formik";
import { cloneDeep, map } from "lodash";
import { Observer } from "mobx-react";
import React from "react";
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
}) => {
  const { _tabsState } = SM.useStores();

  _formState?.setMode(mode);
  _formState?.setAutosave(autosave);

  console.log(_documentRevisionFormState, currentDocRevId);

  const [isDrawerOpen, setOpen] = React.useState(true);

  const changeSidebarOpenStatus = (status) => {
    setOpen(status);
    changeOpenStatus(status);
  };

  const docTypeGroup = changeRequest?.documentType.group ?? "OTHER";
  let tabConfig = useSelector((state: ApplicationState) =>
    documentTypeSelectors.getTabConfiguration(state, docTypeGroup));

  tabConfig = tabConfig && [...tabConfig, {
    labelId: "tabId.items",
    tabId: TabTypeOptions.ITEMS.toLowerCase(),
    type: TabTypeOptions.ITEMS,
  } ];

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
              contentBoxProps={{ minHeight: _documentRevisionFormState?.expanded ? "100%" : "0px", height: "auto" }}
              boxProps={{ overflow: "auto" }}
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
                    boxProps={{ px: 3.75, py: 2, stretchY: "100%", display: "flex", flexDirection: "column" }}
                    panelProps={{ flex: 1 }}
                  >
                    {map(tabConfig, (tabInfo: TabInfo, index: number) => {
                      const tabType = tabInfo.type;
                      const showTabContent = _tabsState?.isTabActive(tabInfo.tabId);

                      return (
                        <SMBox key={index} {...{ py: 2 }}>
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
