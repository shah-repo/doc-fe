import { find } from 'lodash';
import React from 'react';
import { FBControlPickerDataProps, FBEditorCustomControl, FBFavouritesBody, FBFavouritesResponse, FBInputType, FBWorkspaceExternalState, FBWorkspaceState } from '..';
import { GroupTag } from '../../../state/ducks/auth/types';
import { store } from '../../../state/store';
import { checkIsDocumentBulkCreate, checkIsDocumentEquipment } from '../../documentRevision/helpers/checkDocumentGroup';
import { FBEndpoint } from '../defaults/FBEndpoint';
import FBRequest from '../FBApi/FBApi.request';

class FBControlPickerState extends FBRequest<FBFavouritesResponse, Partial<FBFavouritesBody>> {
  public data: FBFavouritesResponse| undefined;
  public favouritesAPI = new FBRequest<FBFavouritesBody, Partial<FBFavouritesBody>>(FBEndpoint.Favourites);
  public customPicker: Partial<Record<FBInputType, React.FunctionComponent<any>>> = {
    customcontrol: FBEditorCustomControl,
  };

  private workspaceState?: FBWorkspaceState;
  public url: FBEndpoint;

  public constructor(workspaceState?: FBWorkspaceState) {
    super();
    this.workspaceState = workspaceState;
    this.url = FBEndpoint.Favourites;
    this.fetch();
  }

  public picker = (picker: FBInputType, index: number): React.ReactElement | undefined => {
    const customPicker = this.customPicker[picker];
    if (!customPicker) {
      return;
    }
    return React.createElement(customPicker, { index });
  };

  public get pickers(): FBControlPickerDataProps {
    const isEQ = checkIsDocumentEquipment(this.workspaceState?.document?.document?.documentType?.groupOptions);
    if (isEQ) {
      return {
        inputs: [
          'eqmaintenance',
        ],
      };
    }
    return {
      section: ['section', 'subsection', 'stepsection'],
      inputs: [
        'textfield',
        'checkboxgroup',
        'autocomplete',
        'texteditor',
        'datepicker',
        'hyperlink',
        'select',
        'radiogroup',
        'paragraph',
        'fileupload',
        ...this.isOutputBulkCreate ? ['zipattachment'] as FBInputType[] : [],
        'blanktplform',
        'quantity',
        'timer',
        ...this.hasPurchaseOrder ? ['purchaseorder'] as FBInputType[] : [],
        ...this.hasRecPurchaseOrder ? ['poreceive'] as FBInputType[] : [],
        'poApprovalMatrix',
        'instructionsmediaupload',
        'evidencemediaupload',
        'procedure',
        'mpiprocedure',
        'eqmaintenance',
        'textfieldwithrange',
        'supplier',
      ],
      approvals: [
        'approvals',
        ...this.hasHelloSign ? ['hellosign'] as FBInputType[] : [],
        ...this.hasApproval ? ['inlineapproval'] as FBInputType[] : [],
        ...this.hasRequestApproval ? ['requestapproval'] as FBInputType[] : [],
      ],
      customcontrols: ['customcontrol'],
      instructions: ['instructionsdocument', 'selectdocument'],
      buttons: ['checkpoint', 'createlabel', 'task'],
      actions: ['action'],
    };
  }

  private get hasHelloSign(): boolean | undefined {
    const { company } = (store.getState() || {}) as FBWorkspaceExternalState;
    return company?.companyMine.helloSignIntegrationEnabled;
  }

  private get isOutputBulkCreate(): boolean | undefined {
    const BLCdoc = find(this.workspaceState?.externalState?.documentType?.byId, (doc) =>
      checkIsDocumentBulkCreate(doc.groupOptions));
    const isBLCOutput = this.workspaceState?.document?.outputDocumentTypes?.find((doc) => doc.value === BLCdoc?.id);
    return Boolean(isBLCOutput);
  }

  private get hasPurchaseOrder(): boolean | undefined {
    return this.workspaceState?.userTags?.includes(GroupTag.FB_COMPONENT_PURCHASE_ORDER);
  }

  private get hasRecPurchaseOrder(): boolean | undefined {
    return this.workspaceState?.userTags?.includes(GroupTag.FB_COMPONENT_RECEIVE_PURCHASE_ORDER);
  }

  private get hasApproval(): boolean | undefined {
    return this.workspaceState?.userTags?.includes(GroupTag.FB_COMPONENT_INLINE_APPROVAL);
  }

  private get hasRequestApproval(): boolean | undefined {
    return this.workspaceState?.userTags?.includes(GroupTag.FB_COMPONENT_REQUEST_APPROVAL);
  }
  public addFavourite = (
    type: FBInputType,
  ) => {
    this.favouritesAPI.set({
      url: FBEndpoint.Favourites,
      body: { fbComponent: type },
      method: 'post',
    }, (data, error) => {
      if (error) {
        this.favouritesAPI.onError(error);
      } else {
        this.favouritesAPI.data = data;
        this.favouritesAPI.onSuccess();
        this.fetch();
      }
    });
  };
  public removeFavourite = (
    id,
  ) => {
    this.favouritesAPI.set({
      url: FBEndpoint.ModifyFavourites,
      urlValues: { id },
      method: 'delete',
    }, (data, error) => {
      if (error) {
        this.favouritesAPI.onError(error);
      } else {
        this.favouritesAPI.data = data;
        this.favouritesAPI.onSuccess();
        this.fetch();
      }
    });
  };
}

export default FBControlPickerState;
