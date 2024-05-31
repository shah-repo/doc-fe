// This document would be delete, would be only for mock data
export interface ButtonInfo {
  path: string
  name: string
}

export interface IconInfo {
  icon: 'check' | 'warning' | 'blank' | 'progress'
  text: string
}

export interface ErrorInfo {
  text: string
  path: string
}

export interface ImportItem {
  name: string
  progress: number
  date?: string
  button?: ButtonInfo
  icons?: IconInfo[]
  errors?: ErrorInfo
}

export interface ImportCategory {
  title: string
  items: ImportItem[]
}

export const importProgressData: ImportCategory[] = [
  {
    title: 'Documents',
    items: [
      {
        name: 'Documents',
        progress: 100,
        date: '11/03/2021',
      },
    ],
  },
  {
    title: 'Records',
    items: [
      {
        name: 'Training Records',
        progress: 86,
        button: {
          path: '/view',
          name: 'View',
        },
        icons: [
          {
            icon: 'check',
            text: 'Upload Data',
          },
          {
            icon: 'check',
            text: 'Map Columns',
          },
          {
            icon: 'check',
            text: 'Attachments',
          },
          {
            icon: 'progress',
            text: 'Approvals',
          },
        ],
      },
      {
        name: 'Equipment',
        progress: 25,
        button: {
          path: '/view',
          name: 'View',
        },
        icons: [
          {
            icon: 'check',
            text: 'Upload Data',
          },
          {
            icon: 'warning',
            text: 'Map Columns',
          },
          {
            icon: 'blank',
            text: 'Attachments',
          },
          {
            icon: 'blank',
            text: 'Approvals',
          },
        ],
        errors: {
          text: '20 rows contain errors.',
          path: '/errors',
        },
      },
    ],
  },
];

export const logData = [
  {
    title: 'Documents',
    items: [
      {
        name: 'Document Template.xlsx',
        date: '10/31/2021',
      },
    ],
  },
  {
    title: 'Records',
    items: [
      {
        name: 'Equipment Template.xlsx',
        date: '11/02/2021',
      },
      {
        name: 'Equipment.zip',
        date: '11/02/2021',
      },
      {
        name: 'Design Review Template.xlsx',
        date: '11/02/2021',
      },
      {
        name: 'Device History.zip',
        date: '11/02/2021',
      },
    ],
  },
];
