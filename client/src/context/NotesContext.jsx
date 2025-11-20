import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const NotesContext = createContext();

export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }) => {
  const { user } = useAuth();

  // LOAD FROM LOCAL STORAGE (Offline Support)
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('offlineNotes');
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch notes on user login/startup
  useEffect(() => {
    if (user) fetchNotes();
  }, [user]);

  // --- EXPOSED FUNCTION: REFRESH DATA ---
  const fetchNotes = async () => {
    try {
      const { data } = await api.get('/notes');
      setNotes(data);
      localStorage.setItem('offlineNotes', JSON.stringify(data));
      return data;
    } catch (error) {
      console.log("Offline mode: Using cached notes.");
      return [];
    }
  };

  const addNote = async (newNoteData) => {
    try {
      const { data } = await api.post('/notes', {
        title: newNoteData.title,
        content: newNoteData.content, 
        subject: newNoteData.subject,
        objectives: newNoteData.objectives.map(obj => ({ 
          text: obj.text,
          isMastered: false 
        }))
      });
      
      const updatedNotes = [data, ...notes];
      setNotes(updatedNotes);
      localStorage.setItem('offlineNotes', JSON.stringify(updatedNotes));
      
    } catch (error) {
      alert("You are offline. Note cannot be saved.");
    }
  };

  const updateNote = async (id, updatedData) => {
    try {
      const sanitizedObjectives = updatedData.objectives.map(obj => {
        if (typeof obj._id === 'number') {
          return { text: obj.text, isMastered: obj.isMastered || false };
        }
        return obj;
      });

      // Optimistic Update
      const updatedList = notes.map(note => 
        note._id === id ? { ...note, ...updatedData, objectives: sanitizedObjectives } : note
      );
      
      setNotes(updatedList);
      localStorage.setItem('offlineNotes', JSON.stringify(updatedList));

      // Send to Server
      const { data } = await api.put(`/notes/${id}`, {
        title: updatedData.title,
        content: updatedData.content, 
        subject: updatedData.subject,
        objectives: sanitizedObjectives 
      });
      
      // Confirm with real data
      const finalList = notes.map(note => note._id === id ? data : note);
      setNotes(finalList);
      localStorage.setItem('offlineNotes', JSON.stringify(finalList));

    } catch (error) {
      console.error("Offline or Error updating note");
    }
  };

  const deleteNote = async (id) => {
    const filteredNotes = notes.filter(n => n._id !== id);
    setNotes(filteredNotes);
    localStorage.setItem('offlineNotes', JSON.stringify(filteredNotes));

    try {
      await api.delete(`/notes/${id}`);
    } catch (error) {
      console.error("Failed to delete note");
      fetchNotes(); // Revert on error
    }
  };

  const toggleMastery = async (noteId, objectiveId) => {
    const note = notes.find(n => n._id === noteId);
    if (!note) return;

    const updatedObjectives = note.objectives.map(obj => 
      obj._id === objectiveId ? { ...obj, isMastered: true } : obj
    );

    updateNote(noteId, { ...note, objectives: updatedObjectives });
  };

  const resetTopicProgress = async (topicName) => {
    const notesInTopic = notes.filter(n => n.subject === topicName);
    for (const note of notesInTopic) {
      const resetObjectives = note.objectives.map(obj => ({ ...obj, isMastered: false }));
      await updateNote(note._id, { ...note, objectives: resetObjectives });
    }
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote, toggleMastery, resetTopicProgress, fetchNotes }}>
      {children}
    </NotesContext.Provider>
  );
};