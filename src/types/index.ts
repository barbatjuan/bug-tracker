export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'tester';
  name: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  modules: string[];
  createdAt: string;
  createdBy: string;
}

export interface Ticket {
  id: string;
  projectId: string;
  title: string;
  module: string;
  description: string;
  notes: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  attachments: Attachment[];
}

export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface FilterState {
  priority: string;
  status: string;
  assignedTo: string;
  module: string;
  search: string;
}