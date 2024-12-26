export type LoginUser = {
  id: number;
  username: string;
  email: string;
};

export type UploadedFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

export type LoginCredentials = {
  username: string;
  password: string;
};
