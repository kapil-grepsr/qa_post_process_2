//frontend/qapp_web/core/config/app.ts
export const API_BASE_URL = process.env.POST_PROCESS_API_URL || "http://localhost:8090";

// specific endpoints built from base
export const DTALE_API_URL = `${API_BASE_URL}/dtale`;
export const COMPARE_API_URL = `${API_BASE_URL}/data-compare/compare-csv`;
export const CONCAT_API_URL = `${API_BASE_URL}/concat/`;
export const GET_COLUMNS_API_URL = `${API_BASE_URL}/columns/get-columns`;
export const CHECK_DUPLICATES_API_URL = `${API_BASE_URL}/duplicates/check-duplicates`
