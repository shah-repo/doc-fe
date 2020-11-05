/* eslint-disable max-len */
/* eslint-disable object-shorthand */
import { RevisionChangeType } from "../../src/state/ducks/documentRevisions";
import { cmpAddNewEmployeeIds, cmpChangeGroupEmployeeIds, cmpChangeGroupIds, cmpChangeParentGroupIds, cmpFilterDocumentTypeIdByName } from "../support/commands/company/commands";
import { CONFIG } from "../support/config";

let loginResponse;
let multipleCompanies;
let createdCompany;
let adminEmployee;
let superAdminResponse;
let purchaseOrderDocumentType;
let formDocumentType;
let approvalRequestDocumentType;
let initialArDocument;
let createdPOFormDocument;
let engineeringBuildDocumentType;
let everyoneGroup;

interface USER {
  email: string;
  name: string;
  oldId: string;
  active: boolean;
  newId?: string;
  confirmed: boolean;
  avatar: string | null;
}

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

// company bootstrap
const acctCodes = [
  "92345",
  "94565",
  "92703",
  "91402"];

const addresses = [
  "3 Tarkiln Hill Street Hesperia, CA 92345",
  "609 Wild Rose Street Pittsburg, CA 94565",
  "88 E. Marconi Court Santa Ana, CA 92703",
  "17 South Saxton Street Panorama City, CA 91402"];

const adminUser: USER = {
  oldId: "26a9b3bd-e22d-4fbb-bd14-53f9ac862c56",
  name: "Zoran Kovacevic",
  email: "zoran.kovacevic+test@codecons.com",
  active: true,
  confirmed: true,
  avatar: null,
};

const importedUser: USER = {
  oldId: "da0935b5-80cd-491c-ba81-57f74a789eb2",
  name: "Imported User Test",
  email: "en.lil+tomislav.kusevic+ca7@gmail.com",
  active: true,
  confirmed: true,
  avatar: null,
};

const employees: USER[] = [
  {
    oldId: "51b17d23-ff76-4f82-bd04-c09650b86962",
    name: "Luka Stosic - Admin",
    email: "luka.stosic+test@codecons.com",
    active: true,
    confirmed: true,
    avatar: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/f52c73a3-940d-45d4-b1c7-d30b48950dc5/2020-04-08T06%3A30%3A11.784Z/Untitled%20Diagram.png",
  },
  {
    oldId: "ccf055fd-3f08-41d0-ac05-a4f3b5e6be91",
    name: "Luka Stosic - Importer",
    email: "luka.stosic+testi@codecons.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "28fd7ba8-a6e0-455c-a4a5-a114b67dad81",
    name: "Abbie Valencia",
    email: "abigail.valencia08+test@gmail.com",
    active: true,
    confirmed: true,
    avatar: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/10595fd0-6b55-4e0c-9a6e-ce112cb9b68c/2020-08-19T06%3A33%3A43.548Z/b7e19b6e8646c8e2994ac0e6a93c19570bc6b859r1-223-226v2_uhq.jpg",
  },
  {
    oldId: "6e23aa79-6df6-4529-9f78-a652224db2fb",
    name: "Abbie test2",
    email: "abigail.valencia08+test2@gmail.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "af422bd2-b87b-4cf9-9c41-04abb827a2f1",
    name: "Zahra Salahieh",
    email: "zahrasalahieh+test@gmail.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "d3a82a92-0233-458c-82ee-66224d103389",
    name: "Zahra test2",
    email: "zahrasalahieh+test2@gmail.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "013777c8-74ab-4acf-ba18-427bfd5da7f0",
    name: "Faye Faye",
    email: "fayemasbate9+test@gmail.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "102e1d1a-df39-4e26-9b89-a788d723f59c",
    name: "Faye test2",
    email: "fayemasbate9+test2@gmail.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "c11a17bc-bd48-498a-ba51-7fc0ea02a256",
    name: "Enlil Tester",
    email: "enliltester+test@gmail.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "6b87ca10-8519-4291-a33f-e1017625a2c9",
    name: "Tomislav Kusevic",
    email: "tomislav.kusevic+test@codecons.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "3dd485b2-2762-45c0-820f-33f95e011ca7",
    name: "Ivan the Test User",
    email: "ivan.veselin+test@codecons.com",
    active: true,
    confirmed: true,
    avatar: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/d0611cef-ba7a-4080-9ccd-70a324357d50/2020-01-30T12%3A34%3A27.860Z_avatar_mock.jpg",
  },
  {
    oldId: "23c014f1-25fa-4957-b61a-27e2ff2ae374",
    name: "Ivan Salamon",
    email: "ivan.salamon+test@codecons.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "f6b709ac-2348-4d8e-ac30-a9a80105448e",
    name: "Dario Tislar",
    email: "dario.tislar+test@codecons.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "4a5a021d-e548-4d64-8c0b-2ae9bb6a2212",
    name: "Mirela Validzic",
    email: "mirela.validzic+test@codecons.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "713e2790-2b39-4d61-aa09-151f816c4b36",
    name: "Zoran Babic",
    email: "zoran.babic+test@codecons.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "36f2772a-524b-4e71-b69a-4517319648ed",
    name: "Zahra Shifamed",
    email: "zsalahieh@shifamed.com",
    active: true,
    confirmed: true,
    avatar: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/9ea4f9be-ea42-40ff-b507-77597ff202a8/2020-01-10T20%3A39%3A21.883Z_Blue%20Sky%20image.jpg",
  },
  {
    oldId: "822cc779-5c2f-4d57-b627-5229dca9cf95",
    name: "Maureen Gamarra",
    email: "mgamarra@shifamed.com",
    active: true,
    confirmed: true,
    avatar: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/d0bcade1-932f-4173-8ecb-e24b436ecf44/2020-03-03T18%3A30%3A07.540Z_Photo%202.JPG",
  },
  {
    oldId: "2c9860c4-7f8e-4b81-970a-5b42899d446b",
    name: "Maureen Test1",
    email: "polhygat3m+test1@gmail.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "2aa35acf-509c-4afe-a00b-119bf725ef2d",
    name: "Maureen test2",
    email: "polhygat3m+test2@gmail.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "b154632e-3ac3-4895-a7da-417bc6f98f28",
    name: "shifamed b1",
    email: "shifamed+b1@prplbx.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "3170c488-95ab-43cc-b23d-72c42aad25f7",
    name: "shifamed b2",
    email: "shifamed+b2@prplbx.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "083a6e33-0bc9-48ae-8e64-c3c3e4d05c9c",
    name: "shifamed b3",
    email: "shifamed+b3@prplbx.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "3ac8bc3e-b068-405d-a819-b80df7029d08",
    name: "Nathaniel Boas",
    email: "nboas@shifamed.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "63a18b13-b810-4a40-8ad2-a020ed403c26",
    name: "Gabriela Test",
    email: "gabriela@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "262bbed7-e0da-46db-bc09-aff4f2e36bb9",
    name: "Vitalii Sobchuk",
    email: "vitalii.sobchuk@gmail.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "aff47949-f88e-433a-bfd3-5493b3536bd9",
    name: "Ryan Smith",
    email: "sufyan+ryan@codecons.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "34b1570c-1f79-43de-a105-19e804859aee",
    name: "William Berger",
    email: "sufyan+william@codecons.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "45f96be2-2488-4ca8-9889-8fcb68b5ab38",
    name: "Ammar test2",
    email: "adarkazanli+test2@gmail.com",
    active: false,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "ac5addfc-18c6-44a8-a02c-49fb7b34167a",
    name: "Clarissa Test",
    email: "clarissamclariza+test@gmail.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "b3a9ba60-5010-4d59-96a6-c1ed6c91d15b",
    name: "Sara Aleksi +Test",
    email: "sara.aleksi+test@codecons.com",
    active: true,
    confirmed: true,
    avatar: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/9ea4f9be-ea42-40ff-b507-77597ff202a8/2020-01-30T10%3A23%3A28.049Z_dino.jpg",
  },
  {
    oldId: "bc049ba0-8563-4cfe-8bc5-cc8eae8f77c4",
    name: "Test Test",
    email: "luka.stosic+users_test10@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "11aabaf8-db0c-4675-976e-5f6377f1bd2d",
    name: "Iva Majic",
    email: "zoran.babic+1@codecons.com",
    active: true,
    confirmed: true,
    avatar: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/d0611cef-ba7a-4080-9ccd-70a324357d50/2020-07-08T12%3A27%3A04.444Z/user-management.svg",
  },
  {
    oldId: "2124f261-0077-4842-b026-a6b09a9136cc",
    name: "barbara",
    email: "barbara@myvirtualpartnr.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "976a5832-524e-462d-b53a-6aa24a5ef563",
    name: "Julia",
    email: "yuliya.makarenko@gmail.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "2761edb0-1201-4c28-8def-20016ff400b5",
    name: "Sara Aleksi",
    email: "sara.aleksi+testuser@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "3f6fce6a-57d3-49c4-8a14-e337d0228f21",
    name: "Sara 1",
    email: "sara.aleksi+testuser1@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "b0c7b0ea-5cc6-490d-ae2b-489b6cf9e9d1",
    name: "Sara 2",
    email: "sara.aleksi+testuser2@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "537a9ec2-f883-4c25-8469-fe27c8a13b4e",
    name: "Sara Aleksi",
    email: "sara.aleksi+testuser3@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "2152ad90-b2c5-4599-9a76-b239a1f8d909",
    name: "Sara Aleksi",
    email: "sara.aleksi+testuser4@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "c517c8bc-2f6f-4e35-98df-8eee9b7a58e3",
    name: "Sara Aleksi",
    email: "sara.aleksi+testuser5@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "a94278d8-f2b8-40dc-85ee-1f5d856c95a1",
    name: "Sara Aleksi",
    email: "sara.aleksi+testuser6@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "40980232-8446-4e31-be23-2156586e1d32",
    name: "Sara 7",
    email: "sara.aleksi+testuser7@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "af516b53-ade9-4220-b677-9f8d848a939d",
    name: "Sara Aleksi",
    email: "sara.aleksi+testuser8@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "13296bd6-4b99-486c-adbc-a859d63aca07",
    name: "Sara Aleksi",
    email: "sara.aleksi+testuser9@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "0a89fa5f-4c08-422c-8245-9df8fa32905f",
    name: "Sara Aleksi",
    email: "sara.aleksi+testuser10@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "b96ea913-b454-4a4e-8b5c-68cc7bd7b617",
    name: "Sara Aleksi",
    email: "sara.aleksi+testuser11@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "8fe51fec-1f80-4af2-a1cc-397f51dde485",
    name: "Sara Aleksi +Test",
    email: "sara.aleksi+testuser12@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "ce6e6296-539e-4575-b10e-e4b9535813cb",
    name: "Sara Aleksi",
    email: "sara.aleksi+test13@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "7d06d96c-de07-4951-8c23-1586f3c7af53",
    name: "Sara Aleksi +Test",
    email: "sara.aleksi+test14@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "7056c6f9-b01c-4e9f-bf83-5c7d488d75d7",
    name: "Sara Aleksi +Test",
    email: "sara.aleksi+test15@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "6d2f864c-5e3f-4d19-8697-e2ac93853a30",
    name: "Sara Aleksi +Test",
    email: "sara.aleksi+test20@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "6ee87760-33cd-41a3-a71e-a108b4b7cabe",
    name: "Sonja Stepanov",
    email: "sonja.stepanov10@gmail.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "650abb93-e541-4c35-aaea-ef6c42b6ede1",
    name: "Sonja Test2",
    email: "www.myworkplace@gmail.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "fe07d037-e0bb-4c10-9e3e-12311928daee",
    name: "Sara",
    email: "sara.aleksi+1@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "59c174be-3716-4132-a819-cb981e866f40",
    name: "Ammar Test0115",
    email: "adarkazanli+test0115@gmail.com",
    active: false,
    confirmed: true,
    avatar: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/9ea4f9be-ea42-40ff-b507-77597ff202a8/2020-01-15T21%3A01%3A42.225Z_Screen%20Shot%202020-01-07%20at%202.03.03%20PM.png",
  },
  {
    oldId: "f117674a-0f84-4c50-acd5-d0d7e3cc58e2",
    name: "FakeName",
    email: "sara.aleksi+novinovi@email.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "cf9b1305-5313-4e5c-ac61-72352f31c338",
    name: "FakeName",
    email: "sara.aleksi+novinovi@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "614d0e9e-d063-49ba-83a5-f070132539a1",
    name: "FakeName",
    email: "sara.aleksi+novinovi2@codecons.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "08559b66-ae6c-415e-8779-a7aaa0f439cb",
    name: "Sara New User",
    email: "sara.aleksi+test_new_user@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "30fd56e9-1b04-4c77-bc33-e67c74e3f64b",
    name: "test",
    email: "enlil.testmail+testing@gmail.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "2dd528ae-1ef1-4e5d-bef9-1dc4117d03ef",
    name: "test",
    email: "enlil.testmail+test123@gmail.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "470f7456-180c-427c-af08-044b45173eb0",
    name: "test",
    email: "enlil.testmail+test1234@gmail.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "004b5980-e678-4d79-abdd-04db85d66451",
    name: "Tom",
    email: "tomislav.kusevic+probaproba23@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "35c095ce-62e9-42dd-9e0e-d9449dfa46d5",
    name: "Name",
    email: "tomislav.kusevic+existingdev5@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "26c8e969-0340-4175-8f18-8ba46fcea76e",
    name: "Tom",
    email: "tomislav.kusevic+probaproba30@codecons.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "c8635d4f-3f3c-4461-b592-65901faf5d23",
    name: "test",
    email: "enlil.testmail+testflow12@gmail.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "44f472f1-c0fd-4e4e-a089-90f8016ee20c",
    name: "Tester1!",
    email: "enlil.testmail+testexistinguser@gmail.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "0d444eb8-ca3e-4bd3-96a2-50df090adce4",
    name: "Zoran Kova",
    email: "zorankova@example.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "8e52357c-cb27-49dd-afce-1a84d4c9abd8",
    name: "Kova",
    email: "kova@example.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "4e613ce7-6638-4196-ac35-ec1c4d42638a",
    name: "Maja Test Account",
    email: "testuser@codecons.com",
    active: true,
    confirmed: false,
    avatar: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/d0611cef-ba7a-4080-9ccd-70a324357d50/2020-01-09T13%3A33%3A04.125Z_avatar_mock.jpg",
  },
  {
    oldId: "a5c2d647-b2a7-49b1-8caf-36f87a971520",
    name: "FakeName2",
    email: "tomislav.kusevic+testtesttest2@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "a4d6cad9-5a91-4313-ae49-c1bf6170b307",
    name: "FakeName3",
    email: "tomislav.kusevic+testtesttest3@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "c04aadb7-54d1-426d-91c3-3169868d9523",
    name: "TestFlowBojan",
    email: "enlil.testmail+testflow@gmail.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "3c5bfd9f-f674-4dd4-862c-69be2c1554b6",
    name: "testname",
    email: "enlil.testmail+testflow123@gmail.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "632d11d3-f25b-47f6-84b5-fba828d6fb7e",
    name: "Ammar Darkazanli - Admin",
    email: "adarkazanli@shifamed.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "62b669b9-fc16-45ba-8b01-c5b2d21e5015",
    name: "Ammar Darkazanli",
    email: "adarkazanli+test@gmail.com",
    active: false,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "8283f26b-a00f-48d9-a977-33199fdd729d",
    name: "Ammar Test3",
    email: "adarkazanli+test3@gmail.com",
    active: false,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "3808cb12-5dc2-4f06-992b-d7ca33e76b14",
    name: "Julia Makarenko",
    email: "julia@codecons.com",
    active: true,
    confirmed: true,
    avatar: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/e2c3799b-a476-486d-b527-388b80006171/2020-07-19T09%3A58%3A50.126Z/0d.jpg",
  },
  {
    oldId: "6d3b52e5-1ace-4b6e-8bb0-c6567c9500b4",
    name: "Maja Main acc",
    email: "maja.ivezic+1@codecons.com",
    active: true,
    confirmed: true,
    avatar: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/d0611cef-ba7a-4080-9ccd-70a324357d50/2020-07-07T08%3A36%3A50.796Z/bird.png",
  },
  {
    oldId: "b824669f-f7c7-409b-8c27-3047f0910708",
    name: "Syed Sufyan Pervez",
    email: "sufyan+shifamed_test@codecons.com",
    active: true,
    confirmed: true,
    avatar: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/300856a1-06d8-486d-a7c2-66d4cb18674f/2020-05-27T14%3A02%3A58.521Z/DisplayPhoto.jpg",
  },
  {
    oldId: "72f742e3-aa56-463b-bc2f-ec5ef48cf41b",
    name: "Zarko S DEV",
    email: "zarko.stepanov10@gmail.com",
    active: false,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "44a29c5f-f9a4-4098-ba32-a39633e19d2c",
    name: "Clarissa Dev",
    email: "clarissamclariza+devtest@gmail.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "82877aed-d7f9-485d-8765-8d344eaceecc",
    name: "Julia QA",
    email: "julia+qa@codecons.com",
    active: false,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "7f939f5e-4aab-4ac8-8613-068429944b9a",
    name: "Ammar Testing with C and G",
    email: "adarkazanli+testcandg@gmail.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "9823011b-da67-4305-b2dd-759ae9e21c1c",
    name: "Clene Dario",
    email: "clenedario+test@gmail.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "39a832c3-fbcc-43ea-9b96-be130629014e",
    name: "Clene New",
    email: "clenedario+new@gmail.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "297dce04-0b86-457b-a286-f6886a23759a",
    name: " Chiratana Pot",
    email: "cpot@shifamed.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "90745c74-ced8-4771-b9b1-d99f70b02793",
    name: "Tomke Lambda",
    email: "tomislav.kusevic+schox@codecons.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "6f8d46ab-81a1-4360-987d-fa6e39c00afe",
    name: "Tomke Lambda11",
    email: "tomislav.kusevic+schox11@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "16168c99-2544-4af0-b378-a7852c9e1537",
    name: "Tomke Lambda12",
    email: "tomislav.kusevic+schox12@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "4ddc1c9b-5826-49a8-b6be-d01a62d0a996",
    name: "Tomke Lambda13",
    email: "tomislav.kusevic+schox13@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "e47f206f-ef1b-4876-b356-ae34d44d522d",
    name: "Tomke Lambda14",
    email: "tomislav.kusevic+schox14@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "1a29a04b-eeab-4edb-93de-6241a39a72a1",
    name: "Tomislav Testing Lambda",
    email: "tomislav.kusevic+sadmorabiti@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "7e3515f3-64f7-4756-a85e-e3a2cff319c2",
    name: "Jennifer Brandt",
    email: "jbrandt@shifamed.com",
    active: true,
    confirmed: true,
    avatar: null,
  },
  {
    oldId: "a5410da3-659d-4f5d-a8be-2c236122c23f",
    name: "Tomislav Kusevic",
    email: "tomislav.kusevic+prod@codecons.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "166b6ca6-fc47-487e-8716-a149e229de76",
    name: "Tomislav Cajbert",
    email: "tcajbert@test.com",
    active: false,
    confirmed: false,
    avatar: null,
  },
  {
    oldId: "406961b8-8760-4cb5-aa85-d399bd12d112",
    name: "Giovanni Reynolds",
    email: "enlil.testmail+cy1@gmail.com",
    active: true,
    confirmed: false,
    avatar: null,
  },
];

const documentTypes = [
  {
    documentTypeName: "Type With Approval Groups",
    documentTypeAcronym: "TWG-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Administrative",
    documentTypeAcronym: "ADM-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Business",
    documentTypeAcronym: "BUS-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Tooling Lot",
    documentTypeAcronym: "TLL-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Standard Opcedure",
    documentTypeAcronym: "SOP",
    group: "FORM",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Record Document",
    documentTypeAcronym: "RD-",
    group: "RECORD",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Clinical Protocol",
    documentTypeAcronym: "CP-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Environmental Health & Safety",
    documentTypeAcronym: "EHS-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Finished Good",
    documentTypeAcronym: "FG-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Clinical Report",
    documentTypeAcronym: "CR-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Design Document",
    documentTypeAcronym: "DD-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Equipment Specifications",
    documentTypeAcronym: "ES-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Labeling",
    documentTypeAcronym: "LBL-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Marketing",
    documentTypeAcronym: "MKT-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Manufacturing Process Instructions",
    documentTypeAcronym: "MPI-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Master Validation Plan",
    documentTypeAcronym: "MVP-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Quality Manual",
    documentTypeAcronym: "QM-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Quality Plan",
    documentTypeAcronym: "QP-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Quality Specifications",
    documentTypeAcronym: "QS-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "General Document",
    documentTypeAcronym: "GD-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Report",
    documentTypeAcronym: "RPT-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Risk Management",
    documentTypeAcronym: "RM-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Supply Item",
    documentTypeAcronym: "SI-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Training Curriculum",
    documentTypeAcronym: "TC-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Tooling",
    documentTypeAcronym: "TL-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Test Method",
    documentTypeAcronym: "TM-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Test Protocol",
    documentTypeAcronym: "TP-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Test Report",
    documentTypeAcronym: "TR-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Work Instructions",
    documentTypeAcronym: "WI-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Equipment Specifications Lot",
    documentTypeAcronym: "ESL-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Component Specifications Lot",
    documentTypeAcronym: "CSL-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Model/Catalog Number",
    documentTypeAcronym: "REF-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Non-product Software",
    documentTypeAcronym: "NSW-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Concept",
    documentTypeAcronym: "CPT-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Non-Conformance Report",
    documentTypeAcronym: "NCR-",
    group: "OTHER",
    privateNumberPool: true,
    startingNumber: 10,
  },
  {
    documentTypeName: "Corrective Action / Preventive Action",
    documentTypeAcronym: "CAPA-",
    group: "OTHER",
    privateNumberPool: true,
    startingNumber: 0,
  },
  {
    documentTypeName: "Equipment",
    documentTypeAcronym: "EQ-",
    group: "OTHER",
    privateNumberPool: true,
    startingNumber: 0,
  },
  {
    documentTypeName: "Impact Assessment",
    documentTypeAcronym: "IA-",
    group: "OTHER",
    privateNumberPool: true,
    startingNumber: 0,
  },
  {
    documentTypeName: "Non-Disclosure Agreement",
    documentTypeAcronym: "NDA-",
    group: "OTHER",
    privateNumberPool: true,
    startingNumber: 0,
  },
  {
    documentTypeName: "Parts",
    documentTypeAcronym: "PRT-",
    group: "PART",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Kova Super Test",
    documentTypeAcronym: "KST-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Supplier Self Survey",
    documentTypeAcronym: "SSR-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Contract",
    documentTypeAcronym: "CT-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Standard Operating Procedure",
    documentTypeAcronym: "SOP-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Sara Test Supplier",
    documentTypeAcronym: "TSL-",
    group: "OTHER",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Component Specifications",
    documentTypeAcronym: "CS-",
    group: "WO_PARTS",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Device Master Record",
    documentTypeAcronym: "DMR-",
    group: "RECORD",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Test Record",
    documentTypeAcronym: "TREC-",
    group: "RECORD",
    privateNumberPool: false,
    startingNumber: 1,
  },
  {
    documentTypeName: "Supplier",
    documentTypeAcronym: "SUPP-",
    group: "SUPPLIER",
    privateNumberPool: true,
    startingNumber: 1,
  },
];

// after company bootstrap
const groups: GROUP[] = [
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

context("Create Test company example", () => {

  context("[API] Prepare company", () => {
    it("[API] Creates company", (done: any) => {
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response) => {
        superAdminResponse = response;

        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: adminUser.email,
            helloSignIntegrationEnabled: true,
            helloSignTestMode: true,
            importerEmail: importedUser.email,
            numOfRevStages: 3,
            numOfDocDigits: 5,
            slackIntegrationEnabled: true,
            users: employees.map((user) => ({ email: user.email, name: user.name })),
            acctCodes: acctCodes,
            addresses: addresses,
            documentTypes: documentTypes,
            whiteLabeling: {
              DEV_THEME: {
                logo: "https://s3.amazonaws.com/tld-documents.llnassets.com/0004000/4056/random_testing_sm.jpg",
              },
            },
          }, sessionId: superAdminResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === adminUser.email);
          employees.push(adminUser, importedUser);
          cmpAddNewEmployeeIds(createdCompany.employees, employees);
          cmpChangeGroupEmployeeIds(employees, groups);
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          engineeringBuildDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Engineering Build");
          done();
        });
      });
    });

    it("[API] Login admin", (done: any) => {
      cy.authApiLogin({
        email: adminUser.email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    context("[API] Update user avatars and confirmed status", () => {
      it("[API] Get users and patch them", () => {
        cy.usrAdminGetUsers({ sessionId: superAdminResponse.sessionId })
          .then((users) => {
            users.forEach((user) => {
              const employee = employees.find((employee) => employee.email === user.email);
              if (employee) {
                cy.usrAdminPatchUser({
                  sessionId: superAdminResponse.sessionId,
                  userId: user.id,
                  payload: {
                    name: employee.name,
                    confirmed: employee?.confirmed,
                    avatar: employee?.avatar,
                  },
                });
              }
            });
          });
      });
    });

    context("[API] Update employees with active or inactive state", () => {
      employees.forEach((employee) => {
        it(`[API] Update ${employee.name}`, () => {
          cy.usrAdminPatchEmployee({
            sessionId: superAdminResponse.sessionId,
            employeeId: employee.newId!,
            companyId: createdCompany.id,
            payload: {
              active: employee.active,
            },
          });
        });
      });
    });

    context("[API] Copy groups", () => {
      context("[API] Remove employees from default groups", () => {
        it("[API] Get default groups and remove their employees", (done: any) => {
          cy.grpGetGroups({ sessionId: loginResponse.sessionId, employeeId: adminEmployee.id })
            .then((groups) => {
              groups.forEach((group) => {
                cy.grpAdminPatchGroup({
                  sessionId: superAdminResponse.sessionId,
                  groupId: group.id,
                  companyId: createdCompany.id,
                  payload: {
                    name: group.name,
                    permissions: group.permissions,
                    defaultForNewUsers: group.defaultForNewUsers,
                    tags: group.tags,
                    isOfficial: group.isOfficial,
                    employees: [],
                    parents: [],
                  },
                });
              });
            }).then(() => done());
        });
      });

      context("[API] Add groups to company", () => {
        const defaultGroups = [
          "Owner as approver",
          "Can be approver",
          "Everyone",
          "Groups Management",
          "Company Admin",
          "Developers",
          "Groups Management Unofficial",
        ];
        groups.forEach((group) => {
          if (!(defaultGroups.includes(group.name))) {
            it(`[API] Add group: '${group.name}'`, () => {
              cy.grpAdminPostGroup({
                payload: {
                  name: group.name,
                  permissions: group.permissions,
                  defaultForNewUsers: group.defaultForNewUsers,
                  isOfficial: true,
                  tags: group.tags,
                  employees: group.employees,
                },
                sessionId: superAdminResponse.sessionId,
                companyId: createdCompany.id,
              });
            });
          }
        });
      });

      context("[API] Update groups", () => {
        it("[API] Get newId for created groups", (done: any) => {
          cy.grpGetGroups({ sessionId: loginResponse.sessionId, employeeId: adminEmployee.id })
            .then((response) => {
              const newGroups = response;
              cmpChangeGroupIds(groups, newGroups);
              cmpChangeParentGroupIds(groups);
            }).then(() => done());
        });

        groups.forEach((group) => {
          it(`[API] Add parent groups to: ${group.name}`, () => {
            cy.grpAdminPatchGroup({
              sessionId: superAdminResponse.sessionId,
              groupId: group.newId!,
              companyId: createdCompany.id,
              payload: {
                name: group.name,
                permissions: group.permissions,
                defaultForNewUsers: group.defaultForNewUsers,
                tags: group.tags,
                isOfficial: group.isOfficial,
                employees: group.employees,
                parents: group.parents,
              },
            });
          });
        });
      });
    });

    context("[API] Add important documents", () => {
      it("[API] Add 'PO pdf test' form document", (done: any) => {
        cy.grpGetGroupByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          groupName: "Everyone",
        }).then((response) => {
          everyoneGroup = response;
          cy.arGetArDocumentByName({
            sessionId: loginResponse.sessionId,
            employeeId: adminEmployee.id,
            name: "AR Form",
          }).then((response) => {
            initialArDocument = response;
            cy.drCreateDocumentRevision({
              payload: {
                attachments: [],
                description: "<p>PO pdf test</p>",
                document: {
                  docId: "FM-00002",
                  documentType: {
                    id: formDocumentType[0].id,
                  },
                  securityList: {
                    operators: [],
                    securityEmployees: [],
                    securityGroups: [
                      {
                        id: everyoneGroup.body[0].id,
                      },
                    ],
                  },
                },
                name: "PO pdf test",
                referenceTo: [],
                retrain: false,
                revisionChangeType: RevisionChangeType.NextRevision,
                revisionStage: 1,
                formTemplate: {
                  outputDocumentTypes: [{
                    id: purchaseOrderDocumentType[0].id,
                  }],
                  schema: [{
                    index: 0,
                    type: "purchaseorder",
                    label: "PO",
                    name: "po-kdpqvhc7",
                    applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                  }],
                },

              },
              employeeId: adminEmployee.id as unknown as string,
              sessionId: loginResponse.sessionId as unknown as string,
            }).then((response) => {
              createdPOFormDocument = response;
              cy.drAPIApproveAndRelease({
                documentId: createdPOFormDocument.id,
                payload: {
                  effectiveDate: (new Date()).toISOString(),
                  documentType: { id: approvalRequestDocumentType[0].id },
                  formDocument: { id: initialArDocument[0].id },
                },
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
              }).then(() => done());
            });
          });
        });
      });

      it("[API] Add 'PO Form with Select Fields' form document", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>testing seelct fields</p>",
            document: {
              docId: "FM-00003",
              documentType: {
                id: formDocumentType[0].id,
              },
              securityList: {
                operators: [],
                securityEmployees: [],
                securityGroups: [
                  {
                    id: everyoneGroup.body[0].id,
                  },
                ],
              },
            },
            name: "PO Form with Select Fields",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formTemplate: {
              outputDocumentTypes: [{
                id: purchaseOrderDocumentType[0].id,
              }],
              schema: [
                {
                  name: "po-status-kcwo0tgx",
                  type: "select",
                  index: 0,
                  label: "PO Status",
                  options: [
                    {
                      text: "Open",
                      value: "Open",
                    },
                    {
                      text: "Closed",
                      value: "Closed",
                    },
                  ],
                  placeholder: "[Select here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  reviseDisabled: true,
                },
                {
                  name: "terms-kcwo00us",
                  type: "select",
                  index: 1,
                  label: "Terms",
                  options: [
                    {
                      text: "30",
                      value: "30",
                    },
                    {
                      text: "60",
                      value: "60",
                    },
                    {
                      text: "90",
                      value: "90",
                    },
                  ],
                  placeholder: "[Select here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "select-field-w-o-placeholder-kcwo1s03",
                  type: "select",
                  index: 2,
                  label: "Select Field w/o placeholder",
                  options: [
                    {
                      text: "AAA",
                      value: "AAA",
                    },
                    {
                      text: "BBB",
                      value: "BBB",
                    },
                    {
                      text: "CCC",
                      value: "CCC",
                    },
                  ],
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "select-field-w-placeholder-kcwo2gmi",
                  type: "select",
                  index: 3,
                  label: "Select Field w/ placeholder",
                  options: [
                    {
                      text: "111",
                      value: "111",
                    },
                    {
                      text: "222",
                      value: "222",
                    },
                    {
                      text: "333",
                      value: "333",
                    },
                  ],
                  placeholder: "Select from options here",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "requestor-kcwo1aii",
                  type: "autocomplete",
                  index: 4,
                  label: "Requestor",
                  optionId: "13",
                  placeholder: "[Select here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "purchase-order-kcwo2n4r",
                  type: "purchaseorder",
                  index: 5,
                  label: "Purchase Order",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "hyperlink-kcwtdm96",
                  type: "hyperlink",
                  index: 6,
                  label: "Hyperlink",
                  linkUrl: "www.google.com",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
              ],
            },
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdPOFormDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: createdPOFormDocument.id,
            payload: {
              effectiveDate: (new Date()).toISOString(),
              documentType: { id: approvalRequestDocumentType[0].id },
              formDocument: { id: initialArDocument[0].id },
            },
            employeeId: adminEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then(() => done());
        });
      });

      it("[API] Create 'Demo test form'", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Demo test form</p>",
            document: {
              docId: "FM-01131",
              documentType: {
                id: formDocumentType[0].id,
              },
              securityList: {
                operators: [],
                securityEmployees: [],
                securityGroups: [
                  {
                    id: everyoneGroup.body[0].id,
                  },
                ],
              },
            },
            name: "Demo test form",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formTemplate: {
              outputDocumentTypes: [{
                id: approvalRequestDocumentType[0].id,
              }],
              schema: [
                {
                  name: "cr-attachment-s-kbv4cb50",
                  type: "fileupload",
                  index: 0,
                  label: "CR Attachment(s):",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "change-request-details",
                  type: "section",
                  index: 1,
                  label: "Change Request Details",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "documentRevisions",
                  type: "documentRevisions",
                  index: 2,
                  rules: {
                    "documentRevisions.*.id": "required",
                    "documentRevisions.*.descriptionOfChange": "required",
                    "documentRevisions.*.descriptionOfJustification": "required",
                    "documentRevisions.*.proposedDocumentRevision.id": "required",
                  },
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "product-impact-assessment-kbv4crom",
                  type: "section",
                  index: 3,
                  label: "Product Impact Assessment:",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "is-there-a-change-to-the-design-kbv4dabe",
                  type: "radiogroup",
                  index: 4,
                  label: "Is there a change to the design?",
                  options: [
                    {
                      text: "Yes",
                      value: "Yes",
                    },
                    {
                      text: "No",
                      value: "No",
                    },
                  ],
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "justification-kbv4edvl",
                  rows: 3,
                  type: "textfield",
                  index: 5,
                  label: "Justification:",
                  placeholder: " (List any impact to prior tests, validations, documents, etc. here)",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "is-there-a-change-to-materials-or-packaging-kbv4fmkz",
                  type: "radiogroup",
                  index: 6,
                  label: "Is there a change to materials or packaging?",
                  options: [
                    {
                      text: "Yes",
                      value: "Yes",
                    },
                    {
                      text: "No",
                      value: "No",
                    },
                  ],
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "justification-kbv4guef",
                  rows: 3,
                  type: "textfield",
                  index: 7,
                  label: "Justification:",
                  placeholder: "[List any impact to prior tests, validations, documents, etc. here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "is-there-a-change-to-the-manufacturing-process-kbv4hsqy",
                  type: "radiogroup",
                  index: 8,
                  label: "Is there a change to the manufacturing process?",
                  options: [
                    {
                      text: "Yes",
                      value: "Yes",
                    },
                    {
                      text: "No",
                      value: "No",
                    },
                  ],
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "justification-kbv4ih7w",
                  rows: 3,
                  type: "textfield",
                  index: 9,
                  label: "Justification:",
                  placeholder: "[List any impact to prior tests, validations, documents, etc. here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "are-risk-documents-affected-kbv4j0l2",
                  type: "radiogroup",
                  index: 10,
                  label: "Are risk documents affected?",
                  options: [
                    {
                      text: "Yes",
                      value: "Yes",
                    },
                    {
                      text: "No",
                      value: "No",
                    },
                  ],
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "justification-kbv4jrvn",
                  rows: 3,
                  type: "textfield",
                  index: 11,
                  label: "Justification:",
                  placeholder: "[List any impact to prior tests, validations, documents, etc. here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "regulatory-assessment-kbv4l92m",
                  type: "section",
                  index: 12,
                  label: "Regulatory Assessment:",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "does-the-change-impact-a-regulatory-submission-kbv4lok6",
                  type: "radiogroup",
                  index: 13,
                  label: "Does the change impact a regulatory submission?",
                  options: [
                    {
                      text: "Yes",
                      value: "Yes",
                    },
                    {
                      text: "No",
                      value: "No",
                    },
                  ],
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "justification-kbv4mjet",
                  rows: 3,
                  type: "textfield",
                  index: 14,
                  label: "Justification:",
                  placeholder: "[List the country or submission ID here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "reason-for-no-action-kbv4p0t1",
                  rows: 3,
                  type: "textfield",
                  index: 15,
                  label: "Reason for no action:",
                  placeholder: "[Enter rationale for no action here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "does-the-change-require-notification-to-a-regulatory-body-kbv4mxju",
                  type: "radiogroup",
                  index: 16,
                  label: "Does the change require notification to a regulatory body?",
                  options: [
                    {
                      text: "Yes",
                      value: "Yes",
                    },
                    {
                      text: "No",
                      value: "No",
                    },
                  ],
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "justification-kbv4ntni",
                  rows: 3,
                  type: "textfield",
                  index: 17,
                  label: "Justification:",
                  placeholder: "[List the agency/country (e.g., Notified Body, EU, FDA, Canada, etc. here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "reason-for-no-action-kbv4pdrf",
                  rows: 3,
                  type: "textfield",
                  index: 18,
                  label: "Reason for no action:",
                  placeholder: "[Enter rationale for no action here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "target-date-approvers",
                  type: "section",
                  index: 19,
                  label: "Target Date & Approvers",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "effectiveDate",
                  type: "datepicker",
                  index: 20,
                  label: "Target Date",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
                {
                  name: "approvers",
                  type: "autocomplete",
                  index: 21,
                  label: "Approvers",
                  multiple: true,
                  optionId: "3",
                  placeholder: "Start typing to see the list...",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  optionValueType: "id",
                },
              ],
            },

          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdPOFormDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: createdPOFormDocument.id,
            payload: {
              effectiveDate: (new Date()).toISOString(),
              documentType: { id: approvalRequestDocumentType[0].id },
              formDocument: { id: initialArDocument[0].id },
            },
            employeeId: adminEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then(() => done());
        });
      });

      it("[API] Add 'Template for EB' form document", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            description: "<p>testing template for EB</p>",
            name: "Template for EB",
            attachments: [],
            referenceTo: [],
            revisionStage: 1,
            revisionChangeType: RevisionChangeType.NextRevision,
            retrain: false,
            document: {
              docId: "FM-01480",
              securityList: {
                securityEmployees: [],
                securityGroups: [
                  {
                    id: everyoneGroup.body[0].id,
                  },
                ],
                operators: [],
              },
              documentType: {
                id: formDocumentType[0].id,
              },
            },
            formTemplate: {
              outputDocumentTypes: [
                {
                  id: engineeringBuildDocumentType[0].id,
                },
              ],
              schema: [
                {
                  label: "form.builder.approvals",
                  type: "approvals",
                  name: "fb-approvals-kh4u69vk",
                  uniqueSchemaItem: true,
                  index: 0,
                },
                {
                  type: "parts",
                  name: "fb-parts-kh4u6wve",
                  uniqueSchemaItem: true,
                  index: 1,
                },
                {
                  type: "section",
                  name: "fb-procedure-section-kh4u6wve",
                  label: "form.builder.procedure",
                  index: 2,
                },
                {
                  index: 3,
                  type: "procedure",
                  name: "-kh4u6wvf",
                  stepIndex: 1,
                  editorProperties: [
                    "copyableValue",
                  ],
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                },
              ],
            },
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdPOFormDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: createdPOFormDocument.id,
            payload: {
              effectiveDate: (new Date()).toISOString(),
              documentType: { id: approvalRequestDocumentType[0].id },
              formDocument: { id: initialArDocument[0].id },
            },
            employeeId: adminEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then(() => done());
        });
      });
    });
  });

  context("Log in user, select company and open 'Create Document'", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: adminUser.email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });
});
