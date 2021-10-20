import React from "react";
import RecentsPresenter from "./Recents.presenter";

const recentsData = [
  {
    type: "TRAINING",
    id: "cdf3e34cds44",
    docId: "PO-00125",
    title: "Seisa Manufacturing LLC",
    createdAt: "5 mins ago",
  },
  {
    type: "TRAINING",
    id: "cdf3e34ads44",
    docId: "PO-010125",
    title: "Seisa Manufacturing LLC",
    createdAt: "10 mins ago",
  },
  {
    type: "TRAINING",
    id: "adf3e34cds44",
    docId: "PO-010125",
    title: "Seisa Manufacturing LLC",
    createdAt: "5 mins ago",
  },
  {
    type: "TRAINING",
    id: "cvf3e34cds44",
    docId: "PO-00425",
    title: "Seisa Manufacturing LLC",
    createdAt: "35 mins ago",
  },
  {
    type: "TODO",
    id: "cdf324cds44",
    docId: "MPI-00200",
    title: "Mandrel Spray Painting",
    createdAt: "15 mins ago",
  },
  {
    type: "TODO",
    id: "cdz324cds44",
    docId: "MPI-00210",
    title: "Mandrel Spray Painting",
    createdAt: "25 mins ago",
  },
  {
    type: "TODO",
    id: "cdf1324cds44",
    docId: "MPI-01200",
    title: "Mandrel Spray Painting",
    createdAt: "45 mins ago",
  },
  {
    type: "TODO",
    id: "cdf3243rds44",
    docId: "MPI-030200",
    title: "Mandrel Spray Painting",
    createdAt: "2 Years ago",
  },
  {
    type: "MEETING",
    id: "cdf37512s44",
    docId: "FM-00232",
    title: "Management Review Meeting Minutes",
    createdAt: "18 hours ago",
  },
  {
    type: "MEETING",
    id: "cd37512s44",
    docId: "FM-009232",
    title: "Management Review Meeting Minutes",
    createdAt: "22 hours ago",
  },
  {
    type: "MEETING",
    id: "cdf37512s44",
    docId: "FM-00231",
    title: "Management Review Meeting Minutes",
    createdAt: "18 minutes ago",
  },
  {
    type: "PURCHASE_ORDER",
    id: "dft45v5445tv43t",
    docId: "SO-00345",
    title: "Supply Order Chain",
    createdAt: "Yesterday",
  },
  {
    type: "PURCHASE_ORDER",
    id: "dqt45v5445tv43t",
    docId: "SO-003245",
    title: "Supply Order Chain",
    createdAt: "18 minutes ago",
  },
  {
    type: "PURCHASE_ORDER",
    id: "dqtv5445tv43t",
    docId: "SO-013245",
    title: "Supply Order Chain",
    createdAt: "38 minutes ago",
  },
];

const RecentsContainer: React.FunctionComponent<{}> = () => (
  <>
    <RecentsPresenter {...{ recentsData }} />
  </>
);

export default RecentsContainer;
