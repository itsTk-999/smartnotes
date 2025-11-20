import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotesContext = createContext();

export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }) => {
  const { user } = useAuth();
  const BASE_URL = "https://smart-notes-kz6i.onrender.com/api/notes";

  // Helper to get headers with Token
  const getHeaders = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return {
      'Content-Type': 'application/json',
      'Authorization': userInfo ? `Bearer ${userInfo.token}` : ''
    };
  };

  // Load offline notes first
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('offlineNotes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) fetchNotes();
  }, [user]);

  // --- DIRECT FETCH: GET NOTES ---
  const fetchNotes = async () => {
    try {
      const response = await fetch(BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setNotes(data);
      localStorage.setItem('offlineNotes', JSON.stringify(data));
      return data;
    } catch (error) {
      console.log("Offline mode or Server Error: Using cached notes.");
      return [];
    }
  };

  // --- DIRECT FETCH: ADD NOTE ---
  const addNote = async (newNoteData) => {
    try {
      const payload = {
        title: newNoteData.title,
        content: newNoteData.content, 
        subject: newNoteData.subject,
        objectives: newNoteData.objectives.map(obj => ({ 
          text: obj.text,
          isMastered: false 
        }))
      };

      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to save');
      const data = await response.json();
      
      const updatedNotes = [data, ...notes];
      setNotes(updatedNotes);
      localStorage.setItem('offlineNotes', JSON.stringify(updatedNotes));
      
    } catch (error) {
      alert("Could not save note to server. Check connection.");
    }
  };

  // --- DIRECT FETCH: UPDATE NOTE ---
  const updateNote = async (id, updatedData) => {
    try {
      const sanitizedObjectives = updatedData.objectives.map(obj => {
        if (typeof obj._id === 'number') {
          return { text: obj.text, isMastered: obj.isMastered || false };
        }
        return obj;
      });

      const payload = {
        title: updatedData.title,
        content: updatedData.content, 
        subject: updatedData.subject,
        objectives: sanitizedObjectives 
      };

      // Optimistic Update
      const updatedList = notes.map(note => 
        note._id === id ? { ...note, ...updatedData, objectives: sanitizedObjectives } : note
      );
      setNotes(updatedList);
      localStorage.setItem('offlineNotes', JSON.stringify(updatedList));

      // Send to Server
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Update failed');
      const data = await response.json();
      
      const finalList = notes.map(note => note._id === id ? data : note);
      setNotes(finalList);
      localStorage.setItem('offlineNotes', JSON.stringify(finalList));

    } catch (error) {
      console.error("Error updating note on server");
    }
  };

  // --- DIRECT FETCH: DELETE NOTE ---
  const deleteNote = async (id) => {
    const filteredNotes = notes.filter(n => n._id !== id);
    setNotes(filteredNotes);
    localStorage.setItem('offlineNotes', JSON.stringify(filteredNotes));

    try {
      await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
    } catch (error) {
      console.error("Failed to delete note on server");
    }
  };

  // --- HELPERS (No API calls needed) ---
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