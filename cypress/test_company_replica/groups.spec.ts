// eslint-disable-next-line max-len
// [*].{id:id, name: name, permissions: permissions, defaultForNewUsers: defaultForNewUsers, isOfficial: isOfficial, tags: tags, employees: employees[*].{id: id}, parents: parents[*].{id: id}}

interface GROUP {
  name: string;
  permissions: string[];
  defaultForNewUsers: boolean;
  tags: string[];
  isOfficial: boolean;
  employees: {
    id: string;
  }[];
  parents: {
    id: string;
  }[];
  oldId: string;
  newId?: string;
}

export const groups: GROUP[] = [
  {
    name: "Owner as approver",
    permissions: [
      "CR_OWNER_AS_APPROVER",
    ],
    defaultForNewUsers: true,
    tags: [],
    isOfficial: true,
    employees: [
      {
        id: "1a29a04b-eeab-4edb-93de-6241a39a72a1",
      },
      {
        id: "406961b8-8760-4cb5-aa85-d399bd12d112",
      },
      {
        id: "166b6ca6-fc47-487e-8716-a149e229de76",
      },
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "7e3515f3-64f7-4756-a85e-e3a2cff319c2",
      },
      {
        id: "11aabaf8-db0c-4675-976e-5f6377f1bd2d",
      },
      {
        id: "51b17d23-ff76-4f82-bd04-c09650b86962",
      },
      {
        id: "ccf055fd-3f08-41d0-ac05-a4f3b5e6be91",
      },
      {
        id: "28fd7ba8-a6e0-455c-a4a5-a114b67dad81",
      },
      {
        id: "6e23aa79-6df6-4529-9f78-a652224db2fb",
      },
      {
        id: "af422bd2-b87b-4cf9-9c41-04abb827a2f1",
      },
      {
        id: "d3a82a92-0233-458c-82ee-66224d103389",
      },
      {
        id: "013777c8-74ab-4acf-ba18-427bfd5da7f0",
      },
      {
        id: "102e1d1a-df39-4e26-9b89-a788d723f59c",
      },
      {
        id: "c11a17bc-bd48-498a-ba51-7fc0ea02a256",
      },
      {
        id: "45f96be2-2488-4ca8-9889-8fcb68b5ab38",
      },
      {
        id: "6b87ca10-8519-4291-a33f-e1017625a2c9",
      },
      {
        id: "3dd485b2-2762-45c0-820f-33f95e011ca7",
      },
      {
        id: "26a9b3bd-e22d-4fbb-bd14-53f9ac862c56",
      },
      {
        id: "23c014f1-25fa-4957-b61a-27e2ff2ae374",
      },
      {
        id: "f6b709ac-2348-4d8e-ac30-a9a80105448e",
      },
      {
        id: "4a5a021d-e548-4d64-8c0b-2ae9bb6a2212",
      },
      {
        id: "713e2790-2b39-4d61-aa09-151f816c4b36",
      },
      {
        id: "36f2772a-524b-4e71-b69a-4517319648ed",
      },
      {
        id: "822cc779-5c2f-4d57-b627-5229dca9cf95",
      },
      {
        id: "2c9860c4-7f8e-4b81-970a-5b42899d446b",
      },
      {
        id: "2aa35acf-509c-4afe-a00b-119bf725ef2d",
      },
      {
        id: "b154632e-3ac3-4895-a7da-417bc6f98f28",
      },
      {
        id: "3170c488-95ab-43cc-b23d-72c42aad25f7",
      },
      {
        id: "083a6e33-0bc9-48ae-8e64-c3c3e4d05c9c",
      },
      {
        id: "3ac8bc3e-b068-405d-a819-b80df7029d08",
      },
      {
        id: "63a18b13-b810-4a40-8ad2-a020ed403c26",
      },
      {
        id: "262bbed7-e0da-46db-bc09-aff4f2e36bb9",
      },
      {
        id: "aff47949-f88e-433a-bfd3-5493b3536bd9",
      },
      {
        id: "34b1570c-1f79-43de-a105-19e804859aee",
      },
      {
        id: "ac5addfc-18c6-44a8-a02c-49fb7b34167a",
      },
      {
        id: "bc049ba0-8563-4cfe-8bc5-cc8eae8f77c4",
      },
      {
        id: "62b669b9-fc16-45ba-8b01-c5b2d21e5015",
      },
      {
        id: "8283f26b-a00f-48d9-a977-33199fdd729d",
      },
      {
        id: "2124f261-0077-4842-b026-a6b09a9136cc",
      },
      {
        id: "976a5832-524e-462d-b53a-6aa24a5ef563",
      },
      {
        id: "a94278d8-f2b8-40dc-85ee-1f5d856c95a1",
      },
      {
        id: "40980232-8446-4e31-be23-2156586e1d32",
      },
      {
        id: "af516b53-ade9-4220-b677-9f8d848a939d",
      },
      {
        id: "13296bd6-4b99-486c-adbc-a859d63aca07",
      },
      {
        id: "0a89fa5f-4c08-422c-8245-9df8fa32905f",
      },
      {
        id: "b96ea913-b454-4a4e-8b5c-68cc7bd7b617",
      },
      {
        id: "8fe51fec-1f80-4af2-a1cc-397f51dde485",
      },
      {
        id: "ce6e6296-539e-4575-b10e-e4b9535813cb",
      },
      {
        id: "7d06d96c-de07-4951-8c23-1586f3c7af53",
      },
      {
        id: "7056c6f9-b01c-4e9f-bf83-5c7d488d75d7",
      },
      {
        id: "6d2f864c-5e3f-4d19-8697-e2ac93853a30",
      },
      {
        id: "6ee87760-33cd-41a3-a71e-a108b4b7cabe",
      },
      {
        id: "59c174be-3716-4132-a819-cb981e866f40",
      },
      {
        id: "650abb93-e541-4c35-aaea-ef6c42b6ede1",
      },
      {
        id: "fe07d037-e0bb-4c10-9e3e-12311928daee",
      },
      {
        id: "f117674a-0f84-4c50-acd5-d0d7e3cc58e2",
      },
      {
        id: "614d0e9e-d063-49ba-83a5-f070132539a1",
      },
      {
        id: "08559b66-ae6c-415e-8779-a7aaa0f439cb",
      },
      {
        id: "30fd56e9-1b04-4c77-bc33-e67c74e3f64b",
      },
      {
        id: "470f7456-180c-427c-af08-044b45173eb0",
      },
      {
        id: "004b5980-e678-4d79-abdd-04db85d66451",
      },
      {
        id: "35c095ce-62e9-42dd-9e0e-d9449dfa46d5",
      },
      {
        id: "26c8e969-0340-4175-8f18-8ba46fcea76e",
      },
      {
        id: "44f472f1-c0fd-4e4e-a089-90f8016ee20c",
      },
      {
        id: "0d444eb8-ca3e-4bd3-96a2-50df090adce4",
      },
      {
        id: "8e52357c-cb27-49dd-afce-1a84d4c9abd8",
      },
      {
        id: "c04aadb7-54d1-426d-91c3-3169868d9523",
      },
      {
        id: "4e613ce7-6638-4196-ac35-ec1c4d42638a",
      },
      {
        id: "a5c2d647-b2a7-49b1-8caf-36f87a971520",
      },
      {
        id: "a4d6cad9-5a91-4313-ae49-c1bf6170b307",
      },
      {
        id: "632d11d3-f25b-47f6-84b5-fba828d6fb7e",
      },
      {
        id: "3808cb12-5dc2-4f06-992b-d7ca33e76b14",
      },
      {
        id: "6d3b52e5-1ace-4b6e-8bb0-c6567c9500b4",
      },
      {
        id: "b824669f-f7c7-409b-8c27-3047f0910708",
      },
      {
        id: "72f742e3-aa56-463b-bc2f-ec5ef48cf41b",
      },
      {
        id: "44a29c5f-f9a4-4098-ba32-a39633e19d2c",
      },
      {
        id: "82877aed-d7f9-485d-8765-8d344eaceecc",
      },
      {
        id: "da0935b5-80cd-491c-ba81-57f74a789eb2",
      },
      {
        id: "7f939f5e-4aab-4ac8-8613-068429944b9a",
      },
      {
        id: "9823011b-da67-4305-b2dd-759ae9e21c1c",
      },
      {
        id: "39a832c3-fbcc-43ea-9b96-be130629014e",
      },
      {
        id: "297dce04-0b86-457b-a286-f6886a23759a",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
      {
        id: "6f8d46ab-81a1-4360-987d-fa6e39c00afe",
      },
      {
        id: "16168c99-2544-4af0-b378-a7852c9e1537",
      },
      {
        id: "4ddc1c9b-5826-49a8-b6be-d01a62d0a996",
      },
      {
        id: "e47f206f-ef1b-4876-b356-ae34d44d522d",
      },
    ],
    parents: [],
    oldId: "af6a067b-0476-46b2-a047-7a4d3116bcd6",
  },
  {
    name: "Can be approver",
    permissions: [
      "CR_ON_APPROVER_LIST",
    ],
    defaultForNewUsers: true,
    tags: [],
    isOfficial: true,
    employees: [
      {
        id: "ccf055fd-3f08-41d0-ac05-a4f3b5e6be91",
      },
      {
        id: "28fd7ba8-a6e0-455c-a4a5-a114b67dad81",
      },
      {
        id: "6e23aa79-6df6-4529-9f78-a652224db2fb",
      },
      {
        id: "af422bd2-b87b-4cf9-9c41-04abb827a2f1",
      },
      {
        id: "d3a82a92-0233-458c-82ee-66224d103389",
      },
      {
        id: "013777c8-74ab-4acf-ba18-427bfd5da7f0",
      },
      {
        id: "102e1d1a-df39-4e26-9b89-a788d723f59c",
      },
      {
        id: "c11a17bc-bd48-498a-ba51-7fc0ea02a256",
      },
      {
        id: "45f96be2-2488-4ca8-9889-8fcb68b5ab38",
      },
      {
        id: "6b87ca10-8519-4291-a33f-e1017625a2c9",
      },
      {
        id: "3dd485b2-2762-45c0-820f-33f95e011ca7",
      },
      {
        id: "26a9b3bd-e22d-4fbb-bd14-53f9ac862c56",
      },
      {
        id: "23c014f1-25fa-4957-b61a-27e2ff2ae374",
      },
      {
        id: "f6b709ac-2348-4d8e-ac30-a9a80105448e",
      },
      {
        id: "4a5a021d-e548-4d64-8c0b-2ae9bb6a2212",
      },
      {
        id: "713e2790-2b39-4d61-aa09-151f816c4b36",
      },
      {
        id: "36f2772a-524b-4e71-b69a-4517319648ed",
      },
      {
        id: "822cc779-5c2f-4d57-b627-5229dca9cf95",
      },
      {
        id: "2c9860c4-7f8e-4b81-970a-5b42899d446b",
      },
      {
        id: "2aa35acf-509c-4afe-a00b-119bf725ef2d",
      },
      {
        id: "b154632e-3ac3-4895-a7da-417bc6f98f28",
      },
      {
        id: "3170c488-95ab-43cc-b23d-72c42aad25f7",
      },
      {
        id: "083a6e33-0bc9-48ae-8e64-c3c3e4d05c9c",
      },
      {
        id: "3ac8bc3e-b068-405d-a819-b80df7029d08",
      },
      {
        id: "63a18b13-b810-4a40-8ad2-a020ed403c26",
      },
      {
        id: "262bbed7-e0da-46db-bc09-aff4f2e36bb9",
      },
      {
        id: "aff47949-f88e-433a-bfd3-5493b3536bd9",
      },
      {
        id: "34b1570c-1f79-43de-a105-19e804859aee",
      },
      {
        id: "ac5addfc-18c6-44a8-a02c-49fb7b34167a",
      },
      {
        id: "bc049ba0-8563-4cfe-8bc5-cc8eae8f77c4",
      },
      {
        id: "62b669b9-fc16-45ba-8b01-c5b2d21e5015",
      },
      {
        id: "8283f26b-a00f-48d9-a977-33199fdd729d",
      },
      {
        id: "2124f261-0077-4842-b026-a6b09a9136cc",
      },
      {
        id: "976a5832-524e-462d-b53a-6aa24a5ef563",
      },
      {
        id: "2761edb0-1201-4c28-8def-20016ff400b5",
      },
      {
        id: "3f6fce6a-57d3-49c4-8a14-e337d0228f21",
      },
      {
        id: "b0c7b0ea-5cc6-490d-ae2b-489b6cf9e9d1",
      },
      {
        id: "537a9ec2-f883-4c25-8469-fe27c8a13b4e",
      },
      {
        id: "2152ad90-b2c5-4599-9a76-b239a1f8d909",
      },
      {
        id: "c517c8bc-2f6f-4e35-98df-8eee9b7a58e3",
      },
      {
        id: "a94278d8-f2b8-40dc-85ee-1f5d856c95a1",
      },
      {
        id: "40980232-8446-4e31-be23-2156586e1d32",
      },
      {
        id: "af516b53-ade9-4220-b677-9f8d848a939d",
      },
      {
        id: "13296bd6-4b99-486c-adbc-a859d63aca07",
      },
      {
        id: "0a89fa5f-4c08-422c-8245-9df8fa32905f",
      },
      {
        id: "b96ea913-b454-4a4e-8b5c-68cc7bd7b617",
      },
      {
        id: "8fe51fec-1f80-4af2-a1cc-397f51dde485",
      },
      {
        id: "ce6e6296-539e-4575-b10e-e4b9535813cb",
      },
      {
        id: "7d06d96c-de07-4951-8c23-1586f3c7af53",
      },
      {
        id: "7056c6f9-b01c-4e9f-bf83-5c7d488d75d7",
      },
      {
        id: "6d2f864c-5e3f-4d19-8697-e2ac93853a30",
      },
      {
        id: "6ee87760-33cd-41a3-a71e-a108b4b7cabe",
      },
      {
        id: "59c174be-3716-4132-a819-cb981e866f40",
      },
      {
        id: "650abb93-e541-4c35-aaea-ef6c42b6ede1",
      },
      {
        id: "fe07d037-e0bb-4c10-9e3e-12311928daee",
      },
      {
        id: "f117674a-0f84-4c50-acd5-d0d7e3cc58e2",
      },
      {
        id: "614d0e9e-d063-49ba-83a5-f070132539a1",
      },
      {
        id: "08559b66-ae6c-415e-8779-a7aaa0f439cb",
      },
      {
        id: "30fd56e9-1b04-4c77-bc33-e67c74e3f64b",
      },
      {
        id: "2dd528ae-1ef1-4e5d-bef9-1dc4117d03ef",
      },
      {
        id: "470f7456-180c-427c-af08-044b45173eb0",
      },
      {
        id: "004b5980-e678-4d79-abdd-04db85d66451",
      },
      {
        id: "35c095ce-62e9-42dd-9e0e-d9449dfa46d5",
      },
      {
        id: "26c8e969-0340-4175-8f18-8ba46fcea76e",
      },
      {
        id: "c8635d4f-3f3c-4461-b592-65901faf5d23",
      },
      {
        id: "44f472f1-c0fd-4e4e-a089-90f8016ee20c",
      },
      {
        id: "0d444eb8-ca3e-4bd3-96a2-50df090adce4",
      },
      {
        id: "8e52357c-cb27-49dd-afce-1a84d4c9abd8",
      },
      {
        id: "c04aadb7-54d1-426d-91c3-3169868d9523",
      },
      {
        id: "4e613ce7-6638-4196-ac35-ec1c4d42638a",
      },
      {
        id: "a5c2d647-b2a7-49b1-8caf-36f87a971520",
      },
      {
        id: "a4d6cad9-5a91-4313-ae49-c1bf6170b307",
      },
      {
        id: "632d11d3-f25b-47f6-84b5-fba828d6fb7e",
      },
      {
        id: "3808cb12-5dc2-4f06-992b-d7ca33e76b14",
      },
      {
        id: "6d3b52e5-1ace-4b6e-8bb0-c6567c9500b4",
      },
      {
        id: "b824669f-f7c7-409b-8c27-3047f0910708",
      },
      {
        id: "72f742e3-aa56-463b-bc2f-ec5ef48cf41b",
      },
      {
        id: "44a29c5f-f9a4-4098-ba32-a39633e19d2c",
      },
      {
        id: "82877aed-d7f9-485d-8765-8d344eaceecc",
      },
      {
        id: "da0935b5-80cd-491c-ba81-57f74a789eb2",
      },
      {
        id: "7f939f5e-4aab-4ac8-8613-068429944b9a",
      },
      {
        id: "9823011b-da67-4305-b2dd-759ae9e21c1c",
      },
      {
        id: "39a832c3-fbcc-43ea-9b96-be130629014e",
      },
      {
        id: "297dce04-0b86-457b-a286-f6886a23759a",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
      {
        id: "6f8d46ab-81a1-4360-987d-fa6e39c00afe",
      },
      {
        id: "16168c99-2544-4af0-b378-a7852c9e1537",
      },
      {
        id: "4ddc1c9b-5826-49a8-b6be-d01a62d0a996",
      },
      {
        id: "e47f206f-ef1b-4876-b356-ae34d44d522d",
      },
      {
        id: "406961b8-8760-4cb5-aa85-d399bd12d112",
      },
      {
        id: "166b6ca6-fc47-487e-8716-a149e229de76",
      },
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "7e3515f3-64f7-4756-a85e-e3a2cff319c2",
      },
      {
        id: "1a29a04b-eeab-4edb-93de-6241a39a72a1",
      },
      {
        id: "11aabaf8-db0c-4675-976e-5f6377f1bd2d",
      },
      {
        id: "51b17d23-ff76-4f82-bd04-c09650b86962",
      },
    ],
    parents: [],
    oldId: "70b776b3-4238-4788-8f58-2fc433608398",
  },
  {
    name: "Everyone",
    permissions: [
      "EMPLOYEE_GET",
    ],
    defaultForNewUsers: true,
    tags: [
      "QMS_DEFAULT",
      "OWNERSHIP_CHANGE",
    ],
    isOfficial: true,
    employees: [
      {
        id: "406961b8-8760-4cb5-aa85-d399bd12d112",
      },
      {
        id: "166b6ca6-fc47-487e-8716-a149e229de76",
      },
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "7e3515f3-64f7-4756-a85e-e3a2cff319c2",
      },
      {
        id: "1a29a04b-eeab-4edb-93de-6241a39a72a1",
      },
      {
        id: "51b17d23-ff76-4f82-bd04-c09650b86962",
      },
      {
        id: "ccf055fd-3f08-41d0-ac05-a4f3b5e6be91",
      },
      {
        id: "28fd7ba8-a6e0-455c-a4a5-a114b67dad81",
      },
      {
        id: "6e23aa79-6df6-4529-9f78-a652224db2fb",
      },
      {
        id: "af422bd2-b87b-4cf9-9c41-04abb827a2f1",
      },
      {
        id: "d3a82a92-0233-458c-82ee-66224d103389",
      },
      {
        id: "013777c8-74ab-4acf-ba18-427bfd5da7f0",
      },
      {
        id: "102e1d1a-df39-4e26-9b89-a788d723f59c",
      },
      {
        id: "c11a17bc-bd48-498a-ba51-7fc0ea02a256",
      },
      {
        id: "62b669b9-fc16-45ba-8b01-c5b2d21e5015",
      },
      {
        id: "45f96be2-2488-4ca8-9889-8fcb68b5ab38",
      },
      {
        id: "6b87ca10-8519-4291-a33f-e1017625a2c9",
      },
      {
        id: "3dd485b2-2762-45c0-820f-33f95e011ca7",
      },
      {
        id: "26a9b3bd-e22d-4fbb-bd14-53f9ac862c56",
      },
      {
        id: "23c014f1-25fa-4957-b61a-27e2ff2ae374",
      },
      {
        id: "f6b709ac-2348-4d8e-ac30-a9a80105448e",
      },
      {
        id: "4a5a021d-e548-4d64-8c0b-2ae9bb6a2212",
      },
      {
        id: "713e2790-2b39-4d61-aa09-151f816c4b36",
      },
      {
        id: "36f2772a-524b-4e71-b69a-4517319648ed",
      },
      {
        id: "822cc779-5c2f-4d57-b627-5229dca9cf95",
      },
      {
        id: "2c9860c4-7f8e-4b81-970a-5b42899d446b",
      },
      {
        id: "2aa35acf-509c-4afe-a00b-119bf725ef2d",
      },
      {
        id: "b154632e-3ac3-4895-a7da-417bc6f98f28",
      },
      {
        id: "3170c488-95ab-43cc-b23d-72c42aad25f7",
      },
      {
        id: "083a6e33-0bc9-48ae-8e64-c3c3e4d05c9c",
      },
      {
        id: "3ac8bc3e-b068-405d-a819-b80df7029d08",
      },
      {
        id: "63a18b13-b810-4a40-8ad2-a020ed403c26",
      },
      {
        id: "262bbed7-e0da-46db-bc09-aff4f2e36bb9",
      },
      {
        id: "aff47949-f88e-433a-bfd3-5493b3536bd9",
      },
      {
        id: "34b1570c-1f79-43de-a105-19e804859aee",
      },
      {
        id: "ac5addfc-18c6-44a8-a02c-49fb7b34167a",
      },
      {
        id: "bc049ba0-8563-4cfe-8bc5-cc8eae8f77c4",
      },
      {
        id: "11aabaf8-db0c-4675-976e-5f6377f1bd2d",
      },
      {
        id: "8283f26b-a00f-48d9-a977-33199fdd729d",
      },
      {
        id: "2124f261-0077-4842-b026-a6b09a9136cc",
      },
      {
        id: "976a5832-524e-462d-b53a-6aa24a5ef563",
      },
      {
        id: "2761edb0-1201-4c28-8def-20016ff400b5",
      },
      {
        id: "3f6fce6a-57d3-49c4-8a14-e337d0228f21",
      },
      {
        id: "b0c7b0ea-5cc6-490d-ae2b-489b6cf9e9d1",
      },
      {
        id: "537a9ec2-f883-4c25-8469-fe27c8a13b4e",
      },
      {
        id: "2152ad90-b2c5-4599-9a76-b239a1f8d909",
      },
      {
        id: "c517c8bc-2f6f-4e35-98df-8eee9b7a58e3",
      },
      {
        id: "a94278d8-f2b8-40dc-85ee-1f5d856c95a1",
      },
      {
        id: "40980232-8446-4e31-be23-2156586e1d32",
      },
      {
        id: "af516b53-ade9-4220-b677-9f8d848a939d",
      },
      {
        id: "13296bd6-4b99-486c-adbc-a859d63aca07",
      },
      {
        id: "0a89fa5f-4c08-422c-8245-9df8fa32905f",
      },
      {
        id: "b96ea913-b454-4a4e-8b5c-68cc7bd7b617",
      },
      {
        id: "8fe51fec-1f80-4af2-a1cc-397f51dde485",
      },
      {
        id: "ce6e6296-539e-4575-b10e-e4b9535813cb",
      },
      {
        id: "7d06d96c-de07-4951-8c23-1586f3c7af53",
      },
      {
        id: "7056c6f9-b01c-4e9f-bf83-5c7d488d75d7",
      },
      {
        id: "6d2f864c-5e3f-4d19-8697-e2ac93853a30",
      },
      {
        id: "6ee87760-33cd-41a3-a71e-a108b4b7cabe",
      },
      {
        id: "59c174be-3716-4132-a819-cb981e866f40",
      },
      {
        id: "650abb93-e541-4c35-aaea-ef6c42b6ede1",
      },
      {
        id: "fe07d037-e0bb-4c10-9e3e-12311928daee",
      },
      {
        id: "f117674a-0f84-4c50-acd5-d0d7e3cc58e2",
      },
      {
        id: "cf9b1305-5313-4e5c-ac61-72352f31c338",
      },
      {
        id: "614d0e9e-d063-49ba-83a5-f070132539a1",
      },
      {
        id: "08559b66-ae6c-415e-8779-a7aaa0f439cb",
      },
      {
        id: "30fd56e9-1b04-4c77-bc33-e67c74e3f64b",
      },
      {
        id: "2dd528ae-1ef1-4e5d-bef9-1dc4117d03ef",
      },
      {
        id: "470f7456-180c-427c-af08-044b45173eb0",
      },
      {
        id: "c04aadb7-54d1-426d-91c3-3169868d9523",
      },
      {
        id: "004b5980-e678-4d79-abdd-04db85d66451",
      },
      {
        id: "35c095ce-62e9-42dd-9e0e-d9449dfa46d5",
      },
      {
        id: "26c8e969-0340-4175-8f18-8ba46fcea76e",
      },
      {
        id: "c8635d4f-3f3c-4461-b592-65901faf5d23",
      },
      {
        id: "44f472f1-c0fd-4e4e-a089-90f8016ee20c",
      },
      {
        id: "0d444eb8-ca3e-4bd3-96a2-50df090adce4",
      },
      {
        id: "8e52357c-cb27-49dd-afce-1a84d4c9abd8",
      },
      {
        id: "4e613ce7-6638-4196-ac35-ec1c4d42638a",
      },
      {
        id: "a5c2d647-b2a7-49b1-8caf-36f87a971520",
      },
      {
        id: "a4d6cad9-5a91-4313-ae49-c1bf6170b307",
      },
      {
        id: "3c5bfd9f-f674-4dd4-862c-69be2c1554b6",
      },
      {
        id: "632d11d3-f25b-47f6-84b5-fba828d6fb7e",
      },
      {
        id: "3808cb12-5dc2-4f06-992b-d7ca33e76b14",
      },
      {
        id: "6d3b52e5-1ace-4b6e-8bb0-c6567c9500b4",
      },
      {
        id: "b824669f-f7c7-409b-8c27-3047f0910708",
      },
      {
        id: "72f742e3-aa56-463b-bc2f-ec5ef48cf41b",
      },
      {
        id: "44a29c5f-f9a4-4098-ba32-a39633e19d2c",
      },
      {
        id: "82877aed-d7f9-485d-8765-8d344eaceecc",
      },
      {
        id: "b3a9ba60-5010-4d59-96a6-c1ed6c91d15b",
      },
      {
        id: "da0935b5-80cd-491c-ba81-57f74a789eb2",
      },
      {
        id: "7f939f5e-4aab-4ac8-8613-068429944b9a",
      },
      {
        id: "9823011b-da67-4305-b2dd-759ae9e21c1c",
      },
      {
        id: "39a832c3-fbcc-43ea-9b96-be130629014e",
      },
      {
        id: "297dce04-0b86-457b-a286-f6886a23759a",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
      {
        id: "6f8d46ab-81a1-4360-987d-fa6e39c00afe",
      },
      {
        id: "16168c99-2544-4af0-b378-a7852c9e1537",
      },
      {
        id: "4ddc1c9b-5826-49a8-b6be-d01a62d0a996",
      },
      {
        id: "e47f206f-ef1b-4876-b356-ae34d44d522d",
      },
    ],
    parents: [],
    oldId: "90397ada-2a4e-4e1b-b327-12ea5fc78f94",
  },
  {
    name: "Management Group",
    permissions: [
      "USERS_CREATE",
      "USERS_UPDATE",
      "EMPLOYEE_GET",
      "EMPLOYEE_CREATE",
      "EMPLOYEE_UPDATE",
      "EMPLOYEE_DELETE",
      "GROUP_UPDATE",
    ],
    defaultForNewUsers: false,
    tags: [
      "USER_MANAGEMENT",
    ],
    isOfficial: true,
    employees: [
      {
        id: "2124f261-0077-4842-b026-a6b09a9136cc",
      },
      {
        id: "976a5832-524e-462d-b53a-6aa24a5ef563",
      },
      {
        id: "59c174be-3716-4132-a819-cb981e866f40",
      },
      {
        id: "650abb93-e541-4c35-aaea-ef6c42b6ede1",
      },
      {
        id: "08559b66-ae6c-415e-8779-a7aaa0f439cb",
      },
      {
        id: "c04aadb7-54d1-426d-91c3-3169868d9523",
      },
      {
        id: "26a9b3bd-e22d-4fbb-bd14-53f9ac862c56",
      },
      {
        id: "632d11d3-f25b-47f6-84b5-fba828d6fb7e",
      },
      {
        id: "3808cb12-5dc2-4f06-992b-d7ca33e76b14",
      },
      {
        id: "3dd485b2-2762-45c0-820f-33f95e011ca7",
      },
      {
        id: "72f742e3-aa56-463b-bc2f-ec5ef48cf41b",
      },
      {
        id: "ac5addfc-18c6-44a8-a02c-49fb7b34167a",
      },
      {
        id: "28fd7ba8-a6e0-455c-a4a5-a114b67dad81",
      },
      {
        id: "82877aed-d7f9-485d-8765-8d344eaceecc",
      },
      {
        id: "3ac8bc3e-b068-405d-a819-b80df7029d08",
      },
      {
        id: "36f2772a-524b-4e71-b69a-4517319648ed",
      },
      {
        id: "822cc779-5c2f-4d57-b627-5229dca9cf95",
      },
      {
        id: "297dce04-0b86-457b-a286-f6886a23759a",
      },
      {
        id: "51b17d23-ff76-4f82-bd04-c09650b86962",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "62b669b9-fc16-45ba-8b01-c5b2d21e5015",
      },
    ],
    parents: [],
    oldId: "5e1bd98c-737a-44e6-8d39-fee918fbdb1f",
  },
  {
    name: "QA",
    permissions: [],
    defaultForNewUsers: false,
    tags: [],
    isOfficial: true,
    employees: [
      {
        id: "26a9b3bd-e22d-4fbb-bd14-53f9ac862c56",
      },
      {
        id: "36f2772a-524b-4e71-b69a-4517319648ed",
      },
      {
        id: "af422bd2-b87b-4cf9-9c41-04abb827a2f1",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "632d11d3-f25b-47f6-84b5-fba828d6fb7e",
      },
    ],
    parents: [
      {
        id: "70b776b3-4238-4788-8f58-2fc433608398",
      },
      {
        id: "af6a067b-0476-46b2-a047-7a4d3116bcd6",
      },
      {
        id: "f44929da-5b89-40df-8050-919e45b91e35",
      },
      {
        id: "61f16b13-9e45-498e-8396-30bcbd1b4c98",
      },
    ],
    oldId: "7e931dad-fe49-4760-a017-6aa6b09caa30",
  },
  {
    name: "Jr. Engineer",
    permissions: [],
    defaultForNewUsers: false,
    tags: [],
    isOfficial: true,
    employees: [
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "3dd485b2-2762-45c0-820f-33f95e011ca7",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
    ],
    parents: [
      {
        id: "6687df22-d607-4380-a10d-43013f0f56f4",
      },
    ],
    oldId: "d77b43a6-f4a0-4aa5-a3cb-f38c63d1a5a7",
  },
  {
    name: "Engineering",
    permissions: [
      "EMPLOYEE_GET",
    ],
    defaultForNewUsers: false,
    tags: [],
    isOfficial: true,
    employees: [
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "26a9b3bd-e22d-4fbb-bd14-53f9ac862c56",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
    ],
    parents: [
      {
        id: "5898f77c-a559-42cd-b212-34d82c375e78",
      },
      {
        id: "76000099-c569-4354-ad53-700a01a8ec40",
      },
    ],
    oldId: "6687df22-d607-4380-a10d-43013f0f56f4",
  },
  {
    name: "Sr. Engineer",
    permissions: [],
    defaultForNewUsers: false,
    tags: [],
    isOfficial: true,
    employees: [
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "0d444eb8-ca3e-4bd3-96a2-50df090adce4",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
    ],
    parents: [
      {
        id: "6687df22-d607-4380-a10d-43013f0f56f4",
      },
    ],
    oldId: "7e19e2a3-8242-49f3-8ca3-ff6911731c81",
  },
  {
    name: "Jr. QA",
    permissions: [],
    defaultForNewUsers: false,
    tags: [],
    isOfficial: true,
    employees: [
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "c04aadb7-54d1-426d-91c3-3169868d9523",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
    ],
    parents: [
      {
        id: "7e931dad-fe49-4760-a017-6aa6b09caa30",
      },
    ],
    oldId: "de2a3b5f-3a49-41f8-800a-794ed5227519",
  },
  {
    name: "Sr. QA",
    permissions: [],
    defaultForNewUsers: false,
    tags: [],
    isOfficial: true,
    employees: [
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "23c014f1-25fa-4957-b61a-27e2ff2ae374",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
    ],
    parents: [
      {
        id: "7e931dad-fe49-4760-a017-6aa6b09caa30",
      },
    ],
    oldId: "24da08c3-e78f-4020-b4ee-0fdb7f028163",
  },
  {
    name: "CEO",
    permissions: [],
    defaultForNewUsers: false,
    tags: [],
    isOfficial: true,
    employees: [
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "632d11d3-f25b-47f6-84b5-fba828d6fb7e",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
    ],
    parents: [
      {
        id: "90397ada-2a4e-4e1b-b327-12ea5fc78f94",
      },
      {
        id: "630a1e76-dd5e-41b5-a7e1-d4b4b50768f7",
      },
    ],
    oldId: "147a01e7-9cdf-4943-83b5-db82a7835505",
  },
  {
    name: "Director",
    permissions: [],
    defaultForNewUsers: false,
    tags: [],
    isOfficial: true,
    employees: [
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "3808cb12-5dc2-4f06-992b-d7ca33e76b14",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
    ],
    parents: [
      {
        id: "90397ada-2a4e-4e1b-b327-12ea5fc78f94",
      },
      {
        id: "630a1e76-dd5e-41b5-a7e1-d4b4b50768f7",
      },
    ],
    oldId: "87b5daff-d292-4534-81f2-f72213adae76",
  },
  {
    name: "Leadership",
    permissions: [],
    defaultForNewUsers: false,
    tags: [],
    isOfficial: true,
    employees: [
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
    ],
    parents: [
      {
        id: "90397ada-2a4e-4e1b-b327-12ea5fc78f94",
      },
    ],
    oldId: "630a1e76-dd5e-41b5-a7e1-d4b4b50768f7",
  },
  {
    name: "Manager",
    permissions: [],
    defaultForNewUsers: false,
    tags: [],
    isOfficial: true,
    employees: [
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "36f2772a-524b-4e71-b69a-4517319648ed",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
    ],
    parents: [
      {
        id: "90397ada-2a4e-4e1b-b327-12ea5fc78f94",
      },
    ],
    oldId: "8277787d-c2f6-4003-91a6-77607fd86300",
  },
  {
    name: "R&D",
    permissions: [],
    defaultForNewUsers: false,
    tags: [],
    isOfficial: true,
    employees: [
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "36f2772a-524b-4e71-b69a-4517319648ed",
      },
      {
        id: "af422bd2-b87b-4cf9-9c41-04abb827a2f1",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
      {
        id: "44a29c5f-f9a4-4098-ba32-a39633e19d2c",
      },
    ],
    parents: [
      {
        id: "90397ada-2a4e-4e1b-b327-12ea5fc78f94",
      },
    ],
    oldId: "5898f77c-a559-42cd-b212-34d82c375e78",
  },
  {
    name: "Groups Management",
    permissions: [
      "GROUP_CREATE",
      "GROUP_CREATE_UNOFFICIAL",
      "GROUP_UPDATE",
      "GROUP_UPDATE_UNOFFICIAL",
      "GROUP_DELETE",
    ],
    defaultForNewUsers: false,
    tags: [
      "GROUP_MANAGEMENT",
    ],
    isOfficial: true,
    employees: [
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "51b17d23-ff76-4f82-bd04-c09650b86962",
      },
      {
        id: "7e3515f3-64f7-4756-a85e-e3a2cff319c2",
      },
      {
        id: "2124f261-0077-4842-b026-a6b09a9136cc",
      },
      {
        id: "976a5832-524e-462d-b53a-6aa24a5ef563",
      },
      {
        id: "650abb93-e541-4c35-aaea-ef6c42b6ede1",
      },
      {
        id: "08559b66-ae6c-415e-8779-a7aaa0f439cb",
      },
      {
        id: "c04aadb7-54d1-426d-91c3-3169868d9523",
      },
      {
        id: "26a9b3bd-e22d-4fbb-bd14-53f9ac862c56",
      },
      {
        id: "632d11d3-f25b-47f6-84b5-fba828d6fb7e",
      },
      {
        id: "3808cb12-5dc2-4f06-992b-d7ca33e76b14",
      },
      {
        id: "3dd485b2-2762-45c0-820f-33f95e011ca7",
      },
      {
        id: "b824669f-f7c7-409b-8c27-3047f0910708",
      },
      {
        id: "ac5addfc-18c6-44a8-a02c-49fb7b34167a",
      },
      {
        id: "28fd7ba8-a6e0-455c-a4a5-a114b67dad81",
      },
      {
        id: "3ac8bc3e-b068-405d-a819-b80df7029d08",
      },
      {
        id: "36f2772a-524b-4e71-b69a-4517319648ed",
      },
      {
        id: "822cc779-5c2f-4d57-b627-5229dca9cf95",
      },
      {
        id: "297dce04-0b86-457b-a286-f6886a23759a",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
    ],
    parents: [],
    oldId: "5220e39d-46dd-4627-8228-cad89040d33d",
  },
  {
    name: "QA Test",
    permissions: [],
    defaultForNewUsers: false,
    tags: [],
    isOfficial: false,
    employees: [
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "2aa35acf-509c-4afe-a00b-119bf725ef2d",
      },
      {
        id: "72f742e3-aa56-463b-bc2f-ec5ef48cf41b",
      },
      {
        id: "36f2772a-524b-4e71-b69a-4517319648ed",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
    ],
    parents: [],
    oldId: "4e4f2210-f613-4104-b320-27652347d488",
  },
  {
    name: "Company Admin",
    permissions: [
      "COMPANY_UPDATE_CURRENT",
      "GROUP_CREATE",
      "GROUP_UPDATE",
      "GROUP_DELETE",
      "EMPLOYEE_GET",
      "EMPLOYEE_CREATE",
      "EMPLOYEE_UPDATE",
      "EMPLOYEE_DELETE",
      "CR_ON_APPROVER_LIST",
      "CR_OWNER_AS_APPROVER",
      "DOC_REV_OBS_TO_RELEASED",
    ],
    defaultForNewUsers: false,
    tags: [
      "FB_COMPONENT_PURCHASE_ORDER",
      "FB_COMPONENT_RECEIVE_PURCHASE_ORDER",
      "FB_COMPONENT_INLINE_APPROVAL",
      "FB_COMPONENT_REQUEST_APPROVAL",
      "NAVIGATION_WITH_RESTRICTED_DOC_TYPES",
      "CREATE_DOCS_OF_RESTRICTED_DOC_TYPES",
    ],
    isOfficial: true,
    employees: [
      {
        id: "28fd7ba8-a6e0-455c-a4a5-a114b67dad81",
      },
      {
        id: "82877aed-d7f9-485d-8765-8d344eaceecc",
      },
      {
        id: "26a9b3bd-e22d-4fbb-bd14-53f9ac862c56",
      },
      {
        id: "0d444eb8-ca3e-4bd3-96a2-50df090adce4",
      },
      {
        id: "3808cb12-5dc2-4f06-992b-d7ca33e76b14",
      },
      {
        id: "3ac8bc3e-b068-405d-a819-b80df7029d08",
      },
      {
        id: "36f2772a-524b-4e71-b69a-4517319648ed",
      },
      {
        id: "822cc779-5c2f-4d57-b627-5229dca9cf95",
      },
      {
        id: "297dce04-0b86-457b-a286-f6886a23759a",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "7e3515f3-64f7-4756-a85e-e3a2cff319c2",
      },
      {
        id: "b3a9ba60-5010-4d59-96a6-c1ed6c91d15b",
      },
      {
        id: "62b669b9-fc16-45ba-8b01-c5b2d21e5015",
      },
      {
        id: "2124f261-0077-4842-b026-a6b09a9136cc",
      },
      {
        id: "976a5832-524e-462d-b53a-6aa24a5ef563",
      },
      {
        id: "59c174be-3716-4132-a819-cb981e866f40",
      },
      {
        id: "650abb93-e541-4c35-aaea-ef6c42b6ede1",
      },
      {
        id: "c04aadb7-54d1-426d-91c3-3169868d9523",
      },
      {
        id: "632d11d3-f25b-47f6-84b5-fba828d6fb7e",
      },
      {
        id: "b824669f-f7c7-409b-8c27-3047f0910708",
      },
      {
        id: "ac5addfc-18c6-44a8-a02c-49fb7b34167a",
      },
    ],
    parents: [],
    oldId: "f44929da-5b89-40df-8050-919e45b91e35",
  },
  {
    name: "Developers",
    permissions: [
      "FORM_BUILDER_CUSTOM_VALIDATORS_ENABLED",
      "REMOTE_VALIDATORS_REFRESH",
      "HTML_UPDATE",
      "DEVELOPERS",
    ],
    defaultForNewUsers: false,
    tags: [
      "FB_COMPONENT_PURCHASE_ORDER",
      "FB_COMPONENT_RECEIVE_PURCHASE_ORDER",
      "FB_COMPONENT_INLINE_APPROVAL",
      "FB_COMPONENT_REQUEST_APPROVAL",
      "NAVIGATION_WITH_RESTRICTED_DOC_TYPES",
      "CREATE_DOCS_OF_RESTRICTED_DOC_TYPES",
    ],
    isOfficial: true,
    employees: [
      {
        id: "632d11d3-f25b-47f6-84b5-fba828d6fb7e",
      },
      {
        id: "976a5832-524e-462d-b53a-6aa24a5ef563",
      },
      {
        id: "ac5addfc-18c6-44a8-a02c-49fb7b34167a",
      },
      {
        id: "28fd7ba8-a6e0-455c-a4a5-a114b67dad81",
      },
      {
        id: "82877aed-d7f9-485d-8765-8d344eaceecc",
      },
      {
        id: "da0935b5-80cd-491c-ba81-57f74a789eb2",
      },
      {
        id: "3808cb12-5dc2-4f06-992b-d7ca33e76b14",
      },
      {
        id: "3ac8bc3e-b068-405d-a819-b80df7029d08",
      },
      {
        id: "822cc779-5c2f-4d57-b627-5229dca9cf95",
      },
      {
        id: "297dce04-0b86-457b-a286-f6886a23759a",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "c04aadb7-54d1-426d-91c3-3169868d9523",
      },
    ],
    parents: [],
    oldId: "8eab9d40-b40f-4e3d-9a79-e97ee8be0558",
  },
  {
    name: "test",
    permissions: [],
    defaultForNewUsers: false,
    tags: [],
    isOfficial: false,
    employees: [
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "8e52357c-cb27-49dd-afce-1a84d4c9abd8",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
    ],
    parents: [],
    oldId: "44470467-fa0d-480b-ab95-6058ad7a6c78",
  },
  {
    name: "Group Test Unofficial test",
    permissions: [],
    defaultForNewUsers: false,
    tags: [],
    isOfficial: false,
    employees: [
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "c8635d4f-3f3c-4461-b592-65901faf5d23",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
    ],
    parents: [],
    oldId: "e95768e8-22e8-47d6-ba37-fd838edd978b",
  },
  {
    name: "Groups Management Unofficial",
    permissions: [
      "GROUP_CREATE_UNOFFICIAL",
      "GROUP_UPDATE_UNOFFICIAL",
    ],
    defaultForNewUsers: false,
    tags: [
      "GROUP_MANAGEMENT",
    ],
    isOfficial: true,
    employees: [
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "7e3515f3-64f7-4756-a85e-e3a2cff319c2",
      },
      {
        id: "632d11d3-f25b-47f6-84b5-fba828d6fb7e",
      },
      {
        id: "3dd485b2-2762-45c0-820f-33f95e011ca7",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
    ],
    parents: [],
    oldId: "d14b4c2f-bd7a-4f73-97df-e528d779fc21",
  },
  {
    name: "Test Bojan Official test",
    permissions: [],
    defaultForNewUsers: false,
    tags: [],
    isOfficial: false,
    employees: [
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "c8635d4f-3f3c-4461-b592-65901faf5d23",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
    ],
    parents: [],
    oldId: "aa49dd1c-972f-4380-a75f-864a6f91c7d5",
  },
  {
    name: "testflow",
    permissions: [],
    defaultForNewUsers: false,
    tags: [],
    isOfficial: false,
    employees: [
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "c04aadb7-54d1-426d-91c3-3169868d9523",
      },
      {
        id: "26a9b3bd-e22d-4fbb-bd14-53f9ac862c56",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
    ],
    parents: [],
    oldId: "efeee197-4ce9-4617-b58c-c9b5cbace888",
  },
  {
    name: "Ops Test",
    permissions: [],
    defaultForNewUsers: false,
    tags: [],
    isOfficial: false,
    employees: [
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "2c9860c4-7f8e-4b81-970a-5b42899d446b",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
    ],
    parents: [],
    oldId: "e45d92ec-031a-44e3-b18b-a5ae9d8db751",
  },
  {
    name: "Slack Group",
    permissions: [
      "SLACK_APP_INSTALL",
    ],
    defaultForNewUsers: false,
    tags: [],
    isOfficial: true,
    employees: [
      {
        id: "a5410da3-659d-4f5d-a8be-2c236122c23f",
      },
      {
        id: "6ee87760-33cd-41a3-a71e-a108b4b7cabe",
      },
      {
        id: "59c174be-3716-4132-a819-cb981e866f40",
      },
      {
        id: "650abb93-e541-4c35-aaea-ef6c42b6ede1",
      },
      {
        id: "c04aadb7-54d1-426d-91c3-3169868d9523",
      },
      {
        id: "632d11d3-f25b-47f6-84b5-fba828d6fb7e",
      },
      {
        id: "3808cb12-5dc2-4f06-992b-d7ca33e76b14",
      },
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
    ],
    parents: [],
    oldId: "0ec51b9b-94d3-458d-baaf-058dd04241c1",
  },
  {
    name: "--",
    permissions: [],
    defaultForNewUsers: false,
    tags: [],
    isOfficial: false,
    employees: [
      {
        id: "90745c74-ced8-4771-b9b1-d99f70b02793",
      },
    ],
    parents: [],
    oldId: "e2b1e090-4851-4d89-8fc9-4181499642e6",
  },
];
