import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { getUsers, saveUsers, generateId } from '../utils/storage';
import { PlusCircle, Trash2, Edit3, UserPlus, Users, ShieldCheck, ShieldOff } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    username: '',
    email: '',
    name: '',
    role: 'tester',
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const updatedUsers = users.map(u => u.id === editingUser.id ? editingUser : u);
      setUsers(updatedUsers);
      saveUsers(updatedUsers);
      setEditingUser(null);
    } else {
      const userToAdd: User = { ...newUser, id: generateId() };
      const updatedUsers = [...users, userToAdd];
      setUsers(updatedUsers);
      saveUsers(updatedUsers);
    }
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setNewUser({ username: '', email: '', name: '', role: 'tester' });
    setEditingUser(null);
  };

  const handleAddNewUser = () => {
    resetForm();
    setShowForm(true);
  };
  
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      saveUsers(updatedUsers);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
            <Users className="mr-3 h-8 w-8" /> User Management
          </h1>
          <button
            onClick={handleAddNewUser}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out flex items-center"
          >
            <UserPlus className="mr-2 h-5 w-5" /> Add New User
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-6">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input type="text" name="name" id="name" value={editingUser?.name || newUser.name} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <input type="text" name="username" id="username" value={editingUser?.username || newUser.username} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" name="email" id="email" value={editingUser?.email || newUser.email} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <select name="role" id="role" value={editingUser?.role || newUser.role} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                  <option value="tester">Tester</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800">
                  {editingUser ? 'Save Changes' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <li key={user.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 ease-in-out">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-md font-semibold text-blue-600 dark:text-blue-400 truncate">{user.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">@{user.username} - {user.email}</p>
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'}
                    `}>
                      {user.role === 'admin' ? <ShieldCheck className="inline mr-1 h-3 w-3"/> : <ShieldOff className="inline mr-1 h-3 w-3"/>} 
                      {user.role}
                    </span>
                    <button onClick={() => handleEditUser(user)} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700">
                      <Edit3 className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-100 dark:hover:bg-gray-700">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {users.length === 0 && (
            <p className="p-6 text-center text-gray-500 dark:text-gray-400">No users found. Add a new user to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
