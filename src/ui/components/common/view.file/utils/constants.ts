export const SUPPORTED_VIDEO_FILES = [
  "mp4",
  "webm",
  "ogg",
  "ogv",
  "avi",
];
export const SUPPORTED_IMAGE_FILES = [
  "apng",
  "bmp",
  "gif",
  "ico",
  "cur",
  "jpg",
  "jpeg",
  "jfif",
  "pjpeg",
  "pjp",
  "png",
  "svg",
  "webp",
];

export const PDF = "pdf";
export const IMAGE = "image";
export const VIDEO = "video";

export const VIEWABLE_FILES = [
  ...SUPPORTED_IMAGE_FILES,
  ...SUPPORTED_VIDEO_FILES,
  PDF,
];

export const WATERMARK_FILES = [
  "txt",
  "doc",
  "docx",
  "pdf",
];
