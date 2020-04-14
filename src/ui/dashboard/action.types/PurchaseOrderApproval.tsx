import { Button, Grid } from "@material-ui/core";
import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import Text from "../../components/Text";
import { documentPreviewPath } from "../../document.revision/utils/paths";
import GenerateHtmlPreview from "../../documentRevision/forms/presenters/GenerateHtmlPreview";
import { styles } from "./PendingAction.styles";

interface Props {
  key: number;
  documentRevision?: DocumentRevision;
}

const DOCUMENT_REVISION = {
  createdAt: "2020-04-14T09:52:21.577Z",
  updatedAt: "2020-04-14T09:52:46.228Z",
  id: "bdc36bcd-e5a7-43e7-a965-ed963c65715f",
  version: 13,
  revision: 13,
  revisionStage: 1,
  description: "<p>New PO fill 14:31</p>",
  name: "New PO fill 14:31",
  status: "IN_REVIEW",
  deprecatedAt: null,
  releasedAt: null,
  obsoletedAt: null,
  retrain: false,
  formInput: {
    "po-k8rb89sm": {
      items: [
        {
          id: "k8u0qb8s",
          index: 1,
          order: "10",
          glCode: "Code alpha - 123",
          units: "each",
          partNumber: "4a9376c1-4348-42fb-b359-68596eb52b4c",
          partNumberDocId: "FRM00250",
          partNumberTitle: "Datepicker test",
          date: "2020-04-10T12:31:00.000Z",
          description: "Lorem ispum",
          unitPrice: "2.00",
          formattedDate: "04/10/2020",
          totalAmount: "20.00",
          received: "5",
        },
        {
          id: "k8u773u7",
          index: 2,
          order: "5",
          glCode: "Code beta - 456",
          units: "each",
          partNumber: "18f0ae05-7787-412f-85a5-d4d4ecfd8b37",
          partNumberDocId: "PO00020",
          partNumberTitle: "HTML button fill 8:48",
          date: "2020-04-10T12:59:00.000Z",
          description: "New lorem",
          unitPrice: "9.99",
          tax: true,
          formattedDate: "04/10/2020",
          totalAmount: "53.20",
          received: "50",
        },
      ],
      shippingCost: "10.00",
      subTotal: "69.95",
      tax: "3.25",
      totalAmount: "83.20",
    },
  },
  revisionChangeType: "NEXT_REVISION",
  externalId: null,
  renderHTML: null,
  document: {
    createdAt: "2020-04-08T12:31:57.961Z",
    updatedAt: "2020-04-08T12:31:57.961Z",
    id: "5c521d41-ec85-4995-b6e5-ed51967d857a",
    docId: "PO00019",
    referencedBy: [
      {
        createdAt: "2020-04-08T13:13:54.223Z",
        updatedAt: "2020-04-08T13:13:54.223Z",
        id: "58d7bb05-fc38-466e-a4d6-0cd09b27d91c",
        version: 1,
        revision: 1,
        revisionStage: 1,
        description: "<p>Code alpha - 123-Lorem ispum</p>",
        name: "Code alpha - 123-Lorem ispum",
        status: "DRAFT",
        deprecatedAt: null,
        releasedAt: null,
        obsoletedAt: null,
        retrain: false,
        formInput: null,
        revisionChangeType: "NEXT_REVISION",
        externalId: null,
        renderHTML: null,
        document: {
          createdAt: "2020-04-08T13:13:54.223Z",
          updatedAt: "2020-04-08T13:13:54.223Z",
          id: "54295b9f-5cc8-4d9a-8a3e-e728edd79ee8",
          docId: "LOT00239",
        },
      },
      {
        createdAt: "2020-04-08T12:32:56.236Z",
        updatedAt: "2020-04-08T12:34:35.869Z",
        id: "f1b6e8e0-bcd4-45c0-bd4d-b0f21705ecb5",
        version: 1,
        revision: 1,
        revisionStage: 1,
        description: "<p>Code alpha - 123-Lorem ispum</p>",
        name: "Code alpha - 123-Lorem ispum",
        status: "IN_REVIEW",
        deprecatedAt: null,
        releasedAt: null,
        obsoletedAt: null,
        retrain: false,
        formInput: null,
        revisionChangeType: "NEXT_REVISION",
        externalId: null,
        renderHTML: null,
        document: {
          createdAt: "2020-04-08T12:32:56.236Z",
          updatedAt: "2020-04-08T12:32:56.236Z",
          id: "5035cc9e-967d-4c3d-970d-b5a83e384451",
          docId: "LOT00238",
        },
      },
    ],
    documentType: {
      createdAt: "2020-02-14T08:30:18.274Z",
      updatedAt: "2020-02-14T08:30:18.274Z",
      id: "8e2ab62b-607c-4700-8c46-4003b8e09476",
      documentTypeName: "Purchase Order",
      documentTypeAcronym: "PO",
      group: "OTHER",
      privateNumberPool: true,
      isQms: true,
      startingNumber: 1,
      pageDetails: {
        addNew: {
          label: "Purchase Order",
        },
        columns: [],
      },
      schema: null,
    },
  },
  owner: {
    createdAt: "2019-10-28T08:45:14.517Z",
    updatedAt: "2019-10-28T08:47:49.877Z",
    id: "96bf2305-58af-4120-8d7a-06b6e9db8c8c",
    active: true,
    slackUserId: null,
    user: {
      createdAt: "2019-11-05T13:00:19.508Z",
      updatedAt: "2020-03-12T11:32:34.612Z",
      id: "ad873536-00f1-4e84-8834-95454c5152dd",
      email: "zoran.babic+1@codecons.com",
      name: "Zoran Babic +1",
      confirmed: true,
      permissions: null,
      avatar: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/d0611cef-ba7a-4080-9ccd-70a324357d50/2020-01-20T16%3A31%3A37.776Z_dino.jpg",
    },
  },
  referenceTo: [],
  attachments: [],
  formTemplate: null,
  formDocument: {
    createdAt: "2020-04-08T12:30:37.321Z",
    updatedAt: "2020-04-08T12:31:05.497Z",
    id: "1c082b4c-e187-4a2d-9205-330bf27eb62d",
    version: 1,
    revision: 1,
    revisionStage: 1,
    description: "<p>New PO form 14:30</p>",
    name: "New PO form 14:30",
    status: "RELEASED",
    deprecatedAt: null,
    releasedAt: "2020-04-08T12:31:08.662Z",
    obsoletedAt: null,
    retrain: false,
    formInput: null,
    revisionChangeType: "NEXT_REVISION",
    externalId: null,
    renderHTML: null,
    formTemplate: {
      createdAt: "2020-04-08T12:30:37.321Z",
      updatedAt: "2020-04-08T12:30:37.321Z",
      id: "e0aad669-ce81-4f66-a4d3-f55312fb680c",
      helloSignTemplateId: null,
      schema: [
        {
          index: 0,
          name: "po-k8rb89sm",
          label: "PO",
          type: "purchaseorder",
          rules: "",
          applicableOn: [
            "ON_STATE_TO_IN_REVIEW",
          ],
          formValuesRules: {},
        },
      ],
    },
  },
};

export const PurchaseOrderApproval: React.FunctionComponent<Props> = ({
  key,
  documentRevision = DOCUMENT_REVISION,
}) => {
  const classes = styles();

  if (!documentRevision) {
    return null;
  }

  return (
    <Grid
      container={true}
      spacing={10}
      justify="space-between"
      alignItems="baseline"
      id={`PurchaseOrderApproval-pendingActions-${key}`}
    >
      <Grid item={true} xs={8}>
        <span className={classes.highlight}>{`Purchase Order: ${documentRevision.document.docId} `}</span>
        <span>{`from ${documentRevision.owner.user.name}: `}</span>
        <span>{documentRevision.name}</span>
      </Grid>
      <Grid
        item={true}
        container={true}
        xs={3}
        alignItems="flex-end"
        justify="flex-end"
        direction="row"
      >
        <GenerateHtmlPreview
          id={documentRevision.id}
          renderHTML={documentRevision.formDocument?.renderHTML}
        />
        <Button
          variant="contained"
          target="_blank"
          href={documentPreviewPath(documentRevision.id, documentRevision.document.id)}
          color="secondary"
          id={`PurchaseOrderApproval-open-${key}`}
        >
          <Text translation="common.open" />
        </Button>
      </Grid>
    </Grid>
  );
};

export default PurchaseOrderApproval;
