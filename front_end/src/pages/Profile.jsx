import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { postService } from '../services/postService';
import axios from 'axios';
import { jwtUtils } from '../utils/jwtUtils';
import PostCard from '../components/PostCard';
import Navbar from '../components/Navbar';

/**
 * Profile page component
 * Displays user information and their posts
 */
const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      // Fetch user info
      const userResponse = await axios.get(
        `http://localhost:8080/api/users/${userId}`,
        { headers: jwtUtils.getAuthHeader() }
      );
      setUser(userResponse.data);

      // Fetch user posts
      const postsData = await postService.getUserPosts(userId, 0, 20);
      setPosts(postsData.content || []);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await postService.deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      setError('Failed to delete post');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-3xl mx-auto py-8 px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error || 'User not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.username?.charAt(0)?.toUpperCase() || "?"}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.fullName || "Unnamed User"}
              </h1>
              <p className="text-gray-600 mb-2">@{user.username}</p>

              {user.bio && (
                <p className="text-gray-700 mt-4">{user.bio}</p>
              )}

              <div className="flex space-x-6 mt-6 text-sm text-gray-600">
                <div>
                  <span className="font-semibold text-gray-900">{posts.length}</span> Posts
                </div>
                <div>
                  Joined{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-gray-900">Posts</h2>

        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">No posts yet</p>
          </div>
        ) : (
          <div>
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;