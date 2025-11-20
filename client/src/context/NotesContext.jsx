import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotesContext = createContext();

export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }) => {
  const { user } = useAuth();
  
  // DIRECT URL (Double check this is your correct Render link)
  const BASE_URL = "https://smart-notes-kz6i.onrender.com/api/notes";

  const getHeaders = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return {
      'Content-Type': 'application/json',
      'Authorization': userInfo ? `Bearer ${userInfo.token}` : ''
    };
  };

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('offlineNotes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) fetchNotes();
  }, [user]);

  // --- FETCH ---
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
      console.log("Sync Error: Using local backup.");
      return [];
    }
  };

  // --- ADD ---
  const addNote = async (newNoteData) => {
    // 1. Optimistic Add (Show it immediately)
    // We generate a temp ID so React can render it
    const tempNote = { ...newNoteData, _id: Date.now() };
    const previousNotes = [...notes]; // Backup in case of error
    
    const updatedNotes = [tempNote, ...notes];
    setNotes(updatedNotes);
    
    try {
      const payload = {
        title: newNoteData.title,
        content: newNoteData.content, 
        subject: newNoteData.subject,
        objectives: newNoteData.objectives.map(obj => ({ text: obj.text, isMastered: false }))
      };

      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to save to DB');
      
      // 2. Server Success: Replace Temp ID with Real ID
      const data = await response.json();
      const finalNotes = [data, ...notes];
      setNotes(finalNotes);
      localStorage.setItem('offlineNotes', JSON.stringify(finalNotes));
      
    } catch (error) {
      alert("Error: Could not save note to server.");
      setNotes(previousNotes); // Revert change
    }
  };

  // --- UPDATE ---
  const updateNote = async (id, updatedData) => {
    const previousNotes = [...notes]; // Backup

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

    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({
                title: updatedData.title,
                content: updatedData.content, 
                subject: updatedData.subject,
                objectives: sanitizedObjectives 
            })
        });

        if (!response.ok) throw new Error('Update failed');
        
        // Sync with server response
        const data = await response.json();
        const finalList = notes.map(note => note._id === id ? data : note);
        setNotes(finalList);
        localStorage.setItem('offlineNotes', JSON.stringify(finalList));

    } catch (error) {
        console.error("Update failed:", error);
        // We don't alert on update to allow typing speed, but we log it
    }
  };

  // --- DELETE (The Fix) ---
  const deleteNote = async (id) => {
    const previousNotes = [...notes]; // Backup
    
    // 1. Optimistic Delete
    const filteredNotes = notes.filter(n => n._id !== id);
    setNotes(filteredNotes);
    localStorage.setItem('offlineNotes', JSON.stringify(filteredNotes));

    try {
      // 2. Send Delete to Server
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) throw new Error('Delete failed');

    } catch (error) {
      alert("Error: Could not delete note from server. It will reappear.");
      setNotes(previousNotes); // Put it back if server failed
      localStorage.setItem('offlineNotes', JSON.stringify(previousNotes));
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