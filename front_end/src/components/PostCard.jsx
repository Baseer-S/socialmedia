import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LikeButton from './LikeButton';
import CommentBox from './CommentBox';

/**
 * Post card component
 * Displays a single post with actions (like, comment, delete)
 */
const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);

  if (!post || !post.id) return null;

  const isOwner = user?.id === post.user?.id;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.user?.id}`}>
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:opacity-80 transition">
              {post.user?.username ? post.user.username.charAt(0).toUpperCase() : 'U'}
            </div>
          </Link>
          <div>
            <Link to={`/profile/${post.user?.id}`}>
              <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition">
                {post.user?.username || 'Unknown'}
              </h3>
            </Link>
            <p className="text-sm text-gray-500">
              {post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Just now'}
            </p>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition"
            title="Delete post"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content || ''}</p>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Post"
            className="mt-3 rounded-lg max-w-full h-auto"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
        <LikeButton
          postId={post.id}
          initialLikesCount={post.likesCount || 0}
          initialLiked={post.likedByCurrentUser || false}
        />

        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-medium">{post.commentsCount || 0}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && <CommentBox postId={post.id} />}
    </div>
  );
};

export default PostCard;