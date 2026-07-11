export type TwinDbClientRequest = {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: Record<string, string | number | boolean>;
  body?: unknown;
  headers?: Record<string, string>;
};

export const callHappyRobotTwinDb = async <T>(
  payload: TwinDbClientRequest
): Promise<T> => {
  const response = await fetch('/api/happyrobot/twindb', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as T | { error?: string; details?: string };

  if (!response.ok) {
    const errorMessage =
      typeof data === 'object' && data && 'error' in data
        ? `${String(data.error)}${
            'details' in data && data.details ? `: ${String(data.details)}` : ''
          }`
        : 'Request to Happy Robot TWIN DB failed.';

    throw new Error(errorMessage);
  }

  return data as T;
};
