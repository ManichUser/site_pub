export default () => ({
  env: {
    nodeEnv: process.env.NODE_ENV ?? 'development',
  },
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    name: process.env.DB_NAME ?? 'pub_rewards',
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
  security: {
    allowedOrigins: (process.env.ALLOWED_ORIGINS ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  },
  // Barème et règles métier par défaut (surchargeables en base par l'admin)
  business: {
    videosRequiredDefault: parseInt(
      process.env.VIDEOS_REQUIRED_DEFAULT ?? '20',
      10,
    ),
    gainAmountDefault: parseFloat(process.env.GAIN_AMOUNT_DEFAULT ?? '500'),
    affiliationCommissionRate: parseFloat(
      process.env.AFFILIATION_COMMISSION_RATE ?? '0.6',
    ),
    minWithdrawalAmount: parseFloat(
      process.env.MIN_WITHDRAWAL_AMOUNT ?? '1000',
    ),
    dailyGainCapPerUser: parseFloat(
      process.env.DAILY_GAIN_CAP_PER_USER ?? '5000',
    ),
  },
});
