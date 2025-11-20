import React, { useState } from 'react';
import MobileNav from '../components/Layout/MobileNav';
import { Search, Plus, FileText, Youtube, Link as LinkIcon, Book, Trash2, ExternalLink, Edit2, X, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Library = () => {
  // 1. Load Resources
  const [resources, setResources] = useState(() => {
    const saved = localStorage.getItem('libraryResources');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Form State
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newSubject, setNewSubject] = useState('General');
  const [searchQuery, setSearchQuery] = useState('');

  // --- UNIQUE STYLING LOGIC ---
  const getResourceStyle = (url) => {
    const lower = url.toLowerCase();
    if (lower.includes('youtube') || lower.includes('youtu.be')) {
      return { 
        type: 'Video',
        icon: Youtube, 
        // Red Gradient Theme
        accent: 'bg-red-500',
        light: 'bg-red-50 text-red-600 border-red-100',
        dark: 'dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50',
        glow: 'group-hover:shadow-red-500/20' 
      };
    }
    if (lower.includes('.pdf') || lower.includes('drive')) {
      return { 
        type: 'Document',
        icon: FileText, 
        // Blue Gradient Theme
        accent: 'bg-blue-500',
        light: 'bg-blue-50 text-blue-600 border-blue-100',
        dark: 'dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50',
        glow: 'group-hover:shadow-blue-500/20'
      };
    }
    return { 
      type: 'Link',
      icon: LinkIcon, 
      // Emerald Gradient Theme
      accent: 'bg-emerald-500',
      light: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      dark: 'dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50',
      glow: 'group-hover:shadow-emerald-500/20'
    };
  };

  // --- CRUD ACTIONS ---
  const handleSave = (e) => {
    e.preventDefault();
    if (!newTitle || !newLink) return;

    if (editingId) {
      const updatedList = resources.map(res => 
        res.id === editingId ? { ...res, title: newTitle, link: newLink, subject: newSubject } : res
      );
      setResources(updatedList);
      localStorage.setItem('libraryResources', JSON.stringify(updatedList));
    } else {
      const newItem = {
        id: Date.now(),
        title: newTitle,
        link: newLink,
        subject: newSubject,
        date: new Date().toLocaleDateString()
      };
      const updatedList = [newItem, ...resources];
      setResources(updatedList);
      localStorage.setItem('libraryResources', JSON.stringify(updatedList));
    }
    resetForm();
  };

  const deleteResource = (id) => {
    if(window.confirm("Delete this resource?")) {
      const updatedList = resources.filter(r => r.id !== id);
      setResources(updatedList);
      localStorage.setItem('libraryResources', JSON.stringify(updatedList));
      if (editingId === id) resetForm();
    }
  };

  const startEditing = (res) => {
    setEditingId(res.id);
    setNewTitle(res.title);
    setNewLink(res.link);
    setNewSubject(res.subject);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setNewTitle('');
    setNewLink('');
    setNewSubject('General');
    setEditingId(null);
    setIsAdding(false);
  };

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Animation Variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg transition-colors duration-300 pb-32 p-4 md:p-8 relative">
      
      {/* HEADER */}
      <header className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-primary dark:text-dark-text tracking-tight">Vault</h1>
          <p className="text-secondary dark:text-dark-subtext font-medium">Organize your knowledge base.</p>
        </div>
        
        <button 
          onClick={() => { isAdding ? resetForm() : setIsAdding(true); }}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
            isAdding 
              ? 'bg-gray-200 dark:bg-dark-surface text-primary dark:text-white rotate-45' 
              : 'bg-primary dark:bg-white text-white dark:text-primary hover:scale-105'
          }`}
        >
          <Plus size={28} />
        </button>
      </header>

      {/* ADD / EDIT FORM */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="max-w-4xl mx-auto mb-8 overflow-hidden"
          >
            <form onSubmit={handleSave} className={`p-6 rounded-3xl shadow-xl border-2 transition-colors relative overflow-hidden ${
              editingId 
                ? 'bg-orange-50 dark:bg-orange-900/10 border-warm-orange' 
                : 'bg-white dark:bg-dark-surface border-gray-100 dark:border-dark-border'
            }`}>
              
              {/* Edit Indicator Badge */}
              {editingId && (
                <div className="absolute top-0 right-0 bg-warm-orange text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                  EDITING MODE
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input 
                  placeholder="Resource Title" 
                  className="p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl outline-none focus:ring-2 ring-warm-orange/20 border border-transparent focus:border-warm-orange text-primary dark:text-dark-text placeholder-gray-400 font-bold transition-all"
                  value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  autoFocus
                />
                <input 
                  placeholder="Subject (e.g. Physics)" 
                  className="p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl outline-none focus:ring-2 ring-warm-orange/20 border border-transparent focus:border-warm-orange text-primary dark:text-dark-text placeholder-gray-400 font-medium transition-all"
                  value={newSubject} onChange={e => setNewSubject(e.target.value)}
                />
              </div>
              <input 
                placeholder="Paste Link (https://...)" 
                className="w-full p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl outline-none focus:ring-2 ring-warm-orange/20 border border-transparent focus:border-warm-orange text-primary dark:text-dark-text placeholder-gray-400 font-medium mb-6 transition-all"
                value={newLink} onChange={e => setNewLink(e.target.value)}
              />
              
              <div className="flex gap-3">
                {editingId && (
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="px-8 py-4 bg-gray-100 dark:bg-dark-bg text-gray-600 dark:text-gray-400 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button className="flex-1 py-4 bg-primary dark:bg-white text-white dark:text-primary rounded-2xl font-bold hover:scale-[1.01] transition-transform shadow-lg flex items-center justify-center gap-2">
                  {editingId ? 'Update Resource' : 'Save to Vault'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH BAR */}
      <div className="max-w-4xl mx-auto mb-8 relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-warm-orange transition-colors">
          <Search size={20} />
        </div>
        <input 
          placeholder="Search your vault..." 
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border outline-none focus:ring-2 ring-warm-orange/20 text-primary dark:text-dark-text placeholder-gray-400 font-medium transition-all"
          value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* UNIQUE STAGGERED GRID */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {filteredResources.length > 0 ? (
          filteredResources.map((res) => {
            const style = getResourceStyle(res.link);
            
            return (
              <motion.div 
                variants={item}
                key={res.id} 
                className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border shadow-sm hover:shadow-xl transition-all duration-300 ${editingId === res.id ? 'ring-2 ring-warm-orange opacity-50' : ''}`}
              >
                {/* Color Strip Indicator (Left Side) */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.accent}`} />

                <div className="p-5 pl-7 flex flex-col h-full justify-between">
                  
                  {/* Top Row: Icon & Title */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4 items-center">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${style.light} ${style.dark} transition-colors`}>
                        <style.icon size={22} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="font-bold text-primary dark:text-dark-text text-lg line-clamp-1">{res.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500">{res.subject}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${style.light} ${style.dark} border-none bg-opacity-50`}>
                            {style.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons (Opacity Transition) */}
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        onClick={() => startEditing(res)}
                        className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteResource(res.id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Row: Link */}
                  <a 
                    href={res.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-dark-bg rounded-xl text-xs font-bold text-secondary dark:text-dark-subtext group-hover:bg-primary group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-primary transition-colors duration-300"
                  >
                    <span>OPEN RESOURCE</span>
                    <ExternalLink size={14} />
                  </a>

                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-40">
            <Layers size={64} className="text-gray-300 dark:text-gray-700 mb-4" />
            <p className="text-primary dark:text-dark-text font-medium text-lg">The Vault is empty.</p>
            <p className="text-secondary dark:text-dark-subtext">Add your first link to get started.</p>
          </div>
        )}
      </motion.div>

      <MobileNav />
    </div>
  );
};

export default Library;