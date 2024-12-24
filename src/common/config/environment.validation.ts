import * as Joi from 'joi';
import { DATABASE_DEFAULTS } from 'src/common/constants/constants';

export const ENVIRONMENT_VALIDATION_SCHEMA = Joi.object({
  DATABASE_HOST: Joi.string().default(DATABASE_DEFAULTS.HOST),
  DATABASE_PORT: Joi.number().default(DATABASE_DEFAULTS.PORT),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
});
