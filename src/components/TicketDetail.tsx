import React from 'react';
import { X, Edit, Trash2, Calendar, User, Tag, AlertCircle, Paperclip, Download, StickyNote } from 'lucide-react';
import { Ticket, User as UserType, Comment } from '../types';
import { Comments } from './Comments';

interface TicketDetailProps {
  ticket: Ticket;
  users: UserType[];
  currentUser: UserType;
  comments: Comment[];
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddComment: (content: string) => void;
}

export const TicketDetail: React.FC<TicketDetailProps> = ({
  ticket,
  users,
  currentUser,
  comments,
  onClose,
  onEdit,
  onDelete,
  onAddComment,
}) => {
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'in-progress': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const canEdit = currentUser.role === 'admin' || ticket.createdBy === currentUser.id;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadAttachment = (attachment: any) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Ticket #{ticket.id.slice(-8)}
            </h2>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
              {ticket.status.replace('-', ' ').charAt(0).toUpperCase() + ticket.status.replace('-', ' ').slice(1)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {canEdit && (
              <>
                <button
                  onClick={onEdit}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="Edit ticket"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={onDelete}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Delete ticket"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{ticket.title}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                {ticket.module}
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                Assigned to {getUserName(ticket.assignedTo)}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Created {formatDate(ticket.createdAt)}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              {ticket.description}
            </div>
          </div>

          {ticket.notes && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                <StickyNote className="h-4 w-4 mr-2 text-yellow-500" />
                Notes
              </h4>
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                {ticket.notes}
              </div>
            </div>
          )}

          {ticket.attachments && ticket.attachments.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Attachments</h4>
              <div className="space-y-2">
                {ticket.attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Paperclip className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">{attachment.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">({formatFileSize(attachment.size)})</span>
                    </div>
                    <button
                      onClick={() => downloadAttachment(attachment)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      title="Download attachment"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <Comments
              comments={comments}
              users={users}
              currentUser={currentUser}
              onAddComment={onAddComment}
            />
          </div>
        </div>
      </div>
    </div>
  );
};