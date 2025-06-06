import { useEffect } from 'react';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import Favicon from './components/Favicon';
import { useAuth } from './hooks/useAuth';
import { useTickets } from './hooks/useTickets';
import { useProjects } from './hooks/useProjects';
import { useTheme } from './hooks/useTheme';
import { initializeStorage, getUsers } from './utils/storage';

function App() {
  const { currentUser, login, logout, loading } = useAuth();
  const { tickets, addTicket, updateTicket, deleteTicket, addComment, getTicketComments } = useTickets();
  const { projects, currentProject, addProject, switchProject, updateProjectModules } = useProjects();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    initializeStorage();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        <Favicon />
        <Auth onLogin={login} theme={theme} onToggleTheme={toggleTheme} />
      </>
    );
  }

  const users = getUsers();
  const comments = tickets.flatMap(ticket => getTicketComments(ticket.id));

  return (
    <>
      <Favicon />
      <Dashboard
        tickets={tickets}
        users={users}
        currentUser={currentUser}
        currentProject={currentProject}
        projects={projects}
        comments={comments}
        theme={theme}
        onAddTicket={addTicket}
        onUpdateTicket={updateTicket}
        onDeleteTicket={deleteTicket}
        onAddComment={addComment}
          onProjectChange={switchProject}
        onAddProject={addProject}
        onUpdateProjectModules={updateProjectModules}
        onToggleTheme={toggleTheme}
        onLogout={logout}
      />
    </>
  );
}

export default App;