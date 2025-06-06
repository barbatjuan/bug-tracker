import { useState, useEffect } from 'react';
import { Ticket, Comment } from '../types';
import { getTickets, saveTickets, getComments, saveComments, generateId } from '../utils/storage';

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    setTickets(getTickets());
    setComments(getComments());
  }, []);

  const addTicket = (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTicket: Ticket = {
      ...ticket,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedTickets = [...tickets, newTicket];
    setTickets(updatedTickets);
    saveTickets(updatedTickets);
    return newTicket;
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    const updatedTickets = tickets.map(ticket =>
      ticket.id === id
        ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
        : ticket
    );
    setTickets(updatedTickets);
    saveTickets(updatedTickets);
  };

  const deleteTicket = (id: string) => {
    const updatedTickets = tickets.filter(ticket => ticket.id !== id);
    setTickets(updatedTickets);
    saveTickets(updatedTickets);
    
    // Also delete associated comments
    const updatedComments = comments.filter(comment => comment.ticketId !== id);
    setComments(updatedComments);
    saveComments(updatedComments);
  };

  const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    saveComments(updatedComments);
    return newComment;
  };

  const getTicketComments = (ticketId: string) => {
    return comments.filter(comment => comment.ticketId === ticketId);
  };

  return {
    tickets,
    comments,
    addTicket,
    updateTicket,
    deleteTicket,
    addComment,
    getTicketComments,
  };
};