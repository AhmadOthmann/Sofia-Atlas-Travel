export type TwinDbMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type TwinDbRequest = {
  endpoint: string;
  method?: TwinDbMethod;
  query?: Record<string, string | number | boolean>;
  body?: unknown;
};

type TwinDbConfig = {
  baseUrl: string;
  apiKey: string;
  authHeader: string;
  authScheme: string;
};

const getConfig = (): TwinDbConfig => {
  const baseUrl = process.env.HAPPYROBOT_TWINDB_BASE_URL;
  const apiKey = process.env.HAPPYROBOT_TWINDB_API_KEY;

  if (!baseUrl) {
    throw new Error('Missing HAPPYROBOT_TWINDB_BASE_URL');
  }

  if (!apiKey) {
    throw new Error('Missing HAPPYROBOT_TWINDB_API_KEY');
  }

  return {
    baseUrl,
    apiKey,
    authHeader: process.env.HAPPYROBOT_TWINDB_AUTH_HEADER ?? 'Authorization',
    authScheme: process.env.HAPPYROBOT_TWINDB_AUTH_SCHEME ?? 'Bearer',
  };
};

const toUrl = (baseUrl: string, endpoint: string, query?: TwinDbRequest['query']) => {
  const safeBase = baseUrl.replace(/\/$/, '');
  const safeEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`${safeBase}${safeEndpoint}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
};

export const callTwinDb = async (request: TwinDbRequest) => {
  const { baseUrl, apiKey, authHeader, authScheme } = getConfig();
  const url = toUrl(baseUrl, request.endpoint, request.query);
  const method = request.method ?? 'POST';

  const headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  });

  headers.set(authHeader, authScheme ? `${authScheme} ${apiKey}` : apiKey);

  const response = await fetch(url, {
    method,
    headers,
    body: method === 'GET' ? undefined : JSON.stringify(request.body ?? {}),
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });

  const responseText = await response.text();
  let parsedBody: unknown = null;

  try {
    parsedBody = responseText ? JSON.parse(responseText) : null;
  } catch {
    parsedBody = responseText || null;
  }

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    data: parsedBody,
  };
};
