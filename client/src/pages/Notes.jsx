import React, { useState } from 'react';
import MobileNav from '../components/Layout/MobileNav';
import BentoCard from '../components/UI/BentoCard';
// Removed: Sparkles, Loader2
import { Search, Plus, ArrowLeft, Target, Trash2, Save, X, FileText, Download } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { useNotes } from '../context/NotesContext'; 
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import html2pdf from 'html2pdf.js';
import api from '../api/axios';

// Helper to strip HTML for search & preview
const stripHtml = (html) => {
  if (!html) return "";
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const Notes = () => {
  const { notes, addNote, updateNote, deleteNote, fetchNotes } = useNotes();
  
  // VIEW STATE
  const [viewState, setViewState] = useState('list'); 
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  // SEARCH STATE
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Removed: [isGenerating, setIsGenerating]

  // FORM STATE
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('General');
  const [content, setContent] = useState(''); 
  const [objectives, setObjectives] = useState([]);
  const [newObjectiveInput, setNewObjectiveInput] = useState('');

  // --- EDITOR CONFIG ---
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }], 
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  };
  const formats = ['header', 'bold', 'italic', 'underline', 'list', 'bullet'];

  // --- FILTERING LOGIC ---
  const filteredNotes = notes.filter(note => {
    const query = searchQuery.toLowerCase();
    const plainContent = stripHtml(note.content).toLowerCase();
    
    return (
      note.title.toLowerCase().includes(query) ||
      note.subject.toLowerCase().includes(query) ||
      plainContent.includes(query)
    );
  });

  // --- HANDLERS ---
  const handleNoteSelect = (note) => {
    setSelectedNoteId(note._id);
    setTitle(note.title);
    setSubject(note.subject);
    setContent(note.content || ''); 
    setObjectives(note.objectives ? note.objectives : []); 
    setViewState('edit');
  };

  const handleCreateClick = () => {
    setSelectedNoteId(null);
    setTitle('');
    setSubject('General');
    setContent('');
    setObjectives([]);
    setViewState('create');
  };

  const handleSave = () => {
    if (!title) return;
    const plainTextPreview = stripHtml(content).substring(0, 100) + "...";

    const noteData = {
      title,
      subject,
      preview: plainTextPreview,
      content: content, 
      objectives: objectives,
    };

    if (viewState === 'create') {
      addNote(noteData);
    } else if (viewState === 'edit') {
      updateNote(selectedNoteId, noteData);
    }
    setViewState('list');
  };

  const handleDelete = (e, id) => {
    e.stopPropagation(); 
    if (confirm("Are you sure you want to delete this note?")) {
        deleteNote(id);
        if (viewState === 'edit') setViewState('list');
    }
  };

  const handleAddObjective = (e) => {
    if (e.key === 'Enter' && newObjectiveInput.trim()) {
      e.preventDefault();
      setObjectives([...objectives, { text: newObjectiveInput, isMastered: false, _id: Date.now() }]);
      setNewObjectiveInput('');
    }
  };

  const removeObjective = (index) => {
    const newObjs = [...objectives];
    newObjs.splice(index, 1);
    setObjectives(newObjs);
  };
  
  // REMOVED: handleGenerateQuiz function

  // --- PDF EXPORT LOGIC (No Change) ---
  const handleExport = () => {
    if (viewState !== 'edit' || !selectedNoteId) return;

    const noteTitle = title || "Untitled Note";
    const subjectTitle = subject || "General";
    
    const printContainer = document.createElement('div');
    printContainer.style.padding = '30px';
    printContainer.style.fontFamily = 'Inter, Arial, sans-serif'; 

    let htmlContent = '';
    
    htmlContent += `<h1 style="font-size: 28px; font-weight: bold; color: #F97316; margin-bottom: 5px; font-family: Arial, sans-serif;">${noteTitle}</h1>`;
    htmlContent += `<p style="font-size: 14px; color: #334155; margin-bottom: 25px; font-weight: 500;">Subject: ${subjectTitle} | Date: ${new Date().toLocaleDateString()}</p>`;

    if (objectives.length > 0) {
        htmlContent += `<h2 style="font-size: 18px; font-weight: bold; color: #3B82F6; margin-top: 30px; margin-bottom: 10px;">Flashcard Objectives</h2>`;
        htmlContent += `<ul style="padding-left: 25px; margin-bottom: 25px; list-style-type: disc; color: #334155;">`;
        objectives.forEach(obj => {
            htmlContent += `<li style="margin-bottom: 8px;">${obj.text}</li>`;
        });
        htmlContent += `</ul>`;
    }

    htmlContent += `<h2 style="font-size: 18px; font-weight: bold; color: #0F172A; margin-top: 30px; margin-bottom: 15px;">Notes</h2>`;
    htmlContent += `<div style="line-height: 1.6; color: #334155;">${content}</div>`;
    
    printContainer.innerHTML = htmlContent;

    const options = {
      margin: 0.5,
      filename: `${noteTitle.replace(/\s/g, '_')}_StudyNote.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(printContainer).set(options).save();
  };
  
  // --- RENDERING ---
  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg transition-colors duration-300 pb-24 p-4 md:p-8 relative">
      
      <AnimatePresence mode='wait'>
        {/* VIEW 1: LIST */}
        {viewState === 'list' && (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto"
          >
            {/* HEADER */}
            <header className="mb-6 h-12 flex items-center justify-between relative">
              {!showSearch ? (
                <motion.h1 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                  className="text-3xl font-bold text-primary dark:text-dark-text absolute left-0"
                >
                  My Notes
                </motion.h1>
              ) : (
                <motion.input 
                  initial={{ width: '0%', opacity: 0 }}
                  animate={{ width: '100%', opacity: 1 }}
                  autoFocus
                  placeholder="Search notes..."
                  className="h-12 w-full bg-white dark:bg-dark-surface rounded-xl px-4 shadow-sm border border-warm-orange outline-none text-lg text-primary dark:text-dark-text placeholder-gray-300 absolute left-0 z-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              )}

              <button 
                onClick={() => {
                  if (showSearch) setSearchQuery(''); 
                  setShowSearch(!showSearch);
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm border transition-all z-20 absolute right-0 ${
                  showSearch 
                    ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-secondary dark:text-dark-subtext' 
                    : 'bg-white dark:bg-dark-surface border-gray-100 dark:border-dark-border text-gray-400 hover:text-warm-orange'
                }`}
              >
                {showSearch ? <X size={20} /> : <Search size={20} />}
              </button>
            </header>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Create Button */}
              {!showSearch && (
                <motion.div 
                  onClick={handleCreateClick}
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-200 dark:bg-dark-surface border-2 border-dashed border-gray-300 dark:border-dark-border rounded-2xl flex flex-col items-center justify-center h-48 cursor-pointer hover:border-warm-orange dark:hover:border-warm-orange hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                >
                  <div className="p-3 bg-white dark:bg-dark-bg rounded-full shadow-sm mb-2">
                    <Plus size={24} className="text-warm-orange" />
                  </div>
                  <span className="font-medium text-secondary dark:text-dark-subtext">Create Note</span>
                </motion.div>
              )}

              {/* EMPTY STATE */}
              {filteredNotes.length === 0 && !showSearch && (
                  <div className="col-span-1 md:col-span-2 py-12 flex flex-col items-center justify-center text-center opacity-50">
                      <FileText size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-secondary dark:text-dark-subtext">Start writing your first note!</p>
                  </div>
              )}

              {/* NOTE CARDS */}
              {filteredNotes.map((note, index) => {
                const colorTheme = NOTE_COLORS[index % NOTE_COLORS.length];

                return (
                  <BentoCard 
                    key={note._id} 
                    onClick={() => handleNoteSelect(note)}
                    className={`h-48 flex flex-col justify-between relative group ${colorTheme}`}
                  >
                    {/* Delete Button */}
                    <button 
                      onClick={(e) => handleDelete(e, note._id)}
                      className="absolute top-4 right-4 p-2 text-black/30 hover:text-red-500 hover:bg-white/50 rounded-full transition-all z-10"
                      title="Delete Note"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="flex flex-col h-full">
                      {/* Header Info */}
                      <div className="flex justify-between items-start mb-2 px-1">
                        <span className="text-xs font-bold uppercase tracking-wider opacity-70">{note.subject}</span>
                        <span className="text-xs font-bold opacity-50">{new Date(note.updatedAt).toLocaleDateString()}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold leading-tight mb-3 px-1">{note.title}</h3>
                      
                      {/* CLEAR CONTENT BOX */}
                      <div className="bg-white/80 dark:bg-black/20 backdrop-blur-sm p-3 rounded-xl flex-1 border border-white/40 dark:border-white/5 overflow-hidden">
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 font-medium">
                            {stripHtml(note.content) || "No content preview"}
                        </p>
                      </div>
                    </div>
                  </BentoCard>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* VIEW 2: EDITOR */}
        {(viewState === 'create' || viewState === 'edit') && (
          <motion.div 
            key="editor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="max-w-3xl mx-auto bg-white dark:bg-dark-surface min-h-[85vh] rounded-3xl shadow-xl overflow-hidden flex flex-col border border-gray-100 dark:border-dark-border"
          >
            {/* TOOLBAR */}
            <div className="p-4 border-b border-gray-100 dark:border-dark-border flex items-center justify-between sticky top-0 bg-white dark:bg-dark-surface z-50">
              <button 
                onClick={() => setViewState('list')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-full transition-colors text-primary dark:text-dark-text"
              >
                <ArrowLeft size={24} />
              </button>
              
              <div className="flex gap-2">
                  {/* PDF Export Button */}
                  {viewState === 'edit' && (
                    <button 
                        onClick={handleExport}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-full transition-colors"
                        title="Export to PDF"
                    >
                        <Download size={20} />
                    </button>
                  )}
                  
                  {/* Delete Button */}
                  {viewState === 'edit' && (
                    <button 
                        onClick={(e) => handleDelete(e, selectedNoteId)}
                        className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                        title="Delete Note"
                    >
                        <Trash2 size={20} />
                    </button>
                  )}
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-primary dark:bg-white text-white dark:text-primary rounded-full text-sm font-medium shadow-lg hover:scale-105 transition-transform"
                  >
                    <Save size={16} /> Save
                  </button>
              </div>
            </div>

            <div className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto">
              <div className="flex gap-4 mb-4">
                  <input 
                    placeholder="Subject..."
                    className="text-sm font-bold text-warm-orange uppercase tracking-wider outline-none bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-lg w-1/2"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
              </div>

              <input 
                className="text-3xl md:text-4xl font-bold text-primary dark:text-dark-text placeholder-gray-300 dark:placeholder-gray-600 outline-none w-full bg-transparent mb-6" 
                placeholder="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* FLASHCARD OBJECTIVES BOX (AI Button Removed) */}
              <div className="mb-6 p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center justify-between mb-4 text-blue-800 dark:text-blue-400">
                    <div className="flex items-center gap-2">
                        <Target size={18} />
                        <span className="font-bold text-sm uppercase">Flashcard Objectives</span>
                    </div>
                </div>

                <ul className="space-y-3 mb-4 list-disc pl-4">
                  {objectives.map((obj, i) => (
                    <li key={i} className="text-sm text-blue-900 dark:text-blue-200 group flex justify-between items-start pl-1">
                      <span className="leading-relaxed">{obj.text}</span>
                      <button onClick={() => removeObjective(i)} className="ml-2 p-1 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-all">
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
                <input 
                  className="w-full bg-white dark:bg-dark-bg p-3 rounded-lg text-sm border border-blue-200 dark:border-blue-800 outline-none focus:border-blue-400 text-primary dark:text-dark-text transition-all shadow-sm"
                  placeholder="Type an objective and hit Enter..."
                  value={newObjectiveInput}
                  onChange={(e) => setNewObjectiveInput(e.target.value)}
                  onKeyDown={handleAddObjective}
                />
              </div>

              <div className="flex-1 h-full pb-10 dark:text-dark-text">
                <ReactQuill 
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  className="h-full"
                  placeholder="Start typing your notes here..."
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <MobileNav />
    </div>
  );
};

// --- COLOR PALETTE (Required for list view) ---
const NOTE_COLORS = [
  "bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-100",
  "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100",
  "bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100",
  "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100",
  "bg-pink-100 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800 text-pink-900 dark:text-pink-100",
  "bg-teal-100 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-100",
];

export default Notes;