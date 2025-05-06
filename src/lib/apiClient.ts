import { getAccessToken, refreshTokens, logout } from '@/services/authService/authService';

// Queue to store pending requests during token refresh
let refreshPromise: Promise<any> | null = null;
const requestQueue: (() => void)[] = [];

// Process all queued requests
const processQueue = () => {
  requestQueue.forEach(callback => callback());
  requestQueue.length = 0;
};

// Create an API client with authentication and refresh handling
const apiClient = {
  fetch: async (url: string, options: RequestInit = {}): Promise<Response> => {
    // Add base URL if not an absolute URL
    if (!url.startsWith('http')) {
      url = `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}${url}`;
    }

    // Add authorization header if access token exists
    const accessToken = getAccessToken();
    if (accessToken) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
      };
    }

    // Make the request
    let response = await fetch(url, options);

    // Handle 401 Unauthorized errors (expired access token)
    if (response.status === 401) {
      try {
        // If a refresh is already in progress, wait for it
        if (refreshPromise) {
          await refreshPromise;
        } else {
          // Start a new refresh process
          refreshPromise = refreshTokens()
            .catch(error => {
              // If refresh fails, logout user
              console.error('Token refresh failed:', error);
              logout();
              throw error;
            })
            .finally(() => {
              refreshPromise = null;
            });

          await refreshPromise;
        }

        // Retry the original request with the new token
        const newAccessToken = getAccessToken();
        if (newAccessToken) {
          options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${newAccessToken}`
          };
          response = await fetch(url, options);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        throw error;
      }
    }

    return response;
  },

  // Convenience methods
  get: (url: string, options: RequestInit = {}) => {
    return apiClient.fetch(url, { ...options, method: 'GET' });
  },

  post: (url: string, data: any, options: RequestInit = {}) => {
    return apiClient.fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
  },

  put: (url: string, data: any, options: RequestInit = {}) => {
    return apiClient.fetch(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
  },

  delete: (url: string, options: RequestInit = {}) => {
    return apiClient.fetch(url, { ...options, method: 'DELETE' });
  },
};

export default apiClient;