import * as Joi from 'joi';

/**
 * Schéma de validation des variables d'environnement.
 * L'application refuse de démarrer si une variable requise est absente ou
 * si un secret est trop faible — mieux vaut échouer au démarrage que de
 * tourner silencieusement avec des valeurs par défaut dangereuses.
 */
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().min(8).required(),
  DB_NAME: Joi.string().required(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().min(8).required(),

  JWT_SECRET: Joi.string()
    .min(32)
    .invalid('change-me-in-production')
    .required()
    .messages({
      'any.invalid':
        'JWT_SECRET ne doit pas être la valeur par défaut du template — générez un secret aléatoire.',
      'string.min':
        'JWT_SECRET doit contenir au moins 32 caractères pour être sûr.',
    }),
  JWT_EXPIRES_IN: Joi.string().default('7d'),

  ALLOWED_ORIGINS: Joi.string().required().messages({
    'any.required':
      'ALLOWED_ORIGINS est requis (liste d\'origines autorisées séparées par des virgules) pour configurer CORS de façon restrictive.',
  }),

  VIDEOS_REQUIRED_DEFAULT: Joi.number().default(20),
  GAIN_AMOUNT_DEFAULT: Joi.number().default(500),
  AFFILIATION_COMMISSION_RATE: Joi.number().min(0).max(1).default(0.6),
  MIN_WITHDRAWAL_AMOUNT: Joi.number().default(1000),
  DAILY_GAIN_CAP_PER_USER: Joi.number().default(5000),
});
