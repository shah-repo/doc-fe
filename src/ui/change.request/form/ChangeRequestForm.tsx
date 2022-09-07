/* eslint-disable no-console */
import { BoxProps } from "@material-ui/core";
import { cloneDeep, map } from "lodash";
import { Observer } from "mobx-react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { SM, SMBox, SMForm, SMProviderProps, SMTabs, SMTabsHOCProps, SMTemplate } from "../../../App";
import { withSMTabs } from "../../../App/Shifamed/Components/SMTabs/SMTabs.hoc";
import { changeRequestsSelectors } from "../../../state/ducks/changeRequest";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { TabInfo } from "../../../state/ducks/documentRevisions/documentType/types";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
import { FBSchemaProps, FBWorkspace, FBWorkspaceModeOptions } from "../../form.builder";
import { FBWorkspaceMode } from "../../form.builder/types/workspace";
import Colors from "../../layout/theme/utils/colors";
import FormHeader from "./assessmentForm/FormHeader";
import ChangeRequestSidebar from "./ChangeRequest.sidebar";
import ChangeRequestFormHeader from "./ChangeRequestFormHeader";
import { toChangeRequestFormValues } from "./transform";

type ChangeRequestFormProps =
& Pick<SMProviderProps, "_formState" | "_documentRevisionFormState">
& SMTabsHOCProps
& Pick<BoxProps, "onScroll">
& {
  asyncState: AsyncState;
  changeRequest?: ChangeRequest;
  doNotPrompt?: boolean;
  changeOpenStatus: (status: boolean) => void;
  schema?: FBSchemaProps[];
  mode: FBWorkspaceMode;
  withoutBottomBar: boolean;
  autosave: boolean;
};

const ChangeRequestForm: React.FunctionComponent<ChangeRequestFormProps> = ({
  asyncState,
  changeRequest,
  doNotPrompt,
  changeOpenStatus,
  schema,
  mode,
  withoutBottomBar,
  autosave,
  _formState,
}) => {
  const { _tabsState } = SM.useStores();
  _formState?.setMode(mode);

  // console.log(_formState);

  const [isDrawerOpen, setOpen] = React.useState(true);
  // const classes = styles({ isDrawerOpen });

  const changeSidebarOpenStatus = (status) => {
    setOpen(status);
    changeOpenStatus(status);
  };

  // eslint-disable-next-line dot-notation
  const docTypeGroup = (changeRequest as ChangeRequest)["documentType"].group ?? "OTHER";
  const tabConfig = useSelector((state: ApplicationState) =>
    changeRequestsSelectors.getTabConfiguration(state, docTypeGroup));

  const tabLabels: string[] = tabConfig?.map((tabInfo) => tabInfo.labelId);

  const onTabChange = (event, newValue, tabConfig) => {
    // console.log(event, newValue, tabConfig);
    _tabsState?.setValue(newValue);
    _tabsState?.setTabID(tabConfig[newValue].tabId);
  };

  useEffect(() => {
    if (!tabConfig) {
      return;
    }
    _tabsState?.setTabID(tabConfig[_tabsState.value].tabId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabConfig]);

  return (
    <SMForm
      templateBoxProps={{ stretchY: "100%", width: "100%" }}
      contentBoxProps={{
        minHeight: "calc(70%)",
        bgcolor: Colors.alabaster,
      }}
      values={toChangeRequestFormValues(changeRequest as ChangeRequest)}
      header= {
        <FormHeader {...{ changeRequest, asyncState }}/>
      }
    >
      <SMTemplate
        boxProps={{ className: "hide-scroll" }}
        templateBoxProps={{ stretchY: "100%" }}
        contentBoxProps={{ stretchY: "100%" }}
        rightSidebarBoxProps={{ zIndex: 2 }}
        {...changeRequest && changeRequest.crId && {
          rightSidebar: (
            <Observer>
              {() => <ChangeRequestSidebar changeRequest={changeRequest} isDrawerOpen={isDrawerOpen}
                setOpen={changeSidebarOpenStatus} fromEdit={true}/>}
            </Observer>
          ),
        }}
      >
        <Observer>
          {() => (
            <SMTemplate
              templateBoxProps={{ stretchY: "100%" }}
              contentBoxProps={{ minHeight: "0px", height: "auto" }}
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
                    onChange={(ev, newValue) => onTabChange?.(ev, newValue, tabConfig)}
                    tabs={tabLabels}
                    boxProps={{ px: 3.75, py: 2, stretchY: "100%", display: "flex", flexDirection: "column" }}
                    panelProps={{ flex: 1 }}
                  >
                    {map(tabConfig, (tabInfo: TabInfo, index: number) => {
                      const tabType = tabInfo.type;
                      const showTabContent = _tabsState?.tabID === tabInfo.tabId;

                      // console.log(tabType, showTabContent, _formState);

                      return (
                        <SMBox key={index} {...{ py: 2 }}>
                          {tabType === "MIXED" && showTabContent && changeRequest &&
                              <FBWorkspace
                                isPortal={false}
                                initialValues={cloneDeep(changeRequest?.formInput)}
                                changeRequest={cloneDeep(changeRequest)}
                                autosave={autosave}
                                withoutBottomBar={withoutBottomBar}
                                schema={schema}
                                mode={mode}
                              />
                          }
                          {tabType === "DYNAMIC" && showTabContent &&
                            _formState?.mode !== FBWorkspaceModeOptions.NONE &&
                            <FBWorkspace
                              isPortal={false}
                              initialValues={cloneDeep(changeRequest?.formInput)}
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
