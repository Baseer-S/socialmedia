import axios from 'axios';
import { jwtUtils } from '../utils/jwtUtils';

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Comment service for comment and reply operations
 */
export const commentService = {
  /**
   * Add comment to post
   */
  addComment: async (postId, content) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/comments/post/${postId}`,
        { content },
        { headers: jwtUtils.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to add comment';
    }
  },

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
   * Add reply to comment
   */
  addReply: async (commentId, content) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/comments/${commentId}/replies`,
        { content },
        { headers: jwtUtils.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to add reply';
    }
  },

  /**
   * Get replies for a comment
   */
  getCommentReplies: async (commentId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/comments/${commentId}/replies`,
        { headers: jwtUtils.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch replies';
    }
  },

  /**
   * Delete comment
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
  },

  /**
   * Delete reply
   */
  deleteReply: async (replyId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/comments/replies/${replyId}`,
        { headers: jwtUtils.getAuthHeader() }
      );
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete reply';
    }
  }
};