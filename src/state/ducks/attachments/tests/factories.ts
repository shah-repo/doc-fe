import faker from "faker";
import { Attachment } from "../types";

export const getAttachment = (attachment: Partial<Attachment> = {}): Attachment => ({
  id: faker.random.uuid(),
  name: faker.system.fileName(),
  s3link: faker.internet.url(),
  type: faker.system.fileType(),
  lineType: "CLEAN_COPY",
  fileSizeS3Link: faker.random.number(),
  fileSizeS3LinkCleanCopy: faker.random.number(),
  hasWatermarks: false,
  ...attachment,
});
