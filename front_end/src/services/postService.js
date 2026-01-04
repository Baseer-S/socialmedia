import axios from 'axios';
import { jwtUtils } from '../utils/jwtUtils';

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Post service for CRUD operations
 */
export const postService = {
  /**
   * Create a new post
   */
  createPost: async (postData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/posts`,
        postData,
        { headers: jwtUtils.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create post';
    }
  },

  /**
   * Get all posts (feed) with pagination
   */
  getAllPosts: async (page = 0, size = 10) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/posts?page=${page}&size=${size}`,
        { headers: jwtUtils.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch posts';
    }
  },

  /**
   * Get post by ID
   */
  getPostById: async (postId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/posts/${postId}`,
        { headers: jwtUtils.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch post';
    }
  },

  /**
   * Get posts by user
   */
  getUserPosts: async (userId, page = 0, size = 10) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/posts/user/${userId}?page=${page}&size=${size}`,
        { headers: jwtUtils.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user posts';
    }
  },

  /**
   * Update post
   */
  updatePost: async (postId, postData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/posts/${postId}`,
        postData,
        { headers: jwtUtils.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update post';
    }
  },

  /**
   * Delete post
   */
  deletePost: async (postId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/posts/${postId}`,
        { headers: jwtUtils.getAuthHeader() }
      );
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete post';
    }
  }
};