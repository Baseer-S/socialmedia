import React, { useState, useEffect } from 'react';
import { commentService } from '../services/commentService';
import { useWebSocket } from '../hooks/useWebSocket';

/**
 * Reply box component for nested comments
 * Handles reply addition and display
 */
const ReplyBox = ({ commentId, postId }) => {
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(false);
  const { subscribe, connected } = useWebSocket();

  // Fetch replies on mount
  useEffect(() => {
    fetchReplies();
  }, [commentId]);

  // Subscribe to real-time reply updates
  useEffect(() => {
    if (!connected) return;

    const unsubscribe = subscribe(`/topic/post/${postId}/comments`, (event) => {
      if (event.action === 'REPLY_ADDED' && event.parentCommentId === commentId) {
        fetchReplies();
      }
    });

    return unsubscribe;
  }, [commentId, postId, connected]);

  const fetchReplies = async () => {
    try {
      const data = await commentService.getCommentReplies(commentId);
      setReplies(data);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!newReply.trim() || loading) return;

    setLoading(true);
    try {
      await commentService.addReply(commentId, newReply);
      setNewReply('');
    } catch (error) {
      console.error('Error adding reply:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-8 mt-3 space-y-3">
      <form onSubmit={handleAddReply} className="flex space-x-2">
        <input
          type="text"
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          placeholder="Write a reply..."
          className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          disabled={loading || !newReply.trim()}
          className="px-4 py-1 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Reply
        </button>
      </form>

      <div className="space-y-2">
        {replies.map((reply) => (
          <div key={reply.id} className="bg-white p-3 rounded-md border border-gray-200">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-sm">{reply.user.username}</span>
              <span className="text-xs text-gray-500">
                {new Date(reply.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-700">{reply.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReplyBox;