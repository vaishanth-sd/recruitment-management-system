import { TOKEN_KEY } from '../context/authContextDef';

export class ApiClientError extends Error {
  public status: number;
  public data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.data = data;
  }
}

const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }
  // Default to empty string so requests like '/api/jobs' go through Vite's dev proxy
  return '';
};

export const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const baseUrl = getBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const headers = new Headers(options.headers || {});

  // Add default content type for JSON if sending a body and not multipart
  if (options.body !== undefined && !(options.body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  // Attach JWT Bearer token if available
  const token = getStoredToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
    body:
      options.body !== undefined
        ? options.body instanceof FormData
          ? options.body
          : JSON.stringify(options.body)
        : undefined,
  };

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch {
    throw new ApiClientError(
      'Unable to connect to the backend server. Please ensure the API is running on port 8080.',
      0
    );
  }

  // Handle unauthorized/expired token
  if (response.status === 401 && token) {
    // If the token is invalid or expired
    // (Note: login endpoint also returns 401 on bad credentials, so check endpoint)
    if (!endpoint.includes('/login')) {
      try {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('hireflow_user');
      } catch {
        // Ignore
      }
    }
  }

  // Parse JSON response body if present
  let responseData: unknown = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }
  } else {
    try {
      responseData = await response.text();
    } catch {
      responseData = null;
    }
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;

    if (responseData && typeof responseData === 'object') {
      const dataObj = responseData as Record<string, unknown>;
      if (typeof dataObj.error === 'string') {
        errorMessage = dataObj.error;
      } else if (typeof dataObj.message === 'string') {
        errorMessage = dataObj.message;
      }
    } else if (typeof responseData === 'string' && responseData.trim()) {
      errorMessage = responseData;
    }

    throw new ApiClientError(errorMessage, response.status, responseData);
  }

  return responseData as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
