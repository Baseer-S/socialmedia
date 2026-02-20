import axios from 'axios';
import { jwtUtils } from '../utils/jwtUtils';

const API_BASE_URL = 'http://localhost:8080/api';

export const commentService = {
  /**
   * Get comments for a post
   */
  getPostComments: async (postId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/comments/post/${postId}`,
        { headers: jwtUtils.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch comments';
    }
  },

  /**
   * Create a new comment
   */
  createComment: async (postId, content) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/comments`,
        { postId, content },
        { headers: jwtUtils.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create comment';
    }
  },

  /**
   * Delete a comment
   */
  deleteComment: async (commentId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/comments/${commentId}`,
        { headers: jwtUtils.getAuthHeader() }
      );
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete comment';
    }
  }
};