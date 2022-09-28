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
}) => {
  const { _tabsState } = SM.useStores();

  _formState?.setMode(mode);
  _formState?.setAutosave(autosave);

  const [isDrawerOpen, setOpen] = React.useState(true);

  const changeSidebarOpenStatus = (status) => {
    setOpen(status);
    changeOpenStatus(status);
  };

  // eslint-disable-next-line dot-notation
  const docTypeGroup = (changeRequest as ChangeRequest)["documentType"].group ?? "OTHER";
  const tabConfig = useSelector((state: ApplicationState) =>
    documentTypeSelectors.getTabConfiguration(state, docTypeGroup));

  const tabIds = tabConfig?.map(({ tabId }) => tabId);

  return (
    <SMForm
      templateBoxProps={{ stretchY: "100%", width: "100%" }}
      contentBoxProps={{
        minHeight: "calc(70%)",
        bgcolor: Colors.alabaster,
      }}
      values={formValues.values}
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
                    tabs={tabIds}
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
