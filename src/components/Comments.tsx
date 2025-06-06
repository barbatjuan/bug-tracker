import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { Comment, User } from '../types';

interface CommentsProps {
  comments: Comment[];
  users: User[];
  currentUser: User;
  onAddComment: (content: string) => void;
}

export const Comments: React.FC<CommentsProps> = ({
  comments,
  users,
  currentUser,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
        <MessageCircle className="h-4 w-4" />
        Comments ({comments.length})
      </div>

      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium text-gray-900 dark:text-white">
                {getUserName(comment.userId)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(comment.createdAt)}
              </div>
            </div>
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {comment.content}
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all transform hover:scale-[1.02]"
          >
            <Send className="h-4 w-4 mr-2" />
            Add Comment
          </button>
        </div>
      </form>
    </div>
  );
};