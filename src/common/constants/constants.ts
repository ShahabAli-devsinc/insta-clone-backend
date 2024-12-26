export const JWT_EXPIRATION_TIME = '60m';

export const DATABASE_DEFAULTS = {
  HOST: 'localhost',
  PORT: 5434,
};

export const APP_CONSTANTS = {
  DEFAULT_PORT: 3001,
  CORS_ORIGIN: 'http://localhost:3000',
  SWAGGER: {
    TITLE: 'Instagram Clone API',
    DESCRIPTION: 'API documentation for the Instagram Clone app',
    VERSION: '1.0',
    TAGS: ['users'],
  },
};

export const JWT_TOKEN_EXPIRATION_TIME = 24 * 60 * 60 * 1000;

export enum CloudinaryConstants {
  CLOUDINARY = 'Cloudinary',
}
