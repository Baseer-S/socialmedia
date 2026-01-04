import axios from 'axios';
import { jwtUtils } from '../utils/jwtUtils';

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Like service for like/unlike operations
 */
export const likeService = {
  /**
   * Toggle like on a post
   */
  toggleLike: async (postId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/likes/post/${postId}`,
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
  getLikeStatus: async (postId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/likes/post/${postId}/status`,
        { headers: jwtUtils.getAuthHeader() }
      );
      return response.data.liked;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to get like status';
    }
  },

  /**
   * Get like count for a post
   */
  getLikeCount: async (postId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/likes/post/${postId}/count`,
        { headers: jwtUtils.getAuthHeader() }
      );
      return response.data.count;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to get like count';
    }
  }
};