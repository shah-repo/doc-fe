import React from "react";
import RecentsPresenter from "./Recents.presenter";

const recentsData = [
  {
    type: "PO",
    id: "cdf3e34cds44",
    docId: "PO-00125",
    title: "Seisa Manufacturing LLC",
    createdAt: "5 mins ago",
  },
  {
    type: "PO",
    id: "cdf3e34ads44",
    docId: "PO-010125",
    title: "Seisa Manufacturing LLC",
    createdAt: "10 mins ago",
  },
  {
    type: "PO",
    id: "adf3e34cds44",
    docId: "PO-010125",
    title: "Seisa Manufacturing LLC",
    createdAt: "5 mins ago",
  },
  {
    type: "PO",
    id: "cvf3e34cds44",
    docId: "PO-00425",
    title: "Seisa Manufacturing LLC",
    createdAt: "35 mins ago",
  },
  {
    type: "MPI",
    id: "cdf324cds44",
    docId: "MPI-00200",
    title: "Mandrel Spray Painting",
    createdAt: "15 mins ago",
  },
  {
    type: "MPI",
    id: "cdz324cds44",
    docId: "MPI-00210",
    title: "Mandrel Spray Painting",
    createdAt: "25 mins ago",
  },
  {
    type: "MPI",
    id: "cdf1324cds44",
    docId: "MPI-01200",
    title: "Mandrel Spray Painting",
    createdAt: "45 mins ago",
  },
  {
    type: "MPI",
    id: "cdf3243rds44",
    docId: "MPI-030200",
    title: "Mandrel Spray Painting",
    createdAt: "2 Years ago",
  },
  {
    type: "FM",
    id: "cdf37512s44",
    docId: "FM-00232",
    title: "Management Review Meeting Minutes",
    createdAt: "18 hours ago",
  },
  {
    type: "FM",
    id: "cd37512s44",
    docId: "FM-009232",
    title: "Management Review Meeting Minutes",
    createdAt: "22 hours ago",
  },
  {
    type: "FM",
    id: "cdf37512s44",
    docId: "FM-00231",
    title: "Management Review Meeting Minutes",
    createdAt: "18 minutes ago",
  },
  {
    type: "SOP",
    id: "dft45v5445tv43t",
    docId: "SOP-00345",
    title: "Supply Order Chain",
    createdAt: "Yesterday",
  },
  {
    type: "SOP",
    id: "dqt45v5445tv43t",
    docId: "SOP-003245",
    title: "Supply Order Chain",
    createdAt: "18 minutes ago",
  },
  {
    type: "SOP",
    id: "dqtv5445tv43t",
    docId: "SOP-013245",
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
