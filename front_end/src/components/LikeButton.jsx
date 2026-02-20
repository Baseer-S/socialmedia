import React, { useState, useEffect } from 'react';
import { likeService } from '../services/likeService';
import { useWebSocket } from '../hooks/useWebSocket';

/**
 * Like button component with real-time updates
 */
const LikeButton = ({ postId, initialLikesCount, initialLiked }) => {
  const [likesCount, setLikesCount] = useState(initialLikesCount || 0);
  const [liked, setLiked] = useState(initialLiked || false);
  const [loading, setLoading] = useState(false);
  const { subscribe, connected } = useWebSocket();

  // Fetch actual like status on mount
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const status = await likeService.getLikeStatus(postId);
        setLiked(status);
      } catch (err) {
        // silently fail, use initial value
      }
    };
    fetchLikeStatus();
  }, [postId]);

  useEffect(() => {
    if (!connected) return;
    const unsubscribe = subscribe(`/topic/post/${postId}/likes`, (event) => {
      setLikesCount(event.likesCount);
    });
    return unsubscribe;
  }, [postId, connected]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    // Optimistic update
    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!liked);
    setLikesCount(liked ? Math.max(0, likesCount - 1) : likesCount + 1);
    try {
      const response = await likeService.toggleLike(postId);
      setLiked(response.liked);
    } catch (error) {
      // Revert on error
      setLiked(prevLiked);
      setLikesCount(prevCount);
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition ${
        liked
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
      } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      <svg
        className="w-5 h-5"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="font-medium">{likesCount}</span>
    </button>
  );
};

export default LikeButton;