import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  LogOut, 
  AlertCircle, 
  Moon, 
  Sun, 
  FileText,
  Settings,
  Users as UsersIcon, 
  LayoutDashboard, 
  ChevronRight, 
  ChevronDown,
  ListPlus
} from 'lucide-react';
import { Ticket, User as UserType, Project, Comment } from '../types';
import { TicketForm } from './TicketForm';
import { TicketDetail } from './TicketDetail';
import { ProjectSelector } from './ProjectSelector';
import { ProjectForm } from './ProjectForm';
import UserManagement from './UserManagement';
import { ModuleManagement } from './ModuleManagement';

type ViewType = 'dashboard' | 'userManagement' | 'moduleManagement';

const GENERAL_MODULE_KEY = "(Módulo General)";

const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'in-progress': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getUserName = (userId: string, users: UserType[]): string => {
  const user = users.find(u => u.id === userId);
  return user ? `${user.name} (${user.email})` : 'Unknown User';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};


interface DashboardProps {
  tickets: Ticket[];
  users: UserType[];
  currentUser: UserType;
  currentProject: Project | null;
  projects: Project[];
  comments: Comment[];
  theme: 'light' | 'dark';
  onAddTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTicket: (id: string, updates: Partial<Ticket>) => void;
  onDeleteTicket: (id: string) => void;
  onAddComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  onProjectChange: (projectId: string) => void;
  onAddProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  onUpdateProjectModules: (projectId: string, modules: string[]) => void;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  tickets,
  users,
  currentUser,
  currentProject,
  projects,
  comments,
  theme,
  onAddTicket,
  onUpdateTicket,
  onDeleteTicket,
  onAddComment,
  onProjectChange,
  onAddProject,
  onToggleTheme,
  onLogout,
  onUpdateProjectModules,
}) => {
  // State management
  const [filters] = useState({ priority: '', status: '', assignedTo: '', module: '', search: '' });
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  
  // Memoized derived state
  const projectTickets = useMemo(() => 
    tickets.filter(ticket => ticket.projectId === currentProject?.id),
    [tickets, currentProject]
  );

  const filteredTickets = useMemo(() => {
    return projectTickets.filter(ticket => {
      const matchesSearch = !filters.search || 
        ticket.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        (ticket.module || '').toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesPriority = !filters.priority || ticket.priority === filters.priority;
      const matchesStatus = !filters.status || ticket.status === filters.status;
      const matchesAssignedTo = !filters.assignedTo || ticket.assignedTo === filters.assignedTo;
      const matchesModule = !filters.module || ticket.module === filters.module;

      return matchesSearch && matchesPriority && matchesStatus && matchesAssignedTo && matchesModule;
    });
  }, [projectTickets, filters]);

  const groupedAndSortedTickets = useMemo(() => {
    const groups: Record<string, Ticket[]> = {};

    filteredTickets.forEach(ticket => {
      const moduleName = ticket.module?.trim() ? ticket.module.trim() : GENERAL_MODULE_KEY;
      if (!groups[moduleName]) {
        groups[moduleName] = [];
      }
      groups[moduleName].push(ticket);
    });

    const sortedModuleNames = Object.keys(groups).sort((a, b) => {
      if (a === GENERAL_MODULE_KEY) return 1;
      if (b === GENERAL_MODULE_KEY) return -1;
      return a.localeCompare(b);
    });

    return sortedModuleNames.map(moduleName => ({
      moduleName,
      tickets: groups[moduleName],
    }));
  }, [filteredTickets]);

  const toggleModuleExpansion = (moduleName: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleName]: !prev[moduleName]
    }));
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setShowTicketForm(true);
  };

  const handleDeleteTicket = (ticketId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este ticket?')) {
      onDeleteTicket(ticketId);
    }
  };

  const handleSubmitTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTicket) {
      onUpdateTicket(editingTicket.id, ticketData);
    } else {
      onAddTicket(ticketData);
    }
    setShowTicketForm(false);
    setEditingTicket(null);
  };

  const handleAddComment = (ticketId: string, content: string) => {
    onAddComment({
      ticketId,
      content,
      userId: currentUser.id,
      createdAt: new Date().toISOString()
    });
  };

  const canEditTicket = (ticket: Ticket) => {
    return currentUser.role === 'admin' || ticket.createdBy === currentUser.id;
  };

  const handleUpdateProjectModules = (projectId: string, modules: string[]) => {
    onUpdateProjectModules(projectId, modules);
  };
  
  const handleFormClose = () => {
    setShowTicketForm(false);
    setEditingTicket(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm py-3 px-4 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg transform transition-transform hover:scale-105">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                FactuPro
              </h1>
            </div>
            
            {currentView === 'dashboard' && currentProject && (
              <div className="hidden md:block">
                <ProjectSelector
                  projects={projects}
                  currentProject={currentProject}
                  currentUser={currentUser}
                  onProjectChange={onProjectChange}
                  onCreateProject={() => setShowProjectForm(true)}
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser.role === 'admin' && (
              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-xl">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    currentView === 'dashboard' 
                      ? 'bg-white dark:bg-gray-600 shadow-md text-blue-600 dark:text-blue-400' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-600/50'
                  }`}
                  title="Dashboard"
                >
                  <LayoutDashboard className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentView('userManagement')}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    currentView === 'userManagement'
                      ? 'bg-white dark:bg-gray-600 shadow-md text-blue-600 dark:text-blue-400' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-600/50'
                  }`}
                  title="User Management"
                >
                  <UsersIcon className="h-5 w-5" />
                </button>
                {currentProject && (
                  <button
                    onClick={() => setCurrentView('moduleManagement')}
                    className={`p-2 rounded-lg ${currentView === 'moduleManagement' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="Module Management"
                  >
                    <ListPlus className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}
            <button 
              onClick={onToggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-yellow-400" />}
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">{currentUser.name}</span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {currentView === 'dashboard' && (
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                  {currentProject ? currentProject.name : 'Selecciona un proyecto'}
                </h2>
                {currentProject && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {projectTickets.length} {projectTickets.length === 1 ? 'ticket' : 'tickets'} en total
                  </p>
                )}
              </div>
              
              <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
                {currentProject && (
                  <>
                    <button
                      onClick={() => setShowTicketForm(true)}
                      className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      <Plus className="-ml-1 mr-2 h-5 w-5" />
                      Nuevo Ticket
                    </button>
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => setCurrentView('moduleManagement')}
                        className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <Settings className="h-5 w-5 mr-2" />
                        Módulos
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            
            {filteredTickets.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tickets found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {currentProject ? `No tickets in '${currentProject.name}'.` : 'Select a project to see tickets.'} Try adjusting filters or create one!
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">Module</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden xl:table-cell">Created At</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {groupedAndSortedTickets.map(({ moduleName, tickets: moduleTickets }) => (
                        <React.Fragment key={moduleName}>
                          <tr 
                            className="bg-gray-50 dark:bg-gray-700/30 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50"
                            onClick={() => toggleModuleExpansion(moduleName)}
                          >
                            <td colSpan={6} className="px-6 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                {expandedModules[moduleName] ? (
                                  <ChevronDown className="h-5 w-5 mr-2 text-gray-500" />
                                ) : (
                                  <ChevronRight className="h-5 w-5 mr-2 text-gray-500" />
                                )}
                                <span className="font-medium text-gray-900 dark:text-white">{moduleName}</span>
                                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                                  {moduleTickets.length} {moduleTickets.length === 1 ? 'ticket' : 'tickets'}
                                </span>
                              </div>
                            </td>
                          </tr>
                          {expandedModules[moduleName] && moduleTickets.map((ticket) => (
                            <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{ticket.title}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{ticket.description}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                                {ticket.module || GENERAL_MODULE_KEY}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                  {ticket.priority}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                  {ticket.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden xl:table-cell">
                                {formatDate(ticket.createdAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTicket(ticket);
                                    }}
                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    title="View details"
                                  >
                                    <Eye className="h-5 w-5" />
                                  </button>
                                  {canEditTicket(ticket) && (
                                    <>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditTicket(ticket);
                                        }}
                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                        title="Edit ticket"
                                      >
                                        <Edit className="h-5 w-5" />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (window.confirm('Are you sure you want to delete this ticket?')) {
                                            onDeleteTicket(ticket.id);
                                          }
                                        }}
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                        title="Delete ticket"
                                      >
                                        <Trash2 className="h-5 w-5" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'userManagement' && (
          currentUser.role === 'admin' ? (
            <UserManagement />
          ) : (
            <div className="text-center py-10">
              <h2 className="text-xl font-semibold">Access Denied</h2>
              <p>You do not have permission to manage users.</p>
            </div>
          )
        )}

        {currentView === 'moduleManagement' && (
          currentUser.role === 'admin' && currentProject ? (
            <ModuleManagement
              project={currentProject}
              onUpdateModules={handleUpdateProjectModules}
            />
          ) : (
            <div className="text-center py-10">
              <h2 className="text-xl font-semibold">
                {!currentProject ? 'No Project Selected' : 'Access Denied'}
              </h2>
              <p>
                {!currentProject 
                  ? 'Please select a project to manage modules.' 
                  : 'You do not have permission to manage modules for this project.'
                }
              </p>
              <button 
                onClick={() => setCurrentView('dashboard')} 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Back to Dashboard
              </button>
            </div>
          )
        )}
      </main>

      {showTicketForm && currentProject && (
        <TicketForm
          onClose={() => setShowTicketForm(false)}
          onSubmit={handleSubmitTicket}
          users={users}
          currentProject={currentProject as Project} // Type assertion since we've checked for null
          currentUser={currentUser}
          initialData={editingTicket}
        />
      )}

      {selectedTicket && currentProject && (
        <TicketDetail
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          comments={comments.filter(c => c.ticketId === selectedTicket.id)}
          users={users}
          onAddComment={onAddComment}
          currentUser={currentUser}
          currentProject={currentProject}
        />
      )}

      {showProjectForm && (
        <ProjectForm
          onClose={() => setShowProjectForm(false)}
          onSubmit={onAddProject}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};