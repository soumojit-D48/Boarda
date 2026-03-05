import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Track whether a refresh is already in progress to avoid multiple simultaneous refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401 responses that aren't already retried
    // and aren't the refresh-token or login/register endpoints themselves
    const isAuthEndpoint =
      originalRequest.url?.includes('/refresh-token') ||
      originalRequest.url?.includes('/login') ||
      originalRequest.url?.includes('/register') ||
      originalRequest.url?.includes('/users/me'); // checkAuth — should fail silently

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Another request is already refreshing — queue this one
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${api.defaults.baseURL}/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        processQueue(null);
        // Retry the original request — cookies are now updated by the browser
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Refresh failed — force logout
        forceLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Force logout: clear persisted auth state and redirect to login.
 * This is called when the refresh token itself is expired/invalid.
 */
function forceLogout() {
  // Clear the zustand persisted state from localStorage
  localStorage.removeItem('auth-storage');
  // Redirect to login page
  window.location.href = '/signin';
}

export const searchUsers = async (query: string) => {
  return await api.get(`/users/search?q=${query}`);
};

export const getTags = async (boardId: string) => {
  return await api.get(`/tags/${boardId}`);
};

export const createTag = async (boardId: string, data: { name: string; color: string }) => {
  return await api.post(`/tags/${boardId}/create`, data);
};

export const reorderTasks = async (
  boardId: string,
  tasks: { _id: string; status: string; order: number }[]
) => {
  return await api.put(`/tasks/board/${boardId}/reorder`, { tasks });
};

export default api;
