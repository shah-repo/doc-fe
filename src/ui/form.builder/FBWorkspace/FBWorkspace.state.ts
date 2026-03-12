import { cloneDeep, has, includes, isArray, isEmpty, map, omit, size } from 'lodash';
import { action, computed, get, observable, set } from 'mobx';
import { FBAutocompleteAsyncOption, FBAutocompleteAsyncState, FBInlineApprovalBody, FBLHRBuildOptions, FBSchemaState, FBWorkspaceConstructor, FBWorkspaceExternalState, FBWorkspaceMode } from '..';
import { saveApprovalRequest, saveDocumentRevision } from '../../../App/Shifamed/Utils/API';
import { appGlobals } from '../../../appGlobals';
import { getPayloadBasedOnWorkOrderType } from '../../../common/utils/helpers';
import { GroupTag, UserState } from '../../../state/ducks/auth/types';
import { ChangeRequest, ChangeRequestEditRequestBody, ChangeRequestStatus } from '../../../state/ducks/changeRequest/types';
import { DOC_TYPE_GROUP_OPTION } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, DocumentRevisionEditRequestBody, DocumentRevisionStatus, RevisionChangeType, SmartReferenceType } from '../../../state/ducks/documentRevisions/types';
import { LHRBuild } from '../../administration/general.settings/panels/LHRBuild/types';
import { FBEndpoint } from '../defaults/FBEndpoint';
import FBRequest from '../FBApi/FBApi.request';
import { COMMON_INITIAL_VALUES, INDIVIDUAL_INITIAL_VALUES } from '../FBInput/FBInput.wrap';
import { LHRS_END_DATE, LHRS_START_DATE } from '../FBLHRStep/utils';
import FBDataStore from '../FBStore/FBDataStore';
import FBStore from '../FBStore/FBStore';
import { CheckBoxOptionType } from '../FBSupplierCheckboxGroupAsync/types';

class FBWorkspaceState extends FBSchemaState {
  @observable public mode: FBWorkspaceMode = 'none';
  @observable public approvals?: FBInlineApprovalBody[];
  @observable loadAudit = false;
  @observable revisionChangeType?: RevisionChangeType;
  // Buffer between _formState loading and documentRevApi loading until we switch
  // everything to _formState
  @observable public loading = false;
  public externalState?: FBWorkspaceExternalState;
  public isPreview?: boolean;
  public isPreviewPanelVisible?: boolean;
  public document?: DocumentRevision;
  @observable public changeRequest?: ChangeRequest;
  @observable public autosave?: boolean;
  public documentRevApi = new FBRequest<DocumentRevision, Partial<DocumentRevisionEditRequestBody>>();
  public loadDocumentRevApi = new FBRequest<DocumentRevision, Partial<DocumentRevisionEditRequestBody>>();
  @observable.shallow
  public buildTypeOptions: LHRBuild[] = [];

  @observable.shallow
  public lhrBuildTypeConfig: LHRBuild[] = [];

  public loadBuildTypeOptionsApi = new FBAutocompleteAsyncState({ optionId: this.buildTypeOptionId });
  @observable public formInputSync = new Map<string, any>();
  public formInput?: Record<string, any>;

  @observable public isDirty = false;

  // @todo: Remove after moving fields validation to higher level.
  @observable public hiddenFieldsByRules = new Set<string>();

  public omitAutosave = false;
  public shouldPersistFormDataWithSchema?: boolean;

  @observable public checkboxGroupsOptionsMap = new Map<string, CheckBoxOptionType[]>();

  public constructor ({ schema, mode, autosave }: FBWorkspaceConstructor) {
    super(schema);
    this.schema = schema || [];
    this.mode = mode || 'none';
    this.autosave = autosave;
  }

  public get buildTypeOptionId (): string {
    return FBAutocompleteAsyncOption.buildType;
  }

  public get auth (): FBWorkspaceExternalState['auth'] | undefined {
    return this.externalState?.auth;
  }

  public get currentUser (): UserState | undefined {
    return this.auth?.user;
  }

  public get userTags (): GroupTag[] | undefined {
    return this.auth?.groups.tags;
  }

  public get company (): FBWorkspaceExternalState['company'] | undefined {
    return this.externalState?.company;
  }

  public get id (): string | undefined {
    return this.document?.id || this.changeRequest?.id;
  }

  public get documentId (): string | undefined {
    return this.document?.document?.id;
  }

  public get documentStatus (): DocumentRevisionStatus {
    return this.document?.status || DocumentRevisionStatus.Draft;
  }

  public get changeRequestStatus (): ChangeRequestStatus {
    return this.changeRequest?.state || ChangeRequestStatus.Draft;
  }

  public get isReleased (): boolean {
    return this.document?.status === DocumentRevisionStatus.Released;
  }

  public get isDraft (): boolean {
    return this.document?.status === DocumentRevisionStatus.Draft;
  }

  public get isPendingChange (): boolean {
    return this.document?.status === DocumentRevisionStatus.PendingChange;
  }

  public get isDeprecated (): boolean {
    return this.document?.status === DocumentRevisionStatus.Deprecated;
  }

  public get isOutput (): boolean {
    return !isEmpty(this.document?.formDocumentId);
  }

  private get allowedLHRInternalTypes (): FBLHRBuildOptions[] {
    return [
      FBLHRBuildOptions.Production,
      FBLHRBuildOptions.Clinical,
      FBLHRBuildOptions['Verification & Validation'],
    ];
  }

  public get isLHRProductionBuild (): boolean {
    const activeBuildTypeIds = this.buildTypeOptions
      .filter((buildType) => this.allowedLHRInternalTypes.includes(buildType.internalType as FBLHRBuildOptions))
      .map((buildType) => buildType.id);

    const effectiveBuildTypeIds = activeBuildTypeIds.length > 0 ? activeBuildTypeIds : this.allowedLHRInternalTypes;

    const smartReference = this.document?.smartReferencesTo?.find(
      (ref) => ref.active && ref.type === SmartReferenceType.HiddenPiInstance,
    );

    const lhrBuildType = smartReference?.toDocRev?.formInput?.['lhr-build-type'] as string;

    return !!lhrBuildType && effectiveBuildTypeIds.includes(lhrBuildType);
  }

  public get lhrBuildTypeConfigForSelectedBuildType (): LHRBuild | undefined {
    const buildType = this.document?.smartReferencesTo?.find(
      (ref) => ref.active && ref.type === SmartReferenceType.HiddenPiInstance,
    )?.toDocRev?.formInput?.['lhr-build-type'] as string | undefined;
    return this.lhrBuildTypeConfig?.find((config) => config.id === buildType);
  }

  public get lhrBuildTypeConfigFromFormInput (): LHRBuild | undefined {
    const buildType = this.formInput?.['lhr-build-type'] as string | undefined;
    return this.lhrBuildTypeConfig?.find((config) => config.id === buildType);
  }

  private get effectiveBuildTypeIds (): string[] {
    const activeBuildTypeIds = this.lhrBuildTypeConfig
      .filter((buildType) =>
        this.allowedLHRInternalTypes.includes(buildType.internalType as FBLHRBuildOptions),
      )
      .map((buildType) => buildType.id);

    return activeBuildTypeIds.length > 0
      ? activeBuildTypeIds
      : this.allowedLHRInternalTypes;
  }

  public get isLHRBuildFromFormInput (): boolean {
    const buildType = this.formInput?.['lhr-build-type'] as string | undefined;
    return !!buildType && this.effectiveBuildTypeIds.includes(buildType);
  }

  public get isLHRRelevantBuilds (): boolean {
    if (this.buildTypeOptions.length === 0) {
      return false;
    }

    const buildTypes = this.buildTypeOptions;
    const selectedBuildTypeId
    = this.document?.smartReferencesTo
      ?.find(ref => ref.active && ref.type === SmartReferenceType.HiddenPiInstance)
      ?.toDocRev?.formInput?.['lhr-build-type'];

    if (!buildTypes.length || !selectedBuildTypeId) {
      return false;
    }

    const selectedBuildType = buildTypes.find(
      option => option.id === selectedBuildTypeId,
    );

    return [
      FBLHRBuildOptions.Production,
      FBLHRBuildOptions.Clinical,
      FBLHRBuildOptions['Verification & Validation'],
    ].includes(selectedBuildType?.internalType as FBLHRBuildOptions);
  }

  public get isChangeRequest (): boolean {
    return !isEmpty(this.changeRequest);
  }

  public get isOutputSchema (): boolean {
    const { documentType: { groupOptions = [] } = {} } = this.document?.document ?? {};
    return groupOptions.includes(DOC_TYPE_GROUP_OPTION.EDITABLE_SCHEMA);
  }

  public get isRevised (): boolean | undefined {
    const { version = 0, revision = 0, outputRevision = false } = this.document || {};
    return ((version > 1) && (revision > 1)) || outputRevision;
  }

  @computed public get active (): boolean {
    return this.mode !== 'none';
  }

  @computed public get isStarter () {
    return (
      (this.mode === 'design' || this.mode === 'formDesign')
      && !size(this.schema?.filter((item) => !item.deleted))
    );
  }

  // TO BE REMOVED!!
  @action public resetSchema = () => {
    const schema = this.schema;
    set(this, 'schema', []);
    set(this, 'schema', schema);
  };

  @action public setMode = (mode: FBWorkspaceMode) => {
    set(this, 'mode', mode);
  };

  @action public setBuildTypeOptions = (data) => {
    set(this, 'buildTypeOptions', data);
  };

  @action public setLhrBuildTypeConfig = (data: LHRBuild[]) => {
    set(this, 'lhrBuildTypeConfig', data);
  };

  @action public setIsPreview = (isPreview: boolean) => {
    set(this, 'isPreview', isPreview);
  };

  @action public setAutosave = (autosave: boolean) => {
    set(this, 'autosave', autosave);
  };

  @action public setDocumentRevisionChangeType = (revisionChangeType: RevisionChangeType) => {
    set(this, 'revisionChangeType', revisionChangeType);
  };

  @action public getMode = (): FBWorkspaceMode => get(this, 'mode');

  @action public getFieldByName = (name: string) => this.document?.formInput?.[name];

  @action public isMode = (mode: FBWorkspaceMode | FBWorkspaceMode[]): boolean => {
    if (isArray(mode)) {
      return includes(mode, this.mode);
    }
    return this.mode === mode;
  };

  @action public getIsInputOwner = (name: string): boolean => {
    const {
      document,
      externalState: { auth: { user: { employeeId = '' } = {} } = {} } = {},
    } = this || {};

    const inputOwner = document?.inputOwners?.[name];
    const isDocRevOwner = document?.owner.id === employeeId;

    return inputOwner === undefined || inputOwner === employeeId || isDocRevOwner;
  };

  @action public setDirty = (isDirty: boolean) => {
    set(this, 'isDirty', isDirty);
  };

  @action public setShouldPersistFormDataWithSchema = (flag: boolean) => {
    set(this, 'shouldPersistFormDataWithSchema', flag);
  };

  @action public setFormInputSync = (name: string, value: any) => {
    set(this.formInputSync, name, value);
  };

  @action public setCheckboxGroupsOptionsMap = (name: string, value: CheckBoxOptionType[]) => {
    set(this.checkboxGroupsOptionsMap, name, value);
  };

  public saveDocRev = (values?: Record<string, any>, excludeAutoSave?: boolean) => {
    this.loadAudit = false;
    const { id, mode, autosave, isPreview } = this;
    if (!id || (mode === 'form' && !values) || (!autosave && !excludeAutoSave) || isPreview) {
      return;
    }
    this.loading = true;

    if (values && has(values, 'lhrstep-built-in')) {
      if (has(values, LHRS_START_DATE)) {
        delete values[LHRS_START_DATE];
      }
      if (has(values, LHRS_END_DATE)) {
        delete values[LHRS_END_DATE];
      }
    }

    const schema = this.schema?.map((schemaItem) => omit(schemaItem, ['autoFocus', 'autoScrollTo']));
    let body = {};
    switch (mode) {
      case 'design':
        body = {
          formTemplate: { schema },
        };
        break;
      case 'form':
      case 'formDesign':
        if (values) {
          const payload = getPayloadBasedOnWorkOrderType(cloneDeep(values));
          body = {
            formInput: omit(payload,
              Object.keys({ ...COMMON_INITIAL_VALUES, ...INDIVIDUAL_INITIAL_VALUES })),
            ...mode === 'formDesign' && this.isOutputSchema && { schema },
          };
        } else {
          body = {
            ...mode === 'formDesign' && this.isOutputSchema && { schema },
          };
        }
        break;
      default:
        return;
    }
    this.omitAutosave = true;
    appGlobals.omitReloadNotification = true;
    const isApprovalRequest = !this.document;
    const saveFunction = isApprovalRequest ? saveApprovalRequest : saveDocumentRevision;
    return saveFunction(id, body as DocumentRevisionEditRequestBody & ChangeRequestEditRequestBody)
      .then((data) => {
        this.setDirty(false);
        this.setFormInputData(data);
        if (!isEmpty(this.getItemsByType('inlineapproval'))) {
          FBStore.audit.set({
            url: FBEndpoint.DocumentRevisionAudit,
            urlValues: { documentId: id },
            method: 'get',
          });
        }
        if (FBStore?.isHistoryTabSelected) {
          this.loadAudit = true;
        }
        this.documentRevApi.onSuccess();
        FBDataStore.setRefreshData(data);
        this.approvals = data?.approvals as FBInlineApprovalBody[];
      }).catch((error) => {
        this.documentRevApi.onError(error);
      }).finally(() => {
        this.loading = false;
      });
  };

  public undoPO = (prevDocumentRevision?: DocumentRevision) => {
    this.loadAudit = false;
    this.loading = true;
    this.omitAutosave = true;

    const body = {
      formInput: prevDocumentRevision?.formInput,
      description: prevDocumentRevision?.description,
      attachments: prevDocumentRevision?.attachments,
    };
    const { id } = this;

    appGlobals.omitReloadNotification = true;

    return this.documentRevApi.set({
      url: FBEndpoint.DocumentRevisionPatch,
      urlValues: { id },
      body,
      method: 'patch',
    }, (data?: DocumentRevision, error?) => {
      this.omitAutosave = false;

      if (error) {
        this.documentRevApi.onError(error);
        this.loading = false;
        return;
      }
      this.setDirty(false);
      this.setFormInputData(data);
      if (FBStore?.isHistoryTabSelected) {
        this.loadAudit = true;
      }

      this.documentRevApi.onSuccess();
      FBDataStore.setRefreshData(data);
      this.loading = false;
    });
  };

  public setFormInputData = (data?: DocumentRevision) => {
    const { formInput = {} } = data ?? {};
    this.formInput = formInput;
    map(formInput, (value, key) => {
      set(this.formInputSync, key, value);
    });
  };

  public setFormInputDirectly = (data?: Record<string, any>) => {
    this.formInput = data;
    map(data, (value, key) => {
      set(this.formInputSync, key, value);
    });
  };

  public setId = (docRevId: string) => {
    set(this, 'id', docRevId);
  };

  public loadDocRev = (values?: Record<string, any>) => {
    const { id } = this;
    if (!id) { return; }

    this.loadDocumentRevApi.set({
      url: FBEndpoint.DocumentRevisionPatch,
      urlValues: { id },
      method: 'get',
    }, (data, error) => {
      if (error) {
        this.loadDocumentRevApi.onError(error);
      } else {
        this.loadDocumentRevApi.onSuccess();
        this.setFormInputData(data);
      }
    });
  };

  public updateDocRevById = (documentRevision?: Partial<DocumentRevision>, id?: string) => {
    return this.documentRevApi.set({
      url: FBEndpoint.DocumentRevisionPatch,
      urlValues: { id },
      body: {
        formInput: documentRevision?.formInput,
        description: documentRevision?.description,
      },
      method: 'patch',
    });
  };

  @action public addHiddenFieldByRules = (name: string): void => {
    this.hiddenFieldsByRules.add(name);
  };

  @action public deleteHiddenFieldByRules = (name: string): void => {
    this.hiddenFieldsByRules.delete(name);
  };

  public buildTypeChangeStatus = () => {
    const isBuildTypeChangeApprovalPending = this?.approvals?.filter(approval => approval?.type === 'SECTION' && approval?.fieldId === 'buildTypeApprovals' && approval?.status === 'PENDING');
    return isBuildTypeChangeApprovalPending && isBuildTypeChangeApprovalPending.length > 0;
  };
}

export default FBWorkspaceState;
