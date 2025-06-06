import React from 'react';
import { Search, Filter } from 'lucide-react';
import { FilterState, User, Project } from '../types';

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  users: User[];
  currentProject: Project | undefined;
}

export const Filters: React.FC<FiltersProps> = ({ 
  filters, 
  onFilterChange, 
  users, 
  currentProject 
}) => {
  const priorities = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const statuses = [
    { value: '', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  const userOptions = [
    { value: '', label: 'All Users' },
    ...users.map(user => ({ value: user.id, label: user.name })),
  ];

  const moduleOptions = [
    { value: '', label: 'All Modules' },
    ...(currentProject?.modules || []).map(module => ({ value: module, label: module })),
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
      <div className="flex items-center gap-2 text-lg text-gray-700 dark:text-gray-300 font-semibold">
        <Filter className="h-4 w-4" />
        Filters
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
          />
        </div>

        <select
          value={filters.priority}
          onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
        >
          {priorities.map(priority => (
            <option key={priority.value} value={priority.value}>
              {priority.label}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
        >
          {statuses.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        <select
          value={filters.module}
          onChange={(e) => onFilterChange({ ...filters, module: e.target.value })}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
        >
          {moduleOptions.map(module => (
            <option key={module.value} value={module.value}>
              {module.label}
            </option>
          ))}
        </select>

        <select
          value={filters.assignedTo}
          onChange={(e) => onFilterChange({ ...filters, assignedTo: e.target.value })}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
        >
          {userOptions.map(user => (
            <option key={user.value} value={user.value}>
              {user.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};