/* Env vars are strings & dotenv doesnt support boolean out of the box... */

export const isDebugMode = !!parseInt(process.env.REACT_APP_DEBUG_MODE);
