import axios from 'axios';
import { jwtUtils } from '../utils/jwtUtils';

const API_BASE_URL = 'http://localhost:8080/api';

export const likeService = {
  /**
   * Toggle like on a post
   */
  toggleLike: async (postId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/likes/toggle/${postId}`,
        {},
        { headers: jwtUtils.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to toggle like';
    }
  },

  /**
   * Check if user has liked a post
   */
  hasLiked: async (postId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/likes/check/${postId}`,
        { headers: jwtUtils.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to check like status';
    }
  },

  /**
   * Get likes for a post
   */
  getPostLikes: async (postId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/likes/post/${postId}`,
        { headers: jwtUtils.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to get likes';
    }
  }
};