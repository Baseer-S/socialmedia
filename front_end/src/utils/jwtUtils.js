import jwtDecode from 'jwt-decode';

/**
 * JWT utility functions for token management
 */

const TOKEN_KEY = 'auth_token';

export const jwtUtils = {
  /**
   * Save token to localStorage
   */
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Get token from localStorage
   */
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Remove token from localStorage
   */
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    const token = jwtUtils.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get decoded token data
   */
  getDecodedToken: () => {
    const token = jwtUtils.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  },

  /**
   * Get authorization header
   */
  getAuthHeader: () => {
    const token = jwtUtils.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};