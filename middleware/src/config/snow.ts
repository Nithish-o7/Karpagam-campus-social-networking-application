import dotenv from 'dotenv';
dotenv.config();

export const SNOW_TABLE_NAME = 'x_1875513_karpag_0_karpagam_service_request';
export const SNOW_API_PATH   = `/api/now/table/${SNOW_TABLE_NAME}`;

export function getSnowCredentials(): { snowUrl: string; authHeader: string } | null {
  const snowUrl  = process.env.SNOW_INSTANCE_URL;
  const username = process.env.SNOW_USERNAME;
  const password = process.env.SNOW_PASSWORD;

  if (!snowUrl || !username || !password) return null;

  const authHeader = Buffer.from(`${username}:${password}`).toString('base64');
  return { snowUrl, authHeader };
}

export function logSnowError(context: string, error: any) {
  console.error(`❌ [${context}] ServiceNow API Error:`);
  if (error.response) {
    console.error(`   Status: ${error.response.status}`);
    console.error(`   Data  : ${JSON.stringify(error.response.data, null, 2)}`);
  } else {
    console.error(`   Message: ${error.message}`);
  }
}
