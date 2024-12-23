export type LoginUser = {
  id: number;
  username: string;
  email: string;
};

export type UploadedFileType = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};
