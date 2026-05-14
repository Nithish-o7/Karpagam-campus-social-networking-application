import dotenv from 'dotenv';
dotenv.config();

/**
 * KCE Connect Middleware — Central Configuration
 * All environment variables are accessed through this module.
 */
export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'fallback_dev_secret',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',

  serviceNow: {
    instanceUrl: process.env.SERVICENOW_INSTANCE_URL || '',
    username: process.env.SERVICENOW_USERNAME || '',
    password: process.env.SERVICENOW_PASSWORD || '',
    table: process.env.SERVICENOW_TABLE || 'x_kce_campus_request',
  },
} as const;

export default config;
