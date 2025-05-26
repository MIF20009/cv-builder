// src/utils/tokenUtils.js

/**
 * Check if a JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired, false if valid
 */
export const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      // Get the payload part of the JWT (second part)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      // Check if token has expiration claim
      if (!payload.exp) return false;
      
      // Compare expiration timestamp with current time
      // exp is in seconds, Date.now() is in milliseconds
      return Date.now() >= payload.exp * 1000;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true; // Assume expired if there's an error parsing
    }
  };
  
  /**
   * Validate token with backend
   * @param {string} token - JWT token
   * @returns {Promise<boolean>} Promise resolving to token validity
   */
  export const validateTokenWithBackend = async (token) => {
    if (!token) return false;
    
    try {
      const response = await fetch('/api/validate-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error validating token with backend:', error);
      return false;
    }
  };
  
  /**
   * Comprehensive token validation
   * First checks locally if token is expired
   * If not expired locally, validates with backend if needed
   * @param {string} token - JWT token
   * @param {boolean} checkWithBackend - Whether to verify with backend
   * @returns {Promise<boolean>} Promise resolving to token validity
   */
  export const isValidToken = async (token, checkWithBackend = false) => {
    if (!token) return false;
    
    // First check if token is expired locally
    if (isTokenExpired(token)) {
      return false;
    }
    
    // If requested, double-check with backend
    if (checkWithBackend) {
      return await validateTokenWithBackend(token);
    }
    
    return true;
  };
  
  /**
   * Log out the user by clearing tokens and triggering events
   */
  export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    
    // Dispatch custom event for components to react
    window.dispatchEvent(new Event('token-changed'));
    
    // Redirect to home page if needed
    // window.location.href = '/';
  };