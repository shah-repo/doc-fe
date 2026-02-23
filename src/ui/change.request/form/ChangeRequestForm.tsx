import { BoxProps } from '@material-ui/core';
import { FormikProps, useFormikContext } from 'formik';
import { cloneDeep, isEqual, map } from 'lodash';
import { Observer, useObserver } from 'mobx-react';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SM, SMBox, SMForm, SMProviderProps, SMTabs, SMTabsHOCProps, SMTemplate } from '../../../App';
import { withSMTabs } from '../../../App/Shifamed/Components/SMTabs/SMTabs.hoc';
import { changeRequestsSelectors } from '../../../state/ducks/changeRequest';
import { ChangeRequest } from '../../../state/ducks/changeRequest/types';
import { companyActions } from '../../../state/ducks/company';
import { documentTypeSelectors } from '../../../state/ducks/documentRevisions/documentType';
import { TabIds, TabInfo, TabTypeOptions } from '../../../state/ducks/documentRevisions/documentType/types';
import { ApplicationState } from '../../../state/reducers';
import { AsyncState, AsyncStatus } from '../../../state/types';
import { useFormContext } from '../../components/forms/FormContext';
import PromptIfDirty from '../../components/forms/PromptIfDirty';
import { FB, FBSchemaProps, FBWorkspace, FBWorkspaceModeOptions } from '../../form.builder';
import { FBWorkspaceMode } from '../../form.builder/types/workspace';
import Colors from '../../layout/theme/utils/colors';
import FBMaterialDisposition from '../FBMaterialDisposition';
import ItemsAndDetailsWrapper from '../items.and.details/ItemsAndDetails.wrap';
import ChangeRequestSidebar from './ChangeRequest.sidebar';
import ChangeRequestFormHeader from './ChangeRequestFormHeader';
import FormHeader from './assessmentForm/FormHeader';
import { ChangeRequestFormValues } from './types';

type ChangeRequestFormProps =
& Pick<SMProviderProps, '_formState' | '_documentRevisionFormState'>
& SMTabsHOCProps
& Pick<BoxProps, 'onScroll'>
& {
  formValues: FormikProps<ChangeRequestFormValues>
  asyncState: AsyncState
  changeRequest?: ChangeRequest
  doNotPrompt?: boolean
  setDoNotPrompt?: (state: boolean) => void
  setMDTab?: (state: boolean) => void
  changeOpenStatus: (status: boolean) => void
  schema?: FBSchemaProps[]
  mode: FBWorkspaceMode
  withoutBottomBar: boolean
  autosave: boolean
  formInput?: Record<string, unknown>
  hideSideBar: boolean
  currentDocRevId?: string
  inDialog: boolean
};

const ChangeRequestForm: React.FunctionComponent<ChangeRequestFormProps> = ({
  formValues,
  asyncState,
  changeRequest,
  doNotPrompt,
  setDoNotPrompt,
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
  setMDTab,
}) => {
  const { _tabsState } = SM.useStores();
  const { formState } = FB.useStores();
  const { isEditing, isLoading } = useFormContext();
  const { touched } = useFormikContext<ChangeRequestFormValues>();
  const dispatch = useDispatch();
  const updatingAsyncState = useSelector(changeRequestsSelectors.getUpdateAsyncState);

  useEffect(() => {
    formState?.setSchema(schema);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema]);

  useEffect(() => {
    if (formState) {
      formState.workspaceMode = mode;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
  _formState?.setMode(mode);
  }, [_formState, mode]);

  useEffect(() => {
  _formState?.setAutosave(autosave);
  }, [_formState, autosave]);

  useEffect(() => {
    if (_tabsState?.isTabActive(TabTypeOptions.MATERIAL_DISPOSITION)) {
    setMDTab?.(true);
    }
  }, [_tabsState?.activeTabId]);

  const [isDrawerOpen, setOpen] = React.useState(true);

  const changeSidebarOpenStatus = (status: boolean) => {
    setOpen(status);
    changeOpenStatus(status);
  };

  const handlePromptConfirm = () => {
    setDoNotPrompt?.(true);
    dispatch(companyActions.setAutosaveConfig(true));
  };

  const handlePromptCancel = () => {
    if (isEditing) {
      dispatch(companyActions.setAutosaveConfig(false));
    }
  };

  const docTypeGroup = changeRequest?.documentType.group ?? 'OTHER';
  const tabConfig = useSelector((state: ApplicationState) =>
    documentTypeSelectors.getTabConfiguration(state, docTypeGroup));

  if (tabConfig?.findIndex((tab: TabInfo) => tab.labelId === 'tabId.items') === -1) {
    tabConfig.splice(1, 0, {
      labelId: 'tabId.items',
      tabId: TabTypeOptions.ITEMS.toLowerCase(),
      type: TabTypeOptions.ITEMS,
    });
  }
  console.log({ touched });

  const formInputValues = useObserver(() => {
    const v = formState?.getValues();
    console.log('useObserver: ', { v });
    if (!v) return v;

    const { formDocument, ...rest } = v;
    return rest;
  });

  useEffect(() => {
    const nextDirty = !isEqual(
      formInputValues,
    formValues.initialValues?.formInput,
    ) || touched?.isFormTouched;

    if (_formState?.isDirty !== nextDirty) {
    _formState?.setDirty(Boolean(nextDirty));
    }
  }, [
    formInputValues,
  formValues.initialValues?.formInput,
  _formState,
  touched,
  ]);

  useEffect(() => {
    if (inDialog) {
      _tabsState?.setActiveTabId(TabTypeOptions.ITEMS.toLowerCase());
    }
  }, []);

  const isDirty = useObserver(() => _formState?.isDirty ?? false);
  console.log({ isDirty, _formStateIsDirty: _formState?.isDirty, formStateValues: formState?.values });

  const shouldConfirmLeave = isDirty || updatingAsyncState.status === AsyncStatus.Active;

  const memoizedChangeRequest = useMemo(() => {
    if (!changeRequest) return changeRequest;
    return cloneDeep(changeRequest);
  }, [changeRequest?.crId, changeRequest?.updatedAt]);

  return (
    <SMForm
      templateBoxProps={{ stretchY: '100%', width: '100%' }}
      contentBoxProps={{ bgcolor: Colors.alabaster }}
      values={formValues.values}
      header= {
        <FormHeader {...{ changeRequest, asyncState, isLoading }} />
      }
    >
      <PromptIfDirty
        isDialog
        dirty={shouldConfirmLeave}
        doNotPrompt={doNotPrompt}
        onConfirm={handlePromptConfirm}
        onCancel={handlePromptCancel}
      />
      <SMTemplate
        boxProps={{ className: 'hide-scroll' }}
        templateBoxProps={{ stretchY: '100%' }}
        contentBoxProps={{ stretchY: '100%' }}
        rightSidebarBoxProps={{ zIndex: 2, marginBottom: 1 }}
        {...(changeRequest?.crId && !hideSideBar && {
          rightSidebar: (
            <Observer>
              {() => <ChangeRequestSidebar changeRequest={changeRequest} isDrawerOpen={isDrawerOpen}
                setOpen={changeSidebarOpenStatus} fromEdit tabConfig={tabConfig} />}
            </Observer>
          ),
        })}
      >
        <Observer>
          {() => (
            <SMTemplate
              templateBoxProps={{ stretchY: '100%' }}
              contentBoxProps={{
                overflow: _documentRevisionFormState?.expanded ? 'unset' : 'auto',
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
                    boxProps={{ px: 3.75, stretchY: '100%', display: 'flex', flexDirection: 'column' }}
                    panelProps={{ flex: 1 }}
                  >
                    {map(tabConfig, (tabInfo: TabInfo, index: number) => {
                      const tabType = tabInfo.type;
                      const showTabContent = _tabsState?.isTabActive(tabInfo.tabId);

                      return (
                        <SMBox key={index} pt={0.25}>
                          {tabType === TabTypeOptions.MIXED && showTabContent && changeRequest
                              && <FBWorkspace
                                isPortal={false}
                                initialValues={formInput}
                                formState={formState}
                                changeRequest={memoizedChangeRequest}
                                autosave={autosave}
                                withoutBottomBar={withoutBottomBar}
                                schema={schema}
                                mode={mode}
                              />
                          }
                          {tabType === TabTypeOptions.ITEMS
                            && _tabsState?.isTabActive(TabTypeOptions.ITEMS)
                            && changeRequest && (
                            <ItemsAndDetailsWrapper
                              currentDocRevId={currentDocRevId}
                              changeRequest={memoizedChangeRequest}
                              autosave={autosave}
                              mode={mode}
                              asyncState={asyncState}
                            />
                          )}
                          {tabType === TabTypeOptions.MATERIAL_DISPOSITION
                            && _tabsState?.isTabActive(TabIds.MATERIAL_DISPOSITION)
                            && <>
                              <FBMaterialDisposition changeRequest={memoizedChangeRequest} {...{ setDoNotPrompt }} />
                              <FBWorkspace
                                isPortal={false}
                                initialValues={formInput}
                                formState={formState}
                                changeRequest={memoizedChangeRequest}
                                autosave={autosave}
                                withoutBottomBar={withoutBottomBar}
                                schema={schema}
                                mode={mode}
                              />
                            </>
                          }
                          {tabType === TabTypeOptions.DYNAMIC && showTabContent
                            && _formState?.mode !== FBWorkspaceModeOptions.NONE
                            && <FBWorkspace
                              isPortal={false}
                              initialValues={formInput}
                              formState={formState}
                              changeRequest={memoizedChangeRequest}
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
