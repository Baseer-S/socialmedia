import React, { useState, useEffect, useCallback } from 'react';
import { commentService } from '../services/commentService';
import { useWebSocket } from '../hooks/useWebSocket';
import ReplyBox from './ReplyBox';

/**
 * Comment box component with real-time updates
 */
const CommentBox = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showReplies, setShowReplies] = useState({});
  const { subscribe, connected } = useWebSocket();

  const fetchComments = useCallback(async () => {
    try {
      const data = await commentService.getPostComments(postId);
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setFetching(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    if (!connected) return;
    const unsubscribe = subscribe(`/topic/post/${postId}/comments`, (event) => {
      if (event.action === 'COMMENT_ADDED') {
        fetchComments();
      }
    });
    return unsubscribe;
  }, [postId, connected, fetchComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || loading) return;
    setLoading(true);
    try {
      await commentService.addComment(postId, newComment);
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
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
            {loading ? '...' : 'Post'}
          </button>
        </div>
      </form>

      {fetching ? (
        <div className="text-center py-4 text-gray-500">Loading comments...</div>
      ) : (
        <div className="space-y-4">
          {comments.length === 0 && (
            <p className="text-gray-400 text-sm">No comments yet. Be the first!</p>
          )}
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {comment.user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm">{comment.user?.username || 'Unknown'}</span>
                    <span className="text-xs text-gray-500">
                      {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1 text-sm">{comment.content}</p>

                  <button
                    onClick={() => toggleReplies(comment.id)}
                    className="text-sm text-primary-600 hover:text-primary-700 mt-2"
                  >
                    {showReplies[comment.id] ? 'Hide' : 'View'} Replies
                    {comment.repliesCount > 0 && ` (${comment.repliesCount})`}
                  </button>

                  {showReplies[comment.id] && (
                    <ReplyBox commentId={comment.id} postId={postId} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentBox;