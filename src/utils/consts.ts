let FIBERY_ACCOUNT = process.env.NEXT_PUBLIC_FIBERY_ACCOUNT;

if (!FIBERY_ACCOUNT) {
  throw new Error("FIBERY_ACCOUNT is not set");
}

let FIBERY_SPACE = process.env.NEXT_PUBLIC_FIBERY_SPACE;

if (!FIBERY_SPACE) {
  throw new Error("FIBERY_SPACE is not set");
}

export const DEFAULT_ACCOUNT_PASSWORD = "WeLoveVeedoo123";

export const USER_ID_LENGTH = 15;

export const FIBERY_GRAPHQL_URL = `https://${FIBERY_ACCOUNT}.fibery.io/api/graphql/space/${FIBERY_SPACE}`;

export const FIBERY_CRM_API_URL = `https://${FIBERY_ACCOUNT}/api/graphql/space/CRM_and_Sales`;
