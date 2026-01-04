import React, { useState, useEffect } from 'react';
import { commentService } from '../services/commentService';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAuth } from '../context/AuthContext';
import ReplyBox from './ReplyBox';

/**
 * Comment box component with real-time updates
 * Displays comments and handles comment addition
 */
const CommentBox = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReplies, setShowReplies] = useState({});
  const { subscribe, connected } = useWebSocket();
  const { user } = useAuth();

  // Fetch comments on mount
  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Subscribe to real-time comment updates
  useEffect(() => {
    if (!connected) return;

    const unsubscribe = subscribe(`/topic/post/${postId}/comments`, (event) => {
      if (event.action === 'COMMENT_ADDED') {
        fetchComments();
      }
    });

    return unsubscribe;
  }, [postId, connected]);

  const fetchComments = async () => {
    try {
      const data = await commentService.getPostComments(postId);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || loading) return;

    setLoading(true);
    try {
      await commentService.addComment(postId, newComment);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-3">Comments ({comments.length})</h3>

      <form onSubmit={handleAddComment} className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Post
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm">{comment.user.username}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700 mt-1">{comment.content}</p>
                
                <button
                  onClick={() => toggleReplies(comment.id)}
                  className="text-sm text-primary-600 hover:text-primary-700 mt-2"
                >
                  {showReplies[comment.id] ? 'Hide' : 'Show'} Replies ({comment.repliesCount})
                </button>

                {showReplies[comment.id] && (
                  <ReplyBox commentId={comment.id} postId={postId} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentBox;